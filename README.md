# Docwiz - AI-Powered Quiz Generator

Transform documents into smart quizzes instantly with Docwiz. Perfect for educators, trainers, and content creators.

## Features

- 📄 Multiple Document Formats: Support for PDFs, docs, images, and text files
- ⚡ Lightning Fast: Generate comprehensive quizzes in seconds with advanced AI
- 🧠 Smart Analysis: AI understands context and generates relevant questions
- 🌍 Multi-Language Support: Works in over 50 languages including Arabic
- 💎 Premium Templates: Access pre-made quiz templates for various subjects

## Tech Stack

This project is built with modern web technologies:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
- Framer Motion
- X.AI API (Grok model) for quiz generation

## Getting Started

### Prerequisites

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Development Setup

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- X.AI API (Grok model) for quiz generation

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/33086a0b-dc74-42e0-bf4d-0baa3ad2b87a) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

### Environment Setup

1. Copy `.env.example` to `.env`:
```sh
cp .env.example .env
```

2. Get your API keys:
   - HuggingFace API key from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Supabase credentials from your project settings
   - X.AI API key from [X.AI dashboard](https://x.ai/dashboard)

3. Update `.env` with your keys

### Testing HuggingFace API Key

1. After setting up your environment, start the development server:
```sh
npm run dev
```

2. Open your browser's developer tools (F12)
3. Look for the console message:
   - "HuggingFace API key is valid!" - Your key is working
   - "API Authentication Error" - Your key needs to be checked

Note: Make sure your HuggingFace API key has read access to the model

### API Integration

Docwiz uses the X.AI API with the Grok model for quiz generation. The API is fully compatible with the OpenAI API format, making it easy to integrate and maintain.

### Configuration

The API is configured in `src/config/index.ts`:
```typescript
export const config = {
  ai: {
    model: 'grok-2-1212',
    apiKey: import.meta.env.VITE_XAI_API_KEY,
    baseUrl: 'https://api.x.ai/v1'
  }
}
```

### Quiz Generation

Quizzes are generated using a structured prompt that ensures consistent formatting and high-quality questions. The system supports:

- Multiple choice questions
- Automatic answer validation
- Context-aware question generation
- Customizable number of options
