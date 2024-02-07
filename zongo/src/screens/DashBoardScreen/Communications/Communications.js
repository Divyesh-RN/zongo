import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import HeaderView from '../../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import CustomBottomSheet from '../../../commonComponents/CustomBottomSheet';
import {
  ic_calender,
  ic_communication,
  ic_contact,
  ic_crm,
  ic_dashboard,
  ic_email,
  ic_email_color,
  ic_emails,
  ic_phone_call,
} from '../../../constants/Images';
import { black, white } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import { goBack, navigate } from '../../../navigation/RootNavigation';
import { useSelector } from 'react-redux';
import SideMenuModuleCheck from '../../../commonComponents/RolePermission/SideMenuModuleCheck';

const Communications = ({ navigation }) => {
  const bottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.open();
    }
  };

  const user_data = useSelector(state => state.userRedux.user_data);

  var call_status = SideMenuModuleCheck("extensions", user_data);
  var email_status = SideMenuModuleCheck("email", user_data);
  var contact_status = SideMenuModuleCheck("contacts", user_data);
  var sms_status = SideMenuModuleCheck("contacts", user_data);
  return (
    <>
      <HeaderView
        title={'Zongo'}
        isProfilePic={true}
        imgUri={
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
        }
        containerStyle={{
          paddingHorizontal: pixelSizeHorizontal(20),
        }}>
        <HeaderBackView
          title="Communications"
          isBack={true}
          onPressBack={() => {
            goBack();
          }}
          onPressMenu={() => {
            navigation.toggleDrawer();
          }}
        />

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          {call_status !== "hidden" &&
            <TouchableOpacity
              onPress={() => { navigate("Call") }}
              style={styles.communicationCardMainContainer}>
              <View
                style={{
                  backgroundColor: '#DEFFD8',
                  width: 75,
                  height: 75,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 50,
                }}>
                <Image
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                  source={ic_phone_call}
                />
              </View>
              <Text style={styles.dashBoardCardText}>{'Calls'}</Text>
            </TouchableOpacity>
          }
          <TouchableOpacity
            onPress={() => { navigate("Message") }}
            style={styles.communicationCardMainContainer}>
            <View
              style={{
                backgroundColor: '#FFF7CC',
                width: 75,
                height: 75,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <Image
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
                source={ic_email_color}
              />
            </View>
            <Text style={styles.dashBoardCardText}>{'SMS'}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          {email_status !== "hidden" &&
            <TouchableOpacity
              onPress={() => { }}
              style={styles.communicationCardMainContainer}>
              <Image
                style={{ width: 75, height: 75 }}
                resizeMode="contain"
                source={ic_emails}
              />
              <Text style={styles.dashBoardCardText}>{'Emails'}</Text>
            </TouchableOpacity>
          }
         {contact_status !== "hidden" && <TouchableOpacity
            onPress={() => {
              navigate("Contacts")
            }}
            style={styles.communicationCardMainContainer}>
            <View
              style={{
                backgroundColor: '#DEF5FF',
                width: 75,
                height: 75,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <Image
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
                source={ic_contact}
              />
            </View>

            <Text style={styles.dashBoardCardText}>{'Contacts'}</Text>
          </TouchableOpacity>
            }
        </View>

        <CustomBottomSheet bottomSheetRef={bottomSheetRef} />
      </HeaderView>
    </>
  );
};

export default Communications;

const styles = StyleSheet.create({
  dashBoardCardText: {
    fontSize: FontSize.FS_18,
    color: black,
    fontFamily: SEMIBOLD,
    textTransform: 'uppercase',
    marginTop: 14,
  },
  communicationCardMainContainer: {
    flex: 1,
    backgroundColor: white,
    marginHorizontal:10,
    alignItems: 'center',
    paddingVertical: 26,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
