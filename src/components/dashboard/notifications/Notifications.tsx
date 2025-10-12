const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: "Insurance",
      message: "Insurance renewal due for ABC-1234",
      date: "2025-10-15",
      priority: "high",
    },
    {
      id: 2,
      type: "Maintenance",
      message: "Scheduled maintenance for XYZ-5678",
      date: "2025-10-20",
      priority: "medium",
    },
    {
      id: 3,
      type: "Insurance",
      message: "Insurance expires for DEF-9012 in 30 days",
      date: "2025-11-05",
      priority: "high",
    },
    {
      id: 4,
      type: "Maintenance",
      message: "Oil change recommended for GHI-3456",
      date: "2025-10-25",
      priority: "low",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">Reminders and alerts</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        notification.priority === "high"
                          ? "bg-destructive/10 text-destructive"
                          : notification.priority === "medium"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{notification.type}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            notification.priority === "high"
                              ? "bg-destructive/10 text-destructive"
                              : notification.priority === "medium"
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Due: {notification.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
