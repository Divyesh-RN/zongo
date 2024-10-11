
import { FlatList, StyleSheet, TouchableOpacity, Text, View, ScrollView, Alert } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { black, white } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MEDIUM } from '@constants/Fonts';
import { black05, greenPrimary, grey } from '@constants/Color';
import { bgColor01 } from '../../constants/Color';
import { HEIGHT, STATUS_FULFILLED, STATUS_REJECTED, WIDTH } from '../../constants/ConstantKey';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet from '../DashBoardScreen/InboundNumbers/components/BottomSheet';
import PrefixBottomSheet from '../DashBoardScreen/InboundNumbers/components/PrefixBottomSheet';
import { resetInboundApiStatus } from '../../redux/reducers/inboundReducer';
import { resetGeneralApiStatus } from '../../redux/reducers/generalReducer';
import { Log } from '../../commonComponents/Log';
import { Get_Area_Code_By_State, Get_Number, Get_Prefix, Get_States } from '../../redux/api/Api';

const BuyDid = ({ selected_did }) => {

    const [IsTollFreeNumber, setIsTollFreeNumber] = useState(false);
    const [ActiveStep, setActiveStep] = useState(1);
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [NumberList, setNumberList] = useState(null);

    const [Prefix, setPrefix] = useState(null);
    const [State, setState] = useState(null);
    const [AreaCode, setAreaCode] = useState(null);
    const NUMBERS_PER_ROW = 3;

    var dispatch = useDispatch()

    const isError = useSelector(state => state.inboundRedux.isError);
    const error_message = useSelector(state => state.inboundRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    const apiGetPrefix = useSelector(state => state.inboundRedux.apiGetPrefix);
    const prefix_list = useSelector(state => state.inboundRedux.prefix_list);

    const apiGetNumberList = useSelector(state => state.inboundRedux.apiGetNumberList);
    const number_list = useSelector(state => state.inboundRedux.number_list);

    const apiGetAreaCodeByState = useSelector(state => state.generalRedux.apiGetAreaCodeByState);
    const area_code = useSelector(state => state.generalRedux.area_code);

    const apiGetStates = useSelector(state => state.generalRedux.apiGetStates);
    const state = useSelector(state => state.generalRedux.state);

    const PrefixbottomSheetRef = useRef(null);
    const StatebottomSheetRef = useRef(null);
    const AreaCodebottomSheetRef = useRef(null);

    const GetPrefix = () => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
        };
        dispatch(Get_Prefix(dict));
    }

    useFocusEffect(
        useCallback(() => {
            // GetPrefix()
            GetState()
            return () => {
                dispatch(resetInboundApiStatus());
                dispatch(resetGeneralApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiGetPrefix :', apiGetPrefix);
        if (apiGetPrefix == STATUS_FULFILLED) {
            if (prefix_list !== null) {
                setPrefix(prefix_list[0])
                GetFreeNumberList(prefix_list[0])
            }
        } else if (apiGetPrefix == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetPrefix]);

    const GetFreeNumberList = (prefix) => {
        var dict = {
            area_code: "",
            createdby: user_data?.data?.user_uuid,
            limit: "21",
            locality: "",
            main_admin_uuid: user_data?.data?.main_uuid,
            number_type: "toll-free",
            prefix: prefix?.prefix,
            prefix_arr: [prefix?.prefix],
            user_uuid: user_data?.data?.user_uuid,

        };
        dispatch(Get_Number(dict));
    }
    const GetPaidNumberList = (area) => {
        var dict = {
            area_code: area?.area_code,
            area_code_arr: [area?.area_code],
            createdby: user_data?.data?.user_uuid,
            limit: "21",
            locality: "",
            main_admin_uuid: user_data?.data?.main_uuid,
            number_type: "",
            prefix: "",
            set_arr_state: [State?.uuid],
            state_name: State?.state_name,
            state_uuid: State?.uuid,
            user_uuid: user_data?.data?.user_uuid,

        };
        dispatch(Get_Number(dict));
    }

    useEffect(() => {
        Log('apiGetNumberList :', apiGetNumberList);
        if (apiGetNumberList == STATUS_FULFILLED) {
            if (number_list !== null) {
                setNumberList(number_list);
            }
        } else if (apiGetNumberList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetNumberList]);

    const GetState = () => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
        };
        dispatch(Get_States(dict));
    }

    useEffect(() => {
        Log('apiGetStates :', apiGetStates);
        if (apiGetStates == STATUS_FULFILLED) {
            Log("state :", state)
            setState(state[0]);
            GetAreaCodeByState(state[0])
        } else if (apiGetStates == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetStates]);

    const GetAreaCodeByState = (state) => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
            state_uuid: state?.uuid
        }
        dispatch(Get_Area_Code_By_State(dict))
    }

    useEffect(() => {
        Log('apiGetAreaCodeByState :', apiGetAreaCodeByState);
        if (apiGetAreaCodeByState == STATUS_FULFILLED) {
            Log("area_code :", area_code)
            setAreaCode(area_code[0])
            if (IsTollFreeNumber == false) {
                GetPaidNumberList(area_code[0])
            }
        } else if (apiGetAreaCodeByState == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetAreaCodeByState]);

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

    const toggleSelection = (number) => {
        setSelectedNumbers([number]);
        selected_did([number])
    };
    const renderNumberItem = ({ item }) => {
        const isSelected = selectedNumbers.length > 0 && selectedNumbers[0].phone_number === item.phone_number;

        return (
            <TouchableOpacity
                onPress={() => toggleSelection(item)}
                style={{
                    flex: 1,
                    margin: 8,
                    borderWidth: 1,
                    borderColor: isSelected ? "transparent" : black,
                    backgroundColor: isSelected ? grey : 'white',
                    paddingVertical: 6,
                    paddingHorizontal: 6,
                    borderRadius: 4,
                    alignItems: 'center',
                }}>
                <Text style={{
                    fontSize: FontSize.FS_11,
                    color: isSelected ? white : black,
                    fontFamily: MEDIUM,
                }}>{item.phone_number}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <>
            {ActiveStep == 1 && (
                <>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 0, marginTop: 8 }}>
                        {/* <TouchableOpacity onPress={() => {
                            setIsTollFreeNumber(true)
                            GetPrefix()
                        }}
                            style={{
                                backgroundColor: IsTollFreeNumber == true ? greenPrimary : white,
                                paddingVertical: 4,
                                borderWidth: 1.5,
                                borderColor: greenPrimary,
                                width: "45%",
                                borderRadius: 4
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: IsTollFreeNumber == true ? white : greenPrimary,
                                fontFamily: SEMIBOLD,
                                lineHeight: 24,
                                textAlign: "center"
                            }}>{"Toll Free"}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity activeOpacity={0.9} onPress={() => {
                            // setIsTollFreeNumber(false)
                            // GetPaidNumberList(AreaCode)

                        }}
                            style={{
                                backgroundColor: IsTollFreeNumber !== true ? greenPrimary : white,
                                paddingVertical: 4,
                                borderWidth: 1.5,
                                borderColor: greenPrimary,
                                width: "100%",
                                borderRadius: 4
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: IsTollFreeNumber !== true ? white : greenPrimary,
                                fontFamily: SEMIBOLD,
                                lineHeight: 24,
                                textAlign: "center"
                            }}>{"Local Number"}</Text>
                        </TouchableOpacity>
                    </View>
                    {IsTollFreeNumber == true ?
                        <View style={{ marginHorizontal: 0 }}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 20
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
                                }}>{Prefix == null ? "Select Prifix" : Prefix?.prefix}</Text>
                                <Icon name={"chevron-down"} size={22} color={grey} />

                            </TouchableOpacity>


                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginVertical: 12
                            }}>{"Select Number"}{` ( Prefix - ${Prefix == null ? "" : Prefix?.prefix} )`}</Text>
                            <FlatList
                                data={NumberList}
                                renderItem={renderNumberItem}
                                keyExtractor={(item) => item.phone_number}
                                numColumns={NUMBERS_PER_ROW}
                            />


                        </View>
                        :
                        <View style={{ marginHorizontal: 0 }}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginTop: 20
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
                                }}>{State == null ? "Select State" : State?.state_name}</Text>
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
                                        }}>{AreaCode == null ? "Select Area" : AreaCode?.area_code}</Text>
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
                                }}>{"Select Number"}{` ( ${State == null ? "" : State?.state_name} - ${AreaCode == null ? "" : AreaCode?.area_code} )`}</Text>
                            }
                            <FlatList
                                data={NumberList}
                                renderItem={renderNumberItem}
                                keyExtractor={(item) => item.phone_number}
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
                            }}>{"Selected Number"}</Text>
                            <ScrollView style={{ marginHorizontal: -20, marginVertical: 14 }} horizontal={true}>
                                <View >
                                    <View style={[
                                        styles.rowItem,
                                        {
                                            backgroundColor: greenPrimary,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 6,
                                            paddingVertical: 14,
                                            marginTop: 5,
                                        },
                                    ]}>
                                        <Text style={[styles.TableHaderText, {
                                            width: WIDTH/3, textAlign: "center",
                                        }]}>NUMBER</Text>
                                        <Text style={[styles.TableHaderText, {
                                            width: WIDTH/3, textAlign: "center",
                                        }]}>TYPE</Text>
                                        <Text style={[styles.TableHaderText, {
                                            width: WIDTH/3, textAlign: "center",
                                        }]}>STATE</Text>
                                    </View>
                                    <FlatList
                                        style={{ width: '100%', backgroundColor: white }}
                                        data={selectedNumbers}
                                        keyExtractor={(item) => item.phone_number}
                                        renderItem={({ item, drag, isActive, index }) => {
                                            return (
                                                <View
                                                    style={[
                                                        styles.rowItem,
                                                        {
                                                            backgroundColor: bgColor01,
                                                            flexDirection: "row", alignItems: "center",
                                                            paddingHorizontal: 6,
                                                            paddingVertical: 14,
                                                            marginVertical: 2,
                                                        },
                                                    ]}
                                                >
                                                    <Text style={[styles.TableRowText, {
                                                        width: WIDTH/3, textAlign: "center",
                                                    }]}>{item.phone_number}</Text>
                                                    <Text style={[styles.TableRowText, {
                                                        width: WIDTH/3, textAlign: "center",
                                                    }]}>{item.phone_number_type == "toll_free" ? "Toll Free" : "Local"}</Text>
                                                    <Text style={[styles.TableRowText, {
                                                        width: WIDTH/3, textAlign: "center",
                                                    }]}>{item.phone_number_type == "toll_free" ? "-" : item?.region_information[0]?.region_name}</Text>
                                                </View>
                                            );
                                        }}

                                    />
                                </View>
                            </ScrollView>
                        </View>
                    }
                </>
            )}

            <BottomSheet
                type={"area_code"}
                title={"Select Area Code"}
                Data={area_code}
                selected={AreaCode}
                bottomSheetRef={AreaCodebottomSheetRef}
                selectedValue={(data) => {
                    setAreaCode(data)
                    GetPaidNumberList(data)
                }} />
            <BottomSheet
                type={"state"}
                title={"Select State"}
                Data={state}
                selected={State}
                bottomSheetRef={StatebottomSheetRef}
                selectedValue={(data) => {
                    setState(data)
                    GetAreaCodeByState(data)
                }} />
            <PrefixBottomSheet Name={prefix_list} bottomSheetRef={PrefixbottomSheetRef} selectedId={Prefix} selectedValue={(data) => {
                setPrefix(data)
                GetFreeNumberList(data)
            }} />
        </>
    );
};

export default BuyDid;

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
