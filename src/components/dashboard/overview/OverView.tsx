"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Car,
  DollarSign,
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  ArrowLeft,
  TrendingUp,
  Calendar,
} from "lucide-react";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import {
  useGetMonthlyExpenses,
  useGetTotalExpensesLoggedCurrentYear,
  useGetTotalSpentCurrentYear,
  useGetTotalVehicles,
} from "@/queries/dashboard.queries";
import { useGetFewExpenses } from "@/queries/expense.queries";
import { format } from "date-fns";

// Mock Data
const mockVehicles = [
  {
    id: 1,
    plateNumber: "ABC-1234",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    totalSpent: 125000,
  },
  {
    id: 2,
    plateNumber: "XYZ-5678",
    make: "Honda",
    model: "Accord",
    year: 2019,
    totalSpent: 98500,
  },
  {
    id: 3,
    plateNumber: "DEF-9012",
    make: "Ford",
    model: "Explorer",
    year: 2021,
    totalSpent: 156000,
  },
  {
    id: 4,
    plateNumber: "GHI-3456",
    make: "Nissan",
    model: "Altima",
    year: 2020,
    totalSpent: 87300,
  },
  {
    id: 5,
    plateNumber: "JKL-7890",
    make: "Chevrolet",
    model: "Malibu",
    year: 2022,
    totalSpent: 62000,
  },
];

const mockExpenses = [
  {
    id: 1,
    vehicleId: 1,
    date: "2025-10-05",
    type: "Oil Change",
    amount: 15000,
    description: "Regular maintenance",
    invoice: "INV-001",
  },
  {
    id: 2,
    vehicleId: 2,
    date: "2025-10-03",
    type: "Tire Replacement",
    amount: 45000,
    description: "All 4 tires replaced",
    invoice: "INV-002",
  },
  {
    id: 3,
    vehicleId: 1,
    date: "2025-09-28",
    type: "Brake Service",
    amount: 32000,
    description: "Front brake pads",
    invoice: "INV-003",
  },
  {
    id: 4,
    vehicleId: 3,
    date: "2025-09-25",
    type: "Engine Repair",
    amount: 85000,
    description: "Engine diagnostic and repair",
    invoice: "INV-004",
  },
  {
    id: 5,
    vehicleId: 4,
    date: "2025-09-20",
    type: "Battery Replacement",
    amount: 18000,
    description: "New battery installed",
    invoice: "INV-005",
  },
];

// Dashboard Component
export const Dashboard = () => {
  const { push } = useProgressBarNavigation();

  // Try combine these three queries to one
  // supabse function to return these values
  const GetTotalVehiclesQuery = useGetTotalVehicles();
  const GetTotalTotalSpentCurrentYearQuery = useGetTotalSpentCurrentYear();
  const useGetTotalExpensesLoggedCurrentYearQuery =
    useGetTotalExpensesLoggedCurrentYear();

  const GetMonthlyExpenses = useGetMonthlyExpenses();

  // get recent expenses
  const GetFewExpenses = useGetFewExpenses();

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
              <div className="text-2xl font-bold">
                {GetTotalVehiclesQuery.data ? GetTotalVehiclesQuery.data : "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active fleet vehicles
              </p>
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
              <div className="text-2xl font-bold">
                ₦
                {GetTotalTotalSpentCurrentYearQuery.data
                  ? GetTotalTotalSpentCurrentYearQuery.data.toLocaleString()
                  : "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 font-medium">+12.5%</span> from
                last year
              </p>
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
              <div className="text-2xl font-bold">
                {useGetTotalExpensesLoggedCurrentYearQuery.data
                  ? useGetTotalExpensesLoggedCurrentYearQuery.data
                  : "0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Logged this year
              </p>
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
            </CardContent>
          </Card>
          {/* Removed the spending types for now */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Spending by Type</CardTitle>
              <CardDescription>
                Breakdown of maintenance categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}
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
                    {/* <th className="text-left py-3 px-4 font-medium text-sm">
                      Invoice
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {GetFewExpenses.data &&
                    GetFewExpenses.data.map((expense) => {
                      // const vehicle = mockVehicles.find(
                      //   (v) => v.id === expense.vehicleId
                      // );
                      return (
                        <tr
                          key={expense.id}
                          className="border-b border-border hover:bg-accent/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm">
                            {format(
                              new Date(expense.created_at),
                              "MMM dd, yyyy"
                            )}
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
                          {/* <td className="py-3 px-4 text-sm">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td> */}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
