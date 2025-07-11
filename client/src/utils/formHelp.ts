
export class FormHelp {
  
  static showHelp(): void {
    console.log(`
🛠️  SAIL Form Editor Generator - Help Guide
===========================================

Quick Commands:
---------------
FormCommands.quickCreate("Crew Promotion Form")
  - Creates a Form Editor for an existing template

FormCommands.listTemplates()
  - Shows all available form templates

FormCommands.createFormEditor("Form Name")
  - Generates a Form Editor component for a specific form

FormCommands.createFormWithEditor("New Form Name", "Template Name")
  - Creates a form in database and generates its editor

Available Templates:
-------------------
• Crew Promotion Form - For crew promotion evaluations
• Crew Training Form - For training course management
• Crew Appraisal Form - For performance appraisals (already implemented)

Usage Examples:
--------------
1. Create a Form Editor for Crew Promotion:
   FormCommands.quickCreate("Crew Promotion Form")

2. See all available templates:
   FormCommands.listTemplates()

3. Create a complete new form setup:
   FormCommands.createFormWithEditor("Crew Medical Form", "Crew Training Form")

UI Usage:
---------
1. Go to Admin Module in the navigation
2. Click "Create Form" button
3. Choose to use a template or create blank
4. Select template and enter form name
5. Click "Create Form"

Features:
---------
✅ Version Control (Draft/Released versions)
✅ Field Configuration (Show/Hide fields)
✅ Section Management (Enable/Disable sections)
✅ Dropdown Options Configuration
✅ Weight Distribution for Assessments
✅ Responsive Design (Mobile/Desktop)
✅ Form Validation with Zod schemas

Need Help?
----------
Type FormHelp.showHelp() to see this guide again
Type FormCommands.listTemplates() to see available templates
    `);
  }

  static showQuickStart(): void {
    console.log(`
🚀 Quick Start Guide
===================

Step 1: Create a Form Editor
----------------------------
FormCommands.quickCreate("Crew Promotion Form")

Step 2: Access Admin Panel
--------------------------
1. Click "Admin" in the top navigation
2. You'll see "Forms Configuration" section
3. Find your form in the table
4. Click the edit button (pencil icon)

Step 3: Configure Your Form
---------------------------
1. Use "Configure Fields" button to enter config mode
2. Show/hide fields as needed
3. Configure dropdown options
4. Set up assessment weights
5. Save your configuration

Step 4: Use Your Form
--------------------
Your form is now ready to be used throughout the application!

🎉 That's it! Your form editor is created and ready to use.
    `);
  }
}

// Make it globally accessible
if (typeof window !== 'undefined') {
  (window as any).FormHelp = FormHelp;
}

export default FormHelp;
