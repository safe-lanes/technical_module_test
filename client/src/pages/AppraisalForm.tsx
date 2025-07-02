import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
  
  // Part B: Evaluation sections
  shipManagement: z.object({
    navigation: z.string().min(1, "Rating required"),
    cargoOperations: z.string().min(1, "Rating required"),
    maintenanceRepair: z.string().min(1, "Rating required"),
    safetyCompliance: z.string().min(1, "Rating required"),
    comments: z.string().optional(),
  }),
  
  technicalSkills: z.object({
    equipmentOperation: z.string().min(1, "Rating required"),
    troubleshooting: z.string().min(1, "Rating required"),
    preventiveMaintenance: z.string().min(1, "Rating required"),
    emergencyResponse: z.string().min(1, "Rating required"),
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
      shipManagement: {
        navigation: "",
        cargoOperations: "",
        maintenanceRepair: "",
        safetyCompliance: "",
        comments: "",
      },
      technicalSkills: {
        equipmentOperation: "",
        troubleshooting: "",
        preventiveMaintenance: "",
        emergencyResponse: "",
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
    { id: "shipManagement", title: "Part B: Ship Management & Operations" },
    { id: "technicalSkills", title: "Part C: Technical Skills & Knowledge" },
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
                              <FormLabel>Sign On Date</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="dd/mm/yyyy" type="date" className="bg-gray-50" />
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

                {/* Part C: Technical Skills */}
                {activeSection === "technicalSkills" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Part C: Technical Skills & Knowledge</CardTitle>
                      <p className="text-sm text-gray-600">Rate from 1 (Poor) to 5 (Excellent)</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RatingRadioGroup name="technicalSkills.equipmentOperation" label="Equipment Operation" />
                      <RatingRadioGroup name="technicalSkills.troubleshooting" label="Troubleshooting & Problem Solving" />
                      <RatingRadioGroup name="technicalSkills.preventiveMaintenance" label="Preventive Maintenance" />
                      <RatingRadioGroup name="technicalSkills.emergencyResponse" label="Emergency Response" />
                      
                      <FormField
                        control={form.control}
                        name="technicalSkills.comments"
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