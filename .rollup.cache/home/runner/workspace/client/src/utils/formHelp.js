var FormHelp = /** @class */ (function () {
    function FormHelp() {
    }
    FormHelp.showHelp = function () {
        console.log("\n\uD83D\uDEE0\uFE0F  SAIL Form Editor Generator - Help Guide\n===========================================\n\nQuick Commands:\n---------------\nFormCommands.quickCreate(\"Crew Promotion Form\")\n  - Creates a Form Editor for an existing template\n\nFormCommands.listTemplates()\n  - Shows all available form templates\n\nFormCommands.createFormEditor(\"Form Name\")\n  - Generates a Form Editor component for a specific form\n\nFormCommands.createFormWithEditor(\"New Form Name\", \"Template Name\")\n  - Creates a form in database and generates its editor\n\nAvailable Templates:\n-------------------\n\u2022 Crew Promotion Form - For crew promotion evaluations\n\u2022 Crew Training Form - For training course management\n\u2022 Crew Appraisal Form - For performance appraisals (already implemented)\n\nUsage Examples:\n--------------\n1. Create a Form Editor for Crew Promotion:\n   FormCommands.quickCreate(\"Crew Promotion Form\")\n\n2. See all available templates:\n   FormCommands.listTemplates()\n\n3. Create a complete new form setup:\n   FormCommands.createFormWithEditor(\"Crew Medical Form\", \"Crew Training Form\")\n\nUI Usage:\n---------\n1. Go to Admin Module in the navigation\n2. Click \"Create Form\" button\n3. Choose to use a template or create blank\n4. Select template and enter form name\n5. Click \"Create Form\"\n\nFeatures:\n---------\n\u2705 Version Control (Draft/Released versions)\n\u2705 Field Configuration (Show/Hide fields)\n\u2705 Section Management (Enable/Disable sections)\n\u2705 Dropdown Options Configuration\n\u2705 Weight Distribution for Assessments\n\u2705 Responsive Design (Mobile/Desktop)\n\u2705 Form Validation with Zod schemas\n\nNeed Help?\n----------\nType FormHelp.showHelp() to see this guide again\nType FormCommands.listTemplates() to see available templates\n    ");
    };
    FormHelp.showQuickStart = function () {
        console.log("\n\uD83D\uDE80 Quick Start Guide\n===================\n\nStep 1: Create a Form Editor\n----------------------------\nFormCommands.quickCreate(\"Crew Promotion Form\")\n\nStep 2: Access Admin Panel\n--------------------------\n1. Click \"Admin\" in the top navigation\n2. You'll see \"Forms Configuration\" section\n3. Find your form in the table\n4. Click the edit button (pencil icon)\n\nStep 3: Configure Your Form\n---------------------------\n1. Use \"Configure Fields\" button to enter config mode\n2. Show/hide fields as needed\n3. Configure dropdown options\n4. Set up assessment weights\n5. Save your configuration\n\nStep 4: Use Your Form\n--------------------\nYour form is now ready to be used throughout the application!\n\n\uD83C\uDF89 That's it! Your form editor is created and ready to use.\n    ");
    };
    return FormHelp;
}());
export { FormHelp };
// Make it globally accessible
if (typeof window !== 'undefined') {
    window.FormHelp = FormHelp;
}
export default FormHelp;
//# sourceMappingURL=formHelp.js.map