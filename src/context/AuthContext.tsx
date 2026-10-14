import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, MedicalDepartment } from '../types/user';
import { StorageService } from '../services/storageService';

interface AuthContextType {
  student: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (matricNo: string, fullName: string, department: MedicalDepartment) => Promise<void>;
  logout: () => Promise<void>;
  updateDepartment: (dept: MedicalDepartment) => Promise<void>;
  updateProfile: (updates: Partial<StudentProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  student: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  updateDepartment: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedStudent();
  }, []);

  const loadSavedStudent = async () => {
    try {
      const saved = await StorageService.getProfile();
      if (saved) {
        setStudent({ ...saved, name: saved.fullName });
      } else {
        // Default demo profile for instant out-of-the-box readiness
        const defaultProfile: StudentProfile = {
          id: 'std_demo_01',
          matricNo: 'MED/2026/0419',
          fullName: 'Adejuwon Emmanuel',
          name: 'Adejuwon Emmanuel',
          email: 'emmanuel.adejuwon@med.unilag.edu.ng',
          department: 'Medicine & Surgery (MBBS)',
          targetExamYear: 2027,
          streakDays: 14,
          createdAt: new Date().toISOString(),
        };
        await StorageService.saveProfile(defaultProfile);
        setStudent(defaultProfile);
      }
    } catch (error) {
      console.warn('Failed to load saved profile, using fallback:', error);
      const fallbackProfile: StudentProfile = {
        id: 'std_demo_fallback',
        matricNo: 'MED/2026/0419',
        fullName: 'Adejuwon Emmanuel',
        name: 'Adejuwon Emmanuel',
        email: 'emmanuel.adejuwon@med.unilag.edu.ng',
        department: 'Medicine & Surgery (MBBS)',
        targetExamYear: 2027,
        streakDays: 14,
        createdAt: new Date().toISOString(),
      };
      setStudent(fallbackProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (matricNo: string, fullName: string, department: MedicalDepartment) => {
    const newProfile: StudentProfile = {
      id: `std_${Date.now()}`,
      matricNo: matricNo.trim().toUpperCase(),
      fullName: fullName.trim(),
      name: fullName.trim(),
      email: `${matricNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@student.premed.edu`,
      department,
      targetExamYear: 2027,
      streakDays: 1,
      createdAt: new Date().toISOString(),
    };
    await StorageService.saveProfile(newProfile);
    setStudent(newProfile);
  };

  const logout = async () => {
    await StorageService.clearProfile();
    setStudent(null);
  };

  const updateDepartment = async (dept: MedicalDepartment) => {
    if (!student) return;
    const updated = { ...student, department: dept };
    await StorageService.saveProfile(updated);
    setStudent(updated);
  };

  const updateProfile = async (updates: Partial<StudentProfile>) => {
    if (!student) return;
    const updated = { ...student, ...updates };
    if (updated.fullName) updated.name = updated.fullName;
    await StorageService.saveProfile(updated);
    setStudent(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        isAuthenticated: !!student,
        isLoading,
        login,
        logout,
        updateDepartment,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
