"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Download,
  Eye,
  Plus,
  Search,
  Trash,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddExpenseModal from "./AddExpenseModal";
import {
  useGetTotalAmountSpentOnVehicle,
  useGetVehicle,
} from "@/queries/vehicle.queries";
import { useGetVehicleExpenses } from "@/queries/expense.queries";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import AddComplianceModal from "./AddComplianceModal";
import { ComplianceCard } from "./ComplianceCard";
import { useGetVehicleCompliance } from "@/queries/compliance.queries";
import { VehicleComplianceComponent } from "./VehicleComplianceCompnent";
import { ExpenseTable } from "./ExpenseTable";

const VehicleDetailsComponent = ({
  vehicleId,
}: // handleNavigation,
{
  vehicleId: string;
  // handleNavigation: () => void;
}) => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddComplianceOpen, setIsAddComplianceOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState();
  const [warnDialog, setWarnDialog] = useState(false);
  const { back, push } = useProgressBarNavigation();
  const [activeCompliance, setActiveCompliance] = useState();
  const [selectedDocument, setSelectedDocument] = useState();

  // Get Vehicle Query
  const GetVehicleQuery = useGetVehicle(vehicleId);

  // Get Vehicle Expenses
  const GetVehicleExpensesQuery = useGetVehicleExpenses(vehicleId);

  // Get Total amount Spent on Vehicle
  const GetTotalAmountSpentOnVehicleQuery =
    useGetTotalAmountSpentOnVehicle(vehicleId);

  // Get Compliance Data
  const GetComplianceDataQuery = useGetVehicleCompliance(vehicleId);

  // Get Expenses Files

  useEffect(() => {
    if (GetVehicleExpensesQuery.isSuccess) {
      console.log(GetVehicleExpensesQuery.data);
    }
  }, [GetVehicleExpensesQuery.isSuccess]);

  // Get the active vehicle compliance
  useEffect(() => {
    if (GetComplianceDataQuery.isSuccess) {
      const typeIds = GetComplianceDataQuery.data.map((c) => c.type_id);
      setActiveCompliance(typeIds);
    }
  }, [GetComplianceDataQuery.isSuccess]);

  useEffect(() => {
    console.log(activeCompliance);
  }, [activeCompliance]);

  const handleRetryAll = () => {
    GetVehicleQuery.refetch();
    GetVehicleExpensesQuery.refetch();
    GetTotalAmountSpentOnVehicleQuery.refetch();
    GetComplianceDataQuery.refetch();
  };

  const isLoading =
    GetVehicleQuery.isLoading ||
    GetVehicleExpensesQuery.isLoading ||
    GetTotalAmountSpentOnVehicleQuery.isLoading ||
    GetComplianceDataQuery.isLoading;

  const hasError =
    GetVehicleQuery.isError ||
    GetVehicleExpensesQuery.isError ||
    GetTotalAmountSpentOnVehicleQuery.isError ||
    GetComplianceDataQuery.isError;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" onClick={() => back()} className="mb-2 -ml-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {GetVehicleQuery.isLoading ? (
            <>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </>
          ) : GetVehicleQuery.isError ? (
            <>
              <h1 className="text-3xl font-bold text-destructive">
                Error Loading Vehicle
              </h1>
              <p className="text-muted-foreground mt-1">
                Failed to load vehicle details
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">
                {GetVehicleQuery.data?.plate_number}
              </h1>
              <p className="text-muted-foreground mt-1">
                {GetVehicleQuery.data?.make} {GetVehicleQuery.data?.model} (
                {GetVehicleQuery.data?.year})
              </p>
            </>
          )}
        </div>

        {/* Global Error Alert */}
        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                There was a problem loading some vehicle data. Please try again.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryAll}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Vehicle Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            {GetVehicleQuery.isLoading ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-10 w-48" />
                </div>
              </>
            ) : GetVehicleQuery.isError ? (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Failed to load vehicle information
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => GetVehicleQuery.refetch()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Plate Number
                    </p>
                    <p className="text-lg font-semibold">
                      {GetVehicleQuery.data?.plate_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Make</p>
                    <p className="text-lg font-semibold">
                      {GetVehicleQuery.data?.make || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="text-lg font-semibold">
                      {GetVehicleQuery.data?.model || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="text-lg font-semibold">
                      {GetVehicleQuery.data?.year || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Total Amount Spent
                  </p>
                  {GetTotalAmountSpentOnVehicleQuery.isLoading ? (
                    <Skeleton className="h-10 w-48 mt-1" />
                  ) : GetTotalAmountSpentOnVehicleQuery.isError ? (
                    <p className="text-sm text-destructive mt-1">
                      Failed to load
                    </p>
                  ) : (
                    <p className="text-3xl font-bold text-primary mt-1">
                      ₦
                      {GetTotalAmountSpentOnVehicleQuery.data
                        ? GetTotalAmountSpentOnVehicleQuery.data.toLocaleString()
                        : "0.00"}
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Compliance exist warning dialog */}
        <Dialog open={warnDialog} onOpenChange={setWarnDialog}>
          <DialogContent>
            <DialogHeader>Compliance already exist</DialogHeader>
            <p>
              The selected compliance type already exist, are you sure you want
              to continue?
            </p>
            <DialogFooter className="gap-4 space-x-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setWarnDialog(false);
                  setIsAddExpenseOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button variant={"destructive"}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                disabled={GetVehicleQuery.isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <AddExpenseModal
              vehicleId={vehicleId}
              onClose={() => setIsAddExpenseOpen(false)}
            />
          </Dialog>
          <Dialog
            open={isAddComplianceOpen}
            onOpenChange={setIsAddComplianceOpen}
          >
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                disabled={GetVehicleQuery.isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle Compliance
              </Button>
            </DialogTrigger>
            <AddComplianceModal
              vehicleId={vehicleId}
              onClose={() => setIsAddComplianceOpen(false)}
              activeCompliance={activeCompliance}
              setWarnDialog={() => setWarnDialog(false)}
            />
          </Dialog>
        </div>

        {/* Expenses Table */}
        <ExpenseTable GetVehicleExpensesQuery={GetVehicleExpensesQuery} />

        {/* Vehicle Compliance Section */}
        <VehicleComplianceComponent
          GetComplianceDataQuery={GetComplianceDataQuery}
        />
      </div>
    </div>
  );
};

export default VehicleDetailsComponent;
