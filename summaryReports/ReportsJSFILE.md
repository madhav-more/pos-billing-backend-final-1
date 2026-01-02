# 📊 Ledger Outstanding Reports (React Native – Expo)

---

## 1. Project Overview

This project implements a **Ledger Outstanding Reports screen** in a **React Native (Expo)** application. It fetches ledger outstanding data from a backend API, displays it in **table and chart formats**, supports **dark/light themes**, allows **CSV export**, and provides **interactive analytics** such as totals, averages, and highest outstanding values.

The screen is designed as a **financial dashboard** suitable for accounting, ERP, or business reporting applications.

---

## 2. Objective of the Project

The main objectives are:

* Fetch ledger outstanding data securely from an API
* Display financial data in an easy-to-understand format
* Provide both **tabular** and **graphical** views
* Allow users to **export data as CSV**
* Support **dark and light themes**
* Provide a smooth and modern mobile UI experience

---

## 3. Project Workflow (High-Level)

1. User opens the **Reports** screen
2. App reads authentication token from **AsyncStorage**
3. API request is sent to fetch ledger outstanding data
4. Data is transformed into a UI-friendly format
5. User can:

   * View data in a **table**
   * View data in a **bar chart**
   * Pull to refresh data
   * Export data as CSV
6. App calculates totals, averages, and insights
7. UI adapts automatically based on **dark/light theme**

---

## 4. Dependencies & Libraries Used

### Core Libraries

* **react** – Core React framework
* **react-native** – Mobile UI components
* **expo** – Simplified React Native development

### UI & Navigation

* **react-native-safe-area-context** – Safe layout handling for notches
* **@expo/vector-icons (Ionicons)** – Icons

### Storage & API

* **@react-native-async-storage/async-storage** – Token storage
* **fetch API** – Network requests

### Charts & Visualization

* **react-native-chart-kit** – Bar chart visualization

### File Handling & Sharing

* **expo-file-system** – Create and write CSV files
* **expo-sharing** – Share exported files

### Theming

* **ThemeContext (custom)** – Dark/light mode handling
* **getTheme() (custom)** – Theme-based colors

---

## 5. File Structure Explanation

### `Reports.js`

This is the **main screen component** responsible for:

* Fetching API data
* Managing UI state
* Rendering charts and tables
* Exporting CSV files
* Handling errors and loading states

Other referenced files:

* `theme.js` – Centralized theme configuration
* `ThemeContext.js` – Dark/light mode context
* `NavBar.js` – Top navigation bar component

---

## 6. Detailed Code Explanation

### 6.1 Imports Section

Imports are grouped logically:

* React hooks (`useState`, `useEffect`, `useCallback`)
* React Native UI components
* Expo utilities (file system, sharing)
* Charts, icons, and theme helpers

---

## 7. State Variables (useState)

| State                | Purpose                             |
| -------------------- | ----------------------------------- |
| `viewType`           | Toggle between table and chart view |
| `fromDate`, `toDate` | Date filters (future-ready)         |
| `filteredData`       | Data currently displayed            |
| `originalData`       | Raw API data                        |
| `loading`            | Loading indicator                   |
| `refreshing`         | Pull-to-refresh state               |
| `isExporting`        | CSV export status                   |
| `error`              | API error message                   |

---

## 8. API Fetch Logic (`fetchDataFromAPI`)

### Purpose

Fetch ledger outstanding data from backend API.

### Input

* Auth token from AsyncStorage
* need to provide the companay id ---> Hardcoded

### Output

* Array of transformed ledger objects

### Steps

1. Show loading indicator
2. Read token from AsyncStorage
3. Send POST request with company ID
4. Parse JSON response
5. Transform API response into UI format
6. Store data in state
7. Handle errors gracefully

---

## 9. Pull to Refresh (`onRefresh`)

Allows user to refresh data by pulling down the list.

* Calls `fetchDataFromAPI`
* Updates UI automatically

---

## 10. CSV Export (`downloadCSV`)

### Purpose

Export ledger data as a CSV file.

### Steps

1. Convert ledger data to CSV format
2. Save file using Expo FileSystem
3. Share file using Expo Sharing

### Output

* Downloadable / shareable CSV file

---

## 11. Calculations

| Calculation   | Description                |
| ------------- | -------------------------- |
| `totalAmount` | Sum of all closing amounts |
| `avgAmount`   | Average outstanding amount |
| `maxAmount`   | Highest outstanding value  |

---

## 12. Chart Configuration

* Uses `react-native-chart-kit`
* Responsive width based on data count
* Theme-aware colors
* Shows values on bars

---

## 13. UI Components Explained

### LedgerRow

Displays a single ledger row with:

* Ledger name
* Closing amount

### StatCard

Reusable summary cards showing:

* Total outstanding
* Average ticket
* Record count

---

## 14. Error & Loading States

* **Loading spinner** while fetching data
* **Error screen** with retry button
* **Empty state** when no data exists

---

## 15. Styling Approach

* Uses `StyleSheet.create()`
* Theme-based colors
* Clean spacing and typography
* Responsive and modern UI design




















--------------------------------------------------------------------------------------------------------------------------------------------------------------------------steps to setup this -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---

# 📘 README.md (Ready to Use)

````md
# Ledger Outstanding Reports

## Overview
A React Native (Expo) financial dashboard that displays ledger outstanding data in table and chart formats, with CSV export and theme support.

## Features
- Secure API integration
- Table & chart views
- CSV export
- Dark/Light theme
- Pull to refresh

## Installation

```bash
npm install
expo start
````

## Dependencies

* react-native
* expo
* react-native-chart-kit
* expo-file-system
* expo-sharing
* @react-native-async-storage/async-storage

## Usage

1. Login to generate token
2. Open Reports screen
3. View ledger data
4. Export CSV if needed

## Example

Displays outstanding amounts per ledger in a bar chart and table.

```

---

# 📝 Final Project Report Summary

This project demonstrates how to build a **professional-grade financial reporting screen** using React Native and Expo. It focuses on clean UI, secure data handling, modular design, and real-world accounting use cases.

### Suitable For:

- Beginners learning React Native
- Academic project evaluation
- ERP / Accounting app development
- Code reviews and interviews

---

## ✅ Conclusion

The **Ledger Outstanding Reports** screen is a complete, scalable, and production-ready solution that combines **API integration**, **data visualization**, and **modern mobile UI practices**.

---

If you want, I can also:
- Convert this into a **PDF report**
- Create **flow diagrams**
- Explain line-by-line for exams
- Optimize or refactor the code

Just tell me 👍

```
