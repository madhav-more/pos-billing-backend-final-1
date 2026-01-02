import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
  Linking,
  Animated,
  Easing,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { API_URL } from "@env";
import InfiniteNavBar from "./NavBar";
import { getTheme } from "../../theme"; // Import the theme functions
import { useTheme } from "../../ThemeContext"; // Import the theme context

export default function Support() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const [isExpanded, setIsExpanded] = useState(false);
  const [casetatus, setcasetatus] = useState([]);
  const [casesList, setCasesList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [NewData, setNewData] = useState({
    Casetitle: "",
    CaseDesc: "",
  });

  // Get dark mode state and toggle function from context
  const { isDarkMode } = useTheme();

  // Get current theme based on dark mode state
  const theme = getTheme(isDarkMode);

  // Animation values for expandable button (kept for the click animation)
  const expandAnim = useRef(new Animated.Value(0)).current;
  const newCaseOpacity = useRef(new Animated.Value(0)).current;
  const callbackOpacity = useRef(new Animated.Value(0)).current;
  const newCaseTranslateY = useRef(new Animated.Value(10)).current;
  const callbackTranslateY = useRef(new Animated.Value(10)).current;

  // get cases total count handler
  const caseDataCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const ContId = await AsyncStorage.getItem("VTContacId");
      const response = await axios.post(
        `${API_URL}/support/Cases/getCasesStatus`,
        { contact_Id: ContId },
        {
          headers: { Authorization: token },
        }
      );
      setcasetatus(response.data);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  //call on page load
  useEffect(() => {
    caseDataCount();
    casesListFun();
  }, []);

  //Cases List API Calling
  const casesListFun = async () => {
    const token = await AsyncStorage.getItem("token");
    const contact_Id = await AsyncStorage.getItem("VTContacId");
    try {
      const response = await axios.post(
        `${API_URL}/support/Cases/AllcasesList`,
        { contact_Id },
        {
          headers: { Authorization: token },
        }
      );
      setCasesList(response.data.result);
      //  console.log("Generate Case : ",response.data.result)
    } catch (error) {
      //console.log("Error fetching data");
    }
  };

  // ========= Handler used for Value Inputs of Cases
  const handleDateChange = (key, value) => {
    setNewData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //---------------------

  // Generate Cases API FUNCTION
  const handleSaveCase = async () => {
    const token = await AsyncStorage.getItem("token");
    const contact_Id = await AsyncStorage.getItem("VTContacId");
    const Orgs_id = await AsyncStorage.getItem("VIOrgId");

    if (balCase > 0) {
      const newCase = {
        contact_Id: contact_Id,
        caseTitle: NewData.Casetitle,
        case_Description: NewData.CaseDesc,
        caseType: "INFINITE",
        Org_id: Orgs_id,
      };
      console.log("newCase", newCase);

      try {
        const response = await axios.post(
          `${API_URL}/support/Cases/create`,
          newCase,
          {
            headers: { Authorization: token },
          }
        );
        Toast.show({
          type: "success",
          text1: "case created successfully",
        });
        setOpenDialog(false);
        casesListFun();
        // console.log("response",response)
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "case creation failed",
          text2: error.message,
        });
        console.log("case creations error", error);
      }
    }
  };

  ///=============================================

  const handleAction = (action, data) => {
    switch (action) {
      case "call":
        Linking.openURL(`tel:${data}`);
        break;
      case "email":
        Linking.openURL(`mailto:${data}`);
        break;
      default:
        break;
    }
    toggleExpand();
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      if (prev) {
        // Collapse animation
        Animated.parallel([
          Animated.timing(expandAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(newCaseOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(callbackOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(newCaseTranslateY, {
            toValue: 10,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(callbackTranslateY, {
            toValue: 10,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        return false; // ✅ state change here
      } else {
        // Expand animation
        Animated.parallel([
          Animated.timing(expandAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
          Animated.timing(newCaseOpacity, {
            toValue: 1,
            duration: 300,
            delay: 100,
            useNativeDriver: true,
          }),
          Animated.timing(callbackOpacity, {
            toValue: 1,
            duration: 300,
            delay: 150,
            useNativeDriver: true,
          }),
          Animated.timing(newCaseTranslateY, {
            toValue: 0,
            duration: 400,
            delay: 100,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.2)),
          }),
          Animated.timing(callbackTranslateY, {
            toValue: 0,
            duration: 400,
            delay: 150,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.2)),
          }),
        ]).start();

        return true; // ✅ state change here
      }
    });
  };

  const handleNewCase = () => {
    setOpenDialog(true);
    toggleExpand();
  };

  const StatBox = ({ number, label, backgroundColor, index, borderColor, borderWidth }) => {
    return (
      <View style={[
        styles.statBox, 
        { backgroundColor },
        borderColor && borderWidth && {
          borderColor,
          borderWidth
        }
      ]}>
        <Text style={[styles.statNumber, { color: theme.BLACK_GOLDEN }]}>
          {number}
        </Text>
        <Text style={[styles.statLabel, { color: theme.SECONDARY_TEXT }]}>
          {label}
        </Text>
      </View>
    );
  };

  const balCase = 30 - casetatus.totalCases;

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.SECONDARY_BG }]}>
        <InfiniteNavBar pageName="Support" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Support Dashboard Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleWithIcon}>
                <Text
                  style={[styles.sectionTitle, { color: theme.PRIMARY_TEXT }]}
                >
                  Tally Support Cases
                </Text>
              </View>
            </View>

            {/* Stats Boxes */}
            <View style={styles.statsContainer}>
              <StatBox
                number={casetatus.activeCase}
                label="Active Case"
                backgroundColor={isDarkMode ? "#000000" : "#E3F2FD"}
                index={0}
                borderColor={isDarkMode ? "#FFFFFF" : "#E3F2FD"}
                borderWidth={1}
              />

              <StatBox
                number={casetatus.ClosedCase}
                label="Closed Cases"
                backgroundColor={isDarkMode ? "#000000" : "#E8F5E9"}
                borderColor={isDarkMode ? "#FFFFFF" : "#E8F5E9"}
                index={1}
                borderWidth={1}
              />
              <StatBox
                number={balCase}
                label="Balance Case"
                backgroundColor={isDarkMode ? "#000000" : "#FFF8E1"}
                borderColor={isDarkMode ? "#FFFFFF" : "#FFF8E1"}
                index={2}
                borderWidth={1}
              />
              <StatBox
                number={30}
                label="Total Case"
                backgroundColor={isDarkMode ? "#000000" : "#F3E5F5"}
                borderColor={isDarkMode ? "#FFFFFF" : "#F3E5F5"}
                index={3}
                borderWidth={1}
              />
            </View>
          </View>

          {/* Case Dashboard (Table) Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleWithIcon}>
                <Text
                  style={[styles.sectionTitle, { color: theme.PRIMARY_TEXT }]}
                >
                  GENERATED CASES
                </Text>
              </View>

              {/* Expandable Button Container - KEPT AS IS FOR CLICK ANIMATION */}
              <View style={styles.expandableButtonContainer}>
                {/* Call Back Option */}
                <Animated.View
                  style={[
                    styles.expandableOption,
                    {
                      opacity: callbackOpacity,
                      transform: [
                        { translateY: callbackTranslateY },
                        { scale: expandAnim },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.expandableButton, styles.callbackOption]}
                    onPress={() => handleAction("call", "02041488999")}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="call" size={14} color="#FFFFFF" />
                    <Text style={styles.expandableButtonText}>Call Back</Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* New Case Option */}
                <Animated.View
                  style={[
                    styles.expandableOption,
                    {
                      opacity: newCaseOpacity,
                      transform: [
                        { translateY: newCaseTranslateY },
                        { scale: expandAnim },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.expandableButton, styles.newCaseOption]}
                    onPress={handleNewCase}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="document-text" size={14} color="#FFFFFF" />
                    <Text style={styles.expandableButtonText}>New Case</Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* Main Plus Button */}
                <TouchableOpacity
                  style={[
                    styles.mainPlusButton,
                    isExpanded && styles.mainPlusButtonExpanded,
                  ]}
                  onPress={toggleExpand}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: expandAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "45deg"],
                          }),
                        },
                      ],
                    }}
                  >
                    <Ionicons
                      name="add"
                      size={20}
                      color={isExpanded ? "#000000" : "#000000"}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Case Table Scrollable Container */}
            <View
              style={[
                styles.caseTable,
                {
                  backgroundColor: theme.CARD_BG,
                  borderColor: theme.BORDER_COLOR,
                },
              ]}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={styles.tableContentContainer}>
                  {/* Table Header */}
                  <View
                    style={[
                      styles.tableHeader,
                      {
                        backgroundColor: isDarkMode ? theme.LOGO_BG : theme.SECONDARY_BG,
                        borderBottomColor: theme.BORDER_COLOR,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tableHeaderText,
                        styles.colCaseNo,
                        { color: "#000000"},
                      ]}
                    >
                      Case No
                    </Text>
                    <Text
                      style={[
                        styles.tableHeaderText,
                        styles.colCaseDetails,
                       { color: "#000000"},
                      ]}
                    >
                      Details
                    </Text>
                    <Text
                      style={[
                        styles.tableHeaderText,
                        styles.colCaseStatus,
                        { color: "#000000"},
                      ]}
                    >
                      Status
                    </Text>
                  </View>
                  {/* Table Rows */}
                  {casesList.map((item) => {
                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.tableRow,
                          {
                            borderBottomColor: isDarkMode
                              ? "#333333"
                              : "#F1F5F9",
                          },
                        ]}
                      >
                        {/* Case No */}
                        <View
                          style={[
                            styles.tableCellCaseNoContainer,
                            styles.colCaseNo,
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableCellCaseNo,
                              {
                                backgroundColor: theme.ACCENT_BLUE + "20",
                                color: theme.ACCENT_BLUE,
                              },
                            ]}
                          >
                            {item.case_no}
                          </Text>
                        </View>

                        {/* Case Details (Title, Description) - STACKED */}
                        <View
                          style={[
                            styles.tableCellContent,
                            styles.colCaseDetails,
                            {
                              flexDirection: "column",
                              alignItems: "flex-start",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableCellTitle,
                              { color: theme.PRIMARY_TEXT },
                            ]}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={[
                              styles.tableCellDescription,
                              { color: theme.SECONDARY_TEXT },
                            ]}
                            numberOfLines={2}
                          >
                            {item.description}
                          </Text>
                        </View>

                        {/* Status */}
                        <View
                          style={[styles.colCaseStatus, { paddingRight: 16 }]}
                        >
                          <View
                            style={[
                              styles.statusBadge,
                              item.caseStatus === "Closed"
                                ? styles.statusClosed
                                : styles.statusActive,
                              item.caseStatus === "Closed"
                                ? {
                                    backgroundColor: isDarkMode
                                      ? "#0F5132"
                                      : "#D1FAE5",
                                  }
                                : {
                                    backgroundColor: isDarkMode
                                      ? "#ABE7B2"
                                      : "#ABE7B2",
                                  },
                            ]}
                          >
                            <View
                              style={[
                                styles.statusDot,
                                item.caseStatus === "Closed"
                                  ? styles.statusDotClosed
                                  : styles.statusDotActive,
                              ]}
                            />
                            <Text
                              style={[
                                styles.statusText,
                                item.casestatus === "Closed"
                                  ? {
                                      color: isDarkMode ? "#10B981" : "#065F46",
                                    }
                                  : {
                                      color: isDarkMode ? "#000000" : "#000000",
                                    },
                              ]}
                            >
                              {item.casestatus}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Support Hours */}
          <View style={styles.section}>
            <View style={styles.titleWithIcon}>
              <Text
                style={[styles.sectionTitle, { color: theme.PRIMARY_TEXT }]}
              >
                Support Hours
              </Text>
            </View>
            <View
              style={[
                styles.hoursCard,
                {
                  backgroundColor: theme.CARD_BG,
                  borderColor: theme.BORDER_COLOR,
                },
              ]}
            >
              {[
                { day: "Monday - Saturday", time: "10:00 AM - 7:00 PM" },
                { day: "Sunday", time: "Emergency Only" },
              ].map((hour, index) => (
                <View
                  key={index}
                  style={[
                    styles.hoursRow,
                    { borderBottomColor: isDarkMode ? "#333333" : "#F1F5F9" },
                  ]}
                >
                  <View style={styles.hoursDayContainer}>
                    <Ionicons
                      name={
                        index === 0
                          ? "briefcase"
                          : index === 1
                          ? "sunny"
                          : "moon"
                      }
                      size={16}
                      color={theme.SECONDARY_TEXT}
                    />
                    <Text
                      style={[styles.hoursDay, { color: theme.PRIMARY_TEXT }]}
                    >
                      {hour.day}
                    </Text>
                  </View>
                  <Text
                    style={[styles.hoursTime, { color: theme.SECONDARY_TEXT }]}
                  >
                    {hour.time}
                  </Text>
                </View>
              ))}
              <View
                style={[
                  styles.hoursNote,
                  {
                    backgroundColor: isDarkMode ? "#000000" : "#FFFBEB",
                    borderColor: isDarkMode ? "#EFE17C" : "#92400E",
                  },
                ]}
              >
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={"#EFE17C"}
                />
                <Text
                  style={[
                    styles.hoursNoteText,
                    { color: isDarkMode ? "#EFE17C" : "#92400E" },
                  ]}
                >
                  24/7 emergency support available for critical issues
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Contact Info */}
          <View
            style={[
              styles.contactInfo,
              {
                backgroundColor: theme.CARD_BG,
                borderColor: theme.BORDER_COLOR,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.contactItem}
              activeOpacity={0.7}
              onPress={() => handleAction("call", "02041488999")}
            >
              <View
                style={[
                  styles.contactIconContainer,
                  { backgroundColor: theme.ACCENT_BLUE },
                ]}
              >
                <Ionicons name="call" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text
                  style={[styles.contactLabel, { color: theme.SECONDARY_TEXT }]}
                >
                  Call Us
                </Text>
                <Text
                  style={[styles.contactValue, { color: theme.PRIMARY_TEXT }]}
                >
                  020 4148 8999
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.SECONDARY_TEXT}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              activeOpacity={0.7}
              onPress={() =>
                handleAction("email", "support@shraddhainfosystems.com")
              }
            >
              <View
                style={[
                  styles.contactIconContainer,
                  { backgroundColor: theme.ACCENT_PURPLE },
                ]}
              >
                <Ionicons name="mail" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text
                  style={[styles.contactLabel, { color: theme.SECONDARY_TEXT }]}
                >
                  Email Us
                </Text>
                <Text
                  style={[styles.contactValue, { color: theme.PRIMARY_TEXT }]}
                  numberOfLines={1}
                >
                  support@shraddhainfosystems.com
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.SECONDARY_TEXT}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>

      {/* New casess creation */}
      <Modal
        visible={openDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenDialog(false)}
      >
        <View style={styles.dialogOverlay}>
          <View
            style={[styles.dialogContainer, { backgroundColor: theme.CARD_BG }]}
          >
            <Text style={[styles.dialogTitle, { color: theme.PRIMARY_TEXT }]}>
              New Case!
            </Text>

            <Text
              style={[styles.dialogMessage, { color: theme.SECONDARY_TEXT }]}
            >
              Create New Case
            </Text>

            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.SECONDARY_BG,
                  borderColor: theme.BORDER_COLOR,
                  color: theme.PRIMARY_TEXT,
                },
              ]}
              onChangeText={(text) => handleDateChange("Casetitle", text)}
              value={NewData.Casetitle}
              placeholder="Case Title"
              placeholderTextColor={theme.TERTIARY_TEXT}
              autoCapitalize="none"
            />

            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.SECONDARY_BG,
                  borderColor: theme.BORDER_COLOR,
                  color: theme.PRIMARY_TEXT,
                },
              ]}
              placeholder="Case Description"
              placeholderTextColor={theme.TERTIARY_TEXT}
              multiline
              value={NewData.CaseDesc}
              onChangeText={(text) => handleDateChange("CaseDesc", text)}
            />

            {/* ✅ Buttons Row */}
            <View style={styles.buttonRow}>
              {/* Close Button - LEFT */}
              <TouchableOpacity
                style={[styles.closeButton, styles.halfButton]}
                activeOpacity={0.8}
                onPress={() => setOpenDialog(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              {/* Save Button - RIGHT */}
              <TouchableOpacity
                style={[styles.saveButton, styles.halfButton]}
                activeOpacity={0.8}
                onPress={handleSaveCase}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#3498DB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF9E6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#B09246",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 16,
  },
  headerIconGlow: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFEAA7",
    opacity: 0.4,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: 0.5,
    textAlign: "left",
  },
  headerSubtitle: {
    fontSize: 15,
    textAlign: "left",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginLeft: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 28,
    fontWeight: "500",
  },
  // Expandable Button Styles (kept for click animation)
  expandableButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  expandableOption: {
    position: "absolute",
    right: 40,
    zIndex: 1,
  },
  expandableButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
    justifyContent: "center",
  },
  newCaseOption: {
    backgroundColor: "#2ECC71",
    right: 8,
  },
  callbackOption: {
    backgroundColor: "#3498DB",
    right: 120,
  },
  expandableButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  mainPlusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2ECC71",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2ECC71",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  mainPlusButtonExpanded: {
    backgroundColor: "#2ECC71",
    // borderWidth: 2,
    // borderColor: "#27AE60",
  },
  
  // Stats Section Styles
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    transform: [{ scale: 1 }],
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  // Case Table Styles
  caseTable: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableContentContainer: {
    minWidth: 480,
  },
  // Column width definitions for horizontal scroll
  colCaseNo: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  colCaseDetails: {
    width: 200,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  colCaseType: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  colCaseStatus: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
    transform: [{ scale: 1 }],
  },
  tableCellCaseNoContainer: {
    alignItems: "center",
  },
  tableCellCaseNo: {
    fontSize: 14,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tableCellContent: {
    // Overridden with {flexDirection: 'column', alignItems: 'flex-start'} in component
  },
  tableCellTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  tableCellDescription: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
    width:100,
  },
  // Case Type Column Styles
  tableCellCaseTypeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  caseTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "center",
  },
  typeTally: {
    borderWidth: 1,
  },
  typeInfinite: {
    borderWidth: 1,
  },
  caseTypeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  textTally: {
    color: "#3498DB",
  },
  textInfinite: {
    color: "#F39C12",
  },
  // Status Styles
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotClosed: {
    backgroundColor: "#10B981",
  },
  statusDotActive: {
    backgroundColor: "#EF4444",
  },
  statusClosed: {
    // Handled inline
  },
  statusActive: {
    // Handled inline
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  // Hours Card
  hoursCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  hoursDayContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hoursDay: {
    fontSize: 15,
    fontWeight: "600",
  },
  hoursTime: {
    fontSize: 15,
    fontWeight: "500",
  },
  hoursNote: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
  },
  hoursNoteText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  // Contact Info
  contactInfo: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 20,
  },
  //===================

  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  dialogContainer: {
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },

  dialogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  dialogMessage: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },

  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },

  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: "top",
  },

  /* ✅ Buttons Row */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  halfButton: {
    flex: 1,
  },

  /* ✅ Close Button (LEFT) */
  closeButton: {
    backgroundColor: "red",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },

  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* ✅ Save Button (RIGHT) */
  saveButton: {
    backgroundColor: "green",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },

  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
