import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar } from 'react-native';
import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FontSize, MEDIUM, SEMIBOLD } from '@constants/Fonts';
import { WIDTH } from '@constants/ConstantKey';
import { black, bgColor01, disableColor } from '@constants/Color';
import { grey } from '../../constants/Color';

const BottomSheet = ({ bottomSheetRef = "", selectedValue, Data, headerTitle, titleValue }) => {

    const RenderItem = ({ item }) => (
        <TouchableOpacity onPress={() => {
            bottomSheetRef.current.close();
            selectedValue(item)
        }}
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: disableColor,
                paddingVertical: 10,
            }}>
            <Text style={styles.title}>{item[titleValue]}</Text>
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
                        backgroundColor: bgColor01,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    },
                }}
            >
                <View style={{ marginTop: 20, marginBottom: 40 }}>
                    <Text style={[styles.title, { fontFamily: SEMIBOLD, textAlign: "center", textTransform: "capitalize", fontSize: FontSize.FS_14, marginBottom: 10 }]}>{headerTitle}</Text>
                    {Data?.length > 0 ? <FlatList
                        data={Data}
                        renderItem={({ item }) => <RenderItem item={item} />}
                        keyExtractor={item => item.id}
                    />
                        : <Text style={{
                            fontFamily: MEDIUM, textAlign: "center", fontSize: FontSize.FS_11, color: grey, justifyContent: "center", marginTop: "50%"
                        }}> No Data Found</Text>
                    }
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
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: MEDIUM,
        paddingHorizontal: 20,
    },
});
export default BottomSheet