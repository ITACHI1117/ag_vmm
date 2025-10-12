const ReportsPage = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const handleExport = (format: "csv" | "pdf") => {
    alert(
      `Exporting ${format.toUpperCase()} report for ${
        selectedMonth === "all"
          ? selectedYear
          : `${selectedMonth} ${selectedYear}`
      }`
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive spending analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Year</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Month</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="all">All Months</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Export</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExport("csv")}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    onClick={() => handleExport("pdf")}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Vehicle</CardTitle>
            <CardDescription>
              Total maintenance costs per vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Plate Number
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Vehicle
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Total Spent
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm">
                      Expenses
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">
                        {vehicle.plateNumber}
                      </td>
                      <td className="py-3 px-4">
                        {vehicle.make} {vehicle.model}
                      </td>
                      <td className="py-3 px-4 font-semibold text-primary">
                        ₦{vehicle.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {
                          mockExpenses.filter((e) => e.vehicleId === vehicle.id)
                            .length
                        }{" "}
                        entries
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Expense Type</CardTitle>
            <CardDescription>
              Cost breakdown by maintenance category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseTypeData.map((type) => (
                <div
                  key={type.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <span className="font-semibold text-primary">
                    ₦{type.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Spending pattern over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySpending}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
