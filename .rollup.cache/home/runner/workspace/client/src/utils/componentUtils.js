import { __assign } from "tslib";
// Component Category mapping based on top-level group
export var getComponentCategory = function (componentId) {
    // Extract the first level from the component ID
    var topLevelId = componentId.split('.')[0];
    // Map top-level ID to category name
    var categoryMap = {
        '1': 'Ship General',
        '2': 'Hull',
        '3': 'Equipment for Cargo',
        '4': "Ship's Equipment",
        '5': 'Equipment for Crew & Passengers',
        '6': 'Machinery Main Components',
        '7': 'Systems for Machinery Main Components',
        '8': 'Ship Common Systems',
    };
    return categoryMap[topLevelId] || '';
};
// Find a component node by ID in the tree
export var findComponentNode = function (nodes, targetId) {
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        if (node.id === targetId) {
            return node;
        }
        if (node.children) {
            var found = findComponentNode(node.children, targetId);
            if (found)
                return found;
        }
    }
    return null;
};
// Build component tree from flat list
export var buildComponentTree = function (components) {
    if (!components || components.length === 0)
        return [];
    // Create a map for quick lookup
    var componentMap = new Map();
    components.forEach(function (comp) {
        componentMap.set(comp.id || comp.componentId, __assign(__assign({}, comp), { children: [] }));
    });
    var tree = [];
    // Build the tree structure
    components.forEach(function (comp) {
        var node = componentMap.get(comp.id || comp.componentId);
        if (comp.parentId) {
            var parent_1 = componentMap.get(comp.parentId);
            if (parent_1) {
                parent_1.children.push(node);
            }
            else {
                // If parent not found, add to root
                tree.push(node);
            }
        }
        else {
            // No parent means it's a root node
            tree.push(node);
        }
    });
    // Sort nodes at each level by code
    var sortTree = function (nodes) {
        nodes.sort(function (a, b) {
            var aCode = a.code || a.componentCode || '';
            var bCode = b.code || b.componentCode || '';
            return aCode.localeCompare(bCode, undefined, { numeric: true });
        });
        nodes.forEach(function (node) {
            if (node.children && node.children.length > 0) {
                sortTree(node.children);
            }
        });
    };
    sortTree(tree);
    return tree;
};
//# sourceMappingURL=componentUtils.js.map