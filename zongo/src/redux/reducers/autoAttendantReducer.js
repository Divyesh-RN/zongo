import { createSlice } from '@reduxjs/toolkit';
import { Create_Auto_Attendant, Delete_Auto_Attendant, Get_Auto_Attendant_Details, Get_Auto_Attendant_List, Get_Auto_Attendant_Next_Id, Update_Auto_Attendant, Update_Auto_Attendant_Options } from '../api/Api';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Log } from '../../commonComponents/Log';

export const AutoAttendantReducer = createSlice({
  name: 'AutoAttendantRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',
    auto_attendant_list: null,
    auto_attendant_next_id: null,
    auto_attendant_details: null,
    apiAutoAttendantList: STATUS_IDLE,
    apiDeleteAutoAttendant: STATUS_IDLE,
    apiAutoAttendantDetails: STATUS_IDLE,
    apiUpdateAttendant: STATUS_IDLE,
    apiUpdateAutoAttendantOptions: STATUS_IDLE,
    apiGetAutoAttendantNextId: STATUS_IDLE,
    apiCreateAutoAttendant: STATUS_IDLE,
  },

  reducers: {
    resetAutoAttendantApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiAutoAttendantList = STATUS_IDLE),
        (state.apiDeleteAutoAttendant = STATUS_IDLE),
        (state.apiAutoAttendantDetails = STATUS_IDLE),
        (state.apiUpdateAutoAttendantOptions = STATUS_IDLE),
        (state.apiUpdateAttendant = STATUS_IDLE),
        (state.apiGetAutoAttendantNextId = STATUS_IDLE),
        (state.apiCreateAutoAttendant = STATUS_IDLE)
    },
    clearAutoAttendantData: state => {
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_Auto_Attendant_List.pending, (state, action) => {
        state.apiAutoAttendantList = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Auto_Attendant_List.fulfilled, (state, action) => {
        // Log('Get_Auto_Attendant_List fulfilled : ', JSON.stringify(action));
        state.apiAutoAttendantList = STATUS_FULFILLED;
        state.isLoader = false;
        state.auto_attendant_list = action.payload?.data?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Auto_Attendant_List.rejected, (state, action) => {
        Log('Get_Auto_Attendant_List rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiAutoAttendantList = STATUS_REJECTED;
      });

      builder.addCase(Delete_Auto_Attendant.pending, (state, action) => {
        state.apiDeleteAutoAttendant = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Delete_Auto_Attendant.fulfilled, (state, action) => {
        // Log('Delete_Auto_Attendant fulfilled : ', JSON.stringify(action));
        state.apiDeleteAutoAttendant = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Delete_Auto_Attendant.rejected, (state, action) => {
        Log('Delete_Auto_Attendant rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiDeleteAutoAttendant = STATUS_REJECTED;
      });

      builder.addCase(Get_Auto_Attendant_Details.pending, (state, action) => {
        state.apiAutoAttendantDetails = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Auto_Attendant_Details.fulfilled, (state, action) => {
        // Log('Get_Auto_Attendant_Details fulfilled : ', JSON.stringify(action));
        state.apiAutoAttendantDetails = STATUS_FULFILLED;
        state.isLoader = false;
        state.auto_attendant_details = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Auto_Attendant_Details.rejected, (state, action) => {
        Log('Get_Auto_Attendant_Details rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiAutoAttendantDetails = STATUS_REJECTED;
      });

      builder.addCase(Update_Auto_Attendant_Options.pending, (state, action) => {
        state.apiUpdateAutoAttendantOptions = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Auto_Attendant_Options.fulfilled, (state, action) => {
        // Log('Update_Auto_Attendant_Options fulfilled : ', JSON.stringify(action));
        state.apiUpdateAutoAttendantOptions = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Auto_Attendant_Options.rejected, (state, action) => {
        Log('Update_Auto_Attendant_Options rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateAutoAttendantOptions = STATUS_REJECTED;
      });

      builder.addCase(Update_Auto_Attendant.pending, (state, action) => {
        state.apiUpdateAttendant = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Auto_Attendant.fulfilled, (state, action) => {
        // Log('Update_Auto_Attendant fulfilled : ', JSON.stringify(action));
        state.apiUpdateAttendant = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Auto_Attendant.rejected, (state, action) => {
        Log('Update_Auto_Attendant rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateAttendant = STATUS_REJECTED;
      });

      builder.addCase(Get_Auto_Attendant_Next_Id.pending, (state, action) => {
        state.apiGetAutoAttendantNextId = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Auto_Attendant_Next_Id.fulfilled, (state, action) => {
        Log('Get_Auto_Attendant_Next_Id fulfilled : ', JSON.stringify(action));
        state.apiGetAutoAttendantNextId = STATUS_FULFILLED;
        state.isLoader = false;
        state.auto_attendant_next_id = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Auto_Attendant_Next_Id.rejected, (state, action) => {
        Log('Get_Auto_Attendant_Next_Id rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetAutoAttendantNextId = STATUS_REJECTED;
      });

      builder.addCase(Create_Auto_Attendant.pending, (state, action) => {
        state.apiCreateAutoAttendant = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Create_Auto_Attendant.fulfilled, (state, action) => {
        Log('Create_Auto_Attendant fulfilled : ', JSON.stringify(action));
        state.apiCreateAutoAttendant = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Create_Auto_Attendant.rejected, (state, action) => {
        Log('Create_Auto_Attendant rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiCreateAutoAttendant = STATUS_REJECTED;
      });

  },
});

// Action creators are generated for each case reducer function
export const {clearAutoAttendantData, resetAutoAttendantApiStatus} = AutoAttendantReducer.actions;


export default AutoAttendantReducer.reducer;
