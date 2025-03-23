import { StyleSheet, View, ScrollView, SafeAreaView, Alert, Linking, Text } from 'react-native';
import { useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { logout } from '@/lib/auth-utils';
import { deleteAccount } from '@/lib/api-fetch';
import { uiStyles } from '@/constants/Styles';
import { User } from '@/types/index';
import { useAppStore } from '@/state/store';
import MenuList from '@/components/ui/MenuList';
import CardContainer from '@/components/ui/CardContainer';
import Button from '@/components/Button';
import DeleteIcon from '../../components/icons/pika/stroke/delete-02';
import InformationCircleIcon from '../../components/icons/pika/stroke/information-circle';
import LogoutLeftIcon from '../../components/icons/pika/stroke/logout-left';
import { colorPalette } from '@/constants/Colors';
import { spacing } from '@/constants/Styles';
import * as Clipboard from 'expo-clipboard';

const getUserEmail = (currentUser: User | null) => {
  if (!currentUser) {
    return null;
  }
  if (currentUser.email) {
    return currentUser.email;
  }
  if (currentUser.appleUserId) {
    return "No email, using Apple login";
  }
  return null;
}

const SUPPORT_EMAIL = 'support@smoothnoise.app';

export default function SettingsScreen() {
  const { currentUser } = useAppStore.getState();

  const handleLogout = useCallback(() => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log out',
        style: 'default',
        onPress: () => {
          logout();
        }
      }
    ]);
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert('Delete account', 'Are you sure you want to delete your account? this cannot be undone.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete account',
        style: 'destructive',
        onPress: () => {
          deleteAccount();
        }
      }
    ]);
  }, []);

  const handleCopyEmail = useCallback(async () => {
    await Clipboard.setStringAsync(SUPPORT_EMAIL);
  }, []);

  const menuItems = [
    {
      label: 'Terms and conditions',
      onClick: useCallback(() => {
        Linking.openURL('https://smoothnoise.app/terms');
      }, []),
      icon: InformationCircleIcon,
    },
    {
      label: 'Privacy policy',
      onClick: useCallback(() => {
        Linking.openURL('https://smoothnoise.app/privacy');
      }, []),
      icon: InformationCircleIcon,
    },
    {
      label: 'Log out',
      onClick: handleLogout,
      icon: LogoutLeftIcon,
    }
  ];

  const deleteAccountMenuItems = [
    {
      label: 'Delete account',
      onClick: handleDeleteAccount,
      icon: DeleteIcon,
    }
  ];

  const userEmail = getUserEmail(currentUser);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={[
        uiStyles.mainContent,
      ]}>
        <View style={[
          styles.container,
        ]}>
          <ThemedText type="title">Settings</ThemedText>
          {userEmail && (
            <CardContainer paddingSize="small" contentAlign="flex-start">
              <ThemedText type="defaultSemiBold" style={styles.accountLabel}>Account email</ThemedText>
              <ThemedText type="default" muted style={styles.emailText}>{userEmail}</ThemedText>
            </CardContainer>
          )}

          <CardContainer>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Need help or have feedback?</ThemedText>

            <ThemedText type="default" muted style={styles.supportText}>
              Email us at <Text style={styles.emailHighlight}>{SUPPORT_EMAIL}</Text>{'\n'}
              We respond within 24 hours
            </ThemedText>

            <Button size="small" variant="secondary" onPress={handleCopyEmail} style={styles.copyButton}>
              Copy email
            </Button>
          </CardContainer>

          <MenuList menuItems={menuItems} />

          <MenuList menuItems={deleteAccountMenuItems} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  accountLabel: {
    paddingBottom: 0,
  },
  emailText: {
    textAlign: 'center',
  },
  sectionTitle: {
    paddingBottom: 8,
  },
  supportText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  emailHighlight: {
    color: colorPalette.emerald[600],
    fontWeight: '600',
  },
  copyButton: {
    marginBottom: -4,
  },
});
