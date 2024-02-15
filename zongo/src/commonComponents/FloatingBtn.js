import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { greenPrimary, grey, white } from '../constants/Color';


const FloatingBtn = ({ onPress,iconName }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Icon name={iconName} size={20} color={white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: grey, // adjust this to your desired color
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // for shadow on Android
    zIndex: 999, // to ensure the button is above other components
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default FloatingBtn;
