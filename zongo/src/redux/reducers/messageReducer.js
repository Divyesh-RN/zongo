import {createSlice} from '@reduxjs/toolkit';
import {
  STATUS_FULFILLED,
  STATUS_IDLE,
  STATUS_PENDING,
  STATUS_REJECTED,
} from '../../constants/ConstantKey';
import { Get_Sms_Chat, Send_sms, Sms_Chat_Contact_List} from '../api/Api';
import {Log} from '../../commonComponents/Log';

export const MessageReducer = createSlice({
  name: 'messageRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',
    contact_data: [],
    sms_chat_data:[],
    apiSmsChatContactList: STATUS_IDLE,
    apiGetSmsChat: STATUS_IDLE,
    apiSendSms: STATUS_IDLE,
  },

  reducers: {
    resetApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiSmsChatContactList = STATUS_IDLE);
        (state.apiGetSmsChat = STATUS_IDLE);
        (state.apiSendSms = STATUS_IDLE);
    },
    storeContactData: (state, action) => {
      state.contact_data = action.payload;
    },
    storeSmsChatData: (state, action) => {
      state.sms_chat_data = action.payload;
    },
    clearData: state => {
      state.contact_data = null;
      state. sms_chat_data= []
    },
  },
  extraReducers: builder => {
    builder.addCase(Sms_Chat_Contact_List.pending, (state, action) => {
      state.apiSmsChatContactList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Sms_Chat_Contact_List.fulfilled, (state, action) => {
      Log('Sms_Chat_Contact_List fulfilled : ', JSON.stringify(action));
      state.apiSmsChatContactList = STATUS_FULFILLED;
      state.isLoader = false;
      state.contact_data = action.payload;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Sms_Chat_Contact_List.rejected, (state, action) => {
      Log('Sms_Chat_Contact_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiSmsChatContactList = STATUS_REJECTED;
    });

    builder.addCase(Get_Sms_Chat.pending, (state, action) => {
      state.apiGetSmsChat = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Sms_Chat.fulfilled, (state, action) => {
      Log('Get_Sms_Chat fulfilled : ', JSON.stringify(action));
      state.apiGetSmsChat = STATUS_FULFILLED;
      state.isLoader = false;
      state.sms_chat_data = action.payload;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Sms_Chat.rejected, (state, action) => {
      Log('Get_Sms_Chat rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetSmsChat = STATUS_REJECTED;
    });


    builder.addCase(Send_sms.pending, (state, action) => {
      state.apiSendSms = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Send_sms.fulfilled, (state, action) => {
      Log('Send_sms fulfilled : ', JSON.stringify(action));
      state.apiSendSms = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Send_sms.rejected, (state, action) => {
      Log('Send_sms rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiSendSms = STATUS_REJECTED;
    });


  },
});

// Action creators are generated for each case reducer function
export const {storeContactData, clearData, resetApiStatus} = MessageReducer.actions;


export default MessageReducer.reducer;
