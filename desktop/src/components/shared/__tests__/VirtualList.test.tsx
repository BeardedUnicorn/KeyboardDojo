import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { VirtualList } from '../VirtualList';

describe('VirtualList', () => {
  const mockItems = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    content: `Item ${i}`,
  }));

  const defaultProps = {
    items: mockItems,
    renderItem: (item: { id: number; content: string }) => (
      <div data-testid={`item-${item.id}`}>{item.content}</div>
    ),
    itemHeight: 50,
    height: 200,
    overscan: 1,
  };

  it('should render visible items', () => {
    render(<VirtualList {...defaultProps} />);

    // With height 200 and itemHeight 50, we should see 4 items plus overscan
    // Total: 6 items (4 visible + 1 overscan above + 1 overscan below)
    const visibleItems = screen.getAllByTestId(/^item-/);
    expect(visibleItems).toHaveLength(6);
  });

  it('should update visible items on scroll', () => {
    const { container } = render(<VirtualList {...defaultProps} />);
    const virtualList = container.firstChild as HTMLElement;

    // Initial items
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-5')).toBeInTheDocument();
    expect(screen.queryByTestId('item-6')).not.toBeInTheDocument();

    // Scroll down 100px (2 items)
    fireEvent.scroll(virtualList, { target: { scrollTop: 100 } });

    // Should show new items
    expect(screen.queryByTestId('item-0')).not.toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-7')).toBeInTheDocument();
  });

  it('should handle custom key generation', () => {
    const getKey = (item: { id: number }) => `custom-${item.id}`;
    render(<VirtualList {...defaultProps} getKey={getKey} />);

    const firstItem = screen.getByTestId('item-0');
    expect(firstItem.parentElement).toHaveAttribute('key', 'custom-0');
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <VirtualList {...defaultProps} style={customStyle} />,
    );

    expect(container.firstChild).toHaveStyle(customStyle);
  });

  it('should handle empty items array', () => {
    render(<VirtualList {...defaultProps} items={[]} />);
    const items = screen.queryAllByTestId(/^item-/);
    expect(items).toHaveLength(0);
  });

  it('should handle items smaller than viewport', () => {
    const fewItems = mockItems.slice(0, 2);
    render(<VirtualList {...defaultProps} items={fewItems} />);

    const items = screen.getAllByTestId(/^item-/);
    expect(items).toHaveLength(2);
  });

  it('should maintain scroll position when items update', () => {
    const { container, rerender } = render(<VirtualList {...defaultProps} />);
    const virtualList = container.firstChild as HTMLElement;

    // Scroll down
    fireEvent.scroll(virtualList, { target: { scrollTop: 100 } });

    // Update items
    const newItems = [...mockItems, { id: 100, content: 'New Item' }];
    rerender(<VirtualList {...defaultProps} items={newItems} />);

    // Scroll position should be maintained
    expect(virtualList.scrollTop).toBe(100);
  });

  it('should handle window resize', () => {
    const { container } = render(<VirtualList {...defaultProps} />);
    const virtualList = container.firstChild as HTMLElement;

    // Initial items
    expect(screen.getAllByTestId(/^item-/)).toHaveLength(6);

    // Simulate window resize
    Object.defineProperty(virtualList, 'clientHeight', {
      configurable: true,
      value: 400,
    });

    fireEvent(window, new Event('resize'));

    // Should show more items due to increased height
    expect(screen.getAllByTestId(/^item-/)).toHaveLength(10);
  });
}); 
