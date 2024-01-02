import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, Image, SectionList } from 'react-native';
import React, { useState } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FontSize, MEDIUM, SEMIBOLD } from '@constants/Fonts';
import { HEIGHT, WIDTH } from '@constants/ConstantKey';
import { black, bgColor01, red, greenPrimary, disableColor } from '@constants/Color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SectionBottomSheet = ({ data = [], bottomSheetRef = "", selectedValue, headerTitle = "", currentValue = "", selectedRoute, selectedRouteType }) => {
console.log("currentValue :",currentValue)
    const [selectedNumber, setSelectedNumber] = useState("");
    const convertToSectionListData = (data) => {
        const sectionMap = {};

        data.forEach((item) => {
            const { optgroup, text, value } = item;
            if (!sectionMap[optgroup]) {
                sectionMap[optgroup] = [];
            }

            sectionMap[optgroup].push({ text, value });
        });

        const sections = Object.keys(sectionMap).map((optgroup) => ({
            optgroup, // Include the optgroup key
            title: optgroup,
            data: sectionMap[optgroup],
        }));

        return sections;
    };


    const structuredData = convertToSectionListData(data);
    const RenderItem = ({ item, section }) => (
        <TouchableOpacity onPress={() => {
            selectedValue(item.text)
            setSelectedNumber(item.value)
            selectedRoute(item.value)
            selectedRouteType(section?.title)

            bottomSheetRef.current.close();

        }}
            style={{ flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-between",
            borderBottomWidth:1,
            borderBottomColor:disableColor,
            paddingVertical:14, }}>
            <Text style={styles.title}>{item.text}</Text>
            {currentValue == item.value &&
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
                        backgroundColor: bgColor01,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    },
                }}
            >
                <View style={{ marginTop: 20, paddingHorizontal: 25, marginBottom: 40 }}>
                    <Text style={{ fontFamily: SEMIBOLD, textAlign: "center", textTransform: "capitalize", fontSize: FontSize.FS_14, color: black }}>{headerTitle}</Text>
                    {structuredData && <SectionList
                        sections={structuredData}
                        keyExtractor={(item, index) => item.value + index}
                        renderItem={({ item, section }) => <RenderItem item={item} section={section} />}
                        renderSectionHeader={({ section: { title } }) => (
                            <>
                                <Text style={styles.header}>{title}</Text>
                            </>
                        )}
                    />
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
        fontSize: FontSize.FS_13,
        color: black,
        fontFamily: MEDIUM,
        marginLeft: 14,
    },
    header: {
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: SEMIBOLD,
        marginTop: 16,
    },
});
export default SectionBottomSheet