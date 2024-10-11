import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import {  Create_User_Meeting_Availability, Delete_User_Events, Delete_User_Meeting_Availability, Get_Meeting_Mode, Get_User_Events, Get_User_Meeting_Availability, Manage_User_Events, Update_User_Events, Update_User_Meeting_Availability } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const eventsReducer = createSlice({
    name: 'eventsRedux',
    initialState: {
        isLoader: false,
        isError: false,
        error_message: '',

        events_list: null,
        apiGetEventsList: STATUS_IDLE,
        apiManageUserEvents: STATUS_IDLE,
        apiUpdateUserEvents: STATUS_IDLE,
        apiDeleteUserEvent: STATUS_IDLE,

        apiGetMeetingMode: STATUS_IDLE,
        meeting_mode: STATUS_IDLE,
        apiGetUserMeetingAvailability: STATUS_IDLE,
        user_meeting_availability: STATUS_IDLE,
        apiCreateUserMeetingAvailability: STATUS_IDLE,
        apiUpdateUserMeetingAvailability: STATUS_IDLE,
        apiDeleteUserMeetingAvailability: STATUS_IDLE,

    },

    reducers: {
        resetEventsApiStatus: (state, action) => {
            (state.isLoader = false),
                (state.isError = false),
                (state.error_message = ''),
                (state.apiGetEventsList = STATUS_IDLE);
                (state.apiManageUserEvents = STATUS_IDLE);
                (state.apiUpdateUserEvents = STATUS_IDLE);
                (state.apiDeleteUserEvent = STATUS_IDLE);
                (state.apiGetMeetingMode = STATUS_IDLE);
                (state.apiGetUserMeetingAvailability = STATUS_IDLE);
                (state.apiCreateUserMeetingAvailability = STATUS_IDLE);
                (state.apiUpdateUserMeetingAvailability = STATUS_IDLE);
                (state.apiDeleteUserMeetingAvailability = STATUS_IDLE);
        },
        storeCallsData: (state, action) => {
            state.events_list = action.payload;
            state.meeting_mode = action.payload;
            state.user_meeting_availability = action.payload;
        },
        clearData: state => {
            state.events_list = null;
        },
    },
    extraReducers: builder => {
        builder.addCase(Get_User_Events.pending, (state, action) => {
            state.apiGetEventsList = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_User_Events.fulfilled, (state, action) => {
            Log('Get_User_Events fulfilled : ', JSON.stringify(action));
            state.apiGetEventsList = STATUS_FULFILLED;
            state.isLoader = false;
            state.events_list = action.payload?.data;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_User_Events.rejected, (state, action) => {
            Log('Get_User_Events rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiGetEventsList = STATUS_REJECTED;
        });

        builder.addCase(Manage_User_Events.pending, (state, action) => {
            state.apiManageUserEvents = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Manage_User_Events.fulfilled, (state, action) => {
            Log('Manage_User_Events fulfilled : ', JSON.stringify(action));
            state.apiManageUserEvents = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Manage_User_Events.rejected, (state, action) => {
            Log('Manage_User_Events rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiManageUserEvents = STATUS_REJECTED;
        });

        builder.addCase(Update_User_Events.pending, (state, action) => {
            state.apiUpdateUserEvents = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Update_User_Events.fulfilled, (state, action) => {
            Log('Update_User_Events fulfilled : ', JSON.stringify(action));
            state.apiUpdateUserEvents = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Update_User_Events.rejected, (state, action) => {
            Log('Update_User_Events rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiUpdateUserEvents = STATUS_REJECTED;
        });

        builder.addCase(Delete_User_Events.pending, (state, action) => {
            state.apiDeleteUserEvent = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Delete_User_Events.fulfilled, (state, action) => {
            Log('Delete_User_Events fulfilled : ', JSON.stringify(action));
            state.apiDeleteUserEvent = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Delete_User_Events.rejected, (state, action) => {
            Log('Delete_User_Events rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiDeleteUserEvent = STATUS_REJECTED;
        });

        // avialability
        builder.addCase(Get_Meeting_Mode.pending, (state, action) => {
            state.apiGetMeetingMode = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_Meeting_Mode.fulfilled, (state, action) => {
            Log('Get_Meeting_Mode fulfilled : ', JSON.stringify(action));
            state.apiGetMeetingMode = STATUS_FULFILLED;
            state.isLoader = false;
            state.meeting_mode = action.payload?.data;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_Meeting_Mode.rejected, (state, action) => {
            Log('Get_Meeting_Mode rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiGetMeetingMode = STATUS_REJECTED;
        });

        builder.addCase(Get_User_Meeting_Availability.pending, (state, action) => {
            state.apiGetUserMeetingAvailability = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_User_Meeting_Availability.fulfilled, (state, action) => {
            Log('Get_User_Meeting_Availability fulfilled : ', JSON.stringify(action));
            state.apiGetUserMeetingAvailability = STATUS_FULFILLED;
            state.isLoader = false;
            state.user_meeting_availability = action.payload?.data;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Get_User_Meeting_Availability.rejected, (state, action) => {
            Log('Get_User_Meeting_Availability rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiGetUserMeetingAvailability = STATUS_REJECTED;
        });

        builder.addCase(Create_User_Meeting_Availability.pending, (state, action) => {
            state.apiCreateUserMeetingAvailability = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Create_User_Meeting_Availability.fulfilled, (state, action) => {
            Log('Create_User_Meeting_Availability fulfilled : ', JSON.stringify(action));
            state.apiCreateUserMeetingAvailability = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Create_User_Meeting_Availability.rejected, (state, action) => {
            Log('Create_User_Meeting_Availability rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiCreateUserMeetingAvailability = STATUS_REJECTED;
        });

        builder.addCase(Update_User_Meeting_Availability.pending, (state, action) => {
            state.apiUpdateUserMeetingAvailability = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Update_User_Meeting_Availability.fulfilled, (state, action) => {
            Log('Update_User_Meeting_Availability fulfilled : ', JSON.stringify(action));
            state.apiUpdateUserMeetingAvailability = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Update_User_Meeting_Availability.rejected, (state, action) => {
            Log('Update_User_Meeting_Availability rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiUpdateUserMeetingAvailability = STATUS_REJECTED;
        });

        builder.addCase(Delete_User_Meeting_Availability.pending, (state, action) => {
            state.apiDeleteUserMeetingAvailability = STATUS_PENDING;
            state.isLoader = true;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Delete_User_Meeting_Availability.fulfilled, (state, action) => {
            Log('Delete_User_Meeting_Availability fulfilled : ', JSON.stringify(action));
            state.apiDeleteUserMeetingAvailability = STATUS_FULFILLED;
            state.isLoader = false;
            state.isError = false;
            state.error_message = '';
        });
        builder.addCase(Delete_User_Meeting_Availability.rejected, (state, action) => {
            Log('Delete_User_Meeting_Availability rejected : ', JSON.stringify(action));
            state.isLoader = false;
            state.isError = true;
            state.error_message = action.payload?.message;
            state.apiDeleteUserMeetingAvailability = STATUS_REJECTED;
        });



    },
});

// Action creators are generated for each case reducer function
export const { storeCallsData, clearData, resetEventsApiStatus } = eventsReducer.actions;


export default eventsReducer.reducer;
