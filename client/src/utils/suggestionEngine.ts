// Smart Suggestions Engine for Work Order Form
// Generates context-aware suggestions based on work order details

export interface WorkOrderContext {
  jobTitle?: string;
  component?: string;
  componentCategory?: string;
  maintenanceType?: string;
  frequency?: string;
  performedBy?: string;
  assignedTo?: string;
  teamSize?: string;
  startDateTime?: string;
  completionDateTime?: string;
}

export interface SuggestionTemplate {
  id: string;
  category: string;
  maintenanceType?: string;
  componentCategory?: string;
  keywords?: string[];
  template: string;
  priority: number;
}

// Template Bank - predefined templates with token placeholders
const TEMPLATE_BANK: SuggestionTemplate[] = [
  // Generic / Any
  {
    id: "generic-1",
    category: "generic",
    template: "{{jobTitle}} carried out on {{component}}; function tested and found satisfactory.",
    priority: 5
  },
  {
    id: "generic-2", 
    category: "generic",
    template: "Routine maintenance performed as per PMS; equipment restored to normal.",
    priority: 4
  },
  {
    id: "generic-3",
    category: "generic", 
    template: "Post-work trials completed; performance observed satisfactory.",
    priority: 3
  },
  {
    id: "generic-4",
    category: "generic",
    template: "Work completed on {{component}}; system tested and operational.",
    priority: 4
  },
  
  // Running Hours
  {
    id: "rh-1",
    category: "running_hours",
    maintenanceType: "Running Hours",
    template: "Scheduled RH maintenance completed at {{frequency}} hrs; checks done as per instruction; no abnormalities noted.",
    priority: 8
  },
  {
    id: "rh-2",
    category: "running_hours", 
    maintenanceType: "Running Hours",
    template: "{{frequency}} hour maintenance executed on {{component}}; operational parameters within limits.",
    priority: 7
  },
  
  // Calendar
  {
    id: "cal-1",
    category: "calendar",
    maintenanceType: "Calendar",
    template: "Calendar-based maintenance executed; visual/functional tests satisfactory.",
    priority: 7
  },
  {
    id: "cal-2",
    category: "calendar",
    maintenanceType: "Calendar", 
    template: "Scheduled maintenance carried out as per calendar; {{component}} operating normally.",
    priority: 6
  },
  
  // Safety / Alarms
  {
    id: "alarm-1",
    category: "safety",
    keywords: ["alarm", "safety", "emergency", "warning"],
    template: "Alarm system tested as per checklist; all alarms functional; results satisfactory.",
    priority: 8
  },
  {
    id: "alarm-2",
    category: "safety",
    keywords: ["alarm", "safety", "emergency", "warning"],
    template: "Safety checks performed on {{component}}; all safety devices operational.",
    priority: 7
  },
  
  // Lubrication
  {
    id: "lub-1",
    category: "lubrication",
    keywords: ["lubrication", "grease", "oil", "bearing", "lube"],
    template: "Lubrication/greasing carried out at specified points; parameters within normal limits.",
    priority: 8
  },
  {
    id: "lub-2",
    category: "lubrication",
    keywords: ["lubrication", "grease", "oil", "bearing", "lube"],
    template: "{{component}} lubricated as per schedule; oil levels checked and topped up.",
    priority: 7
  },
  
  // Electrical
  {
    id: "elec-1",
    category: "electrical",
    keywords: ["electrical", "motor", "generator", "panel", "cable", "switch"],
    template: "Electrical checks performed on {{component}}; insulation/continuity within acceptable range.",
    priority: 8
  },
  {
    id: "elec-2",
    category: "electrical",
    keywords: ["electrical", "motor", "generator", "panel", "cable", "switch"],
    template: "Electrical connections inspected; voltage/current readings normal; no loose connections found.",
    priority: 7
  },
  
  // Pumps/Rotating Equipment
  {
    id: "pump-1",
    category: "rotating",
    keywords: ["pump", "compressor", "fan", "blower", "rotating"],
    template: "Operational checks done on {{component}}; vibration/temperature within limits; no leaks observed.",
    priority: 8
  },
  {
    id: "pump-2",
    category: "rotating",
    keywords: ["pump", "compressor", "fan", "blower", "rotating"],
    template: "{{component}} performance tested; flow/pressure parameters satisfactory.",
    priority: 7
  },
  
  // Valves
  {
    id: "valve-1",
    category: "valve",
    keywords: ["valve", "actuator", "control"],
    template: "{{component}} operation tested; opening/closing smooth; no leakage observed.",
    priority: 8
  },
  
  // Filters
  {
    id: "filter-1",
    category: "filter",
    keywords: ["filter", "strainer", "separator"],
    template: "{{component}} inspected/cleaned; differential pressure normal; no blockages found.",
    priority: 8
  }
];

// Token replacement function
function replaceTokens(template: string, context: WorkOrderContext): string {
  let result = template;
  
  // Replace all tokens with context values
  const tokens = {
    '{{component}}': context.component || '',
    '{{componentCategory}}': context.componentCategory || '',
    '{{jobTitle}}': context.jobTitle || '',
    '{{maintenanceType}}': context.maintenanceType || '',
    '{{frequency}}': context.frequency || '',
    '{{performedBy}}': context.performedBy || '',
    '{{assignedTo}}': context.assignedTo || '',
    '{{teamSize}}': context.teamSize || '',
    '{{startDateTime}}': context.startDateTime || '',
    '{{completionDateTime}}': context.completionDateTime || ''
  };
  
  // Replace tokens
  Object.entries(tokens).forEach(([token, value]) => {
    result = result.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
  });
  
  // Clean up empty phrases (graceful degradation)
  // Remove phrases like "at  hrs" when frequency is missing
  result = result.replace(/\s+at\s+hrs/g, '');
  result = result.replace(/\s+on\s+;/g, ';');
  result = result.replace(/;\s*;/g, ';');
  result = result.replace(/\s{2,}/g, ' ');
  result = result.trim();
  
  return result;
}

// Keyword matching scoring
function calculateKeywordScore(template: SuggestionTemplate, context: WorkOrderContext): number {
  let score = 0;
  
  if (!template.keywords) return 0;
  
  const searchText = [
    context.jobTitle,
    context.component,
    context.componentCategory
  ].filter(Boolean).join(' ').toLowerCase();
  
  template.keywords.forEach(keyword => {
    if (searchText.includes(keyword.toLowerCase())) {
      score += 2;
    }
  });
  
  return score;
}

// Main suggestion generation function
export function generateSuggestions(context: WorkOrderContext): string[] {
  const suggestions: { text: string; score: number }[] = [];
  
  // Process each template
  TEMPLATE_BANK.forEach(template => {
    let score = template.priority;
    
    // Boost score for maintenance type match
    if (template.maintenanceType && context.maintenanceType === template.maintenanceType) {
      score += 10;
    }
    
    // Boost score for keyword matches
    score += calculateKeywordScore(template, context);
    
    // Only include if score is meaningful
    if (score > 2) {
      const processedText = replaceTokens(template.template, context);
      
      // Only add if text is meaningful (not mostly empty after token replacement)
      if (processedText.length > 20) {
        suggestions.push({
          text: processedText,
          score: score
        });
      }
    }
  });
  
  // Sort by score (highest first) and return top 5
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.text);
}

// Extract context from work order form data
export function extractContextFromWorkOrder(workOrder: any, executionData: any): WorkOrderContext {
  return {
    jobTitle: workOrder?.job_title || workOrder?.jobTitle,
    component: workOrder?.component_name || workOrder?.componentName,
    componentCategory: workOrder?.component_category || workOrder?.componentCategory,
    maintenanceType: workOrder?.maintenance_basis || workOrder?.maintenanceBasis,
    frequency: workOrder?.frequency_value?.toString() || workOrder?.frequencyValue?.toString(),
    performedBy: executionData?.performedBy,
    assignedTo: executionData?.assignedTo,
    teamSize: executionData?.noOfPersons,
    startDateTime: executionData?.startDateTime,
    completionDateTime: executionData?.completionDateTime
  };
}