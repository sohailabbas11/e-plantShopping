import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

type MessageBubbleProps = {
  id: string; // ✅ add id prop
  text: string;
  createdAt: string | Date;
  isOwn?: boolean;
  onDelete?: (id: string) => void; // ✅ let parent handle deletion
  onForward?: () => void;
};

export default function MessageBubble({
  id,
  text,
  createdAt,
  isOwn,
  onDelete,
  onForward,
}: MessageBubbleProps) {
  const [showOptions, setShowOptions] = useState(false);

  const handleLongPress = () => {
    setShowOptions(true);
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <View>
      <TouchableOpacity
        onLongPress={handleLongPress}
        style={[
          styles.bubble,
          isOwn ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text style={styles.text}>{text}</Text>
        <Text
          style={[
            styles.date,
            isOwn ? { color: "rgba(255,255,255,0.7)" } : { color: "gray" },
          ]}
        >
          {formattedTime}
        </Text>
      </TouchableOpacity>

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={closeOptions}
      >
        <TouchableWithoutFeedback onPress={closeOptions}>
          <View style={styles.overlay}>
            <View style={styles.optionBox}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onDelete?.(id); // ✅ call parent to delete
                  closeOptions();
                }}
              >
                <Text style={styles.optionText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onForward?.();
                  closeOptions();
                }}
              >
                <Text style={styles.optionText}>Forward</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={closeOptions}>
                <Text style={styles.optionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 12,
    maxWidth: "75%",
  },
  ownBubble: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  otherBubble: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  text: {
    color: "black",
    fontSize: 16,
  },
  date: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: 200,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
