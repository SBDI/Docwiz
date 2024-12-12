import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { documentStorage } from "@/lib/documentStorage";

interface PageSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalPages: number;
  onConfirm: (selectedPages: number[]) => void;
}

const PageSelectionDialog = ({ 
  open, 
  onOpenChange, 
  totalPages,
  onConfirm 
}: PageSelectionDialogProps) => {
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const maxPages = 5; // Free plan limit

  // Load previously selected pages if any
  useEffect(() => {
    if (open) {
      const docs = documentStorage.getDocuments();
      const lastDoc = docs[docs.length - 1];
      if (lastDoc?.selectedPages) {
        setSelectedPages(lastDoc.selectedPages);
      } else {
        setSelectedPages([]);
      }
    }
  }, [open]);

  const togglePage = (pageNumber: number) => {
    if (selectedPages.includes(pageNumber)) {
      setSelectedPages(selectedPages.filter(p => p !== pageNumber));
    } else if (selectedPages.length < maxPages) {
      setSelectedPages([...selectedPages, pageNumber]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-[#2D3648]">Select the pages to use for generation</DialogTitle>
            <Button 
              variant="outline" 
              className="rounded-full border-[#E2E8F0] text-[#64748B]"
              onClick={() => onOpenChange(false)}
            >
              Back to Upload
            </Button>
          </div>
          <p className="text-[#64748B] text-sm font-normal mt-2">
            You can select up to 5 pages for free. Subscribe to select up to 100.
          </p>
        </DialogHeader>

        <div className="py-6">
          <div className="grid grid-cols-6 gap-4 max-h-[600px] overflow-y-auto">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <div key={pageNum} className="relative">
                <button
                  onClick={() => togglePage(pageNum)}
                  className={`w-full aspect-[3/4] rounded-lg border-2 ${
                    selectedPages.includes(pageNum)
                      ? "border-blue-600 bg-blue-50"
                      : "border-[#E2E8F0] hover:border-blue-300"
                  } flex flex-col items-center justify-center`}
                >
                  <div className="w-full h-full bg-[#F8FAFC] rounded-md p-2">
                    {/* Preview image would go here */}
                    <img 
                      src={`/api/preview/page/${pageNum}`} 
                      alt={`Page ${pageNum}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="absolute bottom-2 bg-white px-2 py-1 rounded-full text-xs">
                    View
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedPages([])}
          >
            Deselect All
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-[#64748B]">
              {selectedPages.length} pages selected
            </span>
            <span className="text-[#64748B]">
              {totalPages}/56 pages uploaded
            </span>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
              onClick={() => {
                onConfirm(selectedPages);
                onOpenChange(false);
              }}
              disabled={selectedPages.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PageSelectionDialog; 