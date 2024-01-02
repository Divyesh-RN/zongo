import { View, Text, TouchableOpacity, StyleSheet, Alert, LayoutAnimation, UIManager, Platform } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import HeaderView from '../../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { black, darkGrey, greenPrimary, grey, light_grey, midGreen, white, yellow } from '../../../constants/Color';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { goBack, navigate } from '../../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { FCM_TOKEN, STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import { Get_Local_Extension } from '../../../redux/api/Api';
import LoadingView from '../../../commonComponents/LoadingView';
import { getData } from '../../../commonComponents/AsyncManager';
import { resetApiStatus } from '../../../redux/reducers/callReducer';
import { useFocusEffect } from '@react-navigation/native';

const ExpandableComponent = ({ item, onClickFunction }) => {
    const [layoutHeight, setLayoutHeight] = useState(0);

    useEffect(() => {
        if (item.isExpanded) {
            setLayoutHeight(null);
        } else {
            setLayoutHeight(0);
        }
    }, [item.isExpanded]);

    const GetName = (name) => {
        const words = name.split(" ");
        let initials = "";
        words.forEach(word => {
            if (word.length > 0) {
                initials += word[0].toUpperCase();
            }
        });
        return initials;
    }

    const getRandomColor = () => {
        const colors = ['#ADD8E6', '#90EE90', '#FFB6C1', '#E6E6FA'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    return (
        <View style={[
            styles.expandableView,
            item?.isExpanded && styles.expandedView,
        ]}>
            <TouchableOpacity onPress={onClickFunction}
                style={{
                    // backgroundColor: white,
                    paddingTop: 10,
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            borderRadius: 50,
                            backgroundColor: getRandomColor(),
                            width: 35,
                            height: 35,
                            alignItems: "center",
                            justifyContent: "center"

                        }}>
                        <Text style={{ fontSize: 14, color: white, fontFamily: SEMIBOLD, marginLeft: 2 }}>{GetName(item.extension)} </Text>
                    </TouchableOpacity>
                    <View style={{
                        marginLeft: 14,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: 1
                    }}>
                        <Text style={{
                            fontSize: FontSize.FS_14,
                            color: black,
                            fontFamily: MEDIUM,
                            lineHeight: 24,
                        }}>{item?.extension}</Text>
                          <View style={{ alignItems: "center" }}>
                    <Icon name={item?.isExpanded ? "chevron-down" : "chevron-right"} size={24} color={black} />
                </View>
                    </View>
                </View>
            </TouchableOpacity>
            <View
                style={{
                    height: layoutHeight,
                    overflow: 'hidden',
                }}>
                <View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{
                            fontSize: FontSize.FS_10,
                            color: black,
                            fontFamily: MEDIUM,
                            lineHeight: 24,
                            marginLeft: 70
                        }}>Name {item?.username}</Text>

                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginHorizontal: 40, marginVertical: 14 }}>
                        <TouchableOpacity onPress={() => {
                            navigate("CallScreen", { item: item, from: "CALLS" })
                        }}
                            style={{ width: 37, height: 37, backgroundColor: greenPrimary, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                            <Icon name="phone" size={22} color={white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            // navigate("ChatScreen",{to_number:item?.work_contact_number,to_name :item?.first_name +" " + item?.last_name})
                        }}
                            style={{ width: 37, height: 37, backgroundColor: "#228aea", borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
                            <Icon name="chat" size={22} color={white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 37, height: 37, backgroundColor: greenPrimary, borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
                            <Icon name="video" size={24} color={white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                             navigate("EditExtension", { isEdit: true,item: item});

                        }}
                            style={{ width: 37, height: 37, backgroundColor: yellow, borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
                            <Icon name="pencil" size={22} color={white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            navigate("ContactInfo", { item: item, from: "CALLS" })

                        }}
                            style={{ width: 37, height: 37, backgroundColor: grey, borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
                            <Icon name="information" size={22} color={white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const Call = ({ navigation }) => {

    const [CallData, setCallsData] = useState(null);
    const [FcmToken, setFcmToken] = useState(null);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);

    const dispatch = useDispatch();

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const apiGetCallList = useSelector(state => state.callRedux.apiGetCallList);
    const isLoading = useSelector(state => state.callRedux.isLoader);
    const isError = useSelector(state => state.callRedux.isError);
    const error_message = useSelector(state => state.callRedux.error_message);
    const calls_data = useSelector(state => state.callRedux.calls_data);
    const user_data = useSelector(state => state.userRedux.user_data);

    useEffect(() => {
        getData(FCM_TOKEN, data => {
            Log('FCM_TOKEN Call: ', data);
            setFcmToken(data)
        });
        return () => {
            dispatch(resetApiStatus());
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            var dict = {};
            dict.user_type = "admin",
                dict.group_per = "all",
                dict.group_uuid = "",
                dict.role = "admin",
                dict.permission = "all",
                dict.role_uuid = user_data?.data?.role_uuid,
                dict.search = "",
                dict.off_set = 0,
                dict.limits = "show_all",
                dict.orderby = "e.extension ASC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid
            // return
            dispatch(Get_Local_Extension(dict))
         
        }, [])
      );

    useEffect(() => {
        Log('apiGetCallList :', apiGetCallList);
        if (apiGetCallList == STATUS_FULFILLED) {
            // console.log("calls_data", calls_data)
            if (calls_data !== null) {
                const initialListDataSource = calls_data.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setCallsData(initialListDataSource)
                setListDataSource(initialListDataSource)
            }
        } else if (apiGetCallList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetCallList]);

    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...listDataSource];
        if (multiSelect) {
            // If multiple select is enabled
            array[index]['isExpanded'] = !array[index]['isExpanded'];
        } else {
            // If single select is enabled
            array.map((value, placeindex) =>
                placeindex === index
                    ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
                    : (array[placeindex]['isExpanded'] = false)
            );
        }
        setListDataSource(array);
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
                    paddingHorizontal: pixelSizeHorizontal(-20),
                }}>
                <View style={{ marginHorizontal: 20 }}>
                    <HeaderBackView
                        title="Call"
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                </View>
                {
                    listDataSource !== null &&
                    <>
                        {listDataSource.map((item, key) => (
                            <ExpandableComponent
                                key={Math.random()}
                                onClickFunction={() => {
                                    updateLayout(key);
                                }}
                                item={item}
                            />
                        ))}
                    </>
                }
                 <TouchableOpacity onPress={() => {
                    navigate("EditExtension", { isEdit: false })
                }}
                    style={{
                        backgroundColor: midGreen,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 20,
                        justifyContent: "center",
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                    }}>
                    <Icon name="plus" size={25} color={white} />
                    <Text style={{
                        fontSize: FontSize.FS_13,
                        color: white,
                        fontFamily: SEMIBOLD,
                        lineHeight: 24,
                        marginLeft: 10
                    }}>{"Add Extension"}</Text>
                </TouchableOpacity>
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default Call;

const styles = StyleSheet.create({
    expandableView: {
        // backgroundColor: white,
        borderBottomColor: light_grey,
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    expandedView: {
        borderBottomWidth: 1,
        borderBottomColor: light_grey,
    },
});
