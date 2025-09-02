import { __assign } from "tslib";
import React, { createContext, useContext, useState } from "react";
var ChangeRequestContext = createContext(undefined);
// Simulate current users for testing - in production this would come from auth system
var simulatedUsers = [
    { id: "1", name: "Chief Engineer", role: "approver", title: "Chief Engineer" },
    { id: "2", name: "2nd Engineer", role: "requestor", title: "2nd Engineer" },
    { id: "3", name: "Technical Superintendent", role: "approver", title: "Technical Superintendent" },
];
export var ChangeRequestProvider = function (_a) {
    var children = _a.children;
    var _b = useState(false), isChangeRequestMode = _b[0], setIsChangeRequestMode = _b[1];
    var _c = useState(), originalData = _c[0], setOriginalData = _c[1];
    var _d = useState({}), changedFields = _d[0], setChangedFields = _d[1];
    var _e = useState(simulatedUsers[1]), currentUser = _e[0], setCurrentUser = _e[1]; // Default to 2nd Engineer
    var enterChangeRequestMode = function (category, originalData) {
        setIsChangeRequestMode(true);
        setOriginalData(originalData);
        setChangedFields({});
    };
    var exitChangeRequestMode = function () {
        setIsChangeRequestMode(false);
        setOriginalData(undefined);
        setChangedFields({});
    };
    var updateChangedField = function (fieldName, value) {
        setChangedFields(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[fieldName] = value, _a)));
        });
    };
    var resetChangedFields = function () {
        setChangedFields({});
    };
    return (<ChangeRequestContext.Provider value={{
            isChangeRequestMode: isChangeRequestMode,
            originalData: originalData,
            changedFields: changedFields,
            currentUser: currentUser,
            setCurrentUser: setCurrentUser,
            enterChangeRequestMode: enterChangeRequestMode,
            exitChangeRequestMode: exitChangeRequestMode,
            updateChangedField: updateChangedField,
            resetChangedFields: resetChangedFields,
            onFieldChange: updateChangedField
        }}>
      {children}
    </ChangeRequestContext.Provider>);
};
export var useChangeRequest = function () {
    var context = useContext(ChangeRequestContext);
    if (context === undefined) {
        throw new Error('useChangeRequest must be used within a ChangeRequestProvider');
    }
    return context;
};
//# sourceMappingURL=ChangeRequestContext.jsx.map