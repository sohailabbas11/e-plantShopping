import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, FlatList } from "react-native";
import axios from "axios";

const API_URL = "http://localhost:4000"; 

export default function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function loadMessages() {
    const res = await axios.get(`${API_URL}/messages`);
    setMessages(res.data);
  }

  async function sendMessage() {
    if (!text.trim()) return;
    await axios.post(`${API_URL}/messages`, { text });
    setText("");
    loadMessages();
  }

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text style={styles.msg}>{item.text}</Text>}
      />
     <View style={styles.messageContainer}>
     <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, marginTop: 40, backgroundColor: "coral", },
  msg: { padding: 10, borderWidth: 1, borderColor: "#ddd", margin: 5, borderRadius: 20,  },
  input: { borderWidth: 1, borderColor: "#aaa", padding: 10, marginVertical: 10, },
  messageContainer: { }
});

