
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black05 } from '@constants/Color';
import { black, greenPrimary, grey, grey01, white, red, grey02, transparent } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import { resetTimeBasedRoutingApiStatus } from '../../../redux/reducers/timeBasedRoutingReducer';
import { Create_Time_Slot, Delete_Time_Slot_Event, Get_Route_To_Destination, Get_Time_Slot_Details_Events, Get_Time_Slot_Events_Perticular, Update_Time_Slot } from '../../../redux/api/Api';
import { Log } from '../../../commonComponents/Log';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { useFocusEffect } from '@react-navigation/native';
import LoadingView from '../../../commonComponents/LoadingView';
import RouteDestinationBottomSheet from '../../../commonComponents/BottomSheet/RouteDestinationBottomSheet';
import { ROUTE } from '../../../constants/DATA/Route';
import DestinationBottomSheet from '../../../commonComponents/BottomSheet/DestinationBottomSheet';

const HolidaySpecific = ({ navigation, route }) => {

    const [EventModel, setEventModel] = useState(false);
    const [MoreEventModel, setMoreEventModel] = useState(false);
    const [eventName, setEventName] = useState('');
    const [eventNameError, setEventNameError] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [EventList, setEventList] = useState([]);

    const [selected, setSelected] = useState('');
    const [From, setFrom] = useState("");
    const [FromError, setFromError] = useState("");
    const [To, setTo] = useState("");
    const [ToError, setToError] = useState("");


    const [RouteTo, setRouteTo] = useState('');
    const [RouteToError, setRouteToError] = useState('');
    const [RouteValue, setRouteValue] = useState('');

    const [DestinationTo, setDestinationTo] = useState('');
    const [DestinationToError, setDestinationToError] = useState('');
    const [DestinationValue, setDestinationValue] = useState('');
    const [DestinationList, setDestinationList] = useState([]);
    const [Id, setId] = useState("");

    const [IsFromEdit, setIsFromEdit] = useState(false);

    const [IsFromTimePickerShow, setIsFromTimePickerShow] = useState(false);
    const [IsToTimePickerShow, setIsToTimePickerShow] = useState(false);


    const RouteTobottomSheetRef = useRef(null);
    const DestinationTobottomSheetRef = useRef(null);

    const dispatch = useDispatch();


    const apiUpdateTimeSlot = useSelector(state => state.TimeBasedRoutingRedux.apiUpdateTimeSlot);
    const apiGetTimeSlotDetailsEvents = useSelector(state => state.TimeBasedRoutingRedux.apiGetTimeSlotDetailsEvents);
    const time_slot_details_events = useSelector(state => state.TimeBasedRoutingRedux.time_slot_details_events);
    const apiGetTimeSlotEventsPerticular = useSelector(state => state.TimeBasedRoutingRedux.apiGetTimeSlotEventsPerticular);
    const time_slot_details_events_particular = useSelector(state => state.TimeBasedRoutingRedux.time_slot_details_events_particular);
    const apiCreateTimeSlot = useSelector(state => state.TimeBasedRoutingRedux.apiCreateTimeSlot);
    const apiDeleteTimeSlotEvent = useSelector(state => state.TimeBasedRoutingRedux.apiDeleteTimeSlotEvent);
    const isLoading = useSelector(state => state.TimeBasedRoutingRedux.isLoader);
    const isError = useSelector(state => state.TimeBasedRoutingRedux.isError);
    const error_message = useSelector(state => state.TimeBasedRoutingRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);
    const apiGetRouteToDestination = useSelector(
        state => state.generalRedux.apiGetRouteToDestination,
    );
    const route_by_destination_list = useSelector(
        state => state.generalRedux.route_by_destination_list,
    );
    const callAllApi = async () => {
        GetTimeSlotDetailsEvents()
    }

    useFocusEffect(
        useCallback(() => {
            if (route?.params?.isEdit == true) {
                callAllApi()
            }
            return () => {
                dispatch(resetTimeBasedRoutingApiStatus());
            };
        }, [])
    )

    const GetTimeSlotDetailsEvents = () => {
        if (user_data !== null) {
            var dict = {};
            dict.createdby = user_data?.data?.user_uuid,
                dict.time_condition_uuid = route?.params?.item[0]?.time_condition_uuid,
                dispatch(Get_Time_Slot_Details_Events(dict))
        }
    }

    useEffect(() => {
        Log('apiGetTimeSlotDetailsEvents :', apiGetTimeSlotDetailsEvents);
        if (apiGetTimeSlotDetailsEvents == STATUS_FULFILLED) {
            Log("time_slot_details_events  :", time_slot_details_events)
            if (time_slot_details_events !== null) {
                setEventList(time_slot_details_events)
            }
        } else if (apiGetTimeSlotDetailsEvents == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetTimeSlotDetailsEvents]);

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
                const DestinationByRoute = route_by_destination_list?.find(item => item.text === DestinationTo)?.value || "";
                setDestinationValue(DestinationByRoute)
            }
        } else if (apiGetRouteToDestination == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetRouteToDestination]);

    //edit perticular time slot details

    const GetPerticularTimeSlotEvents = (item) => {
        var dict = {};
        dict.createdby = user_data?.data?.user_uuid,
            dict.time_condition_data_uuid = item?.id
        dispatch(Get_Time_Slot_Events_Perticular(dict));
    }

    useEffect(() => {
        Log('apiGetTimeSlotEventsPerticular :', apiGetTimeSlotEventsPerticular);
        if (apiGetTimeSlotEventsPerticular == STATUS_FULFILLED) {
            if (time_slot_details_events_particular !== null) {
                setEventModel(true)
                setIsFromEdit(true)
                const eventDetails = time_slot_details_events_particular?.time_slot_details[0]
                const destinationList = time_slot_details_events_particular?.destination_type_option
                setSelectedDate(eventDetails?.time_condition_date)
                setEventName(eventDetails?.event_name)
                setFrom(eventDetails?.from_time)
                setTo(eventDetails?.to_time)
                const route = ROUTE?.find(data => data.route === eventDetails?.route_type)?.value || "";
                setRouteTo(route) // Extension
                setRouteValue(eventDetails?.route_type)//extension
                setDestinationValue(eventDetails?.route_to)// 1003 id
                const destination = destinationList?.find(data => data.value === eventDetails?.route_to)?.text || "";
                setDestinationTo(destination)
            }
        } else if (apiGetTimeSlotEventsPerticular == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetTimeSlotEventsPerticular]);

    // Update time slot events
    const UpdateTimeSlot = (item) => {
        var dict = {};
        const from = moment(From).format('h:mm A')
        const to = moment(To).format('h:mm A')
        dict.createdby = user_data?.data?.user_uuid,
            dict.event_name = eventName,
            dict.from_time = from,
            dict.id = Id,
            dict.main_admin_uuid = user_data?.data?.main_uuid,
            dict.route_to = DestinationValue,
            dict.route_type = RouteValue,
            dict.schedule_type = 'date',
            dict.time_condition_data_uuid = Id,
            dict.time_condition_date = selectedDate,
            dict.time_condition_uuid = route?.params?.item[0]?.time_condition_uuid,
            dict.to_time = to,
            dict.user_uuid = user_data?.data?.user_uuid
        dispatch(Update_Time_Slot(dict))

    }

    useEffect(() => {
        Log('apiUpdateTimeSlot :', apiUpdateTimeSlot);
        if (apiUpdateTimeSlot == STATUS_FULFILLED) {
            callAllApi()
            blankEventModalState()

        } else if (apiUpdateTimeSlot == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateTimeSlot]);


    const CreateTimeSlot = () => {
        const from = moment(From).format('h:mm A')
        const to = moment(To).format('h:mm A')
        var dict = {};
        dict.event_name = eventName,
            dict.createdby = user_data?.data?.user_uuid,
            dict.main_admin_uuid = user_data?.data?.main_uuid
        dict.user_uuid = user_data?.data?.user_uuid
        dict.from_time = from,
            dict.id = "",
            dict.route_to = DestinationValue,
            dict.route_type = RouteValue,
            dict.schedule_type = "date",
            dict.time_condition_data_uuid = "",
            dict.time_condition_date = selectedDate
        dict.time_condition_uuid = route?.params?.item[0]?.time_condition_uuid,
            dict.to_time = to,
        dispatch(Create_Time_Slot(dict))
    }

    //Create Time Slot
    useEffect(() => {
        Log('apiCreateTimeSlot :', apiCreateTimeSlot);
        if (apiCreateTimeSlot == STATUS_FULFILLED) {
            callAllApi()
            blankEventModalState()
        } else if (apiCreateTimeSlot == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateTimeSlot]);


    //Delete Time Slot Event

    useEffect(() => {
        Log('apiDeleteTimeSlotEvent :', apiDeleteTimeSlotEvent);
        if (apiDeleteTimeSlotEvent == STATUS_FULFILLED) {
            callAllApi()
            blankEventModalState()
        } else if (apiDeleteTimeSlotEvent == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteTimeSlotEvent]);
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
        setFrom(date)
        hideTimePickerFrom();
        setFromError("")
    };
    const handleConfirmTo = (data, type) => {
        setTo(data)
        hideTimePickerTo();
        setToError("")
    };
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

    const theme = useMemo(() => {
        return {
            backgroundColor: white,
            calendarBackground: white,
            textSectionTitleColor: grey,
            textSectionTitleDisabledColor: red,
            selectedDayBackgroundColor: greenPrimary,
            selectedDayTextColor: white,
            todayTextColor: greenPrimary,
            dayTextColor: black,
            textDisabledColor: grey02,
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            disabledArrowColor: grey01,
            monthTextColor: black,
            indicatorColor: 'blue',
            textDayFontFamily: MEDIUM,
            textMonthFontFamily: SEMIBOLD,
            textDayFontSize: FontSize.FS_14,
            textMonthFontSize: FontSize.FS_16,
            textDayHeaderFontSize: FontSize.FS_11,
            textDayHeaderFontFamily: MEDIUM,
            arrowColor: white,
            weekVerticalMargin: 0,
            'stylesheet.calendar.header': {
                arrow: {
                    backgroundColor: greenPrimary,
                    paddingVertical: 6,
                    paddingHorizontal: 7,
                    borderRadius: 4

                },
                day: {
                    marginTop: 10,
                    paddingHorizontal: 10,
                    marginBottom: 10,
                    marginHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',

                },
                dayHeader: {
                    marginTop: 10,
                    width: 100,
                    textAlign: 'center',
                    fontSize: FontSize.FS_14,
                    fontFamily: SEMIBOLD,
                    color: black,
                },
                monthText: {
                    fontSize: FontSize.FS_16,
                    fontFamily: SEMIBOLD,
                    color: white,
                    backgroundColor: greenPrimary,
                    textAlign: 'center',
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    borderRadius: 4
                },
            }
        };
    }, []);

    const _renderArrow = useCallback((direction) => {
        const text = direction === 'left' ? '<<' : '>>';
        return (
            <>
                {direction === 'left' ?
                    <TouchableOpacity style={{ padding: 8, backgroundColor: greenPrimary, borderRadius: 4 }}>
                        <Icon name={"chevron-left"} size={22} color={white} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ padding: 8, backgroundColor: greenPrimary, borderRadius: 4 }}>
                        <Icon name={"chevron-right"} size={22} color={white} />
                    </TouchableOpacity>
                }
            </>
        );
    }, []);

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setEventModel(true);
    };
    const handleSaveEvent = () => {
        if (eventName == "") {
            setEventNameError("* Please enter event name.")
        }
        if (From == "") {
            setFromError("* Please select from time.")
        }
        if (To == "") {
            setToError("* Please select to time.")
        }
        if (RouteTo == "") {
            setRouteToError("* Please select Route type.")
        }
        if (DestinationTo == "") {
            setDestinationToError("* Please select Route.")
        }
        else {
            if (IsFromEdit == false) {
                CreateTimeSlot()
            }
        }

    };
    const EditDayEvents = (event) => {
        setMoreEventModel(false)
        setId(event?.id)
        GetPerticularTimeSlotEvents(event)

    }
    const handleUpdateEvent = () => {

        if (eventName == "") {
            setEventNameError("* Please enter event name.")
        }
        if (From == "") {
            setFromError("* Please select from time.")
        }
        if (To == "") {
            setToError("* Please select to time.")
        }
        if (RouteTo == "") {
            setRouteToError("* Please select Route type.")
        }
        if (DestinationTo == "") {
            setDestinationToError("* Please select Route.")
        }
        else {
            if (IsFromEdit == true) {
                UpdateTimeSlot()
            }
        }
    };
    const handleCancelEvent = () => {
        blankEventModalState()
    };
    const handleDeleteEvent = () => {
        Alert.alert(
            eventName,
            'Are you sure to delete this event?',
            [
                {
                    text: 'No',
                    onPress: () => {}, style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        var dict = {
                            createdby: user_data?.data?.user_uuid,
                            time_slot_uuid: Id
                        }
                        dispatch(Delete_Time_Slot_Event(dict))
                    }
                },
            ],
            { cancelable: true },
            //clicking out side of alert will not cancel
        );
    };
    const blankEventModalState = () => {
        setEventModel(false);
        setIsFromEdit(false)
        setEventName("")
        setEventNameError("")
        setFrom("")
        setFromError("")
        setTo("")
        setToError("")
        setRouteTo("")
        setRouteToError("")
        setDestinationTo("")
        setDestinationToError("")
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
                    marginHorizontal: pixelSizeHorizontal(0),
                }}>
                <View style={{ marginHorizontal: 20 }}>
                    <HeaderBackView
                        title={"Holiday & Specific"}
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />

                    <ScrollView horizontal style={{ marginHorizontal: -20 }}>
                        <Calendar
                            headerStyle={{
                                marginBottom: 20
                            }}

                            minDate={moment().format('YYYY-MM-DD')}
                            theme={theme}
                            style={{
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,

                                elevation: 2,
                                marginBottom: 100,
                                backgroundColor: white,
                                paddingHorizontal: 40,
                            }}
                            onDayPress={handleDayPress}
                            // onMonthChange={(newMonth) =>{
                            //     setCurrentMonth(newMonth)}}
                            markedDates={{
                                [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
                                [moment().format('YYYY-MM-DD')]: { selected: true, marked: true, selectedDotColor: 'red' },
                            }}
                            // renderArrow={_renderArrow}
                            dayComponent={({ date, state }) => {
                                let dayEvents = [];

                                if (Array.isArray(EventList)) {
                                    dayEvents = EventList.filter((event) => {
                                        const start = event?.start;
                                        return start?.includes(date.dateString, 0);
                                    });
                                }
                                return (
                                    <TouchableOpacity key={Math.random()}
                                        activeOpacity={state === 'disabled' ? 0.9 : 0.1}
                                        onPress={() => {
                                            if (state === 'disabled') {

                                            }
                                            else {
                                                handleDayPress(date)
                                            }
                                        }}
                                        style={{
                                            width: 100,
                                            height: 130,
                                            backgroundColor: state === 'disabled' ? "#f1f1f1" : white,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderWidth: 1,
                                            borderColor: state === 'disabled' ? "#dddddd" : "#dddddd",
                                            // opacity: state === 'disabled' ? 0.2 : 1,
                                        }}>
                                        <Text style={{
                                            textAlign: 'center',
                                            color: date.dateString == moment().format('YYYY-MM-DD') ? white : state === 'disabled' ? grey01 : black,
                                            fontFamily: SEMIBOLD,
                                            fontSize: FontSize.FS_13,
                                            backgroundColor: date.dateString == moment().format('YYYY-MM-DD') ? greenPrimary : transparent,
                                            padding: date.dateString == moment().format('YYYY-MM-DD') ? 6 : 0,
                                            borderRadius: date.dateString == moment().format('YYYY-MM-DD') ? 100 : 0,
                                        }}>{date.day}</Text>

                                        {dayEvents?.length > 0 ? (
                                            dayEvents?.slice(0, 2).map((event, index) => (
                                                <>
                                                    {state !== 'disabled' &&
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                key = Math.random()
                                                                EditDayEvents(event)
                                                            }}
                                                            style={{
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                marginTop: 4,
                                                                backgroundColor: greenPrimary,
                                                                padding: 4,
                                                                borderRadius: 4
                                                            }}>
                                                            <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_09, color: white }}>{"  " + event?.title}</Text>
                                                        </TouchableOpacity>
                                                    }
                                                </>
                                            ))
                                        ) : (
                                            null
                                        )}
                                        {dayEvents?.length > 2 && state !== 'disabled' &&
                                            <>
                                                <TouchableOpacity style={{ paddingVertical: 4, marginTop: 4 }}
                                                    onPress={() => {
                                                        setSelectedDate(date?.dateString);
                                                        setMoreEventModel(!MoreEventModel);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontFamily: SEMIBOLD,
                                                            fontSize: FontSize.FS_09,
                                                            color: greenPrimary,
                                                        }}
                                                    >
                                                        {'+' + (dayEvents?.length - 2) + ' More'}
                                                    </Text>
                                                </TouchableOpacity>
                                                <Modal
                                                    animationType="slide"
                                                    transparent={true}
                                                    visible={MoreEventModel}
                                                    onRequestClose={() => {
                                                        setMoreEventModel(!MoreEventModel);
                                                    }}
                                                >
                                                    <View style={styles.centeredView}>
                                                        <View style={styles.modalView}>
                                                            <View style={{ marginBottom: 50 }}>
                                                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                                                                    <Text style={{
                                                                        fontSize: FontSize.FS_13,
                                                                        color: black,
                                                                        fontFamily: SEMIBOLD,
                                                                        textAlign: "center",
                                                                        flex: 1
                                                                    }}>{moment(selectedDate).format('DD-MM-YYYY')}</Text>
                                                                    <TouchableOpacity style={{ justifyContent: "flex-end", alignSelf: "flex-end", alignItems: "flex-end" }}
                                                                        onPress={() => { setMoreEventModel(!MoreEventModel) }}>

                                                                        <Icon name={"close"} size={30} color={black} />
                                                                    </TouchableOpacity>
                                                                </View>

                                                                {dayEvents.map((event, index) => (
                                                                    <>
                                                                        <TouchableOpacity onPress={() => {
                                                                            EditDayEvents(event)
                                                                        }}
                                                                            style={{
                                                                                flexDirection: "row",
                                                                                alignItems: "center",
                                                                                marginTop: 4,
                                                                                backgroundColor: white,
                                                                                paddingVertical: 6,
                                                                                paddingHorizontal: 14,
                                                                                borderRadius: 4,
                                                                                borderWidth: 1,
                                                                                borderColor: black
                                                                            }}>
                                                                            <View style={{ width: 10, height: 10, backgroundColor: greenPrimary, borderRadius: 10, marginRight: 10 }}></View>
                                                                            <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_14, color: black, }}>{moment(event.start).format("h:mm A")}</Text>
                                                                            <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_14, color: black, }}>{" - "}</Text>
                                                                            <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_14, color: black, }}>{moment(event.end).format("h:mm A")}</Text>
                                                                            <Text style={{ fontFamily: SEMIBOLD, fontSize: FontSize.FS_14, color: black, marginLeft: 20 }}>{"  " + event?.title}</Text>
                                                                        </TouchableOpacity>

                                                                    </>
                                                                ))}

                                                            </View>
                                                        </View>
                                                    </View>
                                                </Modal>
                                            </>
                                        }
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </ScrollView>

                </View>

                <RouteDestinationBottomSheet
                    data={ROUTE}
                    headerTitle={'Select Route Type'}
                    currentValue={RouteValue}
                    bottomSheetRef={RouteTobottomSheetRef}
                    selectedValue={data => {
                        setRouteTo(data);
                        setRouteToError("")
                    }}
                    selectedRoute={data => {
                        setRouteValue(data)
                        setDestinationTo("")
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
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={EventModel}
                    onRequestClose={() => {
                        setEventModel(!EventModel);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    textAlign: "center",
                                    flex: 1
                                }}>{moment(selectedDate).format('DD-MM-YYYY')}</Text>
                                <TouchableOpacity style={{ justifyContent: "flex-end", alignSelf: "flex-end", alignItems: "flex-end" }}
                                    onPress={() => handleCancelEvent()}>

                                    <Icon name={"close"} size={30} color={black} />
                                </TouchableOpacity>
                            </View>

                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"Event Name"}</Text>
                            <TextInput
                                value={eventName}
                                placeholder='Enter Event Name'
                                placeholderTextColor={black}
                                style={{
                                    borderWidth: 1,
                                    borderColor: black,
                                    height: 40,
                                    borderRadius: 4,
                                    paddingHorizontal: 14,
                                    marginVertical: 10,
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,

                                }}
                                onChangeText={(txt) => {
                                    setEventName(txt)
                                    setEventNameError("")
                                }}
                            />
                            {eventNameError !== "" && <Text
                                style={{
                                    fontSize: FontSize.FS_10,
                                    color: red,
                                    fontFamily: MEDIUM,
                                }}>
                                {eventNameError}
                            </Text>
                            }
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"From Times"}</Text>
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
                                    marginVertical: 10,
                                    borderRadius: 4,
                                }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    marginTop: 4
                                }}>{From == "" ? "Select Time" : moment(From, 'HH:mm').format("h:mm A")}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
                            {FromError !== "" && <Text
                                style={{
                                    fontSize: FontSize.FS_10,
                                    color: red,
                                    fontFamily: MEDIUM,
                                }}>
                                {FromError}
                            </Text>
                            }
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
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
                                }}>{To == "" ? "Select Time" : moment(To, 'HH:mm').format("h:mm A")}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
                            {ToError !== "" && <Text
                                style={{
                                    fontSize: FontSize.FS_10,
                                    color: red,
                                    fontFamily: MEDIUM,
                                }}>
                                {ToError}
                            </Text>
                            }
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"Route Type"}</Text>
                            <TouchableOpacity onPress={() => {
                                openRouteToBottomSheet()
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
                                }}>{RouteTo == "" ? "Select Route Type" : RouteTo}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
                            {RouteToError !== "" && <Text
                                style={{
                                    fontSize: FontSize.FS_10,
                                    color: red,
                                    fontFamily: MEDIUM,
                                }}>
                                {RouteToError}
                            </Text>}
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"Route To"}</Text>
                            <TouchableOpacity onPress={() => {
                                openDestinationToBottomSheet()
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
                                }}>{DestinationTo == "" ? "Select Route" : DestinationTo}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
                            {DestinationToError !== "" && <Text
                                style={{
                                    fontSize: FontSize.FS_10,
                                    color: red,
                                    fontFamily: MEDIUM,
                                }}>
                                {DestinationToError}
                            </Text>
                            }
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <TouchableOpacity onPress={() => {
                                    if (IsFromEdit == true) {
                                        handleDeleteEvent()
                                    }
                                    else {
                                        handleCancelEvent()
                                    }
                                }}
                                    style={{ backgroundColor: IsFromEdit == true ? red : grey, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18, marginBottom: 20 }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: IsFromEdit == true ? white : white,
                                        fontFamily: SEMIBOLD,
                                    }}>{IsFromEdit == true ? "Delete Event" : "Close"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    if (IsFromEdit == true) {
                                        handleUpdateEvent()
                                    }
                                    else {
                                        handleSaveEvent()
                                    }
                                }}
                                    style={{ backgroundColor: greenPrimary, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18, marginBottom: 20 }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: white,
                                        fontFamily: SEMIBOLD,
                                    }}>{IsFromEdit == true ? "Update" : "Save"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <DateTimePickerModal
                    isVisible={IsFromTimePickerShow}
                    mode="time"
                    onConfirm={handleConfirmFrom}
                    onCancel={hideTimePickerFrom}
                />
                <DateTimePickerModal
                    isVisible={IsToTimePickerShow}
                    mode="time"
                    onConfirm={handleConfirmTo}
                    onCancel={hideTimePickerTo}
                />
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default HolidaySpecific;

const styles = StyleSheet.create({

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
