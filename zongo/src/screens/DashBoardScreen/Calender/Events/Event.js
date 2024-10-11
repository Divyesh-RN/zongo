import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderBackView from '../../../../commonComponents/HeaderBackView';
import { goBack } from '../../../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import SideMenuModuleCheck from '../../../../commonComponents/RolePermission/SideMenuModuleCheck';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { black, black05, darkGrey, grey, grey01, transparent, midGreen, red, warmGrey, white, greenPrimary } from '../../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD, REGULAR } from '../../../../constants/Fonts';
import { Delete_User_Events, Get_Meeting_Mode, Get_User_Events, Manage_User_Events, Update_User_Events } from '../../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { resetEventsApiStatus } from '../../../../redux/reducers/EventsReducer';
import { resetGeneralApiStatus } from '../../../../redux/reducers/generalReducer';
import { HEIGHT, REACT_APP_GOOGLE_API_KEY, STATUS_FULFILLED, STATUS_REJECTED, WIDTH } from '../../../../constants/ConstantKey';
import { Log } from '../../../../commonComponents/Log';
import { Dropdown } from 'react-native-element-dropdown';
import LoadingView from '../../../../commonComponents/LoadingView';
import Clipboard from '@react-native-clipboard/clipboard';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const Events = ({ navigation }) => {

    const [eventList, setEventList] = useState([]);
    const [ManageEventModal, setManageEventModal] = useState(false);
    const [isEdit, setisEdit] = useState(false);
    const [CurrentEvent, setCurrentEvent] = useState("");
    const [EventTitle, setEventTitle] = useState("");
    const [EventTitleError, setEventTitleError] = useState("");
    const [EventTime, setEventTime] = useState("");
    const [EventTimeError, setEventTimeError] = useState("");
    // meeting type
    const [MeetingTypeData, setMeetingTypeData] = useState([
        {
            id: 1,
            key: "Phone Call",
            value: "phone_call",
            selected: false
        },
        {
            id: 2,
            key: "Online Meeting",
            value: "online_meeting",
            selected: false
        },
        {
            id: 3,
            key: "In Person",
            value: "in_person",
            selected: false
        },
    ]);
    const [MeetingType, setMeetingType] = useState([]);
    const [MeetingTypeError, setMeetingTypeError] = useState("");

    // phone call type
    const [PhoneCallTypeeData, setPhoneCallTypeeData] = useState([
        {
            id: 1,
            key: "Call To Prospect",
            value: "call_to_prospect"
        },
        {
            id: 1,
            key: "Call To Calendar Owner",
            value: "call_to_calender_owner"
        },
    ]);
    const [PhoneCallTypee, setPhoneCallTypee] = useState("");
    const [PhoneCallTypeeError, setPhoneCallTypeeError] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [PhoneNumberError, setPhoneNumberError] = useState("");

    // online meeting type
    const [OnlineCallTypeeData, setOnlineCallTypeeData] = useState([
        {
            id: 1,
            key: "Internal",
            value: "internal"
        },
        {
            id: 1,
            key: "External",
            value: "external"
        },
    ]);
    const [OnlineCallTypee, setOnlineCallTypee] = useState("");
    const [OnlineCallTypeeError, setOnlineCallTypeeError] = useState("");
    const [MeetingUrl, setMeetingUrl] = useState("");
    const [MeetingUrlError, setMeetingUrlError] = useState("");

    // in person
    const [Address, setAddress] = useState("");
    const [AddressError, setAddressError] = useState("");
    const [CurrentLocation, setCurrentLocation] = useState({
        latitude: "",
        longitude: "",
    });


    const user_data = useSelector(state => state.userRedux.user_data);
    const apiGetEventsList = useSelector(state => state.eventsRedux.apiGetEventsList);
    const apiManageUserEvents = useSelector(state => state.eventsRedux.apiManageUserEvents);
    const apiUpdateUserEvents = useSelector(state => state.eventsRedux.apiUpdateUserEvents);
    const apiDeleteUserEvent = useSelector(state => state.eventsRedux.apiDeleteUserEvent);
    const events_list = useSelector(state => state.eventsRedux.events_list);
    const isLoading = useSelector(state => state.eventsRedux.isLoader);
    const isError = useSelector(state => state.eventsRedux.isError);
    const error_message = useSelector(state => state.eventsRedux.error_message);
    const apiGetMeetingMode = useSelector(state => state.eventsRedux.apiGetMeetingMode);
    const meeting_mode = useSelector(state => state.eventsRedux.meeting_mode);


    var call_status = SideMenuModuleCheck("extensions", user_data);

    const MEETING_TIME_DROPDOWN_DATA = [
        {
            id: 1,
            title: "30 MIN",
            value: "30"
        },
        {
            id: 2,
            title: "1 HOUR",
            value: "60"
        },
        {
            id: 3,
            title: "2 HOUR",
            value: "120"
        }
    ]
    const dispatch = useDispatch();
    const ref = useRef();

    const GetUserEventList = () => {
        var dict = { createdby: user_data?.data?.user_uuid };
        dispatch(Get_User_Events(dict))
    }


    useFocusEffect(
        useCallback(() => {
            GetUserEventList()
            return () => {
                dispatch(resetEventsApiStatus());
                dispatch(resetGeneralApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiGetEventsList :', apiGetEventsList);
        if (apiGetEventsList == STATUS_FULFILLED) {
            Log("events_list length :", events_list?.length)
            setEventList(events_list)

        } else if (apiGetEventsList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetEventsList]);

    useEffect(() => {
        Log('apiManageUserEvents :', apiManageUserEvents);
        if (apiManageUserEvents == STATUS_FULFILLED) {
            clearAllState()
            GetUserEventList()


        } else if (apiManageUserEvents == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiManageUserEvents]);

    useEffect(() => {
        Log('apiUpdateUserEvents :', apiUpdateUserEvents);
        if (apiUpdateUserEvents == STATUS_FULFILLED) {
            setManageEventModal(false);
            setEventTime("")
            setEventTitle("")
            GetUserEventList()

        } else if (apiUpdateUserEvents == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateUserEvents]);

    useEffect(() => {
        Log('apiDeleteUserEvent :', apiDeleteUserEvent);
        if (apiDeleteUserEvent == STATUS_FULFILLED) {
            GetUserEventList()

        } else if (apiDeleteUserEvent == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteUserEvent]);
    
    useEffect(() => {
        Log('apiGetMeetingMode :', apiGetMeetingMode);
        if (apiGetMeetingMode == STATUS_FULFILLED) {
            const updatedMeetingTypeData = MeetingTypeData.map(item => {
                const isSelected = meeting_mode.some(meeting => meeting.meeting_type === item.value);
                return { ...item, selected: isSelected };
            });

            setMeetingTypeData(updatedMeetingTypeData);
            const selectedMeetingType = updatedMeetingTypeData.filter(item => item.selected);
            if (selectedMeetingType?.length > 0) {
                setMeetingTypeError("")
            }
            setMeetingType(selectedMeetingType)
            const inPersonMeeting = meeting_mode.find(meeting => meeting.meeting_type === 'in_person');
            if (inPersonMeeting) {
                setAddress(inPersonMeeting.google_address);
            }
            const PhoneCallMeeting = meeting_mode.find(meeting => meeting.meeting_type === 'phone_call');
            if (PhoneCallMeeting) {
                setPhoneCallTypee(PhoneCallMeeting.phone_call_type);
                if (PhoneCallMeeting.phone_call_type == "call_to_calender_owner") {
                    setPhoneNumber(PhoneCallMeeting?.call_number)
                }
            }
            const OnlineCallMeeting = meeting_mode.find(meeting => meeting.meeting_type === 'online_meeting');
            if (OnlineCallMeeting) {
                setOnlineCallTypee(OnlineCallMeeting.online_meeting_type);
                if (OnlineCallMeeting.online_meeting_type == "external") {
                    setMeetingUrl(OnlineCallMeeting?.meeting_url)
                }
            }

        } else if (apiGetMeetingMode == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetMeetingMode]);

    const clearAllState = () => {
        setManageEventModal(false);
        setEventTime("")
        setEventTimeError("")
        setEventTitle("")
        setEventTitleError("")
        setMeetingType([])
        setMeetingTypeError("")
        setPhoneCallTypee("")
        setPhoneNumber("")
        setOnlineCallTypee("")
        setMeetingUrl("")
        setAddress("")
        const updatedData = MeetingTypeData.map(item => {
            if (item) {
                return { ...item, selected: false };
            }
            return item;
        });
        setMeetingTypeData(updatedData);
    };

    const handleCopyLink = (item) => {
        Clipboard.setString(`https://zongopbx.com/schedule-meeting?t=${item.user_meeting_event_uuid}`);
        Alert.alert('Link Copied', `https://zongopbx.com/schedule-meeting?t=${item.user_meeting_event_uuid}`);
    };

    const handleEdit = (event) => {
        setEventTitle(event?.event_title)
        setEventTime(event?.meeting_duration)
        setCurrentEvent(event?.user_meeting_event_uuid)
        setisEdit(true)
        setManageEventModal(true)
        var dict = {
            user_meeting_event_uuid: event?.user_meeting_event_uuid
        }
        dispatch(Get_Meeting_Mode(dict))
    };

    const manageEvent = () => {
        let isValid = true;
        let phoneCall = MeetingType?.find(item => item.value === "phone_call")?.value;
        let onlineCall = MeetingType?.find(item => item.value === "online_meeting")?.value;
        let inPerson = MeetingType?.find(item => item.value === "in_person")?.value;
        if (EventTitle.trim() === "") {
            setEventTitleError("* Event title is required");
            isValid = false;
        } else {
            setEventTitleError("");
        }

        if (EventTime.trim() === "") {
            setEventTimeError("* Meeting Duration time is required");
            isValid = false;
        } else {
            setEventTimeError("");
        }

        if (MeetingType?.length === 0 || MeetingType === undefined) {
            setMeetingTypeError("* Meeting type is required");
            isValid = false;
        } else {
            setMeetingTypeError("");
        }
        if (phoneCall !== undefined && PhoneCallTypee === "") {
            setPhoneCallTypeeError("* Phone call type is required");
            isValid = false;
        } else {
            setPhoneCallTypeeError("");
        }
        if (PhoneCallTypee === "call_to_calender_owner" && PhoneNumber === "") {
            setPhoneNumberError("* Phone number is required");
            isValid = false;
        } else {
            setPhoneNumberError("");
        }
        if (onlineCall !== undefined && OnlineCallTypee === "") {
            setOnlineCallTypeeError("* Online call type is required");
            isValid = false;
        } else {
            setOnlineCallTypeeError("");
        }
        if (OnlineCallTypee === "external" && MeetingUrl === "") {
            setMeetingUrlError("* Meeting URL is required");
            isValid = false;
        } else {
            setMeetingUrlError("");
        }
        if (inPerson !== undefined && Address === "") {
            setAddressError("* Address is required");
            isValid = false;
        } else {
            setAddressError("");
        }
        if (isValid) {
            let meeting_type = MeetingType?.map(item => item.value);
            if (isEdit) {
                var dict = {
                    action: isEdit ? "edit" : "add",
                    createdby: user_data?.data?.user_uuid,
                    event_title: EventTitle,
                    main_uuid: user_data?.data?.main_uuid,
                    meeting_duration: Number(EventTime),
                    user_meeting_event_uuid: CurrentEvent,
                    meeting_modes: meeting_type,
                    meeting_mode_data: {}
                }
                if (inPerson !== undefined) {
                    dict.meeting_mode_data.in_person = {
                        meeting_type: inPerson,
                        phone_call_type: "",
                        call_number: "",
                        online_meeting_type: "",
                        meeting_url: "",
                        google_address: Address,
                        address_latitude: CurrentLocation.latitude,
                        address_logitude: CurrentLocation.longitude
                    };
                }
                if (phoneCall !== undefined) {
                    dict.meeting_mode_data.phone_call = {
                        meeting_type: phoneCall !== undefined ? phoneCall : "",
                        phone_call_type: PhoneCallTypee,
                        call_number: PhoneNumber !== "" ? PhoneNumber : "",
                        online_meeting_type: "",
                        meeting_url: "",
                        google_address: "",
                        address_latitude: "",
                        address_logitude: ""
                    };
                }
                if (onlineCall !== undefined) {
                    dict.meeting_mode_data.online_meeting = {
                        meeting_type: onlineCall !== undefined ? onlineCall : "",
                        phone_call_type: "",
                        call_number: "",
                        online_meeting_type: OnlineCallTypee,
                        meeting_url: MeetingUrl !== "" ? MeetingUrl : "",
                        google_address: "",
                        address_latitude: "",
                        address_logitude: ""
                    };
                }
                dispatch(Update_User_Events(dict))

            }
            else {
                var dict = {
                    action: isEdit ? "edit" : "add",
                    createdby: user_data?.data?.user_uuid,
                    event_title: EventTitle,
                    main_uuid: user_data?.data?.main_uuid,
                    meeting_duration: Number(EventTime),
                    meeting_modes: meeting_type,
                    meeting_mode_data: {}
                }
                if (inPerson !== undefined) {
                    dict.meeting_mode_data.in_person = {
                        meeting_type: inPerson,
                        phone_call_type: "",
                        call_number: "",
                        online_meeting_type: "",
                        meeting_url: "",
                        google_address: Address,
                        address_latitude: CurrentLocation.latitude,
                        address_logitude: CurrentLocation.longitude
                    };
                }
                if (phoneCall !== undefined) {
                    dict.meeting_mode_data.phone_call = {
                        meeting_type: phoneCall !== undefined ? phoneCall : "",
                        phone_call_type: PhoneCallTypee,
                        call_number: PhoneNumber !== "" ? PhoneNumber : "",
                        online_meeting_type: "",
                        meeting_url: "",
                        google_address: "",
                        address_latitude: "",
                        address_logitude: ""
                    };
                }
                if (onlineCall !== undefined) {
                    dict.meeting_mode_data.online_meeting = {
                        meeting_type: onlineCall !== undefined ? onlineCall : "",
                        phone_call_type: "",
                        call_number: "",
                        online_meeting_type: OnlineCallTypee,
                        meeting_url: MeetingUrl !== "" ? MeetingUrl : "",
                        google_address: "",
                        address_latitude: "",
                        address_logitude: ""
                    };
                }
                dispatch(Manage_User_Events(dict))

            }
        }
    }
    const handleDeleteBtn = (item) => {
        Alert.alert(
            //title
            item?.event_title,
            //body
            'Users will be unable to schedule further meetings with deleted event types. Meetings previously scheduled will not be affected. Are you sure to delete this time slot?',
            [
                {
                    text: 'No',
                    onPress: () => { }, style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {

                        var dict = {
                            createdby: user_data?.data?.user_uuid,
                            user_meeting_event_uuid: item?.user_meeting_event_uuid
                        }
                        dispatch(Delete_User_Events(dict))
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.eventItem}>
            <View style={styles.eventDetails}>
                <View style={styles.eventRow}>
                    <Icon name="calendar" size={18} color={grey} />
                    <Text style={styles.eventTitleText}>{item.event_title}</Text>
                </View>
                <View style={[styles.eventRow, { marginTop: 2 }]}>
                    <Icon name="clock-outline" size={18} color={grey} />
                    <Text style={styles.eventTimeText}>{item.meeting_duration + " Min Duration"}</Text>
                </View>
            </View>
            <View style={styles.eventActions}>
                <TouchableOpacity onPress={() => handleCopyLink(item)} style={[styles.iconButton, { backgroundColor: warmGrey }]}>
                    <Icon name="content-copy" size={18} color={white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    handleEdit(item)
                }} style={[styles.iconButton, { backgroundColor: "#5856ce" }]}>
                    <Icon name="pencil-outline" size={18} color={white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteBtn(item)} style={[styles.iconButton, { backgroundColor: "#f33" }]}>
                    <Icon name="trash-can" size={18} color={white} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleSelection = (id) => {
        const updatedData = MeetingTypeData.map(item => {
            if (item.id === id) {
                if (item.selected && item.value == "online_meeting") {
                    setOnlineCallTypee("")
                    setMeetingUrl("")
                }
                if (item.selected && item.value == "phone_call") {
                    setPhoneCallTypee("")
                    setPhoneNumber("")
                }
                if (item.selected && item.value == "in_person") {
                    setAddress("")
                }
                return { ...item, selected: !item.selected };
            }
            return item;
        });
        setMeetingTypeData(updatedData);
        const selectedMeetingType = updatedData.filter(item => item.selected);
        if (selectedMeetingType?.length > 0) {
            setMeetingTypeError("")
        }
        setMeetingType(selectedMeetingType)

    };

    return (
        <>
            <HeaderBackView
                title="Events"
                isBack={true}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
            <FlatList
                data={eventList}
                renderItem={renderItem}
                keyExtractor={item => item.user_meeting_event_uuid}
                contentContainerStyle={styles.container}
                ListEmptyComponent={<View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    marginTop: HEIGHT / 2.5
                }}>
                    <Text style={[styles.eventTitleText, { backgroundColor: grey01, paddingHorizontal: 20, paddingVertical: 4, borderRadius: 4, color: grey }]}>{"! No events found"}</Text>
                </View>}
            />
            <TouchableOpacity onPress={() => {
                setManageEventModal(!ManageEventModal);
                setisEdit(false)
            }} style={styles.createExtBtn}>
                <Icon name="plus" size={25} color={white} />
                <Text style={styles.createExtTxt}>Add Event</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={ManageEventModal}

                onRequestClose={() => {
                    clearAllState()
                }}>

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={{ alignItems: "center", flexDirection: "row" }}
                            onPress={() => clearAllState()}>
                            <Text style={[styles.eventTitleText, { flex: 1, textAlign: "center", textDecorationLine: "underline", fontSize: FontSize.FS_15 }]}>{isEdit ? "Edit Event" : "Add New Event"}</Text>
                            <Icon name={"close"} size={22} color={black} />
                        </TouchableOpacity>
                        <ScrollView style={{ marginHorizontal: 0 }}>
                            <View>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    marginTop: 12, marginBottom: 8
                                }}>{"Event Title"}</Text>
                                <TextInput
                                    value={EventTitle}
                                    placeholder='Enter event title here...'
                                    placeholderTextColor={grey01}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: grey01,
                                        height: 38,
                                        borderRadius: 6,
                                        paddingHorizontal: 14,
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}
                                    onChangeText={(txt) => {
                                        setEventTitle(txt)
                                        if (txt.length > 0) {
                                            setEventTitleError("")
                                        }
                                    }}
                                />
                                {EventTitleError !== "" && <Text style={styles.errorText}>{EventTitleError}</Text>}
                            </View>
                            <View>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    marginTop: 12, marginBottom: 8
                                }}>{"Meeting Duration"}</Text>
                                <Dropdown
                                    itemTextStyle={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}
                                    itemContainerStyle={{ marginVertical: -5 }}
                                    selectedTextStyle={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}
                                    ref={ref}
                                    style={styles.dropdown}
                                    placeholder='Select meeting duration'
                                    containerStyle={styles.containerStyle}
                                    placeholderStyle={styles.placeholderStyle}
                                    iconStyle={styles.iconStyle}
                                    data={MEETING_TIME_DROPDOWN_DATA}
                                    maxHeight={200}
                                    labelField="title"
                                    valueField="value"
                                    value={EventTime}
                                    onChange={(item) => {
                                        setEventTime(item?.value);
                                        setEventTimeError("")
                                    }}
                                    onChangeText={() => { }} // Keep search keyword
                                />
                                {EventTimeError !== "" && <Text style={styles.errorText}>{EventTimeError}</Text>}
                            </View>
                            <View>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    marginTop: 12, marginBottom: 8
                                }}>{"Meeting Type"}</Text>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 4
                                }}>
                                    {MeetingTypeData?.map(item => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={{ flexDirection: "row", alignItems: "center" }}
                                            onPress={() => handleSelection(item.id)}
                                        >
                                            <Icon
                                                name={item.selected ? "checkbox-marked" : "checkbox-blank-outline"}
                                                size={19}
                                                color={black}
                                            />
                                            <Text style={{
                                                fontSize: FontSize.FS_11,
                                                color: black,
                                                fontFamily: SEMIBOLD,
                                                marginLeft: 4
                                            }}>
                                                {item.key}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {MeetingTypeError !== "" && <Text style={styles.errorText}>{MeetingTypeError}</Text>}
                            </View>
                            {MeetingType?.map(item => {
                                if (item.value === "phone_call") {
                                    return (
                                        <View>
                                            <Text style={{
                                                fontSize: FontSize.FS_12,
                                                color: black,
                                                fontFamily: SEMIBOLD,
                                                marginTop: 12, marginBottom: 8
                                            }}>{"Phone call Type"}</Text>
                                            <Dropdown
                                                itemTextStyle={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}
                                                itemContainerStyle={{ marginVertical: -5 }}
                                                selectedTextStyle={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}
                                                ref={ref}
                                                style={styles.dropdown}
                                                placeholder='Select phone call type'
                                                containerStyle={styles.containerStyle}
                                                placeholderStyle={styles.placeholderStyle}
                                                iconStyle={styles.iconStyle}
                                                data={PhoneCallTypeeData}
                                                maxHeight={200}
                                                labelField="key"
                                                valueField="value"
                                                value={PhoneCallTypee}
                                                onChange={(item) => {
                                                    setPhoneCallTypee(item?.value);
                                                    setPhoneCallTypeeError("")
                                                }}
                                                onChangeText={() => { }} // Keep search keyword
                                            />
                                            {PhoneCallTypeeError !== "" && <Text style={styles.errorText}>{PhoneCallTypeeError}</Text>}
                                            {PhoneCallTypee === "call_to_calender_owner" &&
                                                <View>
                                                    <Text style={{
                                                        fontSize: FontSize.FS_12,
                                                        color: black,
                                                        fontFamily: SEMIBOLD,
                                                        marginTop: 12, marginBottom: 8
                                                    }}>{"Phone Number"}</Text>
                                                    <TextInput
                                                        value={PhoneNumber}
                                                        placeholder='Enter phone number'
                                                        placeholderTextColor={grey01}
                                                        style={{
                                                            borderWidth: 1,
                                                            borderColor: grey01,
                                                            height: 38,
                                                            borderRadius: 6,
                                                            paddingHorizontal: 14,
                                                            fontSize: FontSize.FS_12,
                                                            color: black,
                                                            fontFamily: MEDIUM,
                                                        }}
                                                        onChangeText={(txt) => {
                                                            setPhoneNumber(txt)
                                                            if (txt.length > 0) {
                                                                setPhoneNumberError("")
                                                            }
                                                        }}
                                                    />
                                                    {PhoneNumberError !== "" && <Text style={styles.errorText}>{PhoneNumberError}</Text>}
                                                </View>
                                            }

                                        </View>
                                    );
                                } else if (item.value === "online_meeting") {
                                    return (
                                        <View>
                                            <Text style={{
                                                fontSize: FontSize.FS_12,
                                                color: black,
                                                fontFamily: SEMIBOLD,
                                                marginTop: 12, marginBottom: 8
                                            }}>{"Online call Type"}</Text>
                                            <Dropdown
                                                itemTextStyle={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}
                                                itemContainerStyle={{ marginVertical: -5 }}
                                                selectedTextStyle={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}
                                                ref={ref}
                                                style={styles.dropdown}
                                                placeholder='Select online call type'
                                                containerStyle={styles.containerStyle}
                                                placeholderStyle={styles.placeholderStyle}
                                                iconStyle={styles.iconStyle}
                                                data={OnlineCallTypeeData}
                                                maxHeight={200}
                                                labelField="key"
                                                valueField="value"
                                                value={OnlineCallTypee}
                                                onChange={(item) => {
                                                    setOnlineCallTypee(item?.value);
                                                    setOnlineCallTypeeError("")
                                                }}
                                                onChangeText={() => { }} // Keep search keyword
                                            />
                                            {OnlineCallTypeeError !== "" && <Text style={styles.errorText}>{OnlineCallTypeeError}</Text>}
                                            {OnlineCallTypee === "external" &&
                                                <View>
                                                    <Text style={{
                                                        fontSize: FontSize.FS_12,
                                                        color: black,
                                                        fontFamily: SEMIBOLD,
                                                        marginTop: 12, marginBottom: 8
                                                    }}>{"Meeting URL"}</Text>
                                                    <TextInput
                                                        value={MeetingUrl}
                                                        placeholder='Enter meeting url'
                                                        placeholderTextColor={grey01}
                                                        style={{
                                                            borderWidth: 1,
                                                            borderColor: grey01,
                                                            height: 38,
                                                            borderRadius: 6,
                                                            paddingHorizontal: 14,
                                                            fontSize: FontSize.FS_12,
                                                            color: black,
                                                            fontFamily: MEDIUM,
                                                        }}
                                                        onChangeText={(txt) => {
                                                            setMeetingUrl(txt)
                                                            if (txt.length > 0) {
                                                                setMeetingUrlError("")
                                                            }
                                                        }}
                                                    />
                                                    {MeetingUrlError !== "" && <Text style={styles.errorText}>{MeetingUrlError}</Text>}
                                                </View>
                                            }

                                        </View>
                                    );
                                } else if (item.value === "in_person") {
                                    return (
                                        <View>

                                            <Text style={{
                                                fontSize: FontSize.FS_12,
                                                color: black,
                                                fontFamily: SEMIBOLD,
                                                marginTop: 12, marginBottom: 8
                                            }}>{"Address"}</Text>
                                            <GooglePlacesAutocomplete
                                                debounce={200}
                                                textInputProps={{
                                                    value: Address,
                                                    onChangeText: (text) => setAddress(text),
                                                }}
                                                fetchDetails={true}
                                                placeholder='Enter Address'
                                                onPress={(data, details = null) => {
                                                    setCurrentLocation({ latitude: details?.geometry?.location?.lat, longitude: details?.geometry?.location?.lng });
                                                    setAddress(details?.formatted_address)
                                                    setAddressError("")
                                                }}
                                                query={{
                                                    key: REACT_APP_GOOGLE_API_KEY,
                                                    language: 'en',
                                                }}
                                                autoFocus={false}
                                                returnKeyType={'search'}
                                                keyboardAppearance={'light'}
                                                listViewDisplayed={false}
                                                keepResultsAfterBlur={true}
                                                styles={{
                                                    container: {
                                                        backfaceVisibility: 'visible'
                                                    },
                                                    textInputContainer: {
                                                        backgroundColor: white,
                                                    },
                                                    description: {
                                                        fontSize: FontSize.FS_13,
                                                        color: black,
                                                        fontFamily: MEDIUM,
                                                    },
                                                    textInput: {
                                                        borderRadius: 6,
                                                        borderWidth: 1,
                                                        borderColor: grey01,
                                                        height: 38,
                                                        fontSize: FontSize.FS_12,
                                                        color: black,
                                                        fontFamily: MEDIUM,
                                                    },
                                                }}
                                            />
                                            {AddressError !== "" && <Text style={styles.errorText}>{AddressError}</Text>}
                                        </View>
                                    );
                                }
                                return null;
                            })}

                            <TouchableOpacity onPress={() => { manageEvent() }}
                                style={{ backgroundColor: greenPrimary, paddingVertical: 8, borderRadius: 6, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: white,
                                    fontFamily: SEMIBOLD
                                }}>{isEdit ? "Save Event" : "Create Event"}</Text>
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </View>
            </Modal>
            {isLoading && <LoadingView />}
        </>
    );
};

export default Events;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    eventItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 1,
        backgroundColor: "#ececfa",
        borderRadius: 4
    },
    eventDetails: {
        flex: 1,
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventTimeText: {
        marginLeft: 10,
        fontSize: FontSize.FS_12,
        fontFamily: MEDIUM,
        color: darkGrey
    },
    eventTitleText: {
        marginLeft: 10,
        fontSize: FontSize.FS_14,
        fontFamily: SEMIBOLD,
        color: black
    },
    eventActions: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 15,
        borderRadius: 4,
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center"
    },
    createExtTxt: {
        fontSize: FontSize.FS_13,
        color: white,
        fontFamily: SEMIBOLD,
        lineHeight: 24,
        marginLeft: 10,
    },
    createExtBtn: {
        backgroundColor: midGreen,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
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
    dropdown: {
        marginVertical: 4,
        backgroundColor: transparent,
        borderRadius: 6,
        padding: 12,
        borderWidth: 1,
        borderColor: grey01,
        height: 38,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: FontSize.FS_12,
        fontFamily: MEDIUM,
        color: black
    },
    placeholderStyle: {
        fontSize: FontSize.FS_12,
        fontFamily: MEDIUM,
        color: grey01
    },
    selectedTextStyle: {
        fontSize: FontSize.FS_12,
        color: red,
        fontFamily: MEDIUM,

    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: FontSize.FS_12,
    },
    iconStyle: {
        width: 18,
        height: 18,
    },
    errorText: {
        fontFamily: REGULAR,
        fontSize: FontSize.FS_10,
        color: red,
        marginTop: 2
    },
});
