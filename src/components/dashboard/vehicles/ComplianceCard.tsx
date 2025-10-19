"use client";
import { format } from "date-fns";
import { DocumentThumbnail } from "./DocumentThumbnail";
import { DocumentViewerDialog } from "./DocumentViewer";
import {
  AlertCircle,
  Calendar,
  FileCheck,
  AlertTriangle,
  Trash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  useDeleteCompliance,
  useDeleteComplianceFiles,
} from "@/queries/compliance.queries";
import { toast } from "sonner";

// Compliance Card Component with Error Handling
export const ComplianceCard = ({
  compliance,
  isLoading = false,
  hasError = false,
}: {
  compliance: any;
  isLoading?: boolean;
  hasError?: boolean;
}) => {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>();

  //   delete compliance query
  const DeleteCompliance = useDeleteCompliance();
  //  delete compliance files query
  const DeleteComplianceFiles = useDeleteComplianceFiles();

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log(id);
    try {
      const promise = DeleteCompliance.mutateAsync(id);

      await promise;

      DeleteComplianceFiles.mutateAsync(id);
    } catch (error) {
      console.log(error);
      toast.error(`${error.message}`);
    }
  };

  useEffect(() => {
    if (DeleteCompliance.isSuccess && DeleteComplianceFiles.isSuccess) {
      toast.success("Compliance Deleted");
    }
  }, [DeleteComplianceFiles.isSuccess, DeleteCompliance.isSuccess]);

  useEffect(() => {
    console.log(compliance.id);
    compliance.compliance_files.map((file) => {
      console.log(file.compliance_id);
    });
  }, [compliance]);

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

  const handleImageError = (documentId: string) => {
    setImageError((prev) => ({ ...prev, [documentId]: true }));
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-20 w-20" />
              <Skeleton className="h-20 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (hasError || !compliance) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground">
              Failed to load compliance data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-mono text-sm font-bold px-2 py-1 bg-primary/10 text-primary rounded">
                    {compliance.vehicles?.plate_number || "N/A"}
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(
                      compliance.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(compliance.status)}
                    {compliance.status?.replace("_", " ") || "Unknown"}
                  </Badge>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="cursor-pointer p-2 bg-red-100 rounded-2xl">
                      <Trash className="text-red-500 h-4 w-4" />
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this compliance.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer"
                        onClick={() => handleDelete(compliance.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <CardTitle className="text-lg">
                {compliance.compliance_types?.name || "Unknown Type"}
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
              <p className="font-medium">{compliance.document_number || "—"}</p>
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
          {compliance.compliance_files &&
          compliance.compliance_files.length > 0 ? (
            <div>
              <p className="text-sm font-medium mb-2">
                Documents ({compliance.compliance_files.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {compliance.compliance_files.map((document: any) => (
                  <div key={document.id} className="relative">
                    {imageError[document.id] ? (
                      <div className="flex flex-col items-center justify-center h-20 w-20 border border-border rounded bg-muted text-muted-foreground text-xs">
                        <AlertTriangle className="h-4 w-4 mb-1" />
                        <span className="text-[10px]">Load error</span>
                      </div>
                    ) : (
                      <DocumentThumbnail
                        document={document}
                        onClick={() => handleDocumentClick(document)}
                        onError={() => handleImageError(document.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">
                No documents attached
              </p>
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
          allDocuments={compliance.compliance_files || []}
        />
      )}
    </>
  );
};
