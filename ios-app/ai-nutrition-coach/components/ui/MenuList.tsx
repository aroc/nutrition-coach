import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { colorPalette } from '@/constants/Colors';
import { spacing } from '@/constants/Styles';

const Divider = () => {
  return <View style={styles.divider} />;
};

interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<any>;
  iconClassName?: string; // kept for backwards compatibility
  style?: any;
}

interface MenuListProps {
  menuItems: MenuItem[];
  style?: any;
}

const MenuList: React.FC<MenuListProps> = ({ menuItems, style }) => {
  return (
    <View style={[styles.container, style]}>
      {menuItems.map((item, index) => {
        const Icon = item.icon ? (item.icon as React.ComponentType<any>) : null;

        return (
          <React.Fragment key={item.label}>
            <Pressable
              onPress={item.onClick}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed
              ]}
            >
              <View style={styles.menuItemContent}>
                {Icon && (
                  <Icon
                    width={20}
                    height={20}
                    color={colorPalette.zinc[400]}
                  />
                )}
                <Text style={[
                  styles.menuItemText,
                  ...(item.icon ? [styles.menuItemTextWithIcon] : [])
                ]}>{item.label}</Text>
              </View>
            </Pressable>
            {index < menuItems.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: colorPalette.zinc[900],
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colorPalette.zinc[700],
    opacity: 0.7,
  },
  menuItem: {
    width: '100%',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs * 3,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: colorPalette.zinc[100],
    flex: 1,
  },
  menuItemTextWithIcon: {
    marginLeft: 8,
  }
});

export default MenuList;