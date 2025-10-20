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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  useAddCompliance,
  useDeleteCompliance,
  useGetComplianceTypes,
  useUploadComplianceFiles,
} from "@/queries/compliance.queries";
import { addComplianceSchema } from "@/schema/addComplianceSchema";
import { supabase } from "@/supabse-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, FileText, Check, CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AddComplianceModal = ({
  vehicleId,
  onClose,
  activeCompliance,
  setWarnDialog,
}: {
  vehicleId?: string;
  onClose: () => void;
  activeCompliance: any;
  setWarnDialog: () => void;
}) => {
  // Queries
  // add compliance query
  const AddComplianceQuery = useAddCompliance();

  //   delete compliance query
  const DeleteCompliance = useDeleteCompliance();

  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      name: string;
      type: string;
      url: string;
      path: string;
    }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [complianceType, setComplianceType] = useState(false);
  const [fileName, setFileName] = useState("");

  const form = useForm({
    resolver: zodResolver(addComplianceSchema),
    defaultValues: {
      compliance_type: "",
      document_number: "",
      issue_date: "",
      expiry_date: "",
      status: "",
    },
  });

  const compliance_type_value = form.watch("compliance_type");

  //   Queries
  // get compliance types
  const GetComplianceTypesQuery = useGetComplianceTypes();

  //   upload compliance_files query
  const UploadComplianceFilesQuery = useUploadComplianceFiles();

  useEffect(() => {
    console.log(vehicleId);
  }, []);

  useEffect(() => {
    if (GetComplianceTypesQuery.isSuccess) {
      console.log(GetComplianceTypesQuery.data);
    }
  }, [GetComplianceTypesQuery.isSuccess]);

  // Calculate status based on dates
  const calculateStatus = (issueDate: string, expiryDate: string): string => {
    if (!issueDate || !expiryDate) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const issue = new Date(issueDate);
    issue.setHours(0, 0, 0, 0);

    // Check if issue date is in the future
    if (issue > today) {
      return "active";
    }

    // Check if already expired
    if (expiry < today) {
      return "expired";
    }

    // Calculate days until expiry
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Expiring soon if 30 days or less
    if (daysUntilExpiry <= 30) {
      return "expiring_soon";
    }

    return "active";
  };

  // Watch date fields and auto-calculate status
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "issue_date" || name === "expiry_date") {
        const { issue_date, expiry_date } = value;
        if (issue_date && expiry_date) {
          const status = calculateStatus(issue_date, expiry_date);
          form.setValue("status", status);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Cleanup function to delete files if modal is closed
  useEffect(() => {
    return () => {
      // If there are uploaded files and form wasn't submitted, delete them
      if (uploadedFiles.length > 0 && !form.formState.isSubmitSuccessful) {
        uploadedFiles.forEach((file) => {
          deleteFileFromStorage(file.path);
        });
      }
    };
  }, [uploadedFiles, form.formState.isSubmitSuccessful]);

  const deleteFileFromStorage = async (filePath: string) => {
    try {
      const { error } = await supabase.storage
        .from("compliance_documents")
        .remove([filePath]);

      if (error) {
        console.error("Error deleting file:", error);
      }
    } catch (error) {
      console.error("Error in deleteFileFromStorage:", error);
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

        // Generate unique file path
        const fileExt = file.name.split(".").pop();
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const sanitizedOriginalName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-z0-9]/gi, "_")
          .substring(0, 50);

        // Add index to ensure uniqueness even if files are uploaded at exact same millisecond
        const fileName = `${sanitizedOriginalName}_${timestamp}_${index}_${randomString}.${fileExt}`;
        const filePath = `compliance/${vehicleId}/${fileName}`;

        // set the fileName state
        // would be used to store the file name in the compliance_files table to make it easy to delete later
        setFileName(fileName);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("compliance_documents")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("compliance_documents")
          .getPublicUrl(filePath);

        toast.success(`${file.name} uploaded successfully!`, {
          id: `upload-${file.name}`,
        });

        return {
          name: file.name,
          type: file.type,
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
    console.log(data); // run a check to see if the selected compliance type already exists

    try {
      const { compliance_type, ...rest } = data;
      const complianceData = {
        ...rest,
        type_id: compliance_type,
        vehicle_id: vehicleId,
      };

      const compliancePromise = AddComplianceQuery.mutateAsync(complianceData);

      toast.promise(compliancePromise, {
        loading: "Adding compliance record...",
        success: "Compliance record added successfully!",
        error: "Failed to add compliance record",
      });

      // wait for the compliance record to submit to the db
      const result = await compliancePromise;

      // check if there are files selected
      if (uploadedFiles.length > 0) {
        const filesToInsert = uploadedFiles.map((file) => ({
          compliance_id: result.id,
          file_url: file.url,
          file_name: fileName,
        }));

        // upload files url to the compliance_files table
        const uploadPromise =
          UploadComplianceFilesQuery.mutateAsync(filesToInsert);
        toast.promise(uploadPromise, {
          loading: "Uploading documents...",
          success: "Documents uploaded successfully!",
          error: "Failed to upload documents",
        });
        await uploadPromise;
      }

      handleCloseModal();
    } catch (error: any) {
      console.error("Submit error:", error);

      // delete uploaded files in case of error
      for (const file of uploadedFiles) {
        deleteFileFromStorage(file.path);
      }
    }
  };

  const handleCloseModal = () => {
    onClose();
    form.reset();
    setUploadedFiles([]);
    setIsUploading(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "expiring_soon":
        return "text-orange-600 bg-orange-50";
      case "expired":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "expiring_soon":
        return "Expiring Soon";
      case "expired":
        return "Expired";
      default:
        return "";
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Compliance Record</DialogTitle>
        <DialogDescription>
          Add vehicle compliance documentation and details
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 py-4"
        >
          <FormField
            name="compliance_type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compliance Type</FormLabel>
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
                      {GetComplianceTypesQuery.data &&
                        GetComplianceTypesQuery.data.length > 0 &&
                        GetComplianceTypesQuery.data.map((type) => (
                          <SelectItem
                            disabled={activeCompliance.includes(type.id)}
                            key={type.id}
                            value={type.id}
                          >
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
            name="document_number"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Number</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter document number"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="issue_date"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Issue Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd") : ""
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="expiry_date"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd") : ""
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status Display (Auto-calculated) */}
          {form.watch("status") && (
            <div className="space-y-2">
              <FormLabel>Status</FormLabel>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                  form.watch("status")
                )}`}
              >
                {getStatusLabel(form.watch("status"))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <FormLabel htmlFor="documents">Upload Documents</FormLabel>

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

          <DialogFooter className="gap-4 space-x-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={
                AddComplianceQuery.isPending ||
                UploadComplianceFilesQuery.isPending ||
                isUploading ||
                uploadedFiles.length == 0
              }
            >
              {AddComplianceQuery.isPending
                ? "Adding..."
                : "Add Compliance Record"}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogContent>
  );
};

export default AddComplianceModal;
