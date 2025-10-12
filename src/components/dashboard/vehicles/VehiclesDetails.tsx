const VehicleDetailsPage = ({
  vehicleId,
  onNavigate,
}: {
  vehicleId: number;
  onNavigate: (page: string) => void;
}) => {
  const vehicle = mockVehicles.find((v) => v.id === vehicleId);
  const vehicleExpenses = mockExpenses.filter((e) => e.vehicleId === vehicleId);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  if (!vehicle) return <div>Vehicle not found</div>;

  const handleExport = (format: "csv" | "pdf") => {
    console.log(`Exporting ${format} for vehicle ${vehicle.plateNumber}`);
    alert(
      `Exporting ${format.toUpperCase()} report for ${vehicle.plateNumber}`
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => onNavigate("vehicles")}
            className="mb-2 -ml-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vehicles
          </Button>
          <h1 className="text-3xl font-bold">{vehicle.plateNumber}</h1>
          <p className="text-muted-foreground mt-1">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </p>
        </div>

        {/* Vehicle Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plate Number</p>
                <p className="text-lg font-semibold">{vehicle.plateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Make</p>
                <p className="text-lg font-semibold">{vehicle.make}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="text-lg font-semibold">{vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="text-lg font-semibold">{vehicle.year}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Total Amount Spent
              </p>
              <p className="text-3xl font-bold text-primary mt-1">
                ₦{vehicle.totalSpent.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <AddExpenseModal
              vehicleId={vehicleId}
              onClose={() => setIsAddExpenseOpen(false)}
            />
          </Dialog>
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("pdf")}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
            <CardDescription>
              All maintenance records for this vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">{expense.date}</td>
                      <td className="py-3 px-4 text-sm">{expense.type}</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        ₦{expense.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {expense.description}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {expense.invoice}
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
