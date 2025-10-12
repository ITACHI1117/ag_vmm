import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddExpenses } from "@/queries/expense.queries";
import { addExpenseSchema } from "@/schema/addExpenseSchema";
import { supabase } from "@/supabse-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, FileText, Image as ImageIcon, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

const expenseTypes = [
  { id: 1, name: "Oil Change", value: "oil_change" },
  { id: 2, name: "Tire Replacement", value: "tire_replacement" },
  { id: 3, name: "Brake Service", value: "brake_service" },
  { id: 4, name: "Engine Repair", value: "engine_repair" },
  { id: 5, name: "Battery", value: "battery" },
  { id: 6, name: "Maintenance", value: "maintenance" },
  { id: 7, name: "Fuel", value: "fuel" },
  { id: 8, name: "Insurance", value: "insurance" },
  { id: 9, name: "Other", value: "other" },
];

const AddExpenseModal = ({
  vehicleId,
  onClose,
}: {
  vehicleId?: number;
  onClose: () => void;
}) => {
  const AddExpensesQuery = useAddExpenses();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [invoiceUrl, setInvoiceUrl] = useState<string>("");
  const [invoicePath, setInvoicePath] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    type: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      expense_type: "",
      description: "",
      amount: "",
    },
  });

  // Cleanup function to delete invoice if modal is closed
  useEffect(() => {
    return () => {
      // If there's an uploaded file and form wasn't submitted, delete it
      if (invoicePath && !form.formState.isSubmitSuccessful) {
        deleteInvoiceFromStorage(invoicePath);
      }
    };
  }, [invoicePath, form.formState.isSubmitSuccessful]);

  const deleteInvoiceFromStorage = async (filePath: string) => {
    try {
      const { error } = await supabase.storage
        .from("invoices")
        .remove([filePath]);

      if (error) {
        console.error("Error deleting file:", error);
      }
    } catch (error) {
      console.error("Error in deleteInvoiceFromStorage:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, and PNG files are allowed");
        return;
      }

      try {
        // Start progress
        setUploadProgress(10);
        toast.loading("Uploading invoice...", { id: "upload-toast" });

        // Create unique file path
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `invoices/${fileName}`;

        setUploadProgress(30);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("invoices")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        setUploadProgress(70);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("invoices")
          .getPublicUrl(filePath);

        setUploadProgress(90);

        // Save file info
        setInvoiceUrl(urlData.publicUrl);
        console.log(urlData.publicUrl);
        setInvoicePath(filePath);
        setUploadedFile({
          name: file.name,
          type: file.type,
        });

        setUploadProgress(100);

        // Success toast
        toast.success("Invoice uploaded successfully!", { id: "upload-toast" });

        // Reset progress after delay
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      } catch (error: any) {
        console.error("Upload error:", error);
        setUploadProgress(0);
        toast.error(error.message || "Failed to upload invoice", {
          id: "upload-toast",
        });
      }
    }
  };

  const handleRemoveInvoice = async () => {
    if (!invoicePath) return;

    try {
      // toast.loading("Removing invoice...", { id: "remove-toast" });

      await deleteInvoiceFromStorage(invoicePath);

      // Reset state
      setInvoiceUrl("");
      setInvoicePath("");
      setUploadedFile(null);
      setUploadProgress(0);

      // toast.success("Invoice removed successfully!", { id: "remove-toast" });
    } catch (error: any) {
      console.error("Remove error:", error);
      toast.error(error.message || "Failed to remove invoice", {
        id: "remove-toast",
      });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      // Prepare expense data
      const expenseData = invoiceUrl
        ? { ...data, invoice_url: invoiceUrl, vehicle_id: vehicleId }
        : { ...data, vehicle_id: vehicleId };

      const promise = AddExpensesQuery.mutateAsync(expenseData);

      toast.promise(promise, {
        loading: "Adding expense...",
        success: "Expense added successfully!",
        error: "Failed to add expense",
      });

      await promise;

      handleCloseModal();
    } catch (error: any) {
      // If submission fails, delete the uploaded file
      if (invoicePath) {
        await deleteInvoiceFromStorage(invoicePath);
      }
      console.error("Submit error:", error);
    }
  };

  const isImage = uploadedFile?.type.startsWith("image/");
  const isPDF = uploadedFile?.type === "application/pdf";

  const handleCloseModal = () => {
    onClose();
    form.reset();
    // Reset state
    setInvoiceUrl("");
    setInvoicePath("");
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogDescription>
          Record a maintenance expense with invoice
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 py-4"
        >
          <FormField
            name="expense_type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expense Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {expenseTypes.map((type) => (
                        <SelectItem key={type.id} value={type.value}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₦)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="15000"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of service"
                    {...field}
                    className="w-full max-h-32"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="invoice">Upload Invoice</Label>

            {!uploadedFile ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  id="invoice"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadProgress > 0 && uploadProgress < 100}
                />
                <label htmlFor="invoice" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload invoice</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG (Max 5MB)
                  </p>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-3 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {isImage ? (
                      <div className="relative w-20 h-20 rounded overflow-hidden border border-border">
                        <Image
                          src={invoiceUrl}
                          alt="Invoice preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : isPDF ? (
                      <div className="w-20 h-20 rounded bg-muted flex items-center justify-center">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                      </div>
                    ) : null}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="block w-40 overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium">
                      {uploadedFile.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Check className="h-3 w-3 text-green-600" />
                      <p className="text-xs text-green-600">
                        Uploaded successfully
                      </p>
                    </div>
                    <a
                      href={invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    />
                    View full size
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveInvoice}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-4 space-x-2 sm:gap-0 cursor-pointer">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={AddExpensesQuery.isPending}
            >
              {AddExpensesQuery.isPending ? "Adding..." : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogContent>
  );
};

export default AddExpenseModal;
