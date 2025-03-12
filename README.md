# 🎯 Docwiz - AI-Powered Quiz Generator

Docwiz is a modern SaaS platform that transforms any document into interactive quizzes using AI. Built for educators, trainers, and content creators who want to create engaging assessments quickly and efficiently.

## ✨ Features

- **📄 Smart Document Processing**
  - Support for PDF, DOCX, TXT, and image files
  - Intelligent text extraction and analysis
  - Automatic content organization

- **🤖 AI-Powered Quiz Generation**
  - Context-aware question creation
  - Multiple question types support
  - Customizable difficulty levels
  - Automatic answer validation

- **💼 Professional Tools**
  - Custom quiz templates
  - Bulk quiz generation
  - Quiz analytics and insights
  - Export options (PDF, CSV)

- **🔒 Enterprise-Grade Security**
  - End-to-end encryption
  - Role-based access control
  - Data privacy compliance
  - Secure document storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm package manager
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/docwiz.git

# Navigate to project directory
cd docwiz

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Start development server
pnpm dev
```

### Environment Setup

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Provider
VITE_GROQ_API_KEY=your_groq_api_key

# Development Options
VITE_DEV_BYPASS_CREDITS=true  # Enable for development only
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query
- **Routing**: React Router 6
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI Integration**: Groq API

### Development Tools
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier

## 🧪 Development Mode

### Credit System Bypass

For development purposes, you can bypass the credit system:

1. Set `VITE_DEV_BYPASS_CREDITS=true` in `.env`
2. Mock quizzes will be stored in localStorage
3. All features remain functional without database constraints

> ⚠️ Note: Credit bypass should never be enabled in production

### Local Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📚 API Documentation

### Quiz Generation

```typescript
// Example quiz generation
const quiz = await generateQuiz({
  document: File,
  options: {
    questionCount: 10,
    difficulty: 'medium',
    type: 'multiple-choice'
  }
});
```

### Templates

```typescript
// Using quiz templates
const template = await loadTemplate('academic');
const quiz = await generateFromTemplate(template, document);
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

- 📧 Email: support@docwiz.com
- �� Discord: [Join our community](https://discord.gg/docwiz)
- 📚 Documentation: [docs.docwiz.com](https://docs.docwiz.com)

## 🎯 Roadmap

- [ ] AI Model fine-tuning for better question generation
- [ ] Advanced analytics dashboard
- [ ] Custom branding options
- [ ] API access for enterprise customers
- [ ] Mobile app development
- [ ] Integration with LMS platforms

---

Built with ❤️ by the Docwiz Team
