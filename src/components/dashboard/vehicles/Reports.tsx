"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartLegendContent } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

const monthlySpending = [
  { month: "Jan", amount: 125000 },
  { month: "Feb", amount: 98000 },
  { month: "Mar", amount: 145000 },
  { month: "Apr", amount: 112000 },
  { month: "May", amount: 168000 },
  { month: "Jun", amount: 134000 },
  { month: "Jul", amount: 156000 },
  { month: "Aug", amount: 189000 },
  { month: "Sep", amount: 142000 },
  { month: "Oct", amount: 95000 },
];

const expenseTypeData = [
  { name: "Oil Change", value: 45000, color: "#6366f1" },
  { name: "Tire Replacement", value: 125000, color: "#8b5cf6" },
  { name: "Brake Service", value: 78000, color: "#ec4899" },
  { name: "Engine Repair", amount: 210000, color: "#f59e0b" },
  { name: "Battery", value: 52000, color: "#10b981" },
];
const ReportsComponent = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const handleExport = (format: "csv" | "pdf") => {
    alert(
      `Exporting ${format.toUpperCase()} report for ${
        selectedMonth === "all"
          ? selectedYear
          : `${selectedMonth} ${selectedYear}`
      }`
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive spending analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="February">February</SelectItem>
                    <SelectItem value="March">March</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="May">May</SelectItem>
                    <SelectItem value="June">June</SelectItem>
                    <SelectItem value="July">July</SelectItem>
                    <SelectItem value="August">August</SelectItem>
                    <SelectItem value="September">September</SelectItem>
                    <SelectItem value="October">October</SelectItem>
                    <SelectItem value="November">November</SelectItem>
                    <SelectItem value="December">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Export</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExport("csv")}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    onClick={() => handleExport("pdf")}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Vehicle</CardTitle>
            <CardDescription>
              Total maintenance costs per vehicle
            </CardDescription>
          </CardHeader>
          {/* <ChartContainer config={}>
            <ChartLegendContent> */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Plate Number
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Vehicle
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Total Spent
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm">
                    Expenses
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-border hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">
                      {vehicle.plateNumber}
                    </td>
                    <td className="py-3 px-4">
                      {vehicle.make} {vehicle.model}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      ₦{vehicle.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {
                        mockExpenses.filter((e) => e.vehicleId === vehicle.id)
                          .length
                      }{" "}
                      entries
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* </ChartLegendContent>
          </ChartContainer> */}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Expense Type</CardTitle>
            <CardDescription>
              Cost breakdown by maintenance category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseTypeData.map((type) => (
                <div
                  key={type.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <span className="font-semibold text-primary">
                    ₦{type.value ? type.value.toLocaleString() : "0.00"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Spending pattern over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySpending}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="black" />
                <YAxis stroke="black" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "5px",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="oklch(0.424 0.199 265.638)"
                  radius={[8, 15, 0, 0]}
                  width={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsComponent;
