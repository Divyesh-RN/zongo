import { StyleSheet, Alert, View, Text, ScrollView, FlatList } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import HeaderBackView from '../../commonComponents/HeaderBackView';
import { Log } from '../../commonComponents/Log';
import { useDispatch, useSelector } from 'react-redux';
import LoadingView from '../../commonComponents/LoadingView';
import { resetApiStatus } from '../../redux/reducers/messageReducer';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Sms_Log } from '../../redux/api/Api';
import global from '../../constants/Global';
import { useFocusEffect } from '@react-navigation/native';
import { FontSize, MEDIUM, SEMIBOLD } from '../../constants/Fonts';
import { bgColor01, black, greenPrimary, paleGreen, white } from '../../constants/Color';
import { goBack } from '../../navigation/RootNavigation';

const MessageLog = ({ navigation }) => {

    const [MessageLogList, setMessageLogList] = useState(null);
    const dispatch = useDispatch();

    const apiSmsLog = useSelector(state => state.messageRedux.apiSmsLog);
    const sms_log = useSelector(state => state.messageRedux.sms_log);
    const isLoading = useSelector(state => state.messageRedux.isLoader);
    const isError = useSelector(state => state.messageRedux.isError);
    const error_message = useSelector(state => state.messageRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    useEffect(() => {
        return () => {
            dispatch(resetApiStatus());
        };
    }, []);

    const AllApi = () => {
        var dict = {
            main_uuid: user_data?.data?.main_uuid,
            createdby: user_data?.data?.user_uuid,
            group_per: "all",
            group_uuid: "",
            limits: 10,
            off_set: 0,
            orderby: "sl.date_time ASC",
            search: "",
            status: "ACTIVE",
            user_type: user_data?.data?.role
        }
        dispatch(Sms_Log(dict))
    }


    useFocusEffect(
        useCallback(() => {
            AllApi()
        }, [])
    );

    useEffect(() => {
        Log('apiSmsLog :', apiSmsLog);
        if (apiSmsLog == STATUS_FULFILLED) {
            Log("GET CONTACT DATA ", sms_log)
            if (sms_log !== null) {
                setMessageLogList(sms_log)
            }
        } else if (apiSmsLog == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiSmsLog]);

    return (
        <>
            <HeaderBackView
                title="SMS Log"
                isMenu={false}
                onPressMenu={() => {
                    Log('back', global.userAgent);
                    navigation.toggleDrawer();
                }}
                onPressBack={() => goBack()}
                isBack={true}
            />
            <View style={{ marginVertical: 0 }}>
                <ScrollView showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginVertical: 14 }} horizontal={true}>
                    <View >
                        <View style={[
                            styles.rowItem,
                            {
                                backgroundColor: paleGreen,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 6,
                                marginTop: 5,
                            },
                        ]}>
                            <Text style={[styles.TableHaderText, {
                                width: 160, textAlign: "center",
                            }]}>TIMESTAMP</Text>
                            <Text style={[styles.TableHaderText, {
                                width: 90, textAlign: "center",
                            }]}>DIRECTION</Text>
                            <Text style={[styles.TableHaderText, {
                                width: 130, textAlign: "center",
                            }]}>FROM</Text>
                            <Text style={[styles.TableHaderText, {
                                width: 130, textAlign: "center",
                            }]}>{"TO"}</Text>
                            <Text style={[styles.TableHaderText, {
                                width: 150, textAlign: "center",
                            }]}>{"BODY"}</Text>
                            <Text style={[styles.TableHaderText, {
                                width: 150, textAlign: "center",
                            }]}>{"CONTACT NAME"}</Text>
                            <Text style={[styles.TableHaderText, {
                                width: 100, textAlign: "center",
                            }]}>{"STATUS"}</Text>
                        </View>
                        <FlatList
                            style={{ width: '100%', backgroundColor: white }}
                            data={MessageLogList}
                            keyExtractor={(item) => item.phone_number}
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
                                            width: 160, textAlign: "center",
                                        }]}>{item.date_time}</Text>
                                        <Text style={[styles.TableRowText, {
                                            width: 90, textAlign: "center",
                                        }]}>{item.direction}</Text>
                                        <Text style={[styles.TableRowText, {
                                            width: 130, textAlign: "center",
                                        }]}>{item?.from_number}</Text>
                                        <Text style={[styles.TableRowText, {
                                            width: 130, textAlign: "center",
                                        }]}>{item?.to_number}</Text>
                                        <Text style={[styles.TableRowText, {
                                            width: 150, textAlign: "center",
                                        }]}>{item?.message_text}</Text>
                                        <Text style={[styles.TableRowText, {
                                            width: 150, textAlign: "center",
                                        }]}>{item?.contact_name}</Text>
                                        <Text style={[styles.TableRowText, {
                                            width: 100, textAlign: "center",
                                        }]}>{item?.status}</Text>
                                    </View>
                                );
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
            {isLoading && <LoadingView />}
        </>
    );
};
export default MessageLog;

const styles = StyleSheet.create({
    TableHaderText: {
        fontSize: FontSize.FS_12,
        color: greenPrimary,
        fontFamily: SEMIBOLD,
        marginVertical: 6
    },
    TableRowText: {
        fontSize: FontSize.FS_12,
        color: black,
        fontFamily: MEDIUM,
        marginVertical: 2
    },
});
