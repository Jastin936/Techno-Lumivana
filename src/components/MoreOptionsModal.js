import React, { useRef, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, Animated, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MoreOperationsModal({
  visible,
  post,
  onClose,
  onBlock,
  onReport,
  onNotInterested
}) {
  const slideAnim = useRef(new Animated.Value(300)).current; // for slide-up effect

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Function to open links in the browser
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open link: ", err));
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>More Operations</Text>

          {/* Social Media Icons with links */}
          <View style={styles.row}>
            <TouchableOpacity onPress={() => openLink('https://www.facebook.com')}>
              <Ionicons name="logo-facebook" size={28} color="#1877F2" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openLink('mailto:example@example.com')}>
              <Ionicons name="mail-outline" size={28} color="#EA4335" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openLink('https://t.me')}>
              <Ionicons name="send-outline" size={28} color="#1DA1F2" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openLink('https://www.twitter.com')}>
              <Ionicons name="logo-twitter" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Report Post Button */}
          <TouchableOpacity style={styles.option} onPress={onReport}>
            <Ionicons name="flag-outline" size={22} color="red" />
            <Text style={styles.text}>Report Post</Text>
          </TouchableOpacity>

          {/* Not Interested Button */}
          <TouchableOpacity style={styles.option} onPress={onNotInterested}>
            <Ionicons name="heart-dislike-outline" size={22} color="red" />
            <Text style={styles.text}>Not Interested</Text>
          </TouchableOpacity>

          {/* Block User Button */}
          <TouchableOpacity style={styles.option} onPress={onBlock}>
            <Ionicons name="close-circle-outline" size={22} color="red" />
            <Text style={styles.text}>Block user</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFD700" />
          </TouchableOpacity>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#222",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-evenly", 
    marginBottom: 20 
  },
  option: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 12,
  },
  text: { color: "white", fontSize: 16 },
  close: { alignSelf: "center", marginTop: 15 },
};