import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { Form } from "@shared/schema";

// Appraisal form schema - exact copy from AppraisalForm
const appraisalSchema = z.object({
  // Part A: Seafarer's Information
  seafarerName: z.string().min(1, "Seafarer's name is required"),
  seafarerRank: z.string().min(1, "Seafarer's rank is required"),
  nationality: z.string().min(1, "Nationality is required"),
  vessel: z.string().min(1, "Vessel is required"),
  signOnDate: z.string().min(1, "Sign on date is required"),
  appraisalType: z.string().min(1, "Appraisal type is required"),
  appraisalPeriodFrom: z.string().min(1, "Appraisal period from is required"),
  appraisalPeriodTo: z.string().min(1, "Appraisal period to is required"),
  primaryAppraiser: z.string().min(1, "Primary appraiser is required"),
  personalityIndexCategory: z.string().min(1, "PI category is required"),

  // Part B: Information at Start of Appraisal Period
  professionalCertificates: z.string().optional(),
  previousExperience: z.string().optional(),
  additionalTraining: z.string().optional(),

  // Part C: Competence Assessment (Professional Knowledge & Skills)
  navigationSkills: z.number().min(1).max(5),
  cargoOperations: z.number().min(1).max(5),
  vesselSafety: z.number().min(1).max(5),
  maintenanceRepair: z.number().min(1).max(5),
  emergencyResponse: z.number().min(1).max(5),
  technicalKnowledge: z.number().min(1).max(5),

  // Part D: Behavioural Assessment (Soft Skills)
  communication: z.number().min(1).max(5),
  teamwork: z.number().min(1).max(5),
  leadership: z.number().min(1).max(5),
  adaptability: z.number().min(1).max(5),
  reliability: z.number().min(1).max(5),
  problemSolving: z.number().min(1).max(5),

  // Part E: Training Needs & Development
  identifiedTrainingNeeds: z.string().optional(),
  recommendedCourses: z.string().optional(),
  careerDevelopmentGoals: z.string().optional(),

  // Part F: Summary & Recommendations
  overallPerformance: z.string().optional(),
  specificAchievements: z.string().optional(),
  areasForImprovement: z.string().optional(),
  recommendations: z.string().optional(),

  // Part G: Office Review & Followup
  officeReviewComments: z.string().optional(),
  followupActions: z.string().optional(),
  nextAppraisalDate: z.string().optional(),
});

type AppraisalFormData = z.infer<typeof appraisalSchema>;

interface FormEditorProps {
  form: Form;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ form, onClose, onSave }) => {
  const [activeSection, setActiveSection] = useState("A");
  const [formVersion] = useState(0); // Starting version 0

  const formMethods = useForm<AppraisalFormData>({
    resolver: zodResolver(appraisalSchema),
    defaultValues: {
      // Default values for form fields
      navigationSkills: 3,
      cargoOperations: 3,
      vesselSafety: 3,
      maintenanceRepair: 3,
      emergencyResponse: 3,
      technicalKnowledge: 3,
      communication: 3,
      teamwork: 3,
      leadership: 3,
      adaptability: 3,
      reliability: 3,
      problemSolving: 3,
    },
  });

  const onSubmit = (data: AppraisalFormData) => {
    onSave({
      ...data,
      formId: form.id,
      version: formVersion,
    });
    onClose();
  };

  const sections = [
    { id: "A", title: "Seafarer's Information", active: true },
    { id: "B", title: "Information at Start of Appraisal Period", active: false },
    { id: "C", title: "Competence Assessment (Professional Knowledge & Skills)", active: false },
    { id: "D", title: "Behavioural Assessment (Soft Skills)", active: false },
    { id: "E", title: "Training Needs & Development", active: false },
    { id: "F", title: "Summary & Recommendations", active: false },
    { id: "G", title: "Office Review & Followup", active: false },
  ];

  const RatingInput = ({ name, label }: { name: keyof AppraisalFormData; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm text-gray-700">{label}</Label>
      <Select
        value={formMethods.watch(name)?.toString() || "3"}
        onValueChange={(value) => formMethods.setValue(name, parseInt(value) as any)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 - Poor</SelectItem>
          <SelectItem value="2">2 - Below Average</SelectItem>
          <SelectItem value="3">3 - Average</SelectItem>
          <SelectItem value="4">4 - Good</SelectItem>
          <SelectItem value="5">5 - Excellent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderPartA = () => (
    <div className="space-y-6">
      <div className="text-blue-500 text-sm">Enter details as applicable</div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seafarerName">Seafarer's Name</Label>
          <Input
            id="seafarerName"
            placeholder="James Michael"
            {...formMethods.register("seafarerName")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seafarerRank">Seafarer's Rank</Label>
          <Select
            value={formMethods.watch("seafarerRank") || ""}
            onValueChange={(value) => formMethods.setValue("seafarerRank", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="master">Master</SelectItem>
              <SelectItem value="chief-officer">Chief Officer</SelectItem>
              <SelectItem value="second-officer">Second Officer</SelectItem>
              <SelectItem value="third-officer">Third Officer</SelectItem>
              <SelectItem value="chief-engineer">Chief Engineer</SelectItem>
              <SelectItem value="second-engineer">Second Engineer</SelectItem>
              <SelectItem value="third-engineer">Third Engineer</SelectItem>
              <SelectItem value="able-seaman">Able Seaman</SelectItem>
              <SelectItem value="bosun">Bosun</SelectItem>
              <SelectItem value="cook">Cook</SelectItem>
              <SelectItem value="steward">Steward</SelectItem>
              <SelectItem value="electrician">Electrician</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Select
            value={formMethods.watch("nationality") || ""}
            onValueChange={(value) => formMethods.setValue("nationality", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select nationality..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="british">British</SelectItem>
              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="philippines">Philippines</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="norwegian">Norwegian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vessel">Vessel</Label>
          <Select
            value={formMethods.watch("vessel") || ""}
            onValueChange={(value) => formMethods.setValue("vessel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vessel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mt-sail-one">MT Sail One</SelectItem>
              <SelectItem value="mt-sail-two">MT Sail Two</SelectItem>
              <SelectItem value="mt-sail-three">MT Sail Three</SelectItem>
              <SelectItem value="mv-sail-seven">MV Sail Seven</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signOnDate">Sign On Date</Label>
          <Input
            id="signOnDate"
            type="date"
            {...formMethods.register("signOnDate")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="appraisalType">Appraisal Type</Label>
          <Select
            value={formMethods.watch("appraisalType") || ""}
            onValueChange={(value) => formMethods.setValue("appraisalType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="end-of-contract">End of Contract</SelectItem>
              <SelectItem value="mid-term">Mid Term</SelectItem>
              <SelectItem value="special">Special</SelectItem>
              <SelectItem value="probation">Probation</SelectItem>
              <SelectItem value="appraiser-s-off">Appraiser S/Off</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appraisalPeriodFrom">Appraisal Period From</Label>
          <Input
            id="appraisalPeriodFrom"
            type="date"
            {...formMethods.register("appraisalPeriodFrom")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="appraisalPeriodTo">Appraisal Period To</Label>
          <Input
            id="appraisalPeriodTo"
            type="date"
            {...formMethods.register("appraisalPeriodTo")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primaryAppraiser">Primary Appraiser</Label>
          <Select
            value={formMethods.watch("primaryAppraiser") || ""}
            onValueChange={(value) => formMethods.setValue("primaryAppraiser", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select appraiser" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="captain-smith">Captain Smith</SelectItem>
              <SelectItem value="chief-engineer-jones">Chief Engineer Jones</SelectItem>
              <SelectItem value="fleet-manager">Fleet Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalityIndexCategory">Personality Index (PI) Category</Label>
        <Select
          value={formMethods.watch("personalityIndexCategory") || ""}
          onValueChange={(value) => formMethods.setValue("personalityIndexCategory", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="analytical">Analytical</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="expressive">Expressive</SelectItem>
            <SelectItem value="amiable">Amiable</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPartB = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="professionalCertificates">Professional Certificates</Label>
        <Textarea
          id="professionalCertificates"
          placeholder="List relevant certificates and qualifications..."
          {...formMethods.register("professionalCertificates")}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="previousExperience">Previous Experience</Label>
        <Textarea
          id="previousExperience"
          placeholder="Describe previous maritime experience..."
          {...formMethods.register("previousExperience")}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="additionalTraining">Additional Training</Label>
        <Textarea
          id="additionalTraining"
          placeholder="List any additional training completed..."
          {...formMethods.register("additionalTraining")}
          rows={3}
        />
      </div>
    </div>
  );

  const renderPartC = () => (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Rate each area from 1 (Poor) to 5 (Excellent)
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <RatingInput name="navigationSkills" label="Navigation Skills" />
        <RatingInput name="cargoOperations" label="Cargo Operations" />
        <RatingInput name="vesselSafety" label="Vessel Safety" />
        <RatingInput name="maintenanceRepair" label="Maintenance & Repair" />
        <RatingInput name="emergencyResponse" label="Emergency Response" />
        <RatingInput name="technicalKnowledge" label="Technical Knowledge" />
      </div>
    </div>
  );

  const renderPartD = () => (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Rate each behavioral aspect from 1 (Poor) to 5 (Excellent)
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <RatingInput name="communication" label="Communication" />
        <RatingInput name="teamwork" label="Teamwork" />
        <RatingInput name="leadership" label="Leadership" />
        <RatingInput name="adaptability" label="Adaptability" />
        <RatingInput name="reliability" label="Reliability" />
        <RatingInput name="problemSolving" label="Problem Solving" />
      </div>
    </div>
  );

  const renderPartE = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="identifiedTrainingNeeds">Identified Training Needs</Label>
        <Textarea
          id="identifiedTrainingNeeds"
          placeholder="Identify specific training requirements..."
          {...formMethods.register("identifiedTrainingNeeds")}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="recommendedCourses">Recommended Courses</Label>
        <Textarea
          id="recommendedCourses"
          placeholder="List recommended training courses..."
          {...formMethods.register("recommendedCourses")}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="careerDevelopmentGoals">Career Development Goals</Label>
        <Textarea
          id="careerDevelopmentGoals"
          placeholder="Outline career development objectives..."
          {...formMethods.register("careerDevelopmentGoals")}
          rows={3}
        />
      </div>
    </div>
  );

  const renderPartF = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="overallPerformance">Overall Performance Summary</Label>
        <Textarea
          id="overallPerformance"
          placeholder="Provide an overall performance summary..."
          {...formMethods.register("overallPerformance")}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specificAchievements">Specific Achievements</Label>
        <Textarea
          id="specificAchievements"
          placeholder="Highlight specific achievements and accomplishments..."
          {...formMethods.register("specificAchievements")}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
        <Textarea
          id="areasForImprovement"
          placeholder="Identify areas that need improvement..."
          {...formMethods.register("areasForImprovement")}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="recommendations">Recommendations</Label>
        <Textarea
          id="recommendations"
          placeholder="Provide specific recommendations..."
          {...formMethods.register("recommendations")}
          rows={3}
        />
      </div>
    </div>
  );

  const renderPartG = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="officeReviewComments">Office Review Comments</Label>
        <Textarea
          id="officeReviewComments"
          placeholder="Office review and additional comments..."
          {...formMethods.register("officeReviewComments")}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="followupActions">Follow-up Actions</Label>
        <Textarea
          id="followupActions"
          placeholder="Specify follow-up actions required..."
          {...formMethods.register("followupActions")}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nextAppraisalDate">Next Appraisal Date</Label>
        <Input
          id="nextAppraisalDate"
          type="date"
          {...formMethods.register("nextAppraisalDate")}
        />
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "A": return renderPartA();
      case "B": return renderPartB();
      case "C": return renderPartC();
      case "D": return renderPartD();
      case "E": return renderPartE();
      case "F": return renderPartF();
      case "G": return renderPartG();
      default: return renderPartA();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-6xl h-[90%] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {form.name} - Version {formVersion}
            </h2>
          </div>
          <Button 
            onClick={formMethods.handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Sections */}
          <div className="w-64 border-r bg-gray-50 overflow-y-auto">
            <div className="p-4 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">Part {section.id}: {section.title.split(" ")[0]}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {section.title.split(" ").slice(1).join(" ")}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Part {activeSection}: {sections.find(s => s.id === activeSection)?.title}
                </h3>
              </div>

              <Card>
                <CardContent className="p-6">
                  {renderSectionContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};