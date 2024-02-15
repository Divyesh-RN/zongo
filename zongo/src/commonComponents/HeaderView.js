import { View, Text, SafeAreaView, StyleSheet, StatusBar, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { greenPrimary, grey, midGreen, offWhite, red, transparent, white } from '../constants/Color'
import { heightPixel, pixelSizeHorizontal, widthPixel } from './ResponsiveScreen'
import IconButton from './IconButton'
import { BackImg, ic_user } from '../constants/Images'
import { BOLD, FontSize, MEDIUM, SEMIBOLD } from '../constants/Fonts'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useDispatch, useSelector } from 'react-redux'
import MenuDrawer from 'react-native-side-drawer'
import { navigate, resetScreen } from '../navigation/RootNavigation'
import { STATUS_FULFILLED, STATUS_REJECTED, USER_DATA } from '../constants/ConstantKey'
import { getData, storeData } from './AsyncManager'
import { WEBSOCKET_URL } from '../constants/ApiUrl'
import { Get_Message_Notification, Get_Perticular_Role_Permission } from '../redux/api/Api'
import { Log } from './Log'
import { resetAuthApiStatus, storeUserData } from '../redux/reducers/userReducer'
import Global from '../constants/Global'
import { DisplayMessage } from './AlertManager'
import { makeCallUserLogApi } from '../redux/reducers/internalChatReducer'
import { TouchableOpacity } from 'react-native-gesture-handler'


const HeaderView = ({ title = "", isProfilePic = true, children, onPressProfile = {}, onPressSearch = {}, containerStyle = {}, imgUri = "", isRegister = false, ...props }) => {

    const [EventData, setEventData] = useState(null);
    const user_data = useSelector(state => state.userRedux.user_data);
    const user_register_status = useSelector(state => state.userRedux.user_register_status);
    const apiGetPerticularRolePermission = useSelector(state => state.userRedux.apiGetPerticularRolePermission);
    const apiGetMessageNotification = useSelector(state => state.internalChatRedux.apiGetMessageNotification);
    const message_notification = useSelector(state => state.internalChatRedux.message_notification);

    const user_new_role_permission = useSelector(state => state.userRedux.user_new_role_permission);
    const dispatch = useDispatch()

    useEffect(() => {
        const socket = new WebSocket(WEBSOCKET_URL);
        Global.Socket = socket;
        // WebSocket event listeners
        socket.onopen = () => {
            Log('WebSocket connection opened');
        };

        socket.onmessage = (event) => {
            let data = JSON.parse(event.data);
            Log('Received message:s App', data);
            setEventData(data)
            getData(USER_DATA, userData => {
                var user_data = userData?.data
                //delete user
                if (data.type == "user_delete") {
                    if (user_data?.user_uuid == data?.data) {
                        storeData(USER_DATA, null, () => {
                            dispatch(storeUserData(null));
                            resetScreen('Login');
                        });
                    }
                }

                //role change
                if (data.old_role == user_data.role_uuid && data.type == "role_change") {
                    let role_data = {
                        type: "role_change",
                        role_uuid: data.data,
                        createdby: user_data.user_uuid,
                    };
                    dispatch(Get_Perticular_Role_Permission(role_data))
                }

                // permission change
                if (data.data == user_data.role_uuid && data.type == "change_permission") {
                    let role_data = {
                        type: "permission_change",
                        role_uuid: data.data,
                        createdby: user_data.user_uuid,
                    };
                    dispatch(Get_Perticular_Role_Permission(role_data))

                }
                // get user meesage
                if (data?.type == "message" || data?.type == "file") {
                    console.log("step 1")
                    dispatch(makeCallUserLogApi(true));
                    // dispatch(callUserChatLog(true));
                }
            });



        };

        socket.onclose = (event) => {
            Log('WebSocket connection closed:', event.reason);
        };

        return () => {
            console.log("close")
            socket.close();
            dispatch(resetAuthApiStatus());

        };
    }, [])

    useEffect(() => {
        Log('apiGetPerticularRolePermission :', apiGetPerticularRolePermission);
        if (apiGetPerticularRolePermission == STATUS_FULFILLED) {
            if (user_new_role_permission !== null) {
                var updatedUserData = null;
                if (EventData?.type == "change_permission") {
                    updatedUserData = {
                        ...user_data,
                        data: {
                            ...user_data.data,
                            role_permission: user_new_role_permission?.permission_data,
                        }
                    };
                }
                else if (EventData?.type == "role_change") {
                    updatedUserData = {
                        ...user_data,
                        data: {
                            ...user_data.data,
                            role_permission: user_new_role_permission?.permission_data,
                            role: user_new_role_permission?.role_name,
                            role_uuid: EventData?.data
                        }
                    };
                }

                if (updatedUserData !== null) {
                    storeData(USER_DATA, updatedUserData, () => {
                        dispatch(storeUserData(updatedUserData));
                        resetScreen("Home")
                    });
                }


            }
        } else if (apiGetPerticularRolePermission == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetPerticularRolePermission]);

    useEffect(() => {
        let dict = {
            main_uuid: user_data?.data?.main_uuid,
            createdby: user_data?.data?.user_uuid,
        };
        dispatch(Get_Message_Notification(dict))
    }, []);

    useEffect(() => {
        Log('apiGetMessageNotification :',
            apiGetMessageNotification);
        if (apiGetMessageNotification == STATUS_FULFILLED) {
            Log("123", message_notification)

        } else if (apiGetMessageNotification == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetMessageNotification]);
    return (
        <>

            <StatusBar translucent={true} barStyle={'light-content'} backgroundColor={transparent} />
            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} bounces={false} keyboardShouldPersistTaps='handled'>
                <SafeAreaView style={{ justifyContent: "flex-end", paddingTop: pixelSizeHorizontal(50), paddingBottom: pixelSizeHorizontal(10), backgroundColor: greenPrimary }}>

                    {title &&
                        <View style={{
                            flex: 1, flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: "space-between"
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {isProfilePic &&
                                    <IconButton additionalStyle={styles.btnBack}
                                        // onPress={onPressProfile}>
                                        onPress={() => {
                                            storeData(USER_DATA, null, () => {
                                                dispatch(storeUserData(null));
                                                resetScreen('Login');
                                            });
                                        }}>
                                        <Image source={{ uri: imgUri }} style={{ width: widthPixel(40), height: widthPixel(40), resizeMode: "contain" }}
                                        />
                                        <View style={{ backgroundColor: user_register_status ? "#72ff21" : red, width: 15, height: 15, borderRadius: 20, position: "absolute", bottom: 10, right: 10 }}>

                                        </View>
                                    </IconButton>}
                                <Text style={[styles.textTitle, { marginHorizontal: !isProfilePic ? pixelSizeHorizontal(25) : 0 }]}>{user_data?.data?.first_name + ' ' + user_data?.data?.last_name}</Text>
                            </View>
                            {/* <IconButton additionalStyle={styles.btnBack}
                                onPress={onPressSearch}>
                                <Icon name="magnify" size={34} color={white} />
                            </IconButton> */}
                            <TouchableOpacity style={styles.button} onPress={() => {
                                navigate("InternalChat")
                            }}>
                                <Icon name={"message-text"} size={26} color={white} />
                               {message_notification > 0  && <View style={{
                                    width: 15, height: 15, borderRadius: 30, backgroundColor: red,alignItems:"center",justifyContent:"center",position:"absolute",top:7,right:7
                                }}>
                                    <Text style={{fontSize:FontSize.FS_09,color:white,fontFamily:MEDIUM}}>{message_notification}</Text>
                                </View>
                                }
                            </TouchableOpacity>
                        </View>
                    }


                </SafeAreaView>




                <View style={[styles.mainView, { ...containerStyle }]}>
                    {children}
                </View>
            </ScrollView>

        </>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: offWhite
    },
    textTitle: {
        fontSize: FontSize.FS_18,
        fontFamily: SEMIBOLD,
        color: white,
    },
    btnBack: {
        marginHorizontal: pixelSizeHorizontal(10)
    },
    mainView: {
        flex: 1,
    },
    button: {
        marginHorizontal: 20,
        // position: 'absolute',
        // bottom: 20,
        // right: 20,
        // backgroundColor: grey, // adjust this to your desired color
        // borderRadius: 10,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // elevation: 3, // for shadow on Android
        // zIndex: 999, // to ensure the button is above other components
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
})


export default HeaderView