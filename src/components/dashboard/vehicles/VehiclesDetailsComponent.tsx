import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Download, Eye, Plus, Search, Trash } from "lucide-react";
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
import AddComplianceModal from "./AddComplianceModal";
import { ComplianceCard } from "./ComplianceCard";
import { useGetVehicleCompliance } from "@/queries/compliance.queries";

// Mock Data
const mockComplianceData = [
  {
    id: 1,
    vehiclePlateNumber: "ABC-1234",
    complianceType: "Insurance",
    documentNumber: "INS-2024-001",
    issueDate: "2024-01-15",
    expiryDate: "2025-01-15",
    createdAt: "2024-01-10",
    status: "active",
    documents: [
      {
        id: 1,
        name: "insurance-certificate.pdf",
        url: "https://example.com/doc1.pdf",
        type: "application/pdf",
      },
      {
        id: 2,
        name: "insurance-photo.jpg",
        url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
        type: "image/jpeg",
      },
    ],
  },
  {
    id: 2,
    vehiclePlateNumber: "XYZ-5678",
    complianceType: "Road Worthiness",
    documentNumber: "RW-2024-045",
    issueDate: "2024-03-20",
    expiryDate: "2025-03-20",
    createdAt: "2024-03-15",
    status: "expiring_soon",
    documents: [
      {
        id: 3,
        name: "roadworthiness-cert.pdf",
        url: "https://example.com/doc2.pdf",
        type: "application/pdf",
      },
      {
        id: 4,
        name: "vehicle-inspection.jpg",
        url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
        type: "image/jpeg",
      },
      {
        id: 5,
        name: "inspection-report.docx",
        url: "https://example.com/doc3.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ],
  },
  {
    id: 3,
    vehiclePlateNumber: "DEF-9012",
    complianceType: "Vehicle License",
    documentNumber: "VL-2024-089",
    issueDate: "2024-02-10",
    expiryDate: "2024-11-10",
    createdAt: "2024-02-05",
    status: "expired",
    documents: [
      {
        id: 6,
        name: "license-document.pdf",
        url: "https://example.com/doc4.pdf",
        type: "application/pdf",
      },
    ],
  },
];

const VehicleDetailsComponent = ({
  vehicleId,
  handleNavigation,
}: {
  vehicleId: number;
  handleNavigation: () => void;
}) => {
  // const vehicle = mockVehicles.find((v) => v.id === 1);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddComplianceOpen, setIsAddComplianceOpen] = useState(false);
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

  // Get Compliance Data
  const GetComplianceDataQuery = useGetVehicleCompliance(vehicleId);

  useEffect(() => {
    if (GetComplianceDataQuery.isSuccess) {
      console.log(GetComplianceDataQuery.data);
    }
  }, [GetComplianceDataQuery.isSuccess]);

  if (GetVehicleQuery.isPending) return <div>Loading...</div>;
  // if (!vehicle) return <div>Vehicle not found</div>;

  // const handleExport = (format: "csv" | "pdf") => {
  //   console.log(`Exporting ${format} for vehicle ${vehicle.plateNumber}`);
  //   alert(
  //     `Exporting ${format.toUpperCase()} report for ${vehicle.plateNumber}`
  //   );
  // };

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
          <Dialog
            open={isAddComplianceOpen}
            onOpenChange={setIsAddComplianceOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle Compliance
              </Button>
            </DialogTrigger>
            <AddComplianceModal
              vehicleId={vehicleId}
              onClose={() => setIsAddComplianceOpen(false)}
            />
          </Dialog>
          <Button
            variant="outline"
            // onClick={() => handleExport("csv")}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            // onClick={() => handleExport("pdf")}
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
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => push(expense.invoice_url)}
                          >
                            <Trash className="h-4 w-4 mr-1 text-red-500" />
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
        <div>
          <h1 className="text-3xl font-bold">Vehicle Compliance</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your vehicle compliance
          </p>
        </div>
        {GetComplianceDataQuery.data &&
        GetComplianceDataQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GetComplianceDataQuery.data.map((compliance) => (
              <ComplianceCard key={compliance.id} compliance={compliance} />
            ))}
          </div>
        ) : (
          <div>
            <p>No compliance found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailsComponent;
