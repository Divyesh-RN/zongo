import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Create_Group, Delete_Group_Member, Get_Group_List_Chat, Get_Group_User_Details, Get_Internal_Chat_Log_User, Get_Message_Notification, Get_User_List_Chat, Send_Chat_File, Send_Message, Update_Group, Update_Group_Name } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const InternalChatReducer = createSlice({
  name: 'internalChatRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',
    make_call_user_log_api :false,
    user_list_chat: null,
    group_list_chat: null,
    perticular_user_chat_log : null,
    group_user_details : null,
    message_notification:0,
    apiGetUserListChat: STATUS_IDLE,
    apiGetGroupListChat: STATUS_IDLE,
    apiGetInternalChatLogUser: STATUS_IDLE,
    apiGetGroupUserDetails: STATUS_IDLE,
    apiUpdateGroup: STATUS_IDLE,
    apiUpdateGroupName: STATUS_IDLE,
    apiDeleteGroupMember: STATUS_IDLE,
    apiCreateGroup: STATUS_IDLE,
    apiSendMessage: STATUS_IDLE,
    apiSendChatFile: STATUS_IDLE,
    apiGetMessageNotification: STATUS_IDLE,
  },

  reducers: {
    resetInternalChatStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiGetUserListChat= STATUS_IDLE);
        (state.apiGetGroupListChat= STATUS_IDLE);
        (state.apiGetInternalChatLogUser= STATUS_IDLE);
        (state.apiGetGroupUserDetails= STATUS_IDLE);
        (state.apiUpdateGroup= STATUS_IDLE);
        (state.apiUpdateGroupName= STATUS_IDLE);
        (state.apiDeleteGroupMember= STATUS_IDLE);
        (state.apiCreateGroup= STATUS_IDLE);
        (state.apiSendMessage= STATUS_IDLE);
        (state.apiSendChatFile= STATUS_IDLE);
        (state.apiGetMessageNotification= STATUS_IDLE);

    },
    clearAllChatData: state => {
      state.user_list_chat = null;
      state.group_list_chat = null;
      state.perticular_user_chat_log = null;
      state.group_user_details = null;
    },
    makeCallUserLogApi: (state, action) => {
        console.log("action :",action)
        state.make_call_user_log_api = action.payload;
      },
  },
  extraReducers: builder => {
    builder.addCase(Get_User_List_Chat.pending, (state, action) => {
      state.apiGetUserListChat = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_User_List_Chat.fulfilled, (state, action) => {
      // Log('Get_User_List_Chat fulfilled : ', JSON.stringify(action));
      state.apiGetUserListChat = STATUS_FULFILLED;
      state.isLoader = false;
      state.user_list_chat = action.payload?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_User_List_Chat.rejected, (state, action) => {
      Log('Get_User_List_Chat rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetUserListChat = STATUS_REJECTED;
    });

    builder.addCase(Get_Group_List_Chat.pending, (state, action) => {
        state.apiGetGroupListChat = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Group_List_Chat.fulfilled, (state, action) => {
        // Log('Get_Group_List_Chat fulfilled : ', JSON.stringify(action));
        state.apiGetGroupListChat = STATUS_FULFILLED;
        state.isLoader = false;
        state.group_list_chat = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Group_List_Chat.rejected, (state, action) => {
        Log('Get_Group_List_Chat rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetGroupListChat = STATUS_REJECTED;
      });

      builder.addCase(Get_Internal_Chat_Log_User.pending, (state, action) => {
        state.apiGetInternalChatLogUser = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Internal_Chat_Log_User.fulfilled, (state, action) => {
        // Log('Get_Internal_Chat_Log_User fulfilled : ', JSON.stringify(action));
        state.apiGetInternalChatLogUser = STATUS_FULFILLED;
        state.isLoader = false;
        state.perticular_user_chat_log = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Internal_Chat_Log_User.rejected, (state, action) => {
        Log('Get_Internal_Chat_Log_User rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetInternalChatLogUser = STATUS_REJECTED;
      });

      builder.addCase(Get_Group_User_Details.pending, (state, action) => {
        state.apiGetGroupUserDetails = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Group_User_Details.fulfilled, (state, action) => {
        // Log('Get_Group_User_Details fulfilled : ', JSON.stringify(action));
        state.apiGetGroupUserDetails = STATUS_FULFILLED;
        state.isLoader = false;
        state.group_user_details = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Group_User_Details.rejected, (state, action) => {
        Log('Get_Group_User_Details rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetGroupUserDetails = STATUS_REJECTED;
      });

      builder.addCase(Update_Group.pending, (state, action) => {
        state.apiUpdateGroup = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Group.fulfilled, (state, action) => {
        // Log('Update_Group fulfilled : ', JSON.stringify(action));
        state.apiUpdateGroup = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Group.rejected, (state, action) => {
        Log('Update_Group rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateGroup = STATUS_REJECTED;
      });

      builder.addCase(Update_Group_Name.pending, (state, action) => {
        state.apiUpdateGroupName = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Group_Name.fulfilled, (state, action) => {
        // Log('Update_Group_Name fulfilled : ', JSON.stringify(action));
        state.apiUpdateGroupName = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_Group_Name.rejected, (state, action) => {
        Log('Update_Group_Name rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateGroupName = STATUS_REJECTED;
      });

      builder.addCase(Delete_Group_Member.pending, (state, action) => {
        state.apiDeleteGroupMember = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Delete_Group_Member.fulfilled, (state, action) => {
        // Log('Delete_Group_Member fulfilled : ', JSON.stringify(action));
        state.apiDeleteGroupMember = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Delete_Group_Member.rejected, (state, action) => {
        Log('Delete_Group_Member rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiDeleteGroupMember = STATUS_REJECTED;
      });

      builder.addCase(Create_Group.pending, (state, action) => {
        state.apiCreateGroup = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Create_Group.fulfilled, (state, action) => {
        // Log('Create_Group fulfilled : ', JSON.stringify(action));
        state.apiCreateGroup = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Create_Group.rejected, (state, action) => {
        Log('Create_Group rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiCreateGroup = STATUS_REJECTED;
      });

      builder.addCase(Send_Message.pending, (state, action) => {
        state.apiSendMessage = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Send_Message.fulfilled, (state, action) => {
        // Log('Send_Message fulfilled : ', JSON.stringify(action));
        state.apiSendMessage = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Send_Message.rejected, (state, action) => {
        Log('Send_Message rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiSendMessage = STATUS_REJECTED;
      });

      builder.addCase(Send_Chat_File.pending, (state, action) => {
        state.apiSendChatFile = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Send_Chat_File.fulfilled, (state, action) => {
        // Log('Send_Chat_File fulfilled : ', JSON.stringify(action));
        state.apiSendChatFile = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Send_Chat_File.rejected, (state, action) => {
        Log('Send_Chat_File rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiSendChatFile = STATUS_REJECTED;
      });

      builder.addCase(Get_Message_Notification.pending, (state, action) => {
        state.apiGetMessageNotification = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Message_Notification.fulfilled, (state, action) => {
        // Log('Get_Message_Notification fulfilled : ', JSON.stringify(action?.payload?.data));
        state.apiGetMessageNotification = STATUS_FULFILLED;
        state.isLoader = false;
        state.message_notification = action?.payload?.data !== "" ? action.payload?.data : 0;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Message_Notification.rejected, (state, action) => {
        Log('Get_Message_Notification rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetMessageNotification = STATUS_REJECTED;
      });
  },
});

// Action creators are generated for each case reducer function
export const { clearAllChatData, resetInternalChatStatus,makeCallUserLogApi} = InternalChatReducer.actions;
export default InternalChatReducer.reducer;
