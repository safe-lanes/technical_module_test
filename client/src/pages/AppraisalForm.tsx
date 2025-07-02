import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Send, Plus, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Training and Target schemas
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
  
  // Part B: Evaluation sections
  shipManagement: z.object({
    navigation: z.string().min(1, "Rating required"),
    cargoOperations: z.string().min(1, "Rating required"),
    maintenanceRepair: z.string().min(1, "Rating required"),
    safetyCompliance: z.string().min(1, "Rating required"),
    comments: z.string().optional(),
  }),
  
  leadership: z.object({
    teamManagement: z.string().min(1, "Rating required"),
    communication: z.string().min(1, "Rating required"),
    decisionMaking: z.string().min(1, "Rating required"),
    problemSolving: z.string().min(1, "Rating required"),
    comments: z.string().optional(),
  }),
  
  professionalConduct: z.object({
    reliability: z.string().min(1, "Rating required"),
    initiative: z.string().min(1, "Rating required"),
    adaptability: z.string().min(1, "Rating required"),
    workEthic: z.string().min(1, "Rating required"),
    comments: z.string().optional(),
  }),
  
  // Additional sections
  overallComments: z.string().optional(),
  recommendations: z.string().optional(),
  developmentAreas: z.string().optional(),
});

type AppraisalFormData = z.infer<typeof appraisalSchema>;

interface AppraisalFormProps {
  crewMember?: {
    id: string;
    name: { first: string; middle: string; last: string };
    rank: string;
    vessel: string;
  };
  onClose: () => void;
}

export const AppraisalForm: React.FC<AppraisalFormProps> = ({ crewMember, onClose }) => {
  const [activeSection, setActiveSection] = useState("reference");
  const [editingTraining, setEditingTraining] = useState<string | null>(null);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [trainingComments, setTrainingComments] = useState<{[key: string]: string}>({});
  const [targetComments, setTargetComments] = useState<{[key: string]: string}>({});
  const [competenceComments, setCompetenceComments] = useState<{[key: string]: string}>({});

  const form = useForm<AppraisalFormData>({
    resolver: zodResolver(appraisalSchema),
    defaultValues: {
      seafarersName: crewMember ? `${crewMember.name.first} ${crewMember.name.middle} ${crewMember.name.last}`.trim() : "",
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
      shipManagement: {
        navigation: "",
        cargoOperations: "",
        maintenanceRepair: "",
        safetyCompliance: "",
        comments: "",
      },

      leadership: {
        teamManagement: "",
        communication: "",
        decisionMaking: "",
        problemSolving: "",
        comments: "",
      },
      professionalConduct: {
        reliability: "",
        initiative: "",
        adaptability: "",
        workEthic: "",
        comments: "",
      },
      overallComments: "",
      recommendations: "",
      developmentAreas: "",
    },
  });

  const onSubmit = (data: AppraisalFormData) => {
    console.log("Appraisal form submitted:", data);
    // Handle form submission here
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
    const currentTrainings = form.getValues("trainings");
    form.setValue("trainings", [...currentTrainings, newTraining]);
  };

  const deleteTraining = (id: string) => {
    const currentTrainings = form.getValues("trainings");
    form.setValue("trainings", currentTrainings.filter(t => t.id !== id));
    setTrainingComments(prev => {
      const newComments = { ...prev };
      delete newComments[id];
      return newComments;
    });
  };

  const updateTraining = (id: string, field: string, value: string) => {
    const currentTrainings = form.getValues("trainings");
    const updatedTrainings = currentTrainings.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    form.setValue("trainings", updatedTrainings);
  };

  // Target management functions
  const addTarget = () => {
    const newTarget = {
      id: Date.now().toString(),
      targetSetting: "",
      evaluation: "",
      comment: "",
    };
    const currentTargets = form.getValues("targets");
    form.setValue("targets", [...currentTargets, newTarget]);
  };

  const deleteTarget = (id: string) => {
    const currentTargets = form.getValues("targets");
    form.setValue("targets", currentTargets.filter(t => t.id !== id));
    setTargetComments(prev => {
      const newComments = { ...prev };
      delete newComments[id];
      return newComments;
    });
  };

  const updateTarget = (id: string, field: string, value: string) => {
    const currentTargets = form.getValues("targets");
    const updatedTargets = currentTargets.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    form.setValue("targets", updatedTargets);
  };

  // Competence Assessment management functions
  const updateCompetenceAssessment = (id: string, field: string, value: string | number) => {
    const currentAssessments = form.getValues("competenceAssessments");
    const updatedAssessments = currentAssessments.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    );
    form.setValue("competenceAssessments", updatedAssessments);
  };

  // Calculate section score based on weight and effectiveness
  const calculateSectionScore = () => {
    const assessments = form.watch("competenceAssessments");
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

  const RatingRadioGroup = ({ name, label }: { name: string; label: string }) => (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between space-y-0 py-2">
          <FormLabel className="text-sm font-normal w-1/2">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-row space-x-4"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`${name}-${rating}`} />
                  <Label htmlFor={`${name}-${rating}`} className="text-xs">{rating}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const sections = [
    { id: "reference", title: "Part A: Seafarer's Information" },
    { id: "information", title: "Part B: Information at Start of Appraisal Period" },
    { id: "shipManagement", title: "Part B: Ship Management & Operations" },
    { id: "competenceAssessment", title: "Part C: Competence Assessment (Professional Knowledge & Skills)" },
    { id: "leadership", title: "Part D: Leadership & Management" },
    { id: "professionalConduct", title: "Part E: Professional Conduct" },
    { id: "summary", title: "Part F: Summary & Recommendations" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Crew Appraisal Form</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => form.handleSubmit(onSubmit)()}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => form.handleSubmit(onSubmit)()}>
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50 p-4 border-r">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded text-sm ${
                    activeSection === section.id
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Part A: Seafarer's Information */}
                {activeSection === "reference" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#3B82F6]">Part A Seafarer's Information</CardTitle>
                      <p className="text-sm text-[#60A5FA]">Enter details as applicable</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="seafarersName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Seafarer's Name" className="bg-gray-50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="seafarersRank"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-50">
                                    <SelectValue placeholder="Seafarer's Rank" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="master">Master</SelectItem>
                                  <SelectItem value="chief-engineer">Chief Engineer</SelectItem>
                                  <SelectItem value="chief-mate">Chief Mate</SelectItem>
                                  <SelectItem value="second-officer">Second Officer</SelectItem>
                                  <SelectItem value="third-engineer">Third Engineer</SelectItem>
                                  <SelectItem value="able-seaman">Able Seaman</SelectItem>
                                  <SelectItem value="electrician">Electrician</SelectItem>
                                  <SelectItem value="bosun">Bosun</SelectItem>
                                  <SelectItem value="cook">Cook</SelectItem>
                                  <SelectItem value="steward">Steward</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="nationality"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Nationality" className="bg-gray-50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="vessel"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-50">
                                    <SelectValue placeholder="Vessel" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="mt-sail-one">MT Sail One</SelectItem>
                                  <SelectItem value="mt-sail-two">MT Sail Two</SelectItem>
                                  <SelectItem value="mt-sail-three">MT Sail Three</SelectItem>
                                  <SelectItem value="mt-sail-four">MT Sail Four</SelectItem>
                                  <SelectItem value="mt-sail-five">MT Sail Five</SelectItem>
                                  <SelectItem value="mt-sail-ten">MT Sail Ten</SelectItem>
                                  <SelectItem value="mt-sail-eight">MT Sail Eight</SelectItem>
                                  <SelectItem value="mt-sail-eleven">MT Sail Eleven</SelectItem>
                                  <SelectItem value="mt-sail-thirteen">MT Sail Thirteen</SelectItem>
                                  <SelectItem value="mv-sail-seven">MV Sail Seven</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="signOn"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Sign on Date dd/mm/yyyy" type="date" className="bg-gray-50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="appraisalType"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-50">
                                    <SelectValue placeholder="Appraisal Type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="end-of-contract">End of Contract</SelectItem>
                                  <SelectItem value="mid-term">Mid Term</SelectItem>
                                  <SelectItem value="special">Special</SelectItem>
                                  <SelectItem value="probation">Probation</SelectItem>
                                  <SelectItem value="appraiser-s-off">Appraiser S/Off</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="appraisalPeriodFrom"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Appraisal Period From - dd.mm.yyyy" type="date" className="bg-gray-50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="appraisalPeriodTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Appraisal Period To - dd.mm.yyyy" type="date" className="bg-gray-50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="personalityIndexCategory"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-50">
                                    <SelectValue placeholder="Personality Index (PI) Category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="dominance">Dominance</SelectItem>
                                  <SelectItem value="influence">Influence</SelectItem>
                                  <SelectItem value="steadiness">Steadiness</SelectItem>
                                  <SelectItem value="compliance">Compliance</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="primaryAppraiser"
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-50">
                                    <SelectValue placeholder="Primary Appraiser" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="captain">Captain</SelectItem>
                                  <SelectItem value="chief-engineer">Chief Engineer</SelectItem>
                                  <SelectItem value="chief-mate">Chief Mate</SelectItem>
                                  <SelectItem value="shore-management">Shore Management</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white px-8">
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Part B: Information at Start of Appraisal Period */}
                {activeSection === "information" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-700">Part B Information at Start of Appraisal Period</CardTitle>
                      <p className="text-sm text-blue-500">Add below at the start of the Appraisal Period except the Evaluation which must be completed at the end of the Appraisal Period</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
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
                          <table className="w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-left p-3 text-sm font-medium text-gray-600">S.No</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-600">Training</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-600">Evaluation</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-600">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {form.watch("trainings").map((training, index) => (
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
                                          onClick={() => setEditingTraining(training.id)}
                                        >
                                          <Edit2 className="h-4 w-4" />
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
                              {form.watch("trainings").length === 0 && (
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
                              {form.watch("targets").map((target, index) => (
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
                                          onClick={() => setEditingTarget(target.id)}
                                        >
                                          <Edit2 className="h-4 w-4" />
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
                                    <tr>
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
                              {form.watch("targets").length === 0 && (
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

                      <div className="flex justify-between mt-6">
                        <Button className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white px-8">
                          Save
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                          Submit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Part B: Ship Management & Operations */}
                {activeSection === "shipManagement" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Part B: Ship Management & Operations</CardTitle>
                      <p className="text-sm text-gray-600">Rate from 1 (Poor) to 5 (Excellent)</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RatingRadioGroup name="shipManagement.navigation" label="Navigation & Watch Keeping" />
                      <RatingRadioGroup name="shipManagement.cargoOperations" label="Cargo Operations" />
                      <RatingRadioGroup name="shipManagement.maintenanceRepair" label="Maintenance & Repair" />
                      <RatingRadioGroup name="shipManagement.safetyCompliance" label="Safety & Compliance" />
                      
                      <FormField
                        control={form.control}
                        name="shipManagement.comments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comments & Observations</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Part C: Competence Assessment */}
                {activeSection === "competenceAssessment" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-700">Part C Competence Assessment (Professional Knowledge & Skills)</CardTitle>
                      <p className="text-sm text-blue-500">Description</p>
                    </CardHeader>
                    <CardContent>
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
                            {form.watch("competenceAssessments").map((assessment, index) => (
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
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                {competenceComments[assessment.id] !== undefined && (
                                  <tr>
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
                        <div className="bg-yellow-200 px-4 py-2 rounded text-lg font-semibold">
                          {calculateSectionScore()}
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white px-8">
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Part D: Leadership */}
                {activeSection === "leadership" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Part D: Leadership & Management</CardTitle>
                      <p className="text-sm text-gray-600">Rate from 1 (Poor) to 5 (Excellent)</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RatingRadioGroup name="leadership.teamManagement" label="Team Management" />
                      <RatingRadioGroup name="leadership.communication" label="Communication Skills" />
                      <RatingRadioGroup name="leadership.decisionMaking" label="Decision Making" />
                      <RatingRadioGroup name="leadership.problemSolving" label="Problem Solving" />
                      
                      <FormField
                        control={form.control}
                        name="leadership.comments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comments & Observations</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Part E: Professional Conduct */}
                {activeSection === "professionalConduct" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Part E: Professional Conduct</CardTitle>
                      <p className="text-sm text-gray-600">Rate from 1 (Poor) to 5 (Excellent)</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RatingRadioGroup name="professionalConduct.reliability" label="Reliability & Punctuality" />
                      <RatingRadioGroup name="professionalConduct.initiative" label="Initiative & Self-motivation" />
                      <RatingRadioGroup name="professionalConduct.adaptability" label="Adaptability" />
                      <RatingRadioGroup name="professionalConduct.workEthic" label="Work Ethic" />
                      
                      <FormField
                        control={form.control}
                        name="professionalConduct.comments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Comments & Observations</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Part F: Summary */}
                {activeSection === "summary" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Part F: Summary & Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="overallComments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Overall Performance Comments</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="recommendations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recommendations for Future Employment</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="developmentAreas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Areas for Development</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};