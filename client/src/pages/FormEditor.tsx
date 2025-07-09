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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Save, Plus, MessageSquare, Edit2, Trash2, Settings, Calendar as CalendarIcon } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
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

// Recommendation schema
const recommendationSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question is required"),
  answer: z.enum(["Yes", "No", "NA"]),
  comment: z.string().optional(),
  isCustom: z.boolean().optional().default(false),
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
  recommendations: z.array(recommendationSchema).default([]),
  appraiserComments: z.string().optional(),
  seafarerComments: z.string().optional(),

  // Part G: Office Review & Followup
  officeReviewComments: z.string().optional(),
  trainingFollowups: z.string().optional(),
});

type AppraisalFormData = z.infer<typeof appraisalSchema>;

interface FormEditorProps {
  form: Form;
  rankGroupName?: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ form, rankGroupName, onClose, onSave }) => {
  const [activeSection, setActiveSection] = useState("A");
  const [formVersion] = useState(0); // Starting version 0
  const [trainingComments, setTrainingComments] = useState<{[key: string]: string}>({});
  const [targetComments, setTargetComments] = useState<{[key: string]: string}>({});
  const [competenceComments, setCompetenceComments] = useState<{[key: string]: string}>({});
  const [behaviouralComments, setBehaviouralComments] = useState<{[key: string]: string}>({});
  const [trainingNeedsComments, setTrainingNeedsComments] = useState<{[key: string]: string}>({});
  const [recommendationComments, setRecommendationComments] = useState<{[key: string]: string}>({});
  
  // Configuration state for tracking which fields are configurable
  const [isConfigMode, setIsConfigMode] = useState(false);
  const [configurableFields, setConfigurableFields] = useState<Set<string>>(new Set());
  const [configurableSections, setConfigurableSections] = useState<Set<string>>(new Set());
  
  // Weight validation dialog state
  const [showWeightWarning, setShowWeightWarning] = useState(false);
  
  // Field visibility state
  const [fieldVisibility, setFieldVisibility] = useState({
    personalityIndexCategory: true,
  });
  
  // Section visibility state
  const [sectionVisibility, setSectionVisibility] = useState({
    partB: true,
    partB1: true,
    partB2: true,
    partD: true,
  });
  
  // Function to toggle field visibility
  const toggleFieldVisibility = (fieldName: string) => {
    setFieldVisibility(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };
  
  // Function to toggle section visibility
  const toggleSectionVisibility = (sectionName: string) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Function to get dynamic section letter based on visibility
  const getDynamicSectionLetter = (originalLetter: string) => {
    if (isConfigMode) return originalLetter; // In config mode, keep original letters
    
    const sectionOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const visibleSections = [];
    
    // Always include Part A as it's not configurable yet
    visibleSections.push('A');
    
    // Check which sections are visible
    if (sectionVisibility.partB) visibleSections.push('B');
    visibleSections.push('C'); // C is not configurable yet
    if (sectionVisibility.partD) visibleSections.push('D');
    visibleSections.push('E', 'F', 'G'); // These aren't configurable yet
    
    const originalIndex = sectionOrder.indexOf(originalLetter);
    const visibleIndex = visibleSections.indexOf(originalLetter);
    
    if (visibleIndex === -1) return originalLetter; // Section not found
    
    return String.fromCharCode(65 + visibleIndex); // Convert to letter (A=65)
  };
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [selectedVersionNo, setSelectedVersionNo] = useState<string>("");
  const [selectedVersionDate, setSelectedVersionDate] = useState<Date | undefined>();
  const [activeVersion, setActiveVersion] = useState<string>("00"); // Track which version is currently being viewed
  
  // Mock version data - in real implementation this would come from API
  const versions = [
    ...(hasSavedDraft ? [{
      versionNo: "01",
      versionDate: selectedVersionDate ? format(selectedVersionDate, "dd-MMM-yyyy") : "02-Jul-2025",
      status: "Draft"
    }] : []),
    {
      versionNo: "00",
      versionDate: "01-Jan-2025",
      status: "Released"
    }
  ];

  // Configuration helper functions
  const toggleFieldConfigurable = (fieldId: string) => {
    setConfigurableFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  };

  const toggleSectionConfigurable = (sectionId: string) => {
    setConfigurableSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };



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
      competenceAssessments: [],
      behaviouralAssessments: [],
      trainingNeeds: [],
      recommendations: [
        { id: "1", question: "Recommended for continued service on board?", answer: "Yes", comment: "", isCustom: false },
        { id: "2", question: "Recommended for re-employment?", answer: "Yes", comment: "", isCustom: false },
        { id: "3", question: "Recommended for promotion?", answer: "Yes", comment: "", isCustom: false },
        { id: "4", question: "Career Development recommendations (If Any)?", answer: "Yes", comment: "", isCustom: false },
      ],
    },
  });

  const onSubmit = (data: AppraisalFormData) => {
    // Check if we're in config mode and need to validate weights
    if (isConfigMode) {
      if (data.competenceAssessments.length > 0) {
        const totalWeight = calculateTotalWeight();
        console.log("Weight validation - Competence total weight:", totalWeight, "Config mode:", isConfigMode);
        if (totalWeight !== 100) {
          setShowWeightWarning(true);
          return; // Stop submission until weights are validated
        }
      }
      
      if (data.behaviouralAssessments.length > 0) {
        const totalWeight = calculateBehaviouralTotalWeight();
        console.log("Weight validation - Behavioural total weight:", totalWeight, "Config mode:", isConfigMode);
        if (totalWeight !== 100) {
          setShowWeightWarning(true);
          return; // Stop submission until weights are validated
        }
      }
    }
    
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

  // State for configuration mode dialog
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  
  // State for tracking which recommendation fields are in edit mode
  const [editingRecommendations, setEditingRecommendations] = useState<Set<string>>(new Set());

  // Recommendation management functions
  const addRecommendation = () => {
    if (!isConfigMode) {
      setShowConfigDialog(true);
      return;
    }
    
    const currentRecommendations = formMethods.getValues("recommendations");
    const newRecommendationId = Date.now().toString();
    const newRecommendation = {
      id: newRecommendationId,
      question: "Add new recommendation",
      answer: "Yes",
      comment: "",
      isCustom: true // Mark as custom/additional recommendation
    };
    formMethods.setValue("recommendations", [...currentRecommendations, newRecommendation]);
    
    // Automatically set new recommendation to edit mode
    startEditingRecommendation(newRecommendationId);
  };

  const handleEnterConfigMode = () => {
    setIsConfigMode(true);
    setShowConfigDialog(false);
  };

  // Functions to handle recommendation editing
  const startEditingRecommendation = (id: string) => {
    setEditingRecommendations(prev => new Set(prev).add(id));
  };

  const stopEditingRecommendation = (id: string) => {
    setEditingRecommendations(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleRecommendationBlur = (id: string) => {
    stopEditingRecommendation(id);
  };

  // Validation functions for assessment criteria
  const validateAssessmentCriteria = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check Part C competence assessments
    const competenceAssessments = formMethods.getValues("competenceAssessments");
    const blankCompetenceFields = competenceAssessments.filter(
      assessment => !assessment.assessmentCriteria?.trim()
    );
    
    if (blankCompetenceFields.length > 0) {
      errors.push(`Part C has ${blankCompetenceFields.length} blank assessment criteria field(s)`);
    }
    
    // Check Part D behavioural assessments
    const behaviouralAssessments = formMethods.getValues("behaviouralAssessments");
    const blankBehaviouralFields = behaviouralAssessments.filter(
      assessment => !assessment.assessmentCriteria?.trim()
    );
    
    if (blankBehaviouralFields.length > 0) {
      errors.push(`Part D has ${blankBehaviouralFields.length} blank assessment criteria field(s)`);
    }
    
    // Check custom recommendations
    const recommendations = formMethods.getValues("recommendations");
    const blankRecommendations = recommendations.filter(
      rec => rec.isCustom && (!rec.question?.trim() || rec.question === "Add new recommendation")
    );
    
    if (blankRecommendations.length > 0) {
      errors.push(`Part F has ${blankRecommendations.length} blank recommendation field(s)`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // State for validation error dialog
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateRecommendation = (id: string, field: string, value: string) => {
    const currentRecommendations = formMethods.getValues("recommendations");
    const updatedRecommendations = currentRecommendations.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    );
    formMethods.setValue("recommendations", updatedRecommendations);
  };

  const deleteRecommendation = (id: string) => {
    const currentRecommendations = formMethods.getValues("recommendations");
    const recommendationToDelete = currentRecommendations.find(r => r.id === id);
    
    // Only allow deletion of custom recommendations
    if (recommendationToDelete && recommendationToDelete.isCustom) {
      const filteredRecommendations = currentRecommendations.filter(r => r.id !== id);
      formMethods.setValue("recommendations", filteredRecommendations);
      setRecommendationComments(prev => {
        const newComments = { ...prev };
        delete newComments[id];
        return newComments;
      });
    }
  };

  const updateTrainingNeed = (id: string, field: string, value: string) => {
    const currentTrainingNeeds = formMethods.getValues("trainingNeeds");
    const updatedTrainingNeeds = currentTrainingNeeds.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    formMethods.setValue("trainingNeeds", updatedTrainingNeeds);
  };

  // Competence Assessment functions
  const addCompetenceCriterion = () => {
    const currentAssessments = formMethods.getValues("competenceAssessments");
    const newAssessment = {
      id: Date.now().toString(),
      assessmentCriteria: "",
      weight: 0,
      effectiveness: "",
      comment: ""
    };
    formMethods.setValue("competenceAssessments", [...currentAssessments, newAssessment]);
  };

  const updateCompetenceCriterion = (id: string, field: string, value: string | number) => {
    const currentAssessments = formMethods.getValues("competenceAssessments");
    const updatedAssessments = currentAssessments.map(assessment => 
      assessment.id === id ? { ...assessment, [field]: value } : assessment
    );
    formMethods.setValue("competenceAssessments", updatedAssessments);
  };

  const deleteCompetenceCriterion = (id: string) => {
    const currentAssessments = formMethods.getValues("competenceAssessments");
    const updatedAssessments = currentAssessments.filter(assessment => assessment.id !== id);
    formMethods.setValue("competenceAssessments", updatedAssessments);
  };

  // Function to calculate total weight
  const calculateTotalWeight = () => {
    const assessments = formMethods.getValues("competenceAssessments");
    return assessments.reduce((total, assessment) => total + (assessment.weight || 0), 0);
  };

  // Function to distribute weights equally
  const distributeWeightsEqually = () => {
    const assessments = formMethods.getValues("competenceAssessments");
    if (assessments.length === 0) return;
    
    const equalWeight = Math.floor(100 / assessments.length);
    const remainder = 100 % assessments.length;
    
    const updatedAssessments = assessments.map((assessment, index) => ({
      ...assessment,
      weight: index < remainder ? equalWeight + 1 : equalWeight
    }));
    
    formMethods.setValue("competenceAssessments", updatedAssessments);
  };

  // Behavioural Assessment functions
  const addBehaviouralAssessment = () => {
    const newAssessment = {
      id: Date.now().toString(),
      assessmentCriteria: "",
      weight: 0,
      effectiveness: "",
      comment: "",
    };
    const currentAssessments = formMethods.getValues("behaviouralAssessments");
    formMethods.setValue("behaviouralAssessments", [...currentAssessments, newAssessment]);
  };

  const deleteBehaviouralAssessment = (id: string) => {
    const currentAssessments = formMethods.getValues("behaviouralAssessments");
    const updatedAssessments = currentAssessments.filter(assessment => assessment.id !== id);
    formMethods.setValue("behaviouralAssessments", updatedAssessments);
  };

  const calculateBehaviouralTotalWeight = () => {
    const assessments = formMethods.getValues("behaviouralAssessments");
    return assessments.reduce((total, assessment) => total + (assessment.weight || 0), 0);
  };

  const distributeBehaviouralWeightsEqually = () => {
    const assessments = formMethods.getValues("behaviouralAssessments");
    if (assessments.length === 0) return;
    
    const equalWeight = Math.floor(100 / assessments.length);
    const remainder = 100 % assessments.length;
    
    const updatedAssessments = assessments.map((assessment, index) => ({
      ...assessment,
      weight: index < remainder ? equalWeight + 1 : equalWeight
    }));
    
    formMethods.setValue("behaviouralAssessments", updatedAssessments);
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
  ].filter(section => {
    // In config mode, show all sections
    if (isConfigMode) return true;
    // Outside config mode, filter out hidden sections
    if (section.id === "B" && !sectionVisibility.partB) return false;
    if (section.id === "D" && !sectionVisibility.partD) return false;
    return true;
  }).map((section, index) => ({
    ...section,
    // Update the display ID to use dynamic lettering
    displayId: isConfigMode ? section.id : String.fromCharCode(65 + index),
    displayTitle: isConfigMode ? section.title : section.title
  }));



  const renderPartA = () => (
    <div className="space-y-6">
      <div className="pb-4 mb-6">
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

      {fieldVisibility.personalityIndexCategory && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="personalityIndexCategory">Personality Index (PI) Category</Label>
            {isConfigMode && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleFieldVisibility('personalityIndexCategory')}
                className="text-sm px-3 py-1 h-7"
                style={{ 
                  borderColor: '#52baf3',
                  color: '#52baf3'
                }}
              >
                Hide Field
              </Button>
            )}
          </div>
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
      )}
      {isConfigMode && !fieldVisibility.personalityIndexCategory && (
        <div className="space-y-2 opacity-50">
          <div className="flex items-center justify-between">
            <Label htmlFor="personalityIndexCategory" className="text-gray-400">Personality Index (PI) Category (Hidden)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toggleFieldVisibility('personalityIndexCategory')}
              className="text-sm px-3 py-1 h-7"
              style={{ 
                borderColor: '#52baf3',
                color: '#52baf3'
              }}
            >
              Show Field
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPartB = () => (
    <div className="space-y-8">
      <div className="pb-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold" style={{ color: '#16569e' }}>Part {getDynamicSectionLetter('B')}: Information at Start of Appraisal Period</h3>
          {isConfigMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toggleSectionVisibility('partB')}
              className="text-sm px-3 py-1 h-7"
              style={{ 
                borderColor: '#52baf3',
                color: '#52baf3'
              }}
            >
              {sectionVisibility.partB ? 'Hide Section' : 'Show Section'}
            </Button>
          )}
        </div>
        <div style={{ color: '#16569e' }} className="text-sm">Add below at the start of the Appraisal Period except the Evaluation which must be completed at the end of the Appraisal Period</div>
        <div className="w-full h-0.5 mt-2" style={{ backgroundColor: '#16569e' }}></div>
      </div>
      
      {sectionVisibility.partB && (
        <>
          {/* B1. Trainings conducted prior joining vessel */}
          {sectionVisibility.partB1 && (
            <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium" style={{ color: '#16569e' }}>B1. Trainings conducted prior joining vessel (To Assess Effectiveness)</h3>
          <div className="flex items-center gap-2">
            {isConfigMode && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleSectionVisibility('partB1')}
                className="text-sm px-3 py-1 h-7"
                style={{ 
                  borderColor: '#52baf3',
                  color: '#52baf3'
                }}
              >
                {sectionVisibility.partB1 ? 'Hide Section' : 'Show Section'}
              </Button>
            )}
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
          )}

          {/* Hidden B1 placeholder in config mode */}
          {isConfigMode && !sectionVisibility.partB1 && (
            <div className="opacity-50 bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-400">B1. Trainings conducted prior joining vessel (Hidden)</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSectionVisibility('partB1')}
                  className="text-sm px-3 py-1 h-7"
                  style={{ 
                    borderColor: '#52baf3',
                    color: '#52baf3'
                  }}
                >
                  Show Section
                </Button>
              </div>
              <div className="text-gray-400 text-sm">Section is hidden</div>
            </div>
          )}

          {/* B2. Target Setting */}
          {sectionVisibility.partB2 && (
            <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium" style={{ color: '#16569e' }}>B2. Target Setting</h3>
          <div className="flex items-center gap-2">
            {isConfigMode && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleSectionVisibility('partB2')}
                className="text-sm px-3 py-1 h-7"
                style={{ 
                  borderColor: '#52baf3',
                  color: '#52baf3'
                }}
              >
                {sectionVisibility.partB2 ? 'Hide Section' : 'Show Section'}
              </Button>
            )}
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
            )}

          {/* Hidden B2 placeholder in config mode */}
          {isConfigMode && !sectionVisibility.partB2 && (
            <div className="opacity-50 bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-400">B2. Target Setting (Hidden)</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSectionVisibility('partB2')}
                  className="text-sm px-3 py-1 h-7"
                  style={{ 
                    borderColor: '#52baf3',
                    color: '#52baf3'
                  }}
                >
                  Show Section
                </Button>
              </div>
              <div className="text-gray-400 text-sm">Section is hidden</div>
            </div>
          )}
        </>
      )}

      {/* Hidden Part B placeholder in config mode */}
      {isConfigMode && !sectionVisibility.partB && (
        <div className="opacity-50 bg-gray-50 p-6 rounded border-2 border-dashed border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-400">Part B: Information at Start of Appraisal Period (Hidden)</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toggleSectionVisibility('partB')}
              className="text-sm px-3 py-1 h-7"
              style={{ 
                borderColor: '#52baf3',
                color: '#52baf3'
              }}
            >
              Show Section
            </Button>
          </div>
          <div className="text-gray-400 text-sm">Section is hidden</div>
        </div>
      )}
    </div>
  );

  const renderPartC = () => (
    <div className="space-y-6">
      <div className="pb-4 mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#16569e' }}>Part {getDynamicSectionLetter('C')}: Competence Assessment (Professional Knowledge & Skills)</h3>
        <div style={{ color: '#16569e' }} className="text-sm">Description</div>
        <div className="w-full h-0.5 mt-2" style={{ backgroundColor: '#16569e' }}></div>
      </div>
      
      {/* Add Criterion Button */}
      {isConfigMode && (
        <div className="flex justify-end items-center mb-4">
          <Button
            type="button"
            onClick={addCompetenceCriterion}
            variant="outline"
            size="sm"
            className="text-sm px-3 py-1 h-7"
            style={{ 
              borderColor: '#52baf3',
              color: '#52baf3'
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Criterion
          </Button>
        </div>
      )}
      
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
                  <td className="p-3">
                    {isConfigMode ? (
                      <Input
                        value={assessment.assessmentCriteria}
                        onChange={(e) => updateCompetenceCriterion(assessment.id, "assessmentCriteria", e.target.value)}
                        placeholder="Enter assessment criteria"
                        className="border-0 bg-transparent p-0 focus-visible:ring-0"
                        style={{ color: '#52baf3' }}
                      />
                    ) : (
                      <span className="text-sm">{assessment.assessmentCriteria}</span>
                    )}
                  </td>
                  <td className="p-3">
                    {isConfigMode ? (
                      <Input
                        type="number"
                        value={assessment.weight}
                        onChange={(e) => updateCompetenceCriterion(assessment.id, "weight", parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="border-0 bg-transparent p-0 focus-visible:ring-0 w-16"
                        style={{ color: '#52baf3' }}
                        min="0"
                        max="100"
                      />
                    ) : (
                      <span className="text-sm">{assessment.weight}%</span>
                    )}
                  </td>
                  <td className="p-3">
                    <Select
                      value={assessment.effectiveness}
                      onValueChange={(value) => updateCompetenceCriterion(assessment.id, "effectiveness", value)}
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
                      {isConfigMode && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCompetenceCriterion(assessment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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
                          updateCompetenceCriterion(assessment.id, "comment", e.target.value);
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
            {formMethods.watch("competenceAssessments").length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  {isConfigMode ? "No assessment criteria added yet. Click \"Add Criterion\" to get started." : "No assessment criteria configured."}
                </td>
              </tr>
            )}
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
      <div className="pb-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold" style={{ color: '#16569e' }}>Part {getDynamicSectionLetter('D')}: Behavioural Assessment (Soft Skills)</h3>
          {isConfigMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toggleSectionVisibility('partD')}
              className="text-sm px-3 py-1 h-7"
              style={{ 
                borderColor: '#52baf3',
                color: '#52baf3'
              }}
            >
              {sectionVisibility.partD ? 'Hide Section' : 'Show Section'}
            </Button>
          )}
        </div>
        <div style={{ color: '#16569e' }} className="text-sm">Description</div>
        <div className="w-full h-0.5 mt-2" style={{ backgroundColor: '#16569e' }}></div>
      </div>
      
      {sectionVisibility.partD && (
        <>
          {/* Add Criterion Button */}
          {isConfigMode && (
            <div className="flex justify-end items-center mb-4">
              <Button
                type="button"
                onClick={addBehaviouralAssessment}
                variant="outline"
                size="sm"
                className="text-sm px-3 py-1 h-7"
                style={{ 
                  borderColor: '#52baf3',
                  color: '#52baf3'
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Criterion
              </Button>
            </div>
          )}
          
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
                      <td className="p-3 text-sm">
                        {isConfigMode ? (
                          <Input
                            value={assessment.assessmentCriteria}
                            onChange={(e) => updateBehaviouralAssessment(assessment.id, "assessmentCriteria", e.target.value)}
                            placeholder="Enter Assessment Criteria"
                            className="border-0 bg-transparent p-0 focus-visible:ring-0"
                            style={{ color: '#52baf3' }}
                          />
                        ) : (
                          assessment.assessmentCriteria
                        )}
                      </td>
                      <td className="p-3 text-sm text-center">
                        {isConfigMode ? (
                          <Input
                            type="number"
                            value={assessment.weight}
                            onChange={(e) => updateBehaviouralAssessment(assessment.id, "weight", parseInt(e.target.value) || 0)}
                            className="border-0 bg-transparent p-0 focus-visible:ring-0 text-center w-16"
                            style={{ color: '#52baf3' }}
                          />
                        ) : (
                          `${assessment.weight}%`
                        )}
                      </td>
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
                          {isConfigMode && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBehaviouralAssessment(assessment.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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
        </>
      )}

      {/* Hidden Part D placeholder in config mode */}
      {isConfigMode && !sectionVisibility.partD && (
        <div className="opacity-50 bg-gray-50 p-6 rounded border-2 border-dashed border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-400">Part D: Behavioural Assessment (Soft Skills) (Hidden)</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toggleSectionVisibility('partD')}
              className="text-sm px-3 py-1 h-7"
              style={{ 
                borderColor: '#52baf3',
                color: '#52baf3'
              }}
            >
              Show Section
            </Button>
          </div>
          <div className="text-gray-400 text-sm">Section is hidden</div>
        </div>
      )}
    </div>
  );

  const renderPartE = () => (
    <div className="space-y-6">
      <div className="pb-4 mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#16569e' }}>Part {getDynamicSectionLetter('E')}: Training Needs & Development</h3>
        <div style={{ color: '#16569e' }} className="text-sm">Specify any training needs identified during the appraisals period</div>
        <div className="w-full h-0.5 mt-2" style={{ backgroundColor: '#16569e' }}></div>
      </div>
      
      <div className="flex justify-end items-center">
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
      <div className="pb-4 mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#16569e' }}>Part {getDynamicSectionLetter('F')}: Summary & Recommendations</h3>
        <div style={{ color: '#16569e' }} className="text-sm">Add any recommendations related to following</div>
        <div className="w-full h-0.5 mt-2" style={{ backgroundColor: '#16569e' }}></div>
      </div>
      
      {/* F1: Overall Score */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold" style={{ color: '#16569e' }}>F1. Overall Score</h3>
        <div className={`px-4 py-2 rounded text-lg font-bold min-w-[64px] text-center ${getScoreColors(parseFloat(calculateOverallScore())).bgColor} ${getScoreColors(parseFloat(calculateOverallScore())).textColor}`}>
          {calculateOverallScore()}
        </div>
      </div>

      {/* F2: Appraiser's Recommendations */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold" style={{ color: '#16569e' }}>F2. Appraiser's Recommendations</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-sm px-3 py-1 h-7"
            style={{ 
              borderColor: isConfigMode ? '#52baf3' : '#d1d5db',
              color: isConfigMode ? '#52baf3' : '#6b7280'
            }}
            onClick={addRecommendation}
          >
            + Add Recommendation
          </Button>
        </div>
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
              {formMethods.watch("recommendations").map((recommendation, index) => (
                <React.Fragment key={recommendation.id}>
                  <tr className="border-t">
                    <td className="p-3 text-sm">{index + 1}.</td>
                    <td className="p-3 text-sm" style={{ 
                      color: recommendation.isCustom && isConfigMode ? '#52baf3' : 'inherit'
                    }}>
                      {recommendation.isCustom && isConfigMode ? (
                        editingRecommendations.has(recommendation.id) ? (
                          <Input
                            value={recommendation.question === "Add new recommendation" ? "" : recommendation.question}
                            onChange={(e) => updateRecommendation(recommendation.id, "question", e.target.value)}
                            onBlur={() => handleRecommendationBlur(recommendation.id)}
                            placeholder="Add new recommendation"
                            className="border-0 bg-transparent p-0 focus-visible:ring-0"
                            style={{ color: '#52baf3' }}
                            autoFocus
                          />
                        ) : (
                          <div
                            className="cursor-pointer p-0"
                            onClick={() => startEditingRecommendation(recommendation.id)}
                            style={{ color: '#52baf3' }}
                          >
                            {recommendation.question}
                          </div>
                        )
                      ) : (
                        recommendation.question
                      )}
                    </td>
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
                        {recommendation.isCustom && isConfigMode && (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              style={{ color: '#52baf3' }}
                              onClick={() => startEditingRecommendation(recommendation.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRecommendation(recommendation.id)}
                              style={{ color: '#52baf3' }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {recommendationComments[recommendation.id] !== undefined && (
                    <tr key={`comment-${recommendation.id}`}>
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
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* F3: Appraiser Comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#16569e' }}>F3. Appraiser Comments</h3>
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
        <h3 className="text-lg font-semibold" style={{ color: '#16569e' }}>F4. Seafarer Comments</h3>
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
      <div className="pb-4 mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#16569e' }}>Part {getDynamicSectionLetter('G')}: Office Review & Followup</h3>
        <div style={{ color: '#16569e' }} className="text-sm">This section is visible to office users only</div>
        <div className="w-full h-0.5 mt-2" style={{ backgroundColor: '#16569e' }}></div>
      </div>
      
      {/* G1: Office Review */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#16569e' }}>G1. Office Review</h3>
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
        <h3 className="text-lg font-semibold" style={{ color: '#16569e' }}>G2. Training Follow-up</h3>
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
      case "B": return (sectionVisibility.partB || isConfigMode) ? renderPartB() : renderPartA();
      case "C": return renderPartC();
      case "D": return (sectionVisibility.partD || isConfigMode) ? renderPartD() : renderPartA();
      case "E": return renderPartE();
      case "F": return renderPartF();
      case "G": return renderPartG();
      default: return renderPartA();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full h-[90%] flex flex-col">
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
              Crew Appraisal Form - {rankGroupName || "Rank Group"}
            </h2>
            {isConfigMode && (
              <Badge variant="outline" className="ml-2">
                Configuration Mode
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isConfigMode ? (
              <Button
                variant={hasSavedDraft ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  hasSavedDraft 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!hasSavedDraft}
              >
                Release Ver
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  setIsConfigMode(false);
                  setHasSavedDraft(false);
                  setSelectedVersionNo("");
                  setSelectedVersionDate(undefined);
                  setActiveVersion("00"); // Return to released version
                }}
              >
                Discard Ver
              </Button>
            )}
            <Button
              variant={isConfigMode ? "default" : "outline"}
              onClick={() => {
                if (isConfigMode) {
                  // Validate assessment criteria fields before exiting config mode
                  const validationResult = validateAssessmentCriteria();
                  if (!validationResult.isValid) {
                    setValidationErrors(validationResult.errors);
                    setShowValidationDialog(true);
                    return;
                  }
                }
                setIsConfigMode(!isConfigMode);
              }}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {isConfigMode ? "Exit Config" : "Configure Fields"}
            </Button>
            <Button 
              onClick={() => {
                // Validate assessment criteria fields
                const validationResult = validateAssessmentCriteria();
                if (!validationResult.isValid) {
                  setValidationErrors(validationResult.errors);
                  setShowValidationDialog(true);
                  return;
                }
                
                // Manual weight validation check before submitting
                if (isConfigMode) {
                  const competenceAssessments = formMethods.getValues("competenceAssessments");
                  const behaviouralAssessments = formMethods.getValues("behaviouralAssessments");
                  
                  if (competenceAssessments.length > 0) {
                    const totalWeight = calculateTotalWeight();
                    console.log("Manual validation - Competence total weight:", totalWeight, "Assessments:", competenceAssessments);
                    if (totalWeight !== 100) {
                      setShowWeightWarning(true);
                      return;
                    }
                  }
                  
                  if (behaviouralAssessments.length > 0) {
                    const totalWeight = calculateBehaviouralTotalWeight();
                    console.log("Manual validation - Behavioural total weight:", totalWeight, "Assessments:", behaviouralAssessments);
                    if (totalWeight !== 100) {
                      setShowWeightWarning(true);
                      return;
                    }
                  }
                }
                setHasSavedDraft(true);
                setActiveVersion("01"); // Switch to draft version when saving
                formMethods.handleSubmit(onSubmit)();
              }}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
          </div>
        </div>

        {/* Version Display Bars */}
        <div className="border-b">
          {isConfigMode ? (
            // In configuration mode, show only draft version bar with interactive controls
            <div className="px-4 py-3 bg-blue-50 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Version No:</span>
                    <Select
                      value={selectedVersionNo || "01"}
                      onValueChange={setSelectedVersionNo}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue placeholder="01" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01">01</SelectItem>
                        <SelectItem value="02">02</SelectItem>
                        <SelectItem value="03">03</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Version Date:</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-36 h-8 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedVersionDate ? format(selectedVersionDate, "dd-MMM-yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedVersionDate}
                          onSelect={setSelectedVersionDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className="text-sm font-semibold text-blue-600">Draft</span>
                </div>
              </div>
            </div>
          ) : (
            // Outside configuration mode, show version history (both draft and released if draft exists)
            versions.map((version, index) => (
              <div
                key={version.versionNo}
                className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-100 ${
                  activeVersion === version.versionNo 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'bg-gray-50'
                } ${index < versions.length - 1 ? 'border-b border-gray-200' : ''}`}
                onClick={() => setActiveVersion(version.versionNo)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Version No:</span>
                      <span className="text-sm font-semibold">{version.versionNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Version Date:</span>
                      <span className="text-sm font-semibold">{version.versionDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`text-sm font-semibold ${
                      version.status === "Released" ? "text-green-600" : "text-blue-600"
                    }`}>
                      {version.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Stepper Design */}
          <div className="w-72 overflow-y-auto bg-[#f8fafc]">
            <div className="p-6">
              <nav className="space-y-1">
                {sections.map((section, index) => {
                  const isActive = activeSection === section.id;
                  const isCompleted = false; // You can add completion logic here
                  
                  return (
                    <div key={section.id} className="relative">
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center p-3 rounded-lg text-left transition-colors hover:bg-gray-50 ${
                          isActive ? "bg-blue-50" : ""
                        }`}
                      >
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-4 ${
                            isActive ? "bg-blue-600" : isCompleted ? "bg-green-500" : "bg-gray-400"
                          }`}
                        >
                          {section.displayId}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${isActive ? "text-blue-700" : "text-gray-700"}`}>
                            {section.title}
                          </div>
                        </div>
                      </button>
                      {index < sections.length - 1 && (
                        <div className="absolute left-[2rem] top-16 w-0.5 h-4 bg-gray-300"></div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
            <div className="p-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  {renderSectionContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weight Warning Dialog */}
      {showWeightWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Weight Validation</h3>
            <p className="text-gray-600 mb-4">
              Total weight must be 100%. 
              {(() => {
                const competenceAssessments = formMethods.getValues("competenceAssessments");
                const behaviouralAssessments = formMethods.getValues("behaviouralAssessments");
                
                if (competenceAssessments.length > 0 && calculateTotalWeight() !== 100) {
                  return `Part C current total is ${calculateTotalWeight()}%.`;
                }
                if (behaviouralAssessments.length > 0 && calculateBehaviouralTotalWeight() !== 100) {
                  return `Part D current total is ${calculateBehaviouralTotalWeight()}%.`;
                }
                return "";
              })()}
              Do you want to equally distribute the weights?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowWeightWarning(false)}
              >
                No
              </Button>
              <Button
                onClick={() => {
                  const competenceAssessments = formMethods.getValues("competenceAssessments");
                  const behaviouralAssessments = formMethods.getValues("behaviouralAssessments");
                  
                  if (competenceAssessments.length > 0 && calculateTotalWeight() !== 100) {
                    distributeWeightsEqually();
                  }
                  if (behaviouralAssessments.length > 0 && calculateBehaviouralTotalWeight() !== 100) {
                    distributeBehaviouralWeightsEqually();
                  }
                  setShowWeightWarning(false);
                }}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Configuration Mode Dialog */}
      <AlertDialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Configuration Mode?</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be in configuration mode to add new recommendations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleEnterConfigMode}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Field Validation Dialog */}
      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Validation Errors</AlertDialogTitle>
            <AlertDialogDescription>
              Please fix the following errors before proceeding:
              <ul className="mt-2 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-red-600 font-medium">• {error}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};