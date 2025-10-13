"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Document Viewer Dialog Component
export const DocumentViewerDialog = ({
  document,
  isOpen,
  onClose,
  allDocuments,
}: {
  document: any;
  isOpen: boolean;
  onClose: () => void;
  allDocuments: any[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    allDocuments.findIndex((doc) => doc.id === document?.id)
  );

  const currentDoc = allDocuments[currentIndex];
  const fileName = currentDoc.file_name;
  const isImage =
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".jpeg") ||
    fileName.endsWith(".png");

  const isPDF = fileName.endsWith(".pdf");
  const isViewable = isImage || isPDF;

  const handleNext = () => {
    if (currentIndex < allDocuments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDownload = () => {
    window.open(currentDoc.file_url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle
                className={`block w-72 overflow-hidden whitespace-nowrap ${
                  currentDoc?.file_name.length >= 20 && "text-sm"
                } text-ellipsis`}
              >
                {currentDoc?.file_name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Document {currentIndex + 1} of {allDocuments.length}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 ml-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(currentDoc.file_url, "_blank")}
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="relative bg-muted/50 flex items-center justify-center min-h-[400px] max-h-[60vh] overflow-hidden">
          {/* Navigation Buttons */}
          {allDocuments.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 z-10"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 z-10"
                onClick={handleNext}
                disabled={currentIndex === allDocuments.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Document Display */}
          {isImage ? (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={currentDoc.file_url}
                alt={currentDoc.name}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : isPDF ? (
            <iframe
              src={currentDoc.file_url}
              className="w-full h-full min-h-[500px]"
              title={currentDoc.name}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Preview not available</p>
              <p className="text-sm text-muted-foreground mb-4">
                This file type cannot be previewed in the browser
              </p>
              <div className="flex gap-2">
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(currentDoc.file_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
