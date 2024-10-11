import React, { memo, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate } from '../../../../navigation/RootNavigation';
import { greenPrimary, grey, white, yellow } from '../../../../constants/Color';
import PermissionCheck from '../../../../commonComponents/RolePermission/PermissionCheck';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const renderContent = (item, module_name) => (
    <View>
        <View style={styles.rowTextContainer}>
            <Text style={styles.nameText}>Name {item.username}</Text>
        </View>
        <View style={styles.iconRow}>
            <TouchableOpacity
                onPress={() => {
                    navigate('CallScreen', { item: item, from: 'CALLS' });
                }}
                style={[styles.iconButton, { backgroundColor: greenPrimary }]}>
                <Icon name='phone' size={22} color={white} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#228aea' }]}>
                <Icon name='chat' size={22} color={white} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: greenPrimary }]}>
                <Icon name='video' size={24} color={white} />
            </TouchableOpacity>
            {PermissionCheck(module_name, 'edit', item.group_uuid, item.user_created_by, item.created_by) !== 'hidden' && (
                <TouchableOpacity
                    onPress={() => {
                        navigate('EditExtension', { isEdit: true, item: item });
                    }}
                    style={[styles.iconButton, { backgroundColor: yellow }]}>
                    <Icon name='pencil' size={22} color={white} />
                </TouchableOpacity>
            )}
            <TouchableOpacity
                onPress={() => {
                    navigate('ContactInfo', { item: item, from: 'CALLS' });
                }}
                style={[styles.iconButton, { backgroundColor: grey }]}>
                <Icon name='information' size={22} color={white} />
            </TouchableOpacity>
        </View>
    </View>
);

const ExpandableComponent = memo(({ 
    item, 
    onClickFunction, 
    getRandomColor, 
    getName, 
    expandedStyle = styles.expandedView, 
    collapsedStyle = styles.collapsedView,
    module_name = "extensions"
}) => {
    const [layoutHeight, setLayoutHeight] = useState(0);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLayoutHeight(item.isExpanded ? null : 0);
    }, [item.isExpanded]);

    return (
        <View style={[styles.expandableView, item.isExpanded ? expandedStyle : collapsedStyle]}>
            <TouchableOpacity onPress={onClickFunction} style={styles.row}>
                <View style={styles.rowContent}>
                    <TouchableOpacity style={[styles.circle, { backgroundColor: getRandomColor() }]}>
                        <Text style={styles.circleText}>{getName(item.extension)}</Text>
                    </TouchableOpacity>
                    <View style={styles.rowText}>
                        <Text style={styles.extensionText}>{item.extension}</Text>
                        <View style={styles.icon}>
                            <Icon
                                name={item.isExpanded ? 'chevron-down' : 'chevron-right'}
                                size={24}
                                color="#000"
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{ height: layoutHeight, overflow: 'hidden' }}>
                {item.isExpanded && renderContent(item, module_name)}
            </View>
        </View>
    );
});
const styles = StyleSheet.create({
    expandableView: {
        borderBottomColor: '#d3d3d3',
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    expandedView: {
        borderBottomColor: '#d3d3d3',
        borderBottomWidth: 1,
    },
    collapsedView: {
        borderBottomColor: '#d3d3d3',
        borderBottomWidth: 1,
    },
    row: {
        paddingTop: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        borderRadius: 50,
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    rowText: {
        marginLeft: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    extensionText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
        lineHeight: 24,
    },
    icon: {
        alignItems: 'center',
    },
    rowTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameText: {
        fontSize: 10,
        color: '#000',
        fontWeight: '500',
        lineHeight: 24,
        marginLeft: 70,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 40,
        marginVertical: 14,
    },
    iconButton: {
        width: 37,
        height: 37,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default ExpandableComponent;
