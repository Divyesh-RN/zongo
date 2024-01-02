import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, TouchableOpacity, Share } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import HeaderView from '../../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import CustomBottomSheet from '../../../commonComponents/CustomBottomSheet';

import { bgColor01, black, darkgreen01, greenPrimary, grey, grey01, light_grey, midGreen, offWhite, paleGreen, red, transparent, white } from '../../../constants/Color';
import { goBack, navigate } from '../../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import LoadingView from '../../../commonComponents/LoadingView';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../../constants/Fonts';
import { HEIGHT, WIDTH } from '../../../constants/ConstantKey';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';


const ContactInfo = ({ navigation, route }) => {
    const [ContactsData, setContactsData] = useState(route.params.item || null);
    const [FcmToken, setFcmToken] = useState(null);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [From, setFrom] = useState(route?.params?.from ||"");

    const bottomSheetRef = useRef(null);
    const dispatch = useDispatch();

    const isLoading = useSelector(state => state.contactRedux.isLoader);

    useEffect(() => {

        return () => {
        };
    }, []);



    const openBottomSheet = () => {
        if (bottomSheetRef.current) {
            bottomSheetRef.current.open();
        }
    };



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

    const handleDeleteBtn = () => {
        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: "Delete",
            textBody: "Are you sure you want to delete conatct?",
            button: 'Delete',
            onPressButton: () => {
                Dialog.hide()
            }
        })
    }

    return (
        <>
            <StatusBar translucent={true} barStyle={'light-content'} backgroundColor={transparent} />
            <View style={{ paddingTop: pixelSizeHorizontal(50), paddingBottom: pixelSizeHorizontal(0), backgroundColor: darkgreen01 }}>
                <View style={{ marginHorizontal: 20 }}>
                    <HeaderBackView
                        title={ContactsData?.first_name + ' ' + ContactsData?.last_name}
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                </View>

            </View>
            <ScrollView style={{
                flex: 1,
                backgroundColor: white
            }}  >
                <View style={{ width: "100%", height: 100, backgroundColor: light_grey }}></View>
                <View style={{ backgroundColor: white, }}>
                    <View style={{
                        bottom: 80,
                        backgroundColor: midGreen, width: 100, height: 100, borderRadius: 100, alignItems: "center", justifyContent: "center", alignSelf: "center", marginTop: 25, shadowColor: "#000",
                    }}>
                        <Text style={{ fontSize: FontSize.FS_28, color: white, fontFamily: MEDIUM, marginLeft: 6 }}>{GetName(ContactsData.first_name + ' ' + ContactsData?.last_name)} </Text>
                    </View>
                    <View style={{ bottom: 75 }}>
                        <Text style={{ fontSize: FontSize.FS_18, color: black, fontFamily: SEMIBOLD, textAlign: "center", marginTop: 6 }}>{(ContactsData.first_name + ' ' + ContactsData?.last_name)} </Text>
                       {From == "CALLS" ?
                        <Text style={{ fontSize: FontSize.FS_16, color: black, fontFamily: MEDIUM, textAlign: "center", marginBottom: 8, marginTop: 4 }}>{"Extension " + (ContactsData.extension)} </Text>

                        : <Text style={{ fontSize: FontSize.FS_16, color: black, fontFamily: MEDIUM, textAlign: "center", marginBottom: 8, marginTop: 4 }}>{"Mobile " + (ContactsData.work_contact_number)} </Text>
                    }
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginHorizontal: 40, marginVertical: 14, }}>
                            <TouchableOpacity onPress={() => {
                                navigate("CallScreen", { item: ContactsData, from: From })
                            }}
                                style={{ width: 45, height: 45, backgroundColor: greenPrimary, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                                <Icon name="phone" size={22} color={white} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                navigate("ChatScreen", { to_number: ContactsData?.work_contact_number, to_name: ContactsData?.first_name + " " + ContactsData?.last_name })
                            }}
                                style={{ width: 45, height: 45, backgroundColor: "#228aea", borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
                                <Icon name="chat" size={22} color={white} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: 45, height: 45, backgroundColor: greenPrimary, borderRadius: 50, alignItems: "center", justifyContent: "center", }}>
                                <Icon name="video" size={24} color={white} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: light_grey, height: 30 }}></View>
                        <View style={{ paddingVertical: 20, paddingHorizontal: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View>
                                <Text style={{ fontSize: FontSize.FS_13, color: grey, fontFamily: MEDIUM, marginTop: 4 }}>{ From == "CALLS" ? "EXTENSIONS" : "Mobile"} </Text>
                                <Text style={{ fontSize: FontSize.FS_16, color: black, fontFamily: MEDIUM, }}>{From == "CALLS" ?(ContactsData.extension) :(ContactsData.work_contact_number)} </Text>

                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", }}>
                                <TouchableOpacity onPress={() => {
                                    navigate("CallScreen", { item: ContactsData, from: From })
                                }}
                                    style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Icon name="phone" size={28} color={greenPrimary} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    navigate("ChatScreen", { to_number: ContactsData?.work_contact_number, to_name: ContactsData?.first_name + " " + ContactsData?.last_name })
                                }}
                                    style={{ marginHorizontal: 40, alignItems: "center", justifyContent: "center", }}>
                                    <Icon name="chat" size={28} color={"#228aea"} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", }}>
                                    <Icon name="video" size={28} color={greenPrimary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 25, borderTopWidth: 1, borderTopColor: light_grey, paddingVertical: 12, borderBottomWidth: 1, borderBlockColor: light_grey, flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ fontSize: FontSize.FS_14, color: black, fontFamily: SEMIBOLD, marginRight: 3 }}>{"Call Histroy"} </Text>

                            <Icon name="history" size={22} color={black} />

                        </View>

                        <View style={{ paddingHorizontal: 25, }}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Icon name="arrow-bottom-left" size={22} color={black} />
                                <View style={{ marginLeft: 14 }}>
                                    <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"Incoming call"} </Text>
                                    <Text style={{ fontSize: FontSize.FS_10, color: black, fontFamily: REGULAR, marginTop: 2 }}>{"Jul 21 11:16 AM"} </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Icon name="arrow-u-right-top" size={22} color={red} />
                                <View style={{ marginLeft: 14 }}>
                                    <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"Missed call"} </Text>
                                    <Text style={{ fontSize: FontSize.FS_10, color: red, fontFamily: REGULAR, marginTop: 2 }}>{"Jul 21 11:16 AM"} </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Icon name="arrow-bottom-left" size={22} color={black} />
                                <View style={{ marginLeft: 14 }}>
                                    <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"Incoming call"} </Text>
                                    <Text style={{ fontSize: FontSize.FS_10, color: black, fontFamily: REGULAR, marginTop: 2 }}>{"Jul 21 11:16 AM"} </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Icon name="arrow-top-right" size={22} color={black} />
                                <View style={{ marginLeft: 14 }}>
                                    <Text style={{ fontSize: FontSize.FS_12, color: black, fontFamily: REGULAR, }}>{"Outgoing call"} </Text>
                                    <Text style={{ fontSize: FontSize.FS_10, color: black, fontFamily: REGULAR, marginTop: 2 }}>{"Jul 21 11:16 AM"} </Text>
                                </View>
                            </View>
                        </View>


                    </View>
                </View>





            </ScrollView>
            <View style={{ position: "absolute", bottom: 20, backgroundColor: white, width: WIDTH, height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
            <TouchableOpacity onPress={()=>{
                    navigate("EditExtension",{isEdit:true})
                }}
                 style={{ alignItems: "center" }}>
                    <Icon name="pencil" size={24} color={black} />
                    <Text style={{ fontSize: FontSize.FS_10, color: black, fontFamily: SEMIBOLD, marginTop: 6 }}>{"Edit"} </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    Share.share({
                        message:
                          "Zongo App Share Contact : \n"+ContactsData.first_name + " " + ContactsData?.last_name +"\n" + ContactsData?.work_contact_number,
                      });
                }}
                 style={{ alignItems: "center" }}>
                    <Icon name="share-variant" size={24} color={black} />
                    <Text style={{ fontSize: FontSize.FS_10, color: black, fontFamily: SEMIBOLD, marginTop: 6 }}>{"Share Contact"} </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    handleDeleteBtn()
                }}
                    style={{ alignItems: "center" }}>
                    <Icon name="trash-can" size={26} color={red} />
                    <Text style={{ fontSize: FontSize.FS_10, color: red, fontFamily: SEMIBOLD, marginTop: 6 }}>{"Delete Contact"} </Text>
                </TouchableOpacity>
            </View>
            {isLoading && <LoadingView />}
        </>
    );
};

export default ContactInfo;

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
