import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colorPalette } from '@/constants/Colors';

interface Tab {
  id: string;
  label: string;
}

interface PillTabsProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  style?: object;
  pillStyles?: object;
}

const PillTabs: React.FC<PillTabsProps> = ({ tabs, activeTabId, onTabChange, style = {}, pillStyles = {} }) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          activeOpacity={0.8}
          style={[
            styles.pill,
            activeTabId === tab.id ? styles.activePill : styles.inactivePill,
            pillStyles,
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text
            style={[
              styles.pillText,
              activeTabId === tab.id ? styles.activeText : styles.inactiveText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activePill: {
    backgroundColor: colorPalette.emerald[800],
  },
  inactivePill: {
    backgroundColor: colorPalette.stone[800],
  },
  pillText: {
    fontSize: 14,
  },
  activeText: {
    color: colorPalette.white,
  },
  inactiveText: {
    color: colorPalette.white,
  },
});

export default PillTabs;
