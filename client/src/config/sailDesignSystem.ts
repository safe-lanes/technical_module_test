
export const SAIL_DESIGN_SYSTEM = {
  // Color Palette
  colors: {
    primary: '#5DADE2',
    primaryDark: '#16569e',
    primaryLight: '#52baf3',
    background: '#f7fafc',
    headerBg: '#E8E8E8',
    textPrimary: '#4f5863',
    textSecondary: '#8798ad',
    textLight: '#8a8a8a',
    borderColor: '#e1e8ed',
    white: '#ffffff',
    hoverBg: '#0d4a8f',
  },

  // Typography
  typography: {
    fontFamily: "font-['Mulish',Helvetica]",
    fontFamilyRoboto: "font-['Roboto',Helvetica]",
    sizes: {
      title: 'text-[22px]',
      small: 'text-[10px]',
      xs: 'text-xs',
      sm: 'text-sm',
      regular: 'text-[13px]',
      button: 'text-[11px]',
    },
    weights: {
      normal: 'font-normal',
      bold: 'font-bold',
    }
  },

  // Layout
  layout: {
    containerWidth: 'w-[1440px]',
    containerHeight: 'h-[900px]',
    headerHeight: 'h-[67px]',
    sidebarWidth: 'w-[67px]',
    sidebarIconHeight: 'h-[79px]',
    navItemWidth: 'w-[100px]',
    filterHeight: 'h-8',
    filterWidth: 'w-[150px]',
    searchWidth: 'w-[180px]',
    buttonHeight: 'h-10',
    actionButtonSize: 'h-6 w-6',
    actionIconSize: 'h-[18px] w-[18px]',
  },

  // Components
  components: {
    badge: {
      rating: {
        high: 'bg-[#c3f2cb] text-[#286e34]',
        medium: 'bg-[#ffeaa7] text-[#814c02]',
        low: 'bg-[#f9ecef] text-[#811f1a]',
        none: 'bg-gray-400 text-white',
      }
    },
    button: {
      primary: 'bg-[#16569e] hover:bg-[#0d4a8f]',
      outline: 'border-[#e1e8ed] text-[#16569e]',
    },
    table: {
      headerBg: 'bg-[#52baf3]',
      rowHover: 'hover:bg-gray-50',
      cellPadding: 'py-3',
    }
  },

  // Assets
  assets: {
    logo: '/figmaAssets/group-2.png',
    userAvatar: '/figmaAssets/group-3.png',
    backgroundPattern: '/figmaAssets/vector.svg',
  }
};

export type SAILDesignSystem = typeof SAIL_DESIGN_SYSTEM;
