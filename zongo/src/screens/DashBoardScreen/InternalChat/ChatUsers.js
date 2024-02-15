import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { black, greenPrimary, grey, offWhite, white } from '../../../constants/Color'
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Get_User_List_Chat } from '../../../redux/api/Api';
import { Log } from '../../../commonComponents/Log';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { navigate } from '../../../navigation/RootNavigation';
import { clearAllChatData, resetInternalChatStatus } from '../../../redux/reducers/internalChatReducer';
import { WEBSOCKET_URL } from '../../../constants/ApiUrl';
import LoadingView from '../../../commonComponents/LoadingView';

const ChatUsers = () => {

    const [UserList, setUserList] = useState(null);

    const dispatch = useDispatch();
    const user_list_chat = useSelector(state => state.internalChatRedux.user_list_chat);
    const apiGetUserListChat = useSelector(state => state.internalChatRedux.apiGetUserListChat);
    const user_data = useSelector(state => state.userRedux.user_data);
    const isLoading = useSelector(state => state.internalChatRedux.isLoader);
    const isError = useSelector(state => state.internalChatRedux.isError);
    const error_message = useSelector(state => state.internalChatRedux.error_message);

    useFocusEffect(
        useCallback(() => {
            if (user_data !== null) {
                var dict = {
                    createdby: user_data?.data?.user_uuid,
                    main_uuid: user_data?.data?.main_uuid,
                }
                dispatch(Get_User_List_Chat(dict))
            }
            return () => {
                dispatch(resetInternalChatStatus());
                dispatch(clearAllChatData());
            };
        }, [])
    );

    useEffect(() => {
        Log('apiGetUserListChat :', apiGetUserListChat);
        if (apiGetUserListChat == STATUS_FULFILLED) {
            if (user_list_chat !== null) {
                // console.log("user_list_chat :", user_list_chat)
                setUserList(user_list_chat)
            }
        } else if (apiGetUserListChat == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetUserListChat]);


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
        <View style={styles.container}>
            <FlatList
                data={UserList}
                keyExtractor={item => Math.random()}
                renderItem={({ item, index }) =>

                    <TouchableOpacity onPress={() => {
                        navigate("UserChatLog",{item:item})
                    }}
                        style={{
                            backgroundColor: white,
                            marginBottom: 6,
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 1.41,

                            elevation: 1,
                        }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ borderRadius: 14 }}>
                                <View style={{
                                    backgroundColor: getRandomColor(),
                                    borderRadius: 100,
                                    width: 36,
                                    height: 36,
                                    justifyContent: "center",
                                    alignItems: "center",

                                }}>
                                    <Text style={{ fontSize: 12, color: white, fontFamily: SEMIBOLD, marginLeft: 2 }}>{GetName(item?.first_name + " " + item?.last_name)} </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ marginLeft: 14, }}>
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                }}>{item?.first_name + " " + item?.last_name}</Text>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    marginTop: 3,
                                }}>{item?.extension}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end', }}>
                            {/* <Text style={{
                                fontSize: FontSize.FS_10,
                                color: grey,
                                fontFamily: REGULAR,
                            }}>11:20 AM</Text> */}
                            {/* <Icon name="check" size={20} color={greenPrimary} /> */}
                            {item?.message_count > 0 && <View style={{
                                width: 20, height: 20, borderRadius: 10, backgroundColor: "#52b1411f", alignItems: "center", justifyContent: "center", marginTop: 4
                            }}>
                                <Text style={{
                                    fontSize: FontSize.FS_10,
                                    color: greenPrimary,
                                    fontFamily: REGULAR,
                                }}>{item?.message_count}</Text>
                            </View>
                            }
                        </View>
                    </TouchableOpacity>
                }
            />
             {isLoading && <LoadingView />}
        </View>
    )
}

export default ChatUsers

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: offWhite
        ,
    },
})  
