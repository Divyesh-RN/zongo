import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, Image } from 'react-native'
import React, { useRef } from 'react'
import RBSheet from 'react-native-raw-bottom-sheet';
import { bgColor01, black, midGreen, white } from '../constants/Color';
import { FontSize, MEDIUM } from '../constants/Fonts';
import { HEIGHT } from '../constants/ConstantKey';
import { ic_dashboard } from '../constants/Images';

const CustomBottomSheet = ({onPress ={} , bottomSheetRef = "",}) => {

    // const bottomSheetRef = useRef(null);

    // const openBottomSheet = () => {
    //     if (bottomSheetRef.current) {
    //       bottomSheetRef.current.open();
    //     }
    //   };

    const DATA = [
      {
        id: 1,
        title: 'Dashboard',
        image: ic_dashboard,
      },
      {
        id: 2,
        title: 'Inbound Numbers',
        image: ic_dashboard,
      },
      {
        id: 3,
        title: 'Extensions',
        image: ic_dashboard,
      },
      {
        id: 4,
        title: 'Auto Attendant',
        image: ic_dashboard,
      },
      {
        id: 5,
        title: 'Business Hours',
        image: ic_dashboard,
      },
      {
        id: 6,
        title: 'Audio Files',
        image: ic_dashboard,
      },
      {
        id: 7,
        title: 'Ring Groups',
        image: ic_dashboard,
      },
      {
        id: 8,
        title: 'Call Campaigns',
        image: ic_dashboard,
      },
      {
        id: 9,
        title: 'Blocked Numbers',
        image: ic_dashboard,
      },
      {
        id: 10,
        title: 'DNC List',
        image: ic_dashboard,
      },
      {
        id: 11,
        title: 'Dashlets',
        image: ic_dashboard,
      },
    ];

    const RenderItem = ({item}) => (
        <TouchableOpacity onPress={() =>{
            bottomSheetRef.current.close();
        }}
         style={{
            flexDirection:"row",
            alignItems:"center",
            borderBottomWidth:1,
            borderBlockColor:" rgba(255, 255, 255, 0.25)",
            paddingVertical:14
            }}>
               <Image
                style={{width: 24, height: 24,marginRight:18}}
                  tintColor={black}
                  resizeMode="contain"
                  source={item.image}
                />
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      );
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
    <RBSheet
    animationType={"slide"}
      ref={bottomSheetRef}
    //   minClosingHeight={200}
      height={HEIGHT - 200}
      duration={200}
      customStyles={{
        container: {
        //   justifyContent: 'center',
        //   alignItems: 'center',
          backgroundColor:bgColor01,
          borderTopLeftRadius:20,
          borderTopRightRadius:20
        },
      }}
    >
      {/* Content of the bottom sheet */}
      <View style={{marginTop:20,marginHorizontal:25,marginBottom:40}}>
      <FlatList
        data={DATA}
        renderItem={({item}) => <RenderItem item={item} />}
        keyExtractor={item => item.id}
      />
      </View>
    </RBSheet>
  </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    title: {
      fontSize: FontSize.FS_18,
      color:black,
      fontFamily:MEDIUM
    },
  });
export default CustomBottomSheet