import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { ComplianceCard } from "./ComplianceCard";
import { useGetVehicleCompliance } from "@/queries/compliance.queries";

export const VehicleComplianceComponent = ({ GetComplianceDataQuery }) => {
  return (
    <>
      {/* Vehicle Compliance Section */}
      <div>
        <h1 className="text-3xl font-bold">Vehicle Compliance</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your vehicle compliance
        </p>
      </div>

      {GetComplianceDataQuery.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : GetComplianceDataQuery.isError ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Failed to load compliance data
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => GetComplianceDataQuery.refetch()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : !GetComplianceDataQuery.data ||
        GetComplianceDataQuery.data.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No compliance records found for this vehicle
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GetComplianceDataQuery.data.map((compliance) => (
            <ComplianceCard key={compliance.id} compliance={compliance} />
          ))}
        </div>
      )}
    </>
  );
};
