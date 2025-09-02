export interface ComponentNode {
  id: string;
  code: string;
  name: string;
  children?: ComponentNode[];
  isExpanded?: boolean;
}

export const componentTree: ComponentNode[] = [
  {
    id: '1',
    code: '1',
    name: 'Ship General',
    children: [
      {
        id: '1.1',
        code: '1.1',
        name: 'Fresh Water System',
        children: [
          {
            id: '1.1.1',
            code: '1.1.1',
            name: 'Hydrophore Unit',
            children: [
              {
                id: '1.1.1.1',
                code: '1.1.1.1',
                name: 'Pressure Vessel',
              },
              {
                id: '1.1.1.2',
                code: '1.1.1.2',
                name: 'Feed Pump',
              },
              {
                id: '1.1.1.3',
                code: '1.1.1.3',
                name: 'Pressure Switch',
              },
            ],
          },
          {
            id: '1.1.2',
            code: '1.1.2',
            name: 'Potable Water Maker',
            children: [],
          },
          {
            id: '1.1.3',
            code: '1.1.3',
            name: 'UV Sterilizer',
            children: [],
          },
        ],
      },
      {
        id: '1.2',
        code: '1.2',
        name: 'Sewage Treatment System',
        children: [],
      },
      {
        id: '1.3',
        code: '1.3',
        name: 'HVAC – Accommodation',
        children: [],
      },
    ],
  },
  {
    id: '2',
    code: '2',
    name: 'Hull',
    children: [
      {
        id: '2.1',
        code: '2.1',
        name: 'Ballast Tanks',
        children: [],
      },
      {
        id: '2.2',
        code: '2.2',
        name: 'Cathodic Protection',
        children: [],
      },
      {
        id: '2.3',
        code: '2.3',
        name: 'Hull Openings – Hatches',
        children: [],
      },
    ],
  },
  {
    id: '3',
    code: '3',
    name: 'Equipment for Cargo',
    children: [
      {
        id: '3.1',
        code: '3.1',
        name: 'Cargo Cranes',
        children: [],
      },
      {
        id: '3.2',
        code: '3.2',
        name: 'Hatch Cover Hydraulics',
        children: [],
      },
      {
        id: '3.3',
        code: '3.3',
        name: 'Cargo Hold Ventilation',
        children: [],
      },
    ],
  },
  {
    id: '4',
    code: '4',
    name: "Ship's Equipment",
    children: [
      {
        id: '4.1',
        code: '4.1',
        name: 'Mooring System',
        children: [],
      },
      {
        id: '4.2',
        code: '4.2',
        name: 'Windlass',
        children: [],
      },
      {
        id: '4.3',
        code: '4.3',
        name: 'Steering Gear',
        children: [],
      },
    ],
  },
  {
    id: '5',
    code: '5',
    name: 'Equipment for Crew & Passengers',
    children: [
      {
        id: '5.1',
        code: '5.1',
        name: 'Lifeboat System',
        children: [],
      },
      {
        id: '5.2',
        code: '5.2',
        name: 'Fire Main System',
        children: [],
      },
      {
        id: '5.3',
        code: '5.3',
        name: 'Emergency Lighting',
        children: [],
      },
    ],
  },
  {
    id: '6',
    code: '6',
    name: 'Machinery Main Components',
    isExpanded: true,
    children: [
      {
        id: '6.1',
        code: '6.1',
        name: 'Main Engine',
        isExpanded: true,
        children: [
          {
            id: '6.1.1',
            code: '6.1.1',
            name: 'Cylinder Head',
            isExpanded: true,
            children: [
              {
                id: '6.1.1.1',
                code: '6.1.1.1',
                name: 'Valve Seats',
              },
              {
                id: '6.1.1.2',
                code: '6.1.1.2',
                name: 'Injector Sleeve',
              },
              {
                id: '6.1.1.3',
                code: '6.1.1.3',
                name: 'Rocker Arm',
              },
            ],
          },
          {
            id: '6.1.2',
            code: '6.1.2',
            name: 'Main Bearings',
            children: [],
          },
          {
            id: '6.1.3',
            code: '6.1.3',
            name: 'Cylinder Liners',
            children: [],
          },
        ],
      },
      {
        id: '6.2',
        code: '6.2',
        name: 'Diesel Generators',
        children: [
          {
            id: '6.2.1',
            code: '6.2.1',
            name: 'DG #1',
            children: [],
          },
          {
            id: '6.2.2',
            code: '6.2.2',
            name: 'DG #2',
            children: [],
          },
          {
            id: '6.2.3',
            code: '6.2.3',
            name: 'DG #3',
            children: [],
          },
        ],
      },
      {
        id: '6.3',
        code: '6.3',
        name: 'Auxiliary Boiler',
        children: [],
      },
    ],
  },
  {
    id: '7',
    code: '7',
    name: 'Systems for Machinery Main Components',
    children: [
      {
        id: '7.1',
        code: '7.1',
        name: 'Fuel Oil System',
        children: [],
      },
      {
        id: '7.2',
        code: '7.2',
        name: 'Lubrication Oil System',
        children: [],
      },
      {
        id: '7.3',
        code: '7.3',
        name: 'Cooling Water System',
        children: [],
      },
    ],
  },
  {
    id: '8',
    code: '8',
    name: 'Ship Common Systems',
    children: [
      {
        id: '8.1',
        code: '8.1',
        name: 'Compressed Air System',
        children: [],
      },
      {
        id: '8.2',
        code: '8.2',
        name: 'Bilge & Ballast System',
        children: [],
      },
      {
        id: '8.3',
        code: '8.3',
        name: 'Fire Detection System',
        children: [],
      },
    ],
  },
];
