import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Switch,
    Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderView from '../../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import {
    black,
    disableColor,
    greenPrimary,
    grey,
    grey01, red, white
} from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import { goBack, navigate } from '../../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { resetApiStatus } from '../../../redux/reducers/callReducer';
import {
    Create_Extension,
    Get_Audio_File_List,
    Get_Extension_Details,
    Get_Next_Extension,
    Get_Route_To_Destination,
    Update_Extension,
} from '../../../redux/api/Api';
import {
    STATUS_FULFILLED,
    STATUS_REJECTED,
} from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import LoadingView from '../../../commonComponents/LoadingView';
import SingleTimeoutBottomSheet from '../../../commonComponents/BottomSheet/SingleTImeoutBottomSheet';
import AudioFileListBottomSheet from '../../../commonComponents/BottomSheet/AudioFIleListBottomSheet';
import RouteDestinationBottomSheet from '../../../commonComponents/BottomSheet/RouteDestinationBottomSheet';
import { ROUTE } from '../../../constants/DATA/Route';
import DestinationBottomSheet from '../../../commonComponents/BottomSheet/DestinationBottomSheet';
import { SINGLETIMEOUT } from '../../../constants/DATA/SingleTimeOut';

const EditExtension = ({ navigation, route }) => {
    const [isEdit, setIsEdit] = useState(route?.params?.isEdit ? true : false);

    const [NewExtension, setNewExtension] = useState("");
    const [ExtensionData, setExtensionData] = useState([]);
    //user
    const [CallerId, setCallerId] = useState('');
    const [CallerName, setCallerName] = useState('');
    // general
    const [Dnd, setDnd] = useState(false);

    const [CallWaiting, setCallWaiting] = useState(false);
    const [WaitingTime, setWaitingTime] = useState('20');
    const [ShowCallWaiting, setShowCallWaiting] = useState(false);

    const [IsPasswordEdit, setIsPasswordEdit] = useState(false);
    const [Password, setPassword] = useState('');
    const [PasswordError, setPasswordError] = useState('');
    // voicemail
    const [VMSetting, setVMSetting] = useState(false);

    const [IsVMPasswordEdit, setIsVMPasswordEdit] = useState(false);
    const [VMPassword, setVMPassword] = useState('');
    const [VMPasswordError, setVMPasswordError] = useState('');

    const [IsVMToMailSwitch, setIsVMToMailSwitch] = useState(false);
    const [VmToMail, setVmToMail] = useState('');
    const [IsVMToMailShow, setIsVMToMailShow] = useState(false);

    const [RingTimoutTime, setRingTimoutTime] = useState('20');

    const [AudioFileList, setAudioFileList] = useState([]);

    const [MainSelectedAudioFileName, setMainSelectedAudioFileName] = useState('');
    const [MainSelectedAudioFileId, setMainSelectedAudioFileId] = useState('');
    // forwarding
    const [ExtensionRingTIme, setExtensionRingTIme] = useState("20");

    const [ForwardDesSwitch, setForwardDesSwitch] = useState(false);
    const [ShowForwardDes, setShowForwardDes] = useState(false);

    const [RouteTo, setRouteTo] = useState('');
    const [RouteValue, setRouteValue] = useState('');

    const [DestinationTo, setDestinationTo] = useState('');
    const [DestinationToError, setDestinationToError] = useState('');
    const [DestinationValue, setDestinationValue] = useState('');
    const [DestinationList, setDestinationList] = useState([]);

    //bottomsheet ref
    const bottomSheetRef = useRef(null);
    const RingTimeOutbottomSheetRef = useRef(null);
    const AudioFilebottomSheetRef = useRef(null);
    const ExtensionRIngTimpoutebottomSheetRef = useRef(null);
    const RouteTobottomSheetRef = useRef(null);
    const DestinationTobottomSheetRef = useRef(null);
    const dispatch = useDispatch();

    const apiAudioFileList = useSelector(
        state => state.audioRedux.apiAudioFileList,
    );
    const audio_file_list = useSelector(
        state => state.audioRedux.audio_file_list,
    );

    const apiGetRouteToDestination = useSelector(
        state => state.generalRedux.apiGetRouteToDestination,
    );
    const route_by_destination_list = useSelector(
        state => state.generalRedux.route_by_destination_list,
    );
    const apiGetExtensionDetails = useSelector(
        state => state.callRedux.apiGetExtensionDetails,
    );
    const apiGetNextExtesnion = useSelector(
        state => state.callRedux.apiGetNextExtesnion,
    );
    const apiCreateExtesnion = useSelector(
        state => state.callRedux.apiCreateExtesnion,
    );
    const apiUpdateExtesnion = useSelector(
        state => state.callRedux.apiUpdateExtesnion,
    );

    const isLoading = useSelector(state => state.callRedux.isLoader);
    const isError = useSelector(state => state.callRedux.isError);
    const error_message = useSelector(state => state.callRedux.error_message);
    const extension_details_data = useSelector(
        state => state.callRedux.extension_details_data,
    );
    const get_next_extension_data = useSelector(
        state => state.callRedux.get_next_extension_data,
    );
    const create_extension_data = useSelector(
        state => state.callRedux.create_extension_data,
    );
    const user_data = useSelector(state => state.userRedux.user_data);


    //Reset All Status Apis
    useEffect(() => {
        return () => {
            dispatch(resetApiStatus());
        };
    }, []);

    //Get Next Extension
    useEffect(() => {
        if (route?.params?.isEdit == false) {
            var dict = {};
            dict.main_admin_uuid = user_data?.data?.main_uuid;
            (dict.createdby = user_data?.data?.user_uuid),
            dispatch(Get_Next_Extension(dict));
        }
    }, [route?.params?.isEdit]);

    useEffect(() => {
        Log('apiGetNextExtesnion :', apiGetNextExtesnion);
        if (apiGetNextExtesnion == STATUS_FULFILLED) {
            if (get_next_extension_data !== null) {
                setNewExtension(get_next_extension_data?.extension)
            }
        } else if (apiGetNextExtesnion == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetNextExtesnion]);

    //Get Extension Details
    useEffect(() => {
        GetExtensionDetails()
    }, [route?.params?.item]);

    const GetExtensionDetails = () => {
        if (route?.params?.item !== null && route?.params?.isEdit == true) {
            var dict = {};
            dict.extuuid = route.params.item?.extension_uuid;
            (dict.createdby = user_data?.data?.user_uuid),
            dispatch(Get_Extension_Details(dict));
        }
    }

    useEffect(() => {
        Log('apiGetExtensionDetails :', apiGetExtensionDetails);
        if (apiGetExtensionDetails == STATUS_FULFILLED) {
            if (extension_details_data !== null) {
                storeAllExtensionStateData(extension_details_data);
                setExtensionData(extension_details_data);
            }
        } else if (apiGetExtensionDetails == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetExtensionDetails]);

    const storeAllExtensionStateData = async data => {
        setCallerId(data[0]?.effective_caller_id_number);
        setCallerName(data[0]?.effective_caller_id_name);
        setDnd(data[0]?.dnd_enabled == 'NO' ? false : true);
        setCallWaiting(data[0]?.call_waiting_enabled == 'YES' ? true : false);
        setWaitingTime(data[0]?.call_waiting_timeout);
        setPassword(data[0]?.extension_password);
        setVMSetting(data[0]?.voicemail_enabled == 'YES' ? true : false);
        setVMPassword(data[0]?.voicemail_password);
        setIsVMToMailSwitch(
            data[0]?.voicemail_mail_to_enabled == 'YES' ? true : false,
        );
        setVmToMail(data[0]?.voicemail_mail_to);
        setRingTimoutTime(data[0]?.ring_time_out);
        setMainSelectedAudioFileId(data[0]?.vm_greeting);
        setExtensionRingTIme(data[0]?.initial_extension_ringtime)
        setForwardDesSwitch(data[0]?.forward_enable == 'YES' ? true : false)
        const routeValByName = ROUTE?.find(item => item.route === data[0]?.forward_route_type)?.value || "";
        setRouteTo(routeValByName)
        setRouteValue(data[0]?.forward_route_type)
        setDestinationValue(data[0]?.forward_destination)


    };

    //Get Audio File DropDown List
    useEffect(() => {
        if (VMSetting == true) {
            var dict = {};
            dict.type = 'vm_greeting',
                dict.createdby = user_data?.data?.user_uuid,
                dispatch(Get_Audio_File_List(dict));
        }
    }, [VMSetting]);

    useEffect(() => {
        Log('apiAudioFileList :', apiAudioFileList);
        if (apiAudioFileList == STATUS_FULFILLED) {
            if (audio_file_list !== null) {
                setAudioFileList(audio_file_list);
                if (MainSelectedAudioFileId !== "") {
                    const data = audio_file_list?.find(item => item.recording_uuid === MainSelectedAudioFileId)?.recording_name || "";
                    setMainSelectedAudioFileName(data)
                }
            }
        } else if (apiAudioFileList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiAudioFileList]);

    // Get ROute To Destination List
    useEffect(() => {
        if (RouteValue !== "") {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid
            dict.type = RouteValue
            dispatch(Get_Route_To_Destination(dict));
        }
    }, [RouteValue]);

    useEffect(() => {
        Log('apiGetRouteToDestination :', apiGetRouteToDestination);
        if (apiGetRouteToDestination == STATUS_FULFILLED) {
            if (route_by_destination_list !== null) {
                setDestinationList(route_by_destination_list);
                const DestinationByRoute = route_by_destination_list?.find(item => item.value === DestinationValue)?.text || "";
                setDestinationTo(DestinationByRoute)
            }
        } else if (apiGetRouteToDestination == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetRouteToDestination]);

    //Update Extension Api
    const UpdateExtension = () => {
        let errors = [];
        if (Password == "") {
            setPasswordError(" * Please enter password")
        }
        if (VMPassword == "") {
            setVMPasswordError(" * Please enter voicemail password")
        }
        if (DestinationTo == "") {
            setDestinationToError(" * Please enter destination")
        }
        else {
            var dict = {
                username: ExtensionData[0]?.username,
                forward_enable: ForwardDesSwitch == true ? 'YES' : 'NO',
                extension_uuid: route.params.item?.extension_uuid,
                main_admin_uuid: user_data?.data?.main_uuid,
                extension: ExtensionData[0]?.extension,
                extension_password: Password,
                external_phone_number: ExtensionData[0]?.external_phone_number,
                vm_greeting: MainSelectedAudioFileId,
                voicemail_password: VMPassword,
                effective_caller_id_name: CallerId,
                effective_caller_id_number: CallerName,
                call_waiting_enabled: CallWaiting == true ? 'YES' : 'NO',
                call_waiting_timeout: WaitingTime,
                dnd_enabled: Dnd == true ? 'YES' : 'NO',
                emergency_caller_id_name: ExtensionData[0]?.emergency_caller_id_name,
                emergency_caller_id_number: ExtensionData[0]?.emergency_caller_id_number,
                voicemail_enabled: VMSetting == true ? 'YES' : 'NO',
                voicemail_mail_to_enabled: IsVMToMailSwitch == true ? 'YES' : 'NO',
                ring_time_out: RingTimoutTime,
                forward_route_type: RouteValue,
                forward_destination: DestinationValue,
                initial_extension_ringtime: ExtensionRingTIme,
                e911_address: ExtensionData[0]?.e911_address,
                assign_status: ExtensionData[0]?.assign_status,
                voicemail_mail_to: VmToMail,
                created_at: ExtensionData[0]?.created_at,
                created_by: ExtensionData[0]?.created_by,
                createdby: ExtensionData[0]?.created_by,
                voicemail_uuid: ExtensionData[0]?.voicemail_uuid,
                extension_user_uuid: ExtensionData[0]?.extension_user_uuid,
                user: ExtensionData[0]?.user,
                ring_destination: ExtensionData[0]?.ring_destination,
                time_condition_name: ExtensionData[0]?.time_condition_name,
                voicemail_name: ExtensionData[0]?.voicemail_name,
                did_number: ExtensionData[0]?.did_number,
                ivr_menu_name: ExtensionData[0]?.ivr_menu_name,
                ivr_menu_extension: ExtensionData[0]?.ivr_menu_extension,
            };
            dispatch(Update_Extension(dict));
        }
    }

    useEffect(() => {
        Log('apiUpdateExtesnion :', apiUpdateExtesnion);
        if (apiUpdateExtesnion == STATUS_FULFILLED) {
            GetExtensionDetails()
        } else if (apiUpdateExtesnion == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateExtesnion]);

    //Create Extension API
    const CreateExtension = () => {
        if (Password == "") {
            setPasswordError(" * Please enter password")
        }
        //  if (VMPassword == "") {
        //     setVMPasswordError(" * Please enter voicemail password")
        // }
        //  if (DestinationTo == "") {
        //     setDestinationToError(" * Please enter destination")
        // }
        // if (Password == "" && VMPassword == "" && DestinationTo =="") {
        if (Password == "") {
        }
        else {
            var dict = {
                extension: NewExtension,
                extension_password: Password,
                effective_caller_id_name: CallerId,
                effective_caller_id_number: CallerName,
                voicemail_enabled: VMSetting == true ? 'YES' : 'NO',
                call_waiting_enabled: CallWaiting == true ? 'YES' : 'NO',
                call_waiting_timeout: WaitingTime,
                dnd_enabled: Dnd == true ? 'YES' : 'NO',
                // created_at: ExtensionData[0]?.created_at,
                // created_by: ExtensionData[0]?.created_by,
                createdby:user_data?.data?.user_uuid,
                main_admin_uuid: user_data?.data?.main_uuid,
                user_uuid: user_data?.data?.user_uuid,


                // username: ExtensionData[0]?.username,
                // forward_enable: ForwardDesSwitch == true ? 'YES' : 'NO',
                // extension: ExtensionData[0]?.extension,
                // external_phone_number: ExtensionData[0]?.external_phone_number,
                // vm_greeting: MainSelectedAudioFileId,
                // voicemail_password: VMPassword,

                // emergency_caller_id_name: ExtensionData[0]?.emergency_caller_id_name,
                // emergency_caller_id_number: ExtensionData[0]?.emergency_caller_id_number,
                // voicemail_mail_to_enabled: IsVMToMailSwitch == true ? 'YES' : 'NO',
                // ring_time_out: RingTimoutTime,
                // forward_route_type: RouteValue,
                // forward_destination: DestinationValue,
                // initial_extension_ringtime: ExtensionRingTIme,
                // e911_address: ExtensionData[0]?.e911_address,
                // assign_status: ExtensionData[0]?.assign_status,
                // voicemail_mail_to: VmToMail,

                // voicemail_uuid: ExtensionData[0]?.voicemail_uuid,
                // extension_user_uuid: ExtensionData[0]?.extension_user_uuid,
                // user: ExtensionData[0]?.user,
                // ring_destination: ExtensionData[0]?.ring_destination,
                // time_condition_name: ExtensionData[0]?.time_condition_name,
                // voicemail_name: ExtensionData[0]?.voicemail_name,
                // did_number: ExtensionData[0]?.did_number,
                // ivr_menu_name: ExtensionData[0]?.ivr_menu_name,
                // ivr_menu_extension: ExtensionData[0]?.ivr_menu_extension,
            };
            dispatch(Create_Extension(dict));
        }
    }

    useEffect(() => {
        Log('apiCreateExtesnion :', apiCreateExtesnion);
        if (apiCreateExtesnion == STATUS_FULFILLED) {
            if (create_extension_data !== null) {
                goBack()
            }
        } else if (apiCreateExtesnion == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateExtesnion]);

    // BottomSheet Reference
    const openRouteToBottomSheet = () => {
        if (RouteTobottomSheetRef.current) {
            RouteTobottomSheetRef.current.open();
        }
    };

    const openDestinationToBottomSheet = () => {
        if (DestinationTobottomSheetRef.current) {
            DestinationTobottomSheetRef.current.open();
        }
    };

    const openWaitingTimeBottomSheet = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.open();
        }
    };

    const openAudioFileListBottomSheet = () => {
        if (AudioFilebottomSheetRef.current) {
            AudioFilebottomSheetRef.current.open();
        }
    };

    const openRingTimeoutBottomSheet = () => {
        if (RingTimeOutbottomSheetRef.current) {
            RingTimeOutbottomSheetRef.current.open();
        }
    };
    const openExtensionRingTimeoutBottomSheet = () => {
        if (ExtensionRIngTimpoutebottomSheetRef.current) {
            ExtensionRIngTimpoutebottomSheetRef.current.open();
        }
    };


    return (
        <>
            <HeaderView
                title={'Zongo'}
                isProfilePic={true}
                imgUri={
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
                containerStyle={{
                    marginHorizontal: pixelSizeHorizontal(20),
                }}>
                <HeaderBackView
                    title={isEdit ? ExtensionData[0]?.extension : 'Add Extension'}
                    isBack={true}
                    onPressBack={() => {
                        goBack();
                    }}
                    onPressMenu={() => {
                        navigation.toggleDrawer();
                    }}
                />

                <View style={{ marginTop: 0, marginBottom: 40 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>
                            {'Extension'}
                        </Text>
                        <Text
                            style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: SEMIBOLD,
                            }}>
                            {isEdit == true ? ExtensionData[0]?.extension : NewExtension}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 16,
                            paddingBottom: 16,
                            paddingHorizontal: 20,
                            marginHorizontal: -20,
                        }}>
                        <View>
                            <Text
                                style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                }}>
                                {'Caller ID'}
                            </Text>
                            <Text
                                style={{
                                    fontSize: FontSize.FS_11,
                                    color: grey,
                                    fontFamily: MEDIUM,
                                    marginTop: 4,
                                }}>
                                {'Extension'}
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 4,
                            }}>
                            {CallerId == "" ? "-" : CallerId}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 16,
                            paddingBottom: 16,
                            paddingHorizontal: 20,
                            marginHorizontal: -20,
                        }}>
                        <View>
                            <Text
                                style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                }}>
                                {'Name'}
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 4,
                            }}>
                            {CallerName == "" ? "-" : CallerName}
                        </Text>
                    </View>
                    {/* general */}
                    <Text
                        style={{
                            fontSize: FontSize.FS_14,
                            color: black,
                            fontFamily: SEMIBOLD,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            marginHorizontal: -20,
                            backgroundColor: '#f0f0f0b5',
                        }}>
                        {'General'}
                    </Text>
                    <View
                        style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {'Do not disturb (DND)'}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_11,
                                        color: grey,
                                        fontFamily: MEDIUM,
                                        marginTop: 4,
                                    }}>
                                    {Dnd == true ? 'Enabled' : 'Disabled'}
                                </Text>
                            </View>
                            <Switch
                                style={{ marginRight: -10 }}
                                trackColor={{ false: '#767577', true: greenPrimary }}
                                thumbColor={Dnd ? white : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={Dnd => {
                                    setDnd(Dnd);
                                }}
                                value={Dnd}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {'Call waiting'}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 4,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_11,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                            marginRight: 10,
                                        }}>
                                        {CallWaiting == true ? WaitingTime + ' second' : 'Disabled'}
                                    </Text>
                                    {CallWaiting == true && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowCallWaiting(!ShowCallWaiting);
                                            }}
                                            style={{
                                                backgroundColor: greenPrimary,
                                                padding: 4,
                                                borderRadius: 50,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: 4,
                                            }}>
                                            <Icon name={'pencil'} size={14} color={white} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            <Switch
                                style={{ marginRight: -10 }}
                                trackColor={{ false: '#767577', true: greenPrimary }}
                                thumbColor={CallWaiting ? white : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={val => {
                                    setCallWaiting(val);
                                    setShowCallWaiting(val);
                                }}
                                value={CallWaiting}
                            />
                        </View>
                        {ShowCallWaiting == true && (
                            <View
                                style={{
                                    marginTop: 14,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        openWaitingTimeBottomSheet();
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderWidth: 1,
                                        borderColor: grey,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        marginVertical: 10,
                                        borderRadius: 6,
                                        flex: 1,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                            marginTop: 4,
                                        }}>
                                        {WaitingTime}
                                    </Text>
                                    <Icon name={'chevron-down'} size={22} color={grey} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowCallWaiting(false);
                                    }}
                                    style={{
                                        backgroundColor: greenPrimary,
                                        height: 40,
                                        width: 40,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 6,
                                        marginLeft: 10,
                                    }}>
                                    <Icon name="check" size={22} color={white} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View
                        style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {'Password'}
                                </Text>
                                {Password !== '' && (
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_11,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                            marginTop: 4,
                                        }}>
                                        {IsPasswordEdit == true ? Password : '*******'}
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={{ paddingVertical: 8, paddingLeft: 8 }}
                                onPress={() => {
                                    setIsPasswordEdit(!IsPasswordEdit);
                                }}>
                                <Icon
                                    name={IsPasswordEdit == true ? 'eye-off' : 'eye-off-outline'}
                                    size={22}
                                    color={black}
                                />
                            </TouchableOpacity>
                        </View>
                        {IsPasswordEdit == true && (
                            <View
                                style={{
                                    marginTop: 14,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <TextInput

                                    value={Password}
                                    placeholder="12345"
                                    placeholderTextColor={grey01}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: grey01,
                                        height: 40,
                                        borderRadius: 6,
                                        paddingHorizontal: 14,
                                        flex: 1,
                                    }}
                                    onChangeText={txt => {
                                        setPassword(txt);
                                        setPasswordError("")
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsPasswordEdit(false);
                                    }}
                                    style={{
                                        backgroundColor: greenPrimary,
                                        height: 40,
                                        width: 40,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 6,
                                        marginLeft: 10,
                                    }}>
                                    <Icon name="check" size={22} color={white} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {PasswordError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                                marginTop: 8

                            }}>
                            {PasswordError}
                        </Text>
                        }
                    </View>
                    {/* voicemail */}
                    <View
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            marginHorizontal: -20,
                            backgroundColor: '#f0f0f0b5',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.FS_14,
                                color: black,
                                fontFamily: SEMIBOLD,
                            }}>
                            {'Voicemail'}
                        </Text>
                        <Switch
                            style={{ marginRight: -10 }}
                            trackColor={{ false: '#767577', true: greenPrimary }}
                            thumbColor={VMSetting ? white : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={Dnd => {
                                setVMSetting(Dnd);
                            }}
                            value={VMSetting}
                        />
                    </View>
                    <View
                        style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {'Voicemail Password'}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_11,
                                        color: grey,
                                        fontFamily: MEDIUM,
                                        marginTop: 4,
                                    }}>
                                    {IsVMPasswordEdit == true ? VMPassword : '*******'}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    setIsVMPasswordEdit(!IsVMPasswordEdit);
                                }}>
                                <Icon
                                    name={
                                        IsVMPasswordEdit == true ? 'eye-outline' : 'eye-off-outline'
                                    }
                                    size={22}
                                    color={black}
                                />
                            </TouchableOpacity>
                        </View>


                        {IsVMPasswordEdit == true && (
                            <View
                                style={{
                                    marginTop: 14,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <TextInput
                                    value={VMPassword}
                                    placeholder="12345"
                                    placeholderTextColor={grey01}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: grey01,
                                        height: 40,
                                        borderRadius: 6,
                                        paddingHorizontal: 14,
                                        flex: 1,
                                    }}
                                    onChangeText={txt => {
                                        setVMPassword(txt);
                                        setVMPasswordError("")
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsVMPasswordEdit(false);
                                    }}
                                    style={{
                                        backgroundColor: greenPrimary,
                                        height: 40,
                                        width: 40,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 6,
                                        marginLeft: 10,
                                    }}>
                                    <Icon name="check" size={22} color={white} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {VMPasswordError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                                marginTop: 8

                            }}>
                            {VMPasswordError}
                        </Text>
                        }
                    </View>
                    {VMSetting == true && (
                        <View>
                            <View
                                style={{
                                    paddingVertical: 16,
                                    paddingHorizontal: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: disableColor,
                                    marginHorizontal: -20,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: FontSize.FS_12,
                                                color: black,
                                                fontFamily: MEDIUM,
                                            }}>
                                            {'Voicemail To Email'}
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 5,
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: FontSize.FS_11,
                                                    color: grey,
                                                    fontFamily: MEDIUM,
                                                    marginTop: 4,
                                                    marginRight: 10,
                                                }}>
                                                {IsVMToMailSwitch == true ? VmToMail == '' || VmToMail == null ? 'None' : VmToMail : "Disabled"}
                                            </Text>
                                            {IsVMToMailSwitch == true &&
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setIsVMToMailShow(!IsVMToMailShow);
                                                    }}
                                                    style={{
                                                        backgroundColor: greenPrimary,
                                                        padding: 4,
                                                        borderRadius: 50,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginTop: 4,
                                                    }}>
                                                    <Icon name={'pencil'} size={14} color={white} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                    <Switch
                                        style={{ marginRight: -10 }}
                                        trackColor={{ false: '#767577', true: greenPrimary }}
                                        thumbColor={IsVMToMailSwitch ? white : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={Dnd => {
                                            setIsVMToMailShow(Dnd);
                                            setIsVMToMailSwitch(Dnd);
                                        }}
                                        value={IsVMToMailSwitch}
                                    />
                                </View>
                                {IsVMToMailShow == true && (
                                    <View
                                        style={{
                                            marginTop: 14,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <TextInput
                                            value={VmToMail}
                                            placeholder="mail@mail.com"
                                            placeholderTextColor={grey01}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: grey01,
                                                height: 40,
                                                borderRadius: 6,
                                                paddingHorizontal: 14,
                                                flex: 1,
                                            }}
                                            onChangeText={txt => {
                                                setVmToMail(txt);
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                setIsVMToMailShow(false);
                                            }}
                                            style={{
                                                backgroundColor: greenPrimary,
                                                height: 40,
                                                width: 40,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 6,
                                                marginLeft: 10,
                                            }}>
                                            <Icon name="check" size={22} color={white} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    openRingTimeoutBottomSheet();
                                }}
                                style={{
                                    paddingVertical: 16,
                                    paddingHorizontal: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: disableColor,
                                    marginHorizontal: -20,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: FontSize.FS_12,
                                                color: black,
                                                fontFamily: MEDIUM,
                                            }}>
                                            {'Ring Time Out'}
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: FontSize.FS_12,
                                                color: grey,
                                                fontFamily: SEMIBOLD,
                                                marginTop: 4,
                                            }}>
                                            {RingTimoutTime == "" || RingTimoutTime == null ? "None" : RingTimoutTime + ' second'}
                                        </Text>
                                    </View>
                                    <Icon name="chevron-down" size={22} color={black} />
                                </View>
                            </TouchableOpacity>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: 16,
                                    paddingBottom: 16,
                                    paddingHorizontal: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: disableColor,
                                    marginHorizontal: -20,
                                }}>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_12,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>
                                        {'VM Greeting'}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_11,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                            marginTop: 4,
                                        }}>
                                        {'Access code'}
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 4,
                                    }}>
                                    {'*97'}
                                </Text>
                            </View>
                            <View
                                style={{
                                    paddingTop: 16,
                                    paddingBottom: 16,
                                    paddingHorizontal: 20,
                                    borderBottomWidth: 1,
                                    borderBottomColor: disableColor,
                                    marginHorizontal: -20,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_12,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>
                                        {'VM Greeting'}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigate("ManageAudioFiles", { type: "vm_greeting", isEdit: false })
                                        }}
                                        style={{ alignItems: 'center' }}>
                                        <Text
                                            style={{
                                                fontSize: FontSize.FS_12,
                                                color: grey,
                                                fontFamily: SEMIBOLD,
                                            }}>
                                            {'Upload'}
                                        </Text>
                                        <Icon name="cloud-upload-outline" size={22} color={grey} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        openAudioFileListBottomSheet();
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: 14,
                                        borderWidth: 1.5,
                                        borderColor: grey,
                                        borderRadius: 4,
                                        paddingVertical: 6,
                                        paddingHorizontal: 14,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_11,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                        }}>
                                        {MainSelectedAudioFileName == ''
                                            ? 'Choose Audio file'
                                            : MainSelectedAudioFileName}
                                    </Text>
                                    <Icon name="chevron-down" size={22} color={grey} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <Text
                        style={{
                            fontSize: FontSize.FS_14,
                            color: black,
                            fontFamily: SEMIBOLD,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            marginHorizontal: -20,
                            backgroundColor: '#f0f0f0b5',
                        }}>
                        {'Forwarding'}
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            openExtensionRingTimeoutBottomSheet();
                        }}
                        style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {'Initial Extension Ringtime'}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: grey,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 4,
                                    }}>
                                    {ExtensionRingTIme == "" || ExtensionRingTIme == null ? "None" : ExtensionRingTIme + ' second'}
                                </Text>
                            </View>
                            <Icon name="chevron-down" size={22} color={black} />
                        </View>
                    </TouchableOpacity>

                    <View
                        style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {'Forward Destination'}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 4,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_11,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                            marginRight: 10,
                                        }}>
                                        {ForwardDesSwitch == false ? "Disabled" : 'Forward Route and Destination'}
                                    </Text>
                                    {ForwardDesSwitch == true && <TouchableOpacity
                                        onPress={() => {
                                            setShowForwardDes(!ShowForwardDes);
                                        }}
                                        style={{
                                            backgroundColor: greenPrimary,
                                            padding: 4,
                                            borderRadius: 50,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: 4,
                                        }}>
                                        <Icon name={'pencil'} size={14} color={white} />
                                    </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            <Switch
                                style={{ marginRight: -10 }}
                                trackColor={{ false: '#767577', true: greenPrimary }}
                                thumbColor={ForwardDesSwitch ? white : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={val => {
                                    setForwardDesSwitch(val);
                                }}
                                value={ForwardDesSwitch}
                            />
                        </View>
                        {ShowForwardDes == true && (
                            <View
                                style={{
                                    marginTop: 14,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        openRouteToBottomSheet();
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderWidth: 1,
                                        borderColor: grey,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        marginVertical: 10,
                                        borderRadius: 6,
                                        flex: 1,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                        }}>
                                        {RouteTo == "" || RouteTo == null ? "Select Route" : RouteTo}
                                    </Text>
                                    <Icon name={'chevron-down'} size={22} color={grey} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        openDestinationToBottomSheet();
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderWidth: 1,
                                        borderColor: grey,
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        marginVertical: 10,
                                        marginLeft: 10,
                                        borderRadius: 6,
                                        flex: 1,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                        }}>
                                        {DestinationTo == "" || DestinationTo == null ? "Select Destination" : DestinationTo}
                                    </Text>
                                    <Icon name={'chevron-down'} size={22} color={grey} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowForwardDes(false);
                                    }}
                                    style={{
                                        backgroundColor: greenPrimary,
                                        height: 36,
                                        width: 40,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 6,
                                        marginLeft: 10,
                                    }}>
                                    <Icon name="check" size={22} color={white} />
                                </TouchableOpacity>
                            </View>
                        )}
                        {DestinationToError !== "" && ForwardDesSwitch == true && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                                marginTop: 8

                            }}>
                            {DestinationToError}
                        </Text>
                        }
                    </View>
                    {/* <TouchableOpacity
                        onPress={() => {
                            navigate('Availability');
                        }}
                        style={styles.cardRowContainer}>
                        <Text
                            style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>
                            {'Availability'}
                        </Text>
                        <Icon name={'chevron-right'} size={25} color={black} />
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        onPress={() => {
                            if (isEdit == true) {
                                UpdateExtension()
                            }
                            else {
                                CreateExtension()
                            }
                        }}
                        style={{
                            backgroundColor: greenPrimary,
                            alignItems: 'center',
                            paddingVertical: 10,
                            marginVertical: 40,
                            justifyContent: 'center',
                            borderRadius: 4,
                            width: '100%',
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.FS_14,
                                color: white,
                                fontFamily: SEMIBOLD,
                                lineHeight: 24,
                                marginLeft: 10,
                            }}>
                            {isEdit ? 'Update' : 'Add Extension'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* bottomsheet */}
                <SingleTimeoutBottomSheet
                    data={SINGLETIMEOUT}
                    headerTitle={'Waiting Timeout'}
                    bottomSheetRef={bottomSheetRef}
                    selectedValue={data => {
                        setWaitingTime(data);
                    }}
                />
                <SingleTimeoutBottomSheet
                    data={SINGLETIMEOUT}
                    headerTitle={'Ring Timeout'}
                    bottomSheetRef={RingTimeOutbottomSheetRef}
                    selectedValue={data => {
                        setRingTimoutTime(data);
                    }}
                />

                <SingleTimeoutBottomSheet
                    data={SINGLETIMEOUT}
                    headerTitle={'Ring Time'}
                    bottomSheetRef={ExtensionRIngTimpoutebottomSheetRef}
                    selectedValue={data => {
                        setExtensionRingTIme(data);
                    }}
                />
                <AudioFileListBottomSheet
                    headerTitle={'Please select VM Greetings'}
                    AudioFileList={AudioFileList}
                    CurrantId={MainSelectedAudioFileId}
                    bottomSheetRef={AudioFilebottomSheetRef}
                    selectedValue={data => {
                        setMainSelectedAudioFileName(data);
                    }}
                    selectedId={data => {
                        setMainSelectedAudioFileId(data);
                    }}
                />

                <RouteDestinationBottomSheet
                    data={ROUTE}
                    headerTitle={'Select Route Type'}
                    currentValue={RouteValue}
                    bottomSheetRef={RouteTobottomSheetRef}
                    selectedValue={data => {
                        setRouteTo(data);
                    }}
                    selectedRoute={data => {
                        setRouteValue(data)
                    }}
                />

                <DestinationBottomSheet
                    data={DestinationList}
                    headerTitle={'Select Destination'}
                    currentValue={DestinationValue}
                    bottomSheetRef={DestinationTobottomSheetRef}
                    selectedValue={data => {
                        setDestinationTo(data);
                        setDestinationToError("")
                    }}
                    selectedDestination={data => {
                        setDestinationValue(data)
                        setDestinationToError("")
                    }}
                />

            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default EditExtension;

const styles = StyleSheet.create({
    cardRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: disableColor,
        marginHorizontal: -20,
    },
});
