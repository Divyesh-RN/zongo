import { View, Text, TouchableOpacity, StyleSheet, Alert, LayoutAnimation, UIManager, Platform, PermissionsAndroid } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import HeaderView from '../../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import CustomBottomSheet from '../../../commonComponents/CustomBottomSheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { black, greenPrimary, grey, light_grey, red, white } from '../../../constants/Color';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { goBack, navigate } from '../../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { resetApiStatus } from '../../../redux/reducers/contactReducer';
import { FCM_TOKEN, STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import { Get_Contacts_List } from '../../../redux/api/Api';
import LoadingView from '../../../commonComponents/LoadingView';
import { getData } from '../../../commonComponents/AsyncManager';

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
                        <Text style={{ fontSize: 14, color: white, fontFamily: SEMIBOLD, marginLeft: 2 }}>{GetName(item.first_name)} </Text>
                    </TouchableOpacity>
                    <View style={{ marginLeft: 14, }}>
                        <Text style={{
                            fontSize: FontSize.FS_14,
                            color: black,
                            fontFamily: REGULAR,
                            lineHeight: 24
                        }}>{item?.first_name}  {item?.last_name}</Text>

                    </View>
                </View>
            </TouchableOpacity>
            <View
                style={{
                    height: layoutHeight,
                    overflow: 'hidden',
                }}>
                <View>
                    <Text style={{
                        fontSize: FontSize.FS_10,
                        color: black,
                        fontFamily: MEDIUM,
                        lineHeight: 24,
                        marginLeft: 70
                    }}>Mobile {item?.work_contact_number}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 40, marginVertical: 14 }}>
                        <TouchableOpacity  onPress={()=>{
                            navigate("CallScreen",{item: item,from: "CONTACTS"})
                        }}
                        style={{ width: 37, height: 37, backgroundColor: greenPrimary, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                            <Icon name="phone" size={22} color={white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            navigate("ChatScreen",{to_number:item?.work_contact_number,to_name :item?.first_name +" " + item?.last_name})
                        }}
                         style={{ width: 37, height: 37, backgroundColor: "#228aea", borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
                            <Icon name="chat" size={22} color={white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 37, height: 37, backgroundColor: greenPrimary, borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
                            <Icon name="video" size={24} color={white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            navigate("ContactInfo",{item:item,from:"CONTACTS"})
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

const Contacts = ({navigation}) => {

    const [ContactsData, setContactsData] = useState(null);
    const [FcmToken, setFcmToken] = useState(null);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);

    const bottomSheetRef = useRef(null);
    const dispatch = useDispatch();

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const apiGetContactsList = useSelector(state => state.contactRedux.apiGetContactsList);
    const isLoading = useSelector(state => state.contactRedux.isLoader);
    const isError = useSelector(state => state.contactRedux.isError);
    const error_message = useSelector(state => state.contactRedux.error_message);
    const contacts_data = useSelector(state => state.contactRedux.contacts_data);
    const user_data = useSelector(state => state.userRedux.user_data);

    useEffect(() => {
        requestPermissions()
        getData(FCM_TOKEN, data => {
            Log('FCM_TOKEN Contact: ', data);
            setFcmToken(data)
        });
        return () => {
            dispatch(resetApiStatus());
        };
    }, []);

    useEffect(() => {
        if (FcmToken == null) {
            var dict = {};
            dict.is_search = false,
                dict.limits = "show_all",
                dict.off_set = 0,
                dict.orderby = "created_at DESC",
                dict.group_per = "all",
                dict.group_uuid = "",
                dict.user_type = "admin",
                dict.contact_type = "",
                dict.bussiness_name = "",
                dict.contact_title = "",
                dict.first_name = "",
                dict.last_name = "",
                dict.email = "",
                dict.work_contact_number = "",
                dict.other_contact_number = "",
                dict.country = "",
                dict.state = "",
                dict.city = "",
                dict.zipcode = "",
                dict.address = "",
                dict.address2 = "",
                dict.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIxZjE5ZGNiMC1mODEwLTRlNmItOTNkNC03NTVkNjRjYjNiNjMiLCJpYXQiOjE2OTgyMTc2MzIsImV4cCI6MTY5ODMwNDAzMn0.uarREiHwNuB0-LT3Vxy5L6hLyd7dY_CmVOrVbx0B_cE",
                dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dict.user_uuid = user_data?.data?.user_uuid
            dispatch(Get_Contacts_List(dict))
        }

    }, [FcmToken])

    useEffect(() => {
        Log('apiGetContactsList :', apiGetContactsList);
        if (apiGetContactsList == STATUS_FULFILLED) {
            if (contacts_data !== null) {
                const initialListDataSource = contacts_data.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setContactsData(initialListDataSource)
                setListDataSource(initialListDataSource)
            }
        } else if (apiGetContactsList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetContactsList]);

    const openBottomSheet = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.open();
        }
    };

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

    const requestPermissions = ()=>{
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            ];
        
            PermissionsAndroid.requestMultiple(permissions)
                .then(granted => {
                    Log("granted",granted)
                    if (
                        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
                        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
                        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
                        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE] === PermissionsAndroid.RESULTS.GRANTED &&
                        granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED 

                    ) {
                        Log('User accepted all  permissions');
                        // You can perform actions that require these permissions here
                    } else {
                        Log('One or more permissions were denied');
                        // requestPermissions()
                        // Handle the scenario where permissions were denied
                    }
                })
                .catch(err => {
                    console.warn('Error in requesting permissions:', err);
                });
            }
    }

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
                        title="Contacts"
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
                                key={item.first_name}
                                onClickFunction={() => {
                                    updateLayout(key);
                                }}
                                item={item}
                            />
                        ))}
                    </>
                }

                <CustomBottomSheet bottomSheetRef={bottomSheetRef} />
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default Contacts;

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
