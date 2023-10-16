import {View, Text} from 'react-native';
import React from 'react';
import HeaderView from '../../commonComponents/HeaderView';
import {pixelSizeHorizontal} from '../../commonComponents/ResponsiveScreen';
import {ScrollView} from 'react-native-gesture-handler';

const DashBoard = () => {
  return (
    <>
      <HeaderView
        title={'Zongo'}
        isProfilePic={true}
        imgUri={
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
        }
        containerStyle={{
          paddingHorizontal: pixelSizeHorizontal(20),
        }}>
         
        </HeaderView>
    </>
  );
};

export default DashBoard;
