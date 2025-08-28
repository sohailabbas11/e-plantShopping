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
import { socket } from "../utils/socket";

const API_URL = "http://localhost:4000"; 

type Msg = {
  _id: string;
  text: string;
  createdAt?: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList<Msg>>(null);

  // ---- Socket listeners ----
  useEffect(() => {
    socket.on("receiveMessage", (message: Msg) => {
      setMessages((prev) => [message, ...prev]); // newest at top
    });

    socket.on("messageDeleted", ({ id }: { id: string }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageDeleted");
    };
  }, []);

  // ---- Load messages (paginated REST) ----
  const loadMessages = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/messages?page=${page}&limit=20`);
      const batch: Msg[] = res.data.messages;
      setMessages((prev) => (page === 1 ? batch : [...prev, ...batch]));
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // ---- Send new message ----
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      // only call REST — backend will emit socket event automatically
      await axios.post(`${API_URL}/messages`, { text });
      setText("");

      // scroll to latest after small delay
      setTimeout(
        () => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }),
        50
      );
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        Alert.alert("Error", "Endpoint not found (404). Check your API route.");
      } else {
        Alert.alert("Error", "Failed to send message");
      }
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/messages/${id}`);
      // UI will auto-update when server emits "messageDeleted"
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  // initial load & further pages
  useEffect(() => {
    loadMessages();
  }, [page]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/favicon.png")}
              style={styles.foto}
            />
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
          inverted
          keyExtractor={(item, index) => item._id ?? String(index)}
          renderItem={({ item }) => (
            <MessageBubble
              isOwn={false} // TODO: set based on logged-in user
              text={item.text}
              createdAt={item.createdAt}
              onDelete={() => deleteMessage(item._id)}
            />
          )}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (!loading && hasMore) setPage((p) => p + 1);
          }}
          maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
          ListFooterComponent={
            loading ? <Text style={{ textAlign: "center" }}>Loading…</Text> : null
          }
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
