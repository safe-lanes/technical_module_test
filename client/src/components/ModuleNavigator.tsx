
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Grid3X3, BarChart3 } from "lucide-react";

interface Module {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
  available: boolean;
}

interface ModuleNavigatorProps {
  currentModule: string;
  onModuleChange: (moduleId: string) => void;
}

export function ModuleNavigator({ currentModule, onModuleChange }: ModuleNavigatorProps) {
  const [showModuleDialog, setShowModuleDialog] = useState(false);

  const modules: Module[] = [
    {
      id: "crewing",
      name: "Crewing",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Crew management and appraisals",
      available: true
    },
    {
      id: "technical-pms",
      name: "Technical (PMS)",
      icon: <Grid3X3 className="h-5 w-5" />,
      description: "Planned Maintenance System",
      available: true
    }
  ];

  const handleModuleSelect = (moduleId: string) => {
    onModuleChange(moduleId);
    setShowModuleDialog(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowModuleDialog(true)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden sm:inline">Modules</span>
      </Button>

      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Module</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {modules.map((module) => (
              <Button
                key={module.id}
                variant={currentModule === module.id ? "default" : "ghost"}
                className="w-full justify-start h-auto p-4"
                onClick={() => handleModuleSelect(module.id)}
                disabled={!module.available}
              >
                <div className="flex items-center gap-3">
                  {module.icon}
                  <div className="text-left">
                    <div className="font-medium">{module.name}</div>
                    {module.description && (
                      <div className="text-sm text-muted-foreground">
                        {module.description}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
