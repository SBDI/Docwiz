import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreVertical, 
  Search, 
  Eye, 
  Trash2, 
  Filter,
  SortAsc,
  Clock,
  FileText
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType } from "docx";
import { queries } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Quiz {
  id: string;
  title: string;
  type: string;
  visibility: 'private' | 'public';
  createdAt: string;
  status: 'draft' | 'published';
}

interface QuizListProps {
  quizzes: Quiz[];
  onDelete: (id: string) => void;
}

const exportToWord = async (quiz: Quiz) => {
  try {
    // Fetch complete quiz data including questions
    const quizData = await queries.quizzes.getQuiz(quiz.id);
    if (!quizData) {
      toast.error('Failed to fetch quiz data');
      return;
    }

    // Parse options if they're in JSON format
    const questions = quizData.questions.map(q => ({
      ...q,
      options: Array.isArray(q.options) ? q.options : 
               typeof q.options === 'string' ? JSON.parse(q.options) :
               q.options ? JSON.parse(JSON.stringify(q.options)) : []
    }));

    // Create document sections
    const children = [
      // Title
      new Paragraph({
        text: quizData.title,
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
          new TextRun(quizData.type),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Status: ", bold: true }),
          new TextRun(quizData.status),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Visibility: ", bold: true }),
          new TextRun(quizData.visibility),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Created: ", bold: true }),
          new TextRun(new Date(quizData.createdAt).toLocaleDateString()),
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
    questions.forEach((question, index) => {
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
        question.options.forEach((option, optIndex) => {
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

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${quizData.title.toLowerCase().replace(/\s+/g, '-')}.docx`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Quiz exported successfully');
  } catch (error) {
    console.error('Export failed:', error);
    toast.error('Failed to export quiz');
  }
};

export function QuizList({ quizzes, onDelete }: QuizListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'private' | 'public'>('all');

  const filteredQuizzes = quizzes
    .filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterVisibility === 'all' || quiz.visibility === filterVisibility)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {filterVisibility.charAt(0).toUpperCase() + filterVisibility.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterVisibility('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterVisibility('private')}>
                Private
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterVisibility('public')}>
                Public
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort by {sortBy === 'date' ? 'Date' : 'Title'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                Date Created
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('title')}>
                Title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quiz List */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.map((quiz) => (
              <TableRow 
                key={quiz.id} 
                className="group cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/quiz/${quiz.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/quiz/${quiz.id}`);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <TableCell className="font-medium">
                  <span className="relative z-0">{quiz.title}</span>
                </TableCell>
                <TableCell>
                  <span className="relative z-0">
                    <Badge variant="secondary">{quiz.type}</Badge>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="relative z-0">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        quiz.status === 'published' 
                          ? 'border-green-500 text-green-500' 
                          : 'border-orange-500 text-orange-500'
                      )}
                    >
                      {quiz.status}
                    </Badge>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="relative z-0">
                    <Badge variant="outline">
                      {quiz.visibility}
                    </Badge>
                  </span>
                </TableCell>
                <TableCell className="text-gray-500">
                  <span className="relative z-0">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
                    </div>
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity relative z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/quiz/${quiz.id}`);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            exportToWord(quiz);
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Export as Word
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(quiz.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
