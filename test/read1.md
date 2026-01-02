// Reports.js
import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

import { getTheme } from '../../theme';
import { useTheme } from '../../ThemeContext';
import InfiniteNavBar from './NavBar';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth } = Dimensions.get('window');
const API_URL = 'http://164.52.223.12:3000/reports/ledOutstanding';

export default function Reports() {
  const { isDarkMode } = useTheme();
  const theme = getTheme(isDarkMode);

  const COLORS = {
    primary: '#6366F1',
    secondary: '#10B981',
    background: theme.BACKGROUND || '#F8FAFC',
    card: theme.CARD_BG || '#FFFFFF',
    textDark: theme.PRIMARY_TEXT || '#0F172A',
    textMedium: theme.SECONDARY_TEXT || '#334155',
    textLight: '#94A3B8',
    border: theme.BORDER_COLOR || '#E2E8F0',
    shadow: '#000',
    segmentBg: isDarkMode ? '#334155' : '#E2E8F0',
  };

  const [viewType, setViewType] = useState('table');
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- API FETCH ---------------- */
  const fetchDataFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Login Required', 'Please login again.');
        return;
      } 

      const APIbody={
"cmpid":"dd1b5d18-0191-4f08-80f5-cefa31aa1263",
"fromdate":"20250401",
 "Todate":"20251201"
}

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          // ✅ FIX: NO "Bearer"
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }, 
          body: JSON.stringify(APIbody), 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
   
     
      const json = await response.json();
       console.log("response >>>>>>>>>>>>>>>>>>>>>",json)

      const transformed =
        json?.ledger_outstanding?.map((item, index) => ({
          id: String(index + 1),
          ledgerName: item.ledger_name || 'Unknown Ledger',
          closingAmount: Number(item.bill_outstanding_amt || 0),
          mobileNo: item.mobileNo,
          email: item.email,
          date: new Date().toISOString().slice(0, 10),
        })) || [];

      setOriginalData(transformed);
      setFilteredData(transformed);
    } catch (err) {
      console.error('API Fetch Error:', err);
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDataFromAPI();
    setRefreshing(false);
  }, []);

  /* ---------------- CSV EXPORT ---------------- */
  const downloadCSV = async () => {
    if (!filteredData.length) {
      Alert.alert('No Data', 'Nothing to export');
      return;
    }

    const header = 'Sr No,Ledger,Amount\n';
    const rows = filteredData
      .map((i, idx) => `${idx + 1},"${i.ledgerName}",${i.closingAmount}`)
      .join('\n');

    const uri = FileSystem.documentDirectory + 'ledger_outstanding.csv';
    await FileSystem.writeAsStringAsync(uri, header + rows);

    await Sharing.shareAsync(uri);
  };

  /* ---------------- CHART DATA ---------------- */
  const chartData = {
    labels: filteredData.map(i =>
      i.ledgerName.length > 6 ? i.ledgerName.slice(0, 6) + '..' : i.ledgerName
    ),
    datasets: [{ data: filteredData.map(i => i.closingAmount) }],
  };

  const totalAmount = filteredData.reduce((a, b) => a + b.closingAmount, 0);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <InfiniteNavBar pageName="Reports" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: COLORS.textDark }]}>Ledger Outstanding</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={downloadCSV}>
            <Ionicons name="download-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setViewType(viewType === 'table' ? 'chart' : 'table')}>
            <Ionicons
              name={viewType === 'table' ? 'stats-chart' : 'list'}
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      {error ? (
        <View style={styles.errorBox}>
          <Text>{error}</Text>
        </View>
      ) : viewType === 'table' ? (
        <FlatList
          data={filteredData}
          keyExtractor={i => i.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.rowText}>
                {index + 1}. {item.ledgerName}
              </Text>
              <Text style={styles.amount}>₹{item.closingAmount.toLocaleString()}</Text>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.footerText}>Total: ₹{totalAmount.toLocaleString()}</Text>
            </View>
          }
        />
      ) : (
        <ScrollView>
          <BarChart
            data={chartData}
            width={Math.max(screenWidth, filteredData.length * 70)}
            height={300}
            yAxisLabel="₹"
            chartConfig={{
              backgroundGradientFrom: COLORS.card,
              backgroundGradientTo: COLORS.card,
              color: () => COLORS.primary,
              labelColor: () => COLORS.textMedium,
            }}
            fromZero
          />
        </ScrollView>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  row: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowText: {
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    marginTop: 6,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    backgroundColor: '#0F172A',
  },
  footerText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
