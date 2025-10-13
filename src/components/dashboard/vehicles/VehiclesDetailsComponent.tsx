import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Download, Eye, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import AddExpenseModal from "./AddExpenseModal";
import {
  useGetTotalAmountSpentOnVehicle,
  useGetVehicle,
} from "@/queries/vehicle.queries";
import { useGetVehicleExpenses } from "@/queries/expense.queries";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { MonthDayYear } from "@/lib/formatDate";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
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

const VehicleDetailsComponent = ({
  vehicleId,
  handleNavigation,
}: {
  vehicleId: number;
  handleNavigation: () => void;
}) => {
  const vehicle = mockVehicles.find((v) => v.id === 1);
  const vehicleExpenses = mockExpenses.filter((e) => e.vehicleId === 1);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState();

  // Get Vehicle Query
  const GetVehicleQuery = useGetVehicle(vehicleId);

  // Get Vehicle Expenses
  // debounce searchTerm
  const debounceSearchTerm = useDebounce(searchTerm, 500);
  const GetVehicleExpensesQuery = useGetVehicleExpenses(
    debounceSearchTerm,
    vehicleId
  );

  // Get Total amount Spent on Vehicle
  const GetTotalAmountSpentOnVehicleQuery =
    useGetTotalAmountSpentOnVehicle(vehicleId);

  useEffect(() => {
    if (GetVehicleExpensesQuery.isSuccess) {
      console.log(GetVehicleExpensesQuery.data);
    }
  }, [GetVehicleExpensesQuery.isSuccess]);

  if (GetVehicleQuery.isPending) return <div>Loading...</div>;
  if (!vehicle) return <div>Vehicle not found</div>;

  const handleExport = (format: "csv" | "pdf") => {
    console.log(`Exporting ${format} for vehicle ${vehicle.plateNumber}`);
    alert(
      `Exporting ${format.toUpperCase()} report for ${vehicle.plateNumber}`
    );
  };

  const { push } = useProgressBarNavigation();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => handleNavigation()}
            className="mb-2 -ml-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vehicles
          </Button>
          <h1 className="text-3xl font-bold">
            {GetVehicleQuery.data && GetVehicleQuery.data.plate_number}
          </h1>
          <p className="text-muted-foreground mt-1">
            {GetVehicleQuery.data && GetVehicleQuery.data.make}{" "}
            {GetVehicleQuery.data && GetVehicleQuery.data.model} (
            {GetVehicleQuery.data && GetVehicleQuery.data.year})
          </p>
        </div>

        {/* Vehicle Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plate Number</p>
                <p className="text-lg font-semibold">
                  {GetVehicleQuery.data && GetVehicleQuery.data.plate_number}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Make</p>
                <p className="text-lg font-semibold">
                  {GetVehicleQuery.data && GetVehicleQuery.data.make}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="text-lg font-semibold">
                  {GetVehicleQuery.data && GetVehicleQuery.data.model}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="text-lg font-semibold">
                  {GetVehicleQuery.data && GetVehicleQuery.data.year}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Total Amount Spent
              </p>
              <p className="text-3xl font-bold text-primary mt-1">
                ₦
                {GetTotalAmountSpentOnVehicleQuery.data
                  ? GetTotalAmountSpentOnVehicleQuery.data.toLocaleString()
                  : "0.00"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <AddExpenseModal
              vehicleId={vehicleId}
              onClose={() => setIsAddExpenseOpen(false)}
            />
          </Dialog>
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("pdf")}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

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
              {/* Search */}
              {/* <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div> */}

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
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {GetVehicleExpensesQuery.data &&
                  GetVehicleExpensesQuery.data.length > 0 ? (
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
                          {expense.description}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(expense.invoice_url)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {expense.invoice}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <h1>No Expense Data</h1>
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

export default VehicleDetailsComponent;
