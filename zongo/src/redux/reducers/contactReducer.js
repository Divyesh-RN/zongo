import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Get_Contacts_List } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const contactReducer = createSlice({
  name: 'contactRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',

    contacts_data: null,
    apiGetContactsList: STATUS_IDLE,
  },

  reducers: {
    resetApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiGetContactsList = STATUS_IDLE);
    },
    storeContactData: (state, action) => {
      state.contacts_data = action.payload;
    },
    clearData: state => {
      state.contacts_data = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_Contacts_List.pending, (state, action) => {
      state.apiGetContactsList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Contacts_List.fulfilled, (state, action) => {
      Log('Get_Contacts_List fulfilled : ', JSON.stringify(action));
      state.apiGetContactsList = STATUS_FULFILLED;
      state.isLoader = false;
      state.contacts_data = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Contacts_List.rejected, (state, action) => {
      Log('Get_Contacts_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetContactsList = STATUS_REJECTED;
    });
  },
});

// Action creators are generated for each case reducer function
export const {storeContactData, clearData, resetApiStatus} = contactReducer.actions;


export default contactReducer.reducer;
