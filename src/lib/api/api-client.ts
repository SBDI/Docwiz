import axios, { AxiosInstance, AxiosError } from 'axios';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { API_ROUTES, CreateQuizRequest, QuizAttemptRequest, schemas } from './routes'
import { config } from '@/config'

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.api?.baseUrl || '',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth headers or other transformations here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new APIError(
        error.response.data?.message || 'Request failed',
        error.response.status,
        error.response.data?.code || 'UNKNOWN_ERROR'
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new APIError('No response from server', 503, 'SERVICE_UNAVAILABLE');
    } else {
      // Something happened in setting up the request
      throw new APIError('Request configuration error', 500, 'REQUEST_SETUP_ERROR');
    }
  }
);

// Helper function to export quiz to DOCX format
const exportToDocx = async (quiz: any) => {
  try {
    // Create document sections
    const children = [
      // Title
      new Paragraph({
        text: quiz.title,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),

      // Quiz Info
      new Paragraph({
        children: [
          new TextRun({ text: "Quiz Information", size: 28, bold: true }),
        ],
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Type: ", bold: true }),
          new TextRun(quiz.type),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Status: ", bold: true }),
          new TextRun(quiz.status),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Created: ", bold: true }),
          new TextRun(new Date(quiz.createdAt).toLocaleDateString()),
        ],
        spacing: { after: 400 },
      }),

      // Questions Section
      new Paragraph({
        children: [
          new TextRun({ text: "Questions", size: 28, bold: true }),
        ],
        spacing: { before: 400, after: 200 },
      }),
    ];

    // Add questions
    quiz.questions.forEach((question: any, index: number) => {
      // Question
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${index + 1}. `, bold: true }),
            new TextRun({ text: question.question }),
          ],
          spacing: { before: 200, after: 200 },
        })
      );

      // Options
      if (question.options && Array.isArray(question.options)) {
        question.options.forEach((option: string, optIndex: number) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `   ${String.fromCharCode(65 + optIndex)}) ` }),
                new TextRun(option),
                new TextRun({
                  text: option === question.correct_answer ? " ✓" : "",
                  bold: true,
                  color: "2E7D32", // Green color for correct answer
                }),
              ],
              spacing: { before: 80, after: 80 },
            })
          );
        });
      } else if (question.type === 'fill-in-blank') {
        // For fill-in-blank questions
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Answer: ", bold: true }),
              new TextRun(question.correct_answer),
            ],
            spacing: { before: 80, after: 80 },
          })
        );
      }

      // Explanation if available
      if (question.explanation) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Explanation: ", bold: true, italics: true }),
              new TextRun({ text: question.explanation, italics: true }),
            ],
            spacing: { before: 120, after: 200 },
          })
        );
      }
    });

    // Create the document
    const doc = new Document({
      sections: [{
        properties: {},
        children: children,
      }],
    });

    // Generate and return blob
    return await Packer.toBlob(doc);
  } catch (error) {
    console.error('Export to DOCX failed:', error);
    throw new APIError('Failed to export quiz to DOCX', 500, 'EXPORT_FAILED');
  }
};

export const apiClient = {
  quiz: {
    generate: async (content: string, options = {}) => {
      try {
        const response = await axiosInstance.post(API_ROUTES.quiz.generate, {
          content,
          options,
        });
        return schemas.quiz.generate.response.parse(response.data);
      } catch (error) {
        if (error instanceof APIError) {
          throw error;
        }
        throw new APIError(
          'Failed to generate quiz',
          500,
          'GENERATION_FAILED'
        );
      }
    },

    create: async (data: CreateQuizRequest) => {
      try {
        const response = await axiosInstance.post(API_ROUTES.quiz.create, data);
        return response.data;
      } catch (error) {
        if (error instanceof APIError) {
          throw error;
        }
        throw new APIError(
          'Failed to create quiz',
          500,
          'CREATION_FAILED'
        );
      }
    },

    attempt: async (quizId: string, answers: QuizAttemptRequest['answers']) => {
      try {
        const response = await axiosInstance.post(
          API_ROUTES.quiz.attempt(quizId),
          { answers }
        );
        return schemas.quiz.attempt.response.parse(response.data);
      } catch (error) {
        if (error instanceof APIError) {
          throw error;
        }
        throw new APIError(
          'Failed to submit quiz attempt',
          500,
          'SUBMISSION_FAILED'
        );
      }
    },

    exportToDocx: async (quizId: string) => {
      try {
        // First fetch the quiz data
        const response = await axiosInstance.get(API_ROUTES.quiz.get(quizId));
        const quiz = response.data;
        
        // Generate DOCX
        const blob = await exportToDocx(quiz);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${quiz.title.toLowerCase().replace(/\s+/g, '-')}.docx`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        return true;
      } catch (error) {
        if (error instanceof APIError) {
          throw error;
        }
        throw new APIError(
          'Failed to export quiz',
          500,
          'EXPORT_FAILED'
        );
      }
    }
  },

  templates: {
    list: async (params = {}) => {
      try {
        const response = await axiosInstance.get(API_ROUTES.templates.list, {
          params,
        });
        return response.data;
      } catch (error) {
        if (error instanceof APIError) {
          throw error;
        }
        throw new APIError(
          'Failed to fetch templates',
          500,
          'FETCH_FAILED'
        );
      }
    },

    use: async (templateId: string) => {
      try {
        const response = await axiosInstance.post(
          API_ROUTES.templates.use(templateId)
        );
        return response.data;
      } catch (error) {
        if (error instanceof APIError) {
          throw error;
        }
        throw new APIError(
          'Failed to use template',
          500,
          'TEMPLATE_USE_FAILED'
        );
      }
    }
  }
}