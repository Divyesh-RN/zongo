
import { View, Text } from 'react-native';
import React, { useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black, disableColor } from '../../../constants/Color';
import { FontSize, MEDIUM } from '../../../constants/Fonts';
import { Log } from '../../../commonComponents/Log';

const UserE911 = ({ navigation, route }) => {

    const [TitleHeader, setTitleHeader] = useState("E911");
    const [E911Data, setE911Data] = useState(route?.params?.data?.user_e911 || null);
    
    Log("USER E911 DATA : ", route?.params?.data)
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
                        title={TitleHeader}
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                    {/* main view start*/}
                    <View >
                        <View style={{
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                                <View>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}>{"Caller ID Name"}</Text>
                                    <Text style={{
                                        fontSize: FontSize.FS_11,
                                        color: black,
                                        fontFamily: MEDIUM,
                                        marginTop: 4
                                    }}>{E911Data?.caller_id_name}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>

                                <View>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: black,
                                        fontFamily: MEDIUM,
                                    }}>{"Caller ID Number"}</Text>
                                    <Text style={{
                                        fontSize: FontSize.FS_11,
                                        color: black,
                                        fontFamily: MEDIUM,
                                        marginTop: 4
                                    }}>{E911Data?.caller_id_number}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: disableColor,
                            marginHorizontal: -20,
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                                <View>

                                    <View>
                                        <Text style={{
                                            fontSize: FontSize.FS_12,
                                            color: black,
                                            fontFamily: MEDIUM,
                                        }}>{"Address"}</Text>
                                        <Text style={{
                                            fontSize: FontSize.FS_11,
                                            color: black,
                                            fontFamily: MEDIUM,
                                            marginTop: 4
                                        }}>{E911Data?.address_1 + '\n' + E911Data?.city + "\n" + E911Data?.state +"\n" + E911Data?.zip + "\n" }</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* main view end*/}
                </View>
            </HeaderView>
        </>
    );
};

export default UserE911;
