// theme.js - Light and Dark Theme Configuration

export const lightTheme = {
    // Primary Colors (Updated with new scheme)
    PRIMARY_COLOR: "#000000",
    PRIMARY_TOPBAR: "#000000",
    ACCENT_BLUE: "#3498DB",
    ACCENT_PURPLE: "#9B59B6",
    ACCENT_GREEN: "#2ECC71",
    ACCENT_YELLOW: "#3498DB", // New accent color
    ACCENT_RED: "#F54927",
    BLACK_GOLDEN:"#000000",
    
    // Background Colors
    PRIMARY_BG: "#FFFFFF",
    SECONDARY_BG: "#F8F9FA",
    CARD_BG: "#FFFFFF",
    
    // Text Colors
    PRIMARY_TEXT: "#000000",
    SECONDARY_TEXT: "#7F8C8D",
    TERTIARY_TEXT: "#95A5A6",
    
    // Border & Divider Colors
    BORDER_COLOR: "#E0E0E0",
    DIVIDER_COLOR: "#E0E0E0",
    
    // Status Colors
    SUCCESS_COLOR: "#2ECC71",
    ERROR_COLOR: "#E74C3C",
    WARNING_COLOR: "#F39C12",
    
    // Component Specific
    LOGO_BG: "#EFE17C",
    AVATAR_BG: "#F4F6F8",
    BADGE_BG_OPACITY: "15",
    LOGOUT_BG: "#E74C3C",
    
    // Navigation Bar Colors - ADDED
    TAB_BAR_BG: "#FFFFFF",
    TAB_BAR_BORDER: "#E0E0E0",
    TAB_ACTIVE_ICON: "#000000",
    TAB_INACTIVE_ICON: "#7F8C8D",
    TAB_ACTIVE_TEXT: "#000000",
    TAB_INACTIVE_TEXT: "#7F8C8D",
    TAB_ACTIVE_INDICATOR: "#000000",
    
    // Shadow Colors
    SHADOW_COLOR: "rgba(0, 0, 0, 0.1)",
    ACCENT_SHADOW_COLOR: "#EFE17C",
    
    // Icon Colors
    PRIMARY_ICON: "#000000",
    SECONDARY_ICON: "#7F8C8D",
    
    // Theme Mode Identifier
    MODE: "light",
  };
  
  export const darkTheme = {
    // Primary Colors - Enhanced contrast with new scheme
    PRIMARY_COLOR: "#FFFFFF",
    PRIMARY_TOPBAR: "#000000",
    ACCENT_BLUE: "#5DADE2",
    ACCENT_PURPLE: "#BB8FCE",
    ACCENT_GREEN: "#58D68D",
    ACCENT_YELLOW: "#EFE17C", // Vibrant yellow accent
    ACCENT_RED: "#EFE17C",
    BLACK_GOLDEN:"#EFE17C",
    
    // Background Colors - Pure black for deep dark theme
    PRIMARY_BG: "#FFFFFF",
    SECONDARY_BG: "#0A0A0A",
    CARD_BG: "#111111",
    
    // Text Colors - High contrast white
    PRIMARY_TEXT: "#FFFFFF",
    SECONDARY_TEXT: "#7F8C8D",
    TERTIARY_TEXT: "#999999",
    
    // Border & Divider Colors - Subtle dark borders
    BORDER_COLOR: "#333333",
    DIVIDER_COLOR: "#333333",
    
    // Status Colors - Brighter for dark mode
    SUCCESS_COLOR: "#58D68D",
    ERROR_COLOR: "#EC7063",
    WARNING_COLOR: "#F8C471",
    
    // Component Specific
    LOGO_BG: "#EFE17C",
    AVATAR_BG: "#1A1A1A",
    BADGE_BG_OPACITY: "25", // Increased opacity for better visibility
    LOGOUT_BG: "#EC7063",
    
    // Navigation Bar Colors - ADDED
    TAB_BAR_BG: "#000000",
    TAB_BAR_BORDER: "#333333",
    TAB_ACTIVE_ICON: "#EFE17C",
    TAB_INACTIVE_ICON: "#7F8C8D",
    TAB_ACTIVE_TEXT: "#FFFFFF",
    TAB_INACTIVE_TEXT: "#7F8C8D",
    TAB_ACTIVE_INDICATOR: "#EFE17C",
    
    // Shadow Colors - Subtle shadows for dark mode
    SHADOW_COLOR: "rgba(0, 0, 0, 0.3)",
    ACCENT_SHADOW_COLOR: "#EFE17C",
    
    // Icon Colors
    PRIMARY_ICON: "#FFFFFF",
    SECONDARY_ICON: "#CCCCCC",
    
    // Theme Mode Identifier
    MODE: "dark",
  };
  
  // Helper function to get theme based on mode
  export const getTheme = (isDarkMode) => {
    return isDarkMode ? darkTheme : lightTheme;
  };
  
  // Default export
  export default {
    light: lightTheme,
    dark: darkTheme,
    getTheme,
  };