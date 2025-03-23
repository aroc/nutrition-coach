import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { colorPalette } from '@/constants/Colors';
import { spacing, uiStyles } from '@/constants/Styles';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useRouter } from 'expo-router';
import { submitLogin, submitSignup } from '@/lib/api-fetch';
import Logger from '@/lib/Logger';

export default function AuthModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authType, setAuthType] = useState<'login' | 'signup'>('signup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      if (authType === 'login') {
        await submitLogin(email, password);
      } else {
        await submitSignup(email, password);
      }
      // Close modal and go back on success
      router.replace('/(tabs)');
    } catch (error) {
      let message = error instanceof Error ? error.message : 'An error occurred';
      if (message === "Invalid user credentials") {
        message = 'Wrong email or password';
      }

      Logger.error('Auth error:', message);
      // Show error message in an alert
      Alert.alert(
        authType === 'login' ? 'Login Failed' : 'Signup Failed',
        message,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, authType, router]);

  const [testEmailValue, setTestEmailValue] = useState("");

  return (
    <SafeAreaView style={[
      styles.modalContainer,
    ]}>
      <View style={[
        styles.modalContent,
        uiStyles.modalTopPadding,
      ]}>
        <ThemedText type="title" style={styles.modalTitle}>
          {authType === 'login' ? 'Login' : 'Sign Up'}
        </ThemedText>

        <View style={styles.formContainer}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            type="email-address"
            showClear
            icon="mail-outline"
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            type="password"
            showClear
            icon="lock-closed-outline"
          />

          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            isLoadingText={authType === 'login' ? 'Logging in...' : 'Signing up...'}
          >
            {authType === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </View>

        <View style={styles.modalFooter}>
          <Button
            variant="tertiary"
            onPress={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
            style={styles.switchButton}
          >
            {authType === 'login' ? 'Switch to Sign Up' : 'Switch to Login'}
          </Button>

          <Button
            variant="tertiary"
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  modalTitle: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formContainer: {
    gap: spacing.md,
  },
  modalFooter: {
    marginTop: 'auto',
  },
  switchButton: {
    marginTop: spacing.xl,
  },
  closeButton: {
    marginTop: spacing.md,
  },
}); 