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
} from 'react-native';
import React, {useState} from 'react';
import TextInputView from '../../commonComponents/TextInputView';
import {
  pixelSizeHorizontal,
  widthPixel,
} from '../../commonComponents/ResponsiveScreen';
import {
  bgColor01,
  black,
  darkGrey,
  disableColor,
  greenPrimary,
  grey,
  grey01,
  midGreen,
  offWhite,
  transparent,
  warmGrey,
  white,
} from '../../constants/Color';
import {ic_ellipse_big, ic_ellipse_small, ic_facebook, ic_google} from '../../constants/Images';
import {WIDTH} from '../../constants/ConstantKey';
import Translate from '../../translation/Translate';
import {FontSize, MEDIUM, REGULAR, SEMIBOLD} from '../../constants/Fonts';
import {Formik} from 'formik';
import * as Yup from 'yup';
import PrimaryButton from '../../commonComponents/PrimaryButton';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { navigate } from '../../navigation/RootNavigation';


const Login = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}
        keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.safeAreaView}>
          <View>
            <View style={styles.ellipsesContainer}>
              <Image source={ic_ellipse_big} style={styles.ellipseBig} />
            </View>
            <View style={styles.ellipsesContainer}>
              <Image source={ic_ellipse_small} style={styles.ellipseSmall} />
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.welcomeTextLogin}>
                {Translate.t('login_welcome_text')}
              </Text>
              <Formik
                enableReinitialize
                initialValues={{
                  EMAIL: Email,
                  PASSWORD: Password,
                }}
                validationSchema={LoginSchema}
                onSubmit={values => {
                  console.log('val :', values);
                }}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={{marginTop: pixelSizeHorizontal(20)}}>
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
                    <Text style={styles.forgetPasswordText}>
                      {Translate.t('forget_password')}
                    </Text>

                    <PrimaryButton onPress={handleSubmit} text="sign_in" />
                  </View>
                )}
              </Formik>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: 25,
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
              <View style={{marginVertical:50}}>
                <Text style={styles.doNotHaveText}>{Translate.t("dont_have_account")}
                <Text onPress={()=>{
                  navigate("Register")
                }} style={styles.registerNowText}>{Translate.t("register_now")}</Text></Text>
              </View>
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
    marginHorizontal: 40,
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
    backgroundColor: offWhite,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: bgColor01,
  },
  ellipsesContainer: {
    position: 'absolute',
  },
  ellipseBig: {
    width: WIDTH - 120,
    height: Platform.OS == 'ios' ? WIDTH - 180 : WIDTH - 190,
    resizeMode: 'contain',
  },
  ellipseSmall: {
    width: WIDTH,
    height: WIDTH / 2.4,
    resizeMode: 'contain',
    marginLeft: '15%',
  },
  welcomeTextLogin: {
    marginTop: WIDTH / 1.5,
    fontSize: FontSize.FS_17,
    color: darkGrey,
    fontFamily: SEMIBOLD,
  },
  errorText: {
    fontFamily: REGULAR,
    fontSize: FontSize.FS_10,
    color: 'red',
  },
  forgetPasswordText: {
    color: darkGrey,
    fontSize: FontSize.FS_14,
    fontFamily: REGULAR,
    textAlign: 'right',
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

export default Login;
