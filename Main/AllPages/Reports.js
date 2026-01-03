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
  Modal,
  Pressable,
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
    tertiary: '#F59E0B',
    danger: '#EF4444',
    background: theme.BACKGROUND || '#F8FAFC',
    card: theme.CARD_BG || '#FFFFFF',
    textDark: theme.PRIMARY_TEXT || '#0F172A',
    textMedium: theme.SECONDARY_TEXT || '#475569',
    textLight: theme.SECONDARY_TEXT || '#94A3B8',
    border: theme.BORDER_COLOR || '#F1F5F9',
    accentLine: '#6366F1',
    glassBg: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    glassBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    shadow: theme.SHADOW_COLOR || '#000',
    gmail: '#EA4335',
    whatsapp: '#25D366',
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
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);

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

  /* ----------------------- CSV DOWNLOAD (Save to Device Storage) ----------------------- */
  /* ----------------------- CSV EXPORT HELPERS ----------------------- */
  const generateCSVContent = () => {
    let csvContent = 'ID,Ledger Name,Closing Amount (₹),Date,Mobile No,Email\n';
    filteredData.forEach(item => {
      const escapedName = item.ledgerName ? `"${item.ledgerName.replace(/"/g, '""')}"` : '""';
      csvContent += `${item.id},${escapedName},${item.closingAmount},${item.date},${item.mobileNo || 'N/A'},${item.email || 'N/A'}\n`;
    });
    return csvContent;
  };

  const handleShare = async (fileUri) => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Share Ledger Report',
        UTI: 'public.comma-separated-values-text'
      });
    } else {
      Alert.alert('Error', 'Sharing is not available on this device');
    }
  };

  const handleSaveToDevice = async (fileUri, fileName, csvContent) => {
    try {
      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          try {
            const base64Content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
            const uri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'text/csv');
            await FileSystem.writeAsStringAsync(uri, base64Content, { encoding: FileSystem.EncodingType.Base64 });
            Alert.alert('✅ Success', 'File saved successfully to your device');
          } catch (writeError) {
            console.error('SAF Write Error:', writeError);
            if (writeError.message && writeError.message.includes('isn\'t writable')) {
              Alert.alert(
                'Folder Restricted',
                'The folder you selected is read-only or restricted. Please try selecting a different folder (like a subfolder in Internal Storage) or use the Share option.',
                [
                  { text: 'Try Again', onPress: () => handleSaveToDevice(fileUri, fileName, csvContent) },
                  { text: 'Use Share Instead', onPress: () => handleShare(fileUri) },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            } else {
              throw writeError;
            }
          }
        } else {
          Alert.alert('Permission Denied', 'Storage permission is required to save the file');
        }
      } else {
        // iOS: Standard way to "Save to Files"
        await handleShare(fileUri);
      }
    } catch (error) {
      console.error('Save to device error:', error);
      Alert.alert('❌ Save Failed', `Could not save file: ${error.message || 'Please try again.'}`);
    }
  };

  const downloadCSV = () => {
    if (filteredData.length === 0) {
      Alert.alert('No Data', 'There is no data to export.');
      return;
    }
    setIsExportModalVisible(true);
  };

  const proceedWithExport = async (type) => {
    setIsExportModalVisible(false);
    setIsExporting(true);

    try {
      const csvContent = generateCSVContent();
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `Ledger_Report_${timestamp}.csv`;

      if (Platform.OS === 'web') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        Alert.alert('Success', 'CSV file downloaded!');
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: 'utf8' });

        if (type === 'share') {
          await handleShare(fileUri);
        } else {
          await handleSaveToDevice(fileUri, fileName, csvContent);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('❌ Export Failed', `Could not process file: ${error.message || 'Please try again.'}`);
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
    barPercentage: 0.6,
    fillShadowGradient: COLORS.primary,
    fillShadowGradientOpacity: 1,
    fillShadowGradientFrom: COLORS.primary,
    fillShadowGradientTo: COLORS.primary,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: COLORS.border,
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
      <TouchableOpacity
        style={[styles.rowCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}
        activeOpacity={0.7}
      >
        {/* Name & ID Group */}
        <View style={styles.nameContainer}>
          <View style={styles.idBadge}>
            <Text style={[styles.idText, { color: COLORS.textLight }]}>{String(index + 1).padStart(2, '0')}</Text>
          </View>
          <View style={styles.textGroup}>
            <Text style={[styles.rowNameText, { color: COLORS.textDark }]} numberOfLines={1}>
              {item.ledgerName || 'Unnamed Ledger'}
            </Text>
            <View style={styles.subInfoRow}>
              {item.mobileNo && (
                <View style={styles.infoTag}>
                  <Ionicons name="call-outline" size={10} color={COLORS.textLight} />
                  <Text style={[styles.infoTagText, { color: COLORS.textLight }]}>{item.mobileNo}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Amount & Actions Group */}
        <View style={styles.rightContent}>
          <Text style={[styles.rowAmountText, { color: COLORS.textDark }]}>
            ₹{Number(item.closingAmount || 0).toLocaleString()}
          </Text>

          <View style={styles.rowActions}>
            <TouchableOpacity
              style={[styles.miniActionBtn, { backgroundColor: COLORS.gmail + '10' }]}
              onPress={() => openGmailCompose(item.email)}
              activeOpacity={0.6}
            >
              <MaterialIcons name="email" size={16} color={item.email ? COLORS.gmail : COLORS.textLight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.miniActionBtn, { backgroundColor: COLORS.whatsapp + '10', marginLeft: 8 }]}
              onPress={() => openWhatsApp(item.mobileNo)}
              activeOpacity={0.6}
            >
              <FontAwesome5 name="whatsapp" size={14} color={item.mobileNo ? COLORS.whatsapp : COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  /* ----------------------- RENDER STAT CARD ----------------------- */
  const StatCard = ({ label, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
      <View style={[styles.statIconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.statInfo}>
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
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.navWrapper}>
        <InfiniteNavBar pageName="Reports" />
      </View>

      {/* HEADER SECTION */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerSubtitle, { color: COLORS.primary }]}>FINANCIAL OVERVIEW</Text>
            <Text style={[styles.headerTitle, { color: COLORS.textDark }]}>Ledger <Text style={{ fontWeight: '400' }}>Outstanding</Text></Text>
          </View>
          <TouchableOpacity
            style={[
              styles.exportBtn,
              {
                backgroundColor: COLORS.primary,
                shadowColor: COLORS.primary,
              },
              isExporting && styles.disabledBtn
            ]}
            onPress={downloadCSV}
            disabled={isExporting}
            activeOpacity={0.8}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="download-outline" size={22} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* CONTROLS & SEARCH BAR-LIKE ROW */}
        <View style={styles.controlsRow}>
          <View style={[styles.searchSimulation, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
            <Text style={[styles.searchPlaceholder, { color: COLORS.textLight }]}>Search ledger records...</Text>
          </View>

          <View style={[styles.viewSwitcher, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <TouchableOpacity
              style={[
                styles.switcherBtn,
                viewType === 'table' && { backgroundColor: COLORS.primary }
              ]}
              onPress={() => toggleView('table')}
            >
              <Ionicons name="list" size={18} color={viewType === 'table' ? '#FFF' : COLORS.textLight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switcherBtn,
                viewType === 'chart' && { backgroundColor: COLORS.primary }
              ]}
              onPress={() => toggleView('chart')}
            >
              <Ionicons name="stats-chart" size={18} color={viewType === 'chart' ? '#FFF' : COLORS.textLight} />
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
            {/* Premium Table Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.th, { color: COLORS.textLight, flex: 1 }]}>LEDGER DETAILS</Text>
              <Text style={[styles.th, { color: COLORS.textLight, width: 120, textAlign: 'right' }]}>DUE AMOUNT</Text>
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
                backgroundColor: COLORS.secondary + '10',
                borderColor: COLORS.secondary + '30'
              }]}>
                <View style={styles.insightHeader}>
                  <Ionicons name="trending-up-outline" size={20} color={COLORS.secondary} />
                  <Text style={[styles.insightTitle, { color: COLORS.secondary }]}>Highest Outstanding</Text>
                </View>
                <Text style={[styles.insightValue, { color: COLORS.textDark }]}>₹{maxAmount.toLocaleString()}</Text>
                <Text style={[styles.insightDesc, { color: COLORS.textMedium }]}>
                  This account holds the maximum current due amount in your ledger.
                </Text>
              </View>
            )}

          </ScrollView>
        ) : null}
      </View>

      {/* EXPORT OPTIONS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isExportModalVisible}
        onRequestClose={() => setIsExportModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsExportModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: COLORS.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: COLORS.textDark }]}>Export Options</Text>
              <TouchableOpacity onPress={() => setIsExportModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TouchableOpacity
                style={[styles.modalOption, { borderColor: COLORS.border }]}
                onPress={() => proceedWithExport('save')}
              >
                <View style={[styles.optionIcon, { backgroundColor: COLORS.primary + '15' }]}>
                  <Ionicons name="save-outline" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: COLORS.textDark }]}>Save to Device</Text>
                  <Text style={[styles.optionSubtitle, { color: COLORS.textLight }]}>Download file to local storage</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalOption, { borderColor: COLORS.border }]}
                onPress={() => proceedWithExport('share')}
              >
                <View style={[styles.optionIcon, { backgroundColor: COLORS.secondary + '15' }]}>
                  <Ionicons name="share-social-outline" size={24} color={COLORS.secondary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: COLORS.textDark }]}>Share</Text>
                  <Text style={[styles.optionSubtitle, { color: COLORS.textLight }]}>Send file via other apps</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

/* ----------------------- UPDATED STYLES ----------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navWrapper: {
    zIndex: 10,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },

  /* HEADER SECTION */
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  exportBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledBtn: {
    opacity: 0.6,
  },

  /* CONTROLS & SEARCH */
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchSimulation: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
  },
  viewSwitcher: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  switcherBtn: {
    width: 38,
    height: 38,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* LIST VIEW */
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  th: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  /* ROW DESIGN */
  rowWrapper: {
    marginBottom: 12,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  idBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textGroup: {
    flex: 1,
  },
  rowNameText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: 8,
  },
  rowAmountText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  rowActions: {
    flexDirection: 'row',
  },
  miniActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* STAT CARS */
  statCard: {
    padding: 14,
    borderRadius: 20,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 160,
    borderWidth: 1,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },

  /* CHART SECTION */
  chartContainer: {
    borderRadius: 24,
    padding: 24,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    fontSize: 12,
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
  },

  /* INSIGHT CARD */
  insightCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    marginTop: 10,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  insightValue: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 13,
    lineHeight: 18,
  },

  /* FOOTER */
  floatingFooter: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: '#0F172A',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  footerInfo: {
    gap: 2,
  },
  footerLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footerCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  footerValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 28,
    padding: 28,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 16,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  /* EMPTY STATE */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
  },
});
