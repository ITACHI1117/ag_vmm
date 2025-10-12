const AddExpenseModal = ({
  vehicleId,
  onClose,
}: {
  vehicleId?: number;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    vehicleId: vehicleId?.toString() || "",
    date: "",
    type: "",
    amount: "",
    description: "",
    invoice: null as File | null,
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, invoice: e.target.files[0] });
      // Simulate upload to Supabase
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleSubmit = () => {
    console.log("Adding expense:", formData);
    alert("Expense added successfully!");
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogDescription>
          Record a maintenance expense with invoice
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        {!vehicleId && (
          <div className="space-y-2">
            <Label htmlFor="vehicle">Select Vehicle</Label>
            <select
              id="vehicle"
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              value={formData.vehicleId}
              onChange={(e) =>
                setFormData({ ...formData, vehicleId: e.target.value })
              }
            >
              <option value="">Choose a vehicle</option>
              {mockVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Expense Type</Label>
          <select
            id="type"
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Select type</option>
            {expenseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="15000"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Brief description of the service"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoice">Upload Invoice</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
            <input
              id="invoice"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="invoice" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              {formData.invoice ? (
                <div>
                  <p className="text-sm font-medium">{formData.invoice.name}</p>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  {uploadProgress === 100 && (
                    <p className="text-xs text-green-600 mt-1">
                      Upload complete!
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">Click to upload invoice</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add Expense</Button>
      </DialogFooter>
    </DialogContent>
  );
};
