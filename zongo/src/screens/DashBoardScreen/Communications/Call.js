// import { View, Text, TouchableOpacity, StyleSheet, Alert, LayoutAnimation, UIManager, Platform } from 'react-native';
// import { memo, useCallback, useEffect, useState } from 'react';
// import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
// import HeaderBackView from '../../../commonComponents/HeaderBackView';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { black, greenPrimary, grey, light_grey, midGreen, white, yellow } from '../../../constants/Color';
// import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
// import { goBack, navigate } from '../../../navigation/RootNavigation';
// import { useDispatch, useSelector } from 'react-redux';
// import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
// import { Log } from '../../../commonComponents/Log';
// import { Get_Local_Extension } from '../../../redux/api/Api';
// import LoadingView from '../../../commonComponents/LoadingView';
// import { resetApiStatus } from '../../../redux/reducers/callReducer';
// import { useFocusEffect } from '@react-navigation/native';
// import CheckModulePermisson from '../../../commonComponents/RolePermission/CheckModulePermisson';
// import PermissionCheck from '../../../commonComponents/RolePermission/PermissionCheck';
// import DoNotAccess from '../../../commonComponents/DoNotAccess';

// const ExpandableComponent = memo(({ item, onClickFunction }) => {
//     const [layoutHeight, setLayoutHeight] = useState(0);
//     const module_name = 'extensions';

//     useEffect(() => {
//         if (item.isExpanded) {
//             setLayoutHeight(null);
//         } else {
//             setLayoutHeight(0);
//         }
//     }, [item.isExpanded]);

//     const GetName = (name) => {
//         const words = name?.split(' ');
//         let initials = '';
//         words?.forEach((word) => {
//             if (word.length > 0) {
//                 initials += word[0].toUpperCase();
//             }
//         });
//         return initials;
//     };

//     const getRandomColor = () => {
//         const colors = ['#ADD8E6', '#90EE90', '#FFB6C1', '#E6E6FA'];
//         const randomIndex = Math.floor(Math.random() * colors.length);
//         return colors[randomIndex];
//     };

//     const edit_show = PermissionCheck(
//         module_name,
//         'edit',
//         item.group_uuid,
//         item.user_created_by,
//         item.created_by
//     );

//     return (
//         <View
//             style={[
//                 styles.expandableView,
//                 item?.isExpanded && styles.expandedView,
//             ]}>
//             <TouchableOpacity onPress={onClickFunction} style={styles.row}>
//                 <View style={styles.rowContent}>
//                     <TouchableOpacity style={[styles.circle, { backgroundColor: getRandomColor() }]}>
//                         <Text style={styles.circleText}>{GetName(item.extension)}</Text>
//                     </TouchableOpacity>
//                     <View style={styles.rowText}>
//                         <Text style={styles.extensionText}>{item?.extension}</Text>
//                         <View style={styles.icon}>
//                             <Icon
//                                 name={item?.isExpanded ? 'chevron-down' : 'chevron-right'}
//                                 size={24}
//                                 color={black}
//                             />
//                         </View>
//                     </View>
//                 </View>
//             </TouchableOpacity>
//             <View style={{ height: layoutHeight, overflow: 'hidden' }}>
//                 <View>
//                     <View style={styles.rowTextContainer}>
//                         <Text style={styles.nameText}>Name {item?.username}</Text>
//                     </View>
//                     <View style={styles.iconRow}>
//                         <TouchableOpacity
//                             onPress={() => {
//                                 navigate('CallScreen', { item: item, from: 'CALLS' });
//                             }}
//                             style={[styles.iconButton, { backgroundColor: greenPrimary }]}>
//                             <Icon name='phone' size={22} color={white} />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#228aea' }]}>
//                             <Icon name='chat' size={22} color={white} />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={[styles.iconButton, { backgroundColor: greenPrimary }]}>
//                             <Icon name='video' size={24} color={white} />
//                         </TouchableOpacity>
//                         {edit_show !== 'hidden' && (
//                             <TouchableOpacity
//                                 onPress={() => {
//                                     navigate('EditExtension', { isEdit: true, item: item });
//                                 }}
//                                 style={[styles.iconButton, { backgroundColor: yellow }]}>
//                                 <Icon name='pencil' size={22} color={white} />
//                             </TouchableOpacity>
//                         )}
//                         <TouchableOpacity
//                             onPress={() => {
//                                 navigate('ContactInfo', { item: item, from: 'CALLS' });
//                             }}
//                             style={[styles.iconButton, { backgroundColor: grey }]}>
//                             <Icon name='information' size={22} color={white} />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </View>
//     );
// });

// const Call = ({ navigation }) => {

//     const [listDataSource, setListDataSource] = useState([]);
//     const [multiSelect, setMultiSelect] = useState(false);
//     const [isPermission, setIsPermission] = useState(true);
//     const dispatch = useDispatch();

//     if (Platform.OS === 'android') {
//         UIManager.setLayoutAnimationEnabledExperimental(true);
//     }

//     const apiGetCallList = useSelector(state => state.callRedux.apiGetCallList);
//     const isLoading = useSelector(state => state.callRedux.isLoader);
//     const isError = useSelector(state => state.callRedux.isError);
//     const error_message = useSelector(state => state.callRedux.error_message);
//     const calls_data = useSelector(state => state.callRedux.calls_data);
//     const user_data = useSelector(state => state.userRedux.user_data);

//     const user_type = user_data?.role;
//     const module_name = "extensions";

//     let module_per = CheckModulePermisson(module_name);
//     let listing_per = PermissionCheck(module_name, "listing", "", "", "");
//     let add_per = PermissionCheck(module_name, "add", "", "", "");
//     let group_uuid = "";

//     useEffect(() => {
//         return () => { dispatch(resetApiStatus()); };
//     }, []);

//     useFocusEffect(
//         useCallback(() => {
//             if (listing_per == "none") {
//                 navigate("Error");
//             }
//             if (
//                 listing_per === "group" &&
//                 user_data.group_id != "" &&
//                 user_data.group_id != null
//             ) {
//                 group_uuid = user_data?.data?.group_id;
//             }

//             if (module_per === "" || user_type === "admin") {
//                 setIsPermission(true);
//             } else {
//                 setIsPermission(false)
//             }

//             var dict = {};
//             dict.user_type = user_type,
//                 dict.group_per = listing_per,
//                 dict.group_uuid = group_uuid,
//                 dict.role = user_data?.data?.role,
//                 dict.permission = "all",
//                 dict.role_uuid = user_data?.data?.role_uuid,
//                 dict.search = "",
//                 dict.off_set = 0,
//                 dict.limits = "show_all",
//                 dict.orderby = "e.extension ASC",
//                 dict.createdby = user_data?.data?.user_uuid,
//                 dict.main_uuid = user_data?.data?.main_uuid
//             if (module_per == "" || user_type == "admin") {
//                 dispatch(Get_Local_Extension(dict))
//             }

//         }, [])
//     );

//     useEffect(() => {
//         Log('apiGetCallList :', apiGetCallList);
//         if (apiGetCallList == STATUS_FULFILLED) {
//             if (calls_data !== null) {
//                 const initialListDataSource = calls_data?.map(item => ({
//                     ...item,
//                     isExpanded: false,
//                 }));
//                 setListDataSource(initialListDataSource)
//             }
//         } else if (apiGetCallList == STATUS_REJECTED) {
//             if (isError) {
//                 Alert.alert('Alert', error_message);
//             }
//         }
//     }, [apiGetCallList]);

//     const updateLayout = (index) => {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         const array = [...listDataSource];
//         if (multiSelect) {
//             array[index]['isExpanded'] = !array[index]['isExpanded'];
//         } else {
//             array.map((value, placeindex) =>
//                 placeindex === index
//                     ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
//                     : (array[placeindex]['isExpanded'] = false)
//             );
//         }
//         setListDataSource(array);
//     };

//     return (
//         <>
//                 {isPermission == true ?
//                     <>
//                         {
//                             listDataSource !== null &&
//                             <>
//                                 {listDataSource.map((item, key) => (
//                                     <ExpandableComponent
//                                         key={Math.random()}
//                                         onClickFunction={() => {
//                                             updateLayout(key);
//                                         }}
//                                         item={item}
//                                     />
//                                 ))}
//                             </>
//                         }
//                     </>
//                     :
//                     <DoNotAccess />
//                 }
//             {add_per == "yes" ?
//                 <TouchableOpacity onPress={() => { navigate("EditExtension", { isEdit: false }) }} style={styles.createExtBtn}>
//                     <Icon name="plus" size={25} color={white} />
//                     <Text style={styles.createExtTxt}>{"Add Extension"}</Text>
//                 </TouchableOpacity>
//                 :
//                 <></>
//             }
//             {isLoading && <LoadingView />}
//         </>
//     );
// };

// export default Call;

// const styles = StyleSheet.create({
//     createExtTxt: {
//         fontSize: FontSize.FS_13,
//         color: white,
//         fontFamily: SEMIBOLD,
//         lineHeight: 24,
//         marginLeft: 10
//         ,
//     },
//     createExtBtn: {
//         backgroundColor: midGreen,
//         flexDirection: "row",
//         alignItems: "center",
//         paddingVertical: 20,
//         justifyContent: "center",
//         position: "absolute",
//         bottom: 0,
//         width: "100%",
//     },
//     expandableView: {
//         borderBottomColor: light_grey,
//         borderBottomWidth: 1,
//         paddingVertical: 10,
//     },
//     expandedView: {
//         borderBottomWidth: 1,
//         borderBottomColor: light_grey,
//     },
//     row: {
//         paddingTop: 10,
//         paddingHorizontal: 20,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     rowContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     circle: {
//         borderRadius: 50,
//         width: 35,
//         height: 35,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     circleText: {
//         fontSize: 14,
//         color: white,
//         fontFamily: SEMIBOLD,
//         marginLeft: 2,
//     },
//     rowText: {
//         marginLeft: 14,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         flex: 1,
//     },
//     extensionText: {
//         fontSize: FontSize.FS_14,
//         color: black,
//         fontFamily: MEDIUM,
//         lineHeight: 24,
//     },
//     icon: {
//         alignItems: 'center',
//     },
//     rowTextContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     nameText: {
//         fontSize: FontSize.FS_10,
//         color: black,
//         fontFamily: MEDIUM,
//         lineHeight: 24,
//         marginLeft: 70,
//     },
//     iconRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-evenly',
//         marginHorizontal: 40,
//         marginVertical: 14,
//     },
//     iconButton: {
//         width: 37,
//         height: 37,
//         borderRadius: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     addButton: {
//         backgroundColor: midGreen,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 20,
//         justifyContent: 'center',
//         position: 'absolute',
//         bottom: 0,
//         width: '100%',
//     },
//     addButtonText: {
//         fontSize: FontSize.FS_13,
//         color: white,
//         fontFamily: SEMIBOLD,
//         lineHeight: 24,
//         marginLeft: 10,
//     },
// });

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, LayoutAnimation, UIManager, Platform } from 'react-native';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { black, greenPrimary, midGreen, white, yellow } from '../../../constants/Color';
import { FontSize, SEMIBOLD } from '../../../constants/Fonts';
import { goBack, navigate } from '../../../navigation/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS_FULFILLED, STATUS_REJECTED } from '../../../constants/ConstantKey';
import { Log } from '../../../commonComponents/Log';
import { Get_Local_Extension } from '../../../redux/api/Api';
import LoadingView from '../../../commonComponents/LoadingView';
import { resetApiStatus } from '../../../redux/reducers/callReducer';
import { useFocusEffect } from '@react-navigation/native';
import CheckModulePermisson from '../../../commonComponents/RolePermission/CheckModulePermisson';
import DoNotAccess from '../../../commonComponents/DoNotAccess';
import ExpandableComponent from './components/ExpandableComponent';
import PermissionCheck from '../../../commonComponents/RolePermission/PermissionCheck';

const Call = ({ navigation }) => {
    const [listDataSource, setListDataSource] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [isPermission, setIsPermission] = useState(true);
    const dispatch = useDispatch();

    if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const apiGetCallList = useSelector(state => state.callRedux.apiGetCallList);
    const isLoading = useSelector(state => state.callRedux.isLoader);
    const isError = useSelector(state => state.callRedux.isError);
    const error_message = useSelector(state => state.callRedux.error_message);
    const calls_data = useSelector(state => state.callRedux.calls_data);
    const user_data = useSelector(state => state.userRedux.user_data);

    const user_type = user_data?.data?.role;
    const module_name = "extensions";

    let module_per = CheckModulePermisson(module_name);
    let listing_per = PermissionCheck(module_name, "listing", "", "", "");
    let add_per = PermissionCheck(module_name, "add", "", "", "");
    let group_uuid = "";

    useEffect(() => {
        return () => { dispatch(resetApiStatus()); };
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (listing_per == "none") {
                navigate("Error");
            }
            if (
                listing_per === "group" &&
                user_data.group_id != "" &&
                user_data.group_id != null
            ) {
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
                dict.role = user_data?.data?.role,
                dict.permission = "all",
                dict.role_uuid = user_data?.data?.role_uuid,
                dict.search = "",
                dict.off_set = 0,
                dict.limits = "show_all",
                dict.orderby = "e.extension ASC",
                dict.createdby = user_data?.data?.user_uuid,
                dict.main_uuid = user_data?.data?.main_uuid
            if (module_per == "" || user_type == "admin") {
                dispatch(Get_Local_Extension(dict))
            }

        }, [])
    );
    useEffect(() => {
        Log('apiGetCallList :', apiGetCallList);
        if (apiGetCallList == STATUS_FULFILLED) {
            if (calls_data !== null) {
                const initialListDataSource = calls_data?.map(item => ({
                    ...item,
                    isExpanded: false,
                }));
                setListDataSource(initialListDataSource)
            }
        } else if (apiGetCallList == STATUS_REJECTED) {
            if (isError) {
                Alert.alert('Alert', error_message);
            }
        }
    }, [apiGetCallList]);


    // const updateLayout = (index) => {
    //     const array = [...listDataSource];
    //     array[index]["isExpanded"] = !array[index]["isExpanded"];
    //     setListDataSource(array);
    //     console.log(array)

    // }
    const updateLayout = (index) => {
        console.log("index",index)
        setListDataSource(prevListDataSource => {
            return prevListDataSource.map((item, idx) => {
                if (idx === index) {
                    return { ...item, isExpanded: !item.isExpanded }; // Update the isExpanded property of the specific item
                }
                return item; 
            });
        });
    };

    const getName = (name) => {
        const words = name?.split(' ');
        let initials = '';
        words?.forEach((word) => {
            if (word.length > 0) {
                initials += word[0].toUpperCase();
            }
        });
        return initials;
    };

    const getRandomColor = () => {
        const colors = ['#ADD8E6', '#90EE90', '#FFB6C1', '#E6E6FA'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    return (
        <>
            <HeaderBackView
                title="Call"
                isBack={true}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
            {isPermission ?
                listDataSource.map((item, index,) => (
                    <ExpandableComponent
                        key={Math?.random()}
                        onClickFunction={() => updateLayout(index)}
                        item={item}
                        getName={getName}
                        getRandomColor={getRandomColor}
                    />
                )) :
                <DoNotAccess />
            }
            {add_per === "yes" &&
                <TouchableOpacity onPress={() => navigate("EditExtension", { isEdit: false })} style={styles.createExtBtn}>
                    <Icon name="plus" size={25} color={white} />
                    <Text style={styles.createExtTxt}>Add Extension</Text>
                </TouchableOpacity>
            }
            {isLoading && <LoadingView />}
        </>
    );
};

export default Call;

const styles = StyleSheet.create({
    createExtTxt: {
        fontSize: FontSize.FS_13,
        color: white,
        fontFamily: SEMIBOLD,
        lineHeight: 24,
        marginLeft: 10,
    },
    createExtBtn: {
        backgroundColor: midGreen,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        justifyContent: "center",
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
});

