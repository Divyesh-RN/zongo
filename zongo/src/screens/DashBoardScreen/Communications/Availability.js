import { View, StyleSheet, Text, TouchableOpacity, Modal, Alert, FlatList } from 'react-native';
import React, { useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderView from '../../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import { black, black05, disableColor, greenPrimary, grey, red, white, yellow } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import { goBack } from '../../../navigation/RootNavigation';
import NameSelectBottomSheet from '../components/NameSelectBottomSheet';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';


const Availability = ({ navigation }) => {

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

    const [From, setFrom] = useState("");
    const [To, setTo] = useState("");

    const [Id, setId] = useState(0);
    const [EditID, setEditID] = useState(0);

    const [RouteTo, setRouteTo] = useState("");
    const [DestinationTo, setDestinationTo] = useState("");

    const [modalVisible, setModalVisible] = useState(false);
    const [MoreModelVisible, setMoreModelVisible] = useState(false);
    const [IsFromEdit, setIsFromEdit] = useState(false);

    const [IsFromTimePickerShow, setIsFromTimePickerShow] = useState(false);
    const [IsToTimePickerShow, setIsToTimePickerShow] = useState(false);

    const [Day, setDay] = useState("monday");

    const RouteTobottomSheetRef = useRef(null);
    const DestinationTobottomSheetRef = useRef(null);


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
    };
    const handleConfirmTo = (date, type) => {
        setTo(date)
        hideTimePickerTo();
    };
    const handleSaveTimeBlock = () => {
        var dict = {};
        dict.from = From,
            dict.to = To,
            dict.route = RouteTo,
            dict.destination = DestinationTo,
            dict.id = Id + 1

        if (IsFromEdit == true) {
            if (Day == "monday") {
                const updatedItems = MondayData.map(item =>
                    item.id === EditID ? {
                        ...item,
                        from: From,
                        to: To,
                        route: RouteTo,
                        destination: DestinationTo,
                        id: Id
                    } : item
                );
                setMondayData(updatedItems);
            }
            else if (Day == "tuesday") {
                const updatedItems = TuesdayData.map(item =>
                    item.id === EditID ? {
                        ...item,
                        from: From,
                        to: To,
                        route: RouteTo,
                        destination: DestinationTo,
                        id: Id
                    } : item
                );
                console.log("updatedItems ", updatedItems)

                setTuesdayData(updatedItems);
            }

            else if (Day == "wenesday") {
                const updatedItems = WenesdayData.map(item =>
                    item.id === EditID ? {
                        ...item,
                        from: From,
                        to: To,
                        route: RouteTo,
                        destination: DestinationTo,
                        id: Id
                    } : item
                );
                setWenesdayData(updatedItems);
            }

            else if (Day == "thursday") {
                const updatedItems = ThursdayData.map(item =>
                    item.id === EditID ? {
                        ...item,
                        from: From,
                        to: To,
                        route: RouteTo,
                        destination: DestinationTo,
                        id: Id
                    } : item
                );
                setThursdayData(updatedItems);
            }

            else if (Day == "friday") {
                const updatedItems = FridayData.map(item =>
                    item.id === EditID ? {
                        ...item,
                        from: From,
                        to: To,
                        route: RouteTo,
                        destination: DestinationTo,
                        id: Id
                    } : item
                );
                setFridayData(updatedItems);
            }

            else if (Day == "saturday") {
                const updatedItems = SaturdayData.map(item =>
                    item.id === EditID ? {
                        ...item,
                        from: From,
                        to: To,
                        route: RouteTo,
                        destination: DestinationTo,
                        id: Id
                    } : item
                );
                setSaturdayData(updatedItems);
            }

            else if (Day == "sunday") {
                const updatedItems = SundayData.map(item =>
                    item.id === EditID ? {
                        ...item,
                        from: From,
                        to: To,
                        route: RouteTo,
                        destination: DestinationTo,
                        id: Id
                    } : item
                );
                setSundayData(updatedItems);
            }
        }
        else {
            if (Day == "monday") {
                setMondayData([...MondayData, dict])
            }
            else if (Day == "tuesday") {
                setTuesdayData([...TuesdayData, dict])
            }

            else if (Day == "wenesday") {
                setWenesdayData([...WenesdayData, dict])
            }

            else if (Day == "thursday") {
                setThursdayData([...ThursdayData, dict])
            }

            else if (Day == "friday") {
                setFridayData([...FridayData, dict])
            }

            else if (Day == "saturday") {
                setSaturdayData([...SaturdayData, dict])
            }

            else if (Day == "sunday") {
                setSundayData([...SundayData, dict])
            }
        }


        setModalVisible(false)
        setFrom("")
        setTo("")
        setRouteTo("")
        setDestinationTo("")

    }

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

    const RemoveMondeyData = (item, day) => {
        
        const updatedMondeyData = [...MondayData];
        updatedMondeyData.splice(item, 1);
        setMondayData(updatedMondeyData)
    }
    const RemoveTuesdayData = (item, day) => {
        
        const updatedTuesdayData = [...TuesdayData];
        updatedTuesdayData.splice(item, 1);
        setTuesdayData(updatedTuesdayData)
    }
    const RemoveWenesdayData = (item, day) => {
        
        const updatedWenesdayData = [...WenesdayData];
        updatedWenesdayData.splice(item, 1);
        setWenesdayData(updatedWenesdayData)
    }
    const RemoveThursdayData = (item, day) => {
        
        const updatedThursdayData = [...ThursdayData];
        updatedThursdayData.splice(item, 1);
        setThursdayData(updatedThursdayData)
    }
    const RemoveFridayData = (item, day) => {
        
        const updatedFridayData = [...FridayData];
        updatedFridayData.splice(item, 1);
        setFridayData(updatedFridayData)
    }
    const RemoveSaturdayData = (item, day) => {
        
        const updatedSaturdayData = [...SaturdayData];
        updatedSaturdayData.splice(item, 1);
        setSaturdayData(updatedSaturdayData)
    }
    const RemoveSundayData = (item, day) => {
        
        const updatedSundayData = [...SundayData];
        updatedSundayData.splice(item, 1);
        setSundayData(updatedSundayData)
    }

    const EditTimeData = (item, day) => {
        
        setFrom(item?.from)
        setTo(item?.to)
        setRouteTo(item?.route)
        setDestinationTo(item?.destination)
        setEditID(item?.id)
        setModalVisible(!modalVisible)
    }
    const ROUTE = [
        {
            id: 1,
            value: "Auto Attendant",
        },
        {
            id: 2,
            value: "Extension",
        },
        {
            id: 3,
            value: "Ring Group",
        },
        {
            id: 4,
            value: "DID",
        },
        {
            id: 5,
            value: "Voicemail",
        },
    ];
    const DESTINATION = [
        {
            id: 1,
            value: "15 Nov",
        },
        {
            id: 2,
            value: "1000",
        },
        {
            id: 3,
            value: "1002",
        },
    ];
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
                    title="Availability Schedule"
                    isBack={true}
                    onPressBack={() => {
                        goBack();
                    }}
                    onPressMenu={() => {
                        navigation.toggleDrawer();
                    }}
                />

                <View
                    style={{ marginTop: 0, marginBottom: 40 }}>
                    {/* Monday */}
                    <View style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>

                        <TouchableOpacity onPress={() => {
                            setMondayShow(!MondayShow)
                            setTuesdayShow(false)
                            setWenesdayShow(false)
                            setThursdayShow(false)
                            setFridayShow(false)
                            setSaturdayShow(false)
                            setSundayShow(false)
                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"MONDAY"}</Text>

                            <View >
                                <Icon name={MondayShow == false ? "chevron-down" : "chevron-up"} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {MondayShow == true &&
                            <View>
                                <FlatList
                                    data={MondayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) => <View onPress={() => {
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 14,
                                        }}>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{moment(item.from).format("h : mm A")} {"to"} {moment(item.to).format("h : mm A")}</Text>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{item?.route} {" "} {item?.destination}</Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-evenly",
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "mondey")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"clock-edit-outline"} size={25} color={yellow} />

                                            </TouchableOpacity><TouchableOpacity onPress={() => {
                                                RemoveMondeyData(index, "mondey")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"trash-can"} size={25} color={red} />

                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                                />

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, flex: 1 }}>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("monday")
                                        setIsFromEdit(false)

                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderColor: greenPrimary,
                                            borderWidth: 1.5,
                                            alignSelf: "center",
                                            paddingVertical: 6,
                                            borderRadius: 4,
                                            flex: 1
                                        }}>

                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: greenPrimary,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4
                                        }}>{"Add Time Block"}</Text>
                                        <Icon name={"plus"} size={22} color={greenPrimary} />

                                    </TouchableOpacity>
                                    <View style={{ flex: 0.3 }}></View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMoreModelVisible(!MoreModelVisible)
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flex: 1,
                                            justifyContent: "center",
                                            borderColor: grey,
                                            borderWidth: 1.5,
                                            paddingVertical: 6,
                                            borderRadius: 4
                                        }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4

                                        }}>More</Text>
                                        <Icon name={"dots-horizontal"} size={22} color={grey} />


                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                    {/* Tuesday */}
                    <View style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>

                        <TouchableOpacity onPress={() => {
                            setTuesdayShow(!TuesdayShow)
                            setMondayShow(false)
                            setWenesdayShow(false)
                            setThursdayShow(false)
                            setFridayShow(false)
                            setSaturdayShow(false)
                            setSundayShow(false)

                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"TUESDAY"}</Text>

                            <View >
                                <Icon name={TuesdayShow == false ? "chevron-down" : "chevron-up"} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {TuesdayShow == true &&
                            <View>
                                <FlatList
                                    data={TuesdayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) => <View onPress={() => {
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 14,
                                        }}>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{moment(item.from).format("h : mm A")} {"to"} {moment(item.to).format("h : mm A")}</Text>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{item?.route} {" "} {item?.destination}</Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-evenly",
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "tuesday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"clock-edit-outline"} size={25} color={yellow} />

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                RemoveTuesdayData(index, "tuesday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"trash-can"} size={22} color={red} />

                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                                />
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, flex: 1 }}>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("tuesday")
                                        setIsFromEdit(false)
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderColor: greenPrimary,
                                            borderWidth: 1.5,
                                            alignSelf: "center",
                                            paddingHorizontal: 14,
                                            paddingVertical: 5,
                                            borderRadius: 4
                                        }}>

                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: greenPrimary,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4

                                        }}>{"Add Time Block"}</Text>
                                        <Icon name={"plus"} size={22} color={greenPrimary} />

                                    </TouchableOpacity>
                                    <View style={{ flex: 0.3 }}></View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMoreModelVisible(!MoreModelVisible)
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flex: 1,
                                            justifyContent: "center",
                                            borderColor: grey,
                                            borderWidth: 1.5,
                                            paddingVertical: 6,
                                            borderRadius: 4
                                        }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4

                                        }}>More</Text>
                                        <Icon name={"dots-horizontal"} size={22} color={grey} />


                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                    {/* Wenesday */}
                    <View style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>

                        <TouchableOpacity onPress={() => {
                            setWenesdayShow(!WenesdayShow)
                            setMondayShow(false)
                            setTuesdayShow(false)
                            setThursdayShow(false)
                            setFridayShow(false)
                            setSaturdayShow(false)
                            setSundayShow(false)
                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"WENESDAY"}</Text>

                            <View >
                                <Icon name={WenesdayShow == false ? "chevron-down" : "chevron-up"} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {WenesdayShow == true &&
                            <View>
                                <FlatList
                                    data={WenesdayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) => <View onPress={() => {
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 14,
                                        }}>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{moment(item.from).format("h : mm A")} {"to"} {moment(item.to).format("h : mm A")}</Text>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{item?.route} {" "} {item?.destination}</Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-evenly",
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "wenesday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"clock-edit-outline"} size={25} color={yellow} />

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                RemoveWenesdayData(index, "wenesday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"trash-can"} size={22} color={red} />

                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                                />
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, flex: 1 }}>
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible)
                                        setDay("wenesday")
                                        setIsFromEdit(false)
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderColor: greenPrimary,
                                            borderWidth: 1.5,
                                            alignSelf: "center",
                                            paddingHorizontal: 14,
                                            paddingVertical: 5,
                                            borderRadius: 4
                                        }}>

                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: greenPrimary,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4

                                        }}>{"Add Time Block"}</Text>
                                        <Icon name={"plus"} size={22} color={greenPrimary} />

                                    </TouchableOpacity>
                                    <View style={{ flex: 0.3 }}></View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMoreModelVisible(!MoreModelVisible)
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flex: 1,
                                            justifyContent: "center",
                                            borderColor: grey,
                                            borderWidth: 1.5,
                                            paddingVertical: 6,
                                            borderRadius: 4
                                        }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4

                                        }}>More</Text>
                                        <Icon name={"dots-horizontal"} size={22} color={grey} />


                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                    {/* Thursday */}
                    <View style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>

                        <TouchableOpacity onPress={() => {
                            setThursdayShow(!ThursdayShow)
                            setMondayShow(false)
                            setTuesdayShow(false)
                            setWenesdayShow(false)
                            setFridayShow(false)
                            setSaturdayShow(false)
                            setSundayShow(false)
                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"THURSDAY"}</Text>

                            <View >
                                <Icon name={ThursdayShow == false ? "chevron-down" : "chevron-up"} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {ThursdayShow == true &&
                            <View>
                                <FlatList
                                    data={ThursdayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) => <View onPress={() => {
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 14,
                                        }}>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{moment(item.from).format("h : mm A")} {"to"} {moment(item.to).format("h : mm A")}</Text>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{item?.route} {" "} {item?.destination}</Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-evenly",
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "thursday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"clock-edit-outline"} size={25} color={yellow} />

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                RemoveThursdayData(index, "thursday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"trash-can"} size={22} color={red} />

                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                                />
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible(!modalVisible)
                                    setDay("thursday")
                                    setIsFromEdit(false)
                                }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderColor: greenPrimary,
                                        borderWidth: 1.5,
                                        alignSelf: "center",
                                        paddingHorizontal: 14,
                                        paddingVertical: 5,
                                        borderRadius: 4
                                    }}>

                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: greenPrimary,
                                        fontFamily: SEMIBOLD,
                                        textAlign: "center",
                                        marginRight: 4

                                    }}>{"Add Time Block"}</Text>
                                    <Icon name={"plus"} size={22} color={greenPrimary} />

                                </TouchableOpacity>
                                <View style={{ flex: 0.3 }}></View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMoreModelVisible(!MoreModelVisible)
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flex: 1,
                                            justifyContent: "center",
                                            borderColor: grey,
                                            borderWidth: 1.5,
                                            paddingVertical: 6,
                                            borderRadius: 4
                                        }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4

                                        }}>More</Text>
                                        <Icon name={"dots-horizontal"} size={22} color={grey} />


                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                    {/* Friday */}
                    <View style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>

                        <TouchableOpacity onPress={() => {
                            setFridayShow(!FridayShow)
                            setMondayShow(false)
                            setTuesdayShow(false)
                            setWenesdayShow(false)
                            setThursdayShow(false)
                            setSaturdayShow(false)
                            setSundayShow(false)
                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"FRIDAY"}</Text>

                            <View >
                                <Icon name={FridayShow == false ? "chevron-down" : "chevron-up"} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {FridayShow == true &&
                            <View>
                                <FlatList
                                    data={FridayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) => <View onPress={() => {
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 14,
                                        }}>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{moment(item.from).format("h : mm A")} {"to"} {moment(item.to).format("h : mm A")}</Text>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{item?.route} {" "} {item?.destination}</Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-evenly",
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "friday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"clock-edit-outline"} size={25} color={yellow} />

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                RemoveFridayData(index, "friday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"trash-can"} size={22} color={red} />

                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                                />
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible(!modalVisible)
                                    setDay("friday")
                                    setIsFromEdit(false)
                                }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderColor: greenPrimary,
                                        borderWidth: 1.5,
                                        alignSelf: "center",
                                        paddingHorizontal: 14,
                                        paddingVertical: 5,
                                        borderRadius: 4
                                    }}>

                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: greenPrimary,
                                        fontFamily: SEMIBOLD,
                                        textAlign: "center",
                                        marginRight: 4

                                    }}>{"Add Time Block"}</Text>
                                    <Icon name={"plus"} size={22} color={greenPrimary} />

                                </TouchableOpacity>
                                <View style={{ flex: 0.3 }}></View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMoreModelVisible(!MoreModelVisible)
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flex: 1,
                                            justifyContent: "center",
                                            borderColor: grey,
                                            borderWidth: 1.5,
                                            paddingVertical: 6,
                                            borderRadius: 4
                                        }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4

                                        }}>More</Text>
                                        <Icon name={"dots-horizontal"} size={22} color={grey} />


                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                    {/* Saturday */}
                    <View style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>

                        <TouchableOpacity onPress={() => {
                            setSaturdayShow(!SaturdayShow)
                            setMondayShow(false)
                            setTuesdayShow(false)
                            setWenesdayShow(false)
                            setThursdayShow(false)
                            setFridayShow(false)
                            setSundayShow(false)
                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"SATURDAY"}</Text>

                            <View >
                                <Icon name={SaturdayShow == false ? "chevron-down" : "chevron-up"} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {SaturdayShow == true &&
                            <View>
                                <FlatList
                                    data={SaturdayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) => <View onPress={() => {
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 14,
                                        }}>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{moment(item.from).format("h : mm A")} {"to"} {moment(item.to).format("h : mm A")}</Text>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{item?.route} {" "} {item?.destination}</Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-evenly",
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "saturday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"clock-edit-outline"} size={25} color={yellow} />

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                RemoveSaturdayData(index, "saturday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"trash-can"} size={22} color={red} />

                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                                />
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible(!modalVisible)
                                    setDay("saturday")
                                    setIsFromEdit(false)
                                }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderColor: greenPrimary,
                                        borderWidth: 1.5,
                                        alignSelf: "center",
                                        paddingHorizontal: 14,
                                        paddingVertical: 5,
                                        borderRadius: 4
                                    }}>

                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: greenPrimary,
                                        fontFamily: SEMIBOLD,
                                        textAlign: "center",
                                        marginRight: 4

                                    }}>{"Add Time Block"}</Text>
                                    <Icon name={"plus"} size={22} color={greenPrimary} />

                                </TouchableOpacity>
                                <View style={{ flex: 0.3 }}></View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMoreModelVisible(!MoreModelVisible)
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flex: 1,
                                            justifyContent: "center",
                                            borderColor: grey,
                                            borderWidth: 1.5,
                                            paddingVertical: 6,
                                            borderRadius: 4
                                        }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4

                                        }}>More</Text>
                                        <Icon name={"dots-horizontal"} size={22} color={grey} />


                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                    {/* Sunday */}
                    <View style={{
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: disableColor,
                        marginHorizontal: -20,
                    }}>

                        <TouchableOpacity onPress={() => {
                            setSundayShow(!SundayShow)
                            setMondayShow(false)
                            setTuesdayShow(false)
                            setWenesdayShow(false)
                            setThursdayShow(false)
                            setFridayShow(false)
                            setSaturdayShow(false)

                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                            }}>{"SUNDAY"}</Text>

                            <View >
                                <Icon name={SundayShow == false ? "chevron-down" : "chevron-up"} size={22} color={black} />
                            </View>
                        </TouchableOpacity>
                        {SundayShow == true &&
                            <View>
                                <FlatList
                                    data={SundayData}
                                    key={Math.random()}
                                    renderItem={({ item, index }) => <View onPress={() => {
                                    }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderBottomWidth: 1,
                                            borderBottomColor: disableColor,
                                            paddingVertical: 14,
                                        }}>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{moment(item.from).format("h : mm A")} {"to"} {moment(item.to).format("h : mm A")}</Text>
                                        <Text style={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12, color: black }}>{item?.route} {" "} {item?.destination}</Text>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-evenly",
                                            }}>
                                            <TouchableOpacity onPress={() => {
                                                setIsFromEdit(true)
                                                EditTimeData(item, "sunday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"clock-edit-outline"} size={25} color={yellow} />

                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                RemoveSundayData(index, "sunday")
                                            }}
                                                style={{ padding: 5 }}>
                                                <Icon name={"trash-can"} size={22} color={red} />

                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                                />
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, flex: 1 }}>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible(!modalVisible)
                                    setDay("sunday")
                                    setIsFromEdit(false)
                                }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderColor: greenPrimary,
                                        borderWidth: 1.5,
                                        alignSelf: "center",
                                        paddingHorizontal: 14,
                                        paddingVertical: 5,
                                        borderRadius: 4
                                    }}>

                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: greenPrimary,
                                        fontFamily: SEMIBOLD,
                                        textAlign: "center",
                                        marginRight: 4

                                    }}>{"Add Time Block"}</Text>
                                    <Icon name={"plus"} size={22} color={greenPrimary} />

                                </TouchableOpacity>
                                <View style={{ flex: 0.3 }}></View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMoreModelVisible(!MoreModelVisible)
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            flex: 1,
                                            justifyContent: "center",
                                            borderColor: grey,
                                            borderWidth: 1.5,
                                            paddingVertical: 6,
                                            borderRadius: 4
                                        }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: SEMIBOLD,
                                            textAlign: "center",
                                            marginRight: 4

                                        }}>More</Text>
                                        <Icon name={"dots-horizontal"} size={22} color={grey} />


                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                </View>
                <NameSelectBottomSheet Name={ROUTE} bottomSheetRef={RouteTobottomSheetRef} selectedNameValue={(data) => {
                    setRouteTo(data)
                }} />
                <NameSelectBottomSheet Name={DESTINATION} bottomSheetRef={DestinationTobottomSheetRef} selectedNameValue={(data) => {
                    setDestinationTo(data)
                }} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Icon name={"close"} size={30} color={black} />
                            </TouchableOpacity>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
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
                                    marginVertical: 10,
                                    borderRadius: 4,
                                }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    marginTop: 4
                                }}>{From == "" ? "Select Time" : moment(From).format("h : mm A")}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 10
                            }}>{"To Tims"}</Text>
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
                                }}>{To == "" ? "Select Time" : moment(To).format("h : mm A")}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
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
                                }}>{RouteTo == "" ? "Select Desination" : RouteTo}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
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
                                }}>{DestinationTo == "" ? "Select Desination" : DestinationTo}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                handleSaveTimeBlock()
                            }}
                                style={{ backgroundColor: greenPrimary, height: 40, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: white,
                                    fontFamily: MEDIUM,
                                }}>{IsFromEdit == true ? "Update" : "Save"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={MoreModelVisible}

                    onRequestClose={() => {
                        setMoreModelVisible(!MoreModelVisible);
                    }}>

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
                                onPress={() => setMoreModelVisible(false)}>
                                <Icon name={"close"} size={22} color={black} />
                            </TouchableOpacity>
                            <View>
                                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon name={"content-copy"} size={22} color={grey} />
                                    <Text style={{
                                        fontSize: FontSize.FS_14,
                                        color: grey,
                                        fontFamily: SEMIBOLD,
                                        textAlign: "center",
                                        marginLeft: 10,


                                    }}>Copy to all weekdays</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon name={"content-copy"} size={22} color={grey} />
                                    <Text style={{
                                        fontSize: FontSize.FS_14,
                                        color: grey,
                                        fontFamily: SEMIBOLD,
                                        textAlign: "center",
                                        marginLeft: 10,
                                        marginVertical: 14

                                    }}>Copy to all</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Icon name={"content-copy"} size={22} color={grey} />
                                    <Text style={{
                                        fontSize: FontSize.FS_14,
                                        color: grey,
                                        fontFamily: SEMIBOLD,
                                        textAlign: "center",
                                        marginLeft: 10

                                    }}>Copy to weekends</Text>
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
        </>
    );
};

export default Availability;

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
