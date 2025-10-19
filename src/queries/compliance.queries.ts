import { supabase } from "@/supabse-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddCompliance = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { data: res, error } = await supabase
        .from("vehicle_compliance")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return res;
    },
  });
};

// Delete compliance
export const useDeleteCompliance = () => {
  return useMutation({
    mutationFn: async (compliance_id) => {
      const { data, error } = await supabase
        .from("vehicle_compliance")
        .delete()
        .eq("id", compliance_id);
      if (error) throw error;
      return data;
    },
  });
};

// get compliance types
export const useGetComplianceTypes = () => {
  return useQuery({
    queryKey: ["get-compliance-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compliance_types")
        .select("*");
      if (error) throw error;
      return data;
    },
  });
};

// Upload compliance_ files
export const useUploadComplianceFiles = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { data: res, error } = await supabase
        .from("compliance_files")
        .insert(data);
      if (error) throw error;
      return res;
    },
  });
};

// Delete compliance_ files
export const useDeleteComplianceFiles = () => {
  return useMutation({
    mutationFn: async (compliance_id) => {
      const { data: res, error } = await supabase
        .from("compliance_files")
        .delete()
        .eq("compliance_id", compliance_id);
      if (error) throw error;
      return res;
    },
  });
};

// Get vehicle compliance
export const useGetVehicleCompliance = (vehicle_id) => {
  return useQuery({
    queryKey: ["get-compliance-data", vehicle_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_compliance")
        .select(
          `
          id,
            type_id,
            document_number,
            issue_date,
            expiry_date,
            status,
            created_at,
            compliance_types ( name ),
            vehicles (plate_number),
            compliance_files (
            id,
            compliance_id,
      file_url,
      file_name
    )
            `
        )
        .eq("vehicle_id", vehicle_id);

      if (error) throw error;
      return data;
    },
  });
};

// get compliance files
export const useGetComplianceFiles = (vehicle_compliance_id) => {
  return useQuery({
    queryKey: ["get-compliance-files", vehicle_compliance_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compliance_files")
        .select("*");
    },
  });
};

// get compliance by vehicle id
// export const useGetComplianceByVehicleId = (data) => {
//   const vehicle_id = data.vehicleId;
//   const type_id = data.compliance_type_value;
//   return useQuery({
//     queryKey: ["get-compliance-by-vehicle-id", vehicle_id, type_id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("vehicle_compliance")
//         .select()
//         .eq("vehicle_id", vehicle_id)
//         .eq("type_id", type_id);
//       if (error) return error;
//       return data;
//     },
//   });
// };
