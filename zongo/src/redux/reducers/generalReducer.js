import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import {  Check_Assign_Module, Delete_Ring_Group_Destination_List, Get_Admin_Voice_Mail, Get_Area_Code_By_State, Get_Area_Code_List, Get_Conatact_Field_List, Get_Destination_List, Get_Plan_List, Get_Route_To_Destination, Get_States, Update_Ring_Group_Destination_List,  } from '../api/Api';
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
    area_code: null,
    state: null,
    plan_list: null,
    contact_field_list : null,
    apiGetRouteToDestination: STATUS_IDLE,
    apiGetDestinationList: STATUS_IDLE,
    apiUpdateRingGroupDestinationList: STATUS_IDLE,
    apiDeleteRingGroupDestinationList: STATUS_IDLE,
    apiGetAdminVoiceMail: STATUS_IDLE,
    apiCheckAssignModule: STATUS_IDLE,
    apiGetAreaCodeList: STATUS_IDLE,
    apiGetAreaCodeByState: STATUS_IDLE,
    apiGetStates: STATUS_IDLE,
    apiGetAllPlanList: STATUS_IDLE,
    apiContactFieldList: STATUS_IDLE,
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
        (state.apiGetAreaCodeList= STATUS_IDLE);
        (state.apiGetAreaCodeByState= STATUS_IDLE);
        (state.apiGetStates= STATUS_IDLE);
        (state.apiGetAllPlanList= STATUS_IDLE);
        (state.apiContactFieldList= STATUS_IDLE);
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

    builder.addCase(Get_Area_Code_List.pending, (state, action) => {
      state.apiGetAreaCodeList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Area_Code_List.fulfilled, (state, action) => {
      Log('Get_Area_Code_List fulfilled : ', JSON.stringify(action));
      state.apiGetAreaCodeList = STATUS_FULFILLED;
      state.area_code = action.payload?.data?.data
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Area_Code_List.rejected, (state, action) => {
      Log('Get_Area_Code_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetAreaCodeList = STATUS_REJECTED;
    });

    builder.addCase(Get_Area_Code_By_State.pending, (state, action) => {
      state.apiGetAreaCodeByState = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Area_Code_By_State.fulfilled, (state, action) => {
      Log('Get_Area_Code_By_State fulfilled : ', JSON.stringify(action));
      state.apiGetAreaCodeByState = STATUS_FULFILLED;
      state.area_code = action.payload?.data
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Area_Code_By_State.rejected, (state, action) => {
      Log('Get_Area_Code_By_State rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetAreaCodeByState = STATUS_REJECTED;
    });

    builder.addCase(Get_States.pending, (state, action) => {
      state.apiGetStates = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_States.fulfilled, (state, action) => {
      Log('Get_States fulfilled : ', JSON.stringify(action));
      state.apiGetStates = STATUS_FULFILLED;
      state.state = action.payload?.data
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_States.rejected, (state, action) => {
      Log('Get_States rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetStates = STATUS_REJECTED;
    });

    builder.addCase(Get_Plan_List.pending, (state, action) => {
      state.apiGetAllPlanList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Plan_List.fulfilled, (state, action) => {
      Log('Get_Plan_List fulfilled : ', JSON.stringify(action));
      state.apiGetAllPlanList = STATUS_FULFILLED;
      state.plan_list = action.payload?.data
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Plan_List.rejected, (state, action) => {
      Log('Get_Plan_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetAllPlanList = STATUS_REJECTED;
    });

    builder.addCase(Get_Conatact_Field_List.pending, (state, action) => {
      state.apiContactFieldList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Conatact_Field_List.fulfilled, (state, action) => {
      Log('Get_Conatact_Field_List fulfilled : ', JSON.stringify(action));
      state.apiContactFieldList = STATUS_FULFILLED;
      state.contact_field_list = action.payload?.data
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Conatact_Field_List.rejected, (state, action) => {
      Log('Get_Conatact_Field_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiContactFieldList = STATUS_REJECTED;
    });
  },
});

// Action creators are generated for each case reducer function
export const {storeCallsData, clearData, resetGeneralApiStatus} = generalReducer.actions;


export default generalReducer.reducer;
