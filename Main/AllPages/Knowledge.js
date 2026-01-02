import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import InfiniteNavBar from "./NavBar";
import { API_URL } from "@env";
import { Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getTheme } from "../../theme"; // Import the getTheme function
import { useTheme } from "../../ThemeContext"; // Import the ThemeContext

export default function Knowledge() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Events");
  const [eventList, setEventList] = useState([]);

  // Use the ThemeContext to get dark mode state
  const { isDarkMode } = useTheme();

  // Get the current theme based on dark mode state
  const theme = getTheme(isDarkMode);

  // get Event Details handler
  const eventData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const eventResponse = await axios.post(
        `${API_URL}/display/eventList`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // console.log("Events : ", eventResponse.data.rows);
      setEventList(eventResponse.data.rows);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  useEffect(() => {
    eventData();
  }, []);

  const renderEventsContent = () => (
    <>
      {/* Events List */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.PRIMARY_TEXT }]}>
              Upcoming Events
            </Text>
            <Text
              style={[styles.sectionSubtitle, { color: theme.SECONDARY_TEXT }]}
            >
              {eventList.length} events available
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.cardsContainer,
            isLargeScreen && styles.cardsContainerLarge,
          ]}
        >
          {eventList.map((event) => (
            <Pressable
              key={event.event_Id}
              onPress={() => {}}
              style={({ pressed }) => [
                styles.newEventCard,
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.995 : 1 }],
                  backgroundColor: theme.CARD_BG,
                  borderColor: theme.BORDER_COLOR,
                  shadowColor: theme.SHADOW_COLOR,
                },
              ]}
            >
              {/* Event Title */}
              <View style={styles.newEventHeader}>
                <Text
                  style={[
                    styles.newEventCardTitle,
                    { color: theme.PRIMARY_TEXT },
                  ]}
                >
                  {event.event_Name}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.BLACK_GOLDEN}
                />
              </View>

              {/* Event Description Paragraph */}
              <View style={styles.descriptionContainer}>
                <Text
                  style={[
                    styles.descriptionText,
                    { color: theme.SECONDARY_TEXT },
                  ]}
                >
                  {event.event_Agenda}
                </Text>
              </View>

              {/* Event Details */}
              <View
                style={[
                  styles.newEventDetails,
                  { backgroundColor: theme.SECONDARY_BG },
                ]}
              >
                <View style={styles.newEventDetailRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={theme.SECONDARY_TEXT}
                  />
                  <Text
                    style={[
                      styles.newEventDetailText,
                      { color: theme.SECONDARY_TEXT },
                    ]}
                  >
                    {event.event_StartDay}
                  </Text>
                </View>
                <View style={styles.newEventDetailRow}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={theme.SECONDARY_TEXT}
                  />
                  <Text
                    style={[
                      styles.newEventDetailText,
                      { color: theme.SECONDARY_TEXT },
                    ]}
                  >
                    {event.event_StartTime}
                  </Text>
                </View>
                <View style={styles.newEventDetailRow}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={theme.SECONDARY_TEXT}
                  />
                  <Text
                    style={[
                      styles.newEventDetailText,
                      { color: theme.SECONDARY_TEXT },
                    ]}
                  >
                    {event.event_Location}
                  </Text>
                </View>
              </View>

              {/* Join Now Button */}
              <Pressable
                style={[
                  styles.joinNowButton,
                  { backgroundColor: "#EFE17C" },
                ]}
                onPress={() => Linking.openURL(event.event_RegLink)}
              >
                <Text
                  style={[
                    styles.joinNowButtonText,
                    { color:"#000000" },
                  ]}
                >
                  REGISTER NOW
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#000000"
                />
              </Pressable>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.SECONDARY_BG }]}>
      <InfiniteNavBar pageName="Knowledge" />

      {/* Tabs - Only Events tab remains */}
      <View
        style={[
          styles.tabsContainer,
          {
            backgroundColor: theme.CARD_BG,
            borderBottomColor: theme.BORDER_COLOR,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {["Events"].map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                {
                  backgroundColor: theme.SECONDARY_BG,
                  marginRight: 12,
                },
                activeTab === tab && { backgroundColor: "#EFE17C" },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <View
                style={[
                  styles.tabIconContainer,
                  { backgroundColor: theme.CARD_BG },
                  activeTab === tab && styles.activeTabIconContainer,
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#000000"
                  backgroundColor="#EFE17C"
                />
              </View>
              <Text
                style={[
                  styles.tabText,
                  { color: theme.CARD_BG },
                  activeTab === tab && { color: "#000000" },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Dynamic Content - Only Events */}
        {activeTab === "Events" && renderEventsContent()}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    borderBottomWidth: 1,
  },
  tabsScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#B09246",
  },
  tabIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  activeTabIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  cardsContainer: {
    gap: 16,
  },
  cardsContainerLarge: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  // New Event Card Styles
  newEventCard: {
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
    padding: 16,
  },
  newEventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  newEventCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginRight: 12,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  newEventDetails: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  newEventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  newEventDetailText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  joinNowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  joinNowButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomSpacer: {
    height: 80,
  },
});
