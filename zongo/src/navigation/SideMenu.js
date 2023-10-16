import React, { Component, useEffect, useState, } from 'react';
import { SafeAreaView, View, StyleSheet, Text, Image, Alert, LogBox, } from 'react-native';


//Third Party
import { DrawerContentScrollView, DrawerItem, DrawerItemList, } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventRegister } from 'react-native-event-listeners'
import { connect } from 'react-redux'


// Constant Keys
import { StackActions } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
// import { AddUserData , RemoveUserData} from '../Services/Actions/actions'
import { BOLD, FontSize, SEMIBOLD } from '../constants/Fonts';
import { black, grey } from '../constants/Color';
import { SplashImg } from '../constants/Images';


function SideMenu( props ){
    
    const [userData , setUserData ] = useState(null)
    const [userName , setUserName ] = useState('')
    const [userImage , setUserImage ] = useState('')
   

    useEffect(() => {

        

		// console.log("User Data in SideBar is : "+JSON.stringify(props.UserData))

        // GetUserData()

        // EventRegister.addEventListener('name' , (data) => {
        //     console.log("event Data : "+data)
        //     setUserName(data)
        // })


        // EventRegister.addEventListener('image' , (data) => {
        //     console.log("event Image : "+data)
        //     setUserImage(data)
        // })
        
        // return EventRegister.removeAllListeners()
    },[])


    // const GetUserData = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem(ConstantKey.USER_DATA)
    //         if (value !== null) {

    //             // value previously stored
    //             console.log("User Data: " + value)

    //             let data = JSON.parse(value)

    //             setUserName(data.data.name)
    //             setUserData(data)
    //             setUserImage(data.data.image)
    //         }
    //         else {
    //             console.log("User Data: " + value)

    //         }
    //     } catch (e) {
    //         console.log("Error : " + e)
    //     }
    // }

    /* Clear all stored data & Logout  */
    const goToLogin = async () => {

        try {
            await AsyncStorage.clear()
        } catch (e) {
            // clear error
        }

        props.navigation.dispatch(
            StackActions.replace('Login')
        );

    }

   
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: grey }}>


                <DrawerContentScrollView {...props}>

                    <DrawerItemList {...props}
                        activeTintColor={grey}
                        inactiveTintColor={"blue"}
                        labelStyle={{ fontSize: FontSize.FS_18, fontFamily: SEMIBOLD, }}
                    />

                    <DrawerItem
                        label='Logout'
                        icon={({ color }) =>
                            <Icon name="sign-out" size={20} color={color} />
							// <Image style={{width : 20, height : 20, resizeMode : 'contain', tintColor : color}}
							// source={Image}/>
                        }
                        activeTintColor={grey}
                        inactiveTintColor={"blue"}
                        labelStyle={{ fontSize: FontSize.FS_18, fontFamily: SEMIBOLD }}
                        onPress={() => {
                            Alert.alert(
                               'appName',
                                'Are you sure you want to logout?',
                                [
                                    { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'destructive' },
                                    {
                                        text: 'Yes',
                                        onPress: () => {
											props.removeUser()
                                            goToLogin()
                                        }
                                    },
                                ],
                                { cancelable: true }
                            );
                        }}
                    />
                </DrawerContentScrollView>
            </SafeAreaView>
        );
    
}


// const getReduxData = state => ({
// 	UserData : state.UserReducer.userData,
// })

// const setReduxData = dispatch => ({
// 	// addUser : data => dispatch(AddUserData(data)),
// 	removeUser : () => dispatch(RemoveUserData())
// })

// export default  connect(getReduxData, setReduxData)(SideMenu);
export default  SideMenu;