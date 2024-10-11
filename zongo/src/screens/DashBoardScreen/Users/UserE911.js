
import { View, Text } from 'react-native';
import { useState } from 'react';
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
            <View style={{ marginHorizontal: 20 }}>
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
                                }}>{E911Data?.address_1 + '\n' + E911Data?.city + "\n" + E911Data?.state + "\n" + E911Data?.zip + "\n"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
};

export default UserE911;
