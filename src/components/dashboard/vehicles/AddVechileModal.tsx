import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddVehicle } from "@/queries/vehicle.queries";
import { addVehicleSchema, Vehicle } from "@/schema/addVehicleSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export const AddVehicleModal = ({ onClose }: { onClose: () => void }) => {
  const AddVehicleQuery = useAddVehicle();
  const [formData, setFormData] = useState({
    plateNumber: "",
    make: "",
    model: "",
    year: "",
  });

  const form = useForm({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      plateNumber: "",
      make: "",
      model: "",
      year: "",
    },
  });

  const Submit = async (data) => {
    // submit
    const { plateNumber, ...rest } = data;
    const promise = AddVehicleQuery.mutateAsync({
      plate_number: plateNumber,
      ...rest,
    });

    toast.promise(promise, {
      loading: "Submitting Vehicle Information..",
    });
    // wait for promise to finish before closing modal
    const result = await promise;
    console.log(result.message);

    form.reset();
    onClose();
  };

  useEffect(() => {
    if (AddVehicleQuery.isSuccess) {
      toast.success("Submitted");
    }
  }, [AddVehicleQuery.isSuccess]);

  useEffect(() => {
    if (AddVehicleQuery.isError) {
      toast.error(`${AddVehicleQuery.error.message}`);
      console.log(AddVehicleQuery.error);
    }
  }, [AddVehicleQuery.isError]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogDescription>Enter the vehicle details below</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(Submit)}
            className="gap-4 flex flex-col"
          >
            <FormField
              control={form.control}
              name="plateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plate Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="AG-123X-L"
                      {...field}
                      // className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Honda"
                      {...field}
                      // className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Accord"
                      {...field}
                      // className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="2025"
                      {...field}
                      // className="w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="cursor-pointer" type="submit">
              Add Vehicle
            </Button>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </form>
        </FormProvider>
      </div>
    </DialogContent>
  );
};
