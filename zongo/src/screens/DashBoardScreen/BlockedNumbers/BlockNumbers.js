import {
    Alert,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    LayoutAnimation,
    TextInput,
    Modal,
    PermissionsAndroid,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { black, white } from '@constants/Color';
import { FontSize, SEMIBOLD } from '@constants/Fonts';
import { goBack } from '@navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FULFILLED, STATUS_REJECTED } from '@constants/ConstantKey';
import { Log } from '@commonComponents/Log';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { MEDIUM, REGULAR } from '@constants/Fonts';
import { black05, darkGrey, disableColor, grey, grey01, midGreen, red, yellow } from '@constants/Color';
import { navigate } from '@navigation/RootNavigation';
import LoadingView from '@commonComponents/LoadingView';
import { Blocked_Numbers_List, Create_Blocked_Numbers, Delete_Blocked_Numbers, Delete_Multiple_Blocked_Numbers, Get_Export_Blocked_Numbers, Update_Blocked_Numbers } from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { resetBlockNumbersApiStatus } from '../../../redux/reducers/blockNumberReducer';
import { Dropdown } from 'react-native-element-dropdown';
import { greenPrimary, paleGreen } from '../../../constants/Color';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'
import PermissionCheck from '../../../commonComponents/RolePermission/PermissionCheck';
import CheckModulePermisson from '../../../commonComponents/RolePermission/CheckModulePermisson';
import DoNotAccess from '../../../commonComponents/DoNotAccess';



const ExpandableComponent = ({ item, onClickFunction, onDelete, onEdit, onAction, isSelected, onLongPress, onSelect, isSelection, selectedListLength }) => {
    const [layoutHeight, setLayoutHeight] = useState(0);
    useEffect(() => {
        if (item.isExpanded) {
            setLayoutHeight(null);
        } else {
            setLayoutHeight(0);
        }
    }, [item.isExpanded]);
    const module_name = "blocked-numbers";
    let edit_show = PermissionCheck(
        module_name,
        "edit",
        item.group_uuid,
        item.user_created_by,
        item.created_by
    )

    let delete_show = PermissionCheck(
        module_name,
        "delete",
        item.group_uuid,
        item.user_created_by,
        item.created_by
    )

    return (

        <View style={[
            styles.expandableView,
            item?.isExpanded && styles.expandedView,

        ]}>
            <TouchableOpacity onPressOut={() => {
            }}
                onPress={() => {
                    if (isSelection == false) {
                        onClickFunction()
                    }
                    else {
                        onSelect(item)
                    }
                }}
                onLongPress={() => onLongPress(item)}

                style={{
                    backgroundColor: isSelected ? paleGreen : null,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: disableColor
                }}>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1, marginLeft: 10 }}>
                    <View>
                        <Text style={{
                            fontSize: FontSize.FS_14,
                            color: black,
                            fontFamily: SEMIBOLD,
                            lineHeight: 24
                        }}>{item?.number}</Text>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: REGULAR,
                            lineHeight: 24
                        }}>{item?.description}</Text>
                    </View>
                    {isSelected == true ? <View
                        style={{ width: 20, height: 20, backgroundColor: greenPrimary, borderRadius: 4, alignItems: "center", justifyContent: "center" }}
                    >
                        <Icon name="check" size={14} color={white} />

                    </View>
                        :
                        <View style={{}}>
                            <Icon name={item?.isExpanded ? "chevron-down" : "chevron-right"} size={28} color={darkGrey} />
                        </View>
                    }

                </View>
            </TouchableOpacity>
            <View
                style={{
                    height: layoutHeight,
                    overflow: 'hidden',
                }}>
                <View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 40, marginVertical: 14 }}>
                        {edit_show !== "hidden" ? <TouchableOpacity onPress={() => onEdit(item, true)}
                            style={{ width: "30%", height: 30, borderRadius: 50, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                            <Icon name="pencil-box-outline" size={22} color={yellow} />
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: yellow,
                                fontFamily: SEMIBOLD,
                                marginLeft: 6
                            }}>{"Manage"}</Text>
                        </TouchableOpacity>
                            :
                            <></>
                        }
                        {delete_show !== "hidden" ? <TouchableOpacity
                            onPress={() => onDelete(item, true)}
                            style={{ width: "30%", height: 30, borderRadius: 50, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                            <Icon name="trash-can" size={22} color={red} />
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: red,
                                fontFamily: SEMIBOLD,
                                marginLeft: 6
                            }}>{"Delete"}</Text>
                        </TouchableOpacity>
                            :
                            <></>
                        }
                        <TouchableOpacity onPress={() => { }}
                            style={{ width: "30%", height: 30, borderRadius: 50, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                            <FontAwesome5 name={'chart-area'} size={19} color={grey} />
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: grey,
                                fontFamily: SEMIBOLD,
                                marginLeft: 6
                            }}>{"CDR"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </View>
    );
};
const BlockNumbers = ({ navigation }) => {

    const [BlockedNumbersList, setBlockedNumbersList] = useState([]);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [SearchText, setSearchText] = useState("");
    const [value, setValue] = useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const [Selection, setSelection] = useState(false);
    const [ModalNumberId, setModalNumberId] = useState("");
    const [ModalNumber, setModalNumber] = useState("");
    const [ModalNumberError, setModalNumberError] = useState("");
    const [ModalDescription, setModalDescription] = useState("");
    const [ModalDescriptionError, setModalDescriptionError] = useState(false);
    const [isEditModal, setisEditModal] = useState(false);
    const [IsModalVisible, setIsModalVisible] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);

    const ref = useRef(null);

    const dispatch = useDispatch();

    const data = [
        { label: 'SELECT ALL', value: 'all' },
        { label: 'DESELECT ALL', value: 'clear' },
        { label: 'EXPORT ALL', value: 'export' },
    ];

    const apiBlockNumbersList = useSelector(state => state.blockNumberRedux.apiBlockNumbersList);
    const apiCreateBlockedNumber = useSelector(state => state.blockNumberRedux.apiCreateBlockedNumber);
    const apiUpdateBlockedNumber = useSelector(state => state.blockNumberRedux.apiUpdateBlockedNumber);
    const apiDeleteBlockedNumber = useSelector(state => state.blockNumberRedux.apiDeleteBlockedNumber);
    const apiDeleteMultipleBlockedNumber = useSelector(state => state.blockNumberRedux.apiDeleteMultipleBlockedNumber);
    const apiGetExportBlockedNumbers = useSelector(state => state.blockNumberRedux.apiGetExportBlockedNumbers);
    const export_blocked_numbers = useSelector(state => state.blockNumberRedux.export_blocked_numbers);
    const blocked_numbers = useSelector(state => state.blockNumberRedux.blocked_numbers);
    const isLoading = useSelector(state => state.blockNumberRedux.isLoader);
    const isError = useSelector(state => state.blockNumberRedux.isError);
    const error_message = useSelector(state => state.blockNumberRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    const module_name = "blocked-numbers";
    const [isPermission, setIsPermission] = useState(true);
    const user_type = user_data.role;
    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let add_per = PermissionCheck(module_name, "add", "", "", "");
    let delete_per = PermissionCheck(module_name, "deleteAll", "", "", "");
    let group_uuid = "";
    const GetBlockedNumbersList = () => {
        if (user_data !== null) {
            if (listing_per == "none") {
                navigate("Error");
            }
            if (listing_per == "group") {
                group_uuid = user_data?.data?.group_id;
            }

            if (module_per === "" || user_type === "admin") {
                setIsPermission(true);
            } else {
                setIsPermission(false)
            }
            var dict = {};
            dict.user_type = user_type,
                dict.group_per = listing_per,
                dict.group_uuid = group_uuid,
                dict.search = "",
                dict.off_set = 0,
                dict.limits = 10,
                dict.orderby = "created_at ASC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dispatch(Blocked_Numbers_List(dict))
        }
    }

    useFocusEffect(
        useCallback(() => {
            GetBlockedNumbersList()
            return () => {
                dispatch(resetBlockNumbersApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiBlockNumbersList :', apiBlockNumbersList);
        if (apiBlockNumbersList == STATUS_FULFILLED) {
            Log("blocked_numbers :", blocked_numbers)
            if (blocked_numbers !== null) {
                const initialListDataSource = blocked_numbers.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setListDataSource(initialListDataSource)
                setBlockedNumbersList(initialListDataSource)
            }
        } else if (apiBlockNumbersList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiBlockNumbersList]);


    useEffect(() => {
        Log('apiCreateBlockedNumber :', apiCreateBlockedNumber);
        if (apiCreateBlockedNumber == STATUS_FULFILLED) {
            handleCloseModal()
            GetBlockedNumbersList()
        } else if (apiCreateBlockedNumber == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateBlockedNumber]);

    useEffect(() => {
        Log('apiUpdateBlockedNumber :', apiUpdateBlockedNumber);
        if (apiUpdateBlockedNumber == STATUS_FULFILLED) {
            handleCloseModal()
            GetBlockedNumbersList()
        } else if (apiUpdateBlockedNumber == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiUpdateBlockedNumber]);

    useEffect(() => {
        Log('apiDeleteBlockedNumber :', apiDeleteBlockedNumber);
        if (apiDeleteBlockedNumber == STATUS_FULFILLED) {
            GetBlockedNumbersList()
        } else if (apiDeleteBlockedNumber == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteBlockedNumber]);

    useEffect(() => {
        Log('apiDeleteMultipleBlockedNumber :', apiDeleteMultipleBlockedNumber);
        if (apiDeleteMultipleBlockedNumber == STATUS_FULFILLED) {
            setSelection(false)
            GetBlockedNumbersList()
        } else if (apiDeleteMultipleBlockedNumber == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteMultipleBlockedNumber]);

    useEffect(() => {
        Log('apiGetExportBlockedNumbers :', apiGetExportBlockedNumbers);
        if (apiGetExportBlockedNumbers == STATUS_FULFILLED) {
            if (export_blocked_numbers !== null) {

                saveAndDownloadCSV(export_blocked_numbers);
                setSelection(false)
                setSelectedItems([])
            }
        } else if (apiGetExportBlockedNumbers == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetExportBlockedNumbers]);

    const convertArrayToCSV = (array) => {
        const header = Object.keys(array[0]).join(',');
        const rows = array.map(obj => Object.values(obj).map(value => `"${value}"`).join(','));
        return `${header}\n${rows.join('\n')}`;
    };

    const saveAndDownloadCSV = async (data) => {
        const csvData = convertArrayToCSV(data);
        const filePath = `${RNFS.ExternalDirectoryPath}/block_Numbers.csv`;
        const m = `${RNFS.ExternalCachesDirectoryPath}/234.csv`;
        const d = `${RNFS.ExternalStorageDirectoryPath}/234.csv`;
        const s = `${RNFetchBlob.fs.dirs}`;

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        const granteds = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const fs = RNFetchBlob.fs;
            const dirs = RNFetchBlob.fs.dirs;

            const realPath = "file:///storage/emulated/0/DCIM/zongo";
            var destPath = dirs.DCIMDir + "/zongo/";

            RNFetchBlob.fs.isDir(destPath)
                .then(async (isDir) => {
                    if (!isDir) {
                        RNFetchBlob.fs.mkdir(destPath)
                            .then(async () => {
                                let cur_path = destPath + 'BlockNumber_' + '.csv'
                                await fs.cp(realPath, cur_path)
                                    .then(() => {
                                        Alert.alert("Download Successfully", destPath)
                                    })
                                    .catch((err) => {
                                        Log("error: ", err)
                                    })
                            })
                            .catch((err) => { Log("error create: ", err) })
                    }
                    else {
                        let cur_path = destPath + 'BlockNumber_' + '.csv';
                        try {
                            await fs.cp(realPath, cur_path);
                            Alert.alert("Download Successfully", destPath);
                        } catch (err) {
                            Log("error: ", err, cur_path, realPath);
                        }
                    }
                })
        } else {
            Log('Permission denied');
        }
        // try {
        //     await RNFS.downloadFile(filePath, csvData, 'utf8');

        //     // Open the file after saving
        //     RNFetchBlob.android.actionViewIntent(filePath, 'text/csv');
        //   } catch (error) {
        //     console.error('Error writing CSV file:', error);
        //   }
        // try {
        //     await RNFS.writeFile(filePath, csvData, 'utf8');

        //     // Initiate download
        //     const config = {
        //         fileCache: true,
        //         useDownloadManager: true,
        //         notification: true,
        //         path: filePath,
        //     };

        //     RNFetchBlob.config(config)
        //         .fetch('GET', `file://${filePath}`)
        //         .then((res) => {
        //         })
        //         .catch((error) => {
        //             console.error('Error downloading file:', error);
        //         });
        // } catch (error) {
        //     console.error('Error writing CSV file:', error);
        // }
        // Share.open({
        //     title: 'Download CSV',
        //     message: 'Download CSV file',
        //     url: `file://${filePath}`,
        //     type: 'text/csv',
        //     saveToFiles: true,
        //     showAppsToView:true
        // })
        //     .then((res) => {
        //     })
        //     .catch((err) => {
        //     });
        // try {
        //   await RNFS.writeFile(filePath, csvData, 'utf8');
        //   const options = {
        //     // fileCache: true,
        //     useDownloadManager: true,
        //     notification: true,
        //     mediaScannable: true,
        //   };

        //   RNFetchBlob.config(options)
        //     .fetch('GET', `file://${filePath}`)
        //     .then((res) => {
        //       // Initiate download
        //       RNFetchBlob.ios.openDocument(res.path());
        //     });
        // } catch (error) {
        //   console.error('Error writing CSV file:', error);
        // }
    };


    const updateLayout = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...BlockedNumbersList];
        if (multiSelect) {
            array[index]['isExpanded'] = !array[index]['isExpanded'];
        } else {
            array.map((value, placeindex) =>
                placeindex === index
                    ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
                    : (array[placeindex]['isExpanded'] = false)
            );
        }
        setListDataSource(array);
    };

    const handleDeleteBtn = (item) => {
        Alert.alert(
            item?.number,
            'Are you sure to delete this block number?',
            [
                {
                    text: 'No',
                    onPress: () => { }, style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        var dict = {
                            blocked_number_uuid: item?.blocked_number_uuid,
                            createdby: user_data?.data?.user_uuid
                        }
                        dispatch(Delete_Blocked_Numbers(dict))
                    }
                },
            ],
            { cancelable: true },
        );
    }
    const handleSearchText = (search) => {

        let text = String(search).toLowerCase().replace("?", "")
        let items = listDataSource
        let filteredItems = items.filter((item) => {
            return String(item.did_number).toLowerCase().match(text) || String(item.description).toLowerCase().match(text)
        })
        if (!text || text === '') {
            setBlockedNumbersList(listDataSource)
        } else if (!Array.isArray(filteredItems) && !filteredItems.length) {
            setBlockedNumbersList([])
        } else if (Array.isArray(filteredItems)) {
            setBlockedNumbersList(filteredItems)
        }

        setSearchText(search)
    }

    const renderIcon = () => {
        return (
            <View style={styles.iconStyle}>
                <FontAwesome5 name={'bars'} size={16} color={white} />
            </View>
        );
    };

    const toggleSelection = (item) => {
        const isSelected = selectedItems.some((selectedItem) => selectedItem.blocked_number_uuid === item.blocked_number_uuid);
        if (isSelected) {
            setSelectedItems((prevSelectedItems) =>
                prevSelectedItems.filter((selectedItem) => selectedItem.blocked_number_uuid !== item.blocked_number_uuid)
            );
            setSelection(selectedItems.length == 1 ? false : true)

        } else {
            setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
            setSelection(selectedItems.length < 0 ? false : true)

        };
    };

    const handleLongPress = (item) => {
        toggleSelection(item);
    };
    const handleRegularPress = (item) => {
        toggleSelection(item);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false)
        setModalDescription("")
        setModalDescriptionError("")
        setModalNumber("")
        setModalNumberError("")
        setisEditModal(false)
    }
    const handleEdit = (item) => {
        setisEditModal(true)
        setIsModalVisible(true)
        setModalDescription(item?.description)
        setModalNumber(item?.number)
        setModalNumberId(item?.blocked_number_uuid)
    }

    const handleAddToList = () => {
        setisEditModal(false)
        setIsModalVisible(true)
    }
    const handleUpdateNumber = () => {
        if (ModalNumber == "") {
            setModalNumberError("* Please enter a number")
            return
        }
        if (ModalNumber?.length < 8 || ModalNumber?.length > 12) {
            setModalNumberError("* Please enter a valid number")
            return

        }
        if (ModalDescription == "") {
            setModalDescriptionError("* Please enter a description")
            return
        }
        else {
            var dict = {
                blocked_number_uuid: ModalNumberId,
                createdby: user_data?.data?.user_uuid,
                description: ModalDescription,
                main_user_uuid: user_data?.data?.user_uuid,
                number: ModalNumber,
            }
            dispatch(Update_Blocked_Numbers(dict))
        }
    }
    const handleAddNumber = () => {
        if (ModalNumber == "") {
            setModalNumberError("* Please enter a number")
        }
        if (ModalNumber?.length < 8 || ModalNumber?.length > 12) {
            setModalNumberError("* Please enter a valid number")

        }
        if (ModalDescription == "") {
            setModalDescriptionError("* Please enter a description")
        }
        else {

            var dict = {
                blocked_number_uuid: "",
                createdby: user_data?.data?.user_uuid,
                description: ModalDescription,
                main_user_uuid: user_data?.data?.user_uuid,
                number: ModalNumber,
            }
            dispatch(Create_Blocked_Numbers(dict))

        }
    }

    const handleSelectedDelete = () => {

        if (selectedItems.length > 0) {
            const selectedList = selectedItems.map(item => item.blocked_number_uuid);

            Alert.alert(
                "Alert",
                'Are you sure to delete this block numbers?',
                [
                    {
                        text: 'Ok',
                        onPress: () => { }, style: 'cancel'
                    },
                    {
                        text: 'Yes',
                        onPress: () => {
                            var dict = {
                                createdby: user_data?.data?.user_uuid,
                                selectd_blocked_number: selectedList
                            }
                            dispatch(Delete_Multiple_Blocked_Numbers(dict))
                        }
                    },
                ],
                { cancelable: true },
            );
        }
        else {
            Alert.alert(
                "Alert",
                'Please first select blocked numbers',
                [
                    {
                        text: 'Ok',
                        onPress: () => { }, style: 'cancel'
                    },
                ],
                { cancelable: true },
            );
        }
    }

    const handleExportList = () => {

        if (selectedItems.length > 0) {
            const selectedList = selectedItems.map(item => item.blocked_number_uuid);
            var dict = {
                createdby: user_data?.data?.user_uuid,
                selectd_blocked_number: selectedList
            }
            dispatch(Get_Export_Blocked_Numbers(dict))
        } else {
            const All = BlockedNumbersList.map(item => item.blocked_number_uuid);
            var dict = {
                createdby: user_data?.data?.user_uuid,
                selectd_blocked_number: All
            }
            dispatch(Get_Export_Blocked_Numbers(dict))

        }
    }

    return (
        <>


            <HeaderBackView
                title="Blocked Numbers List"
                isBack={true}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
            {isPermission == true ?
                <>
                    <View style={{ marginHorizontal: 20, marginVertical: 22, flexDirection: "row", alignItems: "center", }}>
                        {BlockedNumbersList.length > 0 && <Dropdown
                            itemTextStyle={{ fontFamily: MEDIUM, fontSize: FontSize.FS_12 }}
                            itemContainerStyle={{ marginVertical: -6 }}
                            ref={ref}
                            style={styles.dropdown}
                            containerStyle={styles.containerStyle}
                            iconStyle={styles.iconStyle}
                            data={data}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            value={value}
                            onChange={(item) => {
                                setValue(item.value);
                                if (item.value == "all") {
                                    setSelection(true)
                                    setSelectedItems(BlockedNumbersList)
                                    setIsSelectAll(true)
                                }
                                else if (item.value == "clear") {
                                    setSelection(false)
                                    setSelectedItems([])
                                    setIsSelectAll(false)
                                }
                                else {
                                    handleExportList()
                                }
                            }}
                            onChangeText={() => { }} // Keep search keyword
                            renderRightIcon={renderIcon}
                        />
                        }
                        <View style={{
                            flexDirection: "row", alignItems: "center", borderWidth: 1,
                            borderColor: grey,
                            height: 36,
                            flex: 1,
                            marginLeft: 8,
                            borderRadius: 4,
                        }}>
                            <TouchableOpacity style={{ paddingLeft: 14 }}>
                                <Icon name="magnify" size={20} color={grey} />
                            </TouchableOpacity>
                            <TextInput
                                value={SearchText}
                                placeholder='Search Here...'
                                placeholderTextColor={grey01}
                                style={{
                                    // marginVertical:4,
                                    fontFamily: MEDIUM,
                                    fontSize: FontSize.FS_11,
                                    color: black,
                                    flex: 1,
                                    paddingHorizontal: 14,

                                }}
                                onChangeText={(txt) => {
                                    handleSearchText(txt)
                                }}
                            />
                            {SearchText?.length > 0 &&
                                <TouchableOpacity onPress={() => {
                                    setBlockedNumbersList(listDataSource)
                                    setSearchText("")
                                }}
                                    style={{ paddingRight: 14 }}>
                                    <Icon name="close" size={18} color={grey} />
                                </TouchableOpacity>
                            }

                        </View>
                        <TouchableOpacity onPress={() => {
                            navigate("BlockNumberSetting")
                        }}
                            style={{ width: 34, height: 34, backgroundColor: grey, marginLeft: 8, borderRadius: 4, alignItems: "center", justifyContent: "center" }}>
                            <FontAwesome5 name={'cog'} size={19} color={white} />

                        </TouchableOpacity>
                    </View>
                    {selectedItems?.length > 0 &&
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20 }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: SEMIBOLD,
                                textAlign: "left",
                                marginBottom: 8
                            }}>{"Total Select : " + selectedItems?.length}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: black,
                                    fontFamily: SEMIBOLD,
                                    textAlign: "left",
                                }}>{"All"}</Text>
                                <TouchableOpacity onPress={() => {
                                    if (Selection == true && isSelectAll == false) {
                                        setSelectedItems(BlockedNumbersList)
                                        setIsSelectAll(true)
                                    }
                                    else {
                                        setSelectedItems([])
                                        setIsSelectAll(false)
                                        setSelection(false)

                                    }
                                }}
                                    style={{ marginLeft: 5 }}>
                                    <Icon name={isSelectAll ? "checkbox-marked" : 'checkbox-blank-outline'} size={19} color={greenPrimary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    {
                        BlockedNumbersList.length > 0 ?
                            <>
                                {BlockedNumbersList.map((item, key) => (
                                    <ExpandableComponent
                                        key={item.blocked_number_uuid}
                                        onClickFunction={() => {
                                            updateLayout(key);
                                        }}
                                        onDelete={() => {
                                            handleDeleteBtn(item)
                                        }}
                                        onEdit={() => {
                                            handleEdit(item)
                                        }}
                                        onAction={() => {
                                        }}
                                        item={item}
                                        isSelection={Selection}
                                        isSelected={selectedItems.some((selectedItem) => selectedItem.blocked_number_uuid === item.blocked_number_uuid)}
                                        onLongPress={handleLongPress}
                                        onSelect={handleRegularPress}
                                        selectedListLength={selectedItems.length}
                                    />
                                ))}
                            </>
                            :
                            <View style={{
                                flex: 1,
                                justifyContent: "center",

                            }}>
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    textAlign: "center",
                                    alignItems: "center",
                                }}>{"No Data Found"}</Text>
                            </View>

                    }
                    {Selection == false ?
                        <View style={{
                            flexDirection: "row", alignItems: "center", position: "absolute",
                            bottom: 0,
                        }}>
                            {add_per === "yes" && <TouchableOpacity onPress={() => {
                                handleAddToList()
                            }}
                                style={{
                                    backgroundColor: midGreen,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 14,
                                    justifyContent: "center",
                                    width: "48%",
                                }}>
                                <Icon name="plus" size={25} color={white} />
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: white,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    marginLeft: 10
                                }}>{"Add to list"}</Text>
                            </TouchableOpacity>
                            }
                            <View style={{ width: "4%" }}></View>
                            {add_per === "yes" && <TouchableOpacity onPress={() => {
                                navigate("BulkImport")
                            }}
                                style={{
                                    backgroundColor: midGreen,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 14,

                                    justifyContent: "center",
                                    width: "48%",

                                }}>
                                <Icon name="plus" size={25} color={white} />
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: white,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    marginLeft: 10
                                }}>{"Bulk Import"}</Text>
                            </TouchableOpacity>
                            }
                        </View>
                        :
                        <View style={{
                            flexDirection: "row", alignItems: "center", position: "absolute",
                            bottom: 0,
                        }}>
                            {delete_per != "none" && <TouchableOpacity onPress={() => {
                                handleSelectedDelete()
                            }}
                                style={{
                                    backgroundColor: red,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 14,
                                    justifyContent: "center",
                                    width: "100%",
                                }}>
                                <Icon name="trash-can" size={22} color={white} />
                                <Text style={{
                                    fontSize: FontSize.FS_13,
                                    color: white,
                                    fontFamily: SEMIBOLD,
                                    lineHeight: 24,
                                    marginLeft: 10
                                }}>{"Delete"}</Text>
                            </TouchableOpacity>
                            }
                            {/* <View style={{ width: "4%" }}></View>
                        <TouchableOpacity onPress={() => {
                            handleExportList()
                        }}
                            style={{
                                backgroundColor: midGreen,
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 14,

                                justifyContent: "center",
                                width: "48%",

                            }}>
                            <Icon name="arrow-down" size={22} color={white} />
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: white,
                                fontFamily: SEMIBOLD,
                                lineHeight: 24,
                                marginLeft: 10
                            }}>{"Export List"}</Text>
                        </TouchableOpacity> */}
                        </View>}
                </>
                :
                <DoNotAccess />
            }
            {/* Add /Update Number Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={IsModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!IsModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                            <Text style={{
                                fontSize: FontSize.FS_13,
                                color: black,
                                fontFamily: SEMIBOLD,
                                textAlign: "center",
                                flex: 1
                            }}>{isEditModal == true ? "Update Number to Block List" : "Add Number to Block List"}</Text>
                            <TouchableOpacity style={{ justifyContent: "flex-end", alignSelf: "flex-end", alignItems: "flex-end" }}
                                onPress={() => handleCloseModal()}>

                                <Icon name={"close"} size={30} color={black} />
                            </TouchableOpacity>
                        </View>

                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 10
                        }}>{"Number"}</Text>
                        <TextInput
                            value={ModalNumber}
                            placeholder='Enter a number...'
                            placeholderTextColor={black}
                            style={{
                                borderWidth: 1,
                                borderColor: black,
                                height: 40,
                                borderRadius: 4,
                                paddingHorizontal: 14,
                                marginVertical: 10,
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,

                            }}
                            onChangeText={(txt) => {
                                setModalNumber(txt)
                                setModalNumberError("")
                            }}
                        />
                        {ModalNumberError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                            }}>
                            {ModalNumberError}
                        </Text>
                        }
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 10
                        }}>{"Description"}</Text>
                        <TextInput
                            value={ModalDescription}
                            placeholder='Enter a description...'
                            placeholderTextColor={black}
                            style={{
                                borderWidth: 1,
                                borderColor: black,
                                height: 100,
                                borderRadius: 4,
                                paddingHorizontal: 14,
                                marginVertical: 10,
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,

                            }}
                            onChangeText={(txt) => {
                                setModalDescription(txt)
                                setModalDescriptionError("")
                            }}
                        />
                        {ModalDescriptionError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                            }}>
                            {ModalDescriptionError}
                        </Text>
                        }
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <TouchableOpacity onPress={() => {
                                handleCloseModal()
                            }}
                                style={{ backgroundColor: grey, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18, marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: white,
                                    fontFamily: SEMIBOLD,
                                }}>{"Close"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if (isEditModal == true) {
                                    handleUpdateNumber()
                                }
                                else {
                                    handleAddNumber()
                                }
                            }}
                                style={{ backgroundColor: greenPrimary, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18, marginBottom: 20 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: white,
                                    fontFamily: SEMIBOLD,
                                }}>{isEditModal == true ? "Update" : "Add"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            { isLoading && <LoadingView />
}
        </>
    );
};

export default BlockNumbers;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: black05
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    errorText: {
        fontFamily: MEDIUM,
        fontSize: FontSize.FS_09,
        marginTop: 4,
        color: red,
    },
    dropdown: {
        borderRadius: 4,
        width: 34,
        height: 34,
        paddingRight: 14,
        backgroundColor: grey,
    },
    containerStyle: {
        width: 200,
        marginTop: 5,
        borderRadius: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    iconStyle: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

