import { __assign } from "tslib";
import { MicroFrontendWrapper } from './MicroFrontendWrapper';
import ElementCrewAppraisals from '../pages/ElementCrewAppraisals';
import AppraisalForm from '../pages/AppraisalForm';
import AdminModule from '../pages/AdminModule';
import FormEditor from '../pages/FormEditor';
import App from '../App';
import './micro-frontend.css';
// Main app export for standalone mode
export { default as App } from '../App';
// Individual component exports for micro frontend consumption
export { default as ElementCrewAppraisals } from '../pages/ElementCrewAppraisals';
export { default as AppraisalForm } from '../pages/AppraisalForm';
export { default as AdminModule } from '../pages/AdminModule';
export { default as FormEditor } from '../pages/FormEditor';
// Wrapper export
export { MicroFrontendWrapper, useMicroFrontendConfig, } from './MicroFrontendWrapper';
// Micro frontend bootstrap function
export var bootstrap = function (config) {
    return {
        mount: function (element, mountConfig) {
            var React = require('react');
            var ReactDOM = require('react-dom/client');
            var root = ReactDOM.createRoot(element);
            var finalConfig = __assign(__assign(__assign({}, config), mountConfig), { standalone: false });
            root.render(React.createElement(MicroFrontendWrapper, { config: finalConfig }, React.createElement(App)));
            return function () { return root.unmount(); };
        },
        // Individual component mounting
        mountComponent: function (component, element, componentConfig) {
            var React = require('react');
            var ReactDOM = require('react-dom/client');
            var components = {
                ElementCrewAppraisals: ElementCrewAppraisals,
                AppraisalForm: AppraisalForm,
                AdminModule: AdminModule,
                FormEditor: FormEditor,
            };
            var Component = components[component];
            if (!Component) {
                throw new Error("Component ".concat(component, " not found"));
            }
            var root = ReactDOM.createRoot(element);
            var finalConfig = __assign(__assign(__assign({}, config), componentConfig), { standalone: false });
            root.render(React.createElement(MicroFrontendWrapper, { config: finalConfig }, React.createElement(Component)));
            return function () { return root.unmount(); };
        },
    };
};
// Global registration for micro frontend
if (typeof window !== 'undefined') {
    window.ElementCrewAppraisals = {
        bootstrap: bootstrap,
        MicroFrontendWrapper: MicroFrontendWrapper,
        components: {
            ElementCrewAppraisals: ElementCrewAppraisals,
            AppraisalForm: AppraisalForm,
            AdminModule: AdminModule,
            FormEditor: FormEditor,
            App: App,
        },
    };
}
//# sourceMappingURL=index.js.map