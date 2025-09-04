import React from 'react';
// Dynamic form editor mapping
var formEditors = {
// 'Crew Appraisal Form': FormEditor, // Not implemented yet
// Add more form editors as they are created
};
export var FormEditorFactory = function (_a) {
    var formName = _a.formName, form = _a.form, rankGroupName = _a.rankGroupName, onClose = _a.onClose, onSave = _a.onSave;
    // Get the appropriate editor component
    var EditorComponent = formEditors[formName];
    if (!EditorComponent) {
        return (<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
        <div className='bg-white rounded-lg shadow-lg p-6 max-w-md w-full'>
          <h3 className='text-lg font-semibold mb-4'>Form Editor Not Found</h3>
          <p className='text-gray-600 mb-4'>
            No form editor is available for "{formName}". Please create one
            using the Form Editor Generator.
          </p>
          <button onClick={onClose} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
            Close
          </button>
        </div>
      </div>);
    }
    return (<EditorComponent form={form} rankGroupName={rankGroupName} onClose={onClose} onSave={onSave}/>);
};
// Function to register a new form editor
export var registerFormEditor = function (formName, component) {
    formEditors[formName] = component;
};
// Function to check if form editor exists
export var hasFormEditor = function (formName) {
    return formName in formEditors;
};
//# sourceMappingURL=FormEditorFactory.jsx.map