const AddAdminModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const handleSubmit = () => {
    console.log("Sending invite to:", formData);
    alert(`Invitation sent to ${formData.email}!`);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogDescription>
          Send an invitation email to new admin
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="adminName">Full Name</Label>
          <Input
            id="adminName"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminEmail">Email Address</Label>
          <Input
            id="adminEmail"
            type="email"
            placeholder="admin@aginsurance.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminRole">Role</Label>
          <select
            id="adminRole"
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="">Select role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
        <Alert>
          <AlertDescription>
            An invitation email will be sent to this address with setup
            instructions.
          </AlertDescription>
        </Alert>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Send Invitation</Button>
      </DialogFooter>
    </DialogContent>
  );
};
