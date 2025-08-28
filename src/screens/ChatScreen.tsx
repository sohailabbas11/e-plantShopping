import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MessageBubble from "../components/MessageBubble";

const API_URL = "http://localhost:4000"; 

type Msg = {
  _id: string;
  text: string;
  isOwn?: boolean;
  createdAt?: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>([]); // newest -> oldest
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList<Msg>>(null);

  // ---- Load messages (older pages append to the END) ----
  const loadMessages = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/messages?page=${page}&limit=20`);
      const batch: Msg[] = res.data.messages; // backend returns newest first
      // keep array newest -> oldest; older pages go to the end
      setMessages((prev) => (page === 1 ? batch : [...prev, ...batch]));
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // ---- Send new message (PREPEND to keep newest at index 0) ----
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/messages`, { text });
      const newMessage: Msg = res.data; // POST returns the message object
      setMessages((prev) => [newMessage, ...prev]); // << PREPEND
      setText("");
      // with inverted FlatList, offset 0 is the visual bottom
      setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }), 50);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        Alert.alert("Error", "Endpoint not found (404). Check your API route.");
      } else {
        Alert.alert("Error", "Failed to send message");
      }
    }
  };

  // initial load & further pages
  useEffect(() => { loadMessages(); }, [page]);

  // scroll to bottom on first load
  useEffect(() => {
    if (messages.length && page === 1) {
      // for inverted list, bottom == offset 0
      requestAnimationFrame(() =>
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false })
      );
    }
  }, [messages.length, page]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Image source={require("../../assets/favicon.png")} style={styles.foto} />
            <Text style={styles.headerText}>Sohail</Text>
          </View>
          <View style={styles.header}>
            <Feather name="video" size={28} color="black" />
            <Feather name="phone-call" size={24} color="black" />
          </View>
        </View>
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          inverted // show index 0 at the visual bottom
          keyExtractor={(item, index) => item._id ?? String(index)}
          renderItem={({ item }) => (
            <MessageBubble isOwn={item.isOwn} text={item.text} />
          )}
          // With inverted lists, onEndReached fires when the user scrolls to the TOP (older)
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (!loading && hasMore) setPage((p) => p + 1); // load older
          }}
          // Keep the scroll anchored when we prepend/append
          maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
          ListFooterComponent={loading ? <Text style={{ textAlign: "center" }}>Loading…</Text> : null}
        />

        {/* Composer */}
        <View style={styles.inputContainer}>
          <FontAwesome6 name="add" size={24} color="black" />
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Feather name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "coral" },
  container: { flex: 1, backgroundColor: "coral", padding: 20 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 20 },
  headerText: { fontSize: 30, fontWeight: "bold", textAlign: "center" },
  foto: { width: 40, height: 40, borderRadius: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    width: "80%",
    borderRadius: 20,
    backgroundColor: "white",
  },
  sendButton: { width: "20%", marginTop: 5, alignItems: "center" },
});
