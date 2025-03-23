import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Popover, { PopoverMode } from 'react-native-popover-view';
import { Easing } from 'react-native';
import { colorPalette } from '@/constants/Colors';

interface MenuItem {
  label: string;
  icon?: React.ComponentType<any>;
  isDestructive?: boolean;
  onPress?: () => void;
}

const DESTRUCTIVE_COLOR = '#f87171';

interface PopoverContextMenuProps {
  menuItems: MenuItem[];
  showMessage?: string;
  children: React.ReactNode;
}

const PopoverContextMenu: React.FC<PopoverContextMenuProps> = ({
  menuItems,
  showMessage,
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleItemPress = (itemOnPress?: () => void) => {
    setIsVisible(false);
    itemOnPress?.();
  };

  const MenuContent = () => (
    <View style={styles.menuContainer}>
      {showMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{showMessage}</Text>
        </View>
      )}

      {!showMessage && menuItems.map((item, index) => {
        const Icon = item.icon as React.ComponentType<any>;

        return (
          <View key={item.label}>
            <TouchableOpacity
              onPress={() => handleItemPress(item.onPress)}
              style={styles.menuItem}
            >
              <Icon color={item.isDestructive ? DESTRUCTIVE_COLOR : colorPalette.stone[300]} width={18} height={18} />
              <Text style={[
                styles.menuItemText,
                item.isDestructive && styles.destructiveText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
            {index !== menuItems.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        );
      })}
    </View>
  );

  return (
    <Popover
      isVisible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      backgroundStyle={styles.popoverBackground}
      popoverStyle={styles.popover}
      arrowSize={{ width: 0, height: 0 }}
      offset={8}
      animationConfig={{
        duration: 300,
        easing: Easing.out(Easing.exp),
      }}
      from={
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          activeOpacity={0.7}
        >
          {children}
        </TouchableOpacity>
      }
    >
      <MenuContent />
    </Popover>
  );
};

const styles = StyleSheet.create({
  popoverBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  popover: {
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colorPalette.stone[700],
    minWidth: 200,
  },
  messageContainer: {
    padding: 8,
  },
  messageText: {
    color: 'white',
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: 'white',
  },
  destructiveText: {
    color: DESTRUCTIVE_COLOR,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default PopoverContextMenu;