import VehicleDetailsComponent from "@/components/dashboard/vehicles/VehiclesDetailsComponent";

interface VehiclePageProps {
  params: {
    id: string;
  };
}

export default function VehicleDetailPage({ params }: VehiclePageProps) {
  const { id } = params;
  return <VehicleDetailsComponent vehicleId={id} />;
}
