import { __spreadArray } from 'tslib';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
var ChangeModeContext = createContext(undefined);
export var ChangeModeProvider = function (_a) {
  var children = _a.children;
  var location = useLocation()[0];
  var _b = useState(false),
    isChangeMode = _b[0],
    setIsChangeMode = _b[1];
  var _c = useState(),
    changeRequestTitle = _c[0],
    setChangeRequestTitle = _c[1];
  var _d = useState(),
    changeRequestCategory = _d[0],
    setChangeRequestCategory = _d[1];
  var _e = useState(null),
    originalSnapshot = _e[0],
    setOriginalSnapshot = _e[1];
  var _f = useState([]),
    diffs = _f[0],
    setDiffs = _f[1];
  // Check URL params for change request mode
  useEffect(
    function () {
      var params = new URLSearchParams(window.location.search);
      var editAsChangeRequest = params.get('editAsChangeRequest');
      var crTitle = params.get('crTitle');
      var crCategory = params.get('crCategory');
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
    },
    [location]
  );
  var collectDiff = function (path, oldVal, newVal) {
    // Don't collect if values are the same
    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) {
      // Remove diff if it exists
      setDiffs(function (prev) {
        return prev.filter(function (d) {
          return d.path !== path;
        });
      });
      return;
    }
    setDiffs(function (prev) {
      var existing = prev.findIndex(function (d) {
        return d.path === path;
      });
      if (existing >= 0) {
        var updated = __spreadArray([], prev, true);
        updated[existing] = { path: path, oldVal: oldVal, newVal: newVal };
        return updated;
      }
      return __spreadArray(
        __spreadArray([], prev, true),
        [{ path: path, oldVal: oldVal, newVal: newVal }],
        false
      );
    });
  };
  var getDiffs = function () {
    return diffs;
  };
  var reset = function () {
    setDiffs([]);
    setOriginalSnapshot(null);
  };
  var enterChangeMode = function (title, category) {
    setIsChangeMode(true);
    setChangeRequestTitle(title);
    setChangeRequestCategory(category);
  };
  var exitChangeMode = function () {
    setIsChangeMode(false);
    setChangeRequestTitle(undefined);
    setChangeRequestCategory(undefined);
    reset();
  };
  return (
    <ChangeModeContext.Provider
      value={{
        isChangeMode: isChangeMode,
        changeRequestTitle: changeRequestTitle,
        changeRequestCategory: changeRequestCategory,
        originalSnapshot: originalSnapshot,
        diffs: diffs,
        setOriginalSnapshot: setOriginalSnapshot,
        collectDiff: collectDiff,
        getDiffs: getDiffs,
        reset: reset,
        enterChangeMode: enterChangeMode,
        exitChangeMode: exitChangeMode,
      }}
    >
      {children}
    </ChangeModeContext.Provider>
  );
};
export var useChangeMode = function () {
  var context = useContext(ChangeModeContext);
  if (!context) {
    throw new Error('useChangeMode must be used within ChangeModeProvider');
  }
  return context;
};
// Helper hook for form fields
export var useChangeModeField = function (fieldPath, originalValue) {
  var _a = useChangeMode(),
    isChangeMode = _a.isChangeMode,
    collectDiff = _a.collectDiff;
  var _b = useState(false),
    hasChanged = _b[0],
    setHasChanged = _b[1];
  var handleChange = function (newValue) {
    if (isChangeMode) {
      var changed = JSON.stringify(originalValue) !== JSON.stringify(newValue);
      setHasChanged(changed);
      collectDiff(fieldPath, originalValue, newValue);
    }
  };
  return {
    isChangeMode: isChangeMode,
    hasChanged: hasChanged,
    originalValue: originalValue,
    handleChange: handleChange,
  };
};
//# sourceMappingURL=ChangeModeContext.jsx.map
