

import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import HeaderView from '@commonComponents/HeaderView';
import { pixelSizeHorizontal } from '@commonComponents/ResponsiveScreen';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black, greenPrimary, grey, white, red, light_grey } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { Get_Dnc_Csv_Maping_fields, Get_Number_Map_Fields, Import_Dnc__Csv, Import_Numbers_Csv, Import_Numbers_Csv_Data, Insert_Dnc_Csv_Data } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import LoadingView from '../../../commonComponents/LoadingView';
import { Log } from '../../../commonComponents/Log';
import DocumentPicker from 'react-native-document-picker';
import { resetBlockNumbersApiStatus } from '../../../redux/reducers/blockNumberReducer';
import { Dropdown } from 'react-native-element-dropdown';
import { resetDncListApiStatus } from '../../../redux/reducers/DncListReducer';

const DncBulkImport = ({ navigation }) => {

    const [SelectedCsvFileName, setSelectedCsvFileName] = useState('');
    const [SelectedCsvFile, setSelectedCsvFile] = useState(null);
    const [CsvFileNameError, setCsvFileNameError] = useState("");
    const [SelectedCsvFileError, setSelectedCsvFileError] = useState("");
    const [MapData, setMapData] = useState([]);
    const [Number, setNumber] = useState("");
    const [NumberError, setNumberError] = useState("");
    const [AccountName, setAccountName] = useState("");
    const [AccountNameError, setAccountNameError] = useState("");
    const [Description, setDescription] = useState("");
    const [DescriptionError, setDescriptionError] = useState("");


    const dispatch = useDispatch();

    
    const apiImportDncCsv = useSelector(state => state.dncListRedux.apiImportDncCsv);
    const dnc_csv_file = useSelector(state => state.dncListRedux.dnc_csv_file);

    const apiDncCsvMappingFields = useSelector(state => state.dncListRedux.apiDncCsvMappingFields);
    const dnc_csv_file_map_fields = useSelector(state => state.dncListRedux.dnc_csv_file_map_fields);

    const apiInsertDncCsvData = useSelector(state => state.dncListRedux.apiInsertDncCsvData);

    const isLoading = useSelector(state => state.dncListRedux.isLoader);
    const isError = useSelector(state => state.dncListRedux.isError);
    const error_message = useSelector(state => state.dncListRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);


    useFocusEffect(
        useCallback(() => {
            return () => {
                dispatch(resetDncListApiStatus());
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
            console.log("result: ", result)
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
        Log('apiImportDncCsv :', apiImportDncCsv);
        if (apiImportDncCsv == STATUS_FULFILLED) {
            if (dnc_csv_file !== null) {
                console.log("dnc_csv_file :", dnc_csv_file)
                var dict = {
                    createdby: user_data?.data?.user_uuid,
                    filename: dnc_csv_file?.filename
                }
                dispatch(Get_Dnc_Csv_Maping_fields(dict))
            }
        } else if (apiImportDncCsv == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }

    }, [apiImportDncCsv]);

    useEffect(() => {
        Log('apiDncCsvMappingFields :', apiDncCsvMappingFields);
        if (apiDncCsvMappingFields == STATUS_FULFILLED) {
            if (dnc_csv_file_map_fields !== null) {
                console.log("dnc_csv_file_map_fields :", dnc_csv_file_map_fields)
                const data = dnc_csv_file_map_fields?.csvheader.map(header => ({ label: header, value: header }));
                console.log("finl mapp :", data)
                setMapData(data)
            }
        } else if (apiDncCsvMappingFields == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }

    }, [apiDncCsvMappingFields]);




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
            console.log("CSV body ", body)
            dispatch(Import_Dnc__Csv(body));
        }
    }
    const handleImport = () => {
        console.log("Number",Number)
        console.log("Number",typeof Number)
        if (String(Number) == "") {
            setNumberError("* Please select number")

        }
        if (String(AccountName) == "") {
            setAccountNameError("* Please select account name")

        }
        if (String(Description) == "") {
            setDescriptionError("* Please select description")

        }
        else {
            var dict = {
                createdby: user_data?.data?.user_uuid,
                filename: dnc_csv_file?.filename,
                main_admin_uuid: user_data?.data?.main_uuid,
                user_uuid: user_data?.data?.user_uuid,
                mappingfields: {
                    number: String(Number),
                    account_name:String(AccountName),
                    description: String(Description)
                }
            }
            console.log("Import DIct DNC", dict)
            dispatch(Insert_Dnc_Csv_Data(dict))
        }

    }

    useEffect(() => {
        Log('apiInsertDncCsvData :', apiInsertDncCsvData);
        if (apiInsertDncCsvData == STATUS_FULFILLED) {
            goBack()
        } else if (apiInsertDncCsvData == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }

    }, [apiInsertDncCsvData]);

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

    const renderAccountName = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value == AccountName && (
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
                        title="DNC Bulk import"
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
                                    }}>
                                    {NumberError}
                                </Text>
                                }

<View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: FontSize.FS_14,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    marginVertical: 10,
                                    flex: 0.4
                                }}>
                                {'Account Name'}
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
                                    setAccountName(item?._index);
                                    setAccountNameError("")
                                }}
                                renderItem={renderAccountName}
                            />
                        </View>
                        {AccountNameError !== "" && <Text
                                    style={{
                                        fontSize: FontSize.FS_10,
                                        color: red,
                                        fontFamily: MEDIUM,
                                    }}>
                                    {AccountNameError}
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
            </HeaderView>
            {isLoading && <LoadingView />}
        </>
    );
};

export default DncBulkImport;

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
