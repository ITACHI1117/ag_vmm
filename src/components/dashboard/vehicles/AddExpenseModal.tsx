import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useState } from "react";

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

const expenseTypes = [
  { id: 1, name: "Oil Change", value: 45000, color: "#6366f1" },
  { id: 2, name: "Tire Replacement", value: 125000, color: "#8b5cf6" },
  { id: 3, name: "Brake Service", value: 78000, color: "#ec4899" },
  { id: 4, name: "Engine Repair", amount: 210000, color: "#f59e0b" },
  { id: 5, name: "Battery", value: 52000, color: "#10b981" },
];

const AddExpenseModal = ({
  vehicleId,
  onClose,
}: {
  vehicleId?: number;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    vehicleId: vehicleId?.toString() || "",
    date: "",
    type: "",
    amount: "",
    description: "",
    invoice: null as File | null,
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, invoice: e.target.files[0] });
      // Simulate upload to Supabase
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleSubmit = () => {
    console.log("Adding expense:", formData);
    alert("Expense added successfully!");
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogDescription>
          Record a maintenance expense with invoice
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        {!vehicleId && (
          <div className="space-y-2">
            <Label htmlFor="vehicle">Select Vehicle</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value) =>
                setFormData({ ...formData, vehicleId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {mockVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Expense Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {expenseTypes.map((type) => (
                <SelectItem key={type.id} value={type.value && type.value}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="15000"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Brief description of the service"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoice">Upload Invoice</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
            <input
              id="invoice"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="invoice" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              {formData.invoice ? (
                <div>
                  <p className="text-sm font-medium">{formData.invoice.name}</p>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  {uploadProgress === 100 && (
                    <p className="text-xs text-green-600 mt-1">
                      Upload complete!
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">Click to upload invoice</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add Expense</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddExpenseModal;
