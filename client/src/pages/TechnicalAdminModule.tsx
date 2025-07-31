import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Database,
  Users,
  FileText,
  Wrench,
  Calendar,
  BarChart3,
  Shield,
} from "lucide-react";
import { ModuleNavigator } from "@/components/ModuleNavigator";

export const TechnicalAdminModule = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("system");

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

  const systemSettings = [
    {
      title: "Maintenance Schedules",
      description: "Configure maintenance intervals and scheduling rules",
      icon: Calendar,
      status: "active",
    },
    {
      title: "Equipment Categories",
      description: "Manage equipment types and classifications",
      icon: Wrench,
      status: "active",
    },
    {
      title: "Report Templates",
      description: "Customize maintenance and inspection report formats",
      icon: FileText,
      status: "active",
    },
    {
      title: "User Permissions",
      description: "Control access levels for different user roles",
      icon: Shield,
      status: "active",
    },
  ];

  const dataManagement = [
    {
      title: "Equipment Database",
      description: "Import and manage equipment master data",
      icon: Database,
      recordCount: "247 items",
    },
    {
      title: "Maintenance History",
      description: "Historical maintenance records and analytics",
      icon: BarChart3,
      recordCount: "1,234 records",
    },
    {
      title: "Spare Parts Catalog",
      description: "Manage spare parts inventory and associations",
      icon: Wrench,
      recordCount: "856 parts",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <ModuleNavigator currentModule="technical-pms" onModuleChange={handleModuleChange} />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Technical Module Administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure and manage PMS system settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="system">System Settings</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {systemSettings.map((setting, index) => {
                const Icon = setting.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span>{setting.title}</span>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {setting.status}
                            </Badge>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {setting.description}
                      </p>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {dataManagement.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {item.description}
                            </p>
                            <Badge variant="secondary">{item.recordCount}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Import
                          </Button>
                          <Button variant="outline" size="sm">
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  User Role Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Chief Engineer
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Full access to all technical systems and maintenance planning
                      </p>
                    </div>
                    <Badge variant="default">Admin</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Engineering Officers
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Access to maintenance execution and basic reporting
                      </p>
                    </div>
                    <Badge variant="secondary">Standard</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Ratings/Motormen
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Limited access to assigned maintenance tasks only
                      </p>
                    </div>
                    <Badge variant="outline">Limited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Dashboard */}
        <div className="mt-8 flex justify-start">
          <Button variant="outline" asChild>
            <Link href="/">
              ← Back to Technical Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAdminModule;