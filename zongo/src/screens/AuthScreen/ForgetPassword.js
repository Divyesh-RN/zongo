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
import { navigate, resetScreen } from '../../navigation/RootNavigation';
import { Log } from '../../commonComponents/Log';


const ForgetPassword = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const ForgetPasswordSchema = Yup.object().shape({
    EMAIL: Yup.string()
      .email('* Please enter a valid email')
      .required('* Please enter an email'),
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
            <View style={styles.ellipsesContainer}>
              <Image source={ic_ellipse_big} style={styles.ellipseBig} />
            </View>
            <View style={styles.ellipsesContainer}>
              <Image source={ic_ellipse_small} style={styles.ellipseSmall} />
            </View>
            <View style={{alignItems: 'center',marginTop:Platform.OS == "android" ? WIDTH /1.5 : "45%"}}>
              <Text style={styles.welcomeTextLogin}>
                {Translate.t('forget_password_text')}
              </Text>
              <Text onPress={()=>{
                resetScreen("Home")
              }}  style={styles.forgetPasswordDecText}>
                      {Translate.t('forget_password_desc_text')}
                    </Text>
              <Formik
                enableReinitialize
                initialValues={{
                  EMAIL: Email,
                }}
                validationSchema={ForgetPasswordSchema}
                onSubmit={values => {
                  Log('val :', values);
                }}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={{marginTop: pixelSizeHorizontal(10)}}>
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
                     {/* <PrimaryButton onPress={handleSubmit} text="submit" /> */}
                    <PrimaryButton onPress={()=>{
                resetScreen("Home")
              }} text="submit" />
                  </View>
                )}
              </Formik>
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
    marginTop:pixelSizeHorizontal(14)
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
    marginHorizontal: pixelSizeHorizontal(40),
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
    // marginTop: WIDTH / 1.5,
    fontSize: FontSize.FS_17,
    color: darkGrey,
    fontFamily: SEMIBOLD,
  },
  errorText: {
    fontFamily: REGULAR,
    fontSize: FontSize.FS_10,
    color: 'red',
  },
  forgetPasswordDecText: {
    color: darkGrey,
    fontSize: FontSize.FS_13,
    fontFamily: REGULAR,
    textAlign: 'center',
    marginVertical:pixelSizeHorizontal(14),
    marginHorizontal:pixelSizeHorizontal(25)
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

export default ForgetPassword;
