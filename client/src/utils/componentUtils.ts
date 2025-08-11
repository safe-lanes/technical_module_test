// Component Category mapping based on top-level group
export const getComponentCategory = (componentId: string): string => {
  // Extract the first level from the component ID
  const topLevelId = componentId.split('.')[0];
  
  // Map top-level ID to category name
  const categoryMap: Record<string, string> = {
    '1': 'Ship General',
    '2': 'Hull',
    '3': 'Equipment for Cargo',
    '4': "Ship's Equipment",
    '5': 'Equipment for Crew & Passengers',
    '6': 'Machinery Main Components',
    '7': 'Systems for Machinery Main Components',
    '8': 'Ship Common Systems'
  };
  
  return categoryMap[topLevelId] || '';
};

// Find a component node by ID in the tree
export const findComponentNode = (
  nodes: any[], 
  targetId: string
): any | null => {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node;
    }
    if (node.children) {
      const found = findComponentNode(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
};