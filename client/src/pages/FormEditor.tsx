import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Save, Plus, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { Form } from "@shared/schema";

// Training and Target schemas - matching AppraisalForm
const trainingSchema = z.object({
  id: z.string(),
  training: z.string().min(1, "Training name is required"),
  evaluation: z.string().min(1, "Evaluation is required"),
  comment: z.string().optional(),
});

const targetSchema = z.object({
  id: z.string(),
  targetSetting: z.string().min(1, "Target setting is required"),
  evaluation: z.string().min(1, "Evaluation is required"),
  comment: z.string().optional(),
});

// Competence Assessment schema
const competenceAssessmentSchema = z.object({
  id: z.string(),
  assessmentCriteria: z.string(),
  weight: z.number(),
  effectiveness: z.string().min(1, "Effectiveness rating is required"),
  comment: z.string().optional(),
});

// Behavioural Assessment schema
const behaviouralAssessmentSchema = z.object({
  id: z.string(),
  assessmentCriteria: z.string(),
  weight: z.number(),
  effectiveness: z.string().min(1, "Effectiveness rating is required"),
  comment: z.string().optional(),
});

// Training Needs schema
const trainingNeedsSchema = z.object({
  id: z.string(),
  training: z.string().min(1, "Training name is required"),
  comment: z.string().optional(),
});

// Appraisal form schema - exact copy from AppraisalForm
const appraisalSchema = z.object({
  // Part A: Seafarer's Information
  seafarersName: z.string().min(1, "Seafarer's name is required"),
  seafarersRank: z.string().min(1, "Seafarer's rank is required"),
  nationality: z.string().min(1, "Nationality is required"),
  vessel: z.string().min(1, "Vessel is required"),
  signOn: z.string().min(1, "Sign On date is required"),
  appraisalType: z.string().min(1, "Appraisal type is required"),
  appraisalPeriodFrom: z.string().min(1, "Appraisal period from is required"),
  appraisalPeriodTo: z.string().min(1, "Appraisal period to is required"),
  personalityIndexCategory: z.string().min(1, "Personality Index category is required"),
  primaryAppraiser: z.string().min(1, "Primary appraiser is required"),

  // Part B: Information at Start of Appraisal Period
  trainings: z.array(trainingSchema).default([]),
  targets: z.array(targetSchema).default([]),

  // Part C: Competence Assessment
  competenceAssessments: z.array(competenceAssessmentSchema).default([]),

  // Part D: Behavioural Assessment
  behaviouralAssessments: z.array(behaviouralAssessmentSchema).default([]),

  // Part E: Training Needs & Development
  trainingNeeds: z.array(trainingNeedsSchema).default([]),

  // Part F: Summary & Recommendations
  overallScore: z.string().optional(),
  recommendations: z.string().optional(),
  appraiserComments: z.string().optional(),
  seafarerComments: z.string().optional(),

  // Part G: Office Review & Followup
  officeReviewComments: z.string().optional(),
  trainingFollowups: z.string().optional(),
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
  const [trainingComments, setTrainingComments] = useState<{[key: string]: string}>({});
  const [targetComments, setTargetComments] = useState<{[key: string]: string}>({});
  const [competenceComments, setCompetenceComments] = useState<{[key: string]: string}>({});
  const [behaviouralComments, setBehaviouralComments] = useState<{[key: string]: string}>({});
  const [trainingNeedsComments, setTrainingNeedsComments] = useState<{[key: string]: string}>({});

  const formMethods = useForm<AppraisalFormData>({
    resolver: zodResolver(appraisalSchema),
    defaultValues: {
      seafarersName: "",
      seafarersRank: "",
      nationality: "",
      vessel: "",
      signOn: "",
      appraisalType: "",
      appraisalPeriodFrom: "",
      appraisalPeriodTo: "",
      personalityIndexCategory: "",
      primaryAppraiser: "",
      trainings: [],
      targets: [],
      competenceAssessments: [
        { id: "1", assessmentCriteria: "Safety Performance and Open Reporting", weight: 10, effectiveness: "", comment: "" },
        { id: "2", assessmentCriteria: "Shipboard operational performance & technical skills - Navigation", weight: 10, effectiveness: "", comment: "" },
        { id: "3", assessmentCriteria: "Assessment Criteria 3", weight: 10, effectiveness: "", comment: "" },
        { id: "4", assessmentCriteria: "Assessment Criteria 4", weight: 10, effectiveness: "", comment: "" },
        { id: "5", assessmentCriteria: "Assessment Criteria 5", weight: 10, effectiveness: "", comment: "" },
        { id: "6", assessmentCriteria: "Assessment Criteria 6", weight: 10, effectiveness: "", comment: "" },
        { id: "7", assessmentCriteria: "Assessment Criteria 7", weight: 10, effectiveness: "", comment: "" },
        { id: "8", assessmentCriteria: "Assessment Criteria 8", weight: 10, effectiveness: "", comment: "" },
        { id: "9", assessmentCriteria: "Assessment Criteria 9", weight: 10, effectiveness: "", comment: "" },
        { id: "10", assessmentCriteria: "Assessment Criteria 10", weight: 10, effectiveness: "", comment: "" }
      ],
      behaviouralAssessments: [
        { id: "1", assessmentCriteria: "Leadership", weight: 10, effectiveness: "", comment: "" },
        { id: "2", assessmentCriteria: "Attitude", weight: 10, effectiveness: "", comment: "" },
        { id: "3", assessmentCriteria: "Emotional Intelligence", weight: 10, effectiveness: "", comment: "" },
        { id: "4", assessmentCriteria: "Work Ethics", weight: 10, effectiveness: "", comment: "" },
        { id: "5", assessmentCriteria: "Situational Awareness", weight: 10, effectiveness: "", comment: "" },
        { id: "6", assessmentCriteria: "Decision Making", weight: 10, effectiveness: "", comment: "" },
        { id: "7", assessmentCriteria: "Teamwork", weight: 10, effectiveness: "", comment: "" },
        { id: "8", assessmentCriteria: "Assessment Criteria 8", weight: 10, effectiveness: "", comment: "" },
        { id: "9", assessmentCriteria: "Assessment Criteria 9", weight: 10, effectiveness: "", comment: "" },
        { id: "10", assessmentCriteria: "Assessment Criteria 10", weight: 10, effectiveness: "", comment: "" }
      ],
      trainingNeeds: [],
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

  // Training management functions
  const addTraining = () => {
    const newTraining = {
      id: Date.now().toString(),
      training: "",
      evaluation: "",
      comment: "",
    };
    const currentTrainings = formMethods.getValues("trainings");
    formMethods.setValue("trainings", [...currentTrainings, newTraining]);
  };

  const deleteTraining = (id: string) => {
    const currentTrainings = formMethods.getValues("trainings");
    formMethods.setValue("trainings", currentTrainings.filter(t => t.id !== id));
    setTrainingComments(prev => {
      const newComments = { ...prev };
      delete newComments[id];
      return newComments;
    });
  };

  const updateTraining = (id: string, field: string, value: string) => {
    const currentTrainings = formMethods.getValues("trainings");
    const updatedTrainings = currentTrainings.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    formMethods.setValue("trainings", updatedTrainings);
  };

  // Target management functions
  const addTarget = () => {
    const newTarget = {
      id: Date.now().toString(),
      targetSetting: "",
      evaluation: "",
      comment: "",
    };
    const currentTargets = formMethods.getValues("targets");
    formMethods.setValue("targets", [...currentTargets, newTarget]);
  };

  const deleteTarget = (id: string) => {
    const currentTargets = formMethods.getValues("targets");
    formMethods.setValue("targets", currentTargets.filter(t => t.id !== id));
    setTargetComments(prev => {
      const newComments = { ...prev };
      delete newComments[id];
      return newComments;
    });
  };

  const updateTarget = (id: string, field: string, value: string) => {
    const currentTargets = formMethods.getValues("targets");
    const updatedTargets = currentTargets.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    formMethods.setValue("targets", updatedTargets);
  };

  // Competence Assessment management functions
  const updateCompetenceAssessment = (id: string, field: string, value: string | number) => {
    const currentAssessments = formMethods.getValues("competenceAssessments");
    const updatedAssessments = currentAssessments.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    );
    formMethods.setValue("competenceAssessments", updatedAssessments);
  };

  // Behavioural Assessment management functions
  const updateBehaviouralAssessment = (id: string, field: string, value: string | number) => {
    const currentAssessments = formMethods.getValues("behaviouralAssessments");
    const updatedAssessments = currentAssessments.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    );
    formMethods.setValue("behaviouralAssessments", updatedAssessments);
  };

  // Helper function to get score colors based on rating value
  const getScoreColors = (score: number) => {
    if (score >= 4.0) {
      return { bgColor: 'bg-green-500', textColor: 'text-white' };
    } else if (score >= 3.0) {
      return { bgColor: 'bg-yellow-400', textColor: 'text-black' };
    } else if (score >= 2.0) {
      return { bgColor: 'bg-red-200', textColor: 'text-red-800' };
    } else {
      return { bgColor: 'bg-red-600', textColor: 'text-white' };
    }
  };

  // Calculate section score based on weight and effectiveness
  const calculateSectionScore = () => {
    const assessments = formMethods.watch("competenceAssessments");
    let totalScore = 0;
    let totalWeight = 0;
    
    assessments.forEach(assessment => {
      if (assessment.effectiveness && assessment.weight) {
        let rating = 0;
        switch (assessment.effectiveness) {
          case "5-exceeds-expectations": rating = 5; break;
          case "4-meets-expectations": rating = 4; break;
          case "3-somewhat-meets-expectations": rating = 3; break;
          case "2-below-expectations": rating = 2; break;
          case "1-significantly-below-expectations": rating = 1; break;
        }
        totalScore += (rating * assessment.weight) / 100;
        totalWeight += assessment.weight;
      }
    });
    
    return totalWeight > 0 ? (totalScore * 100 / totalWeight).toFixed(1) : "0.0";
  };

  // Calculate behavioural section score
  const calculateBehaviouralSectionScore = () => {
    const assessments = formMethods.watch("behaviouralAssessments");
    let totalScore = 0;
    let totalWeight = 0;
    
    assessments.forEach(assessment => {
      if (assessment.effectiveness && assessment.weight) {
        let rating = 0;
        switch (assessment.effectiveness) {
          case "5-exceeds-expectations": rating = 5; break;
          case "4-meets-expectations": rating = 4; break;
          case "3-somewhat-meets-expectations": rating = 3; break;
          case "2-below-expectations": rating = 2; break;
          case "1-significantly-below-expectations": rating = 1; break;
        }
        totalScore += (rating * assessment.weight) / 100;
        totalWeight += assessment.weight;
      }
    });
    
    return totalWeight > 0 ? (totalScore * 100 / totalWeight).toFixed(1) : "0.0";
  };

  // Training Needs management functions
  const addTrainingNeed = (type: 'database' | 'new') => {
    const newTrainingNeed = {
      id: Date.now().toString(),
      training: "",
      comment: "",
    };
    const currentTrainingNeeds = formMethods.getValues("trainingNeeds");
    formMethods.setValue("trainingNeeds", [...currentTrainingNeeds, newTrainingNeed]);
  };

  const deleteTrainingNeed = (id: string) => {
    const currentTrainingNeeds = formMethods.getValues("trainingNeeds");
    formMethods.setValue("trainingNeeds", currentTrainingNeeds.filter(t => t.id !== id));
    setTrainingNeedsComments(prev => {
      const newComments = { ...prev };
      delete newComments[id];
      return newComments;
    });
  };

  const updateTrainingNeed = (id: string, field: string, value: string) => {
    const currentTrainingNeeds = formMethods.getValues("trainingNeeds");
    const updatedTrainingNeeds = currentTrainingNeeds.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    formMethods.setValue("trainingNeeds", updatedTrainingNeeds);
  };

  // Calculate overall score (F1)
  const calculateOverallScore = () => {
    const competenceScore = parseFloat(calculateSectionScore());
    const behaviouralScore = parseFloat(calculateBehaviouralSectionScore());
    return ((competenceScore + behaviouralScore) / 2).toFixed(1);
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



  const renderPartA = () => (
    <div className="space-y-6">
      <div className="border-b pb-4 mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#16569e' }}>Part A: Seafarer's Information</h3>
        <div style={{ color: '#16569e' }} className="text-sm">Enter details as applicable</div>
        <div className="w-full h-0.5 mt-2" style={{ backgroundColor: '#16569e' }}></div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seafarersName">Seafarer's Name</Label>
          <Input
            id="seafarersName"
            placeholder="James Michael"
            {...formMethods.register("seafarersName")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seafarersRank">Seafarer's Rank</Label>
          <Select
            value={formMethods.watch("seafarersRank") || ""}
            onValueChange={(value) => formMethods.setValue("seafarersRank", value)}
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
          <Label htmlFor="signOn">Sign On Date</Label>
          <Input
            id="signOn"
            type="date"
            {...formMethods.register("signOn")}
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
    <div className="space-y-8">
      <div className="text-blue-500 text-sm">Add below at the start of the Appraisal Period except the Evaluation which must be completed at the end of the Appraisal Period</div>
      
      {/* B1. Trainings conducted prior joining vessel */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-700">B1. Trainings conducted prior joining vessel (To Assess Effectiveness)</h3>
          <Button
            type="button"
            onClick={addTraining}
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Training
          </Button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-600">S.No</th>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-600">Training</th>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-600">Evaluation</th>
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formMethods.watch("trainings").map((training, index) => (
                  <React.Fragment key={training.id}>
                    <tr className="border-t">
                      <td className="p-3 text-sm">{index + 1}.</td>
                      <td className="p-3">
                        <Input
                          value={training.training}
                          onChange={(e) => updateTraining(training.id, "training", e.target.value)}
                          placeholder={`Training ${index + 1}`}
                          className="border-0 bg-transparent p-0 focus-visible:ring-0"
                        />
                      </td>
                      <td className="p-3">
                        <Select
                          value={training.evaluation}
                          onValueChange={(value) => updateTraining(training.id, "evaluation", value)}
                        >
                          <SelectTrigger className="border-0 bg-transparent p-0 focus-visible:ring-0">
                            <SelectValue placeholder="Select Rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5-exceeded-expectations">5- Exceeded Expectations</SelectItem>
                            <SelectItem value="4-meets-expectations">4- Meets Expectations</SelectItem>
                            <SelectItem value="3-somewhat-meets-expectations">3- Somewhat Meets Expectations</SelectItem>
                            <SelectItem value="2-below-expectations">2- Below Expectations</SelectItem>
                            <SelectItem value="1-significantly-below-expectations">1- Significantly Below Expectations</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setTrainingComments(prev => ({
                              ...prev,
                              [training.id]: prev[training.id] || ""
                            }))}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTraining(training.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {trainingComments[training.id] !== undefined && (
                      <tr>
                        <td></td>
                        <td colSpan={3} className="p-3">
                          <Textarea
                            value={trainingComments[training.id]}
                            onChange={(e) => {
                              setTrainingComments(prev => ({
                                ...prev,
                                [training.id]: e.target.value
                              }));
                              updateTraining(training.id, "comment", e.target.value);
                            }}
                            placeholder="Comment: Add your observations here..."
                            className="text-blue-600 italic border-blue-200"
                            rows={2}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {formMethods.watch("trainings").length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No trainings added yet. Click "Add Training" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* B2. Target Setting */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-700">B2. Target Setting</h3>
          <Button
            type="button"
            onClick={addTarget}
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Target
          </Button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-600">S.No</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Target Setting</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Evaluation</th>
                <th className="text-left p-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formMethods.watch("targets").map((target, index) => (
                <React.Fragment key={target.id}>
                  <tr className="border-t">
                    <td className="p-3 text-sm">{index + 1}.</td>
                    <td className="p-3">
                      <Input
                        value={target.targetSetting}
                        onChange={(e) => updateTarget(target.id, "targetSetting", e.target.value)}
                        placeholder={`Target ${index + 1}`}
                        className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      />
                    </td>
                    <td className="p-3">
                      <Select
                        value={target.evaluation}
                        onValueChange={(value) => updateTarget(target.id, "evaluation", value)}
                      >
                        <SelectTrigger className="border-0 bg-transparent p-0 focus-visible:ring-0">
                          <SelectValue placeholder="Select Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5-exceeded-set-target">5- Exceeded Set Target</SelectItem>
                          <SelectItem value="4-fully-met-target">4- Fully Met Target</SelectItem>
                          <SelectItem value="3-missed-target-small-margin">3- Missed Target by a Small Margin</SelectItem>
                          <SelectItem value="2-missed-target-significant-margin">2- Missed Target by a Significant Margin</SelectItem>
                          <SelectItem value="1-failed-to-achieve-target">1- Failed to Achieve Target</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setTargetComments(prev => ({
                            ...prev,
                            [target.id]: prev[target.id] || ""
                          }))}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTarget(target.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {targetComments[target.id] !== undefined && (
                    <tr key={`comment-${target.id}`}>
                      <td></td>
                      <td colSpan={3} className="p-3">
                        <Textarea
                          value={targetComments[target.id]}
                          onChange={(e) => {
                            setTargetComments(prev => ({
                              ...prev,
                              [target.id]: e.target.value
                            }));
                            updateTarget(target.id, "comment", e.target.value);
                          }}
                          placeholder="Comment: Add your observations here..."
                          className="text-blue-600 italic border-blue-200"
                          rows={2}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {formMethods.watch("targets").length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No targets added yet. Click "Add Target" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPartC = () => (
    <div className="space-y-6">
      <div className="text-blue-500 text-sm">Description</div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-600">S.No</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Assessment Criteria</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Weight %</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Effectiveness</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formMethods.watch("competenceAssessments").map((assessment, index) => (
              <React.Fragment key={assessment.id}>
                <tr className="border-t">
                  <td className="p-3 text-sm">{index + 1}.</td>
                  <td className="p-3 text-sm">{assessment.assessmentCriteria}</td>
                  <td className="p-3 text-sm">{assessment.weight}%</td>
                  <td className="p-3">
                    <Select
                      value={assessment.effectiveness}
                      onValueChange={(value) => updateCompetenceAssessment(assessment.id, "effectiveness", value)}
                    >
                      <SelectTrigger className="border-0 bg-transparent p-0 focus-visible:ring-0">
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-exceeds-expectations">5- Exceeds Expectations</SelectItem>
                        <SelectItem value="4-meets-expectations">4- Meets Expectations</SelectItem>
                        <SelectItem value="3-somewhat-meets-expectations">3- Somewhat Meets Expectations</SelectItem>
                        <SelectItem value="2-below-expectations">2- Below Expectations</SelectItem>
                        <SelectItem value="1-significantly-below-expectations">1- Significantly Below Expectations</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCompetenceComments(prev => ({
                          ...prev,
                          [assessment.id]: prev[assessment.id] || ""
                        }))}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                {competenceComments[assessment.id] !== undefined && (
                  <tr key={`comment-${assessment.id}`}>
                    <td></td>
                    <td colSpan={4} className="p-3">
                      <Textarea
                        value={competenceComments[assessment.id]}
                        onChange={(e) => {
                          setCompetenceComments(prev => ({
                            ...prev,
                            [assessment.id]: e.target.value
                          }));
                          updateCompetenceAssessment(assessment.id, "comment", e.target.value);
                        }}
                        placeholder="Comment: Add your observations here..."
                        className="text-blue-600 italic border-blue-200"
                        rows={2}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section Score */}
      <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700">Section Score:</div>
        <div className={`px-4 py-2 rounded text-lg font-semibold min-w-[64px] text-center ${getScoreColors(parseFloat(calculateSectionScore())).bgColor} ${getScoreColors(parseFloat(calculateSectionScore())).textColor}`}>
          {calculateSectionScore()}
        </div>
      </div>
    </div>
  );

  const renderPartD = () => (
    <div className="space-y-6">
      <div className="text-blue-500 text-sm">Description</div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-600">S.No</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Assessment Criteria</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Weight %</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Effectiveness</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formMethods.watch("behaviouralAssessments").map((assessment, index) => (
              <React.Fragment key={assessment.id}>
                <tr className="border-t">
                  <td className="p-3 text-sm">{index + 1}.</td>
                  <td className="p-3 text-sm">{assessment.assessmentCriteria}</td>
                  <td className="p-3 text-sm text-center">{assessment.weight}%</td>
                  <td className="p-3">
                    <Select
                      value={assessment.effectiveness}
                      onValueChange={(value) => updateBehaviouralAssessment(assessment.id, "effectiveness", value)}
                    >
                      <SelectTrigger className="border-0 bg-transparent p-0 focus-visible:ring-0">
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-exceeds-expectations">5- Exceeds Expectations</SelectItem>
                        <SelectItem value="4-meets-expectations">4- Meets Expectations</SelectItem>
                        <SelectItem value="3-somewhat-meets-expectations">3- Somewhat Meets Expectations</SelectItem>
                        <SelectItem value="2-below-expectations">2- Below Expectations</SelectItem>
                        <SelectItem value="1-significantly-below-expectations">1- Significantly Below Expectations</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setBehaviouralComments(prev => ({
                          ...prev,
                          [assessment.id]: prev[assessment.id] || ""
                        }))}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                {behaviouralComments[assessment.id] !== undefined && (
                  <tr key={`comment-${assessment.id}`}>
                    <td></td>
                    <td colSpan={4} className="p-3">
                      <Textarea
                        value={behaviouralComments[assessment.id]}
                        onChange={(e) => {
                          setBehaviouralComments(prev => ({
                            ...prev,
                            [assessment.id]: e.target.value
                          }));
                          updateBehaviouralAssessment(assessment.id, "comment", e.target.value);
                        }}
                        placeholder="Comment: Add your observations here..."
                        className="text-blue-600 italic border-blue-200"
                        rows={2}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-600">Section Score:</span>
        <div className={`px-4 py-2 rounded text-lg font-semibold min-w-[64px] text-center ${getScoreColors(parseFloat(calculateBehaviouralSectionScore())).bgColor} ${getScoreColors(parseFloat(calculateBehaviouralSectionScore())).textColor}`}>
          {calculateBehaviouralSectionScore()}
        </div>
      </div>
    </div>
  );

  const renderPartE = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-blue-500 text-sm">Specify any training needs identified during the appraisals period</div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300"
            onClick={() => addTrainingNeed('database')}
          >
            + Add Training from Database
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-300"
            onClick={() => addTrainingNeed('new')}
          >
            + Add New Training
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-600">S.No</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Training</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formMethods.watch("trainingNeeds").map((trainingNeed, index) => (
              <React.Fragment key={trainingNeed.id}>
                <tr className="border-t">
                  <td className="p-3 text-sm">{index + 1}.</td>
                  <td className="p-3">
                    <Input
                      value={trainingNeed.training}
                      onChange={(e) => updateTrainingNeed(trainingNeed.id, "training", e.target.value)}
                      placeholder={`Training ${index + 1}`}
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setTrainingNeedsComments(prev => ({
                          ...prev,
                          [trainingNeed.id]: prev[trainingNeed.id] || ""
                        }))}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTrainingNeed(trainingNeed.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                {trainingNeedsComments[trainingNeed.id] !== undefined && (
                  <tr key={`comment-${trainingNeed.id}`}>
                    <td></td>
                    <td colSpan={2} className="p-3">
                      <Textarea
                        value={trainingNeedsComments[trainingNeed.id]}
                        onChange={(e) => {
                          setTrainingNeedsComments(prev => ({
                            ...prev,
                            [trainingNeed.id]: e.target.value
                          }));
                          updateTrainingNeed(trainingNeed.id, "comment", e.target.value);
                        }}
                        placeholder="Comment: Add your observations here..."
                        className="text-blue-600 italic border-blue-200"
                        rows={2}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {formMethods.watch("trainingNeeds").length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No training needs added yet. Click "Add Training from Database" or "Add New Training" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPartF = () => (
    <div className="space-y-6">
      <div className="text-blue-500 text-sm">Add any recommendations related to following</div>
      
      {/* F1: Overall Score */}
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-blue-700">F1. Overall Score</h3>
          <div className={`px-4 py-2 rounded text-lg font-bold min-w-[64px] text-center ${getScoreColors(parseFloat(calculateOverallScore())).bgColor} ${getScoreColors(parseFloat(calculateOverallScore())).textColor}`}>
            {calculateOverallScore()}
          </div>
        </div>
      </div>

      {/* F2: Appraiser's Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-700">F2. Appraiser's Recommendations</h3>
        <div className="space-y-2">
          <Label htmlFor="recommendations">Recommendations</Label>
          <Textarea
            id="recommendations"
            placeholder="Provide specific recommendations..."
            {...formMethods.register("recommendations")}
            rows={4}
          />
        </div>
      </div>

      {/* F3: Appraiser Comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-700">F3. Appraiser Comments</h3>
        <div className="space-y-2">
          <Label htmlFor="appraiserComments">Appraiser Comments</Label>
          <Textarea
            id="appraiserComments"
            placeholder="Add appraiser comments..."
            {...formMethods.register("appraiserComments")}
            rows={4}
          />
        </div>
      </div>

      {/* F4: Seafarer Comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-700">F4. Seafarer Comments</h3>
        <div className="space-y-2">
          <Label htmlFor="seafarerComments">Seafarer Comments</Label>
          <Textarea
            id="seafarerComments"
            placeholder="Add seafarer comments..."
            {...formMethods.register("seafarerComments")}
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderPartG = () => (
    <div className="space-y-6">
      <div className="text-blue-500 text-sm">This section is visible to office users only</div>
      
      {/* G1: Office Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-700">G1. Office Review</h3>
        <div className="space-y-2">
          <Label htmlFor="officeReviewComments">Office Review Comments</Label>
          <Textarea
            id="officeReviewComments"
            placeholder="Office review and additional comments..."
            {...formMethods.register("officeReviewComments")}
            rows={4}
          />
        </div>
      </div>

      {/* G2: Training Follow-up */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-700">G2. Training Follow-up</h3>
        <div className="space-y-2">
          <Label htmlFor="trainingFollowups">Training Follow-up Actions</Label>
          <Textarea
            id="trainingFollowups"
            placeholder="Specify training follow-up actions and timeline..."
            {...formMethods.register("trainingFollowups")}
            rows={4}
          />
        </div>
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
          <div className="w-64 border-r overflow-y-auto bg-[#f8fafc]">
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