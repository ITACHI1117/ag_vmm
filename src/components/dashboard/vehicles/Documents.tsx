const DocumentsPage = () => {
  const allDocuments = mockExpenses.map((expense) => ({
    ...expense,
    vehicle: mockVehicles.find((v) => v.id === expense.vehicleId),
  }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground mt-1">
              All uploaded invoices and documents
            </p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Invoice #
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Vehicle
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium">{doc.invoice}</td>
                      <td className="py-4 px-6">{doc.vehicle?.plateNumber}</td>
                      <td className="py-4 px-6">{doc.type}</td>
                      <td className="py-4 px-6">{doc.date}</td>
                      <td className="py-4 px-6 font-medium">
                        ₦{doc.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
