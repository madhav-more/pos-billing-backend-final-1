import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getTheme } from "../../theme"; // Import getTheme function
import { useTheme } from "../../ThemeContext"; // Import useTheme hook
import { handleLogout } from "./Profile";

const InfiniteNavBar = ({ pageName }) => {
  const navigation = useNavigation();
  const [UserData, setUserData] = useState([]);
  const [roles, setRole] = useState(null);
  const { isDarkMode } = useTheme(); // Get theme state from context

  // Get current theme based on dark mode state
  const theme = getTheme(isDarkMode);

  //call on page load
  useEffect(() => {
    GetProfileData();
  }, []);

  // get contact id handler
  const GetProfileData = async () => {
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");

    try {
      const response = await axios.post(
        `${API_URL}/profile/info`,
        { role },
        {
          headers: { Authorization: token },
        }
      );

      const usersData = response.data.user[0];
      setUserData(usersData);
      await AsyncStorage.setItem("VIOrgId", usersData.vtiger_Org_Id);
      await AsyncStorage.setItem("VTContacId", usersData.vtiger_Contact_Id);
    } catch (err) {
      console.log(err);

            if (err?.response?.status === 403) {

                handleLogout(navigation);
            }

    }
    const cleanRole = role?.split(" ")[0];
    setRole(cleanRole);
  };

  return (
    <>
      {/* Top Bar with Logo and Title */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: theme.TAB_BAR_BG,
            borderBottomColor: theme.BORDER_COLOR,
            shadowColor: theme.SHADOW_COLOR,
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoPlaceholder,
              {
                backgroundColor: theme.LOGO_BG,
                shadowColor: theme.ACCENT_SHADOW_COLOR,
              },
            ]}
          >
            <Ionicons name="library-outline" size={24} color="#000000" />
          </View>
          <View>
            <Text style={[styles.companyName, { color: theme.PRIMARY_COLOR }]}>
              Shraddha Infosystems
            </Text>
            <Text
              style={[styles.companyTagline, { color: theme.SECONDARY_TEXT }]}
            >
              {pageName === "Home"
                ? "Home":
                pageName === "Reports"
                ? "Reports"
                :
                 pageName === "Profile"
                ? "Profile"
                : pageName === "Knowledge"
                ? "Knowledge"
                : pageName === "Support"
                ? "Support"
                : pageName === "CourseDetails"
                ? "Course Details"
                : "Infinite"}{" "}
              Portal
            </Text>
          </View>
        </View>
        <View style={styles.userInfo}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.userAvatar, { backgroundColor: theme.LOGO_BG }]}
            >
              <Text
                style={[
                  styles.userInitial,
                  { color: "#000000" }, // Keep black text for visibility
                ]}
              >
                {UserData
                  ? roles === "admin"
                    ? UserData.admin_FirstName?.charAt(0).toUpperCase() || "A"
                    : UserData.user_Name?.charAt(0).toUpperCase() || "U"
                  : "U"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "700",
  },
  companyTagline: {
    fontSize: 12,
    marginTop: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  userInitial: {
    fontSize: 16,
    fontWeight: "600",
  },
});


export default InfiniteNavBar;
