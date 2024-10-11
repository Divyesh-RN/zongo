import { View, StyleSheet, StatusBar, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { goBack } from '../../../navigation/RootNavigation';
import { black, darkgreen01, greenPrimary, grey01, offWhite, red, white } from '../../../constants/Color';
import IconButton from '../../../commonComponents/IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Change_Password } from '../../../redux/api/Api';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import { useFocusEffect } from '@react-navigation/native';
import { resetAuthApiStatus } from '../../../redux/reducers/userReducer';
import { resetApiStatus } from '../../../redux/reducers/callReducer';
import LoadingView from '../../../commonComponents/LoadingView';

const ChangePassword = ({ navigation }) => {

    const [OldPassword, setOldPassword] = useState(''); //Test@123
    const [OldPasswordError, setOldPasswordError] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [NewPasswordError, setNewPasswordError] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [ConfirmPasswordError, setConfirmPasswordError] = useState('');

    const dispatch = useDispatch()
    const user_data = useSelector(state => state.userRedux.user_data);
    const isLoading = useSelector(state => state.userModuleRedux.isLoader);
    const apiChangePassword = useSelector(state => state.userRedux.apiChangePassword);
    
    useFocusEffect(
        useCallback(() => {

            return () => {
                dispatch(resetApiStatus())
                dispatch(resetAuthApiStatus())
            };
        }, [])
    );
    useEffect(() => {
        Log('apiChangePassword :', apiChangePassword);
        if (apiChangePassword == STATUS_FULFILLED) {
            Log("Password Changed")
            goBack()
        }
        else if (apiChangePassword == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiChangePassword]);

    const onUpdatePassword = () => {

        const errors = {};
        const passwordRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$`);
        if (OldPassword.trim() == "") {
            errors.oldPasswordError = "* Please enter a old password";
        }

        if (NewPassword.trim() == "") {
            errors.newPasswordError = "* Please enter a new password";
        }


        if (passwordRegex.test(NewPassword) == false) {
            errors.newPasswordError = "* Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.";
        }

        if (ConfirmPassword.trim() == "") {
            errors.confirmPasswordError = "* Please enter a confirm password";
        }
        if (NewPassword !== ConfirmPassword) {
            errors.confirmPasswordError = "* Password does not match";
        }
        // if (passwordRegex.test(ConfirmPassword) == false) {
        //     errors.confirmPasswordError = "* Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.";
        // }

        if (Object.keys(errors).length > 0) {
            setOldPasswordError(errors.oldPasswordError || "");
            setNewPasswordError(errors.newPasswordError || "");
            setConfirmPasswordError(errors.confirmPasswordError || "");
        } else {
            console.log("step 1")
            var dict = {
                old_password: OldPassword,
                new_password: NewPassword,
                uuid: user_data?.data?.user_uuid,
                createdby: user_data?.data?.user_uuid,
                type: "",
            };
            console.log("dict: ", dict);
            dispatch(Change_Password(dict));

        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={darkgreen01} barStyle="light-content" />
            <View style={styles.headerContainer}>
                <View style={styles.HStack}>
                    <View style={styles.row}>
                        <IconButton additionalStyle={{ marginLeft: 7 }} onPress={() => { goBack() }}>
                            <Icon name="arrow-left" size={24} color={white} />
                        </IconButton>
                        <Text style={styles.ProfileHeaderText}>{"Change Password"}</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                <View>
                    <Text style={styles.textInputLabel}>{"Old Password"}</Text>
                    <TextInput
                        value={OldPassword}
                        placeholder='Old Password'
                        placeholderTextColor={grey01}
                        style={styles.textInputStyle}
                        onChangeText={(txt) => {
                            setOldPassword(txt)
                            if (txt.length > 0) {
                                setOldPasswordError("")
                            }
                        }}
                    />
                    {OldPasswordError !== "" && <Text style={styles.errorText}>{OldPasswordError}</Text>}
                </View>
                <View>
                    <Text style={styles.textInputLabel}>{"New Password"}</Text>
                    <TextInput
                        value={NewPassword}
                        placeholder='New Password'
                        placeholderTextColor={grey01}
                        style={styles.textInputStyle}
                        onChangeText={(txt) => {
                            setNewPassword(txt)
                            const passwordRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$`);
                            if (passwordRegex.test(txt)) {
                                setNewPasswordError("")
                            }
                            else {
                                setNewPasswordError("* Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.")
                            }
                        }}
                    />
                    {NewPasswordError !== "" && <Text style={styles.errorText}>{NewPasswordError}</Text>}
                </View>
                <View>
                    <Text style={styles.textInputLabel}>{"Confirm Password"}</Text>
                    <TextInput
                        value={ConfirmPassword}
                        placeholder='Confirm Password'
                        placeholderTextColor={grey01}
                        style={styles.textInputStyle}
                        onChangeText={(txt) => {
                            setConfirmPassword(txt)
                            console.log("okko", ConfirmPassword == NewPassword)
                            if (txt == NewPassword) {
                                setConfirmPasswordError("")
                            }
                            else {
                                setConfirmPasswordError("* Password does not match")
                            }
                        }}
                    />
                    {ConfirmPasswordError !== "" && <Text style={styles.errorText}>{ConfirmPasswordError}</Text>}
                </View>
                <TouchableOpacity onPress={() => {onUpdatePassword() }}
                    style={{ backgroundColor: greenPrimary, paddingVertical: 8, borderRadius: 8, alignItems: "center", justifyContent: "center", marginVertical: 50 }}>
                    <Text style={{
                        fontSize: FontSize.FS_14,
                        color: white,
                        fontFamily: SEMIBOLD
                    }}>{"Update Password"}</Text>
                </TouchableOpacity>
            </View>
            {isLoading && <LoadingView />}
        </SafeAreaView>
    );
};

export default ChangePassword;

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
    errorText: {
        fontFamily: REGULAR,
        fontSize: FontSize.FS_10,
        color: red,
        marginTop: 2
    },

});
