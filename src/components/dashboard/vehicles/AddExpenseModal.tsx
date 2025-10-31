"use client";
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
import {
  useAddExpenses,
  useUploadExpensesFiles,
} from "@/queries/expense.queries";
import { addExpenseSchema } from "@/schema/addExpenseSchema";
import { supabase } from "@/supabse-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, FileText, Image as ImageIcon, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { compressImage } from "@/utils/imageCompressor";

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
  vehicleId?: string;
  onClose: () => void;
}) => {
  // Add expenses query
  const AddExpensesQuery = useAddExpenses();

  const UploadExpenseFilesQuery = useUploadExpensesFiles();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [invoiceUrl, setInvoiceUrl] = useState<string>("");
  const [invoicePath, setInvoicePath] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    type: string;
  } | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      name: string;
      type: string;
      url: string;
      path: string;
    }>
  >([]);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      expense_type: "",
      description: "",
      amount: "",
      vehicle_millage: "",
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
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setIsUploading(true);

    // Process all files in parallel
    const uploadPromises = files.map(async (file, index) => {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: File size must be less than 5MB`);
        return null;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Only PDF, JPG, and PNG files are allowed`);
        return null;
      }

      try {
        toast.loading(`Uploading ${file.name}...`, {
          id: `upload-${file.name}`,
        });

        // compress file
        const compressedFile = await compressImage(file);

        // Generate unique file path
        const fileExt = compressedFile.name.split(".").pop();
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const sanitizedOriginalName = compressedFile.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-z0-9]/gi, "_")
          .substring(0, 50);

        // Add index to ensure uniqueness even if files are uploaded at exact same millisecond
        const fileName = `${sanitizedOriginalName}_${timestamp}_${index}_${randomString}.${fileExt}`;
        const filePath = `invoices/${vehicleId}/${fileName}`;

        // set the fileName statestate
        // would be used to store the file name in the compliance_files table to make it easy to delete later
        setFileName(fileName);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("invoices")
          .upload(filePath, compressedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("invoices")
          .getPublicUrl(filePath);

        toast.success(`${compressedFile.name} uploaded successfully!`, {
          id: `upload-${compressedFile.name}`,
        });

        return {
          name: compressedFile.name,
          type: compressedFile.type,
          url: urlData.publicUrl,
          path: filePath,
        };
      } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(error.message || `Failed to upload ${file.name}`, {
          id: `upload-${file.name}`,
        });
        return null;
      }
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Filter out failed uploads (null values) and add successful ones to state
    const successfulUploads = results.filter((result) => result !== null);
    setUploadedFiles((prev) => [...prev, ...successfulUploads]);

    setIsUploading(false);
    e.target.value = ""; // reset input
  };

  const deleteFileFromStorage = async (filePath: string) => {
    try {
      const { error } = await supabase.storage
        .from("invoices")
        .remove([filePath]);

      if (error) {
        console.error("Error deleting file:", error);
      }
    } catch (error) {
      console.error("Error in deleteFileFromStorage:", error);
    }
  };

  const handleRemoveFile = async (index: number) => {
    const file = uploadedFiles[index];
    if (!file) return;

    try {
      await deleteFileFromStorage(file.path);

      // Remove from state
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    } catch (error: any) {
      console.error("Remove error:", error);
      toast.error(error.message || "Failed to remove file");
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      // Prepare expense data
      const expenseData = { ...data, vehicle_id: vehicleId };

      const promise = AddExpensesQuery.mutateAsync(expenseData);

      toast.promise(promise, {
        loading: "Adding expense...",
        success: "Expense added successfully!",
        error: "Failed to add expense",
      });

      const result = await promise;

      if (uploadedFiles.length > 0) {
        const filesToInsert = uploadedFiles.map((file) => ({
          expenses_id: result.id,
          file_url: file.url,
          file_name: fileName,
        }));

        // upload files url to the expenses_files table
        const uploadPromise =
          UploadExpenseFilesQuery.mutateAsync(filesToInsert);
        toast.promise(uploadPromise, {
          loading: "Uploading documents...",
          success: "Documents uploaded successfully!",
          error: "Failed to upload documents",
        });
        await uploadPromise;

        // ✅ Once both the compliance and files are done:
        // refetch compliance data for the vehicle
        // just refetch the compliance types for
        await queryClient.refetchQueries({
          queryKey: ["get-vehicle-expenses", result.vehicle_id],
        });

        await queryClient.refetchQueries({
          queryKey: ["total-amount-spent-on-vehicle", result.vehicle_id],
        });
      }

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
    setUploadedFiles([]);
    setIsUploading(false);
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
            name="vehicle_mileage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Mileage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5000"
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

            {/* Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                id="documents"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <label htmlFor="documents" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload documents</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, PNG (Max 5MB each)
                </p>
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                {uploadedFiles.map((file, index) => {
                  const isImage = file.type.startsWith("image/");
                  const isPDF = file.type === "application/pdf";

                  return (
                    <div
                      key={index}
                      className="border border-border rounded-lg p-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Preview */}
                        <div className="flex-shrink-0">
                          {isImage ? (
                            <div className="relative w-16 h-16 rounded overflow-hidden border border-border">
                              <Image
                                src={file.url}
                                alt={file.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : isPDF ? (
                            <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                          ) : null}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="block w-40 overflow-hidden whitespace-nowrap text-ellipsis text-sm font-medium">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Check className="h-3 w-3 text-green-600" />
                            <p className="text-xs text-green-600">Uploaded</p>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline mt-1 inline-block"
                          >
                            View file
                          </a>
                        </div>

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
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
              disabled={
                AddExpensesQuery.isPending ||
                UploadExpenseFilesQuery.isPending ||
                isUploading ||
                uploadedFiles.length == 0
              }
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
