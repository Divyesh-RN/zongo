

import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black, greenPrimary, grey, white, red, light_grey } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Get_Number_Map_Fields, Import_Numbers_Csv, Import_Numbers_Csv_Data } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import LoadingView from '../../../commonComponents/LoadingView';
import { Log } from '../../../commonComponents/Log';
import DocumentPicker from 'react-native-document-picker';
import { resetBlockNumbersApiStatus } from '../../../redux/reducers/blockNumberReducer';
import { Dropdown } from 'react-native-element-dropdown';

const BulkImport = ({ navigation }) => {

    const [SelectedCsvFileName, setSelectedCsvFileName] = useState('');
    const [SelectedCsvFile, setSelectedCsvFile] = useState(null);
    const [CsvFileNameError, setCsvFileNameError] = useState("");
    const [SelectedCsvFileError, setSelectedCsvFileError] = useState("");
    const [MapData, setMapData] = useState([]);
    const [Number, setNumber] = useState("");
    const [NumberError, setNumberError] = useState("");
    const [Description, setDescription] = useState("");
    const [DescriptionError, setDescriptionError] = useState("");


    const dispatch = useDispatch();

    const apiImporNumberCsvData = useSelector(state => state.blockNumberRedux.apiImporNumberCsvData);
    const apiBlockNumbersCsv = useSelector(state => state.blockNumberRedux.apiBlockNumbersCsv);
    const blocked_numbers_file = useSelector(state => state.blockNumberRedux.blocked_numbers_file);
    const apiGetNumbersMapFields = useSelector(state => state.blockNumberRedux.apiGetNumbersMapFields);
    const map_blocked_numbers = useSelector(state => state.blockNumberRedux.map_blocked_numbers);
    const isLoading = useSelector(state => state.blockNumberRedux.isLoader);
    const isError = useSelector(state => state.blockNumberRedux.isError);
    const error_message = useSelector(state => state.blockNumberRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);


    useFocusEffect(
        useCallback(() => {
            return () => {
                dispatch(resetBlockNumbersApiStatus());
            };
        }, [])
    )

    const BulkUploadCsv = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.csv],
                allowMultiSelection: true
            });
            const maxSize = 10 * 1024 * 1024;
            if (result[0].size < maxSize) {
                await setSelectedCsvFile(result);
                setSelectedCsvFileName(result[0]?.name);
                // setSelectedCsvFileError("")
                ImportFile(result)
            }
            else {
                setSelectedCsvFileError("  * Please select file size less than 10 MB")
            }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                console.error('Error picking document:', err);
            }
        }
    };
    useEffect(() => {
        Log('apiBlockNumbersCsv :', apiBlockNumbersCsv);
        if (apiBlockNumbersCsv == STATUS_FULFILLED) {
            if (blocked_numbers_file !== null) {
                var dict = {
                    createdby: user_data?.data?.user_uuid,
                    filename: blocked_numbers_file?.filename
                }
                dispatch(Get_Number_Map_Fields(dict))
            }
        } else if (apiBlockNumbersCsv == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }

    }, [apiBlockNumbersCsv]);

    useEffect(() => {
        Log('apiGetNumbersMapFields :', apiGetNumbersMapFields);
        if (apiGetNumbersMapFields == STATUS_FULFILLED) {
            if (map_blocked_numbers !== null) {
                const data = map_blocked_numbers?.csvheader.map(header => ({ label: header, value: header }));
                setMapData(data)
            }
        } else if (apiGetNumbersMapFields == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }

    }, [apiGetNumbersMapFields]);




    const ImportFile = async (result) => {
        if (result == null) {
            setSelectedCsvFileError("  * Please Upload CSV File")
        }
        else {
            let body = new FormData();
            body.append('createdby', user_data?.data?.user_uuid)
            body.append('main_admin_uuid', user_data?.data?.main_uuid)
            body.append('user_uuid', user_data?.data?.user_uuid)
            body.append('file', result[0]);
            dispatch(Import_Numbers_Csv(body));
        }
    }
    const handleImport = () => {
        if (String(Number) == "") {
            setNumberError("* Please select number")

        }
        if (String(Description) == "") {
            setDescriptionError("* Please select description")

        }
        else {
            var dict = {
                createdby: user_data?.data?.user_uuid,
                filename: blocked_numbers_file?.filename,
                main_admin_uuid: user_data?.data?.main_uuid,
                user_uuid: user_data?.data?.user_uuid,
                mappingfields: {
                    number: String(Number),
                    description: String(Description)
                }
            }
            dispatch(Import_Numbers_Csv_Data(dict))
        }

    }

    useEffect(() => {
        Log('apiImporNumberCsvData :', apiImporNumberCsvData);
        if (apiImporNumberCsvData == STATUS_FULFILLED) {
            goBack()
        } else if (apiImporNumberCsvData == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }

    }, [apiImporNumberCsvData]);
    const renderNumber = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value == Number && (
                    <Icon name="check" size={18} color={black} />
                )}
            </View>
        );
    };
    const renderDescription = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value == Description && (
                    <Icon name="check" size={18} color={black} />
                )}
            </View>
        );
    };
    return (
        <>

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
            <View style={{ marginHorizontal: 20 }}>

                <Text
                    style={{
                        fontSize: FontSize.FS_12,
                        color: black,
                        fontFamily: SEMIBOLD,
                        marginTop: 20,
                        marginBottom: 10,
                        textAlign: "center"
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
                            BulkUploadCsv();
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
                    {SelectedCsvFile !== null &&
                        <View style={{ marginVertical: 24 }}>
                            <Text
                                style={{
                                    fontSize: FontSize.FS_12,
                                    color: grey,
                                    fontFamily: SEMIBOLD,
                                    textAlign: 'center',

                                }}>
                                {SelectedCsvFile[0]?.uri}
                            </Text>

                        </View>
                    }
                </View>
                <Text
                    style={{
                        fontSize: FontSize.FS_12,
                        color: grey,
                        fontFamily: SEMIBOLD,
                        marginVertical: 10,
                        textAlign: "center"
                    }}>
                    {'* The csv must have Number and Description.'}
                </Text>
                {MapData?.length > 0 && <View>
                    <Text
                        style={{
                            fontSize: FontSize.FS_14,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginVertical: 10,
                        }}>
                        {'Map Fields and Import Blocked Numbers'}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <Text
                            style={{
                                fontSize: FontSize.FS_14,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginVertical: 10,
                                flex: 0.4
                            }}>
                            {'Number'}
                        </Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={MapData}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Number"
                            value={MapData}
                            onChange={item => {
                                setNumber(item?._index);
                                setNumberError("")
                            }}
                            renderItem={renderNumber}
                        />
                    </View>
                    {NumberError !== "" && <Text
                        style={{
                            fontSize: FontSize.FS_10,
                            color: red,
                            fontFamily: MEDIUM,
                            marginTop: 8

                        }}>
                        {NumberError}
                    </Text>
                    }
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1, }}>
                        <Text
                            style={{
                                fontSize: FontSize.FS_14,
                                color: black,
                                fontFamily: SEMIBOLD,
                                marginVertical: 10,
                                flex: 0.4
                            }}>
                            {'Description'}
                        </Text>
                        <Dropdown
                            style={styles.dropdown}

                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            iconStyle={styles.iconStyle}
                            data={MapData}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Description"
                            value={MapData}
                            onChange={item => {
                                setDescription(item._index);
                                setDescriptionError("")
                            }}
                            renderItem={renderDescription}
                        />
                    </View>
                    {DescriptionError !== "" && <Text
                        style={{
                            fontSize: FontSize.FS_10,
                            color: red,
                            fontFamily: MEDIUM,
                            marginTop: 8

                        }}>
                        {DescriptionError}
                    </Text>
                    }
                    <TouchableOpacity onPress={() => {
                        handleImport()
                    }}
                        style={{
                            backgroundColor: greenPrimary,
                            alignItems: "center",
                            paddingVertical: 10,
                            marginVertical: 40,
                            justifyContent: "center",
                            borderRadius: 4,
                            width: "100%"
                        }}>
                        <Text style={{
                            fontSize: FontSize.FS_14,
                            color: white,
                            fontFamily: SEMIBOLD,
                            lineHeight: 24,
                            marginLeft: 10
                        }}>{"SAVE"}</Text>
                    </TouchableOpacity>
                </View>}

            </View>
            { isLoading && <LoadingView />
}
        </>
    );
};

export default BulkImport;

const styles = StyleSheet.create({
    dropdown: {
        flex: 0.6,
        margin: 16,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: FontSize.FS_14,
    },
    placeholderStyle: {
        fontSize: FontSize.FS_14,
    },
    selectedTextStyle: {
        fontSize: FontSize.FS_14,
        color: black
    },
    iconStyle: {
        width: 18,
        height: 18,
    },

});
