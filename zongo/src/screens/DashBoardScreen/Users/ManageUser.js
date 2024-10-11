
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black, disableColor, greenPrimary, grey, grey01, paleGreen, red, white } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
    Get_Extension_List_Dropdown,
    Get_Language_List,
    Get_Number_List_Dropdown,
    Get_Role_List_Dp,
    Get_Time_Zone_List,
    Get_User_Details,
    Group_List,
    Update_User,
    Update_User_group,
} from '../../../redux/api/Api';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import LoadingView from '../../../commonComponents/LoadingView';
import { useFocusEffect } from '@react-navigation/native';
import { resetUserModuleApiStatus } from '../../../redux/reducers/userModuleReducer';
import BottomSheet from '../../../commonComponents/BottomSheet/BottomSheet';
import { TextInput } from 'react-native-gesture-handler';
import { IMAGE_URL } from '../../../constants/ApiUrl';
import DocumentPicker from 'react-native-document-picker';
import { navigate } from '../../../navigation/RootNavigation';
import Global from '../../../constants/Global';

const ManageUser = ({ navigation, route }) => {

    const [TitleHeader, setTitleHeader] = useState(route?.params?.item?.first_name + " " + route?.params?.item?.last_name || "");
    const [Extension, setExtension] = useState(null);
    const [ExtensionError, setExtensionError] = useState("");
    const [CallerId, setCallerId] = useState(null);
    const [CallerIdError, setCallerIdError] = useState("");
    const [FirstNameError, setFirstNameError] = useState("");
    const [FirstName, setFirstName] = useState("");
    const [FirstNameEdit, setFirstNameEdit] = useState(false);
    const [LastNameError, setLastNameError] = useState("");
    const [LastName, setLastName] = useState("");
    const [LastNameEdit, setLastNameEdit] = useState(false);
    const [Email, setEmail] = useState("");
    const [JobTitle, setJobTitle] = useState("");
    const [JobTitleError, setJobTitleError] = useState("");
    const [JobTitleEdit, setJobTitleEdit] = useState(false);
    const [TimeZone, setTimeZone] = useState(null);
    const [TimeZoneError, setTimeZoneError] = useState("");
    const [Role, setRole] = useState(null);
    const [RoleError, setRoleError] = useState("");
    const [Group, setGroup] = useState(null);
    const [GroupError, setGroupError] = useState("");
    const [Language, setLanguage] = useState(null);
    const [LanguageError, setLanguageError] = useState("");

    const [ProfileImg, setProfileImg] = useState(null);
    const [ProfileImURI, setProfileImgURI] = useState("https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png");

    // const [Socket, setSocket] = useState(null);
    const dispatch = useDispatch();

    const apiGetUserDetails = useSelector(state => state.userModuleRedux.apiGetUserDetails);
    const user_details = useSelector(state => state.userModuleRedux.user_details);

    const apiGetTimeZoneList = useSelector(state => state.userModuleRedux.apiGetTimeZoneList);
    const time_zone_list = useSelector(state => state.userModuleRedux.time_zone_list);

    const apiGetRoleDp = useSelector(state => state.userModuleRedux.apiGetRoleDp);
    const role_list = useSelector(state => state.userModuleRedux.role_list);

    const apiGetLanguageList = useSelector(state => state.userModuleRedux.apiGetLanguageList);
    const language_list = useSelector(state => state.userModuleRedux.language_list);

    const apiGetNumberList = useSelector(state => state.userModuleRedux.apiGetNumberList);
    const number_list = useSelector(state => state.userModuleRedux.number_list);

    const apiGetExtensionListDropDown = useSelector(state => state.userModuleRedux.apiGetExtensionListDropDown);
    const extension_list = useSelector(state => state.userModuleRedux.extension_list);

    const apiUpdateUserGroup = useSelector(state => state.userModuleRedux.apiUpdateUserGroup);
    const apiGetGroupList = useSelector(state => state.userModuleRedux.apiGetGroupList);
    const group_list = useSelector(state => state.userModuleRedux.group_list);

    const apiUpdateUser = useSelector(state => state.userModuleRedux.apiUpdateUser);


    const isLoading = useSelector(state => state.userModuleRedux.isLoader);
    const isError = useSelector(state => state.userModuleRedux.isError);
    const error_message = useSelector(state => state.userModuleRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);


    const GetUserDetails = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.useruuid = route?.params?.item?.uuid,
                dispatch(Get_User_Details(dict))
        }
    }

    const GetCalledIdList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.action = "update",
                dict.assign_number = route?.params?.item?.uuid,
                dict.createdby = user_data?.data?.user_uuid,
                dict.group_per = "all",
                dict.group_uuid = "",
                dict.main_uuid = user_data?.data?.main_uuid,
                dict.user_type = "admin"
            dispatch(Get_Number_List_Dropdown(dict))
        }
    }

    const GetExtensionList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.action = "update",
                dict.createdby = user_data?.data?.user_uuid,
                dict.group_per = "all",
                dict.group_uuid = "",
                dict.main_uuid = user_data?.data?.main_uuid,
                dict.user_type = "admin"
            dispatch(Get_Extension_List_Dropdown(dict))
        }
    }

    const GetTimeZoneList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Get_Time_Zone_List(dict))
        }
    }

    const GetRoleList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Get_Role_List_Dp(dict))
        }
    }

    const GetGroupList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.group_per = "all",
                dict.group_uuid = "",
                dict.limits = "show_all",
                dict.main_uuid = user_data?.data?.main_uuid,
                dict.off_set = 0,
                dict.orderby = "created_at ASC",
                dict.search = "",
                dict.status = "ACTIVE",
                dict.user_type = "admin"
            dispatch(Group_List(dict))
        }
    }

    const GetLanguageList = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Get_Language_List(dict))
        }
    }

    const callAllApi = async () => {
        GetUserDetails();
        GetCalledIdList();
        GetExtensionList();
        GetTimeZoneList();
        GetRoleList();
        GetGroupList();
        GetLanguageList();
    }

    useFocusEffect(
        useCallback(() => {
            callAllApi()
            return () => {
                dispatch(resetUserModuleApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiGetUserDetails :', apiGetUserDetails);
        if (apiGetUserDetails == STATUS_FULFILLED) {
            if (user_details !== null) {
                Log("user_details :", user_details)
                setEmail(user_details?.user?.email)
                setFirstName(user_details?.user?.first_name)
                setLastName(user_details?.user?.last_name)
                if (user_details?.user?.profile_image !== null) {
                    setProfileImgURI(IMAGE_URL + user_details?.user?.profile_image)
                }
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

    // get called id list
    useEffect(() => {
        Log('apiGetNumberList :', apiGetNumberList);
        if (apiGetNumberList == STATUS_FULFILLED) {
            if (number_list !== null) {
                Log("number_list :", number_list)

            }
        } else if (apiGetNumberList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetNumberList]);

    // get extension list
    useEffect(() => {
        Log('apiGetExtensionListDropDown :', apiGetExtensionListDropDown);
        if (apiGetExtensionListDropDown == STATUS_FULFILLED) {
            if (extension_list !== null) {
                Log("extension_list :", extension_list)

            }
        } else if (apiGetExtensionListDropDown == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetExtensionListDropDown]);

    // get time zone list
    useEffect(() => {
        Log('apiGetTimeZoneList :', apiGetTimeZoneList);
        if (apiGetTimeZoneList == STATUS_FULFILLED) {
            if (time_zone_list !== null) {
                Log("time_zone_list :", time_zone_list)

            }
        } else if (apiGetTimeZoneList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetTimeZoneList]);

    // role list
    useEffect(() => {
        Log('apiGetRoleDp :', apiGetRoleDp);
        if (apiGetRoleDp == STATUS_FULFILLED) {
            if (role_list !== null) {
            }
        } else if (apiGetRoleDp == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetRoleDp]);

    //group list
    useEffect(() => {
        Log('apiGetGroupList :', apiGetGroupList);
        if (apiGetGroupList == STATUS_FULFILLED) {
            if (group_list !== null) {
            }
        } else if (apiGetGroupList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetGroupList]);

    // update group user
    const UpdateUserGroup = (id) => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.group_uuid = id
            dict.user_uuid = user_data?.data?.user_uuid,
                dispatch(Update_User_group(dict))
        }
    }

    useEffect(() => {
        Log('apiUpdateUserGroup :', apiUpdateUserGroup);
        if (apiUpdateUserGroup == STATUS_FULFILLED) {
            callAllApi()
        } else if (apiUpdateUserGroup == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateUserGroup]);

    //lanaguage list
    useEffect(() => {
        Log('apiGetLanguageList :', apiGetLanguageList);
        if (apiGetLanguageList == STATUS_FULFILLED) {
            if (language_list !== null) {
            }
        } else if (apiGetLanguageList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetLanguageList]);

    // update user details

    const handleUpdateUser = () => {

        if (FirstName == "") {
            setFirstNameError("* Please enter first name")

        }
        if (LastName == "") {
            setLastNameError("* Please enter last name")
        }
        if (Role == null) {
            setRoleError("* Please select role")
        }
        if (Extension == null) {
            setExtensionError("* Please select extension")
        }
        if (JobTitle == "") {
            setJobTitleError("* Please enter job title")
        }
        if (TimeZone == null) {
            setTimeZoneError("Please select time zone")
        }
        if (Language == null) {
            setLanguageError("Please select language")
        }
        else {
            let body = new FormData();
            body.append('first_name', FirstName)
            body.append('last_name', LastName)
            body.append('email', Email)
            body.append('role_uuid', Role?.role_uuid)
            body.append('assign_number', null)
            body.append('assign_extension', Extension?.extension_uuid)
            body.append('job_title', JobTitle)
            body.append('time_zone', TimeZone?.time_zone_uuid)
            body.append('language', Language?.language)
            body.append('createdby', user_data?.data?.user_uuid)
            body.append('main_user_uuid', user_data?.data?.user_uuid)
            body.append('useruuid', user_details?.user?.uuid)
            if (ProfileImg !== null) {
                body.append('file', ProfileImg[0]);
                body.append('fileName', ProfileImg[0]?.name)
            }
            else {
                body.append('profile_image', user_details?.user?.profile_image)
            }
            dispatch(Update_User(body));

            // role change event send
            const fileData = {
                type: "role_change",
                data: Role?.role_uuid,
                old_role: user_data?.data?.role_uuid,
            };
            if (Global.Socket && Global.Socket.readyState === WebSocket.OPEN) {
                Global.Socket.send(JSON.stringify(fileData));
            }


        }
    }


    useEffect(() => {
        Log('apiUpdateUser :', apiUpdateUser);
        if (apiUpdateUser == STATUS_FULFILLED) {
            // callAllApi()
            GetUserDetails();
        } else if (apiUpdateUser == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateUser]);

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
            // if (result[0].size < maxSize) {
            //     await setSelectedCsvFile(result);
            //     setSelectedCsvFileName(result[0]?.name);
            //     // setSelectedCsvFileError("")
            //     ImportFile(result)
            // }
            // else {
            // setSelectedCsvFileError("  * Please select file size less than 10 MB")
            // setSelectedCsvFileError("  * Please select file size less than 10 MB")
            // }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.error('Error picking document:', err);
            }
        }
        // Alert.alert("Select from", "Upload your Profile Picture", [
        //     {
        //         text: 'Cancel',
        //         onPress: () => { },
        //         style: 'cancel'
        //     },
        //     {
        //         text: 'Gallery',
        //         onPress: () => {
        //             ImagePicker.openPicker({
        //                 multiple: false,
        //                 freeStyleCropEnabled: true,
        //                 cropping: true,
        //                 mediaType: 'photo',
        //                 includeBase64: false,
        //                 compressImageQuality: 0.7
        //             }).then(images => {
        //                 setProfileImg(images)
        //                 setProfileImgURI(images?.path)
        //             }).catch((error) => {

        //             });
        //         }
        //     },
        //     {
        //         text: 'Camera',
        //         onPress: () => {
        //             ImagePicker.openCamera({
        //                 cropping: true,
        //                 freeStyleCropEnabled: true,
        //                 multiple: false,
        //                 mediaType: 'photo',
        //                 includeBase64: false,
        //                 multipleShot: false,
        //                 compressImageQuality: 0.7
        //             }).then(images => {
        //                 setProfileImg(images)
        //                 setProfileImgURI(images?.path)
        //             }).catch((error) => {
        //             });

        //         },
        //         style: 'default'
        //     },
        // ])
    }

    const ExtensionbottomSheetRef = useRef(null);
    const openExtensionBottomSheet = () => {
        if (ExtensionbottomSheetRef.current) {
            ExtensionbottomSheetRef.current.open();
        }
    };

    const CallerIdbottomSheetRef = useRef(null);
    const openCallerIdBottomSheet = () => {
        if (CallerIdbottomSheetRef.current) {
            CallerIdbottomSheetRef.current.open();
        }
    };
    const TimeZonebottomSheetRef = useRef(null);
    const openTimeZoneBottomSheet = () => {
        if (TimeZonebottomSheetRef.current) {
            TimeZonebottomSheetRef.current.open();
        }
    };

    const RolebottomSheetRef = useRef(null);
    const openRoleBottomSheet = () => {
        if (RolebottomSheetRef.current) {
            RolebottomSheetRef.current.open();
        }
    };

    const GroupbottomSheetRef = useRef(null);
    const openGroupBottomSheet = () => {
        if (GroupbottomSheetRef.current) {
            GroupbottomSheetRef.current.open();
        }
    };

    const LanguagebottomSheetRef = useRef(null);
    const openLanguageBottomSheet = () => {
        if (LanguagebottomSheetRef.current) {
            LanguagebottomSheetRef.current.open();
        }
    };

    return (
        <>
            <HeaderBackView
                title={TitleHeader}
                isBack={true}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
            <ScrollView style={{ paddingHorizontal: 20 }}>

                {/* main view start*/}
                <View >
                    <View style={{
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
                            style={{ width: 75, height: 75, borderRadius: 100 }}
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
                    </View>
                    <View style={{
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <View>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                }}>{"Email ID"}</Text>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    marginTop: 4
                                }}>{Email}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <View>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                }}>{"First Name"}</Text>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: grey,
                                    fontFamily: MEDIUM,
                                    marginTop: 4
                                }}>{FirstName}</Text>
                            </View>

                            {FirstNameEdit == false &&
                                <TouchableOpacity onPress={() => {
                                    setFirstNameEdit(!FirstNameEdit)
                                }}>
                                    <Icon name={"pencil"} size={18} color={black} />
                                </TouchableOpacity>
                            }
                        </View>
                        {FirstNameEdit == true &&
                            <View style={{
                                marginTop: 14,
                                flexDirection: "row", alignItems: "center"
                            }}>
                                <TextInput
                                    value={FirstName}
                                    placeholder='First Name'
                                    placeholderTextColor={grey01}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: grey01,
                                        height: 40,
                                        borderRadius: 6,
                                        paddingHorizontal: 14,
                                        flex: 1
                                    }}
                                    onChangeText={(txt) => {
                                        setFirstName(txt)
                                    }}
                                />
                                <TouchableOpacity onPress={() => {
                                    setFirstNameEdit(false)
                                }}
                                    style={{ backgroundColor: greenPrimary, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                                    <Icon name="check" size={22} color={white} />
                                </TouchableOpacity>
                            </View>
                        }
                        {FirstNameError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>
                            {FirstNameError}
                        </Text>
                        }
                    </View>
                    <View style={{
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <View>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                }}>{"Last Name"}</Text>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: grey,
                                    fontFamily: MEDIUM,
                                    marginTop: 4
                                }}>{LastName}</Text>
                            </View>
                            {LastNameEdit == false &&
                                <TouchableOpacity onPress={() => {
                                    setLastNameEdit(!LastNameEdit)
                                }}>
                                    <Icon name={"pencil"} size={18} color={black} />
                                </TouchableOpacity>
                            }
                        </View>
                        {LastNameEdit == true &&
                            <View style={{
                                marginTop: 14,
                                flexDirection: "row", alignItems: "center"
                            }}>
                                <TextInput
                                    value={LastName}
                                    placeholder='First Name'
                                    placeholderTextColor={grey01}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: grey01,
                                        height: 40,
                                        borderRadius: 6,
                                        paddingHorizontal: 14,
                                        flex: 1
                                    }}
                                    onChangeText={(txt) => {
                                        setLastName(txt)
                                    }}
                                />
                                <TouchableOpacity onPress={() => {
                                    setLastNameEdit(false)
                                }}
                                    style={{ backgroundColor: greenPrimary, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                                    <Icon name="check" size={22} color={white} />
                                </TouchableOpacity>
                            </View>
                        }
                        {LastNameError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>
                            {LastNameError}
                        </Text>
                        }
                    </View>
                    <TouchableOpacity onPress={() => {
                        openExtensionBottomSheet()
                    }}
                        style={{

                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"Extension"}</Text>
                            <Icon name="chevron-down" size={22} color={black} />
                        </View>
                        <Text style={{
                            fontSize: FontSize.FS_11,
                            color: grey,
                            fontFamily: MEDIUM,
                        }}>{Extension == null ? "Select Extension" : Extension?.extension}</Text>
                        {ExtensionError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>
                            {ExtensionError}
                        </Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        openCallerIdBottomSheet()
                    }}
                        style={{
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            marginHorizontal: -20,
                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"Outbound Caller ID"}</Text>
                            <Icon name="chevron-down" size={22} color={black} />
                        </View>
                        <Text style={{
                            fontSize: FontSize.FS_11,
                            color: grey,
                            fontFamily: MEDIUM,
                        }}>{CallerId == null ? "Select Outbound Caller ID" : CallerId?.label}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.sectionTItle, { paddingVertical: 0 }]}>{""}</Text>
                    <View style={{
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <View>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                }}>{"Job Title"}</Text>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: grey,
                                    fontFamily: MEDIUM,
                                    marginTop: 4
                                }}>{JobTitle}</Text>
                            </View>
                            {JobTitleEdit == false &&
                                <TouchableOpacity onPress={() => {
                                    setJobTitleEdit(!JobTitleEdit)
                                }}>
                                    <Icon name={"pencil"} size={18} color={black} />
                                </TouchableOpacity>
                            }
                        </View>
                        {JobTitleEdit == true &&
                            <View style={{
                                marginTop: 14,
                                flexDirection: "row", alignItems: "center"
                            }}>
                                <TextInput
                                    value={JobTitle}
                                    placeholder='Job Title'
                                    placeholderTextColor={grey01}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: grey01,
                                        height: 40,
                                        borderRadius: 6,
                                        paddingHorizontal: 14,
                                        flex: 1
                                    }}
                                    onChangeText={(txt) => {
                                        setJobTitle(txt)
                                    }}
                                />
                                <TouchableOpacity onPress={() => {
                                    setJobTitleEdit(false)
                                }}
                                    style={{ backgroundColor: greenPrimary, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                                    <Icon name="check" size={22} color={white} />
                                </TouchableOpacity>
                            </View>
                        }
                        {JobTitleError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>
                            {JobTitleError}
                        </Text>
                        }
                    </View>
                    <TouchableOpacity onPress={() => {
                        openTimeZoneBottomSheet()
                    }}
                        style={{

                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"Time Zone"}</Text>
                            <Icon name="chevron-down" size={22} color={black} />
                        </View>
                        <Text style={{
                            fontSize: FontSize.FS_11,
                            color: grey,
                            fontFamily: MEDIUM,
                        }}>{TimeZone == null ? "Select Time Zone" : TimeZone?.timezone_name}</Text>
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
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        openRoleBottomSheet()
                    }}
                        style={{

                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"Role"}</Text>
                            <Icon name="chevron-down" size={22} color={black} />
                        </View>
                        <Text style={{
                            fontSize: FontSize.FS_11,
                            color: grey,
                            fontFamily: MEDIUM,
                        }}>{Role == null ? "Select Role" : Role?.role_name}</Text>
                        {RoleError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>
                            {RoleError}
                        </Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        openGroupBottomSheet()
                    }}
                        style={{

                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"User Group"}</Text>
                            <Icon name="chevron-down" size={22} color={black} />
                        </View>
                        <Text style={{
                            fontSize: FontSize.FS_11,
                            color: grey,
                            fontFamily: MEDIUM,
                        }}>{Group == null ? "Select User Group" : Group?.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        openLanguageBottomSheet()
                    }}
                        style={{

                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"Language"}</Text>
                            <Icon name="chevron-down" size={22} color={black} />
                        </View>
                        <Text style={{
                            fontSize: FontSize.FS_11,
                            color: grey,
                            fontFamily: MEDIUM,
                        }}>{Language == null ? "Select Language" : Language?.language}</Text>
                        {LanguageError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>
                            {LanguageError}
                        </Text>
                        }
                    </TouchableOpacity>
                    <View style={{
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <View>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                }}>{"Date Created"}</Text>
                                <Text style={{
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    marginTop: 4
                                }}>{user_details?.user?.created_at}</Text>
                            </View>
                        </View>
                    </View>



                    <Text style={styles.sectionTItle}>{"Avaliability & E911"}</Text>
                    <TouchableOpacity onPress={() => {
                        navigate("UserAvaliability", { user_uuid: route?.params?.item?.uuid })
                    }}
                        style={styles.sectionSubTitle}>
                        <Text style={styles.black13Medium}>{"Avaliability"}</Text>
                        <Icon name={"chevron-right"} size={22} color={black} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigate("UserE911", { data: user_details })
                    }}
                        style={styles.sectionSubTitle}>
                        <Text style={styles.black13Medium}>{"E911"}</Text>
                        <Icon name={"chevron-right"} size={22} color={black} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        handleUpdateUser()
                    }}
                        style={{
                            backgroundColor: greenPrimary,
                            alignItems: "center",
                            paddingVertical: 10,
                            marginVertical: 20,
                            justifyContent: "center",
                            borderRadius: 4,
                            width: "100%"
                        }}>
                        <Text style={{
                            fontSize: FontSize.FS_14,
                            color: white,
                            fontFamily: SEMIBOLD,
                            lineHeight: 24,
                            marginLeft: 10
                        }}>{"Update"}</Text>
                    </TouchableOpacity>
                </View>

                {/* main view end*/}
                <BottomSheet
                    headerTitle={"Select Extension"}
                    Data={extension_list}
                    titleValue={"extension"}
                    bottomSheetRef={ExtensionbottomSheetRef}
                    selectedValue={(data) => {
                        setExtension(data)
                        setExtensionError("")
                    }} />
                <BottomSheet
                    headerTitle={"Select Outbound Caller ID"}
                    Data={number_list}
                    titleValue={"label"}
                    bottomSheetRef={CallerIdbottomSheetRef}
                    selectedValue={(data) => {
                        setCallerId(data)
                        setCallerIdError("")
                    }} />
                <BottomSheet
                    headerTitle={"Select Time Zone"}
                    Data={time_zone_list}
                    titleValue={"timezone_name"}
                    bottomSheetRef={TimeZonebottomSheetRef}
                    selectedValue={(data) => {
                        setTimeZone(data)
                        setTimeZoneError("")
                    }} />
                <BottomSheet
                    headerTitle={"Select Role"}
                    Data={role_list}
                    titleValue={"role_name"}
                    bottomSheetRef={RolebottomSheetRef}
                    selectedValue={(data) => {
                        setRole(data)
                        setRoleError("")
                    }} />
                <BottomSheet
                    headerTitle={"Select User Group"}
                    Data={group_list}
                    titleValue={"name"}
                    bottomSheetRef={GroupbottomSheetRef}
                    selectedValue={(data) => {
                        setGroup(data)
                        UpdateUserGroup(data?.uuid)
                        setGroupError("")
                    }} />
                <BottomSheet
                    headerTitle={"Select Language"}
                    Data={language_list}
                    titleValue={"language"}
                    bottomSheetRef={LanguagebottomSheetRef}
                    selectedValue={(data) => {
                        setLanguage(data)
                        setLanguageError("")
                    }} />
            </ScrollView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default ManageUser;

const styles = StyleSheet.create({
    black13Medium: {
        fontSize: FontSize.FS_13,
        color: black,
        fontFamily: MEDIUM,
    },
    sectionSubTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: disableColor,
        marginHorizontal: -20,
    },
    sectionTItle: {
        fontSize: FontSize.FS_14,
        color: black,
        fontFamily: SEMIBOLD,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: -20,
        backgroundColor: "#f0f0f0b5"
        ,
    },

});
