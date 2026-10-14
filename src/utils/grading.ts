export const calculateGrade = (
  score: number,
  total: number
): {
  percentage: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  remark: string;
  badgeColor: string;
} => {
  if (total === 0) {
    return { percentage: 0, grade: 'F', remark: 'No Assessment Data', badgeColor: '#EF4444' };
  }

  const percentage = Math.round((score / total) * 100);

  if (percentage >= 70) {
    return {
      percentage,
      grade: 'A',
      remark: 'Distinction — Outstanding Clinical & Theoretical Mastery',
      badgeColor: '#10B981',
    };
  } else if (percentage >= 60) {
    return {
      percentage,
      grade: 'B',
      remark: 'Credit — Strong Conceptual Readiness for Board Examinations',
      badgeColor: '#2563EB',
    };
  } else if (percentage >= 50) {
    return {
      percentage,
      grade: 'C',
      remark: 'Pass — Satisfactory Competence, Targeted Revision Recommended',
      badgeColor: '#F59E0B',
    };
  } else if (percentage >= 45) {
    return {
      percentage,
      grade: 'D',
      remark: 'Borderline — Core Topics Require Intensive Reinforcement',
      badgeColor: '#EA580C',
    };
  } else {
    return {
      percentage,
      grade: 'F',
      remark: 'Below Cut-off — Repeat Module Diagnostic & Comprehensive Review Required',
      badgeColor: '#EF4444',
    };
  }
};

export const getGradeBadgeColor = (grade: string): string => {
  switch (grade) {
    case 'A': return '#10B981';
    case 'B': return '#2563EB';
    case 'C': return '#F59E0B';
    case 'D': return '#EA580C';
    default: return '#EF4444';
  }
};
