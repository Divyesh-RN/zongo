
import { FlatList, StyleSheet, TouchableOpacity, Text, View, Modal, ScrollView, Linking } from 'react-native';
import React, { useRef, useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black, white } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MEDIUM } from '@constants/Fonts';
import { black05, greenPrimary, grey, midGreen, red } from '@constants/Color';
import SelectionBottomSheet from './components/PrefixBottomSheet';
import { bgColor01, light_grey } from '../../../constants/Color';
import { HEIGHT } from '../../../constants/ConstantKey';

const AddNewInboundNumber = ({ navigation }) => {


    const [IsTollFreeNumber, setIsTollFreeNumber] = useState(true);
    const [TermConditionModel, setTermConditionModel] = useState(false);
    const [ActiveStep, setActiveStep] = useState(1);
    const [selectedNumbers, setSelectedNumbers] = useState([]);

    const [Prefix, setPrefix] = useState(null);
    const [State, setState] = useState(null);
    const [AreaCode, setAreaCode] = useState(null);
    const NUMBERS_PER_ROW = 3;



    const DestinationTobottomSheetRef = useRef(null);
    const PrefixbottomSheetRef = useRef(null);
    const StatebottomSheetRef = useRef(null);
    const AreaCodebottomSheetRef = useRef(null);

    const openPrefixBottomSheet = () => {
        if (PrefixbottomSheetRef.current) {
            PrefixbottomSheetRef.current.open();
        }
    };
    const openStateBottomSheet = () => {
        if (StatebottomSheetRef.current) {
            StatebottomSheetRef.current.open();
        }
    };
    const openAreaCodeBottomSheet = () => {
        if (AreaCodebottomSheetRef.current) {
            AreaCodebottomSheetRef.current.open();
        }
    };


    const STATE = [
        {
            id: 1,
            value: "Alaska",
        },
        {
            id: 2,
            value: "Arizona",
        },
        {
            id: 3,
            value: "Kansas",
        },
        {
            id: 4,
            value: "Hawaii",
        },
        {
            id: 5,
            value: "Indiana",
        },
    ];
    const CODE = [
        {
            id: 1,
            value: 480,
        },
        {
            id: 2,
            value: 520,
        },
        {
            id: 3,
            value: 602,
        },
        {
            id: 4,
            value: 623,
        },
        {
            id: 5,
            value: 928,
        },
    ];
    const PREFIX = [
        {
            id: 1,
            value: 888,
        },
        {
            id: 2,
            value: 877,
        },
        {
            id: 3,
            value: 866,
        },
        {
            id: 4,
            value: 855,
        },
        {
            id: 5,
            value: 844,
        },
        {
            id: 6,
            value: 833,
        },
        {
            id: 7,
            value: 800,
        },
    ]
    const NUMBERS = [
        {
            id: 1,
            value: "+1857865456",
            type: "Toll Free",
            state: "-",
            nrc: "3$",
            mrc: "5$"
        },
        {
            id: 2,
            value: "+1857865456",
            type: "Toll Free",
            state: "-",
            nrc: "3$",
            mrc: "5$"
        },
        {
            id: 3,
            value: "+1857865456",
            type: "Local",
            state: "IN",
            nrc: "3$",
            mrc: "5$"
        },
        {
            id: 4,
            value: "+1857865456",
            type: "Toll Free",
            state: "-",
            nrc: "3$",
            mrc: "5$"
        },
        {
            id: 5,
            value: "+1857865456",
            type: "Local",
            state: "IN",
            nrc: "3$",
            mrc: "5$"
        },
        {
            id: 6,
            value: "+1857865456",
            type: "Toll Free",
            state: "-",
            nrc: "3$",
            mrc: "5$"
        },
        {
            id: 7,
            value: "+1857865456",
            type: "Toll Free",
            state: "-",
            nrc: "3$",
            mrc: "5$"
        },
        {
            id: 8,
            value: "+1857865456",
            type: "Local",
            state: "IN",
            nrc: "3$",
            mrc: "5$"
        },
        {
            id: 9,
            value: "+1857865456",
            type: "Toll Free",
            state: "-",
            nrc: "3$",
            mrc: "5$"
        },
        {
            id: 10,
            value: "+1857865456",
            type: "Local",
            state: "IN",
            nrc: "3$",
            mrc: "5$"
        },
    ]


    const toggleSelection = (number) => {
        if (selectedNumbers.some((selected) => selected.id === number.id)) {
            setSelectedNumbers((prevSelected) =>
                prevSelected.filter((selected) => selected.id !== number.id)
            );
        } else {
            setSelectedNumbers((prevSelected) => [...prevSelected, number]);
        }
    };

    const removeSelectedNumber = (number) => {
        setSelectedNumbers((prevSelected) =>
            prevSelected.filter((selected) => selected.id !== number.id)
        );
    };

    const renderNumberItem = ({ item }) => {
        const isSelected = selectedNumbers.some((selected) => selected.id === item.id);

        return (
            <TouchableOpacity
                onPress={() => toggleSelection(item)}
                style={{
                    flex: 1,
                    margin: 8,
                    borderWidth: 1,
                    borderColor: isSelected ? "transparent" : grey,
                    backgroundColor: isSelected ? grey : 'white',
                    padding: 10,
                    borderRadius: 4,
                    alignItems: 'center',
                }}>
                <Text style={{
                    fontSize: FontSize.FS_12,
                    color: isSelected ? white : grey,
                    fontFamily: MEDIUM,
                }}>{item.value}</Text>
            </TouchableOpacity>
        );
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
                        title="Add New Inbound Numbers"
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                </View>

                {ActiveStep == 1 && (
                    <>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 20 }}>
                            <TouchableOpacity onPress={() => {
                                setIsTollFreeNumber(true)
                            }}
                                style={{
                                    backgroundColor: IsTollFreeNumber == true ? midGreen : bgColor01,
                                    paddingVertical: 10,
                                    borderWidth: 1.5,
                                    borderColor: midGreen,
                                    width: "45%",
                                    borderRadius: 4
                                }}>
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: IsTollFreeNumber == true ? white : midGreen,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    textAlign: "center"
                                }}>{"Toll Free"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setIsTollFreeNumber(false)
                            }}
                                style={{
                                    backgroundColor: IsTollFreeNumber !== true ? midGreen : bgColor01,
                                    paddingVertical: 10,
                                    borderWidth: 1.5,
                                    borderColor: midGreen,
                                    width: "45%",
                                    borderRadius: 4
                                }}>
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: IsTollFreeNumber !== true ? white : midGreen,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    textAlign: "center"
                                }}>{"Local Number"}</Text>
                            </TouchableOpacity>
                        </View>
                        {IsTollFreeNumber == true ?
                            <View style={{ marginHorizontal: 25 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    marginTop: 10
                                }}>{"Select Prefix"}</Text>
                                <TouchableOpacity onPress={() => {
                                    openPrefixBottomSheet()
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
                                    }}>{Prefix == null ? "Select Prifix" : Prefix?.value}</Text>
                                    <Icon name={"chevron-down"} size={22} color={grey} />

                                </TouchableOpacity>


                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    marginVertical: 12
                                }}>{"Select Numbers"}{` ( Prefix - ${Prefix == null ? "" : Prefix?.value} )`}</Text>
                                <FlatList
                                    data={NUMBERS}
                                    renderItem={renderNumberItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    numColumns={NUMBERS_PER_ROW}
                                />


                            </View>
                            :
                            <View style={{ marginHorizontal: 25 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    marginTop: 10
                                }}>{"Select State"}</Text>
                                <TouchableOpacity onPress={() => {
                                    openStateBottomSheet()
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
                                    }}>{State == null ? "Select State" : State?.value}</Text>
                                    <Icon name={"chevron-down"} size={22} color={grey} />

                                </TouchableOpacity>
                                {State !== null &&
                                    <>
                                        <Text style={{
                                            fontSize: FontSize.FS_13,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            marginTop: 10
                                        }}>{"Select Area Code"}</Text>
                                        <TouchableOpacity onPress={() => {
                                            openAreaCodeBottomSheet()
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
                                            }}>{AreaCode == null ? "Select Area" : AreaCode?.value}</Text>
                                            <Icon name={"chevron-down"} size={22} color={grey} />

                                        </TouchableOpacity></>
                                }
                                {IsTollFreeNumber == true ?
                                    null
                                    :
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginVertical: 12
                                    }}>{"Select Numbers"}{` ( ${State == null ? "" : State?.value} - ${AreaCode == null ? "" : AreaCode?.value} )`}</Text>
                                }
                                <FlatList
                                    data={NUMBERS}
                                    renderItem={renderNumberItem}
                                    keyExtractor={(item) => item.id.toString()}
                                    numColumns={NUMBERS_PER_ROW}
                                />


                            </View>
                        }
                        {selectedNumbers?.length > 0 &&
                            <View style={{ marginVertical: 20 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    marginTop: 10,
                                    marginHorizontal: 25
                                }}>{"Selected Numbers"}{`  ( ${selectedNumbers?.length} )  `}</Text>
                                <ScrollView style={{ marginHorizontal: -20, marginVertical: 14 }} horizontal={true}>
                                    <View >
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
                                            <Text style={[styles.TableHaderText, {
                                                width: 140, textAlign: "center",
                                            }]}>NUMBER</Text>
                                            <Text style={[styles.TableHaderText, {
                                                width: 90, textAlign: "center",
                                            }]}>TYPE</Text>
                                            <Text style={[styles.TableHaderText, {
                                                width: 115, textAlign: "center",
                                            }]}>STATE</Text>
                                            <Text style={[styles.TableHaderText, {
                                                width: 100, textAlign: "center",
                                            }]}>{"SETUP \n(*NRC)"}</Text>
                                            <Text style={[styles.TableHaderText, {
                                                width: 100, textAlign: "center",
                                            }]}>{"MONTHLY \n(**MRC)"}</Text>
                                            <Text style={[styles.TableHaderText, {
                                                width: 120, textAlign: "center",
                                            }]}>{"ACTION"}</Text>

                                        </View>
                                        <FlatList
                                            style={{ width: '100%', backgroundColor: white }}
                                            data={selectedNumbers}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item, drag, isActive, index }) => {
                                                return (
                                                    <View
                                                        style={[
                                                            styles.rowItem,
                                                            {
                                                                backgroundColor: bgColor01,
                                                                flexDirection: "row", alignItems: "center",
                                                                padding: 6,
                                                                marginVertical: 2,
                                                            },
                                                        ]}
                                                    >
                                                        <Text style={[styles.TableRowText, {
                                                            width: 140, textAlign: "center",
                                                        }]}>{item.value}</Text>
                                                        <Text style={[styles.TableRowText, {
                                                            width: 90, textAlign: "center",
                                                        }]}>{item.type}</Text>
                                                        <Text style={[styles.TableRowText, {
                                                            width: 115, textAlign: "center",
                                                        }]}>{item.state}</Text>
                                                        <Text style={[styles.TableRowText, {
                                                            width: 100, textAlign: "center",
                                                        }]}>{item.nrc}</Text>
                                                        <Text style={[styles.TableRowText, {
                                                            width: 100, textAlign: "center",
                                                        }]}>{item.mrc}</Text>
                                                        <View style={{ width: 120, alignItems: "center", }}>
                                                            <TouchableOpacity style={{
                                                                backgroundColor: red,
                                                                borderRadius: 4,
                                                                height: 30,
                                                                width: 30,
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                                onPress={() => {
                                                                    removeSelectedNumber(item)
                                                                }}>
                                                                <Icon name="trash-can" size={19} color={white} />

                                                            </TouchableOpacity>
                                                        </View>

                                                    </View>
                                                );
                                            }}

                                        />
                                    </View>
                                </ScrollView>
                                <TouchableOpacity onPress={() => {
                                    setActiveStep(2)
                                }}
                                    style={{
                                        backgroundColor: greenPrimary,
                                        alignItems: "center",
                                        paddingVertical: 10,
                                        margin: 25,
                                        justifyContent: "center",
                                        borderRadius: 4
                                    }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_14,
                                        color: white,
                                        fontFamily: SEMIBOLD,
                                        lineHeight: 24,
                                        marginLeft: 10
                                    }}>{"Confirm and Buy"}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </>
                )}

                {ActiveStep == 2 && (
                    <>
                        <View style={{ marginHorizontal: 25, marginVertical: 20 }}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: MEDIUM,
                                lineHeight: 22
                            }}>{"Local Number : "}<Text style={{ fontFamily: MEDIUM, }}>{"2"}</Text></Text>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: MEDIUM,
                                lineHeight: 22
                            }}>{"Toll Free : "}<Text style={{ fontFamily: SEMIBOLD, }}>{"1"}</Text></Text>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: MEDIUM,
                                lineHeight: 22
                            }}>{"Total Numbers : "}<Text style={{ fontFamily: SEMIBOLD, }}>{"3"}</Text></Text>
                            {selectedNumbers?.length > 0 &&
                                <View style={{ marginVertical: 20 }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_13,
                                        color: black,
                                        fontFamily: SEMIBOLD,
                                        marginTop: 10,
                                    }}>{"Selected Numbers"}{`  ( ${selectedNumbers?.length} )  `}</Text>
                                    <ScrollView style={{ marginHorizontal: -20, marginVertical: 14 }} horizontal={true}>
                                        <View >
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
                                                <Text style={[styles.TableHaderText, {
                                                    width: 140, textAlign: "center",
                                                }]}>NUMBER</Text>
                                                <Text style={[styles.TableHaderText, {
                                                    width: 90, textAlign: "center",
                                                }]}>TYPE</Text>
                                                <Text style={[styles.TableHaderText, {
                                                    width: 115, textAlign: "center",
                                                }]}>STATE</Text>
                                                <Text style={[styles.TableHaderText, {
                                                    width: 100, textAlign: "center",
                                                }]}>{"SETUP \n(*NRC)"}</Text>
                                                <Text style={[styles.TableHaderText, {
                                                    width: 100, textAlign: "center",
                                                }]}>{"MONTHLY \n(**MRC)"}</Text>
                                                {/* <Text style={[styles.TableHaderText, {
                                                    width: 120, textAlign: "center",
                                                }]}>{"ACTION"}</Text> */}

                                            </View>
                                            <FlatList
                                                style={{ width: '100%', backgroundColor: white }}
                                                data={selectedNumbers}
                                                keyExtractor={(item) => item.id}
                                                renderItem={({ item, drag, isActive, index }) => {
                                                    return (
                                                        <View
                                                            style={[
                                                                styles.rowItem,
                                                                {
                                                                    backgroundColor: bgColor01,
                                                                    flexDirection: "row", alignItems: "center",
                                                                    padding: 6,
                                                                    marginVertical: 2,
                                                                },
                                                            ]}
                                                        >
                                                            <Text style={[styles.TableRowText, {
                                                                width: 140, textAlign: "center",
                                                            }]}>{item.value}</Text>
                                                            <Text style={[styles.TableRowText, {
                                                                width: 90, textAlign: "center",
                                                            }]}>{item.type}</Text>
                                                            <Text style={[styles.TableRowText, {
                                                                width: 115, textAlign: "center",
                                                            }]}>{item.state}</Text>
                                                            <Text style={[styles.TableRowText, {
                                                                width: 100, textAlign: "center",
                                                            }]}>{item.nrc}</Text>
                                                            <Text style={[styles.TableRowText, {
                                                                width: 100, textAlign: "center",
                                                            }]}>{item.mrc}</Text>
                                                            {/* <View style={{ width: 120, alignItems: "center", }}>
                                                                <TouchableOpacity style={{
                                                                    backgroundColor: red,
                                                                    borderRadius: 4,
                                                                    height: 30,
                                                                    width: 30,
                                                                    alignItems: "center",
                                                                    justifyContent: "center"
                                                                }}
                                                                    onPress={() => {
                                                                        removeSelectedNumber(item)
                                                                    }}>
                                                                    <Icon name="trash-can" size={19} color={white} />

                                                                </TouchableOpacity>
                                                            </View> */}

                                                        </View>
                                                    );
                                                }}

                                            />
                                        </View>
                                    </ScrollView>
                                    <View>
                                        <View style={{ backgroundColor: light_grey, paddingHorizontal: 10, paddingVertical: 20 }}>
                                            <Text style={{
                                                fontSize: FontSize.FS_14,
                                                color: black,
                                                fontFamily: SEMIBOLD,
                                                lineHeight: 24,
                                                marginLeft: 10,
                                                textAlign: "center",
                                                textDecorationLine: "underline"
                                            }}>{"Annual"}</Text>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 35, marginTop: 20 }}>

                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{
                                                        fontSize: FontSize.FS_14,
                                                        color: black,
                                                        fontFamily: MEDIUM,
                                                        lineHeight: 24,
                                                    }}>{"2 DID's"}</Text>
                                                    <View style={{ marginHorizontal: 6 }}>
                                                        <Icon name="close" size={18} color={black} />
                                                    </View>
                                                    <Text style={{
                                                        fontSize: FontSize.FS_14,
                                                        color: black,
                                                        fontFamily: MEDIUM,
                                                        lineHeight: 24,
                                                    }}>{"$3 setup"}</Text>
                                                </View>
                                                <Text style={{
                                                    fontSize: FontSize.FS_14,
                                                    color: black,
                                                    fontFamily: MEDIUM,
                                                    lineHeight: 24,
                                                }}>{"$ 6"}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 35, marginTop: 8 }}>

                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{
                                                        fontSize: FontSize.FS_14,
                                                        color: black,
                                                        fontFamily: MEDIUM,
                                                        lineHeight: 24,
                                                    }}>{"2 DID's"}</Text>
                                                    <View style={{ marginHorizontal: 6 }}>
                                                        <Icon name="close" size={18} color={black} />
                                                    </View>
                                                    <Text style={{
                                                        fontSize: FontSize.FS_14,
                                                        color: black,
                                                        fontFamily: MEDIUM,
                                                        lineHeight: 24,
                                                    }}>{"$5 setup"}</Text>
                                                </View>
                                                <Text style={{
                                                    fontSize: FontSize.FS_14,
                                                    color: black,
                                                    fontFamily: MEDIUM,
                                                    lineHeight: 24,
                                                }}>{"$ 10"}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 35, marginTop: 8 }}>

                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{
                                                        fontSize: FontSize.FS_14,
                                                        color: black,
                                                        fontFamily: MEDIUM,
                                                        lineHeight: 24,
                                                    }}>{"$ 10"}</Text>
                                                    <View style={{ marginHorizontal: 6 }}>
                                                        <Icon name="close" size={18} color={black} />
                                                    </View>
                                                    <Text style={{
                                                        fontSize: FontSize.FS_14,
                                                        color: black,
                                                        fontFamily: MEDIUM,
                                                        lineHeight: 24,
                                                    }}>{"12 Months"}</Text>
                                                </View>
                                                <Text style={{
                                                    fontSize: FontSize.FS_14,
                                                    color: black,
                                                    fontFamily: MEDIUM,
                                                    lineHeight: 24,
                                                }}>{"$ 120"}</Text>
                                            </View>
                                            <View style={{ height: 1, backgroundColor: grey, width: "100%", marginTop: 25 }}></View>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 35, marginTop: 8, marginBottom: 40 }}>
                                                <Text style={{
                                                    fontSize: FontSize.FS_14,
                                                    color: black,
                                                    fontFamily: MEDIUM,
                                                    lineHeight: 24,
                                                }}>{"Total:"}</Text>
                                                <Text style={{
                                                    fontSize: FontSize.FS_14,
                                                    color: black,
                                                    fontFamily: MEDIUM,
                                                    lineHeight: 24,
                                                }}>{"$126(USD)"}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 14 }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                            lineHeight: 24,
                                            marginLeft: 10
                                        }}>{"*Non-Recurring Charge"}</Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: grey,
                                            fontFamily: MEDIUM,
                                            lineHeight: 24,
                                            marginLeft: 10
                                        }}>{"*Monthly Recurring Charge"}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 20 }}>
                                        <TouchableOpacity onPress={() => {
                                            setActiveStep(1)
                                        }}
                                            style={{
                                                backgroundColor: grey,
                                                alignItems: "center",
                                                paddingVertical: 10,
                                                justifyContent: "center",
                                                borderRadius: 4,
                                                width: "45%"
                                            }}>
                                            <Text style={{
                                                fontSize: FontSize.FS_14,
                                                color: white,
                                                fontFamily: SEMIBOLD,
                                                lineHeight: 24,
                                                marginLeft: 10
                                            }}>{"Select More"}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setTermConditionModel(!TermConditionModel);
                                        }}
                                            style={{
                                                backgroundColor: greenPrimary,
                                                alignItems: "center",
                                                paddingVertical: 10,
                                                justifyContent: "center",
                                                borderRadius: 4,
                                                width: "45%"
                                            }}>
                                            <Text style={{
                                                fontSize: FontSize.FS_14,
                                                color: white,
                                                fontFamily: SEMIBOLD,
                                                lineHeight: 24,
                                                marginLeft: 10
                                            }}>{"Buy"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </View>
                    </>

                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={TermConditionModel}
                    onRequestClose={() => {
                        setTermConditionModel(!TermConditionModel);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_16,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    textAlign: "center",
                                    flex: 1
                                }}>{"Term & Conditions"}</Text>
                                <TouchableOpacity style={{}}
                                    onPress={() => setTermConditionModel(!TermConditionModel)}>
                                    <Icon name={"close"} size={24} color={black} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ backgroundColor: bgColor01, borderRadius: 4 }}>
                                    <View style={{
                                        backgroundColor: grey,
                                        paddingVertical: 8,
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4
                                    }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_13,
                                            color: white,
                                            fontFamily: SEMIBOLD,
                                            marginLeft: 14
                                        }}>{"Phone Number Details"}</Text>
                                    </View>
                                    <View style={{ marginHorizontal: 14, marginVertical: 10 }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            lineHeight: 24
                                        }}>{"Phone number type : "}<Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>{"GEOGRAPHIC"}</Text></Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            lineHeight: 24
                                        }}>{"Country : "}<Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>{"U.S.A"}</Text></Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            lineHeight: 24
                                        }}>{"City : "}<Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>{"U.S.A"}</Text></Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            lineHeight: 24
                                        }}>{"Area Code : "}<Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>{"855"}</Text></Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            lineHeight: 24
                                        }}>{"Setup Fee : "}<Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>{"$3.00 per number"}</Text></Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            lineHeight: 24
                                        }}>{"Monthly Price : "}<Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>{"$5.00 per number"}</Text></Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            lineHeight: 24
                                        }}>{"Billing schedule : "}<Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>{"15th of the calendar month (GMT Timezone)"}</Text></Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            lineHeight: 24
                                        }}>{"Phone Numbers : "}<Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>{"8553940597,8554920577"}</Text></Text>
                                    </View>
                                </View>
                                <View style={{ backgroundColor: bgColor01, borderRadius: 4, marginTop: 14 }}>
                                    <View style={{
                                        backgroundColor: grey,
                                        paddingVertical: 8,
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4
                                    }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_13,
                                            color: white,
                                            fontFamily: SEMIBOLD,
                                            marginLeft: 14
                                        }}>{"Important Notes For U.S.A"}</Text>
                                    </View>
                                    <View style={{ marginHorizontal: 14, marginVertical: 10 }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                            lineHeight: 24
                                        }}>{"* Toll Free phone numbers are reachable \n   from the US (mainland only.)"}</Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                            lineHeight: 24
                                        }}>{"* Toll Free phone numbers are reachable \n   from fix, mobile and payphones."}</Text>
                                    </View>
                                </View>
                                <View style={{ backgroundColor: bgColor01, borderRadius: 4, marginTop: 14 }}>
                                    <View style={{
                                        backgroundColor: grey,
                                        paddingVertical: 8,
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4
                                    }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_13,
                                            color: white,
                                            fontFamily: SEMIBOLD,
                                            marginLeft: 14
                                        }}>{"Important Notice"}</Text>
                                    </View>
                                    <View style={{ marginHorizontal: 14, marginVertical: 10 }}>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                            lineHeight: 24
                                        }}>{"Phone Number is offered on a fully pre-paid basis."}</Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: black,
                                            fontFamily: SEMIBOLD,
                                            marginTop: 10
                                        }}>{"IMPORTANT! The minimum service term for a \nphone number is 3 months. When the order \nis placed you will be charged the setup \nfee and the monthly subscription for\n 3 months."}</Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                            lineHeight: 20,
                                            marginTop: 10
                                        }}>{"Phone number subscription payment \nis non-refundable."}</Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                            lineHeight: 20,
                                            marginTop: 10
                                        }}>{"Phone Number subscriptions are automatically \nrenewed and amount equal to MONTHLY PRICE \nwill be deducted from your prepaid account \nbalance."}</Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                            lineHeight: 20,
                                            marginTop: 10
                                        }}>{"When subscription expires it will be \nauto-extended by 1 month and $5.00 per DID \nwill be charged to the card on file for your \naccount."}</Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                            lineHeight: 24,
                                            lineHeight: 20,
                                            marginTop: 10
                                        }}>{"Please refer to"}<Text onPress={() => {
                                            Linking.openURL("https://voice.anveo.com/legal.asp")
                                        }}
                                            style={{ color: greenPrimary, fontFamily: SEMIBOLD, }}>{" Terms of use"}<Text style={{ color: black, fontFamily: MEDIUM, }}>{" for more details."}</Text></Text></Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 20 }}>
                                        <TouchableOpacity onPress={() => {
                                            setTermConditionModel(false)
                                        }}
                                            style={{
                                                backgroundColor: grey,
                                                alignItems: "center",
                                                paddingVertical: 6,
                                                justifyContent: "center",
                                                borderRadius: 4,
                                                width: "44%"
                                            }}>
                                            <Text style={{
                                                fontSize: FontSize.FS_12,
                                                color: white,
                                                fontFamily: SEMIBOLD,
                                                lineHeight: 24,
                                                marginLeft: 10
                                            }}>{"Close"}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            // setTermConditionModel(!TermConditionModel);
                                        }}
                                            style={{
                                                backgroundColor: greenPrimary,
                                                alignItems: "center",
                                                paddingVertical: 6,
                                                justifyContent: "center",
                                                borderRadius: 4,
                                                width: "44%"
                                            }}>
                                            <Text style={{
                                                fontSize: FontSize.FS_12,
                                                color: white,
                                                fontFamily: SEMIBOLD,
                                                lineHeight: 24,
                                                marginLeft: 10
                                            }}>{"Place Order"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>

                        </View>
                    </View>
                </Modal>
                <SelectionBottomSheet Name={STATE} bottomSheetRef={StatebottomSheetRef} selectedValue={(data) => {
                    setState(data)
                }} />
                <SelectionBottomSheet Name={CODE} bottomSheetRef={AreaCodebottomSheetRef} selectedValue={(data) => {
                    setAreaCode(data)
                }} />
                <SelectionBottomSheet Name={PREFIX} bottomSheetRef={PrefixbottomSheetRef} selectedValue={(data) => {
                    setPrefix(data)
                }} />


            </HeaderView>
            {/* {isLoading && <LoadingView />} */}
        </>
    );
};

export default AddNewInboundNumber;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: black05
    },
    modalView: {
        height: HEIGHT - 150,
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
    TableRowText: {
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: MEDIUM,
    },
    TableHaderText: {
        fontSize: FontSize.FS_12,
        color: white,
        fontFamily: SEMIBOLD,
    },
});
