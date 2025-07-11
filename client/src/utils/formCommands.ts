
// Form creation commands interface
export class FormCommands {
  
  /**
   * Create a Form Editor for a specific form using a simple command
   * Usage: FormCommands.createFormEditor("Crew Promotion Form")
   */
  static createFormEditor(formName: string): void {
    try {
      const { createFormEditor } = require('./formEditorGenerator');
      createFormEditor(formName);
      console.log(`✅ Form Editor created successfully for: ${formName}`);
      console.log(`📝 You can now edit this form in Admin > Forms Configuration`);
    } catch (error) {
      console.error(`❌ Error creating Form Editor for ${formName}:`, error);
    }
  }

  /**
   * List all available form templates
   */
  static listTemplates(): string[] {
    const { formTemplates } = require('./formEditorGenerator');
    const templates = Object.keys(formTemplates);
    console.log("📋 Available form templates:");
    templates.forEach((template, index) => {
      console.log(`  ${index + 1}. ${template}`);
    });
    return templates;
  }

  /**
   * Create a new form in the database and generate its editor
   */
  static async createFormWithEditor(formName: string, templateName?: string): Promise<void> {
    try {
      // Create form in database
      const response = await fetch('/api/forms', {
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
      });

      if (!response.ok) {
        throw new Error(`Failed to create form: ${response.statusText}`);
      }

      console.log(`✅ Form "${formName}" created in database`);

      // Generate form editor if template is specified
      if (templateName) {
        this.createFormEditor(templateName);
      }

      console.log(`🎉 Process completed! Form "${formName}" is ready to use.`);
    } catch (error) {
      console.error(`❌ Error creating form with editor:`, error);
    }
  }

  /**
   * Quick command to create a complete form setup
   */
  static quickCreate(formName: string): void {
    console.log(`🚀 Creating Form Editor for: ${formName}`);
    
    // Check if template exists
    const { formTemplates } = require('./formEditorGenerator');
    if (formTemplates[formName]) {
      this.createFormEditor(formName);
      console.log(`✨ Quick creation completed for: ${formName}`);
      console.log(`📍 Next steps:`);
      console.log(`   1. Go to Admin > Forms Configuration`);
      console.log(`   2. Click the edit button for "${formName}"`);
      console.log(`   3. Configure fields and save your form`);
    } else {
      console.log(`❌ Template not found for: ${formName}`);
      console.log(`📋 Available templates:`);
      this.listTemplates();
    }
  }
}

// Make it globally accessible for console commands
if (typeof window !== 'undefined') {
  (window as any).FormCommands = FormCommands;
}

export default FormCommands;
