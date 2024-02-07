import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FontSize, MEDIUM, SEMIBOLD } from '../../constants/Fonts';
import { WIDTH } from '../../constants/ConstantKey';
import { black, bgColor01, greenPrimary, disableColor } from '../../constants/Color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DestinationBottomSheet = ({data=[], bottomSheetRef = "", selectedValue, headerTitle = "",currentValue = "",selectedDestination }) => {

    const [selectedNumber, setSelectedNumber] = useState("");

    const RenderItem = ({ item }) => (
        <TouchableOpacity onPress={() => {
            bottomSheetRef.current.close();
            selectedValue(item.text)
            setSelectedNumber(item.text)
            selectedDestination(item.value)
        }}
            style={styles.TitleContainer}>
            <Text style={styles.title}>{item.text}</Text>
            {currentValue == item.value &&
                <Icon name={"check"} size={22} color={greenPrimary} />
            }
        </TouchableOpacity>
    );
    return (
        <View style={styles.container}>
            <RBSheet
                animationType={"slide"}
                ref={bottomSheetRef}
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
                <View style={styles.bottomsheetContainer}>
                    <Text style={styles.HeaderTitle}>{headerTitle}</Text>
                    <FlatList
                        data={data}
                        renderItem={({ item }) => <RenderItem item={item} />}
                        keyExtractor={item => item.value}
                    />
                </View>
            </RBSheet>
        </View>
    )
}
const styles = StyleSheet.create({
    bottomsheetContainer: {
        marginTop: 20,
        paddingHorizontal: 25,
        marginBottom: 40,
    },
    HeaderTitle: {
        fontFamily: SEMIBOLD,
        textAlign: "center",
        textTransform: "capitalize",
        fontSize: FontSize.FS_14,
        color: black,
    },
    TitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: disableColor,
        paddingVertical: 14,
    },
    container: {
        flex: 1,
         justifyContent: 'center',
          alignItems: 'center',
    },
    title: {
        fontSize: FontSize.FS_14,
        color: black,
        fontFamily: MEDIUM
    },
});
export default DestinationBottomSheet