import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useCallback } from 'react';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/Button';
import { spacing, uiStyles } from '@/constants/Styles';
import { colorPalette } from '@/constants/Colors';
import LogoImage from '@/assets/images/logo/Logo_Isolated_2x.png';
import db from '@/db/db';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import CardContainer from '@/components/ui/CardContainer';
import { userGoals as userGoalsTable, loggedFoodItems as loggedFoodItemsTable } from '@/db/schema';
import { useRouter } from 'expo-router';

type GoalProps = {
  label: string;
  current: number;
  target: number;
  color?: string;
}

const goalStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colorPalette.gray[50],
    borderRadius: 12,
    overflow: 'visible',
    padding: spacing.sm,
    flexDirection: 'column',
    gap: spacing.xs,
  },
  content: {
    padding: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: colorPalette.gray[200],
    overflow: 'hidden',
    borderRadius: 12,
  },
  progressBar: {
    height: '100%',
    width: '100%',
  },
  diff: {
    fontSize: 13,
    fontWeight: '500',
    color: colorPalette.gray[500],
  },
});

function Goal({ label, current, target, color = colorPalette.sky[500] }: GoalProps) {
  const progress = Math.min((current / target) * 100, 100);

  const isOverTarget = current > target;
  const diff = Math.abs(current - target);

  return (
    <View style={goalStyles.container}>
      <View style={goalStyles.content}>
        <View style={goalStyles.header}>
          <ThemedText style={goalStyles.label}>{label}</ThemedText>
          {isOverTarget ? (
            <ThemedText style={goalStyles.diff}>{diff} over target of {target}</ThemedText>
          ) : (
            <ThemedText style={goalStyles.diff}>{diff} left</ThemedText>
          )}
        </View>
      </View>
      <View style={goalStyles.progressBarContainer}>
        <View style={[goalStyles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { data: userGoals } = useLiveQuery(db.select().from(userGoalsTable));
  const goals = userGoals?.[0];

  const { data: loggedFoodItems } = useLiveQuery(db.select().from(loggedFoodItemsTable));

  console.log('userGoals', userGoals)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={[
          uiStyles.mainContent,
          styles.container
        ]}>
          <View style={styles.header}>
            <View style={styles.headerAppName}>
              <Image source={LogoImage} style={styles.logoIcon} />
              <ThemedText style={styles.appTitle}>Nutrition Pal</ThemedText>
            </View>
          </View>
          <View style={styles.section}>
            <ThemedText type="subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</ThemedText>
            <ThemedText>days of the week here...</ThemedText>
          </View>
          <View style={styles.section}>
            <ThemedText type="subtitle">Today's progress</ThemedText>
            {!goals && (
              <CardContainer style={{ gap: spacing.md }}>
                <ThemedText>Set up your calorie and macro goals</ThemedText>
                <Button onPress={() => router.push('/set-goals-modal')}>Set Goals</Button>
              </CardContainer>
            )}
            {goals && (
              <View style={styles.goalsContainer}>
                <Goal label="Calories" current={100} target={2000} color={colorPalette.sky[500]} />
                <Goal label="Protein" current={100} target={2000} color={colorPalette.emerald[500]} />
                <Goal label="Fat" current={100} target={2000} color={colorPalette.amber[500]} />
                <Goal label="Carbs" current={100} target={2000} color={colorPalette.purple[500]} />
              </View>
            )}
          </View>
          <View style={styles.section}>
            <ThemedText type="subtitle">Your food today</ThemedText>
            <ThemedText>today's log here...</ThemedText>
          </View>
          {/* <View style={[
          styles.section,
        ]}>
          <View style={[
            styles.sectionHeader,
            uiStyles.mainContentPadding
          ]}>
            <ThemedText type="subtitle" style={[
              styles.sectionTitle,
            ]}>Nature Mixes</ThemedText>
            <ThemedText muted>Mixes with the soothing sounds of nature</ThemedText>
          </View>

        </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 10,
  },
  headerAppName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 34,
    height: 34,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    width: '100%',
    flexDirection: 'column',
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'column',
    gap: spacing.xs,
  },
  sectionTitle: {

  },
  tilesContainer: {
    flexDirection: 'row',
  },
  goalsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
});
