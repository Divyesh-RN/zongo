import { View, StyleSheet, StatusBar, TouchableOpacity, Text, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { goBack, navigate, resetScreen } from '../../../navigation/RootNavigation';
import { black, darkgreen01, disableColor, grey, offWhite, red, white } from '../../../constants/Color';
import IconButton from '../../../commonComponents/IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import { storeData } from '../../../commonComponents/AsyncManager';
import { USER_DATA } from '../../../constants/ConstantKey';
import { storeUserData } from '../../../redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = ({ navigation }) => {

    const dispatch = useDispatch()
    const [Role, setRole] = useState("");
    const user_data = useSelector(state => state.userRedux.user_data);

    useEffect(() =>{
if(user_data !== null){
    setRole(user_data?.data?.role)
}
    },[user_data])

    const hadnleLogout = (item) => {
        Alert.alert(
            //title
            "Alert",
            //body
            'Are you sure want to logout?',
            [
                {
                    text: 'No',
                    onPress: () => {}, style: 'cancel'
                },
                {
                    text: 'Logout',
                    onPress: () => {
                        storeData(USER_DATA, null, () => {
                            dispatch(storeUserData(null));
                            resetScreen('Login');
                        });
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={darkgreen01} barStyle="light-content" />
            <View style={styles.headerContainer}>
                <View style={styles.HStack}>
                    <View style={styles.row}>
                        <IconButton additionalStyle={{ marginLeft: 7 }} onPress={() => { goBack() }}>
                            <Icon name="arrow-left" size={25} color={white} />
                        </IconButton>
                        <Text style={styles.ProfileHeaderText}>{"Profile settings"}</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                <TouchableOpacity onPress={() => {
                    navigate("UserProfile")
                }} style={styles.rowContainer}>
                    <View style={styles.row}>
                        <View style={styles.rowRoundIcon}>
                            <Icon name="account" size={18} color={white} />
                        </View>
                        <View>
                            <Text style={styles.rowTitleText}>{'User Profile'}</Text>
                            <Text style={styles.rowSubTitleText}>{'• Edit user profile'}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigate("ChangePassword")
                }} style={styles.rowContainer}>
                    <View style={styles.row}>
                        <View style={[styles.rowRoundIcon, { backgroundColor: "#3876BF", }]}>
                            <Icon name="lock-outline" size={18} color={white} />
                        </View>
                        <View>
                            <Text style={styles.rowTitleText}>{'Change Password'}</Text>
                            <Text style={styles.rowSubTitleText}>{'• Password Change'}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    navigate("E911User")
                }} style={styles.rowContainer}>
                    <View style={styles.row}>
                        <View style={[styles.rowRoundIcon, { backgroundColor: "#DF826C", }]}>
                            <Icon name="map-marker-account-outline" size={18} color={white} />
                        </View>
                        <View>
                            <Text style={styles.rowTitleText}>{'E911'}</Text>
                            <Text style={styles.rowSubTitleText}>{'• E911 address'}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {Role == "admin" && <TouchableOpacity onPress={() => {
                    navigate("CompanyProfile")
                }} style={styles.rowContainer}>
                    <View style={styles.row}>
                        <View style={[styles.rowRoundIcon, { backgroundColor: "#7BD3EA", }]}>
                            <Icon name="domain" size={18} color={white} />
                        </View>
                        <View>
                            <Text style={styles.rowTitleText}>{'Company Profile'}</Text>
                            <Text style={styles.rowSubTitleText}>{'• Edit company profile'}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                }
                {/* {Role == "admin" && <TouchableOpacity onPress={() => {
                    navigate("CompanySignatature")
                }} style={styles.rowContainer}>
                    <View style={styles.row}>
                        <View style={[styles.rowRoundIcon, { backgroundColor: "#265073", }]}>
                            <Icon name="draw-pen" size={18} color={white} />
                        </View>
                        <View>
                            <Text style={styles.rowTitleText}>{'Company Signature'}</Text>
                            <Text style={styles.rowSubTitleText}>{'• Edit company signature'}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                } */}

            </View>

            <TouchableOpacity onPress={() => {
               hadnleLogout()
            }}
                style={styles.logoutRowCOntainer}>
                <MaterialIcons name="logout" size={18} color={red} />
                <Text style={styles.logoutText}>{"Logout"} </Text>
            </TouchableOpacity>
            {/* {isLoading && <LoadingView />} */}
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    logoutRowCOntainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 30,
        marginVertical: 12,
    },
    logoutText: {
        fontSize: FontSize.FS_12,
        color: red,
        fontFamily: MEDIUM,
        marginHorizontal: 10,
    },
    rowSubTitleText: {
        fontSize: FontSize.FS_10,
        color: grey,
        fontFamily: MEDIUM,
        marginLeft: 10
        ,
    },
    rowTitleText: {
        fontSize: FontSize.FS_14,
        color: black,
        fontFamily: MEDIUM,
        marginLeft: 10
        ,
    },
    rowRoundIcon: {
        width: 34,
        height: 34,
        borderRadius: 50,
        backgroundColor: "#ADBC9F",
        alignItems: "center",
        justifyContent: "center",
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 14,
        paddingBottom: 14,
        paddingHorizontal: 20,
        marginHorizontal: -20,
        borderBottomWidth: 0.5,
        borderBottomColor: disableColor
        ,
    },
    ProfileHeaderText: {
        fontSize: FontSize.FS_17,
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

});
