"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AddVehicleModal } from "./AddVechileModal";
import VehicleDetailsComponent from "./VehiclesDetailsComponent";
import { useGetAllVehicles } from "@/queries/vehicle.queries";
import { useDebounce } from "@/hooks/useDebounce";

const mockVehicles = [
  // {
  //   id: 1,
  //   plateNumber: "ABC-1234",
  //   make: "Toyota",
  //   model: "Corolla",
  //   year: 2020,
  //   totalSpent: 125000,
  // },
  // {
  //   id: 2,
  //   plateNumber: "XYZ-5678",
  //   make: "Honda",
  //   model: "Accord",
  //   year: 2019,
  //   totalSpent: 98500,
  // },
  // {
  //   id: 3,
  //   plateNumber: "DEF-9012",
  //   make: "Ford",
  //   model: "Explorer",
  //   year: 2021,
  //   totalSpent: 156000,
  // },
];

export const VehiclesComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("allVehicles");
  const [vehicleId, setVehicleId] = useState<number>(1);

  // Get all vehicles Query
  // debounce searchTerm
  const debounceSearchTerm = useDebounce(searchTerm, 500);
  const GetAllVehiclesQuery = useGetAllVehicles(debounceSearchTerm);

  useEffect(() => {
    GetAllVehiclesQuery.isSuccess && console.log(GetAllVehiclesQuery.data);
  }, [GetAllVehiclesQuery.isSuccess]);

  const { back } = useProgressBarNavigation();

  const handleNavigation = () => {
    if (currentScreen == "allVehicles") {
      setCurrentScreen("VehicleDetail");
    } else {
      setCurrentScreen("allVehicles");
    }
  };

  if (GetAllVehiclesQuery.isPending) {
    return <h1>Loading...</h1>;
  }

  if (currentScreen == "VehicleDetail") {
    return (
      <VehicleDetailsComponent
        vehicleId={vehicleId}
        handleNavigation={handleNavigation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {/* <Button
              variant="ghost"
              onClick={() => back()}
              className="mb-2 -ml-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button> */}
            <h1 className="text-3xl font-bold">Vehicles</h1>
            <p className="text-muted-foreground mt-1">
              Manage your fleet vehicles
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <AddVehicleModal onClose={() => setIsAddModalOpen(false)} />
          </Dialog>
        </div>

        {/* Search */}
        {/* <Card>
          <CardContent className="pt-6"> */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by plate number, make or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* </CardContent>
        </Card> */}

        {/* Vehicles Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Plate Number
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Make
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Model
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Year
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Added By
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Total Spent
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {GetAllVehiclesQuery.data &&
                  GetAllVehiclesQuery.data.length > 0
                    ? GetAllVehiclesQuery.data.map((vehicle) => (
                        <tr
                          key={vehicle.id}
                          className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => {
                            setVehicleId(vehicle.id);
                            handleNavigation();
                          }}
                        >
                          <td className="py-4 px-6 font-medium">
                            {vehicle.plate_number}
                          </td>
                          <td className="py-4 px-6">{vehicle.make}</td>
                          <td className="py-4 px-6">{vehicle.model}</td>
                          <td className="py-4 px-6">{vehicle.year}</td>
                          <td className="py-4 px-6">
                            {vehicle.users.full_name}
                          </td>
                          <td className="py-4 px-6 font-medium">
                            ₦
                            {vehicle.total_spent
                              ? vehicle.total_spent.toLocaleString()
                              : "0.00"}
                          </td>
                          <td className="py-4 px-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigation();
                              }}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    : "No Vehicles Found"}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
