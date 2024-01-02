import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import {  Check_Assign_Module, Delete_Ring_Group_Destination_List, Get_Admin_Voice_Mail, Get_Destination_List, Get_Route_To_Destination, Update_Ring_Group_Destination_List,  } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const generalReducer = createSlice({
  name: 'generalRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',

    route_by_destination_list: null,
    destination_list: null,
    admin_voice_mail_data: null,
    assign_module_data: [],
    apiGetRouteToDestination: STATUS_IDLE,
    apiGetDestinationList: STATUS_IDLE,
    apiUpdateRingGroupDestinationList: STATUS_IDLE,
    apiDeleteRingGroupDestinationList: STATUS_IDLE,
    apiGetAdminVoiceMail: STATUS_IDLE,
    apiCheckAssignModule: STATUS_IDLE,
  },

  reducers: {
    resetGeneralApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiGetRouteToDestination = STATUS_IDLE);
        (state.apiGetDestinationList = STATUS_IDLE);
        (state.apiUpdateRingGroupDestinationList = STATUS_IDLE);
        (state.apiDeleteRingGroupDestinationList = STATUS_IDLE);
        (state.apiGetAdminVoiceMail = STATUS_IDLE);
        (state.apiCheckAssignModule= STATUS_IDLE);
    },
    storeCallsData: (state, action) => {
      state.route_by_destination_list = action.payload;
    },
    clearData: state => {
      state.route_by_destination_list = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_Route_To_Destination.pending, (state, action) => {
      state.apiGetRouteToDestination = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Route_To_Destination.fulfilled, (state, action) => {
      Log('Get_Route_To_Destination fulfilled : ', JSON.stringify(action));
      state.apiGetRouteToDestination = STATUS_FULFILLED;
      state.isLoader = false;
      state.route_by_destination_list = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Route_To_Destination.rejected, (state, action) => {
      Log('Get_Route_To_Destination rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetRouteToDestination = STATUS_REJECTED;
    });

    builder.addCase(Get_Destination_List.pending, (state, action) => {
      state.apiGetDestinationList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Destination_List.fulfilled, (state, action) => {
      Log('Get_Destination_List fulfilled : ', JSON.stringify(action));
      state.apiGetDestinationList = STATUS_FULFILLED;
      state.isLoader = false;
      state.destination_list = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Destination_List.rejected, (state, action) => {
      Log('Get_Destination_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetDestinationList = STATUS_REJECTED;
    });

    builder.addCase(Update_Ring_Group_Destination_List.pending, (state, action) => {
      state.apiUpdateRingGroupDestinationList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Ring_Group_Destination_List.fulfilled, (state, action) => {
      Log('Update_Ring_Group_Destination_List fulfilled : ', JSON.stringify(action));
      state.apiUpdateRingGroupDestinationList = STATUS_FULFILLED;
      state.isLoader = false;
      // state.destination_list = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Ring_Group_Destination_List.rejected, (state, action) => {
      Log('Update_Ring_Group_Destination_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUpdateRingGroupDestinationList = STATUS_REJECTED;
    });
    builder.addCase(Delete_Ring_Group_Destination_List.pending, (state, action) => {
      state.apiDeleteRingGroupDestinationList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Ring_Group_Destination_List.fulfilled, (state, action) => {
      Log('Delete_Ring_Group_Destination_List fulfilled : ', JSON.stringify(action));
      state.apiDeleteRingGroupDestinationList = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Ring_Group_Destination_List.rejected, (state, action) => {
      Log('Delete_Ring_Group_Destination_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiDeleteRingGroupDestinationList = STATUS_REJECTED;
    });
    builder.addCase(Get_Admin_Voice_Mail.pending, (state, action) => {
      state.apiGetAdminVoiceMail = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Admin_Voice_Mail.fulfilled, (state, action) => {
      Log('Get_Admin_Voice_Mail fulfilled : ', JSON.stringify(action));
      state.apiGetAdminVoiceMail = STATUS_FULFILLED;
      state.admin_voice_mail_data = action.payload.data
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Admin_Voice_Mail.rejected, (state, action) => {
      Log('Get_Admin_Voice_Mail rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetAdminVoiceMail = STATUS_REJECTED;
    });

    builder.addCase(Check_Assign_Module.pending, (state, action) => {
      state.apiCheckAssignModule = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Check_Assign_Module.fulfilled, (state, action) => {
      Log('Check_Assign_Module fulfilled : ', JSON.stringify(action));
      state.apiCheckAssignModule = STATUS_FULFILLED;
      state.assign_module_data = action.payload.data
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Check_Assign_Module.rejected, (state, action) => {
      Log('Check_Assign_Module rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiCheckAssignModule = STATUS_REJECTED;
    });
  },
});

// Action creators are generated for each case reducer function
export const {storeCallsData, clearData, resetGeneralApiStatus} = generalReducer.actions;


export default generalReducer.reducer;
