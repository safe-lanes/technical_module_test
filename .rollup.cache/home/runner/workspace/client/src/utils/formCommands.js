import { __awaiter, __generator } from "tslib";
// Form creation commands interface
var FormCommands = /** @class */ (function () {
    function FormCommands() {
    }
    /**
     * Create a Form Editor for a specific form using a simple command
     * Usage: FormCommands.createFormEditor("Crew Promotion Form")
     */
    FormCommands.createFormEditor = function (formName) {
        try {
            var createFormEditor = require('./formEditorGenerator').createFormEditor;
            createFormEditor(formName);
            console.log("\u2705 Form Editor created successfully for: ".concat(formName));
            console.log("\uD83D\uDCDD You can now edit this form in Admin > Forms Configuration");
        }
        catch (error) {
            console.error("\u274C Error creating Form Editor for ".concat(formName, ":"), error);
        }
    };
    /**
     * List all available form templates
     */
    FormCommands.listTemplates = function () {
        var formTemplates = require('./formEditorGenerator').formTemplates;
        var templates = Object.keys(formTemplates);
        console.log("📋 Available form templates:");
        templates.forEach(function (template, index) {
            console.log("  ".concat(index + 1, ". ").concat(template));
        });
        return templates;
    };
    /**
     * Create a new form in the database and generate its editor
     */
    FormCommands.createFormWithEditor = function (formName, templateName) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch('/api/forms', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    name: formName,
                                    versionNo: "00",
                                    versionDate: new Date().toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    }).replace(/ /g, '-')
                                }),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to create form: ".concat(response.statusText));
                        }
                        console.log("\u2705 Form \"".concat(formName, "\" created in database"));
                        // Generate form editor if template is specified
                        if (templateName) {
                            this.createFormEditor(templateName);
                        }
                        console.log("\uD83C\uDF89 Process completed! Form \"".concat(formName, "\" is ready to use."));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("\u274C Error creating form with editor:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Quick command to create a complete form setup
     */
    FormCommands.quickCreate = function (formName) {
        console.log("\uD83D\uDE80 Creating Form Editor for: ".concat(formName));
        // Check if template exists
        var formTemplates = require('./formEditorGenerator').formTemplates;
        if (formTemplates[formName]) {
            this.createFormEditor(formName);
            console.log("\u2728 Quick creation completed for: ".concat(formName));
            console.log("\uD83D\uDCCD Next steps:");
            console.log("   1. Go to Admin > Forms Configuration");
            console.log("   2. Click the edit button for \"".concat(formName, "\""));
            console.log("   3. Configure fields and save your form");
        }
        else {
            console.log("\u274C Template not found for: ".concat(formName));
            console.log("\uD83D\uDCCB Available templates:");
            this.listTemplates();
        }
    };
    return FormCommands;
}());
export { FormCommands };
// Make it globally accessible for console commands
if (typeof window !== 'undefined') {
    window.FormCommands = FormCommands;
}
export default FormCommands;
//# sourceMappingURL=formCommands.js.map