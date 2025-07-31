import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Settings,
  FileText,
  Calendar,
  BarChart3,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ModuleNavigator } from "@/components/ModuleNavigator";

export const TechnicalDashboard = (): JSX.Element => {
  const handleModuleChange = (moduleId: string) => {
    switch (moduleId) {
      case "crewing":
        // Navigation to crewing module will be implemented when available
        console.log("Navigate to crewing module");
        break;
      case "technical-pms":
        // Already in technical module
        break;
      default:
        break;
    }
  };

  // Sample data for PMS dashboard
  const stats = [
    {
      title: "Overdue Tasks",
      value: "12",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Due This Week",
      value: "28",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Completed Today",
      value: "15",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Equipment",
      value: "247",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      task: "Main Engine Cylinder Oil Analysis",
      equipment: "Main Engine #1",
      status: "completed",
      date: "2025-01-31",
      priority: "high",
    },
    {
      id: 2,
      task: "Fresh Water Generator Maintenance",
      equipment: "FW Generator #2",
      status: "in-progress",
      date: "2025-01-31",
      priority: "medium",
    },
    {
      id: 3,
      task: "Fire Pump Performance Test",
      equipment: "Emergency Fire Pump",
      status: "overdue",
      date: "2025-01-29",
      priority: "high",
    },
    {
      id: 4,
      task: "Ballast Pump Filter Cleaning",
      equipment: "Ballast Pump #1",
      status: "pending",
      date: "2025-02-02",
      priority: "low",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <ModuleNavigator currentModule="technical-pms" onModuleChange={handleModuleChange} />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Technical Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Planned Maintenance System (PMS) Dashboard
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Maintenance Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {activity.task}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.equipment} • {activity.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(activity.priority)}>
                        {activity.priority}
                      </Badge>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/maintenance/new">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Maintenance Task
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/equipment">
                  <Wrench className="h-4 w-4 mr-2" />
                  Manage Equipment
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/schedule">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reports
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDashboard;