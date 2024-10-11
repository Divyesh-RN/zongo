import { View, StyleSheet, Text, TouchableOpacity, TextInput, Switch, Modal, FlatList, Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import { black, black05, disableColor, greenPrimary, grey, grey01, paleGreen, red, white } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import { goBack } from '../../../navigation/RootNavigation';
import { ScrollView } from 'react-native-gesture-handler';
import { Create_Ring_Group, Delete_Ring_Group_Destination_List, Get_Admin_Voice_Mail, Get_Audio_File_List, Get_Destination_List, Get_Music_On_Hold_File, Get_Next_Ring_Group_Id, Get_Ring_Group_Details, Get_Route_To_Destination, Update_Ring_Group, Update_Ring_Group_Destination_List } from '../../../redux/api/Api';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import LoadingView from '../../../commonComponents/LoadingView';
import { RINGSTRATEGY } from '../../../constants/DATA/RingStrategy';
import RouteDestinationBottomSheet from '../../../commonComponents/BottomSheet/RouteDestinationBottomSheet';
import SingleTimeoutBottomSheet from '../../../commonComponents/BottomSheet/SingleTImeoutBottomSheet';
import { MAXCALLWAITTIME } from '../../../constants/DATA/MaxCallTime';
import SectionBottomSheet from '../../../commonComponents/BottomSheet/SectionBottomSheet';
import { ROUTE } from '../../../constants/DATA/Route';
import AudioFileListBottomSheet from '../../../commonComponents/BottomSheet/AudioFIleListBottomSheet';
import { resetApiStatus } from '../../../redux/reducers/ringGroupReducer';
import { SLA } from '../../../constants/DATA/ServiceLevelAgreeMent';
import DestinationBottomSheet from '../../../commonComponents/BottomSheet/DestinationBottomSheet';
import { SKILLSET } from '../../../constants/DATA/SkillSet';
import { SINGLETIMEOUT } from '../../../constants/DATA/SingleTimeOut';

const RingGroupManage = ({ navigation, route }) => {

    const [isEdit, setIsEdit] = useState(route?.params?.isEdit || false);
    const [IsLoading, setIsLoading] = useState(false);
    const [AdminVoiceMailData, setAdminVoiceMailData] = useState([]);


    const [RingGroupData, setRingGroupData] = useState([]);
    const [RGNameEdit, setRGNameEdit] = useState(false);
    const [RingGroupName, setRingGroupName] = useState("");
    const [RingGroupNameError, setRingGroupNameError] = useState("");
    const [RingGroupId, setRingGroupId] = useState("");

    const [RingGroupStrategy, setRingGroupStrategy] = useState("Ring All");
    const [RingGroupStrategyError, setRingGroupStrategyError] = useState(null);
    const [RingGroupStrategyValue, setRingGroupStrategyValue] = useState("ring_all");

    const [RGNamePrefix, setRGNamePrefix] = useState(false);
    const [RingGroupPrifix, setRingGroupPrefix] = useState("");
    const [RingGroupPrifixError, setRingGroupPrefixError] = useState("");

    const [RingGroupMaxCallTime, setRingGroupMaxCallTime] = useState("10");
    const [RingGroupMaxCallTimeError, setRingGroupMaxCallTimeError] = useState("");

    const [FailOverDesMaxWait, setFailOverDesMaxWait] = useState("");
    const [FailOverDesMaxWaitValue, setFailOverDesMaxWaitValue] = useState("");

    const [FailOverDesMaxWaitTypeName, setFailOverDesMaxWaitTypeName] = useState("");
    const [FailOverDesMaxWaitType, setFailOverDesMaxWaitType] = useState("");

    const [FailOverDesMaxWaitError, setFailOverDesMaxWaitError] = useState("");


    const [AddExtensionModel, setAddExtensionModel] = useState(false);
    const [AddSelectedExtension, setAddSelectedExtension] = useState(null);
    const [AddSelectedExtensionId, setAddSelectedExtensionId] = useState(null);
    const [AddSelectedExtensionError, setAddSelectedExtensionError] = useState("");
    const [AddSelectedSkillSet, setAddSelectedSkillSet] = useState(null);
    const [AddSelectedSkillSetError, setAddSelectedSkillSetError] = useState("");

    const [AddExternalNumberModel, setAddExternalNumberModel] = useState(false);
    const [AddSelectedExternalNumber, setAddSelectedExternalNumber] = useState(null);
    const [AddSelectedExternalNumberError, setAddSelectedExternalNumberError] = useState("");

    const [GreetinCallerSwitch, setGreetinCallerSwitch] = useState(false);
    const [AudioFileList, setAudioFileList] = useState([]);
    const [MainSelectedAudioFileName, setMainSelectedAudioFileName] = useState('');
    const [MainSelectedAudioFileId, setMainSelectedAudioFileId] = useState('');

    const [CallConfirmSwitch, setCallConfirmSwitch] = useState(false);

    const [MusicOnHoldFileList, setMusicOnHoldFileList] = useState([]);
    const [MusicOnHoldFileName, setMusicOnHoldFileName] = useState('');
    const [MusicOnHoldFileId, setMusicOnHoldFileId] = useState('');

    const [SkipBusyExtension, setSkipBusyExtension] = useState(true);

    const [PositionAnnouncement, setPositionAnnouncement] = useState(true);

    const [CallerAppHoldTime, setCallerAppHoldTime] = useState(false);

    const [PlaceHolder, setPlaceHolder] = useState(true);

    const [ServiceLevelAgreement, setServiceLevelAgreement] = useState("");
    const [ServiceLevelAgreementSecond, setServiceLevelAgreementSecond] = useState("");

    const [ExtensionData, setExtensionData] = useState([]);
    const [ExtensionListData, setExtensionListData] = useState([]);
    const [ExtensionRingTimeOut, setExtensionRingTimeOut] = useState("");
    const [SelectedExtensionRingTimeOut, setSelectedExtensionRingTimeOut] = useState(null);
    const [ExtensionSkillSet, setExtensionSkillSet] = useState(null);
    const [DestinationList, setDestinationList] = useState([]);


    const dispatch = useDispatch()
    const RingStrategyBottomSheetRef = useRef(null);
    const MaxCallWaitTimeBottomSheetRef = useRef(null);
    const ExtensionListBottomSheetRef = useRef(null);
    const SkillListBottomSheetRef = useRef(null);
    const FailOverDesMaxWaitRef = useRef(null)
    const ServiceLevelAgreementRef = useRef(null)
    const AudioFilebottomSheetRef = useRef(null);
    const MusinOnHoldFilebottomSheetRef = useRef(null);
    const ExtensionRingTimeOutRef = useRef(null);
    const ExtensionSkillSetRef = useRef(null);

    const apiCreateRingGroup = useSelector(state => state.ringGroupRedux.apiCreateRingGroup);
    const apiGetNextRingGroupId = useSelector(state => state.ringGroupRedux.apiGetNextRingGroupId);
    const apiUpdateRingGroup = useSelector(state => state.ringGroupRedux.apiUpdateRingGroup);
    const apiRingGroupDetails = useSelector(state => state.ringGroupRedux.apiRingGroupDetails);
    const ring_group_details = useSelector(state => state.ringGroupRedux.ring_group_details);
    const ring_group_extension_data = useSelector(state => state.ringGroupRedux.ring_group_extension_data);
    const next_ring_group_id = useSelector(state => state.ringGroupRedux.next_ring_group_id);

    const apiGetRouteToDestination = useSelector(state => state.generalRedux.apiGetRouteToDestination);
    const route_by_destination_list = useSelector(state => state.generalRedux.route_by_destination_list);
    const apiUpdateRingGroupDestinationList = useSelector(state => state.generalRedux.apiUpdateRingGroupDestinationList);

    const apiGetDestinationList = useSelector(state => state.generalRedux.apiGetDestinationList);
    const destination_list = useSelector(state => state.generalRedux.destination_list);
    const apiDeleteRingGroupDestinationList = useSelector(state => state.generalRedux.apiDeleteRingGroupDestinationList);
    const apiGetAdminVoiceMail = useSelector(state => state.generalRedux.apiGetAdminVoiceMail);
    const admin_voice_mail_data = useSelector(state => state.generalRedux.admin_voice_mail_data);

    const apiAudioFileList = useSelector(state => state.audioRedux.apiAudioFileList);
    const apiGetMusicOnHoldFile = useSelector(state => state.audioRedux.apiGetMusicOnHoldFile,);
    const audio_file_list = useSelector(state => state.audioRedux.audio_file_list,);
    const music_on_hold_file_list = useSelector(state => state.audioRedux.music_on_hold_file_list,);


    const user_data = useSelector(state => state.userRedux.user_data);
    const isLoading = useSelector(state => state.ringGroupRedux.isLoader);
    const isError = useSelector(state => state.ringGroupRedux.isError);
    const error_message = useSelector(state => state.ringGroupRedux.error_message);

    //Reset All Status Apis
    useEffect(() => {
        return () => {
            dispatch(resetApiStatus());
        };
    }, []);

    //Get Admin Voice Mail


    const GetAdminVoiceMail = () => {

        if (route?.params?.isEdit == false) {
            var dict = {};
            dict.main_admin_uuid = user_data?.data?.main_uuid;
            (dict.createdby = user_data?.data?.user_uuid),
                dispatch(Get_Admin_Voice_Mail(dict));
        }
    }

    useEffect(() => {
        Log('apiGetAdminVoiceMail :', apiGetAdminVoiceMail);
        if (apiGetAdminVoiceMail == STATUS_FULFILLED) {
            if (admin_voice_mail_data !== null) {
                if (route?.params?.isEdit == false) {
                    setAdminVoiceMailData(admin_voice_mail_data)
                    setFailOverDesMaxWaitValue(admin_voice_mail_data[0]?.voicemail_uuid)
                    setFailOverDesMaxWait(admin_voice_mail_data[0]?.extension)
                    const routeValByName = destination_list?.find(item => item.value.includes(admin_voice_mail_data[0]?.voicemail_uuid));
                    setFailOverDesMaxWaitTypeName(routeValByName?.optgroup)
                    const routeType = ROUTE.find(item => item.value == routeValByName?.optgroup)?.route
                    setFailOverDesMaxWaitType(routeType)


                }
            }
        } else if (apiGetAdminVoiceMail == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetAdminVoiceMail]);


    //Get Next Ring Group Id
    useEffect(() => {
        if (route?.params?.isEdit == false) {
            var dict = {};
            dict.main_admin_uuid = user_data?.data?.main_uuid;
            (dict.createdby = user_data?.data?.user_uuid),
                dispatch(Get_Next_Ring_Group_Id(dict));
        }
    }, [route?.params?.isEdit]);

    useEffect(() => {
        Log('apiGetNextRingGroupId :', apiGetNextRingGroupId);
        if (apiGetNextRingGroupId == STATUS_FULFILLED) {
            if (next_ring_group_id !== null) {
                setRingGroupId(next_ring_group_id?.extension)
            }
        } else if (apiGetNextRingGroupId == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetNextRingGroupId]);


    //Create Ring Group API
    const CreateRingGroup = () => {
        if (RingGroupName == "") {
            setRingGroupNameError(" * Please enter ring group name");
        }
        // if (RingGroupStrategy == null) {
        //     setRingGroupStrategyError(" * Please select ring group strategy")
        // }
        // if (RingGroupPrifix == "") {
        //     setRingGroupPrefixError(" * Please enter CID name prefix")
        // }
        // if (RingGroupMaxCallTime == "") {
        //     setRingGroupMaxCallTimeError(" * Please select maximum caller wait time")
        // }
        // if (FailOverDesMaxWaitError == "") {
        //     setFailOverDesMaxWaitError(" * Please select failover destination wait time")
        // }
        else {
            var dict = {
                user_uuid: user_data?.data?.user_uuid,
                skip_buy_extension: SkipBusyExtension == true ? "YES" : "NO",
                ring_group_strategy: RingGroupStrategyValue,
                ring_group_name: RingGroupName,
                ring_group_music_on_hold: MusicOnHoldFileId,
                ring_group_greeting: MainSelectedAudioFileId,
                ring_group_extension: RingGroupId,
                ring_group_fail_destination: FailOverDesMaxWaitValue, // extesnnion id
                // ring_group_fail_destination_str: FailOverDesMaxWaitValue,
                ring_group_fail_destination_type: FailOverDesMaxWaitType, // extension
                ring_group_enabled: "TRUE",
                ring_group_destinations: [],
                ring_group_description: null,
                ring_group_call_timeout: "10",
                position_announcement: PositionAnnouncement == true ? "YES" : "NO",
                placeholder_callback: PlaceHolder == true ? "YES" : "NO",
                play_hold_time: "YES",
                max_wait_time: RingGroupMaxCallTime,
                main_admin_uuid: user_data?.data?.main_uuid,
                follow_me: "NO",
                createdby: user_data?.data?.user_uuid,
                cid_name_prefix: RingGroupPrifix,
                call_confirm: CallConfirmSwitch == true ? "YES" : "NO",



                // caller_approx_time: CallerAppHoldTime == true ? "YES" : "NO",
                // did_number: RingGroupData[0].did_number,
                // enable_caller_greeting: GreetinCallerSwitch == true ? "YES" : "NO",
                // extension: RingGroupData[0].extension,

                // ivr_menu_extension: RingGroupData[0].ivr_menu_extension,
                // ivr_menu_name: RingGroupData[0].ivr_menu_name,
                // ring_destination: RingGroupData[0].ring_destination,
                // ring_group_uuid: RingGroupData[0].ring_group_uuid,
                // service_answer_time: ServiceLevelAgreementSecond,
                // skip_buy_extension: SkipBusyExtension == true ? "YES" : "NO",
                // time_condition_name: RingGroupData[0].time_condition_name,

                // voicemail_id: RingGroupData[0].voicemail_id
            }
            dispatch(Create_Ring_Group(dict));
        }
    }

    useEffect(() => {
        Log('apiCreateRingGroup :', apiCreateRingGroup);
        if (apiCreateRingGroup == STATUS_FULFILLED) {
            goBack()
        } else if (apiCreateRingGroup == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateRingGroup]);

    // Get Extension  List
    useEffect(() => {
        var dict = {};
        dict.createdby = user_data?.data?.user_uuid,
            dict.main_uuid = user_data?.data?.main_uuid
        dict.type = "extention";
        dispatch(Get_Route_To_Destination(dict));
    }, []);

    useEffect(() => {
        Log('apiGetRouteToDestination :', apiGetRouteToDestination);
        if (apiGetRouteToDestination == STATUS_FULFILLED) {
            if (route_by_destination_list !== null) {
                setExtensionData(route_by_destination_list);
            }
        } else if (apiGetRouteToDestination == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetRouteToDestination]);

    //Get destination list

    const GetDestinationList = () => {
        var dict = {};
        dict.type = "",
            dict.createdby = user_data?.data?.user_uuid
        dispatch(Get_Destination_List(dict));
    }


    useEffect(() => {
        Log('apiGetDestinationList :', apiGetDestinationList);
        if (apiGetDestinationList == STATUS_FULFILLED) {
            if (destination_list !== null) {
                setDestinationList(destination_list)
                const extensionNameViaId = destination_list?.find(item => item.value.toLowerCase() === (FailOverDesMaxWaitType + "_" + FailOverDesMaxWaitValue).toLowerCase())?.text || "";
                setFailOverDesMaxWait(extensionNameViaId) // set extension name
                const routeValByName = destination_list?.find(item => item.value.toLowerCase() === (FailOverDesMaxWaitType + "_" + FailOverDesMaxWaitValue).toLowerCase())?.optgroup || "";
                setFailOverDesMaxWaitTypeName(routeValByName) // set his route capital
                GetAdminVoiceMail()


            }
        } else if (apiGetDestinationList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetDestinationList]);

    //Get Music On Hold list
    useEffect(() => {
        var dict = {};
        dict.createdby = user_data?.data?.user_uuid
        dict.main_admin_uuid = user_data?.data?.main_uuid
        dispatch(Get_Music_On_Hold_File(dict));
    }, []);

    useEffect(() => {
        Log('apiGetMusicOnHoldFile :', apiGetMusicOnHoldFile);
        if (apiGetMusicOnHoldFile == STATUS_FULFILLED) {
            if (music_on_hold_file_list !== null) {
                setMusicOnHoldFileList(music_on_hold_file_list)
            }
        } else if (apiGetMusicOnHoldFile == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetMusicOnHoldFile]);

    useEffect(() => {
        if (MusicOnHoldFileId !== "" && music_on_hold_file_list !== null) {
            const data = music_on_hold_file_list?.find(item => item.recording_uuid === MusicOnHoldFileId)?.recording_name || "";
            setMusicOnHoldFileName(data)
        }
        GetRingGroupDetails()
    }, [MusicOnHoldFileId]);


    //Get Ring Group Details
    useEffect(() => {
        GetRingGroupDetails()
    }, [route?.params?.item]);

    const GetRingGroupDetails = () => {
        if (route?.params?.item !== null && route?.params?.isEdit == true && route?.params?.item !== undefined) {
            var dict = {};
            dict.ring_group_uuid = route.params.item?.ring_group_uuid,
                dict.createdby = user_data?.data?.user_uuid
            dispatch(Get_Ring_Group_Details(dict));
        }
    }

    useEffect(() => {
        Log('apiRingGroupDetails :', apiRingGroupDetails);
        if (apiRingGroupDetails == STATUS_FULFILLED) {
            if (ring_group_details !== null) {
                setRingGroupData(ring_group_details)
                storeAllRingGroupStateData(ring_group_details)
            }
            if (ring_group_extension_data !== null) {
                setExtensionListData(ring_group_extension_data)
            }
        } else if (apiRingGroupDetails == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiRingGroupDetails]);

    const storeAllRingGroupStateData = async (data) => {
        setRingGroupId(data[0]?.ring_group_extension)
        setRingGroupName(data[0]?.ring_group_name)
        setRingGroupStrategyValue(data[0]?.ring_group_strategy)
        const ringGroupStrategyName = RINGSTRATEGY?.find(item => item.route === data[0]?.ring_group_strategy)?.value || "";
        setRingGroupStrategy(ringGroupStrategyName)
        setRingGroupPrefix(data[0]?.cid_name_prefix)
        setRingGroupMaxCallTime(data[0]?.max_wait_time)
        setFailOverDesMaxWaitValue(data[0]?.ring_group_fail_destination) //extension 1000 Id for 105b6acb-4965-46a4-a000-b6a1fac327fd
        setFailOverDesMaxWaitType(data[0]?.ring_group_fail_destination_type) //voicemail route
        setGreetinCallerSwitch(data[0]?.enable_caller_greeting == "YES" ? true : false)
        setMainSelectedAudioFileId(data[0]?.ring_group_greeting)
        setCallConfirmSwitch(data[0]?.call_confirm == "YES" ? true : false)
        setMusicOnHoldFileId(data[0]?.ring_group_music_on_hold)
        setSkipBusyExtension(data[0]?.skip_buy_extension == "YES" ? true : false)
        setPositionAnnouncement(data[0]?.position_announcement == "YES" ? true : false)
        setCallerAppHoldTime(data[0]?.caller_approx_time == "YES" ? true : false)
        setPlaceHolder(data[0]?.placeholder_callback == "YES" ? true : false)
        secondsToTime(data[0]?.service_answer_time)
        setServiceLevelAgreementSecond(data[0]?.service_answer_time)
        setExtensionListData(data[0]?.extension_list_data)
        await GetDestinationList()
    }

    function secondsToTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const minutesString = minutes > 0 ? `${minutes} min` : '';
        const secondsString = remainingSeconds > 0 ? `${remainingSeconds} sec` : '';
        setServiceLevelAgreement(`${minutesString} ${secondsString}`.trim())
    }

    //update Ring Group Extension row

    const UpdateRingGroupExtensionList = async (item, isAdd, index) => {
        setIsLoading(true)
        const isFirstRow = index === 0;
        const isLastRow = index === ExtensionListData.length - 1;

        const createUpdateDict = (row, setOrderModifier) => {

            return {
                action_type: "update",
                createdby: user_data?.data?.user_uuid,
                main_admin_uuid: user_data?.data?.main_uuid,
                main_uuid: user_data?.data?.main_uuid,
                user_uuid: user_data?.data?.user_uuid,
                destination_number: row?.destination_number,
                destination_order: (setOrderModifier).toString(),
                destination_ring_timeout: row?.destination_ring_timeout,
                destination_skill_set: row?.destination_skill_set,
                destination_type: row?.destination_type,
                destination_type_uuid: row?.destination_type_uuid,
                extension: row?.extension,
                ring_group_destination_uuid: row?.ring_group_destination_uuid,
                ring_group_uuid: row?.ring_group_uuid,
                ring_timeout: row?.ring_timeout,
                skill_set: row?.skill_set,
            };
        };

        const arrangeSequenceApiCall = async (dict) => {
            await dispatch(Update_Ring_Group_Destination_List(dict));
        }
        const apiCalls = [];

        if (isFirstRow) {
            const order = parseInt(item?.destination_order, 10);
            const setOrder = isAdd ? order + 1 : order - 1;
            const dict = createUpdateDict(item, setOrder);
            apiCalls.push(arrangeSequenceApiCall(dict));

            const downRow = ExtensionListData[index + 1];
            const downOrder = parseInt(downRow?.destination_order, 10);
            const downSetOrder = isAdd ? downOrder - 1 : downOrder + 1;
            const downRowDict = createUpdateDict(downRow, downSetOrder);
            apiCalls.push(arrangeSequenceApiCall(downRowDict));
        } else if (isLastRow) {
            const order = parseInt(item?.destination_order, 10);
            const setOrder = isAdd ? order + 1 : order - 1;
            const dict = createUpdateDict(item, setOrder);
            apiCalls.push(arrangeSequenceApiCall(dict));

            const upRow = ExtensionListData[index - 1];
            const upOrder = parseInt(upRow?.destination_order, 10);
            const upSetOrder = isAdd ? upOrder - 1 : upOrder + 1;
            const upRowDict = createUpdateDict(upRow, upSetOrder);
            apiCalls.push(arrangeSequenceApiCall(upRowDict));

        } else {
            const order = parseInt(item?.destination_order, 10);
            const setOrder = isAdd ? order + 1 : order - 1;
            const dict = createUpdateDict(item, setOrder);
            apiCalls.push(arrangeSequenceApiCall(dict));


            if (isAdd) {
                const downRow = ExtensionListData[index + 1];
                const downOrder = parseInt(downRow?.destination_order, 10);
                const downSetOrder = isAdd ? downOrder - 1 : downOrder + 1;
                const downRowDict = createUpdateDict(downRow, downSetOrder);
                apiCalls.push(arrangeSequenceApiCall(downRowDict));
            }
            else {
                const upRow = ExtensionListData[index - 1];
                const upOrder = parseInt(upRow?.destination_order, 10);
                const upSetOrder = isAdd ? upOrder - 1 : upOrder + 1;
                const upRowDict = createUpdateDict(upRow, upSetOrder);
                apiCalls.push(arrangeSequenceApiCall(upRowDict));

            }

        }
        await Promise.all(apiCalls);
        GetRingGroupDetails()
        setIsLoading(false)
    };

    useEffect(() => {
        Log('apiUpdateRingGroupDestinationList :', apiUpdateRingGroupDestinationList);
        if (apiUpdateRingGroupDestinationList == STATUS_FULFILLED) {

        } else if (apiUpdateRingGroupDestinationList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateRingGroupDestinationList]);

    // update extension ring time out on extension
    const UpdateExtensionRingTimeOut = async (data) => {
        setIsLoading(true)
        var dict = {
            action_type: "update",
            createdby: user_data?.data?.user_uuid,
            main_admin_uuid: user_data?.data?.main_uuid,
            main_uuid: user_data?.data?.main_uuid,
            user_uuid: user_data?.data?.user_uuid,
            destination_number: SelectedExtensionRingTimeOut?.destination_number,
            destination_order: SelectedExtensionRingTimeOut?.destination_order,
            destination_ring_timeout: SelectedExtensionRingTimeOut?.destination_ring_timeout,
            destination_skill_set: SelectedExtensionRingTimeOut?.destination_skill_set,
            destination_type: SelectedExtensionRingTimeOut?.destination_type,
            destination_type_uuid: SelectedExtensionRingTimeOut?.destination_type_uuid,
            extension: SelectedExtensionRingTimeOut?.extension,
            ring_group_destination_uuid: SelectedExtensionRingTimeOut?.ring_group_destination_uuid,
            ring_group_uuid: SelectedExtensionRingTimeOut?.ring_group_uuid,
            ring_timeout: data,
            skill_set: SelectedExtensionRingTimeOut?.destination_skill_set,
        };
        await dispatch(Update_Ring_Group_Destination_List(dict));
        GetRingGroupDetails()
        setIsLoading(false)


    };
    //update extension skill set on extension
    const UpdateExtensionSkillSet = async (data) => {
        setIsLoading(true)
        var dict = {
            action_type: "update",
            createdby: user_data?.data?.user_uuid,
            main_admin_uuid: user_data?.data?.main_uuid,
            main_uuid: user_data?.data?.main_uuid,
            user_uuid: user_data?.data?.user_uuid,
            destination_number: SelectedExtensionRingTimeOut?.destination_number,
            destination_order: SelectedExtensionRingTimeOut?.destination_order,
            destination_ring_timeout: SelectedExtensionRingTimeOut?.destination_ring_timeout,
            destination_skill_set: SelectedExtensionRingTimeOut?.destination_skill_set,
            destination_type: SelectedExtensionRingTimeOut?.destination_type,
            destination_type_uuid: SelectedExtensionRingTimeOut?.destination_type_uuid,
            extension: SelectedExtensionRingTimeOut?.extension,
            ring_group_destination_uuid: SelectedExtensionRingTimeOut?.ring_group_destination_uuid,
            ring_group_uuid: SelectedExtensionRingTimeOut?.ring_group_uuid,
            skill_set: data,
        };
        await dispatch(Update_Ring_Group_Destination_List(dict));
        GetRingGroupDetails()
        setIsLoading(false)


    };
    //add ring group extension 
    const AddRingGroupExtensionList = async (data) => {
        setIsLoading(true)
        var dict = {
            action_type: "add",
            createdby: user_data?.data?.user_uuid,
            main_uuid: user_data?.data?.main_uuid,
            skill_set: AddSelectedSkillSet,
            extension: AddSelectedExtensionId,
            destination_type: "extension",
            number: "",
            ring_timeout: 20,
            ring_group_uuid: RingGroupData[0]?.ring_group_uuid,
            destination: AddSelectedExtensionId,
            destination_order: ExtensionListData?.length > 0 ? ExtensionListData.length + 1 : 1,
        };
        setAddExtensionModel(!AddExtensionModel)
        await dispatch(Update_Ring_Group_Destination_List(dict));
        GetRingGroupDetails()
        setIsLoading(false)
        setAddSelectedSkillSet(null)
        setAddSelectedExtension(null)
        setAddSelectedExtensionId(null)



    };

    //add ring group external number 
    const AddRingGroupExternalNumber = async (data) => {
        setIsLoading(true)
        var dict = {
            action_type: "add",
            createdby: user_data?.data?.user_uuid,
            main_uuid: user_data?.data?.main_uuid,
            skill_set: "",
            extension: "",
            destination_type: "number",
            number: AddSelectedExternalNumber,
            ring_timeout: 20,
            ring_group_uuid: RingGroupData[0]?.ring_group_uuid,
            destination: AddSelectedExternalNumber,
            destination_order: ExtensionListData?.length > 0 ? ExtensionListData.length + 1 : 1,
        };
        setAddExternalNumberModel(!AddExternalNumberModel)
        await dispatch(Update_Ring_Group_Destination_List(dict));
        GetRingGroupDetails()
        setIsLoading(false)
        setAddSelectedExternalNumber(null)
    };
    //delete Ring Group Extension 
    const DeleteExtension = (item) => {
        setIsLoading(true)
        if (item !== null && item !== undefined && item !== "") {
            var dict = {};
            dict.ring_group_destination_uuid = item?.ring_group_destination_uuid,
                dict.createdby = user_data?.data?.user_uuid,
                dispatch(Delete_Ring_Group_Destination_List(dict));
        }
    }

    useEffect(() => {
        Log('apiDeleteRingGroupDestinationList :', apiDeleteRingGroupDestinationList);
        if (apiDeleteRingGroupDestinationList == STATUS_FULFILLED) {
            GetRingGroupDetails()
            setIsLoading(false)
        } else if (apiDeleteRingGroupDestinationList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteRingGroupDestinationList]);


    //Update Ring Group Api
    const UpdateRingGroup = () => {
        var dict = {
            call_confirm: CallConfirmSwitch == true ? "YES" : "NO",
            caller_approx_time: CallerAppHoldTime == true ? "YES" : "NO",
            cid_name_prefix: RingGroupPrifix,
            createdby: user_data?.data?.user_uuid,
            did_number: RingGroupData[0].did_number,
            enable_caller_greeting: GreetinCallerSwitch == true ? "YES" : "NO",
            extension: RingGroupData[0].extension,
            follow_me: RingGroupData[0].follow_me,
            ivr_menu_extension: RingGroupData[0].ivr_menu_extension,
            ivr_menu_name: RingGroupData[0].ivr_menu_name,
            main_admin_uuid: user_data?.data?.main_uuid,
            max_wait_time: RingGroupMaxCallTime,
            placeholder_callback: PlaceHolder == true ? "YES" : "NO",
            play_hold_time: RingGroupData[0].play_hold_time,
            position_announcement: PositionAnnouncement == true ? "YES" : "NO",
            ring_destination: RingGroupData[0].ring_destination,
            ring_group_description: RingGroupData[0].ring_group_description,
            ring_group_destinations: [],
            ring_group_enabled: RingGroupData[0].ring_group_enabled,
            ring_group_extension: RingGroupId,
            ring_group_fail_destination: FailOverDesMaxWaitValue, // extesnnion id
            // ring_group_fail_destination_str: FailOverDesMaxWaitValue,
            ring_group_fail_destination_type: FailOverDesMaxWaitType, // extension
            ring_group_greeting: MainSelectedAudioFileId,
            ring_group_music_on_hold: MusicOnHoldFileId,
            ring_group_name: RingGroupName,
            ring_group_strategy: RingGroupStrategyValue,
            ring_group_uuid: RingGroupData[0].ring_group_uuid,
            service_answer_time: ServiceLevelAgreementSecond,
            skip_buy_extension: SkipBusyExtension == true ? "YES" : "NO",
            time_condition_name: RingGroupData[0].time_condition_name,
            user_uuid: user_data?.data?.user_uuid,
            voicemail_id: RingGroupData[0].voicemail_id
        }
        dispatch(Update_Ring_Group(dict));
    }

    useEffect(() => {
        Log('apiUpdateRingGroup :', apiUpdateRingGroup);
        if (apiUpdateRingGroup == STATUS_FULFILLED) {
            GetRingGroupDetails()
        } else if (apiUpdateRingGroup == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateRingGroup]);



    //Get Audio File DropDown List
    useEffect(() => {
        if (GreetinCallerSwitch == true) {
            var dict = {};
            dict.type = 'vm_greeting',
                dict.createdby = user_data?.data?.user_uuid,
                dispatch(Get_Audio_File_List(dict));
        }
    }, [GreetinCallerSwitch]);

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


    //Add Extension On Table
    const handleAddExtension = () => {
        if (AddSelectedExtension == null) {
            setAddSelectedExtensionError("* Please select extension")
        }
        if (AddSelectedSkillSet == null) {
            setAddSelectedSkillSetError("* Please select skill set")
        }
        else {
            if (isExtensionExists(AddSelectedExtensionId)) {
                setAddSelectedExtensionError("* Extension already exists")

            }
            else {
                AddRingGroupExtensionList()
            }
        }

    }
    const isExtensionExists = (extensionId) => {
        return ExtensionListData.some(item => item.destination_type_uuid === extensionId)
    };
    //Add Extension External Number On Table
    const handleAddExternalNumber = () => {
        if (AddSelectedExternalNumber == null) {
            setAddSelectedExternalNumberError("* Please enter external number")
        }
        else if (AddSelectedExternalNumber?.length <= 8) {
            setAddSelectedExternalNumberError("* Please enter valid external number")
        }
        else {
            if (isExternalNumberExists(AddSelectedExternalNumber)) {
                setAddSelectedExternalNumberError("* External number already exists")

            }
            else {
                AddRingGroupExternalNumber()
            }
        }
    }
    const isExternalNumberExists = (externalNumber) => {
        return ExtensionListData.some(item => item.destination_number === externalNumber)
    };

    const handleDeleteExtBtn = (item) => {
        Alert.alert(
            //title
            item.destination_type == "extension" ? item.extension : item?.destination_number,
            //body
            'Are you sure to delete this ring group destination?',
            [
                {
                    text: 'No',
                    onPress: () => { }, style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        DeleteExtension(item)
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
        );
    }

    const openRingStrategyBottomSheet = () => {
        if (RingStrategyBottomSheetRef.current) {
            RingStrategyBottomSheetRef.current.open();
        }
    };

    const openMaxCallWaitTimeBottomSheet = () => {
        if (MaxCallWaitTimeBottomSheetRef.current) {
            MaxCallWaitTimeBottomSheetRef.current.open();
        }
    };


    const openExtensionListBottomSheet = () => {
        if (ExtensionListBottomSheetRef.current) {
            ExtensionListBottomSheetRef.current.open();
        }
    };

    const openSkillListBottomSheet = () => {
        if (SkillListBottomSheetRef.current) {
            SkillListBottomSheetRef.current.open();
        }
    };


    const openFailOverDesWaitBottomSheet = () => {
        if (FailOverDesMaxWaitRef.current) {
            FailOverDesMaxWaitRef.current.open();
        }
    };

    const openServiceLevelAgreement = () => {
        if (ServiceLevelAgreementRef.current) {
            ServiceLevelAgreementRef.current.open();
        }
    };

    const openAudioFileListBottomSheet = () => {
        if (AudioFilebottomSheetRef.current) {
            AudioFilebottomSheetRef.current.open();
        }
    };

    const openMusicOnHoldFileBottomSheet = () => {
        if (MusinOnHoldFilebottomSheetRef.current) {
            MusinOnHoldFilebottomSheetRef.current.open();
        }
    };

    const openExtensionRingTimeOutBottomSheet = () => {
        if (ExtensionRingTimeOutRef.current) {
            ExtensionRingTimeOutRef.current.open();
        }
    };

    const openExtensionSkillSetBottomSheet = () => {
        if (ExtensionSkillSetRef.current) {
            ExtensionSkillSetRef.current.open();
        }
    };
    return (
        <>
            <HeaderBackView isBack={true}
                title={RingGroupId == "" ? "Create Ring Group" : RingGroupId}
                onPressBack={() => { goBack(); }}
                onPressMenu={() => { navigation.toggleDrawer(); }}
            />
            <ScrollView
                style={{ marginBottom: 40 ,paddingHorizontal:20}}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor,
                    marginHorizontal: -20,
                }}>
                    <Text style={styles.black12Medium}>{"Ring Group ID"}</Text>
                    <Text style={styles.black12Semibold}>{RingGroupId}</Text>
                </View>
                <Text style={styles.headerSectionTitle}>{"General"}</Text>
                <View style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor,
                    marginHorizontal: -20,
                }}>
                    <View style={styles.HStack}>
                        <View>
                            <Text style={styles.black12Medium}>{"Ring Group Name"}</Text>
                            <Text style={styles.grey10Medium}>{RingGroupName !== "" ? RingGroupName : "Enter Ring Group Name"}</Text>
                        </View>
                        {RGNameEdit == false &&
                            <TouchableOpacity onPress={() => {
                                setRGNameEdit(!RGNameEdit)
                            }}>
                                <Icon name={"pencil"} size={22} color={black} />
                            </TouchableOpacity>
                        }
                    </View>
                    {RingGroupNameError !== "" && <Text style={styles.errorText}>{RingGroupNameError}</Text>}
                    {RGNameEdit == true &&
                        <View style={{
                            marginTop: 14,
                            flexDirection: "row", alignItems: "center"
                        }}>
                            <TextInput
                                value={RingGroupName}
                                placeholder='12345'
                                placeholderTextColor={grey01}
                                style={styles.textInputStyle}
                                onChangeText={(txt) => {
                                    setRingGroupName(txt)
                                    setRingGroupNameError("")
                                }}
                            />
                            <TouchableOpacity onPress={() => {
                                setRGNameEdit(false)

                            }}
                                style={{ backgroundColor: greenPrimary, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                                <Icon name="check" size={22} color={white} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                <TouchableOpacity onPress={() => { openRingStrategyBottomSheet() }}
                    style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>
                    <View style={styles.HStack}>
                        <Text style={styles.black12Medium}>{"Ring Strategy"}</Text>
                        <Icon name="chevron-down" size={22} color={black} />
                    </View>
                    <Text style={styles.grey10Medium}>{RingGroupStrategy == null ? "Select Strategy" : RingGroupStrategy}</Text>
                    {RingGroupStrategyError !== null && <Text style={[styles.errorText, {}]}>{RingGroupStrategyError}</Text>}
                </TouchableOpacity>
                <View style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor,
                    marginHorizontal: -20,
                }}>

                    <View style={styles.HStack}>
                        <View>
                            <Text style={styles.black12Medium}>{"CID Name Prefix"}</Text>
                            <Text style={[styles.grey10Medium, { marginTop: 4 }]}>{RingGroupPrifix == "" ? "Enter CID Name Prefix" : RingGroupPrifix}</Text>
                        </View>
                        {RGNamePrefix == false &&
                            <TouchableOpacity onPress={() => {
                                setRGNamePrefix(!RGNamePrefix)
                            }}>
                                <Icon name={"pencil"} size={22} color={black} />
                            </TouchableOpacity>
                        }
                    </View>
                    {RingGroupPrifixError !== "" && <Text style={styles.errorText}>{RingGroupPrifixError}</Text>}
                    {RGNamePrefix == true &&
                        <View style={{
                            marginTop: 14,
                            flexDirection: "row", alignItems: "center"
                        }}>
                            <TextInput
                                value={RingGroupPrifix}
                                placeholder='Enter Prefix...'
                                placeholderTextColor={grey01}
                                style={styles.textInputStyle}
                                onChangeText={(txt) => {
                                    setRingGroupPrefix(txt)
                                    setRingGroupPrefixError("")
                                }}
                            />
                            <TouchableOpacity onPress={() => {
                                setRGNamePrefix(false)

                            }}
                                style={{ backgroundColor: greenPrimary, height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 6, marginLeft: 10 }}>
                                <Icon name="check" size={22} color={white} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                <TouchableOpacity onPress={() => { openMaxCallWaitTimeBottomSheet() }}
                    style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>
                    <View style={styles.HStack}>
                        <Text style={styles.black12Medium}>{"Max Caller Wait Time"}</Text>
                        <Icon name="chevron-down" size={22} color={black} />
                    </View>
                    <Text style={styles.grey10Medium}>{RingGroupMaxCallTime == "" ? "Select Max Caller Wait Time" : RingGroupMaxCallTime + " Min"}</Text>
                    {RingGroupMaxCallTimeError !== "" && <Text style={styles.errorText}>{RingGroupMaxCallTimeError}</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    openFailOverDesWaitBottomSheet()
                }}
                    style={{

                        paddingVertical: 16,
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
                        }}>{"Failover Destination After Max Wait Time"}</Text>
                        <Icon name="chevron-down" size={22} color={black} />
                    </View>
                    <Text style={{
                        fontSize: FontSize.FS_11,
                        color: grey,
                        fontFamily: MEDIUM,
                    }}>{FailOverDesMaxWait == "" && FailOverDesMaxWaitTypeName == "" ? "Select Failover Destination" : FailOverDesMaxWaitTypeName + " - " + FailOverDesMaxWait}</Text>
                    {FailOverDesMaxWaitError !== "" && <Text style={styles.errorText}>{FailOverDesMaxWaitError}</Text>}

                </TouchableOpacity>
                <View style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginHorizontal: -20,
                    backgroundColor: "#f0f0f0b5",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <Text style={styles.black14Semibold}>{"Extension List"}</Text>
                </View>
                <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", flex: 1, marginTop: 16, }}>
                    <TouchableOpacity onPress={() => {
                        setAddExtensionModel(!AddExtensionModel);
                    }}
                        style={{
                            borderWidth: 1,
                            borderColor: greenPrimary,
                            padding: 6,
                            borderRadius: 4,
                            flex: 1,
                            width: "100%",
                            alignContent: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                        }}>
                        <Text style={{
                            fontSize: FontSize.FS_10,
                            color: greenPrimary,
                            fontFamily: SEMIBOLD,
                            textAlign: "center",
                            marginRight: 10

                        }}>{"Add Extension"}</Text>
                        <Icon name="plus-circle-outline" size={18} color={greenPrimary} />

                    </TouchableOpacity>
                    <View style={{ flex: 0.2 }}></View>
                    <TouchableOpacity onPress={() => {
                        setAddExternalNumberModel(!AddExternalNumberModel);
                    }}
                        style={{
                            borderWidth: 1,
                            borderColor: greenPrimary,
                            padding: 6,
                            borderRadius: 4,
                            alignContent: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            flex: 1,
                            width: "100%",
                        }}>
                        <Text style={{
                            fontSize: FontSize.FS_10,
                            color: greenPrimary,
                            fontFamily: SEMIBOLD,
                            textAlign: "center",
                            marginRight: 10

                        }}>{"Add External number"}</Text>
                        <Icon name="plus-circle-outline" size={18} color={greenPrimary} />

                    </TouchableOpacity>
                </View>
                <ScrollView style={{ marginHorizontal: -20, marginVertical: 14 }} horizontal={true}>
                    <View >
                        {ExtensionListData?.length > 0 &&
                            <View style={[
                                styles.rowItem,
                                {
                                    backgroundColor: greenPrimary,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 6,
                                    marginTop: 5,
                                },
                            ]}>
                                <View style={{ flexDirection: 'column', width: 40, alignItems: "center", }}>
                                    <Icon name="chevron-up" size={20} color={white} />
                                    <Icon name="chevron-down" size={20} color={white} />
                                </View>
                                <Text style={[styles.TableHaderText, {
                                    width: 50, textAlign: "center",
                                }]}>SEQ.</Text>
                                <Text style={[styles.TableHaderText, {
                                    width: 90, textAlign: "center",
                                }]}>TYPE</Text>
                                <Text style={[styles.TableHaderText, {
                                    width: 115, textAlign: "center",
                                }]}>EXTENSION</Text>
                                <Text style={[styles.TableHaderText, {
                                    width: 100, textAlign: "center",
                                }]}>SKILLSET</Text>
                                <Text style={[styles.TableHaderText, {
                                    width: 100, textAlign: "center",
                                }]}>{"RING \nTIMEOUT"}</Text>
                                <View style={{ width: 60, alignItems: "center" }}></View>

                            </View>
                        }
                        <View style={{ flex: 1 }}>
                            <FlatList
                                style={{ width: '100%', backgroundColor: white, }}
                                data={ExtensionListData}
                                keyExtractor={(item) => item?.destination_order}
                                renderItem={({ item, drag, isActive, index }) => {
                                    const isFirstRow = index === 0;
                                    const isLastRow = index === ExtensionListData.length - 1;
                                    return (
                                        <View
                                            style={[
                                                styles.rowItem,
                                                {
                                                    backgroundColor: paleGreen,
                                                    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                                                    padding: 6,
                                                    marginVertical: 2,
                                                },
                                            ]}
                                        >
                                            <View style={{
                                                flexDirection: "column",
                                                width: 40,
                                                alignItems: "center",

                                            }}>
                                                {isFirstRow ? null : (
                                                    <TouchableOpacity
                                                        style={{
                                                            borderRadius: 4,
                                                        }}
                                                        onPress={() => {
                                                            UpdateRingGroupExtensionList(item, false, index);
                                                        }}
                                                    >
                                                        <Icon name="chevron-up" size={20} color={greenPrimary} />
                                                    </TouchableOpacity>
                                                )}
                                                {isLastRow ? null : (
                                                    <TouchableOpacity
                                                        style={{
                                                            borderRadius: 4,
                                                        }}
                                                        onPress={() => {
                                                            UpdateRingGroupExtensionList(item, true, index);
                                                        }}
                                                    >
                                                        <Icon name="chevron-down" size={20} color={greenPrimary} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                            <Text style={[styles.TableRowText, {
                                                width: 50, textAlign: "center",
                                            }]}>{item.destination_order}</Text>
                                            <Text style={[styles.TableRowText, {
                                                width: 90, textAlign: "center",
                                            }]}>{item.destination_type}</Text>
                                            <Text style={[styles.TableRowText, {
                                                width: 115, textAlign: "center",
                                            }]}>{item.destination_type == "extension" ? item.extension : item?.destination_number}</Text>
                                            {item.destination_type !== "extension" ?
                                                <Text style={[styles.TableRowText, {
                                                    width: 100, textAlign: "center",
                                                }]}>{item.destination_skill_set}</Text>
                                                : <TouchableOpacity onPress={() => {
                                                    setSelectedExtensionRingTimeOut(item)
                                                    openExtensionSkillSetBottomSheet()
                                                }}
                                                    style={[styles.TableRowText, {
                                                        width: 100, borderColor: black, borderWidth: 0.8, borderRadius: 8, paddingVertical: 4
                                                    }]}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 10 }}>
                                                        <Text style={{ color: black, fontFamily: MEDIUM, marginRight: 4, fontSize: FontSize.FS_12, marginTop: -2 }}>{item?.destination_skill_set == null ? "None" : item?.destination_skill_set}</Text>
                                                        <Icon name="chevron-down" size={18} color={black} />
                                                    </View>
                                                </TouchableOpacity>
                                            }
                                            <TouchableOpacity onPress={() => {
                                                setSelectedExtensionRingTimeOut(item)
                                                openExtensionRingTimeOutBottomSheet()
                                            }}
                                                style={[styles.TableRowText, {
                                                    width: 100, borderColor: black, borderWidth: 0.8, borderRadius: 8, paddingVertical: 4
                                                }]}>
                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 10 }}>
                                                    <Text style={{ color: black, fontFamily: MEDIUM, marginRight: 4, fontSize: FontSize.FS_12, marginTop: -2 }}>{item?.destination_ring_timeout == null ? "None" : item?.destination_ring_timeout}</Text>
                                                    <Icon name="chevron-down" size={18} color={black} />
                                                </View>
                                            </TouchableOpacity>

                                            <View style={{ width: 60, alignItems: "center" }}>
                                                <TouchableOpacity style={{
                                                    backgroundColor: red,
                                                    borderRadius: 4,
                                                    height: 30,
                                                    width: 30,
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                                    onPress={() => {
                                                        handleDeleteExtBtn(item)
                                                    }}>
                                                    <Icon name="trash-can" size={19} color={white} />

                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    );
                                }}

                            />
                        </View>

                    </View>
                </ScrollView>

                <View style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginHorizontal: -20,
                    backgroundColor: "#f0f0f0b5",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <Text style={styles.black14Semibold}>{"Advanced Options"}</Text>
                </View>
                <View style={{
                    paddingTop: 16,
                    paddingBottom: 16,
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
                        <Text style={styles.black12Medium}>{"Greeting to Caller"}</Text>

                        <Switch style={{ marginRight: -10 }}
                            trackColor={{ false: '#767577', true: greenPrimary }}
                            thumbColor={GreetinCallerSwitch ? white : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(val) => {
                                setGreetinCallerSwitch(val)
                            }}
                            value={GreetinCallerSwitch}
                        />
                    </View>

                    {GreetinCallerSwitch == true &&
                        <Text style={styles.grey10Medium}>{MainSelectedAudioFileName == null || MainSelectedAudioFileName == "" ? "Choose Audio file" : MainSelectedAudioFileName}</Text>
                    }

                    {GreetinCallerSwitch == true &&
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
                            <Text style={styles.grey10Medium}>
                                {MainSelectedAudioFileName == ''
                                    ? 'Choose Audio file'
                                    : MainSelectedAudioFileName}
                            </Text>
                            <Icon name="chevron-down" size={22} color={grey} />
                        </TouchableOpacity>
                    }
                </View>
                <View style={{
                    paddingTop: 16,
                    paddingBottom: 16,
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
                            <Text style={styles.black12Medium}>{"Call Confirm"}</Text>
                            <Text style={styles.black10Semibold}>{CallConfirmSwitch == true ? "YES" : "NO"}</Text>
                        </View>
                        <Switch style={{ marginRight: -10 }}
                            trackColor={{ false: '#767577', true: greenPrimary }}
                            thumbColor={CallConfirmSwitch ? white : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(val) => {
                                setCallConfirmSwitch(val)
                            }}
                            value={CallConfirmSwitch}
                        />
                    </View>
                </View>
                <View style={{
                    paddingTop: 16,
                    paddingBottom: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor,
                    marginHorizontal: -20,
                }}>
                    <View style={styles.HStack}>
                        <View>
                            <Text style={styles.black12Medium}>{"Music on Hold"}</Text>
                            <Text style={styles.grey10Medium}>{MusicOnHoldFileName == "" ? "Select Music On Hold File" : MusicOnHoldFileName}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            openMusicOnHoldFileBottomSheet();
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
                        <Text style={styles.grey10Medium}>
                            {MusicOnHoldFileName == ''
                                ? 'Choose Music On Hold file'
                                : MusicOnHoldFileName}
                        </Text>
                        <Icon name="chevron-down" size={22} color={grey} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    paddingTop: 16,
                    paddingBottom: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor,
                    marginHorizontal: -20,
                }}>
                    <View style={styles.HStack}>
                        <View>
                            <Text style={styles.black12Medium}>{"Skip Busy Extension"}</Text>
                            <Text style={styles.black10Semibold}>{SkipBusyExtension == true ? "YES" : "NO"}</Text>
                        </View>
                        <Switch style={{ marginRight: -10 }}
                            trackColor={{ false: '#767577', true: greenPrimary }}
                            thumbColor={SkipBusyExtension ? white : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(val) => {
                                setSkipBusyExtension(val)
                            }}
                            value={SkipBusyExtension}
                        />
                    </View>
                </View>
                <View style={{
                    paddingTop: 16,
                    paddingBottom: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor,
                    marginHorizontal: -20,
                }}>
                    <View style={styles.HStack}>
                        <View>
                            <Text style={styles.black12Medium}>{"Position Announcement"}</Text>
                            <Text style={styles.black10Semibold}>{PositionAnnouncement == true ? "YES" : "NO"}</Text>
                        </View>
                        <Switch style={{ marginRight: -10 }}
                            trackColor={{ false: '#767577', true: greenPrimary }}
                            thumbColor={PositionAnnouncement ? white : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(val) => {
                                setPositionAnnouncement(val)
                            }}
                            value={PositionAnnouncement}
                        />
                    </View>
                </View>
                <View style={{
                    paddingTop: 16,
                    paddingBottom: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor,
                    marginHorizontal: -20,
                }}>
                    <View style={styles.HStack}>
                        <View>
                            <Text style={styles.black12Medium}>{"Caller Approximate Hold Time"}</Text>
                            <Text style={styles.black10Semibold}>{CallerAppHoldTime == true ? "YES" : "NO"}</Text>
                        </View>
                        <Switch style={{ marginRight: -10 }}
                            trackColor={{ false: '#767577', true: greenPrimary }}
                            thumbColor={CallerAppHoldTime ? white : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(val) => {
                                setCallerAppHoldTime(val)
                            }}
                            value={CallerAppHoldTime}
                        />
                    </View>
                </View>
                <View style={{
                    paddingTop: 16,
                    paddingBottom: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor,
                    marginHorizontal: -20,
                }}>
                    <View style={styles.HStack}>
                        <View>
                            <Text style={styles.black12Medium}>{"Placeholder Callback"}</Text>
                            <Text style={styles.black10Semibold}>{PlaceHolder == true ? "YES" : "NO"}</Text>
                        </View>
                        <Switch style={{ marginRight: -10 }}
                            trackColor={{ false: '#767577', true: greenPrimary }}
                            thumbColor={PlaceHolder ? white : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(val) => {
                                setPlaceHolder(val)
                            }}
                            value={PlaceHolder}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => {
                    openServiceLevelAgreement()
                }}
                    style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>
                    <View style={styles.HStack}>
                        <View>
                            <Text style={styles.black12Medium}>{"Service Level Agreement (SLA)"}</Text>
                            <Text style={[styles.black10Semibold, { marginTop: 4 }]}>{ServiceLevelAgreement == "" ? "None" : ServiceLevelAgreement}</Text>
                        </View>
                        <Icon name="chevron-down" size={22} color={black} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    if (isEdit == true) {
                        UpdateRingGroup()
                    }
                    else {
                        CreateRingGroup()
                    }
                }}
                    style={styles.primaryBtn}>
                    <Text style={styles.white14Semibold}>{isEdit ? "Update" : "Add Ring Group"}</Text>
                </TouchableOpacity>
            </ScrollView>

            <RouteDestinationBottomSheet
                data={RINGSTRATEGY}
                headerTitle={'Select Ring Strategy'}
                currentValue={RingGroupStrategyValue}
                bottomSheetRef={RingStrategyBottomSheetRef}
                selectedValue={data => {
                    setRingGroupStrategy(data)
                    setRingGroupStrategyError(null)
                }}
                selectedRoute={data => {
                    setRingGroupStrategyValue(data)
                }}
            />
            <SingleTimeoutBottomSheet
                data={MAXCALLWAITTIME}
                headerTitle={'Max Caller Wait Time'}
                bottomSheetRef={MaxCallWaitTimeBottomSheetRef}
                selectedValue={data => {
                    setRingGroupMaxCallTime(data);
                    setRingGroupMaxCallTimeError("")
                }}
            />
            {destination_list !== null && <SectionBottomSheet
                data={destination_list}
                headerTitle={'Failover Destination After Max Wait Time'}
                currentValue={FailOverDesMaxWaitValue}
                bottomSheetRef={FailOverDesMaxWaitRef}
                selectedValue={data => {
                    setFailOverDesMaxWait(data)
                    setFailOverDesMaxWaitError("")
                }}
                selectedRoute={data => {

                    const parts = data.split('_');
                    setFailOverDesMaxWaitValue(parts[1])
                    setFailOverDesMaxWaitType(parts[0])

                }}
                selectedRouteType={data => {
                    setFailOverDesMaxWaitTypeName(data)
                }}
            />
            }

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

            <AudioFileListBottomSheet
                headerTitle={'Please select music on hold'}
                AudioFileList={MusicOnHoldFileList}
                CurrantId={MusicOnHoldFileId}
                bottomSheetRef={MusinOnHoldFilebottomSheetRef}
                selectedValue={data => {
                    setMusicOnHoldFileName(data);
                }}
                selectedId={data => {
                    setMusicOnHoldFileId(data);
                }}
            />
            <DestinationBottomSheet
                data={ExtensionData}
                headerTitle={'Select Extension'}
                currentValue={AddSelectedExtensionId}
                bottomSheetRef={ExtensionListBottomSheetRef}
                selectedValue={data => {
                    setAddSelectedExtension(data);
                    setAddSelectedExtensionError("")
                }}
                selectedDestination={data => {
                    setAddSelectedExtensionId(data)
                }}
            />

            <SingleTimeoutBottomSheet
                data={SKILLSET}
                headerTitle={'Select Skill Set'}
                bottomSheetRef={SkillListBottomSheetRef}
                selectedValue={data => {
                    setAddSelectedSkillSet(data);
                    setAddSelectedSkillSetError("")
                }}
            />

            <SingleTimeoutBottomSheet
                data={SLA}
                headerTitle={'Service Level Agreement (SLA)'}
                bottomSheetRef={ServiceLevelAgreementRef}
                selectedValue={data => {
                    setServiceLevelAgreement(data);
                }}
            />
            <SingleTimeoutBottomSheet
                data={SINGLETIMEOUT}
                headerTitle={'Select Ring Time out'}
                bottomSheetRef={ExtensionRingTimeOutRef}
                selectedValue={data => {
                    setExtensionRingTimeOut(data);
                    UpdateExtensionRingTimeOut(data)

                }}
            />
            <SingleTimeoutBottomSheet
                data={SKILLSET}
                headerTitle={'Select Skill set'}
                bottomSheetRef={ExtensionSkillSetRef}
                selectedValue={data => {
                    setExtensionSkillSet(data);
                    UpdateExtensionSkillSet(data.toString())

                }}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={AddExtensionModel}
                onRequestClose={() => {
                    setAddExtensionModel(!AddExtensionModel);
                    setAddSelectedSkillSet(null)
                    setAddSelectedExtension(null)
                    setAddSelectedExtensionId(null)
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                            onPress={() => {
                                setAddExtensionModel(!AddExtensionModel)
                                setAddSelectedSkillSet(null)
                                setAddSelectedExtension(null)
                                setAddSelectedExtensionId(null)
                            }
                            }>
                            <Icon name={"close"} size={24} color={black} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 10
                        }}>{"Extension"}</Text>
                        <TouchableOpacity onPress={() => {
                            openExtensionListBottomSheet()
                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderWidth: 1,
                                borderColor: black,
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                marginVertical: 10,
                                borderRadius: 4,
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>{AddSelectedExtension == null ? "Select Extension" : AddSelectedExtension}</Text>
                            <Icon name={"chevron-down"} size={22} color={grey} />

                        </TouchableOpacity>
                        {AddSelectedExtensionError !== "" && <Text style={[styles.errorText, { marginTop: -3 }]}>{AddSelectedExtensionError}</Text>}

                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 14
                        }}>{"Skill Set"}</Text>
                        <TouchableOpacity onPress={() => {
                            openSkillListBottomSheet()
                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderWidth: 1,
                                borderColor: black,
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                marginVertical: 10,
                                borderRadius: 4,
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>{AddSelectedSkillSet == null ? "Select Skill Set" : AddSelectedSkillSet}</Text>
                            <Icon name={"chevron-down"} size={22} color={grey} />

                        </TouchableOpacity>
                        {AddSelectedSkillSetError !== "" && <Text style={[styles.errorText, { marginTop: -3 }]}>{AddSelectedSkillSetError}</Text>}

                        <TouchableOpacity onPress={() => {
                            handleAddExtension()
                        }}
                            style={{ backgroundColor: greenPrimary, height: 40, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: white,
                                fontFamily: MEDIUM,
                            }}>{"Add Extension"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={AddExternalNumberModel}
                onRequestClose={() => {
                    setAddExternalNumberModel(!AddExternalNumberModel);
                    setAddSelectedExternalNumber(null)
                    setAddSelectedExternalNumberError("")

                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                            onPress={() => {
                                setAddExternalNumberModel(!AddExternalNumberModel)
                                setAddSelectedExternalNumber(null)
                                setAddSelectedExternalNumberError("")

                            }}>
                            <Icon name={"close"} size={24} color={black} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 10
                        }}>{"External Number"}</Text>
                        <TextInput
                            value={AddSelectedExternalNumber}
                            placeholder='+12765832737'
                            placeholderTextColor={grey}
                            maxLength={12}
                            keyboardType='number-pad'
                            style={{
                                borderWidth: 1,
                                borderColor: grey,
                                height: 40,
                                borderRadius: 6,
                                paddingHorizontal: 14,
                                marginVertical: 10

                            }}
                            onChangeText={(txt) => {
                                setAddSelectedExternalNumber(txt)
                                if (txt.length >= 9) {
                                    setAddSelectedExternalNumberError("")
                                }
                            }}
                        />

                        {AddSelectedExternalNumberError !== "" && <Text style={[styles.errorText, { marginTop: -3 }]}>{AddSelectedExternalNumberError}</Text>}

                        <TouchableOpacity onPress={() => {
                            handleAddExternalNumber()
                        }}
                            style={{ backgroundColor: greenPrimary, height: 40, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: white,
                                fontFamily: MEDIUM,
                            }}>{"Add External Number"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {(isLoading || IsLoading) && <LoadingView />}
        </>
    );
};

export default RingGroupManage;

const styles = StyleSheet.create({
    errorText: {
        fontFamily: MEDIUM,
        fontSize: FontSize.FS_09,
        marginTop: 4,
        color: red,
    },
    primaryBtn: {
        backgroundColor: greenPrimary,
        alignItems: "center",
        paddingVertical: 10,
        marginVertical: 40,
        justifyContent: "center",
        borderRadius: 4,
        width: "100%"
        ,
    },
    white14Semibold: {
        fontSize: FontSize.FS_14,
        color: white,
        fontFamily: SEMIBOLD,
    },
    black10Semibold: {
        fontSize: FontSize.FS_10,
        color: black,
        fontFamily: SEMIBOLD,
    },
    black14Semibold: {
        fontSize: FontSize.FS_14,
        color: black,
        fontFamily: SEMIBOLD,
    },
    grey10Medium: {
        fontSize: FontSize.FS_11,
        color: grey,
        fontFamily: MEDIUM,
        marginTop: 4
    },
    textInputStyle: {
        borderWidth: 1,
        borderColor: grey01,
        height: 40,
        borderRadius: 6,
        paddingHorizontal: 14,
        flex: 1,
        fontFamily: MEDIUM,
        color: black
        ,
    },
    grey10Medium: {
        fontSize: FontSize.FS_10,
        color: grey,
        fontFamily: MEDIUM,
    },
    HStack: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerSectionTitle: {
        fontSize: FontSize.FS_14,
        color: black,
        fontFamily: SEMIBOLD,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: -20,
        backgroundColor: "#f0f0f0b5"
        ,
    },
    black12Semibold: {
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: SEMIBOLD,
    },
    black12Medium: {
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: MEDIUM,
    },
    TableRowText: {
        fontSize: FontSize.FS_14,
        color: black,
        flex: 1,
        marginHorizontal: 20,
        fontFamily: MEDIUM,
    },
    TableHaderText: {
        fontSize: FontSize.FS_12,
        color: white,
        flex: 1,
        fontFamily: SEMIBOLD,
        marginHorizontal: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: black05
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
///1596