// App.js - Alternative quick fix
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import Login from "./Main/AuthPages/Login";
import NavigationsTab from "./Main/AllPages/NavigationsTab";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "./ThemeContext";
import { LogBox } from 'react-native'; // Import LogBox
import Reports from "./Main/AllPages/Reports";


const Stack = createNativeStackNavigator();

// Ignore the specific error to see the actual problem
LogBox.ignoreLogs(['Text strings must be rendered']);

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null); 

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setInitialRoute("MainApp");
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error('Token check error:', error);
        setInitialRoute("Login");
      }
    };

    checkToken();
  }, []);

  if (initialRoute === null) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MainApp" component={NavigationsTab} />
         
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </ThemeProvider>
  );
}