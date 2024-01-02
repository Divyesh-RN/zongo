import { View, Text, SafeAreaView, StyleSheet, StatusBar, ScrollView, Image } from 'react-native'
import React from 'react'
import { greenPrimary, midGreen, offWhite, red, transparent, white } from '../constants/Color'
import { heightPixel, pixelSizeHorizontal, widthPixel } from './ResponsiveScreen'
import IconButton from './IconButton'
import { BackImg, ic_user } from '../constants/Images'
import { BOLD, FontSize, SEMIBOLD } from '../constants/Fonts'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useSelector } from 'react-redux'
import MenuDrawer from 'react-native-side-drawer'


const HeaderView = ({ title = "", isProfilePic = true, children, onPressProfile = {}, onPressSearch= {}, containerStyle = {},imgUri ="",isRegister =false, ...props }) => {
    const user_data = useSelector(state => state.userRedux.user_data);
    const user_register_status = useSelector(state => state.userRedux.user_register_status);
    return (
        <>

            <StatusBar translucent={true} barStyle={'light-content'} backgroundColor={transparent} />

            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} bounces={false} keyboardShouldPersistTaps='handled'>

              

                    <SafeAreaView style={{ justifyContent:"flex-end",paddingTop:pixelSizeHorizontal(50),paddingBottom:pixelSizeHorizontal(10),backgroundColor:greenPrimary }}>

                        {title &&
                            <View style={{
                                flex: 1, flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent:"space-between"
                            }}>
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                {isProfilePic &&
                                    <IconButton additionalStyle={styles.btnBack}
                                        onPress={onPressProfile}>
                                        <Image source={{uri :imgUri}} style={{ width: widthPixel(40), height: widthPixel(40),resizeMode:"contain" }}
                                        />
                                        <View style={{backgroundColor:user_register_status?"#72ff21":red,width:15,height:15,borderRadius:20,position:"absolute",bottom:10,right:10}}>

                                        </View>
                                    </IconButton>}
                                <Text style={[styles.textTitle, { marginHorizontal: !isProfilePic ? pixelSizeHorizontal(25) : 0 }]}>{user_data?.data?.first_name + ' ' + user_data?.data?.last_name}</Text>
                                </View>
                                 <IconButton additionalStyle={styles.btnBack}
                                        onPress={onPressSearch}>
                                          <Icon name="magnify" size={34} color={white} />
                                    </IconButton>
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
        flex:1,
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
        flex:1,
        //  marginTop: pixelSizeHorizontal(-25),
        //  borderRadius: widthPixel(25)
    }
})


export default HeaderView