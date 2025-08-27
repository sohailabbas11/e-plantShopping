// import React, { useEffect, useState, useRef, useMemo } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   Alert,
// } from "react-native";
// import axios from "axios";
// import Feather from "@expo/vector-icons/Feather";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import BottomSheet from "@gorhom/bottom-sheet";

// const API_URL = "http://localhost:4000";

// export default function App() {
//   const [messages, setMessages] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [text, setText] = useState("");
//   const flatListRef = useRef<FlatList>(null);
//   const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
//     null
//   );
//   const bottomSheetRef = useRef<BottomSheet>(null);

//   const snapPoints = useMemo(() => ["25%"], []);

//   const handleLongPress = (messageId: string) => {
//     setSelectedMessageId(messageId);
//     bottomSheetRef.current?.expand();
//   };

//   const handleForward = () => {
//     console.log("forward");
//   };

//   const handleClose = () => {
//     bottomSheetRef.current?.close();
//   };

//   // ✅ Load messages with pagination
//   const loadMessages = async () => {
//     if (loading || !hasMore) return;
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_URL}/messages?page=${page}&limit=20`);

//       // ✅ append old messages at the TOP (so order stays correct)
//       setMessages((prev) => [...res.data.messages, ...prev]);

//       setHasMore(res.data.hasMore);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to load messages");
//       setLoading(false);
//     }
//   };

//   // ✅ Delete message
//   const handleDeleteMessage = async (messageId: string) => {
//     try {
//       await axios.delete(`${API_URL}/messages/${messageId}`);
//       setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
//       setSelectedMessageId(null);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to delete message");
//     }
//   };

//   // ✅ Send new message
//   const sendMessage = async () => {
//     if (!text.trim()) return;
//     try {
//       const res = await axios.post(`${API_URL}/messages`, { text });
//       const newMessage = res.data;
//       setMessages((prev) => [...prev, newMessage]); // append at bottom
//       setText("");
//       // scroll to bottom after sending
//       setTimeout(() => {
//         flatListRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to send message");
//     }
//   };

//   // ✅ Initial load
//   useEffect(() => {
//     loadMessages();
//   }, [page]);

//   // ✅ Scroll to bottom when new message arrives
//   useEffect(() => {
//     if (messages.length > 0) {
//       flatListRef.current?.scrollToEnd({ animated: true });
//     }
//   }, [messages]);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.headerContainer}>
//           <View style={styles.header}>
//             <Image
//               source={require("./assets/favicon.png")}
//               style={styles.foto}
//             />
//             <Text style={styles.headerText}>Sohail</Text>
//           </View>
//           <View style={styles.header}>
//             <Feather name="video" size={28} color="black" />
//             <Feather name="phone-call" size={24} color="black" />
//           </View>
//         </View>

//         {/* Messages List */}
//         <FlatList
//           ref={flatListRef} // 👈 attach ref
//           data={messages}
//           keyExtractor={(item, index) => item._id || index.toString()}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.messageContainer}
//               onLongPress={() => setSelectedMessageId(item._id)}
//             >
//               <Text style={styles.msg}>{item.text}</Text>
//               {selectedMessageId === item._id ? (
//                 <BottomSheet
//                   ref={bottomSheetRef}
//                   index={-1}
//                   snapPoints={snapPoints}
//                 >
//                   <View style={styles.options}>
//                     <Text onPress={handleDeleteMessage}>Delete</Text>
//                     <Text onPress={handleForward}>Forward</Text>
//                     <Text onPress={handleClose}>Cancel</Text>
//                   </View>
//                 </BottomSheet>
//               ) : null}
//             </TouchableOpacity>
//           )}
//           onContentSizeChange={() =>
//             flatListRef.current?.scrollToEnd({ animated: true })
//           }
//           onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
//         />

//         {/* Input + Send Button */}
//         <View style={styles.inputContainer}>
//           <FontAwesome6 name="add" size={24} color="black" />
//           <TextInput
//             style={styles.input}
//             value={text}
//             onChangeText={setText}
//             placeholder="Type a message"
//           />
//           <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//             <Feather name="send" size={24} color="black" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "coral" },
//   container: { flex: 1, backgroundColor: "coral", padding: 20 },
//   msg: {
//     padding: 10,
//     margin: 5,
//   },
//   inputContainer: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "white",
//     padding: 10,
//     marginVertical: 10,
//     width: "80%",
//     borderRadius: 20,
//     backgroundColor: "white",
//   },
//   messageContainer: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "white",
//     padding: 2,
//     marginVertical: 5,
//     backgroundColor: "white",
//   },
//   header: {
//     marginBottom: 20,
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 20,
//   },
//   headerText: {
//     fontSize: 30,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   foto: { width: 40, height: 40, borderRadius: 20 },
//   sendButton: {
//     width: "20%",
//     marginTop: 5,
//   },
//   options: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: "coral",
//     padding: 10,
//     borderRadius: 10,
//     position: "absolute",
//     right: 0,
//     top: 0,
//   },
//   headerContainer: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
// });




import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import BottomSheet from "@gorhom/bottom-sheet";

const API_URL = "http://localhost:4000";

export default function App() {
  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);

  // ✅ Load messages with pagination
  const loadMessages = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/messages?page=${page}&limit=20`);
      setMessages((prev) => [...res.data.messages, ...prev]); // prepend old
      setHasMore(res.data.hasMore);
      setLoading(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load messages");
      setLoading(false);
    }
  };

  // ✅ Delete message
  const handleDeleteMessage = async () => {
    if (!selectedMessageId) return;
    try {
      await axios.delete(`${API_URL}/messages/${selectedMessageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== selectedMessageId));
      handleCloseSheet();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to delete message");
    }
  };

  // ✅ Send new message
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/messages`, { text });
      const newMessage = res.data;
      setMessages((prev) => [...prev, newMessage]); // append at bottom
      setText("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to send message");
    }
  };

  const handleLongPress = (messageId: string) => {
    setSelectedMessageId(messageId);
    bottomSheetRef.current?.expand();
  };

  const handleForward = () => {
    console.log("Forward message:", selectedMessageId);
    handleCloseSheet();
  };

  const handleCloseSheet = () => {
    bottomSheetRef.current?.close();
    setSelectedMessageId(null);
  };

  // ✅ Initial load
  useEffect(() => {
    loadMessages();
  }, [page]);

  // ✅ Scroll to bottom when new message arrives
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Image
              source={require("./assets/favicon.png")}
              style={styles.foto}
            />
            <Text style={styles.headerText}>Sohail</Text>
          </View>
          <View style={styles.header}>
            <Feather name="video" size={28} color="black" />
            <Feather name="phone-call" size={24} color="black" />
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.messageContainer}
              onLongPress={() => handleLongPress(item._id)}
            >
              <Text style={styles.msg}>{item.text}</Text>
            </TouchableOpacity>
          )}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input + Send Button */}
        <View style={styles.inputContainer}>
          <FontAwesome6 name="add" size={24} color="black" />
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Feather name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* ✅ Global Bottom Sheet */}
        <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
          <View style={styles.options}>
            <Text style={styles.option} onPress={handleDeleteMessage}>
              Delete
            </Text>
            <Text style={styles.option} onPress={handleForward}>
              Forward
            </Text>
            <Text style={styles.cancel} onPress={handleCloseSheet}>
              Cancel
            </Text>
          </View>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "coral" },
  container: { flex: 1, backgroundColor: "coral", padding: 20 },
  msg: {
    padding: 10,
    margin: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    marginVertical: 10,
    width: "80%",
    borderRadius: 20,
    backgroundColor: "white",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  foto: { width: 40, height: 40, borderRadius: 20 },
  sendButton: {
    width: "20%",
    marginTop: 5,
  },
  options: {
    flex: 1,
    padding: 20,
  },
  option: {
    fontSize: 18,
    paddingVertical: 10,
    color: "blue",
  },
  cancel: {
    fontSize: 18,
    paddingVertical: 10,
    color: "red",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
