import {createSlice} from '@reduxjs/toolkit';
import {
  STATUS_FULFILLED,
  STATUS_IDLE,
  STATUS_PENDING,
  STATUS_REJECTED,
} from '../../constants/ConstantKey';
import { Create_Sms_Template, Delete_Sms_Template, Get_Sms_Chat, Get_Sms_Template_Details, Get_Sms_Template_List, Get_User_Assign_List, Send_sms, Sms_Chat_All_Contact_List, Sms_Chat_Contact_List, Sms_Log, Sms_Template_List, Update_Sms_Template} from '../api/Api';
import {Log} from '../../commonComponents/Log';

export const MessageReducer = createSlice({
  name: 'messageRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',
    contact_data: [],
    sms_chat_data:[],
    sms_chat_user_assign_list:null,
    sms_template_list:null,
    sms_template_list_module:null,
    sms_template_details:null,
    sms_log:null,
    sms_all_contact_list:null,
    apiSmsChatContactList: STATUS_IDLE,
    apiGetSmsChat: STATUS_IDLE,
    apiSendSms: STATUS_IDLE,
    apiGetUserAssignList: STATUS_IDLE,
    apiGetSmsTemplateList: STATUS_IDLE,
    apiGetSmsTemplateDetails: STATUS_IDLE,
    apiSmsLog: STATUS_IDLE,
    apiSmsChatAllContactList: STATUS_IDLE,
    apiSmsTemplateList: STATUS_IDLE,
    apiUpdateSmsTemplate: STATUS_IDLE,
    apiCreateSmsTemplate: STATUS_IDLE,
    apiDeleteSmsTemplate: STATUS_IDLE,
  },

  reducers: {
    resetApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiSmsChatContactList = STATUS_IDLE);
        (state.apiGetSmsChat = STATUS_IDLE);
        (state.apiSendSms = STATUS_IDLE);
        (state.apiGetUserAssignList = STATUS_IDLE);
        (state.apiGetSmsTemplateList = STATUS_IDLE);
        (state.apiGetSmsTemplateDetails = STATUS_IDLE);
        (state.apiSmsLog = STATUS_IDLE);
        (state.apiSmsChatAllContactList = STATUS_IDLE);
        (state.apiSmsTemplateList = STATUS_IDLE);
        (state.apiUpdateSmsTemplate = STATUS_IDLE);
        (state.apiCreateSmsTemplate = STATUS_IDLE);
        (state.apiDeleteSmsTemplate = STATUS_IDLE);
    },
    storeContactData: (state, action) => {
      state.contact_data = action.payload;
    },
    storeSmsChatData: (state, action) => {
      state.sms_chat_data = action.payload;
    },
    clearData: state => {
      state.contact_data = null;
      state.sms_chat_data= []
      state.sms_chat_user_assign_list= null
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
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Sms_Chat.fulfilled, (state, action) => {
      Log('Get_Sms_Chat fulfilled : ', JSON.stringify(action?.payload));
      state.apiGetSmsChat = STATUS_FULFILLED;
      state.isLoader = false;
      state.sms_chat_data = action.payload?.data?.data;
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

    builder.addCase(Get_User_Assign_List.pending, (state, action) => {
      state.apiGetUserAssignList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_User_Assign_List.fulfilled, (state, action) => {
      Log('Get_User_Assign_List fulfilled : ', JSON.stringify(action));
      state.apiGetUserAssignList = STATUS_FULFILLED;
      state.isLoader = false;
      state.sms_chat_user_assign_list = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_User_Assign_List.rejected, (state, action) => {
      Log('Get_User_Assign_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetUserAssignList = STATUS_REJECTED;
    });

    builder.addCase(Get_Sms_Template_List.pending, (state, action) => {
      state.apiGetSmsTemplateList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Sms_Template_List.fulfilled, (state, action) => {
      Log('Get_Sms_Template_List fulfilled : ', JSON.stringify(action));
      state.apiGetSmsTemplateList = STATUS_FULFILLED;
      state.isLoader = false;
      state.sms_template_list = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Sms_Template_List.rejected, (state, action) => {
      Log('Get_Sms_Template_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetSmsTemplateList = STATUS_REJECTED;
    });

    builder.addCase(Get_Sms_Template_Details.pending, (state, action) => {
      state.apiGetSmsTemplateDetails = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Sms_Template_Details.fulfilled, (state, action) => {
      Log('Get_Sms_Template_Details fulfilled : ', JSON.stringify(action));
      state.apiGetSmsTemplateDetails = STATUS_FULFILLED;
      state.isLoader = false;
      state.sms_template_details = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Sms_Template_Details.rejected, (state, action) => {
      Log('Get_Sms_Template_Details rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetSmsTemplateDetails = STATUS_REJECTED;
    });

    builder.addCase(Sms_Log.pending, (state, action) => {
      state.apiSmsLog = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Sms_Log.fulfilled, (state, action) => {
      Log('Sms_Log fulfilled : ', JSON.stringify(action));
      state.apiSmsLog = STATUS_FULFILLED;
      state.isLoader = false;
      state.sms_log = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Sms_Log.rejected, (state, action) => {
      Log('Sms_Log rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiSmsLog = STATUS_REJECTED;
    });

    builder.addCase(Sms_Chat_All_Contact_List.pending, (state, action) => {
      state.apiSmsChatAllContactList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Sms_Chat_All_Contact_List.fulfilled, (state, action) => {
      Log('Sms_Chat_All_Contact_List fulfilled : ', JSON.stringify(action));
      state.apiSmsChatAllContactList = STATUS_FULFILLED;
      state.isLoader = false;
      state.sms_all_contact_list = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Sms_Chat_All_Contact_List.rejected, (state, action) => {
      Log('Sms_Chat_All_Contact_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiSmsChatAllContactList = STATUS_REJECTED;
    });

    builder.addCase(Sms_Template_List.pending, (state, action) => {
      state.apiSmsTemplateList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Sms_Template_List.fulfilled, (state, action) => {
      Log('Sms_Template_List fulfilled : ', JSON.stringify(action));
      state.apiSmsTemplateList = STATUS_FULFILLED;
      state.isLoader = false;
      state.sms_template_list_module = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Sms_Template_List.rejected, (state, action) => {
      Log('Sms_Template_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiSmsTemplateList = STATUS_REJECTED;
    });

    builder.addCase(Update_Sms_Template.pending, (state, action) => {
      state.apiUpdateSmsTemplate = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Sms_Template.fulfilled, (state, action) => {
      Log('Update_Sms_Template fulfilled : ', JSON.stringify(action));
      state.apiUpdateSmsTemplate = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Sms_Template.rejected, (state, action) => {
      Log('Update_Sms_Template rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUpdateSmsTemplate = STATUS_REJECTED;
    });

    builder.addCase(Create_Sms_Template.pending, (state, action) => {
      state.apiCreateSmsTemplate = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Create_Sms_Template.fulfilled, (state, action) => {
      Log('Create_Sms_Template fulfilled : ', JSON.stringify(action));
      state.apiCreateSmsTemplate = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Create_Sms_Template.rejected, (state, action) => {
      Log('Create_Sms_Template rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiCreateSmsTemplate = STATUS_REJECTED;
    });


    builder.addCase(Delete_Sms_Template.pending, (state, action) => {
      state.apiDeleteSmsTemplate = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Sms_Template.fulfilled, (state, action) => {
      Log('Delete_Sms_Template fulfilled : ', JSON.stringify(action));
      state.apiDeleteSmsTemplate = STATUS_FULFILLED;
      state.isLoader = false;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Sms_Template.rejected, (state, action) => {
      Log('Delete_Sms_Template rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiDeleteSmsTemplate = STATUS_REJECTED;
    });

  },
});

// Action creators are generated for each case reducer function
export const {storeContactData, clearData, resetApiStatus} = MessageReducer.actions;


export default MessageReducer.reducer;
