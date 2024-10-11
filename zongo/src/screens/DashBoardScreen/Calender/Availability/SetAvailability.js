import { FlatList, StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Modal, TextInput } from 'react-native';
import HeaderBackView from '../../../../commonComponents/HeaderBackView';
import { black, black05, disableColor, greenPrimary, grey, paleGreen, red, white, yellow } from '../../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../../constants/Fonts';
import { goBack } from '../../../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import SideMenuModuleCheck from '../../../../commonComponents/RolePermission/SideMenuModuleCheck';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { resetEventsApiStatus } from '../../../../redux/reducers/EventsReducer';
import { resetGeneralApiStatus } from '../../../../redux/reducers/generalReducer';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../../constants/ConstantKey';
import { Log } from '../../../../commonComponents/Log';
import { Create_User_Meeting_Availability, Delete_User_Meeting_Availability, Get_User_Meeting_Availability, Update_User_Meeting_Availability } from '../../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import LoadingView from '../../../../commonComponents/LoadingView';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SetAvailability = ({ navigation }) => {

    const [EventList, setEventList] = useState([]);
    const [SelectedDayName, setSelectedDayName] = useState(null);
    const [SelectedDay, setSelectedDay] = useState(null);
    const [Day, setDay] = useState("");
    const [SelectedSlot, setSelectedSlot] = useState(null);
    const [ManageSLotModal, setManageSLotModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [MondayShow, setMondayShow] = useState(false);
    const [MondayData, setMondayData] = useState([]);

    const [TuesdayShow, setTuesdayShow] = useState(false);
    const [TuesdayData, setTuesdayData] = useState([]);

    const [WenesdayShow, setWenesdayShow] = useState(false);
    const [WenesdayData, setWenesdayData] = useState([]);

    const [ThursdayShow, setThursdayShow] = useState(false);
    const [ThursdayData, setThursdayData] = useState([]);

    const [FridayShow, setFridayShow] = useState(false);
    const [FridayData, setFridayData] = useState([]);

    const [SaturdayShow, setSaturdayShow] = useState(false);
    const [SaturdayData, setSaturdayData] = useState([]);

    const [SundayShow, setSundayShow] = useState(false);
    const [SundayData, setSundayData] = useState([]);

    const [FromTime, setFromTime] = useState("");
    const [FromTimeError, setFromTimeError] = useState("");
    const [ToTime, setToTime] = useState("");
    const [ToTimeError, setToTimeError] = useState("");
    const [IsFromEdit, setIsFromEdit] = useState(false);
    const [EditID, setEditID] = useState("");

    const [IsFromTimePickerShow, setIsFromTimePickerShow] = useState(false);
    const [IsToTimePickerShow, setIsToTimePickerShow] = useState(false);

    const user_data = useSelector(state => state.userRedux.user_data);
    const apiGetUserMeetingAvailability = useSelector(state => state.eventsRedux.apiGetUserMeetingAvailability);
    const user_meeting_availability = useSelector(state => state.eventsRedux.user_meeting_availability);
    const apiDeleteUserMeetingAvailability = useSelector(state => state.eventsRedux.apiDeleteUserMeetingAvailability);
    const apiCreateUserMeetingAvailability = useSelector(state => state.eventsRedux.apiCreateUserMeetingAvailability);
    const apiUpdateUserMeetingAvailability = useSelector(state => state.eventsRedux.apiUpdateUserMeetingAvailability);
    const isLoading = useSelector(state => state.eventsRedux.isLoader);
    const isError = useSelector(state => state.eventsRedux.isError);
    const error_message = useSelector(state => state.eventsRedux.error_message);

    const dispatch = useDispatch();
    const ref = useRef();

    const GetUserAvailability = () => {
        var dict = { createdby: user_data?.data?.user_uuid };
        dispatch(Get_User_Meeting_Availability(dict))
    }

    useFocusEffect(
        useCallback(() => {
            GetUserAvailability()
            return () => {
                dispatch(resetEventsApiStatus());
                dispatch(resetGeneralApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiGetUserMeetingAvailability :', apiGetUserMeetingAvailability);
        if (apiGetUserMeetingAvailability == STATUS_FULFILLED) {
            Log("user_meeting_availability length :", user_meeting_availability)
            setEventList(user_meeting_availability)
            switch (Day) {
                case 'mon':
                    const Monday = user_meeting_availability?.filter(data => data?.day == Day)
                    console.log("Monday l",Monday?.length)
                    setMondayData(Monday)
                    setSelectedDayName(SelectedDayName === 'monday' ? null : 'monday');
                    setMondayShow(true)
                    break;
                case 'tue':
                    const Tuesday = user_meeting_availability?.filter(data => data?.day == Day)
                    setTuesdayData(Tuesday)
                    setSelectedDayName(SelectedDayName === 'tuesday' ? null : 'tuesday');
                    setTuesdayShow(true)
                    break;
                case 'wed':
                    const Wenesday = user_meeting_availability?.filter(data => data?.day == Day)
                    setWenesdayData(Wenesday)
                    setSelectedDayName(SelectedDayName === 'wednesday' ? null : 'wednesday');
                    setWenesdayShow(true)
                    break;
                case 'thu':
                    const Thursday = user_meeting_availability?.filter(data => data?.day == Day)
                    setThursdayData(Thursday)
                    setSelectedDayName(SelectedDayName === 'thursday' ? null : 'thursday');
                    setThursdayShow(true)
                    break;
                case 'fri':
                    const Friday = user_meeting_availability?.filter(data => data?.day == Day)
                    setFridayData(Friday)
                    setSelectedDayName(SelectedDayName === 'friday' ? null : 'friday');
                    setFridayShow(true)
                    break;
                case 'sat':
                    const Saturday = user_meeting_availability?.filter(data => data?.day == Day)
                    setSaturdayData(Saturday)
                    setSelectedDayName(SelectedDayName === 'saturday' ? null : 'saturday');
                    setSaturdayShow(true)
                    break;
                case 'sun':
                    const Sunday = user_meeting_availability?.filter(data => data?.day == Day)
                    setSundayData(Sunday)
                    setSelectedDayName(SelectedDayName === 'sunday' ? null : 'sunday');
                    setSundayShow(true)
                    break;
                default:
                    setSelectedDayName(null);
            }

        } else if (apiGetUserMeetingAvailability == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetUserMeetingAvailability]);

    useEffect(() => {
        Log('apiDeleteUserMeetingAvailability :', apiDeleteUserMeetingAvailability);
        if (apiDeleteUserMeetingAvailability == STATUS_FULFILLED) {
            GetUserAvailability()
        } else if (apiDeleteUserMeetingAvailability == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteUserMeetingAvailability]);

    useEffect(() => {
        Log('apiCreateUserMeetingAvailability :', apiCreateUserMeetingAvailability);
        if (apiCreateUserMeetingAvailability == STATUS_FULFILLED) {
            GetUserAvailability()
            handleClearSlotState()
            
        } else if (apiCreateUserMeetingAvailability == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateUserMeetingAvailability]);
    
    useEffect(() => {
        Log('apiUpdateUserMeetingAvailability :', apiUpdateUserMeetingAvailability);
        if (apiUpdateUserMeetingAvailability == STATUS_FULFILLED) {
            GetUserAvailability()
            handleClearSlotState()
            
        } else if (apiUpdateUserMeetingAvailability == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateUserMeetingAvailability]);

    const handleShowDayData = (item, isOpen) => {
        if (isOpen !== true) {
            switch (item) {
                case 'mon':
                    const Monday = EventList?.filter(data => data?.day == item)
                    setMondayData(Monday)
                    setSelectedDayName(SelectedDayName === 'monday' ? null : 'monday');
                    setMondayShow(!MondayShow)
                    break;
                case 'tue':
                    const Tuesday = EventList?.filter(data => data?.day == item)
                    setTuesdayData(Tuesday)
                    setSelectedDayName(SelectedDayName === 'tuesday' ? null : 'tuesday');
                    setTuesdayShow(!TuesdayShow)
                    break;
                case 'wed':
                    const Wenesday = EventList?.filter(data => data?.day == item)
                    setWenesdayData(Wenesday)
                    setSelectedDayName(SelectedDayName === 'wednesday' ? null : 'wednesday');
                    setWenesdayShow(!WenesdayShow)
                    break;
                case 'thu':
                    const Thursday = EventList?.filter(data => data?.day == item)
                    setThursdayData(Thursday)
                    setSelectedDayName(SelectedDayName === 'thursday' ? null : 'thursday');
                    setThursdayShow(!ThursdayShow)
                    break;
                case 'fri':
                    const Friday = EventList?.filter(data => data?.day == item)
                    setFridayData(Friday)
                    setSelectedDayName(SelectedDayName === 'friday' ? null : 'friday');
                    setFridayShow(!FridayShow)
                    break;
                case 'sat':
                    const Saturday = EventList?.filter(data => data?.day == item)
                    setSaturdayData(Saturday)
                    setSelectedDayName(SelectedDayName === 'saturday' ? null : 'saturday');
                    setSaturdayShow(!SaturdayShow)
                    break;
                case 'sun':
                    const Sunday = EventList?.filter(data => data?.day == item)
                    setSundayData(Sunday)
                    setSelectedDayName(SelectedDayName === 'sunday' ? null : 'sunday');
                    setSundayShow(!SundayShow)
                    break;
                default:
                    setSelectedDayName(null);
            }
        }
        else {
            setSelectedDay(null)
            setSelectedDayName(null);
            switch (item) {
                case 'mon':
                    setMondayShow(!MondayShow)
                    break;
                case 'tue':
                    setTuesdayShow(!TuesdayShow)
                    break;
                case 'wed':
                    setWenesdayShow(!WenesdayShow)
                    break;
                case 'thu':
                    setThursdayShow(!ThursdayShow)
                    break;
                case 'fri':
                    setFridayShow(!FridayShow)
                    break;
                case 'sat':
                    setSaturdayShow(!SaturdayShow)
                    break;
                case 'sun':
                    setSundayShow(!SundayShow)
                    break;
                default:
                    setSelectedDayName(null);
                    setSelectedDay(null)

            }
        }

    }
    const DeleteTimeBlock = (item) => {
        Alert.alert(
            "Alert",
            'Are you sure to delete this time slot?',
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
                            user_meeting_availability_uuid: item?.user_meeting_availability_uuid
                        }
                        dispatch(Delete_User_Meeting_Availability(dict))
                        // Update state locally
                        switch (item.day) {
                            case 'mon':
                                setMondayData(prevData => prevData?.filter(data => data.user_meeting_availability_uuid !== item.user_meeting_availability_uuid));
                                break;
                            case 'tue':
                                setTuesdayData(prevData => prevData?.filter(data => data.user_meeting_availability_uuid !== item.user_meeting_availability_uuid));
                                break;
                            case 'wed':
                                setWenesdayData(prevData => prevData?.filter(data => data.user_meeting_availability_uuid !== item.user_meeting_availability_uuid));
                                break;
                            case 'thu':
                                setThursdayData(prevData => prevData?.filter(data => data.user_meeting_availability_uuid !== item.user_meeting_availability_uuid));
                                break;
                            case 'fri':
                                setFridayData(prevData => prevData?.filter(data => data.user_meeting_availability_uuid !== item.user_meeting_availability_uuid));
                                break;
                            case 'sat':
                                setSaturdayData(prevData => prevData?.filter(data => data.user_meeting_availability_uuid !== item.user_meeting_availability_uuid));
                                break;
                            case 'sun':
                                setSundayData(prevData => prevData?.filter(data => data.user_meeting_availability_uuid !== item.user_meeting_availability_uuid));
                                break;
                            default:
                                break;
                        }
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
        );

    }
    
    const handleCreateTimeSlot = () => {
        let isValid = true;
        if (FromTime == "") {
            setFromTimeError("* Please select from time.")
            isValid = false;
        }
        else{
            setFromTimeError("")
        }
        if (ToTime == "") {
            setToTimeError("* Please select to time.")
            isValid = false;
        }
        else{
            setToTimeError("")
        }
        if (isValid) {


            if(IsFromEdit){
                var dict ={
                    action:"update",
                    createdby: user_data?.data?.user_uuid,
                    day:Day,
                    main_uuid: user_data?.data?.main_uuid,
                    end_time: moment(ToTime, 'HH:mm').format('hh:mm A'),
                    start_time: moment(FromTime, 'HH:mm').format('hh:mm A'),
                    user_meeting_availability_uuid:EditID
                }
                console.log("Edit",dict)
                dispatch(Update_User_Meeting_Availability(dict))
            }
            else{
                var dict ={
                    action:"add",
                    createdby: user_data?.data?.user_uuid,
                    day:Day,
                    main_uuid: user_data?.data?.main_uuid,
                    end_time: moment(ToTime, 'HH:mm').format('hh:mm A'),
                    start_time: moment(FromTime, 'HH:mm').format('hh:mm A'),
                }
                console.log("Create",dict)
                dispatch(Create_User_Meeting_Availability(dict))
               
            }
            setManageSLotModal(false)
        }

    };
    const handleClearSlotState = () => {
        setManageSLotModal(false)
        setFromTime("")
        setToTime("")
        setFromTimeError("")
        setToTimeError("")
    };
    const showTimePickerFrom = () => {
        setIsFromTimePickerShow(true);
    };
    const showTimePickerTo = () => {
        setIsToTimePickerShow(true)
    };

    const hideTimePickerFrom = () => {
        setIsFromTimePickerShow(false);
    };
    const hideTimePickerTo = () => {
        setIsToTimePickerShow(false)
    };

    const handleConfirmFrom = (date) => {
        setFromTime(date)
        hideTimePickerFrom();
        setFromTimeError("")
    };
    const handleConfirmTo = (date, type) => {
        setToTime(date)
        hideTimePickerTo();
        setToTimeError("")
    };
    const EditTimeData = (item, day) => {
        console.log("sds",item)
        setFromTime(item?.start_time)
        setToTime(item?.end_time)
        setEditID(item?.user_meeting_availability_uuid)
        setManageSLotModal(!ManageSLotModal)
    }
    const AddTimeBlock = ({ onPress }) => {
        return (
            <TouchableOpacity onPress={onPress}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: greenPrimary,
                    borderWidth: 1,
                    alignSelf: "center",
                    paddingVertical: 4,
                    borderRadius: 4,
                    flex: 1
                }}>
                <Icon name={"plus"} size={18} color={greenPrimary} />
                <Text style={{
                    fontSize: FontSize.FS_11,
                    color: greenPrimary,
                    fontFamily: SEMIBOLD,
                    textAlign: "center",
                    marginLeft: 4
                }}>{"Add New Time"}</Text>
            </TouchableOpacity>
        )
    }

    const EditRemoveBtn = ({ onDelete, onEdit, item }) => {
        return (
            <View style={{ flex: 0.3, }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                    }}>
                    <TouchableOpacity onPress={onEdit}
                        style={{ padding: 5 }}>
                        <Icon name={"clock-edit-outline"} size={23} color={yellow} />

                    </TouchableOpacity>
                    {item?.type !== "off_hours" &&
                        <TouchableOpacity onPress={onDelete}
                            style={{ padding: 5 }}>
                            <Icon name={"trash-can"} size={23} color={red} />

                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

    return (
        <>
            <HeaderBackView
                title="Set Availability"
                isBack={true}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
            <ScrollView
                style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                {/* Monday */}
                <View style={styles.DayRow}>
                    <TouchableOpacity onPress={() => {
                        handleShowDayData('mon', MondayShow)
                    }}
                        style={styles.HStack}>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: MondayShow == true ? white : black,
                            fontFamily: SEMIBOLD,
                            backgroundColor: MondayShow == true ? greenPrimary : white,
                            paddingHorizontal: MondayShow == true ? 20 : 0,
                            paddingVertical: MondayShow == true ? 8 : 0
                        }}>{"MONDAY"}</Text>
                        <Icon name={MondayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                    </TouchableOpacity>
                    {MondayShow == true &&
                        <View style={styles.flatlistCOntainer}>
                            <FlatList
                                data={MondayData}
                                key={Math.random()}
                                renderItem={({ item }) =>
                                    <View style={styles.slotContainer}>
                                        <View style={{
                                            flex: 0.7,
                                            marginRight: 10
                                        }}>
                                            <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item.start_time}</Text>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {item.end_time}</Text>
                                            </View>
                                        </View>
                                        <EditRemoveBtn item={item}
                                            onEdit={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "mon")
                                                setDay("mon")
                                            }}
                                            onDelete={() => {
                                                DeleteTimeBlock(item)
                                            }}
                                        />
                                    </View>
                                }
                            />
                            <View style={[styles.HStack, { marginTop: 12 }]}>
                                <AddTimeBlock onPress={() => {
                                    setManageSLotModal(!ManageSLotModal);
                                    setDay("mon")
                                    setIsFromEdit(false)
                                }} />
                            </View>
                        </View>
                    }
                </View>
                {/* Tuesday */}
                <View style={styles.DayRow}>
                    <TouchableOpacity onPress={() => {
                        handleShowDayData('tue', TuesdayShow)
                    }}
                        style={styles.HStack}>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: TuesdayShow == true ? white : black,
                            fontFamily: SEMIBOLD,
                            backgroundColor: TuesdayShow == true ? greenPrimary : white,
                            paddingHorizontal: TuesdayShow == true ? 20 : 0,
                            paddingVertical: TuesdayShow == true ? 8 : 0
                        }}>{"TUESDAY"}</Text>
                        <Icon name={TuesdayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                    </TouchableOpacity>
                    {TuesdayShow == true &&
                        <View style={styles.flatlistCOntainer}>
                            <FlatList
                                data={TuesdayData}
                                key={Math.random()}
                                renderItem={({ item }) =>
                                    <View style={styles.slotContainer}>
                                        <View style={{
                                            flex: 0.7,
                                            marginRight: 10
                                        }}>
                                            <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item.start_time}</Text>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {item.end_time}</Text>
                                            </View>
                                        </View>
                                        <EditRemoveBtn item={item}
                                            onEdit={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "tue")
                                                setDay("tue")
                                            }}
                                            onDelete={() => {
                                                DeleteTimeBlock(item)
                                            }}
                                        />
                                    </View>
                                }
                            />
                            <View style={[styles.HStack, { marginTop: 12 }]}>
                                <AddTimeBlock onPress={() => {
                                    setManageSLotModal(!ManageSLotModal)
                                    setDay("tue")
                                    setIsFromEdit(false)
                                }} />
                            </View>
                        </View>
                    }
                </View>
                {/* wenesday */}
                <View style={styles.DayRow}>
                    <TouchableOpacity onPress={() => {
                        handleShowDayData('wed', WenesdayShow)
                    }}
                        style={styles.HStack}>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: WenesdayShow == true ? white : black,
                            fontFamily: SEMIBOLD,
                            backgroundColor: WenesdayShow == true ? greenPrimary : white,
                            paddingHorizontal: WenesdayShow == true ? 20 : 0,
                            paddingVertical: WenesdayShow == true ? 8 : 0
                        }}>{"WEDNESDAY"}</Text>
                        <Icon name={WenesdayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                    </TouchableOpacity>
                    {WenesdayShow == true &&
                        <View style={styles.flatlistCOntainer}>
                            <FlatList
                                data={WenesdayData}
                                key={Math.random()}
                                renderItem={({ item }) =>
                                    <View style={styles.slotContainer}>
                                        <View style={{
                                            flex: 0.7,
                                            marginRight: 10
                                        }}>
                                            <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item.start_time}</Text>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {item.end_time}</Text>
                                            </View>
                                        </View>
                                        <EditRemoveBtn item={item}
                                            onEdit={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "wed")
                                                setDay("wed")
                                            }}
                                            onDelete={() => {
                                                DeleteTimeBlock(item)
                                            }}
                                        />
                                    </View>
                                }
                            />
                            <View style={[styles.HStack, { marginTop: 12 }]}>
                                <AddTimeBlock onPress={() => {
                                    setManageSLotModal(!ManageSLotModal)
                                    setDay("wed")
                                    setIsFromEdit(false)
                                }} />
                            </View>
                        </View>
                    }
                </View>
                {/* thursday */}
                <View style={styles.DayRow}>
                    <TouchableOpacity onPress={() => {
                        handleShowDayData('thu', ThursdayShow)
                    }}
                        style={styles.HStack}>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: ThursdayShow == true ? white : black,
                            fontFamily: SEMIBOLD,
                            backgroundColor: ThursdayShow == true ? greenPrimary : white,
                            paddingHorizontal: ThursdayShow == true ? 20 : 0,
                            paddingVertical: ThursdayShow == true ? 8 : 0
                        }}>{"THURSDAY"}</Text>
                        <Icon name={ThursdayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                    </TouchableOpacity>
                    {ThursdayShow == true &&
                        <View style={styles.flatlistCOntainer}>
                            <FlatList
                                data={ThursdayData}
                                key={Math.random()}
                                renderItem={({ item }) =>
                                    <View style={styles.slotContainer}>
                                        <View style={{
                                            flex: 0.7,
                                            marginRight: 10
                                        }}>
                                            <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item.start_time}</Text>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {item.end_time}</Text>
                                            </View>
                                        </View>
                                        <EditRemoveBtn item={item}
                                            onEdit={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "thu")
                                                setDay("thu")
                                            }}
                                            onDelete={() => {
                                                DeleteTimeBlock(item)
                                            }}
                                        />
                                    </View>
                                }
                            />
                            <View style={[styles.HStack, { marginTop: 12 }]}>
                                <AddTimeBlock onPress={() => {
                                     setManageSLotModal(!ManageSLotModal)
                                    setDay("thu")
                                    setIsFromEdit(false)
                                }} />
                            </View>
                        </View>
                    }
                </View>
                {/* friday */}
                <View style={styles.DayRow}>
                    <TouchableOpacity onPress={() => {
                        handleShowDayData('fri', FridayShow)
                    }}
                        style={styles.HStack}>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: FridayShow == true ? white : black,
                            fontFamily: SEMIBOLD,
                            backgroundColor: FridayShow == true ? greenPrimary : white,
                            paddingHorizontal: FridayShow == true ? 20 : 0,
                            paddingVertical: FridayShow == true ? 8 : 0
                        }}>{"FRIDAY"}</Text>
                        <Icon name={FridayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                    </TouchableOpacity>
                    {FridayShow == true &&
                        <View style={styles.flatlistCOntainer}>
                            <FlatList
                                data={FridayData}
                                key={Math.random()}
                                renderItem={({ item }) =>
                                    <View style={styles.slotContainer}>
                                        <View style={{
                                            flex: 0.7,
                                            marginRight: 10
                                        }}>
                                            <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item.start_time}</Text>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {item.end_time}</Text>
                                            </View>
                                        </View>
                                        <EditRemoveBtn item={item}
                                            onEdit={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "fri")
                                                setDay("fri")
                                            }}
                                            onDelete={() => {
                                                DeleteTimeBlock(item)
                                            }}
                                        />
                                    </View>
                                }
                            />
                            <View style={[styles.HStack, { marginTop: 12 }]}>
                                <AddTimeBlock onPress={() => {
                                     setManageSLotModal(!ManageSLotModal)
                                    setDay("fri")
                                    setIsFromEdit(false)
                                }} />
                            </View>
                        </View>
                    }
                </View>
                {/* saturday */}
                <View style={styles.DayRow}>
                    <TouchableOpacity onPress={() => {
                        handleShowDayData('sat', SaturdayShow)
                    }}
                        style={styles.HStack}>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: SaturdayShow == true ? white : black,
                            fontFamily: SEMIBOLD,
                            backgroundColor: SaturdayShow == true ? greenPrimary : white,
                            paddingHorizontal: SaturdayShow == true ? 20 : 0,
                            paddingVertical: SaturdayShow == true ? 8 : 0
                        }}>{"SATURDAY"}</Text>
                        <Icon name={SaturdayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                    </TouchableOpacity>
                    {SaturdayShow == true &&
                        <View style={styles.flatlistCOntainer}>
                            <FlatList
                                data={SaturdayData}
                                key={Math.random()}
                                renderItem={({ item }) =>
                                    <View style={styles.slotContainer}>
                                        <View style={{
                                            flex: 0.7,
                                            marginRight: 10
                                        }}>
                                            <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item.start_time}</Text>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {item.end_time}</Text>
                                            </View>
                                        </View>
                                        <EditRemoveBtn item={item}
                                            onEdit={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "sat")
                                                setDay("sat")
                                            }}
                                            onDelete={() => {
                                                DeleteTimeBlock(item)
                                            }}
                                        />
                                    </View>
                                }
                            />
                            <View style={[styles.HStack, { marginTop: 12 }]}>
                                <AddTimeBlock onPress={() => {
                                    setManageSLotModal(!ManageSLotModal)
                                    setDay("sat")
                                    setIsFromEdit(false)
                                }} />
                            </View>
                        </View>
                    }
                </View>
                {/* sunday */}
                <View style={styles.DayRow}>
                    <TouchableOpacity onPress={() => {
                        handleShowDayData('sun', SundayShow)
                    }}
                        style={styles.HStack}>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: SundayShow == true ? white : black,
                            fontFamily: SEMIBOLD,
                            backgroundColor: SundayShow == true ? greenPrimary : white,
                            paddingHorizontal: SundayShow == true ? 20 : 0,
                            paddingVertical: SundayShow == true ? 8 : 0
                        }}>{"SUNDAY"}</Text>
                        <Icon name={SundayShow == true ? 'chevron-up' : 'chevron-down'} size={22} color={black} />
                    </TouchableOpacity>
                    {SundayShow == true &&
                        <View style={styles.flatlistCOntainer}>
                            <FlatList
                                data={SundayData}
                                key={Math.random()}
                                renderItem={({ item }) =>
                                    <View style={styles.slotContainer}>
                                        <View style={{
                                            flex: 0.7,
                                            marginRight: 10
                                        }}>
                                            <View style={[styles.HStack, { marginVertical: 6 }]}>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}>{item.start_time}</Text>
                                                <Text style={{ flex: 0.4, fontFamily: MEDIUM, fontSize: FontSize.FS_11, color: black, borderWidth: 0.5, borderColor: black, paddingVertical: 4, borderRadius: 6, textAlign: "center" }}> {item.end_time}</Text>
                                            </View>
                                        </View>
                                        <EditRemoveBtn item={item}
                                            onEdit={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "sun")
                                                setDay("sun")
                                            }}
                                            onDelete={() => {
                                                DeleteTimeBlock(item)
                                            }}
                                        />
                                    </View>
                                }
                            />
                            <View style={[styles.HStack, { marginTop: 12 }]}>
                                <AddTimeBlock onPress={() => {
                                     setManageSLotModal(!ManageSLotModal)
                                    setDay("sun")
                                    setIsFromEdit(false)
                                }} />
                            </View>
                        </View>
                    }
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={ManageSLotModal}

                    onRequestClose={() => {
                        setManageSLotModal(!ManageSLotModal);
                    }}>

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={{ alignItems: "center", flexDirection: "row" }}
                                onPress={() => handleClearSlotState()}>
                                <Text style={[styles.eventTitleText, { flex: 1, textAlign: "center", textDecorationLine: "underline", fontSize: FontSize.FS_15 }]}>{isEdit ? "Edit Event" : "Add New Slot"}</Text>
                                <Icon name={"close"} size={22} color={black} />
                            </TouchableOpacity>
                            <View style={{ marginHorizontal: 0 }}>
                                <View>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 12,
                                    }}>{"From Time"}</Text>
                                    <TouchableOpacity onPress={() => {
                                        showTimePickerFrom()
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderWidth: 1,
                                            borderColor: black,
                                            paddingVertical: 6,
                                            paddingHorizontal: 12,
                                            marginVertical: 8,
                                            borderRadius: 4,
                                        }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: black,
                                            fontFamily: MEDIUM,
                                            marginTop: 4
                                        }}>{FromTime == "" ? "Select Time" : moment(FromTime, 'HH:mm').format('hh:mm A')}</Text>
                                        <Icon name={"chevron-down"} size={22} color={grey} />
                                    </TouchableOpacity>
                                    {FromTimeError !== "" && <Text
                                        style={{
                                            fontSize: FontSize.FS_10,
                                            color: red,
                                            fontFamily: MEDIUM,
                                        }}>
                                        {FromTimeError}
                                    </Text>
                                    }
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 12, 
                                    }}>{"To Time"}</Text>
                                    <TouchableOpacity onPress={() => {
                                        showTimePickerTo()
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
                                        }}>{ToTime == "" ? "Select Time" : moment(ToTime, 'HH:mm').format('hh:mm A')}</Text>
                                        <Icon name={"chevron-down"} size={22} color={grey} />

                                    </TouchableOpacity>
                                    {ToTimeError !== "" && <Text
                                        style={{
                                            fontSize: FontSize.FS_10,
                                            color: red,
                                            fontFamily: MEDIUM,
                                        }}>
                                        {ToTimeError}
                                    </Text>
                                    }
                                    {/* { EventTimeError!== "" && <Text style={styles.errorText}>{EventTimeError}</Text>} */}
                                    <TouchableOpacity onPress={() => {
                                            handleCreateTimeSlot();
                                         }}
                                        style={{ backgroundColor: greenPrimary, paddingVertical: 8, borderRadius: 6, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_14,
                                            color: white,
                                            fontFamily: SEMIBOLD
                                        }}>{IsFromEdit ? "Save" : "Create"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>
                </Modal>
                <DateTimePickerModal
                    minuteInterval={15}
                    isVisible={IsFromTimePickerShow}
                    mode="time"
                    onConfirm={handleConfirmFrom}
                    onCancel={hideTimePickerFrom}
                />
                <DateTimePickerModal
                    minuteInterval={15}
                    isVisible={IsToTimePickerShow}
                    mode="time"
                    onConfirm={handleConfirmTo}
                    onCancel={hideTimePickerTo}
                />
            </ScrollView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default SetAvailability;

const styles = StyleSheet.create({
    flatlistCOntainer: {
        borderBottomWidth: 1,
        borderBottomColor: disableColor,
        paddingBottom: 8,
    },
    slotContainer: {
        borderBottomWidth: 1,
        borderBottomColor: disableColor,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center"
        ,
    },
    black12SemiBold: {
        fontFamily: SEMIBOLD,
        fontSize: FontSize.FS_12,
        color: black,
    },
    DayRow: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: disableColor,
        marginHorizontal: -20,
    },
    HStack: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    KeypadText: {
        fontFamily: MEDIUM,
        fontSize: FontSize.FS_14,
        color: greenPrimary
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
    container: {
        justifyContent: 'center',
        marginVertical: 20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: paleGreen
    },
    activeButton: {
        backgroundColor: greenPrimary,
    },
    ActiveKeypadText: {
        fontFamily: MEDIUM,
        fontSize: FontSize.FS_14,
        color: white
    },
    eventTitleText: {
        marginLeft: 10,
        fontSize: FontSize.FS_14,
        fontFamily: SEMIBOLD,
        color: black
    },
});
