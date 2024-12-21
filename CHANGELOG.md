# Changelog

## [1.2.0] - 2024-12-22

### Added
- New Quiz Components:
  - QuizCard and QuizCardComponent for improved quiz display
  - QuizResults component for displaying quiz outcomes
  - QuizTaking component for quiz interaction
- Enhanced quiz preview functionality
- New database migrations for questions and quiz RLS

### Changed
- Updated file upload and options dialog UI
- Modified AI and API client implementations
- Enhanced document parser functionality
- Improved Supabase client integration
- Updated textarea UI component
- Enhanced types for quiz system

### Technical
- Added cursurrules to gitignore
- Updated project dependencies
- Improved Row Level Security (RLS) for questions and quiz tables

## [1.1.0] - 2024-12-20

### Changed
- Migrated from Groq API to X.AI API for quiz generation
- Updated model to use `grok-2-1212`
- Improved quiz generation response format
- Enhanced error handling in API client

### Added
- New X.AI API integration in `ai-client.ts`
- Automatic API connection testing on component mount
- Better type safety for quiz generation responses

### Removed
- Groq API integration and related code
- Unused interfaces and debug logging

### Technical Details
- Updated environment variable from `VITE_GROQ_API_KEY` to `VITE_XAI_API_KEY`
- Added OpenAI-compatible parameters (max_tokens, top_p, frequency_penalty, presence_penalty)
- Simplified quiz generation prompt for better consistency
- Improved error handling in API responses
