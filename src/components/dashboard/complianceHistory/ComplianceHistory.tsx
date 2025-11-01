"use client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import { Search, AlertCircle, RefreshCw, Eye, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetAllVehicles } from "@/queries/vehicle.queries";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteCompliance,
  useGetAllVehiclesComplianceHistory,
} from "@/queries/compliance.queries";
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
import { useAuthStore } from "@/store/authStore";
import { DocumentViewerDialog } from "../vehicles/DocumentViewer";
import { toast } from "sonner";

export const ComplianceHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("allVehicles");
  const [vehicleId, setVehicleId] = useState<string>("1");
  const [selectedDocument, setSelectedDocument] = useState();
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  //   global state
  const { user } = useAuthStore();

  const userRole = user && user.role;

  // Get all vehicles compliance history
  // debounce searchTerm
  const debounceSearchTerm = useDebounce(searchTerm, 500);
  const GetVehiclesComplianceHistory =
    useGetAllVehiclesComplianceHistory(debounceSearchTerm);

  //   delete compliance query
  const DeleteCompliance = useDeleteCompliance();

  const { push } = useProgressBarNavigation();

  const handleNavigation = (vehicleId: string) => {
    push(`/dashboard/vehicles/vehicle/${vehicleId}`);
    // if (currentScreen == "allVehicles") {
    //   setCurrentScreen("VehicleDetail");
    // } else {
    //   setCurrentScreen("allVehicles");
    // }
  };

  const handleDelete = async (id: string) => {
    try {
      const promise = DeleteCompliance.mutateAsync(id);

      toast.promise(promise, {
        loading: "Deleting Compliance Record",
        success: "Compliance Record Deleted",
        error: "There was an error while trying to delete this record",
      });

      // await promise;

      // deleteComplianceFilesFromStorage(
      //   compliance.vehicles.id,
      //   compliance.compliance_files
      // );
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const handleRetry = () => {
    console.log("retrying");
    GetVehiclesComplianceHistory.refetch();
  };

  function handleViewFiles(vehicle) {
    vehicle.files.map((file) => {
      if (!file.file_url || !file.file_name) {
        toast.error("Cant find files for this Compliance");
      } else {
        setSelectedDocument(vehicle.files);
        setIsViewerOpen(true);
      }
    });
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-[100%] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Compliance History</h1>
            <p className="text-muted-foreground mt-1">
              Compliance for all vehicles
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {GetVehiclesComplianceHistory.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Compliance</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                There was a problem loading the compliance. Please try again.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Plate number, document number, status, or compliance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={GetVehiclesComplianceHistory.isLoading}
          />
        </div>

        {/* Vehicles Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Compliance
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Plate Number
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Document Number
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Issue Date
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Expiry Date
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Created At
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Last Reminder Sent
                    </th>

                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {GetVehiclesComplianceHistory.isLoading ? (
                    // Skeleton rows
                    [...Array(5)].map((_, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-20" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-28" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-8 w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-8 w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-8 w-24" />
                        </td>
                      </tr>
                    ))
                  ) : GetVehiclesComplianceHistory.isError ? (
                    // Error state
                    <tr>
                      <td colSpan={10} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Failed to load compliance
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRetry}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : !GetVehiclesComplianceHistory.data ||
                    GetVehiclesComplianceHistory.data.length === 0 ? (
                    // Empty state
                    <tr>
                      <td colSpan={10} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground mb-2">
                            {searchTerm
                              ? "No vehicles found matching your search"
                              : "No vehicles found"}
                          </p>
                          {searchTerm && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearchTerm("")}
                              className="mt-2"
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Data rows
                    GetVehiclesComplianceHistory.data.map((vehicle) => (
                      <tr
                        key={vehicle.id}
                        className="border-b border-border hover:bg-accent/50 transition-colors "
                      >
                        <td className="py-4 px-6 font-medium">
                          {vehicle.compliance_type_name}
                        </td>
                        <td
                          onClick={() => {
                            handleNavigation(vehicle.vehicle_id);
                          }}
                          className="py-4 px-6 text-primary underline cursor-pointer"
                        >
                          {vehicle.plate_number}
                        </td>
                        <td className="py-4 px-6">{vehicle.document_number}</td>
                        <td className="py-4 px-6">
                          {format(new Date(vehicle.issue_date), "MMM dd, yyyy")}
                        </td>
                        <td className="py-4 px-6">
                          {format(
                            new Date(vehicle.expiry_date),
                            "MMM dd, yyyy"
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {format(new Date(vehicle.created_at), "MMM dd, yyyy")}
                        </td>
                        <td className="py-4 px-6">{vehicle.status}</td>
                        <td className="py-4 px-6">
                          {vehicle.last_reminder_sent
                            ? format(
                                new Date(vehicle.last_reminder_sent),
                                "MMM dd, yyyy"
                              )
                            : "-"}
                        </td>

                        <td className="py-3 px-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewFiles(vehicle)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                          </Button>
                          {/* removed delete button for now */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant={"ghost"}
                                className="cursor-pointer"
                              >
                                <Trash className="text-red-500 h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                {userRole !== "IT" ? (
                                  <AlertDialogTitle>
                                    Permission Denied
                                  </AlertDialogTitle>
                                ) : (
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                )}
                                {userRole !== "IT" ? (
                                  <AlertDialogDescription>
                                    You do not have permission to delete this
                                    vehicle information.
                                  </AlertDialogDescription>
                                ) : (
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this vehicle compliance.
                                  </AlertDialogDescription>
                                )}
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">
                                  Cancel
                                </AlertDialogCancel>
                                {userRole !== "Staff" && (
                                  <AlertDialogAction
                                    className="cursor-pointer"
                                    onClick={() => {
                                      handleDelete(vehicle.id);
                                      // Add delete logic here
                                    }}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                )}
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      {selectedDocument && (
        <DocumentViewerDialog
          document={selectedDocument[0] ? selectedDocument[0] : []}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedDocument(null);
          }}
          allDocuments={selectedDocument || []}
        />
      )}
    </div>
  );
};
