import { View, StyleSheet, StatusBar, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { goBack } from '../../../navigation/RootNavigation';
import { black, darkgreen01, disableColor, greenPrimary, grey, grey01, offWhite, red, white } from '../../../constants/Color';
import IconButton from '../../../commonComponents/IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BOLD, FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

const CompanySignatature = ({ navigation }) => {


    const dispatch = useDispatch()
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={darkgreen01} barStyle="light-content" />
            <View style={styles.headerContainer}>
                <View style={styles.HStack}>
                    <View style={styles.row}>
                        <IconButton additionalStyle={{ marginLeft: 7 }} onPress={() => { goBack() }}>
                            <Icon name="arrow-left" size={24} color={white} />
                        </IconButton>
                        <Text style={styles.ProfileHeaderText}>{"Company Signature"}</Text>
                    </View>
                </View>
            </View>
            {/* <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                <TouchableOpacity onPress={() => {

                }}
                    style={{ backgroundColor: greenPrimary, paddingVertical: 8, borderRadius: 8, alignItems: "center", justifyContent: "center", marginVertical: 50 }}>
                    <Text style={{
                        fontSize: FontSize.FS_14,
                        color: white,
                        fontFamily: SEMIBOLD
                    }}>{"Save"}</Text>
                </TouchableOpacity>
            </View> */}


            {/* {isLoading && <LoadingView />} */}
        </SafeAreaView>
    );
};

export default CompanySignatature;

const styles = StyleSheet.create({

    ProfileHeaderText: {
        fontSize: FontSize.FS_15,
        color: white,
        fontFamily: SEMIBOLD,
        marginHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    HStack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
    },
    headerContainer: {
        backgroundColor: darkgreen01,
        paddingTop: 20,
    },
    container: {
        backgroundColor: offWhite,
        flex: 1
        ,
    },
    textInputLabel: {
        fontSize: FontSize.FS_13,
        color: black,
        fontFamily: SEMIBOLD,
        marginTop: 24,
        marginBottom: 8
        ,
    },
    textInputStyle: {
        borderWidth: 1,
        borderColor: grey01,
        height: 38,
        borderRadius: 6,
        paddingHorizontal: 14,
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: MEDIUM,
    },

});
