
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import React from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { disableColor, greenPrimary, grey } from '@constants/Color';
import { navigate } from '@navigation/RootNavigation';

const FileTypeList = ({ navigation }) => {

    return (
        <>
            <HeaderView
                title={'Zongo'}
                isProfilePic={true}
                imgUri={
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
                containerStyle={{
                    marginHorizontal: pixelSizeHorizontal(0),
                }}>
                <View style={{ marginHorizontal: 20 }}>
                    <HeaderBackView
                        title="Audio Files"
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                </View>
                <TouchableOpacity onPress={() => { navigate("AudioFiles", { type: "ivr" }) }} style={styles.cardContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon name={"clock-time-three-outline"} size={24} color={greenPrimary} />
                        <Text style={styles.textTitle}>{"IVR"}</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Icon name={"chevron-right"} size={25} color={grey} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigate("AudioFiles", { type: "moh" }) }} style={styles.cardContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon name={"music-box-outline"} size={24} color={greenPrimary} />
                        <Text style={styles.textTitle}>{"MoH"}</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Icon name={"chevron-right"} size={25} color={grey} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigate("AudioFiles", { type: "vm_greeting" }) }} style={styles.cardContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon name={"file-document-outline"} size={24} color={greenPrimary} />
                        <Text style={styles.textTitle}>{"VM Greeting"}</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Icon name={"chevron-right"} size={25} color={grey} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigate("AudioFiles", { type: "call_blast" }) }} style={styles.cardContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon name={"broadcast"} size={24} color={greenPrimary} />
                        <Text style={styles.textTitle}>{"Voice BrodCast"}</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Icon name={"chevron-right"} size={25} color={grey} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigate("AudioFiles", { type: "announcement" }) }} style={styles.cardContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon name={"bullhorn-outline"} size={24} color={greenPrimary} />
                        <Text style={styles.textTitle}>{"Announcement"}</Text>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Icon name={"chevron-right"} size={25} color={grey} />
                    </View>
                </TouchableOpacity>
            </HeaderView>
        </>
    );
};

export default FileTypeList;

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
