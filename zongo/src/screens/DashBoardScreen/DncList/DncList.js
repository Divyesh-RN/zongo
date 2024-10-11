import {
    Alert,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    LayoutAnimation,
    TextInput,
    Modal,
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
import { black05, darkGrey, disableColor, grey, midGreen, red, yellow } from '@constants/Color';
import { navigate } from '@navigation/RootNavigation';
import LoadingView from '@commonComponents/LoadingView';
import {
    Create_Dnc_List,
    Delete_Dnc_List,
    Delete_Multiple_Dnc_List,
    Get_Area_Code_By_State,
    Get_Area_Code_List,
    Get_Dnc_List,
    Get_Export_Blocked_Numbers,
    Get_States,
} from '../../../redux/api/Api';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { greenPrimary, paleGreen } from '../../../constants/Color';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { resetDncListApiStatus } from '../../../redux/reducers/DncListReducer';
import BottomSheet from './components/BottomSheet';
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
    const module_name = "dnc-list";
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
const DncLists = ({ navigation }) => {

    const [DncList, setDncList] = useState([]);
    const [Search, setSearch] = useState(false);
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [SearchText, setSearchText] = useState("");


    const [FilterModalOpen, setFilterModalOpen] = useState(false);
    const [FilterState, setFilterState] = useState(null);
    const [FilterAreaCode, setFilterAreaCode] = useState(null);
    const [FilterAccountName, setFilterAccountName] = useState("");
    const [FilterDescriptiion, setFilterDescriptiion] = useState("");


    const [value, setValue] = useState();


    const [selectedItems, setSelectedItems] = useState([]);
    const [Selection, setSelection] = useState(false);
    const [ModalNumberId, setModalNumberId] = useState("");
    const [ModalNumber, setModalNumber] = useState("");
    const [ModalNumberError, setModalNumberError] = useState("");
    const [ModalAccountName, setModalAccountName] = useState("");
    const [ModalAccountNameError, setModalAccountNameError] = useState("");
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

    const apiGetDncList = useSelector(state => state.dncListRedux.apiGetDncList);
    const apiCreateDncList = useSelector(state => state.dncListRedux.apiCreateDncList);
    const dnc_list = useSelector(state => state.dncListRedux.dnc_list);
    const apiDeleteDncList = useSelector(state => state.dncListRedux.apiDeleteDncList);
    const apiDeleteMultipleDncList = useSelector(state => state.dncListRedux.apiDeleteMultipleDncList);


    const apiGetExportBlockedNumbers = useSelector(state => state.blockNumberRedux.apiGetExportBlockedNumbers);
    const export_blocked_numbers = useSelector(state => state.blockNumberRedux.export_blocked_numbers);



    const apiGetAreaCodeList = useSelector(state => state.generalRedux.apiGetAreaCodeList);
    const area_code = useSelector(state => state.generalRedux.area_code);
    const apiGetAreaCodeByState = useSelector(state => state.generalRedux.apiGetAreaCodeByState);
    const apiGetStates = useSelector(state => state.generalRedux.apiGetStates);
    const state = useSelector(state => state.generalRedux.state);


    const isLoading = useSelector(state => state.dncListRedux.isLoader);
    const isError = useSelector(state => state.dncListRedux.isError);
    const error_message = useSelector(state => state.dncListRedux.error_message);
    const user_data = useSelector(state => state.userRedux.user_data);

    const areaCodeBottomSheetRef = useRef(null);
    const stateBottomSheetRef = useRef(null);
    const module_name = "dnc-list";
    const [isPermission, setIsPermission] = useState(true);
    const user_type = user_data.role;
    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let add_per = PermissionCheck(module_name, "add", "", "", "");
    let delete_per = PermissionCheck(module_name, "deleteAll", "", "", "");
    let group_uuid = "";

    const GetDncList = () => {
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
                dict.search = SearchText,
                dict.off_set = 0,
                dict.limits = 10,
                dict.orderby = "d.created_at DESC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid,
                dict.searchData = {
                    account_name: FilterAccountName.toLowerCase(),
                    area_code: FilterAreaCode == null ? "" : FilterAreaCode?.area_code,
                    description: FilterDescriptiion.toLowerCase(),
                    state_uuid: FilterState == null ? "" : FilterState?.uuid
                }
            dispatch(Get_Dnc_List(dict))
        }
    }

    const GetAreaCodeList = () => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
        }
        dispatch(Get_Area_Code_List(dict))
    }

    const GetAreaCodeByState = () => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
            state_uuid: FilterState?.uuid
        }
        dispatch(Get_Area_Code_By_State(dict))
    }

    const GetStateList = () => {
        var dict = {
            createdby: user_data?.data?.user_uuid,
        }
        dispatch(Get_States(dict))
    }

    useFocusEffect(
        useCallback(() => {
            GetStateList()
            return () => {
                dispatch(resetDncListApiStatus());
            };
        }, [])
    )

    useEffect(() => {
        Log('apiGetDncList :', apiGetDncList);
        if (apiGetDncList == STATUS_FULFILLED) {
            Log("dnc_list :", dnc_list)
            if (dnc_list !== null) {
                const initialListDataSource = dnc_list.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setListDataSource(initialListDataSource)
                setDncList(initialListDataSource)
                setFilterModalOpen(false)
            }
        } else if (apiGetDncList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetDncList]);

    useEffect(() => {
        if (FilterState == null) {
            GetAreaCodeList()
        }
        else {
            GetAreaCodeByState()
        }
    }, [FilterState]);

    useEffect(() => {
        Log('apiGetAreaCodeList :', apiGetAreaCodeList);
        if (apiGetAreaCodeList == STATUS_FULFILLED) {
            Log("area_code :", area_code)
        } else if (apiGetAreaCodeList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetAreaCodeList]);

    useEffect(() => {
        Log('apiGetAreaCodeByState :', apiGetAreaCodeByState);
        if (apiGetAreaCodeByState == STATUS_FULFILLED) {
            Log("area_code :", area_code)
        } else if (apiGetAreaCodeByState == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetAreaCodeByState]);

    useEffect(() => {
        Log('apiGetStates :', apiGetStates);
        if (apiGetStates == STATUS_FULFILLED) {
            Log("state :", state)
        } else if (apiGetStates == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetStates]);


    useEffect(() => {
        Log('apiCreateDncList :', apiCreateDncList);
        if (apiCreateDncList == STATUS_FULFILLED) {
            handleCloseModal()
        } else if (apiCreateDncList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiCreateDncList]);

    useEffect(() => {
        Log('apiDeleteDncList :', apiDeleteDncList);
        if (apiDeleteDncList == STATUS_FULFILLED) {
            GetDncList()
        } else if (apiDeleteDncList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteDncList]);

    useEffect(() => {
        Log('apiDeleteMultipleDncList :', apiDeleteMultipleDncList);
        if (apiDeleteMultipleDncList == STATUS_FULFILLED) {
            setSelection(false)
            GetDncList()
        } else if (apiDeleteMultipleDncList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiDeleteMultipleDncList]);

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

        // try {
        //     await RNFS.writeFile(filePath, csvData, 'utf8');

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
        Share.open({
            title: 'Download CSV',
            message: 'Download CSV file',
            url: `file://${filePath}`,
            type: 'text/csv',
            saveToFiles: true,
            showAppsToView: true
        })
            .then((res) => {
                Log("res", res);
            })
            .catch((err) => {
                Log("err", err);
            });
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
        const array = [...DncList];
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
            'Are you sure to delete this DNC number?',
            [
                {
                    text: 'No',
                    onPress: () => { }, style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        var dict = {
                            dnc_list_uuid: item?.dnc_list_uuid,
                            createdby: user_data?.data?.user_uuid
                        }
                        dispatch(Delete_Dnc_List(dict))
                    }
                },
            ],
            { cancelable: true },
        );
    }
    const handleSearchText = (search) => {
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
        const isSelected = selectedItems.some((selectedItem) => selectedItem.dnc_list_uuid === item.dnc_list_uuid);
        if (isSelected) {
            setSelectedItems((prevSelectedItems) =>
                prevSelectedItems.filter((selectedItem) => selectedItem.dnc_list_uuid !== item.dnc_list_uuid)
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
        setModalAccountName("")
        setModalAccountNameError("")
        setisEditModal(false)
    }
    const handleEdit = (item) => {
        setisEditModal(true)
        setIsModalVisible(true)
        setModalDescription(item?.description)
        setModalAccountName(item?.account_name)
        setModalNumber(item?.number)
        setModalNumberId(item?.dnc_list_uuid)
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
        if (ModalNumber?.length < 9 || ModalNumber?.length > 12) {
            setModalNumberError("* Please enter a valid number")
            return

        }
        if (ModalAccountName == "") {
            setModalAccountNameError("* Please enter a account name")

        }
        if (ModalDescription == "") {
            setModalDescriptionError("* Please enter a description")
            return
        }
        else {
            var dict = {
                account_name: ModalAccountName,
                action: "update",
                createdby: user_data?.data?.user_uuid,
                description: ModalDescription,
                dnc_list_uuid: ModalNumberId,
                number: ModalNumber,
                main_admin_uuid: user_data?.data?.main_uuid,
            }
            dispatch(Create_Dnc_List(dict))
        }
    }
    const handleAddNumber = () => {
        if (ModalNumber == "") {
            setModalNumberError("* Please enter a number")
        }
        if (ModalNumber?.length < 9 || ModalNumber?.length > 12) {
            setModalNumberError("* Please enter a valid number")

        }
        if (ModalAccountName == "") {
            setModalAccountNameError("* Please enter a account name")

        }
        if (ModalDescription == "") {
            setModalDescriptionError("* Please enter a description")
        }
        else {
            var dict = {
                account_name: ModalAccountName,
                action: "add",
                createdby: user_data?.data?.user_uuid,
                description: ModalDescription,
                dnc_list_uuid: "",
                number: ModalNumber,
                main_admin_uuid: user_data?.data?.main_uuid,
            }
            dispatch(Create_Dnc_List(dict))

        }
    }

    const handleSelectedDelete = () => {

        if (selectedItems.length > 0) {
            const selectedList = selectedItems.map(item => item.dnc_list_uuid);

            Alert.alert(
                "Alert",
                'Are you sure to delete this DNC numbers?',
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
                                selectedList: selectedList
                            }
                            dispatch(Delete_Multiple_Dnc_List(dict))
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
            const selectedList = selectedItems.map(item => item.dnc_list_uuid);
            var dict = {
                createdby: user_data?.data?.user_uuid,
                selectd_blocked_number: selectedList
            }
            dispatch(Get_Export_Blocked_Numbers(dict))
        } else {
            const All = DncList.map(item => item.dnc_list_uuid);
            var dict = {
                createdby: user_data?.data?.user_uuid,
                selectd_blocked_number: All
            }
            dispatch(Get_Export_Blocked_Numbers(dict))

        }
    }

    const resetFilter = () => {

        setFilterModalOpen(false);
        setFilterState(null)
        setFilterAreaCode(null)
        setFilterAccountName("")
        setFilterDescriptiion("")
    }
    const handleFilter = () => {
        if (FilterState == null && FilterAreaCode == null && FilterAccountName == "" && FilterDescriptiion == "") {
            alert("Please enter a filter value")
        }
        else {
            setSearch(false)
            GetDncList()
        }
    }

    const openStateBottomSheet = () => {
        if (stateBottomSheetRef.current) {
            stateBottomSheetRef.current.open();
        }
    };

    const openAreaCodeBottomSheet = () => {
        if (areaCodeBottomSheetRef.current) {
            areaCodeBottomSheetRef.current.open();
        }
    };

    return (
        <>
            <HeaderBackView
                title="DNC List"
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
                        {DncList.length > 0 && <Dropdown
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
                                    setSelectedItems(DncList)
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
                            borderColor: greenPrimary,
                            height: 36,
                            flex: 1,
                            borderRadius: 4,
                        }}>
                            <TouchableOpacity style={{ paddingLeft: 14 }}>
                                <Icon name="magnify" size={20} color={greenPrimary} />
                            </TouchableOpacity>
                            <TextInput
                                value={SearchText}
                                placeholder='Search Here...'
                                placeholderTextColor={greenPrimary}
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
                                    if (Search == true) {
                                        setSearch(false)
                                    }
                                }}
                            />
                            {Search == true ?
                                <TouchableOpacity onPress={() => {
                                    setDncList(listDataSource)
                                    setSearchText("")
                                    setSearch(false)
                                    setDncList([])
                                }}
                                    style={{ paddingRight: 14 }}>
                                    <Icon name="close" size={18} color={black} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => {
                                    GetDncList()
                                    setSearch(true)
                                    resetFilter()
                                }}
                                    style={{ backgroundColor: greenPrimary, height: 36, justifyContent: "center", paddingHorizontal: 8, borderTopRightRadius: 4, borderBottomRightRadius: 4, marginRight: -1 }}>
                                    <Text style={{
                                        fontSize: FontSize.FS_12,
                                        color: white,
                                        fontFamily: SEMIBOLD,
                                    }}>{"Search"}</Text>
                                </TouchableOpacity>
                            }

                        </View>
                        <TouchableOpacity onPress={() => { setFilterModalOpen(true) }}
                            style={{ width: 34, height: 34, backgroundColor: grey, marginLeft: 8, borderRadius: 4, alignItems: "center", justifyContent: "center" }}>
                            <Icon name={'filter-variant'} size={22} color={white} />

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
                                        setSelectedItems(DncList)
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
                        DncList.length > 0 ?
                            <>
                                {DncList.map((item, key) => (
                                    <ExpandableComponent
                                        key={item.dnc_list_uuid}
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
                                        isSelected={selectedItems.some((selectedItem) => selectedItem.dnc_list_uuid === item.dnc_list_uuid)}
                                        onLongPress={handleLongPress}
                                        onSelect={handleRegularPress}
                                        selectedListLength={selectedItems.length}
                                    />
                                ))}
                            </>
                            :
                            <View style={{
                                justifyContent: "flex-end",
                                marginTop: "40%"

                            }}>
                                <Text style={{
                                    fontSize: FontSize.FS_14,
                                    color: black,
                                    fontFamily: MEDIUM,
                                    textAlign: "center",
                                    alignItems: "center",
                                }}>{Search == true ? "No data found" : "Search to get DNC list ..."}</Text>
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
                                navigate("DncBulkImport")
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
                            }}>{"Export List"}</Text> */}
                            {/* </TouchableOpacity> */}
                        </View>}
                </>
                :
                <DoNotAccess />
            }
            {/* Add /Update list Modal */}
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
                            }}>{isEditModal == true ? "Update DNC List" : "Add DNC List"}</Text>
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
                            placeholder='Enter number'
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
                        }}>{"Account Name"}</Text>
                        <TextInput
                            value={ModalAccountName}
                            placeholder='Enter account name'
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
                                setModalAccountName(txt)
                                setModalAccountNameError("")
                            }}
                        />
                        {ModalAccountNameError !== "" && <Text
                            style={{
                                fontSize: FontSize.FS_10,
                                color: red,
                                fontFamily: MEDIUM,
                            }}>
                            {ModalAccountNameError}
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
                            placeholder='Enter description...'
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
            {/* FIlter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={FilterModalOpen}
                onRequestClose={() => {
                    setFilterModalOpen(!FilterModalOpen);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
                            <Text style={{
                                fontSize: FontSize.FS_16,
                                color: black,
                                fontFamily: SEMIBOLD,
                                textAlign: "center",
                                flex: 1
                            }}>{"Filter"}</Text>
                            <TouchableOpacity style={{}}
                                onPress={() => resetFilter()}>
                                <Icon name={"close"} size={24} color={black} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 10
                        }}>{"Select State"}</Text>
                        <TouchableOpacity onPress={() => {
                            openStateBottomSheet()
                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderWidth: 1,
                                borderColor: black,
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                marginVertical: 10,
                                borderRadius: 4,
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>{FilterState == null ? "Select State" : FilterState?.state_name}</Text>
                            <Icon name={"chevron-down"} size={22} color={grey} />

                        </TouchableOpacity>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 10
                        }}>{"Select Area Code"}</Text>
                        <TouchableOpacity onPress={() => {
                            openAreaCodeBottomSheet()
                        }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderWidth: 1,
                                borderColor: black,
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                marginVertical: 10,
                                borderRadius: 4,
                            }}>
                            <Text style={{
                                fontSize: FontSize.FS_12,
                                color: black,
                                fontFamily: MEDIUM,
                                marginTop: 4
                            }}>{FilterAreaCode == null ? "Select Area Code" : FilterAreaCode?.area_code}</Text>
                            <Icon name={"chevron-down"} size={22} color={grey} />

                        </TouchableOpacity>
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 10
                        }}>{"Account Name"}</Text>
                        <TextInput
                            value={FilterAccountName}
                            placeholder='Enter Account Name'
                            placeholderTextColor={grey}
                            style={{
                                borderWidth: 1,
                                borderColor: black,
                                height: 38,
                                borderRadius: 4,
                                paddingHorizontal: 14,
                                marginVertical: 10,
                                fontFamily: MEDIUM,
                                fontSize: FontSize.FS_12,
                                color: black
                            }}
                            onChangeText={(txt) => {
                                setFilterAccountName(txt)
                            }}
                        />
                        <Text style={{
                            fontSize: FontSize.FS_13,
                            color: black,
                            fontFamily: SEMIBOLD,
                            marginTop: 10
                        }}>{"Description Word"}</Text>
                        <TextInput
                            value={FilterDescriptiion}
                            placeholder='Enter Description....'
                            placeholderTextColor={grey}
                            style={{
                                borderWidth: 1,
                                borderColor: black,
                                height: 38,
                                borderRadius: 4,
                                paddingHorizontal: 14,
                                marginVertical: 10,
                                fontFamily: MEDIUM,
                                fontSize: FontSize.FS_12,
                                color: black
                            }}
                            onChangeText={(txt) => {
                                setFilterDescriptiion(txt)
                            }}
                        />
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                            <TouchableOpacity onPress={() => {
                                resetFilter()
                            }}
                                style={{ backgroundColor: grey, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: white,
                                    fontFamily: MEDIUM,
                                }}>{"Reset"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                handleFilter()
                            }}
                                style={{ backgroundColor: greenPrimary, height: 40, width: "40%", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 18 }}>
                                <Text style={{
                                    fontSize: FontSize.FS_12,
                                    color: white,
                                    fontFamily: MEDIUM,
                                }}>{"Apply Filter"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <BottomSheet
                type={"area_code"}
                title={"Select Area Code"}
                Data={area_code}
                bottomSheetRef={areaCodeBottomSheetRef}
                selectedValue={(data) => {
                    setFilterAreaCode(data)
                }} />
            <BottomSheet
                type={"state"}
                title={"Select State"}
                Data={state}
                bottomSheetRef={stateBottomSheetRef}
                selectedValue={(data) => {
                    setFilterState(data)
                    setFilterAreaCode(null)
                }} />
            {isLoading && <LoadingView />}
        </>
    );
};

export default DncLists;

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
        marginRight: 8,
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

