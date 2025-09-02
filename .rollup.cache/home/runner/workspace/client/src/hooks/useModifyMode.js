import { __assign, __rest } from "tslib";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
export function useModifyMode() {
    var _a = useLocation(), location = _a[0], setLocation = _a[1];
    var search = useSearch();
    var searchParams = new URLSearchParams(search);
    var _b = useState({
        isModifyMode: searchParams.get("modify") === "1",
        targetType: searchParams.get("targetType"),
        targetId: searchParams.get("targetId"),
        fieldChanges: {},
        originalSnapshot: {}
    }), state = _b[0], setState = _b[1];
    // Update state when URL changes
    useEffect(function () {
        var newSearchParams = new URLSearchParams(search);
        setState(function (prev) { return (__assign(__assign({}, prev), { isModifyMode: newSearchParams.get("modify") === "1", targetType: newSearchParams.get("targetType"), targetId: newSearchParams.get("targetId") })); });
    }, [search]);
    // Enable modify mode for a specific target
    var enableModifyMode = useCallback(function (targetType, targetId) {
        var newParams = new URLSearchParams(search);
        newParams.set("modify", "1");
        newParams.set("targetType", targetType);
        if (targetId) {
            newParams.set("targetId", targetId);
        }
        setLocation("".concat(location.split('?')[0], "?").concat(newParams.toString()));
    }, [location, search, setLocation]);
    // Disable modify mode
    var disableModifyMode = useCallback(function () {
        var newParams = new URLSearchParams(search);
        newParams.delete("modify");
        newParams.delete("targetType");
        newParams.delete("targetId");
        var newSearch = newParams.toString();
        setLocation("".concat(location.split('?')[0]).concat(newSearch ? "?".concat(newSearch) : ''));
        // Clear field changes
        setState(function (prev) { return (__assign(__assign({}, prev), { fieldChanges: {}, originalSnapshot: {} })); });
    }, [location, search, setLocation]);
    // Set original snapshot for comparison
    var setOriginalSnapshot = useCallback(function (snapshot) {
        setState(function (prev) { return (__assign(__assign({}, prev), { originalSnapshot: snapshot })); });
    }, []);
    // Track field changes
    var trackFieldChange = useCallback(function (fieldName, newValue, oldValue) {
        setState(function (prev) {
            var _a;
            var originalValue = oldValue !== undefined ? oldValue : prev.originalSnapshot[fieldName];
            // If the new value equals the original value, remove the change
            if (newValue === originalValue) {
                var _b = prev.fieldChanges, _c = fieldName, removed = _b[_c], remainingChanges = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);
                return __assign(__assign({}, prev), { fieldChanges: remainingChanges });
            }
            // Add or update the field change
            return __assign(__assign({}, prev), { fieldChanges: __assign(__assign({}, prev.fieldChanges), (_a = {}, _a[fieldName] = {
                    fieldName: fieldName,
                    originalValue: originalValue,
                    currentValue: newValue,
                    timestamp: new Date()
                }, _a)) });
        });
    }, []);
    // Get change summary
    var getChangeSummary = useCallback(function () {
        var changes = Object.values(state.fieldChanges);
        return {
            hasChanges: changes.length > 0,
            changedFieldsCount: changes.length,
            changes: changes
        };
    }, [state.fieldChanges]);
    // Generate change request payload
    var generateChangeRequestPayload = useCallback(function () {
        var changes = Object.values(state.fieldChanges);
        if (changes.length === 0)
            return null;
        return {
            category: state.targetType,
            targetType: state.targetType,
            targetId: state.targetId,
            snapshotBefore: state.originalSnapshot,
            proposedChanges: changes.map(function (change) { return ({
                field: change.fieldName,
                from: change.originalValue,
                to: change.currentValue,
                timestamp: change.timestamp.toISOString()
            }); })
        };
    }, [state]);
    return {
        isModifyMode: state.isModifyMode,
        targetType: state.targetType,
        targetId: state.targetId,
        enableModifyMode: enableModifyMode,
        disableModifyMode: disableModifyMode,
        setOriginalSnapshot: setOriginalSnapshot,
        trackFieldChange: trackFieldChange,
        getChangeSummary: getChangeSummary,
        generateChangeRequestPayload: generateChangeRequestPayload,
        fieldChanges: state.fieldChanges
    };
}
//# sourceMappingURL=useModifyMode.js.map