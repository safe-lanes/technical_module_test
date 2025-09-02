import { z } from "zod";
// Predefined form templates
export var formTemplates = {
    'Crew Promotion Form': {
        name: 'Crew Promotion Form',
        sections: [
            {
                id: 'A',
                title: 'Candidate Information',
                description: 'Enter details of the promotion candidate',
                fields: [
                    {
                        id: 'candidateName',
                        type: 'text',
                        label: 'Candidate Name',
                        placeholder: 'Enter full name',
                        required: true,
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'currentRank',
                        type: 'select',
                        label: 'Current Rank',
                        required: true,
                        options: ['Third Officer', 'Second Officer', 'Chief Officer', 'Third Engineer', 'Second Engineer', 'Chief Engineer'],
                        configurable: true,
                        visible: true
                    },
                    {
                        id: 'proposedRank',
                        type: 'select',
                        label: 'Proposed Rank',
                        required: true,
                        options: ['Second Officer', 'Chief Officer', 'Master', 'Second Engineer', 'Chief Engineer'],
                        configurable: true,
                        visible: true
                    },
                    {
                        id: 'vessel',
                        type: 'select',
                        label: 'Current Vessel',
                        required: true,
                        options: ['MT Sail One', 'MT Sail Two', 'MT Sail Three', 'MV Sail Seven'],
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'joinDate',
                        type: 'date',
                        label: 'Date Joined Current Rank',
                        required: true,
                        configurable: false,
                        visible: true
                    }
                ]
            },
            {
                id: 'B',
                title: 'Qualification Assessment',
                description: 'Evaluate candidate qualifications and experience',
                fields: [
                    {
                        id: 'qualifications',
                        type: 'table',
                        label: 'Qualifications & Certificates',
                        required: true,
                        configurable: true,
                        visible: true
                    },
                    {
                        id: 'experience',
                        type: 'textarea',
                        label: 'Relevant Experience',
                        placeholder: 'Describe relevant experience...',
                        required: true,
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'performanceRating',
                        type: 'select',
                        label: 'Overall Performance Rating',
                        required: true,
                        options: ['5- Excellent', '4- Very Good', '3- Good', '2- Satisfactory', '1- Needs Improvement'],
                        configurable: true,
                        visible: true
                    }
                ]
            },
            {
                id: 'C',
                title: 'Recommendation & Approval',
                description: 'Final recommendation and approval details',
                fields: [
                    {
                        id: 'recommendation',
                        type: 'radio',
                        label: 'Promotion Recommendation',
                        required: true,
                        options: ['Strongly Recommended', 'Recommended', 'Not Recommended'],
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'comments',
                        type: 'textarea',
                        label: 'Additional Comments',
                        placeholder: 'Add any additional comments...',
                        required: false,
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'approverName',
                        type: 'text',
                        label: 'Approver Name',
                        required: true,
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'approvalDate',
                        type: 'date',
                        label: 'Approval Date',
                        required: true,
                        configurable: false,
                        visible: true
                    }
                ]
            }
        ],
        schema: z.object({
            candidateName: z.string().min(1, "Candidate name is required"),
            currentRank: z.string().min(1, "Current rank is required"),
            proposedRank: z.string().min(1, "Proposed rank is required"),
            vessel: z.string().min(1, "Vessel is required"),
            joinDate: z.string().min(1, "Join date is required"),
            qualifications: z.array(z.object({
                id: z.string(),
                qualification: z.string(),
                issueDate: z.string(),
                expiryDate: z.string(),
                status: z.string()
            })).default([]),
            experience: z.string().min(1, "Experience is required"),
            performanceRating: z.string().min(1, "Performance rating is required"),
            recommendation: z.string().min(1, "Recommendation is required"),
            comments: z.string().optional(),
            approverName: z.string().min(1, "Approver name is required"),
            approvalDate: z.string().min(1, "Approval date is required")
        })
    },
    'Crew Training Form': {
        name: 'Crew Training Form',
        sections: [
            {
                id: 'A',
                title: 'Training Details',
                description: 'Enter training course information',
                fields: [
                    {
                        id: 'trainingName',
                        type: 'text',
                        label: 'Training Course Name',
                        required: true,
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'trainingProvider',
                        type: 'text',
                        label: 'Training Provider',
                        required: true,
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'trainingType',
                        type: 'select',
                        label: 'Training Type',
                        required: true,
                        options: ['STCW', 'Company Specific', 'Technical', 'Safety', 'Management'],
                        configurable: true,
                        visible: true
                    },
                    {
                        id: 'startDate',
                        type: 'date',
                        label: 'Start Date',
                        required: true,
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'endDate',
                        type: 'date',
                        label: 'End Date',
                        required: true,
                        configurable: false,
                        visible: true
                    }
                ]
            },
            {
                id: 'B',
                title: 'Participant Information',
                description: 'Details of training participants',
                fields: [
                    {
                        id: 'participants',
                        type: 'table',
                        label: 'Training Participants',
                        required: true,
                        configurable: true,
                        visible: true
                    }
                ]
            },
            {
                id: 'C',
                title: 'Training Results',
                description: 'Training outcomes and certification',
                fields: [
                    {
                        id: 'completionStatus',
                        type: 'select',
                        label: 'Completion Status',
                        required: true,
                        options: ['Completed', 'In Progress', 'Failed', 'Cancelled'],
                        configurable: true,
                        visible: true
                    },
                    {
                        id: 'certificateIssued',
                        type: 'checkbox',
                        label: 'Certificate Issued',
                        required: false,
                        configurable: false,
                        visible: true
                    },
                    {
                        id: 'remarks',
                        type: 'textarea',
                        label: 'Training Remarks',
                        placeholder: 'Add training remarks...',
                        required: false,
                        configurable: false,
                        visible: true
                    }
                ]
            }
        ],
        schema: z.object({
            trainingName: z.string().min(1, "Training name is required"),
            trainingProvider: z.string().min(1, "Training provider is required"),
            trainingType: z.string().min(1, "Training type is required"),
            startDate: z.string().min(1, "Start date is required"),
            endDate: z.string().min(1, "End date is required"),
            participants: z.array(z.object({
                id: z.string(),
                name: z.string(),
                rank: z.string(),
                result: z.string()
            })).default([]),
            completionStatus: z.string().min(1, "Completion status is required"),
            certificateIssued: z.boolean().default(false),
            remarks: z.string().optional()
        })
    }
};
// Function to generate form editor component
export var generateFormEditor = function (formName) {
    var template = formTemplates[formName];
    if (!template) {
        throw new Error("Form template not found for: ".concat(formName));
    }
    return "\nimport React, { useState } from \"react\";\nimport { useForm } from \"react-hook-form\";\nimport { zodResolver } from \"@hookform/resolvers/zod\";\nimport { z } from \"zod\";\nimport { Button } from \"@/components/ui/button\";\nimport { Card, CardContent } from \"@/components/ui/card\";\nimport { Input } from \"@/components/ui/input\";\nimport { Label } from \"@/components/ui/label\";\nimport { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from \"@/components/ui/select\";\nimport { Textarea } from \"@/components/ui/textarea\";\nimport { Checkbox } from \"@/components/ui/checkbox\";\nimport { ArrowLeft, Save, Settings } from \"lucide-react\";\nimport { Form } from \"@shared/schema\";\nimport { sailDesignSystem } from \"@/config/sailDesignSystem\";\n\nconst ".concat(formName.replace(/\s+/g, ''), "Schema = ").concat(JSON.stringify(template.schema, null, 2), ";\n\ntype ").concat(formName.replace(/\s+/g, ''), "Data = z.infer<typeof ").concat(formName.replace(/\s+/g, ''), "Schema>;\n\ninterface ").concat(formName.replace(/\s+/g, ''), "EditorProps {\n  form: Form;\n  rankGroupName?: string;\n  onClose: () => void;\n  onSave: (data: any) => void;\n}\n\nexport const ").concat(formName.replace(/\s+/g, ''), "Editor: React.FC<").concat(formName.replace(/\s+/g, ''), "EditorProps> = ({ \n  form, \n  rankGroupName, \n  onClose, \n  onSave \n}) => {\n  const [activeSection, setActiveSection] = useState(\"A\");\n  const [isConfigMode, setIsConfigMode] = useState(false);\n\n  const formMethods = useForm<").concat(formName.replace(/\s+/g, ''), "Data>({\n    resolver: zodResolver(").concat(formName.replace(/\s+/g, ''), "Schema),\n    defaultValues: {\n      // Add default values based on template fields\n    },\n  });\n\n  const onSubmit = (data: ").concat(formName.replace(/\s+/g, ''), "Data) => {\n    onSave({\n      ...data,\n      formId: form.id,\n    });\n    onClose();\n  };\n\n  const sections = ").concat(JSON.stringify(template.sections.map(function (section) { return ({
        id: section.id,
        title: section.title,
        active: false
    }); }), null, 2), ";\n\n  const renderSection = (sectionId: string) => {\n    const section = ").concat(JSON.stringify(template.sections, null, 2), ".find(s => s.id === sectionId);\n    if (!section) return null;\n\n    return (\n      <div className=\"space-y-6\">\n        <div className=\"pb-4 mb-6\">\n          <h3 className=\"text-xl font-semibold mb-2\" style={{ color: sailDesignSystem.colors.primary }}>\n            Part {section.id}: {section.title}\n          </h3>\n          {section.description && (\n            <div style={{ color: sailDesignSystem.colors.primary }} className=\"text-sm\">\n              {section.description}\n            </div>\n          )}\n          <div className=\"w-full h-0.5 mt-2\" style={{ backgroundColor: sailDesignSystem.colors.primary }}></div>\n        </div>\n        \n        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">\n          {section.fields.map((field) => (\n            <div key={field.id} className=\"space-y-2\">\n              <Label htmlFor={field.id} className=\"text-sm\">{field.label}</Label>\n              {field.type === 'text' && (\n                <Input\n                  id={field.id}\n                  placeholder={field.placeholder}\n                  {...formMethods.register(field.id)}\n                  className=\"text-sm\"\n                />\n              )}\n              {field.type === 'select' && (\n                <Select\n                  value={formMethods.watch(field.id) || \"\"}\n                  onValueChange={(value) => formMethods.setValue(field.id, value)}\n                >\n                  <SelectTrigger className=\"text-sm\">\n                    <SelectValue placeholder=\"Select option\" />\n                  </SelectTrigger>\n                  <SelectContent>\n                    {field.options?.map((option, index) => (\n                      <SelectItem key={index} value={option.toLowerCase().replace(/s+/g, '-')}>\n                        {option}\n                      </SelectItem>\n                    ))}\n                  </SelectContent>\n                </Select>\n              )}\n              {field.type === 'textarea' && (\n                <Textarea\n                  id={field.id}\n                  placeholder={field.placeholder}\n                  {...formMethods.register(field.id)}\n                  rows={3}\n                />\n              )}\n              {field.type === 'date' && (\n                <Input\n                  id={field.id}\n                  type=\"date\"\n                  {...formMethods.register(field.id)}\n                  className=\"text-sm\"\n                />\n              )}\n              {field.type === 'checkbox' && (\n                <div className=\"flex items-center space-x-2\">\n                  <Checkbox\n                    id={field.id}\n                    checked={formMethods.watch(field.id) || false}\n                    onCheckedChange={(checked) => formMethods.setValue(field.id, checked)}\n                  />\n                  <Label htmlFor={field.id}>{field.label}</Label>\n                </div>\n              )}\n            </div>\n          ))}\n        </div>\n      </div>\n    );\n  };\n\n  return (\n    <div className=\"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4\">\n      <div className=\"bg-white rounded-lg shadow-lg w-full max-w-[95vw] h-[calc(100vh-2rem)] flex flex-col\">\n        {/* Header */}\n        <div className=\"flex items-center justify-between p-4 border-b\">\n          <div className=\"flex items-center gap-3\">\n            <Button variant=\"ghost\" size=\"icon\" onClick={onClose} className=\"h-8 w-8\">\n              <ArrowLeft className=\"h-4 w-4\" />\n            </Button>\n            <h2 className=\"text-lg font-semibold\">").concat(formName, " - {rankGroupName || \"Rank Group\"}</h2>\n          </div>\n          <div className=\"flex items-center gap-2\">\n            <Button\n              variant={isConfigMode ? \"default\" : \"outline\"}\n              onClick={() => setIsConfigMode(!isConfigMode)}\n              className=\"flex items-center gap-2\"\n              size=\"sm\"\n            >\n              <Settings className=\"h-4 w-4\" />\n              {isConfigMode ? \"Exit Config\" : \"Configure Fields\"}\n            </Button>\n            <Button \n              onClick={formMethods.handleSubmit(onSubmit)}\n              className=\"flex items-center gap-2\"\n              size=\"sm\"\n            >\n              <Save className=\"h-4 w-4\" />\n              Save Draft\n            </Button>\n          </div>\n        </div>\n\n        <div className=\"flex flex-1 overflow-hidden\">\n          {/* Left Sidebar */}\n          <div className=\"w-72 overflow-y-auto bg-gray-50 border-r\">\n            <div className=\"p-6\">\n              <nav className=\"space-y-1\">\n                {sections.map((section, index) => {\n                  const isActive = activeSection === section.id;\n                  \n                  return (\n                    <div key={section.id} className=\"relative\">\n                      <button\n                        onClick={() => setActiveSection(section.id)}\n                        className={`w-full flex items-center p-3 rounded-lg text-left transition-colors hover:bg-gray-50 ${\n                          isActive ? \"bg-blue-50\" : \"\"\n                        }`}\n                      >\n                        <div \n                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-4 ${\n                            isActive ? \"bg-blue-600\" : \"bg-gray-400\"\n                          }`}\n                        >\n                          {section.id}\n                        </div>\n                        <div className=\"flex-1\">\n                          <div className={`font-medium text-sm ${isActive ? \"text-blue-700\" : \"text-gray-700\"}`}>\n                            {section.title}\n                          </div>\n                        </div>\n                      </button>\n                      {index < sections.length - 1 && (\n                        <div className=\"absolute left-8 top-16 w-0.5 h-4 bg-gray-300\"></div>\n                      )}\n                    </div>\n                  );\n                })}\n              </nav>\n            </div>\n          </div>\n\n          {/* Main Content */}\n          <div className=\"flex-1 overflow-y-auto bg-gray-50\">\n            <div className=\"p-6\">\n              <Card className=\"bg-white\">\n                <CardContent className=\"p-6\">\n                  {renderSection(activeSection)}\n                </CardContent>\n              </Card>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n};\n");
};
// Function to create form editor command
export var createFormEditor = function (formName) {
    if (!formTemplates[formName]) {
        console.error("Form template not found for: ".concat(formName));
        return;
    }
    console.log("Creating Form Editor for: ".concat(formName));
    // Generate the form editor component code
    var editorCode = generateFormEditor(formName);
    // You can save this to a file or use it programmatically
    console.log("Generated Form Editor Component:", editorCode);
};
//# sourceMappingURL=formEditorGenerator.js.map