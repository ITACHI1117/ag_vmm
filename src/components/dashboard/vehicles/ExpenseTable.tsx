import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import { MonthDayYear } from "@/lib/formatDate";
import { AlertCircle, Eye, RefreshCw, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { DocumentViewerDialog } from "./DocumentViewer";
import {
  useDeleteExpenses,
  useDeleteExpensesFiles,
} from "@/queries/expense.queries";
import { toast } from "sonner";
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
import { supabase } from "@/supabse-client";
import { useAuthStore } from "@/store/authStore";

export const ExpenseTable = ({ GetVehicleExpensesQuery }) => {
  // state
  const [selectedDocument, setSelectedDocument] = useState();
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  // global state
  const { user } = useAuthStore();

  //   delete compliance query
  const DeleteExpenses = useDeleteExpenses();

  // delete from storage
  async function deleteComplianceFilesFromStorage(
    vehicle_id: string,
    expensesFiles: Array<any>
  ) {
    try {
      if (!expensesFiles || expensesFiles.length === 0) return;
      const filePaths = expensesFiles.map(
        (file) => `invoices/${vehicle_id}/${file.file_name}`
      );

      // Delete files from Supabase Storage
      const { error } = await supabase.storage
        .from("invoices")
        .remove(filePaths);

      if (error) throw error;

      toast.success("Expenses files deleted from storage");
      return { success: true };
    } catch (error: any) {
      console.log("Error deleting expenses files from storage:", error.message);
      return { success: false, error: error.message };
    }
  }

  const handleDelete = async (id: string) => {
    try {
      console.log(id);
      const promise = DeleteExpenses.mutateAsync(id);

      await promise;

      const expense = GetVehicleExpensesQuery.data.find(
        (item) => item.id === id
      );

      if (!expense) throw new Error("Expense not found");

      // delete related files from storage
      await deleteComplianceFilesFromStorage(
        expense.vehicle_id,
        expense.expenses_files
      );
    } catch (error: any) {
      console.log(error);
      toast.error(`${error.message}`);
    }
  };

  const userRole = user && user.role;

  return (
    <>
      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>
            All maintenance records for this vehicle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {GetVehicleExpensesQuery.isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-3 px-4">
                        <Skeleton className="h-5 w-24" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-5 w-28" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-5 w-20" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-5 w-40" />
                      </td>
                      <td className="py-3 px-4">
                        <Skeleton className="h-8 w-16" />
                      </td>
                    </tr>
                  ))
                ) : GetVehicleExpensesQuery.isError ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Failed to load expense history
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => GetVehicleExpensesQuery.refetch()}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : !GetVehicleExpensesQuery.data ||
                  GetVehicleExpensesQuery.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <p className="text-sm text-muted-foreground">
                        No expense records found for this vehicle
                      </p>
                    </td>
                  </tr>
                ) : (
                  GetVehicleExpensesQuery.data.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">
                        {MonthDayYear(expense.created_at)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {expense.expense_type}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        ₦{expense.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {expense.description || "—"}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            console.log(expense.expenses_files);
                            setSelectedDocument(expense.expenses_files);
                            setIsViewerOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                        </Button>
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
                              {userRole === "Staff" ? (
                                <AlertDialogTitle>
                                  Permission Denied
                                </AlertDialogTitle>
                              ) : (
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                              )}
                              {userRole === "Staff" ? (
                                <AlertDialogDescription>
                                  You do not have permission to delete this
                                  vehicle information.
                                </AlertDialogDescription>
                              ) : (
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete this vehicle expense.
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
                                    handleDelete(expense.id);
                                    // Add delete logic here
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              )}
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                         
                        >
                          <Trash className="h-4 w-4 mr-1 text-red-500" />
                        </Button> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Document Viewer Dialog */}
      {selectedDocument && (
        <DocumentViewerDialog
          document={selectedDocument[0]}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedDocument(null);
          }}
          allDocuments={selectedDocument || []}
        />
      )}
    </>
  );
};
