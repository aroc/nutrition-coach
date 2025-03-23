import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { uiStyles, text as textStyles } from '@/constants/Styles';
import { colorPalette } from '@/constants/Colors';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  style?: object;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTabId, onTabChange, style = {} }) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTabId === tab.id && styles.activeTab
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text style={styles.tabText}>
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
    justifyContent: 'flex-start',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#292524', // stone-800
    paddingHorizontal: 16,
  },
  tab: {
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#059669', // emerald-600
  },
  tabText: {
    ...textStyles.base,
    color: colorPalette.stone[50],
  }
});

export default Tabs;
