# Changelog

## [Unreleased]

### Added
- Multiple curriculum support
  - Added `CurriculumType` enum to support different curriculum types
  - Created `CurriculumService` class to manage curriculum data
  - Implemented curriculum selection in the UI
- Enhanced track selection with tabs interface
- Added curriculum metadata (name, description, icon)

### Changed
- Refactored `CurriculumView` component to support multiple curriculums
- Updated lesson progression system to work across different curriculums
- Improved settings page with better organization and UI
- Enhanced lesson page with vertical stepper for better progression visualization

### Removed
- Hearts feature completely removed
  - Removed `HeartsContext.tsx` and `heartsProvider`
  - Removed `heartsService.ts`
  - Removed hearts-related UI from lesson and challenge pages
  - Removed hearts display from settings page
- Simplified challenge progression without hearts penalties

### Documentation
- Updated README.md with information about multiple curriculums
- Added curriculum structure documentation
- Updated progression system documentation 