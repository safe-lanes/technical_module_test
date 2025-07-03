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

// Part F schemas
const recommendationSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.enum(["Yes", "No", "NA"]),
  comment: z.string().optional(),
});

const appraiserCommentSchema = z.object({
  id: z.string(),
  name: z.string(),
  rank: z.string(),
  comment: z.string(),
});

const seafarerCommentSchema = z.object({
  id: z.string(),
  name: z.string(),
  rank: z.string(),
  comment: z.string(),
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
  
  // Part D: Behavioural Assessment
  behaviouralAssessments: z.array(behaviouralAssessmentSchema).default([]),
  
  // Part E: Training Needs & Development
  trainingNeeds: z.array(trainingNeedsSchema).default([]),
  
  // Part F: Comments & Recommendations
  recommendations: z.array(recommendationSchema).default([]),
  appraiserComments: z.array(appraiserCommentSchema).default([]),
  seafarerComments: z.array(seafarerCommentSchema).default([]),
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
  const [behaviouralComments, setBehaviouralComments] = useState<{[key: string]: string}>({});
  const [trainingNeedsComments, setTrainingNeedsComments] = useState<{[key: string]: string}>({});
  const [recommendationComments, setRecommendationComments] = useState<{[key: string]: string}>({});
  const [editingAppraiserComment, setEditingAppraiserComment] = useState<string | null>(null);
  const [editingSeafarerComment, setEditingSeafarerComment] = useState<string | null>(null);

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
      
      // Part F: Comments & Recommendations
      recommendations: [
        { id: "1", question: "Recommended for continued service on board?", answer: "Yes", comment: "" },
        { id: "2", question: "Recommended for re-employment?", answer: "Yes", comment: "" },
        { id: "3", question: "Recommended for promotion?", answer: "Yes", comment: "" },
        { id: "4", question: "Career Development recommendations (If Any)?", answer: "Yes", comment: "" },
      ],
      appraiserComments: [
        { id: "primary", name: "", rank: "", comment: "" }
      ],
      seafarerComments: [
        { id: "seafarer", name: "", rank: "", comment: "" }
      ],
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

  // Behavioural Assessment management functions
  const updateBehaviouralAssessment = (id: string, field: string, value: string | number) => {
    const currentAssessments = form.getValues("behaviouralAssessments");
    const updatedAssessments = currentAssessments.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    );
    form.setValue("behaviouralAssessments", updatedAssessments);
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

  // Calculate behavioural section score
  const calculateBehaviouralSectionScore = () => {
    const assessments = form.watch("behaviouralAssessments");
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
    const currentTrainingNeeds = form.getValues("trainingNeeds");
    form.setValue("trainingNeeds", [...currentTrainingNeeds, newTrainingNeed]);
  };

  const deleteTrainingNeed = (id: string) => {
    const currentTrainingNeeds = form.getValues("trainingNeeds");
    form.setValue("trainingNeeds", currentTrainingNeeds.filter(t => t.id !== id));
    setTrainingNeedsComments(prev => {
      const newComments = { ...prev };
      delete newComments[id];
      return newComments;
    });
  };

  const updateTrainingNeed = (id: string, field: string, value: string) => {
    const currentTrainingNeeds = form.getValues("trainingNeeds");
    const updatedTrainingNeeds = currentTrainingNeeds.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    form.setValue("trainingNeeds", updatedTrainingNeeds);
  };

  // Calculate overall score (F1)
  const calculateOverallScore = () => {
    const competenceScore = parseFloat(calculateSectionScore());
    const behaviouralScore = parseFloat(calculateBehaviouralSectionScore());
    return ((competenceScore + behaviouralScore) / 2).toFixed(1);
  };

  // Recommendation management functions
  const updateRecommendation = (id: string, field: string, value: string) => {
    const currentRecommendations = form.getValues("recommendations");
    const updatedRecommendations = currentRecommendations.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    );
    form.setValue("recommendations", updatedRecommendations);
  };

  // Appraiser Comments management
  const addAppraiserComment = (name: string, rank: string) => {
    const newComment = {
      id: Date.now().toString(),
      name,
      rank,
      comment: "",
    };
    const currentComments = form.getValues("appraiserComments");
    form.setValue("appraiserComments", [...currentComments, newComment]);
    setEditingAppraiserComment(newComment.id);
  };

  const updateAppraiserComment = (id: string, field: string, value: string) => {
    const currentComments = form.getValues("appraiserComments");
    const updatedComments = currentComments.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    form.setValue("appraiserComments", updatedComments);
  };

  const deleteAppraiserComment = (id: string) => {
    const currentComments = form.getValues("appraiserComments");
    form.setValue("appraiserComments", currentComments.filter(c => c.id !== id));
  };

  // Seafarer Comments management
  const updateSeafarerComment = (id: string, field: string, value: string) => {
    const currentComments = form.getValues("seafarerComments");
    const updatedComments = currentComments.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    form.setValue("seafarerComments", updatedComments);
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
    { id: "competenceAssessment", title: "Part C: Competence Assessment (Professional Knowledge & Skills)" },
    { id: "behaviouralAssessment", title: "Part D: Behavioural Assessment (Soft Skills)" },
    { id: "trainingNeeds", title: "Part E: Training Needs & Development" },
    { id: "summary", title: "Part F: Summary & Recommendations" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg sm:text-xl font-bold">Crew Appraisal Form</h1>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => form.handleSubmit(onSubmit)()}
              className="hidden sm:flex"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => form.handleSubmit(onSubmit)()}
              className="sm:hidden"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              size="sm"
              onClick={() => form.handleSubmit(onSubmit)()}
              className="hidden sm:flex"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
            <Button 
              size="sm"
              onClick={() => form.handleSubmit(onSubmit)()}
              className="sm:hidden"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Mobile Navigation Dropdown */}
          <div className="lg:hidden bg-gray-50 border-b p-3">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block w-64 xl:w-72 bg-gray-50 border-r">
            <div className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded text-sm transition-colors ${
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
          </div>

          {/* Form Content */}
          <div className="flex-1 p-3 sm:p-4 lg:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                
                {/* Part A: Seafarer's Information */}
                {activeSection === "reference" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#3B82F6]">Part A Seafarer's Information</CardTitle>
                      <p className="text-sm text-[#60A5FA]">Enter details as applicable</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                {/* Part D: Behavioural Assessment */}
                {activeSection === "behaviouralAssessment" && (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-blue-700">Part D Behavioural Assessment (Soft Skills)</CardTitle>
                          <p className="text-sm text-blue-500">Description</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          + Add Criterion
                        </Button>
                      </div>
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
                          {form.watch("behaviouralAssessments").map((assessment, index) => (
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
                              {behaviouralComments[assessment.id] !== undefined && (
                                <tr>
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
                        <span className="text-lg font-bold text-red-600">{calculateBehaviouralSectionScore()}</span>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Part E: Training Needs & Development */}
                {activeSection === "trainingNeeds" && (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-blue-700">Part E Training Needs & Development</CardTitle>
                          <p className="text-sm text-blue-500">Specify any training needs identified during the appraisals period</p>
                        </div>
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
                    </CardHeader>
                    <CardContent>
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
                          {form.watch("trainingNeeds").map((trainingNeed, index) => (
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
                                    >
                                      <Edit2 className="h-4 w-4" />
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
                                <tr>
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
                          {form.watch("trainingNeeds").length === 0 && (
                            <tr>
                              <td colSpan={3} className="p-8 text-center text-gray-500">
                                No training needs added yet. Click "Add Training from Database" or "Add New Training" to get started.
                              </td>
                            </tr>
                          )}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex justify-between mt-6">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                          Save
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                          Submit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Part F: Comments & Recommendations */}
                {activeSection === "summary" && (
                  <div className="space-y-6">
                    {/* F1: Overall Score */}
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-blue-700">Part F Comments & Recommendations</CardTitle>
                          <p className="text-sm text-blue-500">Add any recommendations related to following</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-semibold text-blue-700">F1. Overall Score</h3>
                          <div className="bg-yellow-200 px-4 py-2 rounded text-lg font-bold">
                            {calculateOverallScore()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* F2: Appraiser's Recommendations */}
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-blue-700">F2. Appraiser's Recommendations</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-300"
                          >
                            + Add Recommendation
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-left p-3 text-sm font-medium text-gray-600">S.No</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-600">Recommendations</th>
                                <th className="text-center p-3 text-sm font-medium text-gray-600">Yes</th>
                                <th className="text-center p-3 text-sm font-medium text-gray-600">No</th>
                                <th className="text-center p-3 text-sm font-medium text-gray-600">NA</th>
                                <th className="text-center p-3 text-sm font-medium text-gray-600">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {form.watch("recommendations").map((recommendation, index) => (
                                <React.Fragment key={recommendation.id}>
                                  <tr className="border-t">
                                    <td className="p-3 text-sm">{index + 1}.</td>
                                    <td className="p-3 text-sm">{recommendation.question}</td>
                                    <td className="text-center p-3">
                                      <input
                                        type="radio"
                                        name={`recommendation-${recommendation.id}`}
                                        checked={recommendation.answer === "Yes"}
                                        onChange={() => updateRecommendation(recommendation.id, "answer", "Yes")}
                                        className="w-4 h-4"
                                      />
                                    </td>
                                    <td className="text-center p-3">
                                      <input
                                        type="radio"
                                        name={`recommendation-${recommendation.id}`}
                                        checked={recommendation.answer === "No"}
                                        onChange={() => updateRecommendation(recommendation.id, "answer", "No")}
                                        className="w-4 h-4"
                                      />
                                    </td>
                                    <td className="text-center p-3">
                                      <input
                                        type="radio"
                                        name={`recommendation-${recommendation.id}`}
                                        checked={recommendation.answer === "NA"}
                                        onChange={() => updateRecommendation(recommendation.id, "answer", "NA")}
                                        className="w-4 h-4"
                                      />
                                    </td>
                                    <td className="p-3">
                                      <div className="flex justify-center space-x-2">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setRecommendationComments(prev => ({
                                            ...prev,
                                            [recommendation.id]: prev[recommendation.id] || ""
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
                                  {recommendationComments[recommendation.id] !== undefined && (
                                    <tr>
                                      <td></td>
                                      <td colSpan={5} className="p-3">
                                        <Textarea
                                          value={recommendationComments[recommendation.id]}
                                          onChange={(e) => {
                                            setRecommendationComments(prev => ({
                                              ...prev,
                                              [recommendation.id]: e.target.value
                                            }));
                                            updateRecommendation(recommendation.id, "comment", e.target.value);
                                          }}
                                          placeholder="Comment: Add your observations here..."
                                          className="text-blue-600 italic border-blue-200"
                                          rows={2}
                                        />
                                      </td>
                                    </tr>
                                  )}
                                  {recommendation.id === "4" && recommendation.comment && (
                                    <tr>
                                      <td></td>
                                      <td colSpan={5} className="p-3">
                                        <p className="text-blue-600 italic text-sm">
                                          Comment: Recommended as there seemed to be a large gap in officer's understanding.
                                        </p>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* F3: Appraiser's Comments */}
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-blue-700">F3. Appraiser's Comments</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-gray-600 border-gray-300"
                            onClick={() => {
                              // This would show a dropdown to select from ship's officers
                              addAppraiserComment("Ashok Kumar", "Chief Officer");
                            }}
                          >
                            + Add Appraiser
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {form.watch("appraiserComments").map((appraiser, index) => (
                          <div key={appraiser.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-blue-600">
                                  {index === 0 ? form.watch("primaryAppraiser") || "Capt. John Leki, Master (Primary Appraiser)" : `${appraiser.name}, ${appraiser.rank}`}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingAppraiserComment(appraiser.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteAppraiserComment(appraiser.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            {editingAppraiserComment === appraiser.id ? (
                              <Textarea
                                value={appraiser.comment}
                                onChange={(e) => updateAppraiserComment(appraiser.id, "comment", e.target.value)}
                                onBlur={() => setEditingAppraiserComment(null)}
                                placeholder="Add your comment here..."
                                className="text-blue-600 italic"
                                rows={3}
                                autoFocus
                              />
                            ) : (
                              appraiser.comment && (
                                <p className="text-blue-600 italic text-sm pl-4">
                                  {appraiser.comment || (index === 0 ? "Officer X has performed consistently throughout the contract and participated in upgradation of the XXX. The inspection performance has been satisfactory, no major findings received in 2 SIRE and 1 PSC inspections." : "Officer X has performed consistently throughout the contract and participated in upgradation of the XXX. The inspection performance has been satisfactory, no major findings received in 2 SIRE and 1 PSC inspections.")}
                                </p>
                              )
                            )}
                            {editingAppraiserComment !== appraiser.id && !appraiser.comment && index === 0 && (
                              <div 
                                className="border-2 border-dashed border-blue-200 p-3 rounded cursor-pointer hover:bg-blue-50"
                                onClick={() => setEditingAppraiserComment(appraiser.id)}
                              >
                                <p className="text-gray-500 text-sm">Click to add comment...</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* F4: Seafarer's Comments */}
                    <Card>
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-blue-700">F4. Seafarer's Comments</h3>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {form.watch("seafarerComments").map((seafarer, index) => (
                          <div key={seafarer.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-blue-600">
                                  {`${form.watch("seafarersName") || "Derek Cole"}, ${form.watch("seafarersRank") || "3rd Officer"}`}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingSeafarerComment(seafarer.id)}
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
                            </div>
                            {editingSeafarerComment === seafarer.id ? (
                              <Textarea
                                value={seafarer.comment}
                                onChange={(e) => updateSeafarerComment(seafarer.id, "comment", e.target.value)}
                                onBlur={() => setEditingSeafarerComment(null)}
                                placeholder="Add your comment here..."
                                className="text-blue-600 italic"
                                rows={3}
                                autoFocus
                              />
                            ) : (
                              seafarer.comment && (
                                <p className="text-blue-600 italic text-sm pl-4">
                                  {seafarer.comment || "I have received a very good opportunity to learn effectively during my tenure on board. I was able to practically apply the skills I had gained to enhance the operational performance. I would like to return on this vessel."}
                                </p>
                              )
                            )}
                            {editingSeafarerComment !== seafarer.id && !seafarer.comment && (
                              <div 
                                className="border-2 border-dashed border-blue-200 p-3 rounded cursor-pointer hover:bg-blue-50"
                                onClick={() => setEditingSeafarerComment(seafarer.id)}
                              >
                                <p className="text-gray-500 text-sm">Click to add comment...</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Action buttons */}
                    <div className="flex justify-between mt-6">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                        Save
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                        Submit
                      </Button>
                    </div>
                  </div>
                )}

              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};