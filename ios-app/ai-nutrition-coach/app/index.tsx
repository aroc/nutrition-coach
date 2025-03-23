import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { colorPalette } from '@/constants/Colors';
import { spacing, text } from '@/constants/Styles';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log('Credential', credential);
      // signed in
    } catch (e) {
      if ((e as any).code === 'ERR_REQUEST_CANCELED') {
        console.log('User canceled the sign-in flow');
        // handle that the user canceled the sign-in flow
      } else {
        console.log('Error signing in', e);
        // handle other errors
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <ThemedText type="title" style={styles.title}>
          Nutrition Pal
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Your motivational nutrition coach
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="secondary"
          size="large"
          onPress={() => router.push('/auth-modal')}
        >
          Continue with Email
        </Button>

        <Button
          variant="secondary"
          size="large"
          onPress={handleAppleSignIn}
        >
          Continue with Apple
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...text['2xl'],
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...text.lg,
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  appleAuthButton: {
    width: '100%',
    height: 54,
    opacity: 0.9,
  }
}); 