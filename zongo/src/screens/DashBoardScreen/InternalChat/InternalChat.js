import React from 'react';
import { View, Text, StatusBar, SafeAreaView } from 'react-native';
import { goBack } from '../../../navigation/RootNavigation';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatUsers from './ChatUsers';
import ChatGroups from './ChatGroups';
import { darkgreen01, white } from '../../../constants/Color';
import IconButton from '../../../commonComponents/IconButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';

const Tab = createMaterialTopTabNavigator();

const InternalChat = ({ navigation }) => {
   
    const renderTabBarIcon = (name, color) => {
        return (
            <Icon name={name} size={25} color={color} />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkgreen01 }}>
            <StatusBar backgroundColor={darkgreen01} barStyle="light-content" />
            <View
                style={{
                    backgroundColor: darkgreen01,
                    paddingTop: 28,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton additionalStyle={{ marginLeft: 7 }} onPress={() => {
                            goBack()
                        }}>
                            <Icon name="arrow-left" size={25} color={white} />
                        </IconButton>
                        <Text
                            style={{
                                fontSize: FontSize.FS_15,
                                color: white,
                                fontFamily: SEMIBOLD,
                                marginHorizontal: 0,
                            }}>
                            {"Internal Chat"}
                        </Text>
                    </View>
                </View>
            </View>
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarLabelStyle: {
                    fontSize: FontSize.FS_13,
                    color: white,
                    fontFamily: MEDIUM,
                },
                tabBarStyle: { backgroundColor: darkgreen01 },
                tabBarIndicatorStyle: {
                    height: 2,
                    backgroundColor: white,
                    marginBottom: 1 // Change the color of the indicator when tab is active
                },
                tabBarLabel: ({ focused, color }) => {
                    let label;
                    if (route.name === 'ChatUsers') {
                        label = 'Users';
                    } else if (route.name === 'ChatGroups') {
                        label = 'Groups';
                    }
                    return <Text style={{
                        fontSize: focused ? FontSize.FS_14 : FontSize.FS_13,
                        color: white,
                        fontFamily: MEDIUM,
                    }}>{label}</Text>;
                }
            })}
            >
                <Tab.Screen options={{

                    tabBarLabelStyle: {
                        fontSize: FontSize.FS_14,
                        color: white,
                        fontFamily: MEDIUM,
                        textTransform: "capitalize"
                    },
                    tabBarLabel: "Users"
                }} name="ChatUsers" component={ChatUsers} />
                <Tab.Screen options={{
                    tabBarLabelStyle: {
                        fontSize: FontSize.FS_14,
                        color: white,
                        fontFamily: MEDIUM,
                        textTransform: "capitalize"
                    },
                    tabBarLabel: "Groups"
                }} name="ChatGroups" component={ChatGroups} />
            </Tab.Navigator>
        </SafeAreaView>
    );
};

export default InternalChat;
