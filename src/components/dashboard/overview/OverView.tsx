"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Car, DollarSign, FileText } from "lucide-react";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import {
  useGetMonthlyExpenses,
  useGetTotalExpensesLoggedCurrentYear,
  useGetTotalSpentCurrentYear,
  useGetTotalVehicles,
} from "@/queries/dashboard.queries";
import { useGetFewExpenses } from "@/queries/expense.queries";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

export const Dashboard = () => {
  const { push } = useProgressBarNavigation();

  const GetTotalVehiclesQuery = useGetTotalVehicles();
  const GetTotalTotalSpentCurrentYearQuery = useGetTotalSpentCurrentYear();
  const useGetTotalExpensesLoggedCurrentYearQuery =
    useGetTotalExpensesLoggedCurrentYear();
  const GetMonthlyExpenses = useGetMonthlyExpenses();
  const GetFewExpenses = useGetFewExpenses();

  const isLoading =
    GetTotalVehiclesQuery.isLoading ||
    GetTotalTotalSpentCurrentYearQuery.isLoading ||
    useGetTotalExpensesLoggedCurrentYearQuery.isLoading ||
    GetMonthlyExpenses.isLoading ||
    GetFewExpenses.isLoading;

  const hasError =
    GetTotalVehiclesQuery.isError ||
    GetTotalTotalSpentCurrentYearQuery.isError ||
    useGetTotalExpensesLoggedCurrentYearQuery.isError ||
    GetMonthlyExpenses.isError ||
    GetFewExpenses.isError;

  const handleRetry = () => {
    GetTotalVehiclesQuery.refetch();
    GetTotalTotalSpentCurrentYearQuery.refetch();
    useGetTotalExpensesLoggedCurrentYearQuery.refetch();
    GetMonthlyExpenses.refetch();
    GetFewExpenses.refetch();
  };

  useEffect(() => {
    if (GetFewExpenses.isSuccess) {
      console.log(GetFewExpenses.data);
    }
  }, [GetFewExpenses.isSuccess]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 w-full ">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              A&G Insurance Vehicle Maintenance Overview
            </p>
          </div>
          <Button
            onClick={() => push("/dashboard/vehicles")}
            className="w-full sm:w-auto cursor-pointer"
          >
            <Car className="h-4 w-4 mr-2" />
            View All Vehicles
          </Button>
        </div>

        {/* Global Error Alert */}
        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Dashboard</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                There was a problem loading some dashboard data. Please try
                again.
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Vehicles
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {GetTotalVehiclesQuery.isLoading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : GetTotalVehiclesQuery.isError ? (
                <div className="text-sm text-destructive">Failed to load</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {GetTotalVehiclesQuery.data
                      ? GetTotalVehiclesQuery.data
                      : "0"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active fleet vehicles
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Spent (2025)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {GetTotalTotalSpentCurrentYearQuery.isLoading ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-36" />
                </>
              ) : GetTotalTotalSpentCurrentYearQuery.isError ? (
                <div className="text-sm text-destructive">Failed to load</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    ₦
                    {GetTotalTotalSpentCurrentYearQuery.data
                      ? GetTotalTotalSpentCurrentYearQuery.data.toLocaleString()
                      : "0"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600 font-medium">+12.5%</span>{" "}
                    from last year
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {useGetTotalExpensesLoggedCurrentYearQuery.isLoading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-28" />
                </>
              ) : useGetTotalExpensesLoggedCurrentYearQuery.isError ? (
                <div className="text-sm text-destructive">Failed to load</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {useGetTotalExpensesLoggedCurrentYearQuery.data
                      ? useGetTotalExpensesLoggedCurrentYearQuery.data
                      : "0"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Logged this year
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending</CardTitle>
              <CardDescription>
                Maintenance costs per month in 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              {GetMonthlyExpenses.isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : GetMonthlyExpenses.isError ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Failed to load monthly spending data
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => GetMonthlyExpenses.refetch()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : !GetMonthlyExpenses.data ||
                GetMonthlyExpenses.data.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-center">
                  <p className="text-sm text-muted-foreground">
                    No spending data available
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={GetMonthlyExpenses.data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total_amount"
                      stroke="blue"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Latest 5 maintenance entries</CardDescription>
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
                      Vehicle
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {GetFewExpenses.isLoading ? (
                    // Skeleton rows
                    [...Array(5)].map((_, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-32" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-28" />
                        </td>
                        <td className="py-3 px-4">
                          <Skeleton className="h-5 w-20" />
                        </td>
                      </tr>
                    ))
                  ) : GetFewExpenses.isError ? (
                    <tr>
                      <td colSpan={4} className="py-8">
                        <div className="flex flex-col items-center justify-center text-center">
                          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
                          <p className="text-sm text-muted-foreground mb-3">
                            Failed to load recent expenses
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => GetFewExpenses.refetch()}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : !GetFewExpenses.data ||
                    GetFewExpenses.data.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          No recent expenses found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    GetFewExpenses.data.map((expense) => (
                      <tr
                        onClick={() =>
                          push(`vehicles/vehicle/${expense.vehicles.id}`)
                        } // routes to the vehicle page
                        key={expense.id}
                        className="cursor-pointer border-b border-border hover:bg-accent/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm">
                          {format(new Date(expense.created_at), "MMM dd, yyyy")}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {expense.vehicles?.plate_number}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {expense.expense_type}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          ₦{expense.amount.toLocaleString()}
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
    </div>
  );
};
