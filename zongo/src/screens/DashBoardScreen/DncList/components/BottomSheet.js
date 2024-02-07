import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar } from 'react-native';
import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FontSize, MEDIUM, SEMIBOLD } from '@constants/Fonts';
import { WIDTH } from '@constants/ConstantKey';
import { black, bgColor01, disableColor } from '@constants/Color';

const BottomSheet = ({onPress ={} , bottomSheetRef = "",selectedValue,Data,title,type}) => {

    const RenderItem = ({item}) => (
        <TouchableOpacity onPress={() =>{
            bottomSheetRef.current.close();
            selectedValue(item)
        }}
         style={{
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between",
            borderBottomWidth:1,
            borderBottomColor:disableColor,
            paddingVertical:14,
            }}>
              
          <Text style={styles.title}>{type == "area_code"? item.area_code : item?.state_name}</Text>
        </TouchableOpacity>
      );
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
    <RBSheet
    animationType={"slide"}
      ref={bottomSheetRef}
    //   minClosingHeight={200}
      height={WIDTH}
      duration={200}
      customStyles={{
        container: {
          backgroundColor:bgColor01,
          borderTopLeftRadius:20,
          borderTopRightRadius:20
        },
      }}
    >
      {/* Content of the bottom sheet */}
      <View style={{marginTop:20,paddingHorizontal:25,marginBottom:40}}>
        <Text style={[styles.title,{fontFamily:SEMIBOLD,textAlign:"center",textTransform:"capitalize",fontSize:FontSize.FS_14}]}>{title}</Text>
      <FlatList
        data={Data}
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
      fontSize: FontSize.FS_13,
      color:black,
      fontFamily:MEDIUM
    },
  });
export default BottomSheet