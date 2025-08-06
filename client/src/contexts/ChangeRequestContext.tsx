import React, { createContext, useContext, useState } from "react";
// User roles and interfaces
export type UserRole = "requestor" | "approver";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  title?: string;
}

export interface FormModeContext {
  isChangeRequestMode: boolean;
  originalData?: Record<string, any>;
  changedFields: Record<string, any>;
  onFieldChange?: (fieldName: string, value: any) => void;
}

interface ChangeRequestContextType extends FormModeContext {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  enterChangeRequestMode: (category: string, originalData: Record<string, any>) => void;
  exitChangeRequestMode: () => void;
  updateChangedField: (fieldName: string, value: any) => void;
  resetChangedFields: () => void;
}

const ChangeRequestContext = createContext<ChangeRequestContextType | undefined>(undefined);

// Simulate current users for testing - in production this would come from auth system
const simulatedUsers: User[] = [
  { id: "1", name: "Chief Engineer", role: "approver", title: "Chief Engineer" },
  { id: "2", name: "2nd Engineer", role: "requestor", title: "2nd Engineer" },
  { id: "3", name: "Technical Superintendent", role: "approver", title: "Technical Superintendent" },
];

export const ChangeRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChangeRequestMode, setIsChangeRequestMode] = useState(false);
  const [originalData, setOriginalData] = useState<Record<string, any> | undefined>();
  const [changedFields, setChangedFields] = useState<Record<string, any>>({});
  const [currentUser, setCurrentUser] = useState<User>(simulatedUsers[1]); // Default to 2nd Engineer

  const enterChangeRequestMode = (category: string, originalData: Record<string, any>) => {
    setIsChangeRequestMode(true);
    setOriginalData(originalData);
    setChangedFields({});
  };

  const exitChangeRequestMode = () => {
    setIsChangeRequestMode(false);
    setOriginalData(undefined);
    setChangedFields({});
  };

  const updateChangedField = (fieldName: string, value: any) => {
    setChangedFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const resetChangedFields = () => {
    setChangedFields({});
  };

  return (
    <ChangeRequestContext.Provider value={{
      isChangeRequestMode,
      originalData,
      changedFields,
      currentUser,
      setCurrentUser,
      enterChangeRequestMode,
      exitChangeRequestMode,
      updateChangedField,
      resetChangedFields,
      onFieldChange: updateChangedField
    }}>
      {children}
    </ChangeRequestContext.Provider>
  );
};

export const useChangeRequest = () => {
  const context = useContext(ChangeRequestContext);
  if (context === undefined) {
    throw new Error('useChangeRequest must be used within a ChangeRequestProvider');
  }
  return context;
};