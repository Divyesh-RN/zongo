import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import { darkgreen01, transparent, white } from '../constants/Color';
import { FontSize, SEMIBOLD } from '../constants/Fonts';
import IconButton from './IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { pixelSizeHorizontal } from './ResponsiveScreen';

const HeaderBackView = ({ title = '', onPressBack = {}, onPressMenu = {}, isBack = true, isMenu = true }) => {
  return (
    <SafeAreaView>
      <StatusBar translucent={true} barStyle={'light-content'} backgroundColor={transparent} />
      <View
        style={[styles.HeaderBackContainer, { padding: isBack == true ? 0 : pixelSizeHorizontal(10) }]}>
        <View style={styles.HStack}>
          <View style={styles.displayFlex}>
            {isBack && (
              <IconButton additionalStyle={{ marginLeft: 7 }} onPress={onPressBack}>
                <Icon name="arrow-left" size={25} color={white} />
              </IconButton>
            )}
            <Text style={[styles.headerTitleText, { marginHorizontal: isBack == true ? 0 : pixelSizeHorizontal(10) }]}>{title}</Text>
          </View>
          {isMenu && (
            <TouchableOpacity onPress={onPressMenu} style={styles.menuButton(isBack)}>
              <Icon name="menu" size={24} color={white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HeaderBackView;

const styles = StyleSheet.create({
  HeaderBackContainer: {
    backgroundColor: darkgreen01,
    paddingTop: 30,
    paddingBottom: 6
    ,
  },
  HStack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
  },
  displayFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: FontSize.FS_15,
    color: white,
    fontFamily: SEMIBOLD,
  },
  menuButton: (isBack) => ({
    marginRight: isBack ? 20 : 10,
  }),
})