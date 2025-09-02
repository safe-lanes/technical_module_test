import { __assign, __spreadArray } from "tslib";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Calendar } from "lucide-react";
var StoresChangeRequestForm = function (_a) {
    var onClose = _a.onClose, onSubmit = _a.onSubmit, _b = _a.initialData, initialData = _b === void 0 ? {} : _b, _c = _a.category, category = _c === void 0 ? "stores" : _c;
    var _d = useState(initialData.placeReceived || ""), placeReceived = _d[0], setPlaceReceived = _d[1];
    var _e = useState(initialData.dateReceived || ""), dateReceived = _e[0], setDateReceived = _e[1];
    var _f = useState([
        {
            itemCode: initialData.itemCode || (category === "stores" ? "ST-TOOL-001" : category === "lubes" ? "ISO VG 100" : "CHM-ALK-001"),
            itemName: initialData.itemName || (category === "stores" ? "Torque Wrench" : category === "lubes" ? "Compressor Oil" : "Alkaline Cleaner"),
            storesCategory: initialData.storesCategory || (category === "stores" ? "Engine Stores" : category === "lubes" ? "Air Compressor #2" : "Engine Bilge Cleaning"),
            rob: initialData.rob || "2",
            consumed: "",
            received: "",
            newRob: initialData.rob || "2",
            comments: ""
        },
        { itemCode: "", itemName: "", storesCategory: "", rob: "", consumed: "", received: "", newRob: "", comments: "" },
        { itemCode: "", itemName: "", storesCategory: "", rob: "", consumed: "", received: "", newRob: "", comments: "" }
    ]), storeItems = _f[0], setStoreItems = _f[1];
    var _g = useState(new Set()), changedFields = _g[0], setChangedFields = _g[1];
    var handleInputChange = function (field, value) {
        if (field === 'placeReceived') {
            setPlaceReceived(value);
        }
        else if (field === 'dateReceived') {
            setDateReceived(value);
        }
        // Track changed fields for red highlighting
        var initialValue = initialData[field];
        if (value !== initialValue) {
            setChangedFields(function (prev) { return new Set(__spreadArray(__spreadArray([], Array.from(prev), true), [field], false)); });
        }
        else {
            setChangedFields(function (prev) {
                var newSet = new Set(Array.from(prev));
                newSet.delete(field);
                return newSet;
            });
        }
    };
    var handleItemChange = function (index, field, value) {
        setStoreItems(function (prev) {
            var _a;
            var newItems = __spreadArray([], prev, true);
            newItems[index] = __assign(__assign({}, newItems[index]), (_a = {}, _a[field] = value, _a));
            // Calculate new ROB
            if (field === 'consumed' || field === 'received' || field === 'rob') {
                var consumed = parseFloat(newItems[index].consumed) || 0;
                var received = parseFloat(newItems[index].received) || 0;
                var originalRob = parseFloat(newItems[index].rob) || 0;
                newItems[index].newRob = (originalRob - consumed + received).toString();
            }
            return newItems;
        });
        // Track changed fields for red highlighting
        var fieldKey = "".concat(index, ".").concat(field);
        var initialValue = initialData[field];
        if (value !== initialValue) {
            setChangedFields(function (prev) { return new Set(__spreadArray(__spreadArray([], Array.from(prev), true), [fieldKey], false)); });
        }
        else {
            setChangedFields(function (prev) {
                var newSet = new Set(Array.from(prev));
                newSet.delete(fieldKey);
                return newSet;
            });
        }
    };
    var handleSubmit = function () {
        if (onSubmit) {
            onSubmit({ placeReceived: placeReceived, dateReceived: dateReceived, storeItems: storeItems });
            onClose();
        }
    };
    var getInputStyle = function (field) {
        var isChanged = changedFields.has(field);
        return "text-sm ".concat(isChanged ? 'text-red-500 border-red-500' : 'text-[#52baf3] border-[#52baf3]');
    };
    var getItemInputStyle = function (index, field) {
        var fieldKey = "".concat(index, ".").concat(field);
        var isChanged = changedFields.has(fieldKey);
        return "text-sm h-8 ".concat(isChanged ? 'text-red-500 border-red-500' : 'text-[#52baf3] border-[#52baf3]');
    };
    var getLabelStyle = function () { return 'block text-sm font-medium text-[#52baf3] mb-2'; };
    var getHeaderStyle = function () { return 'text-sm font-medium text-[#52baf3]'; };
    var getColumnHeaders = function () {
        switch (category) {
            case "lubes":
                return ["Lube Grade", "Lube Type", "Application", "ROB (Ltr)", "Consumed", "Received", "New ROB", "Comments"];
            case "chemicals":
                return ["Chem Code", "Chemical Name", "Application Area", "ROB (Ltr)", "Consumed", "Received", "New ROB", "Comments"];
            default:
                return ["Item Code", "Item Name", "Category", "ROB", "Consumed", "Received", "New ROB", "Comments"];
        }
    };
    return (<div className="w-[95%] max-w-7xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-lg">
      {/* Modal Header */}
      <div className="flex justify-between items-center p-4 border-b border-[#52baf3]">
        <h2 className="text-xl font-semibold text-[#52baf3]">
          Bulk Update {category.charAt(0).toUpperCase() + category.slice(1)} - Change Request
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-[#52baf3] hover:bg-[#52baf3] hover:text-white">
          <X className="h-4 w-4"/>
        </Button>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        {/* Place Received and Date Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded border border-[#52baf3]">
          <div>
            <label className={getLabelStyle()}>Place Received</label>
            <Input placeholder="Enter place received" value={placeReceived} onChange={function (e) { return handleInputChange('placeReceived', e.target.value); }} className={getInputStyle('placeReceived')}/>
          </div>
          <div>
            <label className={getLabelStyle()}>Date</label>
            <div className="relative">
              <Input type="date" value={dateReceived} onChange={function (e) { return handleInputChange('dateReceived', e.target.value); }} className={"pr-10 ".concat(getInputStyle('dateReceived'))}/>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#52baf3] pointer-events-none"/>
            </div>
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-8 gap-3 bg-gray-50 p-3 rounded-t border border-[#52baf3]">
          {getColumnHeaders().map(function (header, index) { return (<div key={index} className={getHeaderStyle()}>{header}</div>); })}
        </div>

        {/* Table Body */}
        <div className="border border-t-0 rounded-b max-h-[400px] overflow-y-auto border-[#52baf3]">
          {storeItems.map(function (item, index) {
            var newRob = parseFloat(item.newRob) || 0;
            var minStock = 1; // Default minimum stock
            return (<div key={index} className="grid grid-cols-8 gap-3 p-3 border-b bg-white items-center">
                <div className="text-[#52baf3] text-sm">{item.itemCode || (index === 0 ? (category === "stores" ? "ST-TOOL-001" : category === "lubes" ? "ISO VG 100" : "CHM-ALK-001") : "")}</div>
                <div className="text-[#52baf3] text-sm">{item.itemName || (index === 0 ? (category === "stores" ? "Torque Wrench" : category === "lubes" ? "Compressor Oil" : "Alkaline Cleaner") : "")}</div>
                <div className="text-[#52baf3] text-sm">{item.storesCategory || (index === 0 ? (category === "stores" ? "Engine Stores" : category === "lubes" ? "Air Compressor #2" : "Engine Bilge Cleaning") : "")}</div>
                <div className="text-[#52baf3] text-sm">{item.rob || (index === 0 ? "2" : "")}</div>
                <div>
                  <Input type="number" min="0" className={getItemInputStyle(index, 'consumed')} placeholder="0" value={item.consumed} onChange={function (e) { return handleItemChange(index, 'consumed', e.target.value); }}/>
                </div>
                <div>
                  <Input type="number" min="0" className={getItemInputStyle(index, 'received')} placeholder="0" value={item.received} onChange={function (e) { return handleItemChange(index, 'received', e.target.value); }}/>
                </div>
                <div className={"text-sm font-medium ".concat(newRob < minStock ? 'text-red-600' : 'text-[#52baf3]')}>
                  {item.newRob}
                </div>
                <div className="flex justify-center">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#52baf3] hover:bg-[#52baf3] hover:text-white" onClick={function () {
                    var comment = prompt("Add comment for ".concat(item.itemName, ":"));
                    if (comment) {
                        handleItemChange(index, 'comments', comment);
                    }
                }}>
                    <MessageSquare className="h-4 w-4"/>
                  </Button>
                </div>
              </div>);
        })}
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
        <Button variant="outline" onClick={onClose} className="border-[#52baf3] text-[#52baf3] hover:bg-[#52baf3] hover:text-white">
          Cancel
        </Button>
        <Button className="bg-[#52baf3] hover:bg-[#40a8e0] text-white" onClick={handleSubmit}>
          Save Updates
        </Button>
      </div>
    </div>);
};
export default StoresChangeRequestForm;
//# sourceMappingURL=StoresChangeRequestForm.jsx.map