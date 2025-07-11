
import { sailDesignSystem } from "@/config/sailDesignSystem";

export interface RatingConfig {
  value: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const effectivenessRatings: RatingConfig[] = [
  {
    value: "5-exceeds-expectations",
    label: "5- Exceeds Expectations", 
    color: "success",
    bgColor: "bg-[#c3f2cb]",
    textColor: "text-[#286e34]"
  },
  {
    value: "4-meets-expectations", 
    label: "4- Meets Expectations",
    color: "good",
    bgColor: "bg-[#c3f2cb]",
    textColor: "text-[#286e34]"
  },
  {
    value: "3-somewhat-meets-expectations",
    label: "3- Somewhat Meets Expectations",
    color: "warning", 
    bgColor: "bg-[#ffeaa7]",
    textColor: "text-[#814c02]"
  },
  {
    value: "2-below-expectations",
    label: "2- Below Expectations",
    color: "poor",
    bgColor: "bg-[#f9ecef]", 
    textColor: "text-[#811f1a]"
  },
  {
    value: "1-significantly-below-expectations",
    label: "1- Significantly Below Expectations",
    color: "critical",
    bgColor: "bg-red-600",
    textColor: "text-white"
  }
];

export const targetRatings: RatingConfig[] = [
  {
    value: "5-exceeded-set-target",
    label: "5- Exceeded Set Target",
    color: "success",
    bgColor: "bg-[#c3f2cb]",
    textColor: "text-[#286e34]"
  },
  {
    value: "4-fully-met-target", 
    label: "4- Fully Met Target",
    color: "good",
    bgColor: "bg-[#c3f2cb]",
    textColor: "text-[#286e34]"
  },
  {
    value: "3-missed-target-small-margin",
    label: "3- Missed Target by a Small Margin",
    color: "warning",
    bgColor: "bg-[#ffeaa7]", 
    textColor: "text-[#814c02]"
  },
  {
    value: "2-missed-target-significant-margin",
    label: "2- Missed Target by a Significant Margin", 
    color: "poor",
    bgColor: "bg-[#f9ecef]",
    textColor: "text-[#811f1a]"
  },
  {
    value: "1-failed-to-achieve-target",
    label: "1- Failed to Achieve Target",
    color: "critical", 
    bgColor: "bg-red-600",
    textColor: "text-white"
  }
];

export const trainingRatings: RatingConfig[] = [
  {
    value: "5-exceeded-expectations",
    label: "5- Exceeded Expectations",
    color: "success",
    bgColor: "bg-[#c3f2cb]",
    textColor: "text-[#286e34]"
  },
  {
    value: "4-meets-expectations",
    label: "4- Meets Expectations", 
    color: "good",
    bgColor: "bg-[#c3f2cb]",
    textColor: "text-[#286e34]"
  },
  {
    value: "3-somewhat-meets-expectations",
    label: "3- Somewhat Meets Expectations",
    color: "warning",
    bgColor: "bg-[#ffeaa7]",
    textColor: "text-[#814c02]"
  },
  {
    value: "2-below-expectations", 
    label: "2- Below Expectations",
    color: "poor",
    bgColor: "bg-[#f9ecef]",
    textColor: "text-[#811f1a]"
  },
  {
    value: "1-significantly-below-expectations",
    label: "1- Significantly Below Expectations",
    color: "critical",
    bgColor: "bg-red-600", 
    textColor: "text-white"
  }
];

// Helper function to get score colors based on numeric rating
export const getScoreColors = (score: number) => {
  if (score >= 4.0) {
    return { bgColor: 'bg-[#c3f2cb]', textColor: 'text-[#286e34]' };
  } else if (score >= 3.0) {
    return { bgColor: 'bg-[#ffeaa7]', textColor: 'text-[#814c02]' };
  } else if (score >= 2.0) {
    return { bgColor: 'bg-[#f9ecef]', textColor: 'text-[#811f1a]' };
  } else {
    return { bgColor: 'bg-red-600', textColor: 'text-white' };
  }
};

// Helper function to convert rating string to numeric value
export const getRatingValue = (ratingString: string): number => {
  if (ratingString.startsWith("5-")) return 5;
  if (ratingString.startsWith("4-")) return 4;
  if (ratingString.startsWith("3-")) return 3;
  if (ratingString.startsWith("2-")) return 2;
  if (ratingString.startsWith("1-")) return 1;
  return 0;
};

// Helper function to calculate weighted scores
export const calculateWeightedScore = (assessments: Array<{
  effectiveness: string;
  weight: number;
}>): string => {
  let totalScore = 0;
  let totalWeight = 0;
  
  assessments.forEach(assessment => {
    if (assessment.effectiveness && assessment.weight) {
      const rating = getRatingValue(assessment.effectiveness);
      totalScore += (rating * assessment.weight) / 100;
      totalWeight += assessment.weight;
    }
  });
  
  return totalWeight > 0 ? (totalScore * 100 / totalWeight).toFixed(1) : "0.0";
};

// Status colors for training followup
export const getStatusColors = (status: string) => {
  switch (status) {
    case "Proposed":
      return "bg-gray-200";
    case "Approved": 
      return "bg-blue-200";
    case "Planned":
      return "bg-yellow-200";
    case "Declined":
      return "bg-red-200"; 
    case "Completed":
      return "bg-green-200";
    default:
      return "bg-gray-200";
  }
};
