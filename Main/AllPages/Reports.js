// Reports.js - Enhanced Version
import React, { useState, useEffect, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';




import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  FlatList,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';

// Theme Imports  
import { getTheme } from '../../theme';
import { useTheme } from '../../ThemeContext';
import InfiniteNavBar from './NavBar';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth } = Dimensions.get('window');


//  const API_URL = "http://164.52.223.12:3000/reports/ledOutstanding";

const API_URL = "http://localhost:3000/reports/ledOutstanding";


// const API_URL = "https://api.shraddhainfinitesolutions.com/reports/ledOutstanding";




/* ----------------------- COMPONENT ----------------------- */
export default function Reports() {
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);

  // Define dynamic colors based on theme
  const COLORS = {
    primary: '#6366F1',
    secondary: '#10B981',
    background: theme.BACKGROUND || '#F8FAFC',
    card: theme.CARD_BG || '#FFFFFF',
    textDark: theme.PRIMARY_TEXT || '#0F172A',
    textMedium: theme.SECONDARY_TEXT || '#334155',
    textLight: theme.SECONDARY_TEXT || '#94A3B8',
    border: theme.BORDER_COLOR || '#E2E8F0',
    accentLine: theme.ACCENT_RED || '#818CF8',
    chartGradientFrom: isDarkMode ? '#4338CA' : '#6366F1',
    chartGradientTo: isDarkMode ? '#6366F1' : '#818CF8',
    shadow: theme.SHADOW_COLOR || '#000',
    segmentBg: isDarkMode ? '#334155' : '#E2E8F0',
    gmail: '#EA4335',
    whatsapp: '#25D366',
    iconHover: isDarkMode ? '#4B5563' : '#F3F4F6',
  };

  const [viewType, setViewType] = useState('graph');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [error, setError] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  /* ----------------------- OPEN GMAIL COMPOSE ----------------------- */
  const openGmailCompose = (email) => {
    if (!email) {
      Alert.alert('No Email', 'This ledger does not have an email address.');
      return;
    }

    const subject = 'Regarding Outstanding Amount';
    const body = `Dear Sir/Madam,\n\nI would like to discuss the outstanding amount.\n\nBest regards,`;
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(err => {
      console.error('Failed to open email client:', err);
      Alert.alert('Error', 'Could not open email client. Please check your email configuration.');
    });
  };

  const openWhatsApp = (mobileNo) => {
    if (!mobileNo) {
      return;
    }

    try {
      // Clean the mobile number - remove any non-digit characters
      const cleanNumber = mobileNo.replace(/\D/g, '');

      // Check if the number has a country code, if not assume it's an Indian number (+91)
      let formattedNumber = cleanNumber;
      if (!cleanNumber.startsWith('+') && !cleanNumber.startsWith('91')) {
        formattedNumber = `91${cleanNumber}`;
      }

      // Remove any leading zeros if present after country code
      formattedNumber = formattedNumber.replace(/^(\+?91)0+/, '$1');

      // Create WhatsApp URL with pre-filled message
      const message = 'Hello, I would like to discuss the outstanding amount.';
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp
      Linking.openURL(whatsappUrl).catch(err => {
        console.error('Failed to open WhatsApp:', err);
        const alternativeUrl = `whatsapp://send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
        Linking.openURL(alternativeUrl).catch(err2 => {
          console.error('Failed to open WhatsApp with alternative URL:', err2);
        });
      });

    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  /* ----------------------- FETCH DATA FROM API ----------------------- */
  const fetchDataFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // --- TEMPORARILY COMMENTED OUT API CALL ---
      /*
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Authentication Error', 'Please login again.');
        setLoading(false);
        return;
      }

      // Create API body with hardcoded company id
      const APIbody = {
        cmpid: "16eda8a4-9a3c-4302-b0e9-9b6bf0024367",
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(APIbody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result && result.ledger_outstanding) {
        // Transform API data to match your existing structure
        const transformedData = result.ledger_outstanding.map((item, index) => ({
          id: String(index + 1),
          ledgerName: item.ledger_name || 'Unknown Ledger',
          closingAmount: String(item.led_Closing || '0'),
          date: new Date().toISOString().split('T')[0],
          mobileNo: item.mobileNo || '',
          email: item.email || ''
        }));

        setOriginalData(transformedData);
        setFilteredData(transformedData);
        return transformedData;
      } else {
        setOriginalData([]);
        setFilteredData([]);
        return [];
      }
      */
      // --- END OF COMMENTED API CALL ---

      // --- HARDCODED SAMPLE DATA FOR MOBILE TESTING ---
      const sampleData = [
        {
          id: '1',
          ledgerName: 'ABC Corporation Ltd',
          closingAmount: '1250000',
          date: '2024-01-15',
          mobileNo: '9876543210',
          email: 'accounts@abccorp.com'
        },
        {
          id: '2',
          ledgerName: 'XYZ Industries Pvt Ltd',
          closingAmount: '875000',
          date: '2024-01-15',
          mobileNo: '9876543211',
          email: 'finance@xyzind.com'
        },
        {
          id: '3',
          ledgerName: 'Global Trading Co',
          closingAmount: '1560000',
          date: '2024-01-15',
          mobileNo: '9876543212',
          email: 'billing@globaltrading.com'
        },
        {
          id: '4',
          ledgerName: 'Premium Suppliers',
          closingAmount: '625000',
          date: '2024-01-15',
          mobileNo: '9876543213',
          email: 'accounts@premiumsuppliers.in'
        },
        {
          id: '5',
          ledgerName: 'Metro Manufacturers',
          closingAmount: '2340000',
          date: '2024-01-15',
          mobileNo: '9876543214',
          email: 'finance@metro.com'
        },
        {
          id: '6',
          ledgerName: 'Tech Solutions Inc',
          closingAmount: '1890000',
          date: '2024-01-15',
          mobileNo: '9876543215',
          email: 'ar@techsolutions.com'
        },
        {
          id: '7',
          ledgerName: 'Urban Retailers',
          closingAmount: '745000',
          date: '2024-01-15',
          mobileNo: '9876543216',
          email: 'accounts@urbanretail.com'
        },
        {
          id: '8',
          ledgerName: 'Service Providers LLP',
          closingAmount: '925000',
          date: '2024-01-15',
          mobileNo: '9876543217',
          email: 'finance@serviceproviders.com'
        },
        {
          id: '9',
          ledgerName: 'Export Import Co',
          closingAmount: '3120000',
          date: '2024-01-15',
          mobileNo: '9876543218',
          email: ''
        },
        {
          id: '10',
          ledgerName: 'Local Distributors',
          closingAmount: '580000',
          date: '2024-01-15',
          mobileNo: '',
          email: 'accounts@localdist.com'
        },
        {
          id: '11',
          ledgerName: 'Heavy Machinery Ltd',
          closingAmount: '1895000',
          date: '2024-01-15',
          mobileNo: '9876543220',
          email: 'billing@heavymachinery.co'
        },
        {
          id: '12',
          ledgerName: 'Construction Materials',
          closingAmount: '2450000',
          date: '2024-01-15',
          mobileNo: '9876543221',
          email: 'finance@constmaterial.com'
        }
      ];

      // Simulate network delay for realistic testing
      await new Promise(resolve => setTimeout(resolve, 800));

      setOriginalData(sampleData);
      setFilteredData(sampleData);
      return sampleData;

    } catch (error) {
      console.error('Data Loading Error:', error);
      setError(error.message || 'Failed to fetch data');
      Alert.alert('Error', `Failed to load data: ${error.message || 'Unknown error'}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  /* ----------------------- LOAD DATA ON MOUNT AND DATE CHANGE ----------------------- */
  useEffect(() => {
    fetchDataFromAPI();
  }, [fetchDataFromAPI]);

  /* ----------------------- PULL TO REFRESH ----------------------- */
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchDataFromAPI();
    setRefreshing(false);
  }, [fetchDataFromAPI]);

  /* ----------------------- APPLY DATE FILTER ----------------------- */
  const applyDateFilter = () => {
    fetchDataFromAPI();
  };

  /* ----------------------- FILTER DATA ----------------------- */
  useEffect(() => {
    if (originalData.length > 0) {
      setFilteredData(originalData);
    }
  }, [originalData]);

  const toggleView = (type) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setViewType(type);
  };

  /* ----------------------- CSV DOWNLOAD (Save to Device Storage) ----------------------- */
  const downloadCSV = async () => {
    if (filteredData.length === 0) {
      Alert.alert('No Data', 'There is no data to export.');
      return;
    }

    setIsExporting(true);

    try {
      // Create CSV content
      let csvContent = 'ID,Ledger Name,Closing Amount (₹),Date,Mobile No,Email\n';

      filteredData.forEach(item => {
        const escapedName = item.ledgerName ? `"${item.ledgerName.replace(/"/g, '""')}"` : '""';
        csvContent += `${item.id},${escapedName},${item.closingAmount},${item.date},${item.mobileNo || 'N/A'},${item.email || 'N/A'}\n`;
      });

      // Create file name
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `Ledger_Report_${timestamp}.csv`;

      if (Platform.OS === 'web') {
        // Web download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        Alert.alert('Success', 'CSV file downloaded!');
      } else if (Platform.OS === 'android') {
        // For Android - Use Storage Access Framework (SAF)

        try {
          // Check if SAF is available (Android 5.0+)
          const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

          if (permissions.granted) {
            // Get the directory URI chosen by the user
            const directoryUri = permissions.directoryUri;

            // Create file in the chosen directory (this handles unique filenames automatically)
            const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
              directoryUri,
              fileName,
              'text/csv'
            );

            // Write data to the new file
            await FileSystem.writeAsStringAsync(newFileUri, csvContent, {
              encoding: 'utf8'
            });

            Alert.alert(
              '✅ File Saved',
              `CSV file saved successfully!`,
              [
                { text: 'OK' }
              ]
            );
          } else {
            // Permission denied or cancelled
            setIsExporting(false);
            return;
          }

        } catch (safError) {
          console.error('SAF Error:', safError);
          // Fallback: Share the file if SAF fails

          // Create temporary file
          const tempFileUri = `${FileSystem.documentDirectory}${fileName}`;
          await FileSystem.writeAsStringAsync(tempFileUri, csvContent, {
            encoding: 'utf8'
          });

          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(tempFileUri, {
              mimeType: 'text/csv',
              dialogTitle: 'Share CSV File'
            });
          } else {
            Alert.alert('Error', 'Could not save or share file.');
          }
        }
      } else {
        // For iOS - Save to Files app
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
          encoding: 'utf8'
        });

        // For iOS, we use share dialog with "Save to Files" option
        Alert.alert(
          '✅ Report Ready',
          `Your CSV file is ready. Please use "Save to Files" option to save it to your device.`,
          [
            {
              text: 'Save to Device',
              onPress: async () => {
                try {
                  await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/csv',
                    dialogTitle: 'Save to Files',
                    UTI: 'public.comma-separated-values-text'
                  });
                } catch (shareError) {
                  console.log('Share error:', shareError);
                  Alert.alert(
                    'File Saved',
                    `File saved to app storage:\n${fileName}`,
                    [{ text: 'OK' }]
                  );
                }
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      }

    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('❌ Export Failed', `Could not save file: ${error.message || 'Please try again.'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const totalAmount = filteredData.reduce((acc, curr) => acc + Number(curr.closingAmount || 0), 0);
  const maxAmount = filteredData.length > 0
    ? Math.max(...filteredData.map(i => Number(i.closingAmount || 0)))
    : 0;
  const avgAmount = filteredData.length > 0 ? totalAmount / filteredData.length : 0;

  /* ----------------------- CHART CONFIG ----------------------- */
  const chartData = {
    labels: filteredData.map(i =>
      i.ledgerName?.length > 5 ? i.ledgerName.slice(0, 5) + '..' : i.ledgerName || 'Unknown'
    ),
    datasets: [{ data: filteredData.map(i => Number(i.closingAmount || 0)) }],
  };

  const chartConfig = {
    backgroundColor: COLORS.card,
    backgroundGradientFrom: COLORS.card,
    backgroundGradientTo: COLORS.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => COLORS.textMedium,
    barPercentage: 0.65,
    fillShadowGradient: COLORS.primary,
    fillShadowGradientOpacity: 1,
    fillShadowGradientFrom: COLORS.chartGradientFrom,
    fillShadowGradientTo: COLORS.chartGradientTo,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: isDarkMode ? '#334155' : '#F1F5F9',
      strokeDasharray: '0',
    },
    propsForLabels: {
      fontSize: 10,
      fontWeight: '600'
    }
  };

  /* ----------------------- RENDER ROW ----------------------- */
  const LedgerRow = ({ item, index }) => (
    <View style={styles.rowWrapper}>
      <View style={[styles.rowCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
        {/* Left Accent Bar */}
        <View style={[styles.accentBar, { backgroundColor: COLORS.accentLine }]} />

        {/* Index */}
        <View style={styles.indexContainer}>
          <Text style={[styles.indexText, { color: COLORS.textLight }]}>{index + 1}</Text>
        </View>

        {/* Name & Contact Info Group */}
        <View style={styles.nameDateContainer}>
          <Text style={[styles.rowNameText, { color: COLORS.textDark }]} numberOfLines={1}>
            {item.ledgerName || 'Unnamed Ledger'}
          </Text>
          {item.mobileNo && (
            <Text style={[styles.rowDateText, { color: COLORS.textLight }]}>{item.mobileNo}</Text>
          )}
          {item.email && (
            <Text style={[styles.rowDateText, { color: COLORS.textLight, fontSize: 10 }]}>{item.email}</Text>
          )}
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={[styles.rowAmountText, { color: COLORS.secondary }]}>
            ₹{Number(item.closingAmount || 0).toLocaleString()}
          </Text>
        </View>

        {/* NEW: Action Column with Icons */}
        <View style={styles.actionContainer}>
          {/* Gmail Icon */}
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: hoveredIcon === `gmail-${item.id}` ? COLORS.iconHover : 'transparent' }
            ]}
            onPress={() => openGmailCompose(item.email)}
            onPressIn={() => setHoveredIcon(`gmail-${item.id}`)}
            onPressOut={() => setHoveredIcon(null)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="email"
              size={20}
              color={item.email ? COLORS.gmail : COLORS.textLight}
              style={!item.email && { opacity: 0.4 }}
            />
            {!item.email && (
              <View style={styles.tooltipIndicator}>
                <Ionicons name="information-circle-outline" size={10} color={COLORS.textLight} />
              </View>
            )}
          </TouchableOpacity>

          {/* WhatsApp Icon */}
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: hoveredIcon === `whatsapp-${item.id}` ? COLORS.iconHover : 'transparent',
                marginLeft: 8
              }
            ]}
            onPress={() => openWhatsApp(item.mobileNo)}
            onPressIn={() => setHoveredIcon(`whatsapp-${item.id}`)}
            onPressOut={() => setHoveredIcon(null)}
            activeOpacity={0.7}
          >
            <FontAwesome5
              name="whatsapp"
              size={18}
              color={item.mobileNo ? COLORS.whatsapp : COLORS.textLight}
              style={!item.mobileNo && { opacity: 0.4 }}
            />
            {!item.mobileNo && (
              <View style={styles.tooltipIndicator}>
                <Ionicons name="information-circle-outline" size={10} color={COLORS.textLight} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /* ----------------------- RENDER STAT CARD ----------------------- */
  const StatCard = ({ label, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
      <View style={[styles.statIconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View>
        <Text style={[styles.statLabel, { color: COLORS.textLight }]}>{label}</Text>
        <Text style={[styles.statValue, { color: COLORS.textDark }]}>{value}</Text>
      </View>
    </View>
  );

  /* ----------------------- LOADING STATE ----------------------- */
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, { color: COLORS.textMedium }]}>Loading ledger data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ----------------------- MAIN UI ----------------------- */
  return (
    <View style={[styles.container, { backgroundColor: theme.TAB_BAR_BG }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={COLORS.background}
      />
      <View>
        <InfiniteNavBar pageName="Reports" />
      </View>

      {/* HEADER */}
      <View style={[styles.headerSection, { backgroundColor: theme.TAB_BAR_BG }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerSubtitle, { color: COLORS.textLight }]}>Financial Dashboard</Text>
            <Text style={[styles.headerTitle, { color: COLORS.textDark }]}>Ledger Outstanding</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.exportBtn,
              {
                backgroundColor: COLORS.card,
                shadowColor: COLORS.shadow
              },
              isExporting && styles.disabledBtn
            ]}
            onPress={downloadCSV}
            disabled={isExporting}
          >
            <Ionicons name={isExporting ? "hourglass-outline" : "download-outline"} size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* CONTROLS ROW */}
        <View style={styles.controlsRow}>
          <View style={[styles.segmentContainer, { backgroundColor: COLORS.segmentBg }]}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                viewType === 'table' && [styles.segmentActive, { backgroundColor: COLORS.card, shadowColor: COLORS.shadow }]
              ]}
              onPress={() => toggleView('table')}
            >
              <Ionicons name="list" size={16} color={viewType === 'table' ? COLORS.primary : COLORS.textLight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                viewType === 'chart' && [styles.segmentActive, { backgroundColor: COLORS.card, shadowColor: COLORS.shadow }]
              ]}
              onPress={() => toggleView('chart')}
            >
              <Ionicons name="stats-chart" size={16} color={viewType === 'chart' ? COLORS.primary : COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* BODY CONTENT */}
      <View style={styles.contentContainer}>
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={[styles.errorText, { color: COLORS.textDark }]}>Error loading data</Text>
            <Text style={[styles.errorSubtext, { color: COLORS.textLight }]}>{error}</Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: COLORS.primary }]}
              onPress={fetchDataFromAPI}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {viewType === 'table' && !error ? (
          <View style={styles.listContainer}>
            {/* Table Header - UPDATED with Action column */}
            <View style={[styles.tableHeaderRow, { borderBottomColor: COLORS.border }]}>
              <Text style={[styles.th, { color: COLORS.textLight, width: 40, textAlign: 'center' }]}>#</Text>
              <Text style={[styles.th, { color: COLORS.textLight, flex: 1, paddingLeft: 12 }]}>Ledger Details</Text>
              <Text style={[styles.th, { color: COLORS.textLight, width: 100, textAlign: 'right', paddingRight: 4 }]}>Amount</Text>
              <Text style={[styles.th, { color: COLORS.textLight, width: 80, textAlign: 'center' }]}>Action</Text>
            </View>

            <FlatList
              data={filteredData}
              keyExtractor={i => i.id}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                  progressBackgroundColor={COLORS.card}
                />
              }
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item, index }) => <LedgerRow item={item} index={index} />}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={64} color={COLORS.border} />
                  <Text style={[styles.emptyText, { color: COLORS.textLight }]}>No ledger data available</Text>
                </View>
              }
            />

            {filteredData.length > 0 && (
              <View style={[styles.floatingFooter, { backgroundColor: isDarkMode ? '#1E293B' : '#0F172A', shadowColor: COLORS.primary }]}>
                <View style={styles.footerInfo}>
                  <Text style={styles.footerLabel}>Total Outstanding</Text>
                  <Text style={styles.footerCount}>{filteredData.length} records</Text>
                </View>
                <Text style={styles.footerValue}>
                  ₹{totalAmount.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        ) : !error ? (
          /* --------------- GRAPH SECTION --------------- */
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
                progressBackgroundColor={COLORS.card}
              />
            }
          >
            {/* 1. Summary Cards */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              <StatCard
                label="Total Volume"
                value={`₹${totalAmount.toLocaleString()}`}
                icon="wallet-outline"
                color={COLORS.primary}
              />
              <StatCard
                label="Average Ticket"
                value={`₹${avgAmount.toLocaleString()}`}
                icon="analytics-outline"
                color={COLORS.secondary}
              />
              <StatCard
                label="Records"
                value={filteredData.length}
                icon="list-outline"
                color="#F59E0B"
              />
            </ScrollView>

            {/* 2. Main Chart */}
            {filteredData.length > 0 ? (
              <View style={[styles.chartContainer, { backgroundColor: COLORS.card, shadowColor: COLORS.shadow }]}>
                <View style={styles.chartHeader}>
                  <View>
                    <Text style={[styles.chartTitle, { color: COLORS.textDark }]}>Visual Breakdown</Text>
                    <Text style={[styles.chartSubtitle, { color: COLORS.textLight }]}>Outstanding amount per ledger</Text>
                  </View>
                  <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#312E81' : '#EEF2FF' }]}>
                    <Ionicons name="bar-chart-outline" size={20} color={COLORS.primary} />
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <BarChart
                    data={chartData}
                    width={Math.max(screenWidth - 70, filteredData.length * 60)}
                    height={320}
                    yAxisLabel="₹"
                    yAxisSuffix=""
                    chartConfig={chartConfig}
                    fromZero
                    showValuesOnTopOfBars
                    style={styles.chartStyle}
                  />
                </ScrollView>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: COLORS.textLight }]}>No data to visualize</Text>
              </View>
            )}

            {/* 3. Highest Value Insight */}
            {filteredData.length > 0 && (
              <View style={[styles.insightCard, {
                backgroundColor: isDarkMode ? '#064E3B' : '#ECFDF5',
                borderColor: isDarkMode ? '#065F46' : '#D1FAE5'
              }]}>
                <View style={styles.insightHeader}>
                  <Ionicons name="trending-up-outline" size={20} color={isDarkMode ? '#34D399' : '#10B981'} />
                  <Text style={[styles.insightTitle, { color: isDarkMode ? '#D1FAE5' : '#065F46' }]}>Highest Outstanding</Text>
                </View>
                <Text style={[styles.insightValue, { color: isDarkMode ? '#FFFFFF' : '#064E3B' }]}>₹{maxAmount.toLocaleString()}</Text>
                <Text style={[styles.insightDesc, { color: isDarkMode ? '#A7F3D0' : '#047857' }]}>
                  Account with maximum dues currently.
                </Text>
              </View>
            )}

          </ScrollView>
        ) : null}
      </View>
    </View>
  );
}

/* ----------------------- UPDATED STYLES ----------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0
  },

  /* LOADING & ERROR STATES */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 0,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  /* HEADER AREA */
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  exportBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
  },
  dateBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dateBtnLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  dateBtnValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  applyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
  },
  segmentBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 }
  },

  /* CONTENT AREA */
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listContainer: {
    flex: 1,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  th: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  /* ROW STYLE - UPDATED for Action column */
  rowWrapper: {
    marginBottom: 12,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingRight: 16,
    borderWidth: 1,
  },
  accentBar: {
    width: 4,
    height: 24,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginRight: 12,
  },
  indexContainer: {
    width: 30,
    alignItems: 'center',
  },
  indexText: {
    fontSize: 12,
    fontWeight: '600',
  },
  nameDateContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  rowNameText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  rowDateText: {
    fontSize: 11,
  },
  amountContainer: {
    alignItems: 'flex-end',
    width: 100,
    paddingRight: 8,
  },
  rowAmountText: {
    fontSize: 14,
    fontWeight: '700',
  },

  /* NEW: Action Column Styles */
  actionContainer: {
    flexDirection: 'row',
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tooltipIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
  },

  /* FOOTER */
  floatingFooter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  footerInfo: {
    flexDirection: 'column',
  },
  footerLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  footerCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  footerValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  /* CHART STYLES */
  statCard: {
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 140,
    borderWidth: 1,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },

  chartContainer: {
    borderRadius: 24,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartStyle: {
    borderRadius: 16,
    paddingRight: 40,
    marginVertical: 8,
  },

  /* INSIGHT CARD */
  insightCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 13,
  },

  /* EMPTY STATES */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
  },
});