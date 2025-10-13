"use client";
import { format } from "date-fns";
import { DocumentThumbnail } from "./DocumentThumbnail";
import { DocumentViewerDialog } from "./DocumentViewer";
import { AlertCircle, Calendar, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Compliance Card Component
export const ComplianceCard = ({ compliance }: { compliance: any }) => {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "expiring_soon":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "expired":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <FileCheck className="h-3 w-3" />;
      case "expiring_soon":
      case "expired":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-mono text-sm font-bold px-2 py-1 bg-primary/10 text-primary rounded">
                  {compliance.vehicles.plate_number}
                </div>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(
                    compliance.status
                  )} flex items-center gap-1`}
                >
                  {getStatusIcon(compliance.status)}
                  {compliance.status.replace("_", " ")}
                </Badge>
              </div>
              <CardTitle className="text-lg">
                {compliance.compliance_types.name}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Document Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">
                Document Number
              </p>
              <p className="font-medium">{compliance.document_number}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Issue Date</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {compliance.issue_date
                  ? format(new Date(compliance.issue_date), "MMM dd, yyyy")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Expiry Date</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {compliance.expiry_date
                  ? format(new Date(compliance.expiry_date), "MMM dd, yyyy")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Created</p>
              <p className="font-medium">
                {compliance.created_at
                  ? format(new Date(compliance.created_at), "MMM dd, yyyy")
                  : "—"}
              </p>
            </div>
          </div>

          {/* Documents Horizontal Scroll */}
          {compliance.compliance_files.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">
                Documents ({compliance.compliance_files.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {compliance.compliance_files.map((document: any) => (
                  <DocumentThumbnail
                    key={document.id}
                    document={document}
                    onClick={() => handleDocumentClick(document)}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer Dialog */}
      {selectedDocument && (
        <DocumentViewerDialog
          document={selectedDocument}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedDocument(null);
          }}
          allDocuments={compliance.compliance_files}
        />
      )}
    </>
  );
};
