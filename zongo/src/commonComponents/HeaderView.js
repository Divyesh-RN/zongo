import { View, Text, SafeAreaView, StyleSheet, StatusBar, ScrollView, Image } from 'react-native'
import React from 'react'
import { greenPrimary, midGreen, offWhite, transparent, white } from '../constants/Color'
import { heightPixel, pixelSizeHorizontal, widthPixel } from './ResponsiveScreen'
import IconButton from './IconButton'
import { BackImg, ic_user } from '../constants/Images'
import { BOLD, FontSize, SEMIBOLD } from '../constants/Fonts'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const HeaderView = ({ title = "", isProfilePic = true, children, onPress = {}, containerStyle = {},imgUri ="", ...props }) => {
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
                                        onPress={onPress}>
                                        <Image source={{uri :imgUri}} style={{ width: widthPixel(40), height: widthPixel(40),resizeMode:"contain" }}
                                        />
                                    </IconButton>}
                                <Text style={[styles.textTitle, { marginHorizontal: !isProfilePic ? pixelSizeHorizontal(25) : 0 }]}>{title}</Text>
                                </View>
                                 <IconButton additionalStyle={styles.btnBack}
                                        onPress={onPress}>
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
        fontSize: FontSize.FS_20,
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