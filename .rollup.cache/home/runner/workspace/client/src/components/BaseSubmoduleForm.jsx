import { __rest } from "tslib";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { sailDesignSystem } from "@/config/sailDesignSystem";
export var BaseSubmoduleForm = function (_a) {
    var _b;
    var title = _a.title, sections = _a.sections, schema = _a.schema, defaultValues = _a.defaultValues, onClose = _a.onClose, onSubmit = _a.onSubmit, children = _a.children;
    var _c = useState(((_b = sections[0]) === null || _b === void 0 ? void 0 : _b.id) || ""), activeSection = _c[0], setActiveSection = _c[1];
    // Confirmation dialog state
    var _d = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: function () { }
    }), confirmDialog = _d[0], setConfirmDialog = _d[1];
    var form = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues,
    });
    // Helper function to show confirmation dialog
    var showConfirmDialog = function (title, description, onConfirm) {
        setConfirmDialog({
            isOpen: true,
            title: title,
            description: description,
            onConfirm: onConfirm
        });
    };
    var closeConfirmDialog = function () {
        setConfirmDialog({
            isOpen: false,
            title: "",
            description: "",
            onConfirm: function () { }
        });
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full h-[calc(100vh-2rem)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4"/>
            </Button>
            <h1 className="text-lg sm:text-xl font-bold">{title}</h1>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Button variant="outline" size="sm" onClick={function () { return form.handleSubmit(onSubmit)(); }} className="items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground shadow hover:bg-primary/90 h-8 rounded-md px-3 text-xs hidden sm:flex" style={{ backgroundColor: sailDesignSystem.colors.primary }}>
              <Save className="h-4 w-4 mr-2"/>
              Save Draft
            </Button>
            <Button variant="outline" size="sm" onClick={function () { return form.handleSubmit(onSubmit)(); }} className="sm:hidden">
              <Save className="h-4 w-4"/>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className="lg:hidden bg-gray-50 border-b p-3">
          <select value={activeSection} onChange={function (e) { return setActiveSection(e.target.value); }} className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white">
            {sections.map(function (section) { return (<option key={section.id} value={section.id}>
                {section.title}
              </option>); })}
          </select>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar Navigation - Stepper Design */}
          <div className="hidden lg:block w-72 overflow-y-auto" style={{ backgroundColor: sailDesignSystem.colors.background }}>
            <div className="p-6">
              <nav className="space-y-1">
                {sections.map(function (section, index) {
            var isActive = activeSection === section.id;
            var isCompleted = false; // You can add completion logic here
            var sectionLetter = section.letter || section.id.charAt(0).toUpperCase();
            return (<div key={section.id} className="relative">
                      <button onClick={function () { return setActiveSection(section.id); }} className={"w-full flex items-center p-3 rounded-lg text-left transition-colors hover:bg-gray-50 ".concat(isActive ? "bg-blue-50" : "")}>
                        <div className={"w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-4 ".concat(isActive ? "bg-blue-600" : isCompleted ? "bg-green-500" : "bg-gray-400")}>
                          {sectionLetter}
                        </div>
                        <div className="flex-1">
                          <div className={"font-medium text-sm ".concat(isActive ? "text-blue-700" : "text-gray-700")}>
                            {section.title.replace(/^Part [A-Z]: /, "")}
                          </div>
                        </div>
                      </button>
                      {index < sections.length - 1 && (<div className="absolute left-[2rem] top-16 w-0.5 h-4 bg-gray-300"></div>)}
                    </div>);
        })}
              </nav>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6" style={{ backgroundColor: sailDesignSystem.colors.background }}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {children({ activeSection: activeSection, form: form, showConfirmDialog: showConfirmDialog })}
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.isOpen} onOpenChange={closeConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.onConfirm}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);
};
// Reusable Card Section Component
export var FormSection = function (_a) {
    var title = _a.title, description = _a.description, children = _a.children;
    return (<Card className="bg-white">
    <CardContent className="p-6">
      <div className="pb-4 mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: sailDesignSystem.colors.headerText }}>
          {title}
        </h3>
        {description && (<div style={{ color: sailDesignSystem.colors.headerText }} className="text-sm">
            {description}
          </div>)}
        <div className="w-full h-0.5 mt-2" style={{ backgroundColor: sailDesignSystem.colors.headerText }}></div>
      </div>
      {children}
    </CardContent>
  </Card>);
};
// Reusable Table Component
export var FormTable = function (_a) {
    var headers = _a.headers, children = _a.children;
    return (<div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead className="bg-gray-100">
          <tr>
            {headers.map(function (header, index) { return (<th key={index} className="text-gray-600 text-xs font-normal py-2 px-4 text-left">
                {header}
              </th>); })}
          </tr>
        </thead>
        <tbody className="bg-white">
          {children}
        </tbody>
      </table>
    </div>
  </div>);
};
// Reusable Form Field Component
export var SAILFormField = function (_a) {
    var label = _a.label, children = _a.children, _b = _a.className, className = _b === void 0 ? "" : _b;
    return (<div className={className}>
    <Label className="text-xs text-gray-500 tracking-wide">{label}</Label>
    {children}
  </div>);
};
// Reusable Input Component with SAIL styling
export var SAILInput = function (props) { return (<Input {...props} className={"bg-[#ffffff] ".concat(props.className || "")}/>); };
// Reusable Select Component with SAIL styling
export var SAILSelect = function (_a) {
    var value = _a.value, onValueChange = _a.onValueChange, placeholder = _a.placeholder, children = _a.children;
    return (<Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="bg-[#ffffff]">
      <SelectValue placeholder={placeholder}/>
    </SelectTrigger>
    <SelectContent>
      {children}
    </SelectContent>
  </Select>);
};
// Reusable Button Component with SAIL styling
export var SAILButton = function (_a) {
    var _b = _a.variant, variant = _b === void 0 ? "primary" : _b, children = _a.children, _c = _a.className, className = _c === void 0 ? "" : _c, props = __rest(_a, ["variant", "children", "className"]);
    var getVariantClasses = function () {
        switch (variant) {
            case "primary":
                return "bg-[#60A5FA] hover:bg-[#3B82F6] text-white";
            case "secondary":
                return "bg-blue-600 hover:bg-blue-700 text-white";
            case "success":
                return "bg-[#20c43f] hover:bg-[#1ba838] text-white";
            default:
                return "bg-[#60A5FA] hover:bg-[#3B82F6] text-white";
        }
    };
    return (<Button className={"px-8 ".concat(getVariantClasses(), " ").concat(className)} {...props}>
      {children}
    </Button>);
};
//# sourceMappingURL=BaseSubmoduleForm.jsx.map