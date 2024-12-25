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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  SortAsc,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
              >
                <TableCell className="font-medium">
                  {quiz.title}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{quiz.type}</Badge>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {quiz.visibility}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
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
