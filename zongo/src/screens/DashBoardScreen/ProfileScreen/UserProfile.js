import { View, StyleSheet, StatusBar, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { goBack } from '../../../navigation/RootNavigation';
import { black, darkgreen01, disableColor, greenPrimary, grey, grey01, offWhite, paleGreen, red, white } from '../../../constants/Color';
import IconButton from '../../../commonComponents/IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BOLD, FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Get_Time_Zone_List, Get_User_Details, Update_Admin_Personal_Info } from '../../../redux/api/Api';
import { Log } from '../../../commonComponents/Log';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import BottomSheet from '../../../commonComponents/BottomSheet/BottomSheet';
import { useFocusEffect } from '@react-navigation/native';
import { resetUserModuleApiStatus } from '../../../redux/reducers/userModuleReducer';
import DocumentPicker from 'react-native-document-picker';
import { IMAGE_URL } from '../../../constants/ApiUrl';
import LoadingView from '../../../commonComponents/LoadingView';
import { resetAuthApiStatus } from '../../../redux/reducers/userReducer';
import ImageView from "react-native-image-viewing";

const UserProfile = ({ navigation }) => {
    const [FirstName, setFirstName] = useState('');
    const [FirstNameError, setFirstNameError] = useState('');
    const [LastName, setLastName] = useState('');
    const [LastNameError, setLastNameError] = useState('');
    const [Email, setEmail] = useState('');
    const [EmailError, setEmailError] = useState('');
    const [MobileNumber, setMobileNumber] = useState('');
    const [MobileNumberError, setMobileNumberError] = useState('');
    const [TimeZone, setTimeZone] = useState(null);
    const [TimeZoneError, setTimeZoneError] = useState("");
    const [ProfileImURI, setProfileImgURI] = useState("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");
    const [ProfileImg, setProfileImg] = useState(null);
    const [viewImgData, setViewImgData] = useState("");
    const [imgView, setImgView] = useState(false);
    const dispatch = useDispatch()

    const isLoading = useSelector(state => state.userModuleRedux.isLoader);
    const isLoading2 = useSelector(state => state.userRedux.isLoader);
    const apiGetTimeZoneList = useSelector(state => state.userModuleRedux.apiGetTimeZoneList);
    const time_zone_list = useSelector(state => state.userModuleRedux.time_zone_list);
    const user_data = useSelector(state => state.userRedux.user_data);
    const apiUpdateAdminPersonalInfo = useSelector(state => state.userRedux.apiUpdateAdminPersonalInfo);
    const apiGetUserDetails = useSelector(state => state.userModuleRedux.apiGetUserDetails);
    const isError = useSelector(state => state.userModuleRedux.isError);
    const error_message = useSelector(state => state.userModuleRedux.error_message);
    const user_details = useSelector(state => state.userModuleRedux.user_details);
    const callAllApi = async () => {
        GetTimeZoneList();
        GetUserDetails()
    }
    const GetUserDetails = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.useruuid = user_data?.data?.user_uuid,
                dispatch(Get_User_Details(dict))
        }
    }

    useFocusEffect(
        useCallback(() => {
            callAllApi()
            return () => {
                dispatch(resetUserModuleApiStatus());
                dispatch(resetAuthApiStatus());
            };
        }, [])
    )
    const GetTimeZoneList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Get_Time_Zone_List(dict))
        }
    }
    // get user Detsils
    useEffect(() => {
        Log('apiGetUserDetails :', apiGetUserDetails);
        if (apiGetUserDetails == STATUS_FULFILLED) {
            if (user_details !== null) {
                Log("user_details :", user_details)
                setEmail(user_details?.user?.email)
                setFirstName(user_details?.user?.first_name)
                setLastName(user_details?.user?.last_name)
                setMobileNumber(user_details?.user?.phone)
                if (user_details?.user?.time_zone !== null && user_details?.user?.timezone_name !== null) {
                    var timezone = {};
                    timezone.time_zone_uuid = user_details?.user?.time_zone
                    timezone.timezone_name = user_details?.user?.timezone_name
                    setTimeZone(timezone)
                }

                if (user_details?.user?.profile_image !== null) {
                    setProfileImgURI(IMAGE_URL + user_details?.user?.profile_image)
                }
                return

                var calledrId = {};
                calledrId.value = user_details?.user?.outbound_caller_id_uuid,
                    calledrId.label = user_details?.user?.did_number
                if (user_details?.user?.outbound_caller_id_uuid !== null && user_details?.user?.outbound_caller_id !== null) {
                    setCallerId(calledrId)
                }
                var extension = {};
                extension.extension_uuid = user_details?.user?.assign_extension
                extension.extension = user_details?.user?.extension
                if (user_details?.user?.assign_extension !== null && user_details?.user?.extension !== null) {
                    setExtension(extension)
                }

                setJobTitle(user_details?.user?.job_title)
                if (user_details?.user?.time_zone !== null && user_details?.user?.timezone_name !== null) {
                    var timezone = {};
                    timezone.time_zone_uuid = user_details?.user?.time_zone
                    timezone.timezone_name = user_details?.user?.timezone_name
                    setTimeZone(timezone)
                }
                if (user_details?.user?.role_uuid !== null && user_details?.user?.role !== null) {
                    var role = {};
                    role.role_uuid = user_details?.user?.role_uuid
                    role.role_name = user_details?.user?.role
                    setRole(role)
                }
                if (user_details?.user?.group_name !== null) {
                    var userGroup = {};
                    userGroup.name = user_details?.user?.group_name
                    setGroup(userGroup)
                }
                if (user_details?.user?.language !== null) {
                    var language = {};
                    language.language = user_details?.user?.language
                    setLanguage(language)
                }

            }
        } else if (apiGetUserDetails == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetUserDetails]);
    //update personal profile
    useEffect(() => {
        Log('apiUpdateAdminPersonalInfo :', apiUpdateAdminPersonalInfo);
        if (apiUpdateAdminPersonalInfo == STATUS_FULFILLED) {
            goBack()
        } else if (apiUpdateAdminPersonalInfo == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateAdminPersonalInfo]);
    // get time zone list
    useEffect(() => {
        Log('apiGetTimeZoneList :', apiGetTimeZoneList);
        if (apiGetTimeZoneList == STATUS_FULFILLED) {
            if (time_zone_list !== null) {
                // Log("time_zone_list :", time_zone_list)

            }
        } else if (apiGetTimeZoneList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetTimeZoneList]);

    const TimeZonebottomSheetRef = useRef(null);
    const openTimeZoneBottomSheet = () => {
        if (TimeZonebottomSheetRef.current) {
            TimeZonebottomSheetRef.current.open();
        }
    };


    const onUserProfileSave = () => {

        const errors = {};
        if (FirstName.trim() == "") {
            errors.firstNameError = "* Please enter a first name ";
        }

        if (LastName.trim() == "") {
            errors.lastNameError = "* Please enter a last name";
        }


        if (MobileNumber.trim() == "") {
            errors.phoneNumberError = "* Please enter a phone number";
        }


        if (TimeZone == null) {
            errors.timezoneError = "* Please select a time zone";
        }

        if (Object.keys(errors).length > 0) {
            setFirstNameError(errors.firstNameError || "");
            setLastNameError(errors.lastNameError || "");
            setMobileNumberError(errors.phoneNumberError || "");
            setTimeZoneError(errors.timezoneError || "");
            console.log("Error: ", errors)
        } else {
            let body = new FormData();
            body.append('profile_pic', user_details?.user?.profile_image)
            body.append('phone', MobileNumber)
            body.append('first_name', FirstName)
            body.append('last_name', LastName)
            body.append('createdby', user_data?.data?.user_uuid)
            body.append('main_uuid', user_data?.data?.main_uuid)
            body.append('user_uuid', user_data?.data?.user_uuid)
            body.append('time_zone', TimeZone?.time_zone_uuid)
            if (ProfileImg !== null) {
                for (let i = 0; i < ProfileImg.length; i++) {
                    body.append('file', ProfileImg[i]);
                }
                body.append('fileName', ProfileImg[0]?.name)
            }
            else {

                body.append('file', "")
                body.append('fileName', "")
            }
            dispatch(Update_Admin_Personal_Info(body))
            console.log(body)

        }
    };
    const handleProfile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                allowMultiSelection: false
            });
            const maxSize = 10 * 1024 * 1024;
            console.log("result: ", result)
            setProfileImg(result)
            setProfileImgURI(result[0]?.uri)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.error('Error picking document:', err);
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={darkgreen01} barStyle="light-content" />
            <View style={styles.headerContainer}>
                <View style={styles.HStack}>
                    <View style={styles.row}>
                        <IconButton additionalStyle={{ marginLeft: 7 }} onPress={() => { goBack() }}>
                            <Icon name="arrow-left" size={24} color={white} />
                        </IconButton>
                        <Text style={styles.ProfileHeaderText}>{"User Profile"}</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                <TouchableOpacity onPress={() => {
                    setImgView(true)
                    setViewImgData(ProfileImURI)
                }} style={{
                    padding: 2, borderRadius: 100, borderWidth: 1, borderColor: greenPrimary, backgroundColor: paleGreen,
                    alignSelf: "center", marginTop: 14, marginBottom: 8, shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,

                    elevation: 2,
                }}>
                    <Image
                        style={{ width: 90, height: 90, borderRadius: 100, resizeMode: "cover" }}
                        source={{ uri: ProfileImURI }}
                    />
                    <TouchableOpacity onPress={() => { handleProfile() }}
                        style={{
                            backgroundColor: paleGreen,
                            padding: 4, borderRadius: 100, position: "absolute", bottom: -4, right: -2, shadowColor: greenPrimary,
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,

                            elevation: 2,
                        }}>
                        <Icon name={"camera"} size={20} color={greenPrimary} />

                    </TouchableOpacity>
                </TouchableOpacity>
                <View>
                    <Text style={styles.textInputLabel}>{"First Name"}</Text>
                    <TextInput
                        value={FirstName}
                        placeholder='First Name'
                        placeholderTextColor={grey01}
                        style={styles.textInputStyle}
                        onChangeText={(txt) => {
                            setFirstName(txt)
                            if (txt.length > 0) {
                                setFirstNameError("")
                            }
                        }}
                    />
                    {FirstNameError !== "" && <Text style={styles.errorText}>{FirstNameError}</Text>}
                </View>
                <View>
                    <Text style={styles.textInputLabel}>{"Last Name"}</Text>
                    <TextInput
                        value={LastName}
                        placeholder='Last Name'
                        placeholderTextColor={grey01}
                        style={styles.textInputStyle}
                        onChangeText={(txt) => {
                            setLastName(txt)
                            if (txt.length > 0) {
                                setLastNameError("")
                            }
                        }}
                    />
                    {LastNameError !== "" && <Text style={styles.errorText}>{LastNameError}</Text>}
                </View>
                <View>
                    <Text style={styles.textInputLabel}>{"Email"}</Text>
                    <TextInput
                        editable={false}
                        value={Email}
                        placeholder='Email Address'
                        placeholderTextColor={grey01}
                        style={styles.textInputStyle}
                        onChangeText={(txt) => {
                            setEmail(txt)
                            if (txt.length > 0) {
                                setEmailError("")
                            }
                        }}
                    />
                    {EmailError !== "" && <Text style={styles.errorText}>{EmailError}</Text>}
                </View>
                <View>
                    <Text style={styles.textInputLabel}>{"Phone Number"}</Text>
                    <TextInput
                        keyboardType='decimal-pad'
                        value={MobileNumber}
                        placeholder='Phone Number'
                        placeholderTextColor={grey01}
                        style={styles.textInputStyle}
                        onChangeText={(txt) => {
                            setMobileNumber(txt)
                            if (txt.length > 7 && txt.length < 12) {
                                setMobileNumberError("");
                            }
                            else {
                                setMobileNumberError("* Please enter a valid phone number");

                            }
                        }}
                    />
                    {MobileNumberError !== "" && <Text style={styles.errorText}>{MobileNumberError}</Text>}
                </View>
                <Text style={styles.textInputLabel}>{"Time Zone"}</Text>
                <TouchableOpacity onPress={() => {
                    openTimeZoneBottomSheet()
                }}
                    style={{
                        borderRadius: 6,
                        paddingVertical: 7,
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        borderColor: grey01,
                    }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <Text style={{
                            fontSize: FontSize.FS_12,
                            color: TimeZone == null ? grey01 : black,
                            fontFamily: MEDIUM,
                        }}>{TimeZone == null ? "Select Time Zone" : TimeZone?.timezone_name}</Text>

                        <Icon name="chevron-down" size={22} color={grey} />
                    </View>
                </TouchableOpacity>

                {TimeZoneError !== "" && <Text
                    style={{
                        fontSize: FontSize.FS_10,
                        color: red,
                        fontFamily: MEDIUM,
                        marginTop: 4
                    }}>
                    {TimeZoneError}
                </Text>
                }
                <TouchableOpacity onPress={() => {
                    onUserProfileSave()
                }}
                    style={{ backgroundColor: greenPrimary, paddingVertical: 8, borderRadius: 8, alignItems: "center", justifyContent: "center", marginVertical: 50 }}>
                    <Text style={{
                        fontSize: FontSize.FS_14,
                        color: white,
                        fontFamily: SEMIBOLD
                    }}>{"Save Profile"}</Text>
                </TouchableOpacity>
            </View>
            <BottomSheet
                headerTitle={"Select Time Zone"}
                Data={time_zone_list}
                titleValue={"timezone_name"}
                bottomSheetRef={TimeZonebottomSheetRef}
                selectedValue={(data) => {
                    setTimeZone(data)
                    setTimeZoneError("")
                }} />
            <ImageView
                animationType={"fade"}
                images={[{ uri: viewImgData }]}
                imageIndex={0}
                visible={imgView}
                onRequestClose={() => setImgView(false)}
            />
            {(isLoading || isLoading2) && <LoadingView />}
        </SafeAreaView>
    );
};

export default UserProfile;

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
        marginTop: 4
    },

});
