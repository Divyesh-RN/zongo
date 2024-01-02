import {View, Text,TouchableOpacity} from 'react-native';
import React from 'react';
import {darkgreen01, white} from '../constants/Color';
import {FontSize, MEDIUM, SEMIBOLD} from '../constants/Fonts';
import Translate from '../translation/Translate';
import IconButton from './IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {pixelSizeHorizontal} from './ResponsiveScreen';

const HeaderBackView = ({title = '', onPressBack = {},onPressMenu = {}, isBack = true, isMenu= true}) => {
  return (
    <View
      style={{
        backgroundColor: darkgreen01,
        padding: isBack == true ? 0 : pixelSizeHorizontal(10),
        marginHorizontal: -22,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:"space-between"}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {isBack && (
          <IconButton additionalStyle={{marginLeft: 7}} onPress={onPressBack}>
            <Icon name="arrow-left" size={25} color={white} />
          </IconButton>
        )}
        <Text
          style={{
            fontSize: FontSize.FS_15,
            color: white,
            fontFamily: SEMIBOLD,
            marginHorizontal: isBack == true ? 0 : pixelSizeHorizontal(10),
          }}>
          {title}
        </Text>
        </View>
        {isMenu === true &&
        <TouchableOpacity onPress={onPressMenu}
         style={{marginRight:isBack == true ? 20 :10,}}>
        <Icon name="menu" size={24} color={white} />
        </TouchableOpacity>
        }
      </View>
    </View>
  );
};

export default HeaderBackView;
