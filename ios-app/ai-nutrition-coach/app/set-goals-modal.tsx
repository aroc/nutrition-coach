import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { colorPalette } from '@/constants/Colors';
import { spacing, uiStyles } from '@/constants/Styles';
import { CloseViewButton } from '@/components/ui/CloseViewButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { useAppStore } from '@/state/store';
import db from '@/db/db';
import { userGoals } from '@/db/schema';
import Logger from '@/lib/Logger';

export default function SetGoalsModal() {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { currentUser } = useAppStore.getState();

  const handleSubmit = useCallback(async () => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to set goals');
      return;
    }

    // Validate inputs
    if (!calories || !protein || !carbs || !fat) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const caloriesNum = parseInt(calories, 10);
    const proteinNum = parseInt(protein, 10);
    const carbsNum = parseInt(carbs, 10);
    const fatNum = parseInt(fat, 10);

    if (caloriesNum <= 0 || proteinNum <= 0 || carbsNum <= 0 || fatNum <= 0) {
      Alert.alert('Error', 'Values must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      const newGoals = {
        id: Crypto.randomUUID(),
        userId: currentUser.id,
        calories: caloriesNum,
        protein_grams: proteinNum,
        carbs_grams: carbsNum,
        fat_grams: fatNum,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(userGoals).values(newGoals);
      Logger.log('Goals saved successfully:', newGoals);

      // Close modal and go back on success
      router.back();
    } catch (error) {
      let message = error instanceof Error ? error.message : 'An error occurred';
      Logger.error('Failed to save goals:', error);

      // Show error message in an alert
      Alert.alert(
        'Failed to Save Goals',
        message,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [calories, protein, carbs, fat, router, currentUser]);

  return (
    <SafeAreaView style={[
      styles.modalContainer,
    ]}>
      <View style={[
        styles.modalContent,
        uiStyles.modalTopPadding,
      ]}>
        <CloseViewButton onPress={() => router.back()} />
        <ThemedText type="title" style={styles.modalTitle}>
          Set Your Daily Goals
        </ThemedText>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              Daily Calories
            </ThemedText>
            <Input
              placeholder="Daily Calories"
              value={calories}
              onChangeText={setCalories}
              type="numeric"
              showClear
              icon="nutrition-outline"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              Protein (grams)
            </ThemedText>
            <Input
              placeholder="Protein (grams)"
              value={protein}
              onChangeText={setProtein}
              type="numeric"
              showClear
              icon="barbell-outline"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              Fat (grams)
            </ThemedText>
            <Input
              placeholder="Fat (grams)"
              value={fat}
              onChangeText={setFat}
              type="numeric"
              showClear
              icon="restaurant-outline"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold" style={styles.inputLabel}>
              Carbs (grams)
            </ThemedText>
            <Input
              placeholder="Carbs (grams)"
              value={carbs}
              onChangeText={setCarbs}
              type="numeric"
              showClear
              icon="leaf-outline"
            />
          </View>

          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            isLoadingText="Saving goals..."
          >
            Save Goals
          </Button>
        </View>

        <View style={styles.modalFooter}>
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
  inputGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
    marginLeft: spacing.sm,
  },
  modalFooter: {
    marginTop: 'auto',
  },
  closeButton: {
    marginTop: spacing.md,
  },
});