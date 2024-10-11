
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import React from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { disableColor, greenPrimary, grey } from '@constants/Color';
import { navigate } from '@navigation/RootNavigation';

const MessageModule = ({ navigation }) => {

    return (
        <>
            <HeaderBackView
                title="SMS"
                isBack={true}
                isMenu={false}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
            <TouchableOpacity onPress={() => { navigate("Message") }} style={styles.cardContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name={"message-reply-text-outline"} size={18} color={greenPrimary} />
                    <Text style={styles.textTitle}>{"Chat Sms"}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Icon name={"chevron-right"} size={25} color={grey} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigate("MessageLog") }} style={styles.cardContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name={"forum-outline"} size={18} color={greenPrimary} />
                    <Text style={styles.textTitle}>{"Sms Logs"}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Icon name={"chevron-right"} size={25} color={grey} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigate("SmsTemplate") }} style={styles.cardContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name={"forum-outline"} size={18} color={greenPrimary} />
                    <Text style={styles.textTitle}>{"Sms Template"}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Icon name={"chevron-right"} size={25} color={grey} />
                </View>
            </TouchableOpacity>
        </>
    );
};

export default MessageModule;

const styles = StyleSheet.create({
    cardContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: disableColor
        ,
    },
    textTitle: {
        fontSize: FontSize.FS_14,
        color: black,
        fontFamily: SEMIBOLD,
        lineHeight: 24,
        marginLeft: 14
        ,
    },
});
