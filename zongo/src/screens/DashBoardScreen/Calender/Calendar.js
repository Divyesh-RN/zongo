import { StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeaderBackView from '@commonComponents/HeaderBackView';
import { goBack } from '@navigation/RootNavigation';
import { black, greenPrimary, grey, grey01, white, red, grey02, transparent } from '../../../constants/Color';
import { FontSize, MEDIUM, SEMIBOLD } from '../../../constants/Fonts';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { HEIGHT } from '../../../constants/ConstantKey';


const CalendarScreen = ({ navigation }) => {
    const [selected, setSelected] = useState('');
    const handleDayPress = (day) => {
        return
        setSelectedDate(day.dateString);
        setEventModel(true);
    };
    const theme = useMemo(() => {
        return {
            arrowColor: white,


            'stylesheet.calendar.header': {
                arrow: {
                    backgroundColor: greenPrimary,
                    borderRadius: 4,
                    padding: 5,
                },

                dayHeader: {
                    marginTop: 10,
                    // width: 300,
                    textAlign: 'center',
                    fontSize: FontSize.FS_12,
                    fontFamily: SEMIBOLD,
                    color: black,
                    // marginHorizontal: 40
                },
                monthText: {
                    fontSize: FontSize.FS_12,
                    fontFamily: SEMIBOLD,
                    color: white,
                    backgroundColor: greenPrimary,
                    textAlign: 'center',
                    paddingVertical: 9,
                    paddingHorizontal: 20,
                    borderRadius: 4,
                },

            }
        };
    }, []);

    return (
        <>
            <HeaderBackView
                title="Calender"
                isBack={true}
                onPressBack={() => {
                    goBack();
                }}
                onPressMenu={() => {
                    navigation.toggleDrawer();
                }}
            />
             <ScrollView horizontal>
                <Calendar
                    headerStyle={{
                        marginBottom: 20
                    }}

                    minDate={moment().format('YYYY-MM-DD')}
                    theme={theme}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.20,
                        shadowRadius: 1.41,

                        elevation: 2,
                        // marginBottom: 100,
                        backgroundColor: white,
                        paddingHorizontal: 20,
                    }}
                    onDayPress={handleDayPress}
                    // onMonthChange={(newMonth) =>{
                    //     setCurrentMonth(newMonth)}}
                    markedDates={{
                        [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
                        [moment().format('YYYY-MM-DD')]: { selected: true, marked: true, selectedDotColor: 'red' },
                    }}
                    // renderArrow={_renderArrow}
                    dayComponent={({ date, state }) => {
                        return (
                            <TouchableOpacity key={Math.random()}
                                activeOpacity={state === 'disabled' ? 0.9 : 0.1}
                                onPress={() => {
                                    if (state === 'disabled') {

                                    }
                                    else {
                                        handleDayPress(date)
                                    }
                                }}
                                style={{
                                    width: 60,
                                    height: 90,
                                    backgroundColor: state === 'disabled' ? "#f1f1f1" : white,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderWidth: 0.5,
                                    borderColor: state === 'disabled' ? "#dddddd" : "#dddddd",
                                    marginHorizontal:2
                                    // opacity: state === 'disabled' ? 0.2 : 1,
                                }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: date.dateString == moment().format('YYYY-MM-DD') ? white : state === 'disabled' ? grey01 : black,
                                    fontFamily: SEMIBOLD,
                                    fontSize: FontSize.FS_11,
                                    backgroundColor: date.dateString == moment().format('YYYY-MM-DD') ? greenPrimary : transparent,
                                    padding: date.dateString == moment().format('YYYY-MM-DD') ? 4 : 0,
                                    borderRadius: date.dateString == moment().format('YYYY-MM-DD') ? 100 : 0,
                                }}>{date.day}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </ScrollView>
            {/* {isLoading && <LoadingView />} */}
        </>
    );
};

export default CalendarScreen;

const styles = StyleSheet.create({

});
