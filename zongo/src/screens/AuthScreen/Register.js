import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import TextInputView from '../../commonComponents/TextInputView';
import {
  bgColor01,
  black,
  darkGrey,
  disableColor,
  greenPrimary,
  grey,
  grey01, midGreen, transparent, white
} from '../../constants/Color';
import { ic_ellipse_big, ic_ellipse_small, ic_facebook, ic_google } from '../../constants/Images';
import Translate from '../../translation/Translate';
import { FontSize, MEDIUM, REGULAR, SEMIBOLD } from '../../constants/Fonts';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PrimaryButton from '../../commonComponents/PrimaryButton';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { navigate } from '../../navigation/RootNavigation';
import { Log } from '../../commonComponents/Log';

const WIDTH = Dimensions.get('window').width

const Register = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [checkBoxName, setCheckBoxName] = useState(false);
  
  const LoginSchema = Yup.object().shape({
    EMAIL: Yup.string()
      .email('* Please enter a valid email')
      .required('* Please enter an email'),

    PASSWORD: Yup.string()
      .min(6, '* Password must be at least 6 characters')
      .required('* Please enter a password'),
  });

  return (
    <>
      <StatusBar
        translucent={true}
        barStyle={'light-content'}
        backgroundColor={transparent}
      />
      {Log(1)}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        >
        <SafeAreaView style={styles.safeAreaView}>
          
            <View style={styles.ellipsesContainer}>
              <Image source={ic_ellipse_big} style={styles.ellipseBig} />
            </View>
            <View style={styles.ellipsesContainer}>
              <Image source={ic_ellipse_small} style={styles.ellipseSmall} />
            </View>
            <View style={{alignItems: 'center',marginTop:Platform.OS == "android" ? WIDTH /1.5 : "45%"}}>
              <Text style={styles.welcomeTextLogin}>
                {Translate.t('register_dec_text')}
              </Text>
              <Formik
                enableReinitialize
                initialValues={{
                  EMAIL: Email,
                  PASSWORD: Password,
                }}
                validationSchema={LoginSchema}
                onSubmit={values => {
                  Log('val :', values);
                  navigate("ForgotPassword")
                }}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={{marginTop: 20}}>
                    <TextInputView
                      imageSource={'email'}
                      onChangeText={handleChange('EMAIL')}
                      onBlur={handleBlur('EMAIL')}
                      value={values.EMAIL}
                      placeholder={'Email Address'}
                      keyboardType={'email-address'}
                    />
                    {errors.EMAIL && touched.EMAIL && (
                      <Text style={styles.errorText}>{errors.EMAIL}</Text>
                    )}
                    <TextInputView
                      imageSource={'eye'}
                      onChangeText={handleChange('PASSWORD')}
                      onBlur={handleBlur('PASSWORD')}
                      value={values.PASSWORD}
                      placeholder={'Password'}
                      keyboardType={'default'}
                    />
                    {errors.PASSWORD && touched.PASSWORD && (
                      <Text style={styles.errorText}>{errors.PASSWORD}</Text>
                    )}
                  <View style={{flexDirection: 'row',
                  alignItems: 'center',marginTop:14
                  }}>
                    <TouchableOpacity style={{}} onPress={() =>{setCheckBoxName(!checkBoxName)}}>
                    <Icon name={checkBoxName == true ?"checkbox-marked":'checkbox-blank-outline'} size={30} color={checkBoxName == true ?greenPrimary:grey01} />

                    </TouchableOpacity>
                  <Text onPress={()=>{
                    navigate("ForgetPassword")
                  }} style={styles.Termtext}>{"Yes, I want to receive promotional emails \nwith exclusive deals and discounts!"}</Text>

                  </View>
                    {/* <PrimaryButton onPress={handleSubmit} text="sign_up" /> */}
                    <PrimaryButton  onPress={()=>{
                    navigate("ForgetPassword")
                  }} text="sign_up" />
                  </View>
                )}
              </Formik>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 25,
                  marginVertical: 15,
                }}>
                <View
                  style={{
                    height: 1,
                    backgroundColor: disableColor,
                    flex: 1,
                  }}></View>
                <View style={styles.orContainer}>
                  <Text style={styles.or}>or</Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: disableColor,
                    flex: 1,
                  }}></View>
              </View>
              <View style={styles.Hstack}>
                <View style={styles.fbSquare}>
                <Image
               style={{width:33,height:33}}
                  resizeMode="contain"
                  source={ic_facebook}
                />
                </View>
                <View style={styles.goggleSquare}>
                <Image
               style={{width:33,height:33}}
                  resizeMode="contain"
                  source={ic_google}
                />
                </View>
                <View style={styles.appleSquare}>
                <Icon  name={"apple"} size={38} color={black} /> 
                </View>
              </View>
              <View style={{marginVertical:30}}>
                <Text style={styles.doNotHaveText}>{Translate.t("already_account")}
                <Text onPress={()=>{
                  navigate("Login")
                }} style={styles.registerNowText}>{Translate.t("sign_in_small")}</Text></Text>
              </View>
            </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  Hstack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:14
  },
  appleSquare: {
    backgroundColor: white,
    borderWidth: 1,
    width: 60,
    height: 60,
    borderColor: grey,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goggleSquare: {
    backgroundColor: white,
    borderWidth: 1,
    width: 60,
    height: 60,
    borderColor: greenPrimary,
    borderRadius: 6,
    marginHorizontal:40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbSquare: {
    backgroundColor: white,
    borderWidth: 1,
    width: 60,
    height: 60,
    borderColor: '#068cf1',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orContainer: {
    width: 40,
    height: 40,
    backgroundColor: white,
    borderWidth: 1,
    borderColor: disableColor,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: bgColor01,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: bgColor01,
  },
  ellipsesContainer: {
    position: 'absolute',
  },
  ellipseBig: {
    width: WIDTH - 150,
    height: Platform.OS == 'ios' ? WIDTH - 180 : WIDTH - 200,
    resizeMode: 'contain',
  },
  ellipseSmall: {
    width: WIDTH,
    height: WIDTH / 2.4,
    resizeMode: 'contain',
    marginLeft: '15%',
  },
  welcomeTextLogin: {
    fontSize: FontSize.FS_17,
    color: darkGrey,
    fontFamily: SEMIBOLD,
  },
  errorText: {
    fontFamily: REGULAR,
    fontSize: FontSize.FS_10,
    color: 'red',
  },
  Termtext: {
    color: darkGrey,
    fontSize: FontSize.FS_14,
    fontFamily: REGULAR,
    textAlign: 'left',
    marginLeft:6
  },
  or: {
    color: darkGrey,
    fontSize: FontSize.FS_14,
    fontFamily: MEDIUM,
  },
  doNotHaveText:{
    color: darkGrey,
    fontSize: FontSize.FS_16,
    fontFamily: REGULAR,
  },
  registerNowText:{
    color: midGreen,
    fontSize: FontSize.FS_16,
    fontFamily: SEMIBOLD,
  }
});

export default Register;
