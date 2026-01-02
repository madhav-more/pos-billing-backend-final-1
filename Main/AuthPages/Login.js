
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
  Pressable,
  Platform,
  Image,
} from "react-native";
import axios from "axios";
import * as Device from "expo-device";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Linking } from "react-native";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Since we don't have ThemedText and ThemedView components, we'll create local versions
const ThemedView = ({ children, style, ...props }) => (
  <View style={style} {...props}>
    {children}
  </View>
);

const ThemedText = ({ children, style, ...props }) => (
  <Text style={style} {...props}>
    {children}
  </Text>
);

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const navigation = useNavigation();

  // GET DEVICE INFO
  const getDeviceInfo = () => {
    if (Device.brand) return Device.brand + " " + Device.modelName;
    return Device.modelName || "Unknown Device";
  };

  // LOGOUT SESSION FUNCTION
  const handleLogoutSession = async (token) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/logout`, { token });
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: error.message,
      });
    }
    setLoading(false);
    setOpenDialog(false);
  };

  // LOGIN API FUNCTION
  const handleLogin = async () => {
    if (!userEmail || !password) {
      setMessage("Email and password required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        userEmail,
        password,
        device: getDeviceInfo(),
      });

      // console.log(data);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("role", data.role);
      if (data.token) {
        navigation.replace("MainApp");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        // ACTIVE SESSION LIMIT
        setOpenDialog(true);
        setActiveSessions(error.response.data.activeSessions);
      } else if (error.response?.status === 403) {
        navigation.navigate("SignupConfirm", { email: userEmail });
      } else {
        setMessage(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission when pressing return key
  const handleSubmit = () => {
    handleLogin();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Login Form Paper Simulation */}
      <ThemedView style={styles.paper}>
        {/* Logo - You'll need to replace this with your actual logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/ShraddhaLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <ThemedText style={styles.loginTitle}>Welcome Back!</ThemedText>

        {/* Email Input */}
        <ThemedView style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={setUserEmail}
            value={userEmail}
            placeholder="Email Address"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          {userEmail.length > 0 && !loading && (
            <Pressable
              onPress={() => setUserEmail("")}
              style={styles.clearIcon}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </Pressable>
          )}
        </ThemedView>

        {/* Password Input */}
        <ThemedView style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            editable={!loading}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.visibilityToggle}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#666"
            />
          </Pressable>
        </ThemedView>

        {/* Forgot Password Link */}
        <ThemedView style={styles.forgotPasswordContainer}>
          <Pressable
            disabled={loading}
            onPress={() => Linking.openURL("https://app.shraddhainfinitesolutions.com/Auth/forgot-password")}
            >
            <ThemedText style={styles.forgotPasswordText}>
              Forgot Password?
            </ThemedText>
          </Pressable>
        </ThemedView>

        {/* Error Message */}
        {message ? (
          <ThemedText style={styles.errorMessage}>{message}</ThemedText>
        ) : null}

        {/* Sign In Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            styles.loginButton,
            { opacity: pressed || loading ? 0.7 : 1 },
          ]}
        >
          {loading ? (
            <ThemedText style={[styles.buttonText, styles.loginButtonText]}>
              SIGNING IN...
            </ThemedText>
          ) : (
            <ThemedText style={[styles.buttonText, styles.loginButtonText]}>
              SIGN IN
            </ThemedText>
          )}
        </Pressable>

        {/* Links: Login with OTP & Register */}
        <ThemedView style={styles.linksContainer}>
  
  <ThemedText style={styles.NoAccount}>
    Don't have an account?
  </ThemedText>

  <Pressable
    disabled={loading}
    onPress={() => Linking.openURL("https://app.shraddhainfinitesolutions.com/Auth/signup")}
  >
    <ThemedText style={styles.linkText}>Register</ThemedText>
  </Pressable>

</ThemedView>
      </ThemedView>

      {/* SESSION LIMIT MODAL - Using updated styles from reference */}
      <Modal
        visible={openDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenDialog(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>Active Sessions</Text>

            <Text style={styles.dialogMessage}>
              Session limit exceeded. Please log out from another device.
            </Text>

            <FlatList
              data={activeSessions}
              keyExtractor={(item) => item.session_Id.toString()}
              style={styles.sessionsList}
              renderItem={({ item }) => (
                <View style={styles.sessionItem}>
                  <Text style={styles.sessionDevice}>
                    Device: {item.session_device}
                  </Text>
                  <Text style={styles.sessionTime}>
                    Login at: {item.created_at}
                  </Text>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => handleLogoutSession(item.token)}
                  >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpenDialog(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

export default Login;

/* ---------------- STYLES (MERGED FROM REFERENCE) ---------------- */
const styles = StyleSheet.create({
  // --- Global Container ---
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6EBF0",
    paddingVertical: 40,
  },
  // --- Login Card (Paper) Styles ---
  paper: {
    flexDirection: "column",
    width: "90%",
    maxWidth: 400,
    padding: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  logoContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  logoPlaceholder: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: "center",
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },

  // --- Text Input Styles ---
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
  },
  inputIcon: {
    paddingLeft: 15,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    color: "black",
    fontSize: 16,
    height: "100%",
  },
  clearIcon: {
    paddingRight: 10,
  },
  visibilityToggle: {
    paddingHorizontal: 15,
  },

  // --- Message/Link Styles ---
  errorMessage: {
    color: "#D32F2F",
    marginBottom: 15,
    alignSelf: "center",
    fontWeight: "600",
    textAlign: "center",
  },
  forgotPasswordContainer: {
    marginTop: -5,
    marginBottom: 20,
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },

  // --- Custom Button Styles (Simplified for Pressable) ---
  button: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  loginButton: {
    marginTop: 5,
    backgroundColor: "#B09246",
    elevation: 3,
  },

  // --- Bottom Links Styles ---
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    backgroundColor: "transparent",
  },
  linkText: {
    color: "#586cc3",
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 10,
  },
  NoAccount: {
    color: "grey",
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 10,
  },

  // --- Dialog Styles (Updated from reference) ---
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialogContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  dialogMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  sessionsList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  sessionItem: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  sessionDevice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  sessionTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: "#B09246",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
