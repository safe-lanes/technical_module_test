
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Wrench, Calendar, FileText, BarChart3 } from "lucide-react";
import { ModuleNavigator } from "@/components/ModuleNavigator";
import { useLocation } from "wouter";

export function TechnicalPMSModule() {
  const [location, navigate] = useLocation();

  const handleModuleChange = (moduleId: string) => {
    switch (moduleId) {
      case "crewing":
        navigate("/");
        break;
      case "technical-pms":
        navigate("/technical-pms");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/figmaAssets/group-1.png" 
                alt="SAIL Logo" 
                className="h-12 w-auto"
                onError={(e) => {
                  console.log("Image failed to load, using fallback");
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex items-center gap-6">
                <ModuleNavigator 
                  currentModule="technical-pms" 
                  onModuleChange={handleModuleChange}
                />
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-blue-600 font-semibold border-b-2 border-blue-600"
                >
                  <Settings className="h-4 w-4" />
                  Technical (PMS)
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Technical (PMS)</h1>
          <p className="text-gray-600 mt-2">Planned Maintenance System</p>
        </div>

        {/* Placeholder content for now */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Equipment Management
              </CardTitle>
              <CardDescription>
                Manage vessel equipment and components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Equipment registry and configuration will be available here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Maintenance Schedule
              </CardTitle>
              <CardDescription>
                Plan and track maintenance activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Maintenance scheduling and tracking will be available here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Work Orders
              </CardTitle>
              <CardDescription>
                Create and manage work orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Work order management will be available here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reports
              </CardTitle>
              <CardDescription>
                Maintenance reports and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Reporting and analytics will be available here.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Module Under Development
            </h3>
            <p className="text-blue-700">
              The Technical (PMS) module is being prepared for development. 
              Specific functionality will be added step by step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
