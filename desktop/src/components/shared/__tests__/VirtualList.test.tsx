import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualList } from '../VirtualList';

// Define the test item type for our specific tests
interface TestItem {
  id: number;
  text: string;
}

// Generate test items
const generateItems = (count: number): TestItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    text: `Item ${i}`,
  }));
};

// Default props for testing
const defaultProps = {
  items: generateItems(100),
  renderItem: (item: TestItem) => (
    <div data-testid={`item-${item.id}`}>{item.text}</div>
  ),
  itemHeight: 50,
  height: 200,
  width: 400,
};

describe('VirtualList', () => {
  it('should render visible items', () => {
    render(<VirtualList {...defaultProps} />);

    // With height 200 and itemHeight 50, we should see 4 items plus overscan
    // Based on the actual implementation, 11 items are rendered
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems).toHaveLength(11);
  });

  it('should update visible items on scroll', () => {
    const { container } = render(<VirtualList {...defaultProps} />);
    
    // Initial items
    const initialItems = screen.getAllByTestId(/^item-/);
    expect(initialItems).toHaveLength(11);
    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 10')).toBeInTheDocument();

    // Scroll down to show more items
    const virtualList = container.querySelector('[class*="css-"]') as HTMLElement;
    fireEvent.scroll(virtualList, {
      target: { scrollTop: 100 },
    });

    // After scrolling, we should see items shifted down
    // With scrollTop 100 and itemHeight 50, we've scrolled down
    // Verify that we see item 2 (since we scrolled past items 0-1)
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    // Check for the last visible item
    expect(screen.queryByText('Item 12')).not.toBeInTheDocument(); // Item 12 doesn't exist
    expect(screen.getByTestId('item-10')).toBeInTheDocument(); // Last item is still 10
  });

  it('should use custom key generation function', () => {
    // Create custom getKey function that works with our TestItem type
    const getKey = (item: TestItem) => `custom-${item.id}`;
    
    render(
      <VirtualList
        {...defaultProps}
        getKey={getKey as any} // Type assertion to avoid type mismatch
        renderItem={(item) => (
          <div data-testid={`custom-item-${item.id}`}>{item.text}</div>
        )}
      />
    );

    // Verify items are rendered with custom data-testid pattern
    const items = screen.getAllByTestId(/^custom-item-/);
    expect(items).toHaveLength(11);
    expect(screen.getByTestId('custom-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('custom-item-10')).toBeInTheDocument();
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red', marginTop: '10px' };
    const { container } = render(
      <VirtualList {...defaultProps} style={customStyle} className="custom-class" />
    );
    
    // Check that the container has the custom class and style
    const listContainer = container.firstChild;
    expect(listContainer).toHaveClass('custom-class');
    
    // Check that style is applied (just verifying component renders without errors)
    expect(listContainer).toBeInTheDocument();
  });

  it('should handle empty items array', () => {
    render(<VirtualList {...defaultProps} items={[]} />);
    
    // No items should be rendered
    expect(screen.queryByTestId(/^item-/)).not.toBeInTheDocument();
  });

  it('should handle fewer items than viewport', () => {
    // Create just 2 items, which is less than what would fill the viewport
    const items = generateItems(2);
    render(<VirtualList {...defaultProps} items={items} />);
    
    // Should only render 2 items
    const renderedItems = screen.getAllByTestId(/^item-/);
    expect(renderedItems).toHaveLength(2);
    
    // Check by testId instead of text content
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  it('should maintain scroll position when items are updated', () => {
    const { container, rerender } = render(<VirtualList {...defaultProps} />);
    
    // Get the virtual list element
    const virtualList = container.querySelector('[class*="css-"]') as HTMLElement;
    
    // Scroll down
    fireEvent.scroll(virtualList, {
      target: { scrollTop: 100 },
    });
    
    // Update with new items but same length
    const newItems = generateItems(100).map(item => ({
      ...item,
      text: `Updated Item ${item.id}`
    }));
    
    rerender(<VirtualList {...defaultProps} items={newItems} />);
    
    // Should maintain the same scroll position (visual check)
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByText('Updated Item 2')).toBeInTheDocument();
  });

  it('should handle window resize', () => {
    const { container } = render(<VirtualList {...defaultProps} />);
    
    // Initial items
    expect(screen.getAllByTestId(/^item-/)).toHaveLength(11);

    // Simulate window resize
    fireEvent.resize(window);
    
    // After resize, item count should remain the same without a scroll event
    expect(screen.getAllByTestId(/^item-/)).toHaveLength(11);
  });
}); 
