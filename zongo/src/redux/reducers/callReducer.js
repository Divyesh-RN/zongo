import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Create_Extension, Get_Extension_Details, Get_Local_Extension, Get_Next_Extension, Update_Extension } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const callsReducer = createSlice({
  name: 'callRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',

    calls_data: null,
    get_next_extension_data: null,
    extension_details_data: null,
    create_extension_data: null,
    apiGetCallList: STATUS_IDLE,
    apiGetExtensionDetails: STATUS_IDLE,
    apiUpdateExtesnion: STATUS_IDLE,
    apiGetNextExtesnion: STATUS_IDLE,
    apiCreateExtesnion: STATUS_IDLE,
  },

  reducers: {
    resetApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiGetCallList = STATUS_IDLE);
        (state.apiGetExtensionDetails = STATUS_IDLE);
        (state.apiUpdateExtesnion = STATUS_IDLE);
        (state.apiGetNextExtesnion = STATUS_IDLE);
        (state.apiCreateExtesnion = STATUS_IDLE);
    },
    storeCallsData: (state, action) => {
      state.calls_data = action.payload;
    },
    clearData: state => {
      state.calls_data = null;
      state.extension_details_data = null;
      state.get_next_extension_data = null;
      state.create_extension_data = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_Local_Extension.pending, (state, action) => {
      state.apiGetCallList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Local_Extension.fulfilled, (state, action) => {
      // Log('Get_Local_Extension fulfilled : ', JSON.stringify(action));
      state.apiGetCallList = STATUS_FULFILLED;
      state.isLoader = false;
      state.calls_data = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Local_Extension.rejected, (state, action) => {
      Log('Get_Local_Extension rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetCallList = STATUS_REJECTED;
    });


    builder.addCase(Get_Extension_Details.pending, (state, action) => {
      state.apiGetExtensionDetails = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Extension_Details.fulfilled, (state, action) => {
      Log('Get_Extension_Details fulfilled : ', JSON.stringify(action));
      state.apiGetExtensionDetails = STATUS_FULFILLED;
      state.isLoader = false;
      state.extension_details_data = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Extension_Details.rejected, (state, action) => {
      Log('Get_Extension_Details rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetExtensionDetails = STATUS_REJECTED;
    });

    builder.addCase(Get_Next_Extension.pending, (state, action) => {
      state.apiGetNextExtesnion = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Next_Extension.fulfilled, (state, action) => {
      Log('\Get_Next_Extension fulfilled : ', JSON.stringify(action));
      state.apiGetNextExtesnion = STATUS_FULFILLED;
      state.isLoader = false;
      state.get_next_extension_data = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Next_Extension.rejected, (state, action) => {
      Log('Get_Next_Extension rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetNextExtesnion = STATUS_REJECTED;
    });

    builder.addCase(Update_Extension.pending, (state, action) => {
      state.apiUpdateExtesnion = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Extension.fulfilled, (state, action) => {
      Log('Update_Extension fulfilled : ', JSON.stringify(action));
      state.apiUpdateExtesnion = STATUS_FULFILLED;
      state.isLoader = false;
      // state.calls_data = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Extension.rejected, (state, action) => {
      Log('Update_Extension rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUpdateExtesnion = STATUS_REJECTED;
    });

    builder.addCase(Create_Extension.pending, (state, action) => {
      state.apiCreateExtesnion = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Create_Extension.fulfilled, (state, action) => {
      Log('Create_Extension fulfilled : ', JSON.stringify(action));
      state.apiCreateExtesnion = STATUS_FULFILLED;
      state.isLoader = false;
      state.create_extension_data = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Create_Extension.rejected, (state, action) => {
      Log('Create_Extension rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiCreateExtesnion = STATUS_REJECTED;
    });
  },
});

// Action creators are generated for each case reducer function
export const {storeCallsData, clearData, resetApiStatus} = callsReducer.actions;


export default callsReducer.reducer;
