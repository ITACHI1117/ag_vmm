"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useProgressBarNavigation from "@/hooks/useProgressBarNavigator";
import { ArrowLeft, Plus, Search, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { AddVehicleModal } from "./AddVechileModal";
import VehicleDetailsComponent from "./VehiclesDetailsComponent";
import { useGetAllVehicles } from "@/queries/vehicle.queries";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";

export const VehiclesComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("allVehicles");
  const [vehicleId, setVehicleId] = useState<string>("1");

  // Get all vehicles Query
  // debounce searchTerm
  const debounceSearchTerm = useDebounce(searchTerm, 500);
  const GetAllVehiclesQuery = useGetAllVehicles(debounceSearchTerm);

  const { push } = useProgressBarNavigation();

  const handleNavigation = (vehicleId: string) => {
    push(`/dashboard/vehicles/vehicle/${vehicleId}`);
    // if (currentScreen == "allVehicles") {
    //   setCurrentScreen("VehicleDetail");
    // } else {
    //   setCurrentScreen("allVehicles");
    // }
  };

  const handleRetry = () => {
    GetAllVehiclesQuery.refetch();
  };

  // Show vehicle details screen
  if (currentScreen == "VehicleDetail") {
    return (
      <VehicleDetailsComponent
        vehicleId={vehicleId}
        // handleNavigation={handleNavigation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
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

        {/* Error Alert */}
        {GetAllVehiclesQuery.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Vehicles</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                There was a problem loading the vehicles. Please try again.
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by plate number, make or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={GetAllVehiclesQuery.isLoading}
          />
        </div>

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
                      Created At
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
                  {GetAllVehiclesQuery.isLoading ? (
                    // Skeleton rows
                    [...Array(5)].map((_, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-20" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-16" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-28" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-5 w-24" />
                        </td>
                        <td className="py-4 px-6">
                          <Skeleton className="h-8 w-24" />
                        </td>
                      </tr>
                    ))
                  ) : GetAllVehiclesQuery.isError ? (
                    // Error state
                    <tr>
                      <td colSpan={7} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Failed to load vehicles
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRetry}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : !GetAllVehiclesQuery.data ||
                    GetAllVehiclesQuery.data.length === 0 ? (
                    // Empty state
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground mb-2">
                            {searchTerm
                              ? "No vehicles found matching your search"
                              : "No vehicles found"}
                          </p>
                          {searchTerm && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearchTerm("")}
                              className="mt-2"
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Data rows
                    GetAllVehiclesQuery.data.map((vehicle) => (
                      <tr
                        key={vehicle.id}
                        className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setVehicleId(vehicle.id);
                          handleNavigation(vehicle.id);
                        }}
                      >
                        <td className="py-4 px-6 font-medium">
                          {vehicle.plate_number}
                        </td>
                        <td className="py-4 px-6">{vehicle.make}</td>
                        <td className="py-4 px-6">{vehicle.model}</td>
                        <td className="py-4 px-6">{vehicle.year}</td>
                        <td className="py-4 px-6">
                          {vehicle.users?.full_name || "N/A"}
                        </td>

                        <td className="py-4 px-6">
                          {format(new Date(vehicle.created_at), "MMM dd, yyyy")}
                        </td>
                        <td className="py-4 px-6 font-medium">
                          ₦
                          {vehicle.expenses && vehicle.expenses.length > 0
                            ? vehicle.expenses
                                .reduce((sum, item) => sum + item.amount, 0)
                                .toLocaleString()
                            : "0.00"}
                        </td>
                        <td className="py-4 px-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVehicleId(vehicle.id);
                              handleNavigation(vehicle.id);
                            }}
                          >
                            View Details
                          </Button>
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
