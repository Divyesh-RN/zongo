import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, Image } from 'react-native';
import React, { useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FontSize, MEDIUM, SEMIBOLD } from '@constants/Fonts';
import { HEIGHT, WIDTH } from '@constants/ConstantKey';
import { black,bgColor01, red, greenPrimary, disableColor } from '@constants/Color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PrefixBottomSheet = ({onPress ={} , bottomSheetRef = "",selectedValue,Name,selectedId}) => {

    const [SelectedId, setSelectedId] = useState(1);

    const RenderItem = ({item}) => (
        <TouchableOpacity onPress={() =>{
            bottomSheetRef.current.close();
            selectedValue(item)
            setSelectedId(item?.id)
        }}
         style={{
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between",
            borderBottomWidth:1,
            borderBottomColor:disableColor,
            paddingVertical:14,
            }}>
          <Text style={styles.title}>{item.prefix}</Text>
          {selectedId?.prefix_uuid == item.prefix_uuid &&
                <Icon name={"check"} size={22} color={greenPrimary} />
            }
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
        <Text style={[styles.title,{fontFamily:SEMIBOLD,textAlign:"center",textTransform:"capitalize",fontSize:FontSize.FS_14}]}>{"Select Item"}</Text>
      <FlatList
        data={Name}
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
export default PrefixBottomSheet