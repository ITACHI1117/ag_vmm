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
import { useState } from "react";

export const AddVehicleModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    plateNumber: "",
    make: "",
    model: "",
    year: "",
  });

  const handleSubmit = () => {
    console.log("Adding vehicle:", formData);
    alert(`Vehicle ${formData.plateNumber} added successfully!`);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogDescription>Enter the vehicle details below</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="plateNumber">Plate Number</Label>
          <Input
            id="plateNumber"
            placeholder="ABC-1234"
            value={formData.plateNumber}
            onChange={(e) =>
              setFormData({ ...formData, plateNumber: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            placeholder="Toyota"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            placeholder="Corolla"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            placeholder="2020"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add Vehicle</Button>
      </DialogFooter>
    </DialogContent>
  );
};
