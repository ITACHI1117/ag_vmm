const VehiclesPage = ({
  onNavigate,
}: {
  onNavigate: (page: string, vehicleId?: number) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredVehicles = mockVehicles.filter(
    (v) =>
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => onNavigate("dashboard")}
              className="mb-2 -ml-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Vehicles</h1>
            <p className="text-muted-foreground mt-1">
              Manage your fleet vehicles
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <AddVehicleModal onClose={() => setIsAddModalOpen(false)} />
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by plate number or make..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

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
                      Total Spent
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => onNavigate("vehicle-details", vehicle.id)}
                    >
                      <td className="py-4 px-6 font-medium">
                        {vehicle.plateNumber}
                      </td>
                      <td className="py-4 px-6">{vehicle.make}</td>
                      <td className="py-4 px-6">{vehicle.model}</td>
                      <td className="py-4 px-6">{vehicle.year}</td>
                      <td className="py-4 px-6 font-medium">
                        ₦{vehicle.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("vehicle-details", vehicle.id);
                          }}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
