import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

interface Diff {
  path: string;
  oldVal: any;
  newVal: any;
}

interface ChangeModeContextType {
  isChangeMode: boolean;
  changeRequestTitle?: string;
  changeRequestCategory?: string;
  originalSnapshot: any;
  diffs: Diff[];
  setOriginalSnapshot: (snapshot: any) => void;
  collectDiff: (path: string, oldVal: any, newVal: any) => void;
  getDiffs: () => Diff[];
  reset: () => void;
  enterChangeMode: (title?: string, category?: string) => void;
  exitChangeMode: () => void;
}

const ChangeModeContext = createContext<ChangeModeContextType | undefined>(undefined);

export const ChangeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  const [isChangeMode, setIsChangeMode] = useState(false);
  const [changeRequestTitle, setChangeRequestTitle] = useState<string>();
  const [changeRequestCategory, setChangeRequestCategory] = useState<string>();
  const [originalSnapshot, setOriginalSnapshot] = useState<any>(null);
  const [diffs, setDiffs] = useState<Diff[]>([]);

  // Check URL params for change request mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editAsChangeRequest = params.get('editAsChangeRequest');
    const crTitle = params.get('crTitle');
    const crCategory = params.get('crCategory');
    
    if (editAsChangeRequest === '1') {
      setIsChangeMode(true);
      setChangeRequestTitle(crTitle || undefined);
      setChangeRequestCategory(crCategory || undefined);
    } else {
      setIsChangeMode(false);
      setChangeRequestTitle(undefined);
      setChangeRequestCategory(undefined);
      setDiffs([]);
    }
  }, [location]);

  const collectDiff = (path: string, oldVal: any, newVal: any) => {
    // Don't collect if values are the same
    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) {
      // Remove diff if it exists
      setDiffs(prev => prev.filter(d => d.path !== path));
      return;
    }

    setDiffs(prev => {
      const existing = prev.findIndex(d => d.path === path);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { path, oldVal, newVal };
        return updated;
      }
      return [...prev, { path, oldVal, newVal }];
    });
  };

  const getDiffs = () => diffs;

  const reset = () => {
    setDiffs([]);
    setOriginalSnapshot(null);
  };

  const enterChangeMode = (title?: string, category?: string) => {
    setIsChangeMode(true);
    setChangeRequestTitle(title);
    setChangeRequestCategory(category);
  };

  const exitChangeMode = () => {
    setIsChangeMode(false);
    setChangeRequestTitle(undefined);
    setChangeRequestCategory(undefined);
    reset();
  };

  return (
    <ChangeModeContext.Provider value={{
      isChangeMode,
      changeRequestTitle,
      changeRequestCategory,
      originalSnapshot,
      diffs,
      setOriginalSnapshot,
      collectDiff,
      getDiffs,
      reset,
      enterChangeMode,
      exitChangeMode
    }}>
      {children}
    </ChangeModeContext.Provider>
  );
};

export const useChangeMode = () => {
  const context = useContext(ChangeModeContext);
  if (!context) {
    throw new Error('useChangeMode must be used within ChangeModeProvider');
  }
  return context;
};

// Helper hook for form fields
export const useChangeModeField = (fieldPath: string, originalValue: any) => {
  const { isChangeMode, collectDiff } = useChangeMode();
  const [hasChanged, setHasChanged] = useState(false);

  const handleChange = (newValue: any) => {
    if (isChangeMode) {
      const changed = JSON.stringify(originalValue) !== JSON.stringify(newValue);
      setHasChanged(changed);
      collectDiff(fieldPath, originalValue, newValue);
    }
  };

  return {
    isChangeMode,
    hasChanged,
    originalValue,
    handleChange
  };
};