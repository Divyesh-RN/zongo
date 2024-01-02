import {createSlice} from '@reduxjs/toolkit';
import {STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED} from '../../constants/ConstantKey';
import { AuthLogin, Get_User_Extension } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const userReducer = createSlice({
  name: 'userRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',

    user_data: null,
    apiLoginStatus: STATUS_IDLE,
    apiGetUserExtension: STATUS_IDLE,
    user_extension_data : null,
    user_register_status : false,
    user_agent : {}
  },

  reducers: {
    resetApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiLoginStatus = STATUS_IDLE);
        (state.apiGetUserExtension= STATUS_IDLE);
    },
    storeUserData: (state, action) => {
      state.user_data = action.payload;
    },
    storeUseExtensionData: (state, action) => {
      state.user_extension_data = action.payload;
    },
    storeUseStatus: (state, action) => {
      state.user_register_status = action.payload;
    }, 
    storeUseAgent: (state, action) => {
      state.user_agent = action.payload;
    },
    clearData: state => {
      state.user_data = null;
      state.user_extension_data = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(AuthLogin.pending, (state, action) => {
      state.apiLoginStatus = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(AuthLogin.fulfilled, (state, action) => {
      Log('AuthLogin fulfilled : ', JSON.stringify(action));
      state.apiLoginStatus = STATUS_FULFILLED;
      state.isLoader = false;
      state.user_data = action.payload;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(AuthLogin.rejected, (state, action) => {
      Log('AuthLogin rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiLoginStatus = STATUS_REJECTED;
    });


    builder.addCase(Get_User_Extension.pending, (state, action) => {
      state.apiGetUserExtension = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_User_Extension.fulfilled, (state, action) => {
      Log('Get_User_Extension fulfilled : ', JSON.stringify(action));
      state.apiGetUserExtension = STATUS_FULFILLED;
      state.isLoader = false;
      state.user_extension_data = action.payload;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_User_Extension.rejected, (state, action) => {
      Log('Get_User_Extension rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetUserExtension = STATUS_REJECTED;
    });
  },
});

// Action creators are generated for each case reducer function
export const {storeUserData,storeUseAgent, storeUseExtensionData, clearData, resetApiStatus,storeUseStatus} = userReducer.actions;

export const user_data = state => state.userRedux.user_data;

export default userReducer.reducer;
