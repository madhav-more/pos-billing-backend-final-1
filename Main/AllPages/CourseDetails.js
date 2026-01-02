// Knowledge.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import InfiniteNavBar from "./NavBar";

const CourseDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();         // <-- Add this
  const { courseId } = route.params || {};

  console.log("Received ID:", courseId);

  return (
    <View style={{ flex: 1 }}>
      <InfiniteNavBar pageName="CourseDetails" />

      {/* Back Button */}
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: "#ddd",
          width: 80,
          margin: 10,
          borderRadius: 6,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text>◀ Back</Text>
      </TouchableOpacity>

      <Text>{courseId}</Text>
    </View>
  );
};

export default CourseDetails;
