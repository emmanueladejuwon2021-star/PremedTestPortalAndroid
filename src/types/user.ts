export type MedicalDepartment =
  | 'Medicine & Surgery (MBBS)'
  | 'Pharmacy (PharmD / B.Pharm)'
  | 'Dentistry (BDS)'
  | 'Physiotherapy (B.Physio)'
  | 'Human Anatomy'
  | 'Medical Physiology'
  | 'Nursing Science'
  | 'Medical Laboratory Science';

export interface StudentProfile {
  id: string;
  matricNo: string;
  fullName: string;
  name?: string;
  email: string;
  department: MedicalDepartment;
  targetExamYear: number;
  streakDays: number;
  createdAt: string;
}
