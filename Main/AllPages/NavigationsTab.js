// NavigationsTab.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@icons/IconsSymbol";
import { getTheme } from "../../theme";
import { useTheme } from "../../ThemeContext";

import Home from "../AllPages/Home";
import Support from "../AllPages/Support";
import Profile from "../AllPages/Profile";
import Knowledge from "../AllPages/Knowledge";
import Reports from "../AllPages/Reports"; // Import the new Reports component

const Tab = createBottomTabNavigator();

export default function NavigationsTab() {
  // Get theme state from context
  const { isDarkMode } = useTheme();
  
  // Get theme based on dark mode state
  const theme = getTheme(isDarkMode);

  const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ focused, size }) => {
      let iconName;

      if (route.name === "Home") {
        iconName = focused ? "home" : "home-outline";
      } else if (route.name === "Knowledge") {
        iconName = focused ? "book" : "book-outline";
      } else if (route.name === "Support") {
        iconName = focused ? "headset" : "headset-outline";
      } else if (route.name === "Profile") {
        iconName = focused ? "person-circle" : "person-circle-outline";
      } else if (route.name === "Reports") {
        iconName = focused ? "document-text" : "document-text-outline";
      }

      // Apply theme colors to icons
      const iconColor = focused
        ? theme.TAB_ACTIVE_ICON
        : theme.TAB_INACTIVE_ICON;
      return <Ionicons name={iconName} size={size} color={iconColor} />;
    },
    tabBarActiveTintColor: theme.TAB_ACTIVE_TEXT,
    tabBarInactiveTintColor: theme.TAB_INACTIVE_TEXT,
    tabBarStyle: {
      backgroundColor: theme.TAB_BAR_BG,
      borderTopColor: theme.TAB_BAR_BORDER,
      borderTopWidth: 1,
      height: 100,
      paddingBottom: 8,
      paddingTop: 8,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "500",
    },
  });

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Knowledge" component={Knowledge} />
      <Tab.Screen name="Reports" component={Reports} />
      <Tab.Screen name="Support" component={Support} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}