// Person.js
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Animated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getTheme } from "../../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import Toast from "react-native-toast-message";
import { useTheme } from "../../ThemeContext";
import InfiniteNavBar from "./NavBar";


export const handleLogout = async (navigation) => {
  const token = await AsyncStorage.getItem("token");
  await AsyncStorage.removeItem("token");

  try {
    await axios.post(`${API_URL}/auth/logout`, { token });
    Toast.show({ type: "success", text1: "Log Out successfully" });
    navigation.replace("Login");
  } catch (e) {
    console.log(e)
  }
};

export default function Profile() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const { isDarkMode, toggleTheme } = useTheme(); // Use context instead of local state
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [UserData, setUserData] = useState([]);
  const navigation = useNavigation();

  // Get current theme based on dark mode state
  const theme = getTheme(isDarkMode);

  //call on page load
  useEffect(() => {
    GetProfileData();
  }, []);

  // ============== get Profile Data handler
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
      // console.log("usersData", usersData);
    } catch (err) {
      console.log(err);
    }
  };

  // Animation refs (kept for other elements if needed)
  const profileScaleAnim = useRef(new Animated.Value(1)).current;

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem("token");

    await AsyncStorage.removeItem("token");

    try {
      await axios.post(`${API_URL}/auth/logout`, {
        token,
      });
      Toast.show({
        type: "success",
        text1: "Log Out successfully",
      });
      navigation.replace("Login");
    } catch (error) {
      //console.log("your session are expired");
    }
  };

  const handlePress = (scaleValue) => {
    // This press animation is used for other interactive elements (if any)
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Font style helper function
  const getFontStyle = (weight = "regular") => {
    const fontWeights = {
      regular: {
        fontFamily: fontsLoaded ? "Montserrat_400Regular" : "System",
        fontWeight: "400",
      },
      medium: {
        fontFamily: fontsLoaded ? "Montserrat_500Medium" : "System",
        fontWeight: "500",
      },
      semibold: {
        fontFamily: fontsLoaded ? "Montserrat_600SemiBold" : "System",
        fontWeight: "600",
      },
      bold: {
        fontFamily: fontsLoaded ? "Montserrat_700Bold" : "System",
        fontWeight: "700",
      },
      extrabold: {
        fontFamily: fontsLoaded ? "Montserrat_800ExtraBold" : "System",
        fontWeight: "800",
      },
    };
    return fontWeights[weight] || fontWeights.regular;
  };

  // --- Render Functions ---

  const renderTopHeader = () => (
    <View style={[styles.topBar, { backgroundColor: theme.profileHeader }]}>
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
          <Text
            style={[
              styles.companyName,
              { color: theme.PRIMARY_COLOR },
              getFontStyle("bold"),
            ]}
          >
            Shraddha Infosystems
          </Text>
          <Text
            style={[
              styles.companyTagline,
              { color: theme.SECONDARY_TEXT },
              getFontStyle("regular"),
            ]}
          >
            Profile
          </Text>
        </View>
      </View>
    </View>
  );

  const userName = UserData
    ? UserData.role === "admin"
      ? `${UserData.admin_FirstName} ${UserData.admin_LastName}`
      : UserData.user_Name
    : "User Name";

  const renderProfileHeader = () => (
    <View
      style={[
        styles.profileHeader,
        {
          backgroundColor: theme.CARD_BG,
          borderColor: theme.BORDER_COLOR,
          shadowColor: theme.SHADOW_COLOR,
        },
      ]}
    >
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: theme.AVATAR_BG,
              borderColor: theme.CARD_BG,
              shadowColor: theme.PRIMARY_COLOR,
            },
          ]}
        >
          <Ionicons name="person" size={36} color={theme.PRIMARY_COLOR} />
        </View>
        <View
          style={[
            styles.verifiedBadge,
            {
              backgroundColor: theme.CARD_BG,
              borderColor: theme.CARD_BG,
              shadowColor: theme.SHADOW_COLOR,
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={theme.SUCCESS_COLOR}
          />
        </View>
      </View>
      <View style={styles.profileInfo}>
        <Text
          style={[
            styles.profileName,
            { color: theme.PRIMARY_COLOR },
            getFontStyle("extrabold"),
          ]}
        >
          {userName}
        </Text>
        <View
          style={[
            styles.profileBadge,
            { backgroundColor: theme.ACCENT_YELLOW + theme.BADGE_BG_OPACITY },
          ]}
        >
          <Ionicons name="star" size={12} color={theme.ACCENT_YELLOW} />
          <Text
            style={[
              styles.profileBadgeText,
              { color: theme.ACCENT_YELLOW },
              getFontStyle("bold"),
            ]}
          >
            Role : {UserData?.role}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderContactInfo = () => (
    <View
      style={[
        styles.contactInfoContainer,
        {
          backgroundColor: theme.CARD_BG,
          borderColor: theme.BORDER_COLOR,
          shadowColor: theme.SHADOW_COLOR,
        },
      ]}
    >
      {[
        {
          icon: "mail-outline",
          label: "Mail Id",
          value: UserData?.admin_Email || "NA",
          onPress: () => console.log("Email tapped:", UserData?.admin_Email),
        },
        {
          icon: "key-outline",
          label: "Contact Code",
          value: UserData?.vtiger_Contact_Id || "NA",
          onPress: () =>
            console.log("Internal code tapped:", UserData?.infiniteSerialNo),
        },
      ].map((item, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={styles.contactInfoItem}
            activeOpacity={0.8}
            onPress={item.onPress}
          >
            <View
              style={[
                styles.contactInfoIconContainer,
                {
                  backgroundColor: theme.ACCENT_YELLOW + theme.BADGE_BG_OPACITY,
                },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={theme.ACCENT_YELLOW}
              />
            </View>
            <View style={styles.contactInfoContent}>
              <Text
                style={[
                  styles.contactInfoLabel,
                  { color: theme.TERTIARY_TEXT },
                  getFontStyle("medium"),
                ]}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.contactInfoValue,
                  { color: theme.PRIMARY_COLOR },
                  getFontStyle("semibold"),
                ]}
                numberOfLines={1}
              >
                {item.value}
              </Text>
            </View>
          </TouchableOpacity>
          {index === 0 && (
            <View
              style={[
                styles.contactInfoDivider,
                { backgroundColor: theme.DIVIDER_COLOR },
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderThemeSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleWithIcon}>
          <Ionicons
            name="color-palette"
            size={18}
            color={theme.ACCENT_YELLOW}
          />
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.PRIMARY_COLOR },
              getFontStyle("bold"),
            ]}
          >
            Appearances
          </Text>
        </View>
      </View>

      <View style={styles.themeToggleContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            toggleTheme(false); // Use toggleTheme from context
          }}
        >
          <View
            style={[
              styles.themeButton,
              !isDarkMode && styles.themeButtonActive,
              {
                borderColor: !isDarkMode
                  ? theme.ACCENT_YELLOW
                  : theme.BORDER_COLOR,
                backgroundColor: !isDarkMode
                  ? theme.CARD_BG
                  : theme.SECONDARY_BG,
              },
            ]}
          >
            <Ionicons
              name="sunny"
              size={24}
              color={!isDarkMode ? theme.ACCENT_YELLOW : theme.SECONDARY_TEXT}
              style={styles.themeIcon}
            />
            <Text
              style={[
                styles.themeButtonText,
                {
                  color: !isDarkMode
                    ? theme.PRIMARY_COLOR
                    : theme.SECONDARY_TEXT,
                  ...getFontStyle(!isDarkMode ? "semibold" : "medium"),
                },
              ]}
            >
              Light Mode
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            toggleTheme(true); // Use toggleTheme from context
          }}
        >
          <View
            style={[
              styles.themeButton,
              isDarkMode && styles.themeButtonActive,
              {
                borderColor: isDarkMode
                  ? theme.ACCENT_YELLOW
                  : theme.BORDER_COLOR,
                backgroundColor: isDarkMode
                  ? theme.CARD_BG
                  : theme.SECONDARY_BG,
              },
            ]}
          >
            <Ionicons
              name="moon"
              size={24}
              color={isDarkMode ? theme.ACCENT_YELLOW : theme.SECONDARY_TEXT}
              style={styles.themeIcon}
            />
            <Text
              style={[
                styles.themeButtonText,
                {
                  color: isDarkMode
                    ? theme.PRIMARY_COLOR
                    : theme.SECONDARY_TEXT,
                  ...getFontStyle(isDarkMode ? "semibold" : "medium"),
                },
              ]}
            >
              Dark Mode
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );

  const renderAppInfo = () => (
    <View style={styles.section}>
      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: theme.CARD_BG,
            borderColor: theme.BORDER_COLOR,
            shadowColor: theme.SHADOW_COLOR,
          },
        ]}
      >
        {[
          {
            icon: "information-circle",
            label: "Version",
            value: "1.0.0",
          },
        ].map((item, index, arr) => (
          <React.Fragment key={index}>
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  {
                    backgroundColor:
                      theme.ACCENT_YELLOW + theme.BADGE_BG_OPACITY,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={theme.ACCENT_YELLOW}
                />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: theme.TERTIARY_TEXT },
                    getFontStyle("medium"),
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.PRIMARY_COLOR },
                    getFontStyle("semibold"),
                  ]}
                >
                  {item.value}
                </Text>
              </View>
            </View>
            {index < arr.length - 1 && (
              <View
                style={[
                  styles.infoDivider,
                  { backgroundColor: theme.DIVIDER_COLOR },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.SECONDARY_BG }]}>
      <InfiniteNavBar pageName="Profile" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.mainContentSection}>
          {renderProfileHeader()}
          {renderContactInfo()}
        </View>

        {renderThemeSection()}

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                backgroundColor: theme.LOGOUT_BG,
                shadowColor: theme.LOGOUT_BG,
              },
            ]}
            onPress={() => handleLogout(navigation)}
            activeOpacity={0.8}
          >
            <View style={styles.logoutIconContainer}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={theme.PRIMARY_BG}
              />
            </View>
            <Text
              style={[
                styles.logoutButtonText,
                { color: theme.PRIMARY_BG },
                getFontStyle("bold"),
              ]}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {renderAppInfo()}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (keep all existing styles exactly the same)
  // Global/Container Styles
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
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
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  companyName: {
    fontSize: 18,
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
    color: "#000000",
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
    paddingTop: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  mainContentSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  // Profile Header
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 20,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    borderRadius: 12,
    padding: 1,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 22,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  profileBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: "flex-start",
    gap: 4,
  },
  profileBadgeText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  // Contact Info Styles
  contactInfoContainer: {
    borderRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    overflow: "hidden",
  },
  contactInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  contactInfoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactInfoContent: {
    flex: 1,
  },
  contactInfoLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  contactInfoValue: {
    fontSize: 15,
  },
  contactInfoDivider: {
    height: 1,
    marginHorizontal: 20,
  },
  // Theme Section Styles
  sectionHeader: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    letterSpacing: 0.3,
  },
  themeToggleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  themeButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  themeButtonActive: {
    shadowColor: "#EFE17C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  themeIcon: {
    marginBottom: 8,
  },
  themeButtonText: {
    fontSize: 14,
    textAlign: "center",
  },
  // Info Section Styles
  infoCard: {
    borderRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
  },
  infoDivider: {
    height: 1,
    marginHorizontal: 20,
  },
  // Logout Section
  logoutSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 18,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 40,
  },
});
