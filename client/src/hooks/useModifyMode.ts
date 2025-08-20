import { useState, useCallback, useEffect } from 'react';
import { isEqual, cloneDeep } from 'lodash';

interface FieldChange {
  key: string;
  from: any;
  to: any;
}

interface RowChange {
  section: string;
  row?: any;
  rowId?: string;
  fields?: FieldChange[];
}

interface ModifyModeDiff {
  fields: FieldChange[];
  rows: {
    added: RowChange[];
    deleted: RowChange[];
    changed: RowChange[];
  };
}

export function useModifyMode(initialData: any) {
  const [originalData] = useState(() => cloneDeep(initialData));
  const [currentData, setCurrentData] = useState(() => cloneDeep(initialData));
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
  const [addedRows, setAddedRows] = useState<Set<string>>(new Set());
  const [deletedRows, setDeletedRows] = useState<Set<string>>(new Set());

  // Check if a field is edited
  const isEdited = useCallback((fieldKey: string) => {
    return editedFields.has(fieldKey);
  }, [editedFields]);

  // Update field value and track changes
  const updateField = useCallback((fieldKey: string, value: any) => {
    const keys = fieldKey.split('.');
    const newData = cloneDeep(currentData);
    
    // Navigate to the nested field
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setCurrentData(newData);
    
    // Get original value
    let originalValue = originalData;
    for (const key of keys) {
      originalValue = originalValue?.[key];
    }
    
    // Check if value differs from original
    if (!isEqual(value, originalValue)) {
      setEditedFields(prev => new Set(prev).add(fieldKey));
    } else {
      setEditedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldKey);
        return newSet;
      });
    }
  }, [currentData, originalData]);

  // Mark row as added
  const markRowAdded = useCallback((rowId: string) => {
    setAddedRows(prev => new Set(prev).add(rowId));
  }, []);

  // Mark row as deleted
  const markRowDeleted = useCallback((rowId: string) => {
    setDeletedRows(prev => new Set(prev).add(rowId));
  }, []);

  // Undo row deletion
  const undoRowDeletion = useCallback((rowId: string) => {
    setDeletedRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(rowId);
      return newSet;
    });
  }, []);

  // Get the diff between original and current data
  const getDiff = useCallback((): ModifyModeDiff => {
    const fields: FieldChange[] = [];
    const rows = {
      added: [] as RowChange[],
      deleted: [] as RowChange[],
      changed: [] as RowChange[]
    };

    // Collect field changes
    editedFields.forEach(fieldKey => {
      const keys = fieldKey.split('.');
      
      let originalValue = originalData;
      let currentValue = currentData;
      
      for (const key of keys) {
        originalValue = originalValue?.[key];
        currentValue = currentValue?.[key];
      }
      
      fields.push({
        key: fieldKey,
        from: originalValue,
        to: currentValue
      });
    });

    // Collect row changes
    addedRows.forEach(rowId => {
      const [section, ...idParts] = rowId.split('.');
      rows.added.push({
        section,
        rowId: idParts.join('.')
      });
    });

    deletedRows.forEach(rowId => {
      const [section, ...idParts] = rowId.split('.');
      rows.deleted.push({
        section,
        rowId: idParts.join('.')
      });
    });

    return { fields, rows };
  }, [editedFields, addedRows, deletedRows, originalData, currentData]);

  // Check if there are any changes
  const hasChanges = useCallback(() => {
    return editedFields.size > 0 || addedRows.size > 0 || deletedRows.size > 0;
  }, [editedFields, addedRows, deletedRows]);

  // Reset all changes
  const resetChanges = useCallback(() => {
    setCurrentData(cloneDeep(originalData));
    setEditedFields(new Set());
    setAddedRows(new Set());
    setDeletedRows(new Set());
  }, [originalData]);

  return {
    originalData,
    currentData,
    isEdited,
    updateField,
    markRowAdded,
    markRowDeleted,
    undoRowDeletion,
    getDiff,
    hasChanges,
    resetChanges,
    editedFields,
    addedRows,
    deletedRows
  };
}