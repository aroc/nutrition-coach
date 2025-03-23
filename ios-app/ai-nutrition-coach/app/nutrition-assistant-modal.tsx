import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { View, StyleSheet, SafeAreaView, Alert, ScrollView, TextInput, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { colorPalette } from '@/constants/Colors';
import { spacing, uiStyles } from '@/constants/Styles';
import { CloseViewButton } from '@/components/ui/CloseViewButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/state/store';
import db from '@/db/db';
import { userChatMessages } from '@/db/schema';
import Logger from '@/lib/Logger';
import { Ionicons } from '@expo/vector-icons';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

type Message = {
  id: string;
  text: string;
  createdAt: Date;
  isAssistant: boolean;
}

const sampleMessages: Message[] = [
  {
    id: '1',
    text: "Hi! I'd like help with my nutrition goals.",
    createdAt: new Date('2024-03-20T14:23:00Z'),
    isAssistant: false
  },
  {
    id: '2',
    text: "Hello! I'd be happy to help you with your nutrition goals. What specific areas would you like to focus on?",
    createdAt: new Date('2024-03-20T14:23:15Z'),
    isAssistant: true
  },
  {
    id: '3',
    text: "I want to build muscle while maintaining a balanced diet.",
    createdAt: new Date('2024-03-20T14:23:45Z'),
    isAssistant: false
  },
  {
    id: '4',
    text: "Great choice! To build muscle, we'll need to focus on protein intake and overall caloric surplus. Let's start by analyzing your current diet.",
    createdAt: new Date('2024-03-20T14:24:10Z'),
    isAssistant: true
  }
];

const userMsgBgColor = colorPalette.blue[400];
const aiMsgBgColor = colorPalette.gray[300];

const userMsgTextColor = colorPalette.white;
const aiMsgTextColor = colorPalette.gray[800];

const ChatMessage = ({
  backgroundColor = colorPalette.gray[100],
  textColor = colorPalette.gray[800],
  align = 'left',
  text,
  createdAt
}: {
  backgroundColor?: string,
  textColor?: string,
  align?: 'left' | 'right',
  text: string,
  createdAt: Date
}) => {
  const formattedTime = createdAt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <View style={[
      styles.messageContainer,
      align === 'right' ? styles.messageRight : styles.messageLeft
    ]}>
      <View style={[
        styles.message,
        { backgroundColor }
      ]}>
        <ThemedText style={{ color: textColor }}>{text}</ThemedText>
      </View>
      <ThemedText style={styles.timestamp}>{formattedTime}</ThemedText>
    </View>
  )
}

const UserChatMessage = ({ text, createdAt }: { text: string, createdAt: Date }) => {
  return (
    <ChatMessage
      backgroundColor={userMsgBgColor}
      textColor={userMsgTextColor}
      align="right"
      text={text}
      createdAt={createdAt}
    />
  )
}

const AIChatMessage = ({ text, createdAt }: { text: string, createdAt: Date }) => {
  return (
    <ChatMessage
      backgroundColor={aiMsgBgColor}
      textColor={aiMsgTextColor}
      align="left"
      text={text}
      createdAt={createdAt}
    />
  )
}

export default function SetGoalsModal() {
  const router = useRouter();
  const { currentUser } = useAppStore.getState();
  const [message, setMessage] = useState('');

  const { data: chatMessages } = useLiveQuery(
    db.select().from(userChatMessages).orderBy(userChatMessages.createdAt)
  );

  console.log('chatMessages', chatMessages);

  const handleSend = useCallback(async () => {
    console.log('handleSend', message);
    if (!message.trim()) return;

    // Save message to drizzle db
    await db.insert(userChatMessages).values({
      id: uuidv4(),
      userId: currentUser?.id,
      message,
      isAssistant: false
    });

    // Clear message input
    setMessage('');
  }, [message, currentUser?.id]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <View />
        <ThemedText type="subtitle">
          Nutrition Assistant
        </ThemedText>
        <CloseViewButton style={styles.closeButton} onPress={() => router.back()} />
      </View>
      <ScrollView style={[
        uiStyles.mainContent,
      ]}>
        <View style={[
          styles.chatContainer,
        ]}>
          {chatMessages.map((message) => (
            message.isAssistant ?
              <AIChatMessage key={message.id} text={message.message} createdAt={message.createdAt} /> :
              <UserChatMessage key={message.id} text={message.message} createdAt={message.createdAt} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <Pressable
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Ionicons name="arrow-up" size={20} color={colorPalette.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.gray[200],
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    bottom: 10,
  },
  chatContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '80%',
    minWidth: '10%'
  },
  message: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  messageLeft: {
    alignSelf: 'flex-start'
  },
  messageRight: {
    alignSelf: 'flex-end'
  },
  timestamp: {
    fontSize: 11,
    color: colorPalette.gray[500],
    alignSelf: 'flex-end',
    marginHorizontal: spacing.xs
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: colorPalette.white,
    borderRadius: 20,
    width: '92%',
    alignSelf: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colorPalette.gray[100],
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 100,
    backgroundColor: colorPalette.blue[400],
    justifyContent: 'center',
    alignItems: 'center',
  }
});