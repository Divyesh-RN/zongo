import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Text>Toggle Drawer</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.drawer}>
          {/* Content for the drawer */}
          <Text>Drawer Content</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200, // Adjust width according to your preference
    height: '100%',
    backgroundColor: '#fff',
    elevation: 16, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginHorizontal:-20,
  },
});

export default CustomDrawer;
