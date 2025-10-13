"use client";
import { ExternalLink, File, FileText } from "lucide-react";
import Image from "next/image";

// Document Thumbnail Component
export const DocumentThumbnail = ({
  document,
  onClick,
}: {
  document: any;
  onClick: () => void;
}) => {
  const fileName = document.file_name.toLowerCase();

  const isImage =
    fileName.endsWith(".jpg") ||
    fileName.endsWith(".jpeg") ||
    fileName.endsWith(".png");

  const isPDF = fileName.endsWith(".pdf");

  const getFileIcon = () => {
    if (isPDF) return <FileText className="h-8 w-8 text-red-500" />;
    if (document.type.includes("word"))
      return <FileText className="h-8 w-8 text-blue-500" />;
    if (
      document.type.includes("excel") ||
      document.type.includes("spreadsheet")
    )
      return <FileText className="h-8 w-8 text-green-500" />;
    return <File className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-24 h-24 rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary transition-colors group relative"
    >
      {isImage ? (
        <Image
          src={document.file_url}
          alt={document.file_name}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted group-hover:bg-muted/80 transition-colors">
          {getFileIcon()}
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <ExternalLink className="h-5 w-5 text-white" />
      </div>
    </div>
  );
};
