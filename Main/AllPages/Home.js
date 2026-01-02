// Home.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
  useWindowDimensions,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getTheme } from "../../theme"; // Add this import
import { useTheme } from "../../ThemeContext"; // Add this import
import InfiniteNavBar from "./NavBar";

// Sample solutions data
const getSolutionColors = (theme) => [
  {
    id: 1,
    name: "TallyPrime Best Business Management Software",
    category: "Tally Core Product",
    icon: "business",
    description:
      "A **one-stop business management software** that caters to all your business requirements - from **accounting and invoicing** to **inventory management, insightful business reports, and cash flow management**, thereby improving business efficiency.",
    color: "#000000",
    url: "https://www.shraddhainfosystems.com/Products.html",
  },
  {
    id: 2,
    name: "Vtiger all-in-one CRM",
    category: "CRM / Sales & Marketing",
    icon: "people-circle",
    description:
      "Empowers you to align your **marketing, sales, and support** teams with **unified customer data** powered by **One View**. CRM made easy.",
    color: "#000000",
    url: "https://www.shraddhainfosystems.com/vtiger.html",
  },
  {
    id: 3,
    name: "Spine Technologies",
    category: "HR / Fixed Asset Management",
    icon: "server",
    description:
      "A leading software development company with over two decades of experience in **Human Resource and Fixed Asset Management**, offering modular solutions tailored to your organization's workflow.",
    color: "#000000",
    url: "https://www.shraddhainfosystems.com/Spine.html",
  },
  {
    id: 4,
    name: "Tally Software Services (TSS)",
    category: "Tally Subscription",
    icon: "sync-circle",
    description:
      "**A software subscription** that adds significant value to TallyPrime by providing latest technology and statutory updates, continuous upgrades, and **connectivity-driven features** like online branch data exchange, remote access, and seamless banking—helping your business perform better every day.",
    color: "#000000",
    url: "https://www.shraddhainfosystems.com/TallyPrimeTSS.html",
  },
  {
    id: 5,
    name: "Tally Prime Server",
    category: "Tally Enterprise Class",
    icon: "flash",
    description:
      "Offers **powerful data server** capabilities beyond the Gold license. This **server-based architecture** enables higher concurrency, secure data access, and advanced monitoring—making TallyPrime Server an **enterprise-class solution** for fast-growing businesses.",
    color: "#000000",
    url: "https://www.shraddhainfosystems.com/TallyPrimeServer.html",
  },
];

const handleExplorePress = (url) => {
  if (url) {
    Linking.openURL(url);
  } else {
    console.log("No URL provided for this solution");
  }
};

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(height > width);
  const { isDarkMode } = useTheme(); // Get theme state from context
  const theme = getTheme(isDarkMode); // Get theme colors based on mode
  const solutions = getSolutionColors(theme);

  // Responsive breakpoints
  const isExtraSmallScreen = width < 375; // iPhone SE, small Android
  const isSmallMobile = width >= 375 && width < 414; // iPhone 12/13, etc.
  const isMediumMobile = width >= 414 && width < 768; // Larger phones
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  useEffect(() => {
    setIsLargeScreen(width > 768);
    setIsSmallScreen(width < 375);
    setIsPortrait(height > width);
  }, [width, height]);

  const handleContactPress = () => {
    Linking.openURL("mailto:sales@shraddhainfosystems.com");
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:02041488999");
  };

  const handleSolutionPress = (solutionId) => {
    const solution = solutions.find((s) => s.id === solutionId);
    if (solution && solution.url) {
      Linking.openURL(solution.url);
    } else {
      console.log(`No URL found for solution ${solutionId}`);
    }
  };

  const renderVisionMissionValueBox = (icon, title, subtitle, text) => (
    <View
      style={[
        styles.box,
        isSmallScreen && styles.boxSmall,
        isMediumMobile && styles.boxMedium,
        {
          backgroundColor: theme.CARD_BG,
          borderColor: theme.BORDER_COLOR,
          shadowColor: theme.SHADOW_COLOR,
        },
      ]}
    >
      <View
        style={[
          styles.boxIconContainer,
          isSmallScreen && styles.boxIconContainerSmall,
          isMediumMobile && styles.boxIconContainerMedium,
          { backgroundColor: theme.ACCENT_RED + "15" },
        ]}
      >
        <Ionicons
          name={icon}
          size={isSmallScreen ? 24 : isMediumMobile ? 28 : 32}
          color={theme.ACCENT_RED}
        />
      </View>
      <Text
        style={[
          styles.boxTitle,
          isSmallScreen && styles.boxTitleSmall,
          isMediumMobile && styles.boxTitleMedium,
          { color: theme.PRIMARY_COLOR },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.boxSubtitle,
          isSmallScreen && styles.boxSubtitleSmall,
          isMediumMobile && styles.boxSubtitleMedium,
          { color: theme.ACCENT_YELLOW },
        ]}
      >
        {subtitle}
      </Text>
      <View
        style={[
          styles.boxDivider,
          isSmallScreen && styles.boxDividerSmall,
          { backgroundColor: theme.ACCENT_YELLOW },
        ]}
      />
      <Text
        style={[
          styles.boxText,
          isSmallScreen && styles.boxTextSmall,
          isMediumMobile && styles.boxTextMedium,
          { color: theme.SECONDARY_TEXT },
        ]}
      >
        {text}
      </Text>
    </View>
  );

  const renderServicePoint = (icon, point) => (
    <View style={styles.servicePointContainer}>
      <View
        style={[
          styles.servicePointIcon,
          { backgroundColor: theme.ACCENT_YELLOW + "15" },
        ]}
      >
        <Ionicons name={icon} size={16} color={theme.ACCENT_YELLOW} />
      </View>
      <Text style={[styles.servicePointText, { color: theme.SECONDARY_TEXT }]}>
        {point}
      </Text>
    </View>
  );

  const renderSolutionCard = (solution) => (
    <Pressable
      key={solution.id}
      style={({ pressed }) => [
        styles.solutionCard,
        isLargeScreen && styles.solutionCardLarge,
        isSmallScreen && styles.solutionCardSmall,
        isMediumMobile && styles.solutionCardMedium,
        isTablet && styles.solutionCardTablet,
        {
          borderTopColor: theme.BLACK_GOLDEN,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          backgroundColor: theme.CARD_BG,
          borderColor: theme.BORDER_COLOR,
          shadowColor: theme.SHADOW_COLOR,
        },
      ]}
      onPress={() => handleExplorePress(solution.url)}
    >
      <View
        style={[
          styles.solutionHeader,
          isSmallScreen && styles.solutionHeaderSmall,
          isMediumMobile && styles.solutionHeaderMedium,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            isSmallScreen && styles.iconContainerSmall,
            isMediumMobile && styles.iconContainerMedium,
            { backgroundColor: "#EFE17C" },
          ]}
        >
          <Ionicons
            name={solution.icon}
            size={isSmallScreen ? 24 : isMediumMobile ? 26 : 30}
            color={solution.color}
          />
        </View>
        <View
          style={[
            styles.solutionInfo,
            isSmallScreen && styles.solutionInfoSmall,
          ]}
        >
          <Text
            style={[
              styles.solutionName,
              isSmallScreen && styles.solutionNameSmall,
              isMediumMobile && styles.solutionNameMedium,
              { color: theme.PRIMARY_COLOR },
            ]}
          >
            {solution.name}
          </Text>
          <View
            style={[
              styles.categoryBadge,
              isSmallScreen && styles.categoryBadgeSmall,
              isMediumMobile && styles.categoryBadgeMedium,
              { backgroundColor: theme.SECONDARY_BG },
            ]}
          >
            <Ionicons
              name="pricetag-outline"
              size={isSmallScreen ? 10 : 12}
              color={theme.SECONDARY_TEXT}
            />
            <Text
              style={[
                styles.categoryText,
                isSmallScreen && styles.categoryTextSmall,
                isMediumMobile && styles.categoryTextMedium,
                { color: theme.SECONDARY_TEXT },
              ]}
            >
              {solution.category}
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.solutionDescription,
          isSmallScreen && styles.solutionDescriptionSmall,
          isMediumMobile && styles.solutionDescriptionMedium,
          { color: theme.SECONDARY_TEXT },
        ]}
      >
        {solution.description.split("**").map((text, index) => {
          if (index % 2 === 1) {
            return (
              <Text
                key={index}
                style={[
                  styles.descriptionBold,
                  isSmallScreen && styles.descriptionBoldSmall,
                  { color: theme.PRIMARY_COLOR },
                ]}
              >
                {text}
              </Text>
            );
          }
          return text;
        })}
      </Text>

      <View
        style={[
          styles.solutionFooter,
          isSmallScreen && styles.solutionFooterSmall,
          isMediumMobile && styles.solutionFooterMedium,
          {
            borderTopColor: theme.BORDER_COLOR,
            justifyContent: "flex-end",
          },
        ]}
      >
        <Pressable
          onPress={() => handleExplorePress(solution.url)}
          style={({ pressed }) => [
            styles.ctaContainer,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text
            style={[
              styles.ctaText,
              isSmallScreen && styles.ctaTextSmall,
              isMediumMobile && styles.ctaTextMedium,
              { color: theme.ACCENT_YELLOW },
            ]}
          >
            Explore
          </Text>
          <View
            style={[
              styles.arrowCircle,
              isSmallScreen && styles.arrowCircleSmall,
              isMediumMobile && styles.arrowCircleMedium,
              { backgroundColor: theme.ACCENT_YELLOW },
            ]}
          >
            <Ionicons
              name="arrow-forward"
              size={isSmallScreen ? 14 : 16}
              color={theme.CARD_BG}
            />
          </View>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.SECONDARY_BG }]}>
      {/* Top Bar */}
      <InfiniteNavBar pageName="Home" />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        {/* Hero Section */}
        <View style={styles.heroContent}>
          <View style={styles.rowTitle}>
            <Text
              style={[
                styles.heroTitle,
                styles.heroHighlight,
                { color: theme.ACCENT_RED },
              ]}
            >
              25 Years
            </Text>
            <Text style={[styles.heroTitle, { color: theme.PRIMARY_COLOR }]}>
              {" "}
              of legacy
            </Text>
          </View>

          <Text
            style={[
              styles.heroSubtitle,
              isSmallScreen && styles.heroSubtitleSmall,
              isMediumMobile && styles.heroSubtitleMedium,
              isTablet && styles.heroSubtitleTablet,
              { color: theme.PRIMARY_COLOR },
            ]}
          >
            Shraddha family is always committed to deliver the best.
          </Text>
        </View>

        {/* About Section */}
        <View
          style={[
            styles.aboutContainer,
            isSmallScreen && styles.aboutContainerSmall,
            isMediumMobile && styles.aboutContainerMedium,
            isTablet && styles.aboutContainerTablet,
            { backgroundColor: theme.SECONDARY_BG },
          ]}
        >
          <View
            style={[
              styles.aboutContent,
              isSmallScreen && styles.aboutContentSmall,
              isMediumMobile && styles.aboutContentMedium,
            ]}
          >
            <View
              style={[
                styles.aboutTextContainer,
                isSmallScreen && styles.aboutTextContainerSmall,
              ]}
            >
              <Text
                style={[
                  styles.aboutDescription,
                  isSmallScreen && styles.aboutDescriptionSmall,
                  isMediumMobile && styles.aboutDescriptionMedium,
                  isTablet && styles.aboutDescriptionTablet,
                  { color: theme.SECONDARY_TEXT },
                ]}
              >
                Shraddha Infosystems is a premier technology partner dedicated
                to empowering enterprises with cutting-edge, AI-powered business
                solutions. With a distinguished legacy of over 25 years, we
                stand as the No. 1 Tally Partner in India and an awarded leader
                in AI & Marketing Technologies. We bridge the gap between
                traditional business reliability and future-ready innovation.
              </Text>
            </View>
          </View>

          {/* Services Points Section */}
          <View
            style={[
              styles.servicesContainer,
              isSmallScreen && styles.servicesContainerSmall,
              isMediumMobile && styles.servicesContainerMedium,
              isTablet && styles.servicesContainerTablet,
              {
                backgroundColor: theme.CARD_BG,
                borderColor: theme.BORDER_COLOR,
              },
            ]}
          >
            <View style={styles.servicesHeader}>
              <Text
                style={[styles.servicesTitle, { color: theme.PRIMARY_COLOR }]}
              >
                Located in Pune, Maharashtra, we offer a comprehensive suite of
                services designed to streamline operations and drive digital
                transformation:
              </Text>
            </View>

            <View style={styles.servicesPoints}>
              {renderServicePoint(
                "analytics",
                "ERP & Financial Excellence: As a solution provider for Oracle NetSuite and Tally Prime, we specialize in full-scale ERP Implementation and Clear Tax solutions."
              )}

              {renderServicePoint(
                "robot",
                "AI & Automation: We lead the curve with AI Automation, Custom AI Bot Training, and Agentic Reporting to modernize your workflows."
              )}

              {renderServicePoint(
                "people",
                "Customer & HR Management: We optimize your relationships and workforce through CRM Implementation, Sales & Marketing Automation, and HRMS Implementation using Spine HR Suite."
              )}

              {renderServicePoint(
                "link",
                "Operational Integration: Our technical expertise extends to Supply Chain Visibility, complex Integration & Synchronization, and bespoke Customisation."
              )}

              {renderServicePoint(
                "school",
                "Education & Support: Committed to knowledge sharing, our academy has trained over 10,000+ students via our Training and Placement programs, backed by dedicated Support and AMC services."
              )}
            </View>
          </View>

          {/* Our Pillars Section */}
          <View
            style={[
              styles.pillarsHeader,
              isSmallScreen && styles.pillarsHeaderSmall,
              isMediumMobile && styles.pillarsHeaderMedium,
            ]}
          >
            <Text
              style={[
                styles.pillarsTitle,
                isSmallScreen && styles.pillarsTitleSmall,
                isMediumMobile && styles.pillarsTitleMedium,
                isTablet && styles.pillarsTitleTablet,
                { color: theme.PRIMARY_COLOR },
              ]}
            >
              Our Pillars
            </Text>
            <Text
              style={[
                styles.pillarsSubtitle,
                isSmallScreen && styles.pillarsSubtitleSmall,
                isMediumMobile && styles.pillarsSubtitleMedium,
                { color: theme.ACCENT_YELLOW },
              ]}
            >
              Foundation of excellence
            </Text>
          </View>

          <View
            style={[
              isLargeScreen
                ? styles.boxesContainerLarge
                : styles.boxesContainer,
              isSmallScreen && styles.boxesContainerSmall,
              isMediumMobile && styles.boxesContainerMedium,
              isTablet && styles.boxesContainerTablet,
            ]}
          >
            {renderVisionMissionValueBox(
              "star",
              "VISION",
              "Leaders in the IT Services Globally",
              "To be a global leader in innovative IT services and software solutions that empower businesses to thrive."
            )}
            {renderVisionMissionValueBox(
              "rocket",
              "MISSION",
              "Producing Revolution",
              "To revolutionize business management through innovative, top-tier solutions that empower professionals at every stage to grow and succeed."
            )}
            {renderVisionMissionValueBox(
              "heart",
              "VALUES",
              "Rooted in Faith",
              "Rooted in faith, we lead with integrity and trust, delivering exceptional IT services and software solutions that empower businesses."
            )}
          </View>
        </View>

        {/* Solutions Section */}
        <View
          style={[
            styles.solutionsSection,
            isSmallScreen && styles.solutionsSectionSmall,
            isMediumMobile && styles.solutionsSectionMedium,
            { backgroundColor: theme.SECONDARY_BG },
          ]}
        >
          <View
            style={[
              styles.titleContainer,
              isSmallScreen && styles.titleContainerSmall,
              isMediumMobile && styles.titleContainerMedium,
            ]}
          >
            <View
              style={[
                styles.sectionHeader,
                isSmallScreen && styles.sectionHeaderSmall,
              ]}
            >
              <Text
                style={[
                  styles.sectionHeading,
                  isSmallScreen && styles.sectionHeadingSmall,
                  isMediumMobile && styles.sectionHeadingMedium,
                  isTablet && styles.sectionHeadingTablet,
                  { color: theme.ACCENT_YELLOW },
                ]}
              >
                Our Business Solutions
              </Text>
              <View
                style={[
                  styles.rocketIcon,
                  isSmallScreen && styles.rocketIconSmall,
                  isMediumMobile && styles.rocketIconMedium,
                  { backgroundColor: theme.ACCENT_YELLOW + "15" },
                ]}
              >
                <Ionicons
                  name="rocket-outline"
                  size={isSmallScreen ? 20 : isMediumMobile ? 24 : 28}
                  color={theme.ACCENT_YELLOW}
                />
              </View>
            </View>
            <Text
              style={[
                styles.pageDescription,
                isSmallScreen && styles.pageDescriptionSmall,
                isMediumMobile && styles.pageDescriptionMedium,
                isTablet && styles.pageDescriptionTablet,
                { color: theme.PRIMARY_COLOR },
              ]}
            >
              Enterprise and specialized software solutions for comprehensive
              business management
            </Text>
          </View>

          <View
            style={[
              isLargeScreen ? styles.solutionsGridLarge : styles.solutionsGrid,
              isSmallScreen && styles.solutionsGridSmall,
              isMediumMobile && styles.solutionsGridMedium,
              isTablet && styles.solutionsGridTablet,
            ]}
          >
            {solutions.map(renderSolutionCard)}
          </View>
        </View>

        {/* Bottom Spacer */}
        <View
          style={[
            styles.bottomSpacer,
            isSmallScreen && styles.bottomSpacerSmall,
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },

  // --- Topbar Styles ---
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
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
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },

  // --- Hero Section ---
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  rowTitle: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignSelf: "center",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 44,
    marginBottom: 12,
  },
  heroTitleSmall: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 8,
  },
  heroTitleMedium: {
    fontSize: 32,
    lineHeight: 40,
  },
  heroTitleTablet: {
    fontSize: 44,
    lineHeight: 52,
  },
  heroHighlight: {
    fontSize: 34,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 500,
    paddingHorizontal: 10,
  },
  heroSubtitleSmall: {
    fontSize: 14,
    paddingHorizontal: 8,
    lineHeight: 20,
  },
  heroSubtitleMedium: {
    fontSize: 16,
  },
  heroSubtitleTablet: {
    fontSize: 20,
  },

  // --- Services Section ---
  servicesContainer: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    marginBottom: 40,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  servicesContainerSmall: {
    padding: 16,
    marginBottom: 30,
    borderRadius: 16,

  },
  servicesContainerMedium: {
    marginBottom: 35,
  },
  servicesContainerTablet: {
    padding: 28,
    marginBottom: 40,
  },
  servicesHeader: {
    marginBottom: 20,

  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
  },
  _servicesPoints: {
    gap: 16,
    // height:700
  },
  get servicesPoints() {
    return this._servicesPoints;
  },
  set servicesPoints(value) {
    this._servicesPoints = value;
  },
  servicePointContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 2,
  },
  servicePointIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  servicePointText: {
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
    height:120
  },

  // --- About Us Section Styles ---
  aboutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  aboutContainerSmall: {
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  aboutContainerMedium: {
    paddingHorizontal: 24,
    paddingVertical: 35,
  },
  aboutContainerTablet: {
    paddingHorizontal: 32,
    paddingVertical: 45,
  },
  aboutContent: {
    flexDirection: "column",
    marginBottom: 40,
    alignItems: "center",
  },
  aboutContentSmall: {
    marginBottom: 30,
  },
  aboutContentMedium: {
    marginBottom: 35,
  },
  aboutTextContainer: {
    flex: 1,
    marginRight: 0,
  },
  aboutTextContainerSmall: {
    marginBottom: 20,
  },
  aboutDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
  aboutDescriptionSmall: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "left",
  },
  aboutDescriptionMedium: {
    fontSize: 15,
    lineHeight: 24,
  },
  aboutDescriptionTablet: {
    fontSize: 17,
    lineHeight: 28,
  },
  logoParagraphContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    marginTop: 20,
  },
  logoParagraphContainerTablet: {
    padding: 30,
  },
  paragraphLogo: {
    width: 150,
    height: 150,
    opacity: 0.9,
  },
  paragraphLogoTablet: {
    width: 180,
    height: 180,
  },

  // --- Pillars Section ---
  pillarsHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  pillarsHeaderSmall: {
    marginBottom: 20,
  },
  pillarsHeaderMedium: {
    marginBottom: 25,
  },
  pillarsTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  pillarsTitleSmall: {
    fontSize: 26,
    marginBottom: 6,
  },
  pillarsTitleMedium: {
    fontSize: 28,
  },
  pillarsTitleTablet: {
    fontSize: 36,
  },
  pillarsSubtitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  pillarsSubtitleSmall: {
    fontSize: 14,
  },
  pillarsSubtitleMedium: {
    fontSize: 15,
  },

  // Vision/Mission/Values Boxes
  boxesContainer: {
    flexDirection: "column",
    gap: 20,
  },
  boxesContainerSmall: {
    gap: 16,
  },
  boxesContainerMedium: {
    gap: 18,
  },
  boxesContainerLarge: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  boxesContainerTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  box: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: "100%",
  },
  boxSmall: {
    padding: 20,
    borderRadius: 16,
  },
  boxMedium: {
    padding: 22,
  },
  boxIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  boxIconContainerSmall: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  boxIconContainerMedium: {
    width: 65,
    height: 65,
    marginBottom: 18,
  },
  boxTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  boxTitleSmall: {
    fontSize: 20,
    marginBottom: 6,
  },
  boxTitleMedium: {
    fontSize: 22,
  },
  boxSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  boxSubtitleSmall: {
    fontSize: 14,
    marginBottom: 12,
  },
  boxSubtitleMedium: {
    fontSize: 15,
    marginBottom: 14,
  },
  boxDivider: {
    width: 40,
    height: 3,
    marginBottom: 20,
    borderRadius: 2,
  },
  boxDividerSmall: {
    width: 30,
    marginBottom: 16,
  },
  boxText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
  },
  boxTextSmall: {
    fontSize: 13,
    lineHeight: 22,
  },
  boxTextMedium: {
    fontSize: 14,
    lineHeight: 23,
  },

  // --- Solutions Section ---
  solutionsSection: {
    paddingTop: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  solutionsSectionSmall: {
    paddingTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  solutionsSectionMedium: {
    paddingTop: 35,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  sectionHeaderSmall: {
    marginBottom: 6,
  },
  rocketIcon: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  rocketIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  rocketIconMedium: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 10,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  titleContainerSmall: {
    paddingHorizontal: 16,
    paddingBottom: 25,
  },
  titleContainerMedium: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  sectionHeading: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  sectionHeadingSmall: {
    fontSize: 26,
  },
  sectionHeadingMedium: {
    fontSize: 28,
  },
  sectionHeadingTablet: {
    fontSize: 36,
  },
  pageDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 600,
    paddingHorizontal: 10,
  },
  pageDescriptionSmall: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  pageDescriptionMedium: {
    fontSize: 15,
  },
  pageDescriptionTablet: {
    fontSize: 17,
  },
  solutionsGrid: {
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  solutionsGridSmall: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  solutionsGridMedium: {
    paddingHorizontal: 24,
    paddingBottom: 35,
  },
  solutionsGridLarge: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 40,
    gap: 24,
  },
  solutionsGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 20,
  },
  solutionCard: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderTopWidth: 4,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  solutionCardSmall: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderTopWidth: 3,
  },
  solutionCardMedium: {
    padding: 18,
    marginBottom: 18,
  },
  solutionCardLarge: {
    width: "48%",
    marginBottom: 0,
  },
  solutionCardTablet: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
  },
  solutionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  solutionHeaderSmall: {
    marginBottom: 12,
  },
  solutionHeaderMedium: {
    marginBottom: 14,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconContainerSmall: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  iconContainerMedium: {
    width: 55,
    height: 55,
    borderRadius: 14,
    marginRight: 14,
  },
  solutionInfo: {
    flex: 1,
  },
  solutionInfoSmall: {
    flex: 1,
  },
  solutionName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  solutionNameSmall: {
    fontSize: 18,
    marginBottom: 4,
  },
  solutionNameMedium: {
    fontSize: 20,
    marginBottom: 5,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  categoryBadgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  categoryBadgeMedium: {
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  categoryText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "600",
  },
  categoryTextSmall: {
    fontSize: 11,
    marginLeft: 4,
  },
  categoryTextMedium: {
    fontSize: 12,
  },
  solutionDescription: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  solutionDescriptionSmall: {
    fontSize: 13,
    lineHeight: 22,
    marginBottom: 16,
  },
  solutionDescriptionMedium: {
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 18,
  },
  descriptionBold: {
    fontWeight: "700",
  },
  descriptionBoldSmall: {
    fontWeight: "700",
  },
  solutionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
  },
  solutionFooterSmall: {
    paddingTop: 12,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
  },
  solutionFooterMedium: {
    paddingTop: 14,
  },
  buttonContainer: {
    flex: 1,
  },
  buttonContainerSmall: {
    width: "100%",
  },
  buttonBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  buttonBadgeSmall: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  buttonBadgeMedium: {
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonTextBadge: {
    fontSize: 14,
    fontWeight: "700",
  },
  buttonTextBadgeSmall: {
    fontSize: 12,
  },
  buttonTextBadgeMedium: {
    fontSize: 13,
  },
  ctaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctaContainerSmall: {
    alignSelf: "flex-end",
  },
  ctaText: {
    fontSize: 15,
    fontWeight: "700",
    marginRight: 8,
  },
  ctaTextSmall: {
    fontSize: 13,
    marginRight: 6,
  },
  ctaTextMedium: {
    fontSize: 14,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  arrowCircleMedium: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  // --- Bottom Spacer ---
  bottomSpacer: {
    height: 40,
  },
  bottomSpacerSmall: {
    height: 30,
  },
});
