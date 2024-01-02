

import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black05 } from '@constants/Color';
import { black, disableColor, greenPrimary, grey, white, red, light_grey } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Get_Blocked_Numbers_Settings, Get_Route_To_Destination, Update_Blocked_Numbers_Settings } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { resetAutoAttendantApiStatus } from '../../../redux/reducers/autoAttendantReducer';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import LoadingView from '../../../commonComponents/LoadingView';
import { Log } from '../../../commonComponents/Log';
import RouteDestinationBottomSheet from '../../../commonComponents/BottomSheet/RouteDestinationBottomSheet';
import DestinationBottomSheet from '../../../commonComponents/BottomSheet/DestinationBottomSheet';
import { ROUTE } from '../../../constants/DATA/Route';
import { Switch } from 'react-native-gesture-handler';
import DocumentPicker from 'react-native-document-picker';

const BulkImport = ({ navigation }) => {

    const [SelectedAudioFileName, setSelectedAudioFileName] = useState('');
    const [SelectedAudioFile, setSelectedAudioFile] = useState(null);
    const [AudioFileNameError, setAudioFileNameError] = useState("");
    const [SelectedAudioFileError, setSelectedAudioFileError] = useState("");
    const [IsNewFile, setIsNewFile] = useState(false);


    const dispatch = useDispatch();

    const isLoading = useSelector(state => state.blockNumberRedux.isLoader);
    const isError = useSelector(state => state.blockNumberRedux.isError);
    const error_message = useSelector(state => state.blockNumberRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);


    const UploadMusinOnHold = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
                allowMultiSelection: true
            });
            const maxSize = 10 * 1024 * 1024;
            console.log("result: ", result)
            if (result[0].size < maxSize) {
                setSelectedAudioFile(result);
                setIsNewFile(true)
                setSelectedAudioFileName(result[0]?.name);
                setSelectedAudioFileError("")
            }
            else {
                setSelectedAudioFileError("  * Please select file size less than 10 MB")
            }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.error('Error picking document:', err);
            }
        }
    };
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
                        title="Import BLocked Numbers"
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                     <Text
                                style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    marginTop:20,
                                    marginBottom:10,
                                    textAlign:"center"
                                }}>
                                {'Choose CSV File'}
                            </Text>
                    <View
                        style={{
                            backgroundColor: light_grey,
                            borderRadius: 4,
                            marginTop: 10,
                            paddingHorizontal: 14,
                            paddingVertical: 30
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                UploadMusinOnHold();
                            }}
                            style={{ alignItems: 'center', }}>
                            <Icon name="cloud-upload-outline" size={22} color={grey} />
                            <Text
                                style={{
                                    fontSize: FontSize.FS_12,
                                    color: grey,
                                    fontFamily: SEMIBOLD,
                                }}>
                                {'Upload CSV'}
                            </Text>
                        </TouchableOpacity>
                        {SelectedAudioFile !== null &&
                            <View style={{ marginVertical: 24 }}>
                                <Text
                                    style={{
                                        fontSize: FontSize.FS_12,
                                        color: grey,
                                        fontFamily: SEMIBOLD,
                                        textAlign: 'center',

                                    }}>
                                    {SelectedAudioFile[0]?.uri}
                                </Text>
                            </View>
                        }
                    </View>
                    <Text
                                style={{
                                    fontSize: FontSize.FS_12,
                                    color: grey,
                                    fontFamily: SEMIBOLD,
                                    marginVertical:10,
                                    textAlign:"center"
                                }}>
                                {'* The csv must have Number and Description.'}
                            </Text>
                </View>
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default BulkImport;

const styles = StyleSheet.create({

});
