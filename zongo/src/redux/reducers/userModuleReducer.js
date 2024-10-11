import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Copy_User_Time_Slot, Cretae_User, Delete_User_Time_Slot, Extension_Update_Time_Slot, Get_Extension_List_Dropdown, Get_Language_List, Get_Number_List_Dropdown, Get_Role_List_Dp, Get_Time_Zone_List, Get_User_Availablity_Details, Get_User_Details, Get_User_List, Get_User_Time_Availablity_Details, Group_List, Update_User, Update_User_group, User_Create_Time_Slot, User_Delete } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const userModuleReducer = createSlice({
  name: 'userModuleRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',
    user_list: null,
    user_details: null,
    time_zone_list: null,
    language_list: null,
    role_list: null,
    number_list: null,
    group_list: null,
    user_availability_details: null,
    user_availability_time_details: null,
    extension_list: null,
    apiGetUserList: STATUS_IDLE,
    apiUserDelete: STATUS_IDLE,
    apiGetRoleDp: STATUS_IDLE,
    apiCreateUser: STATUS_IDLE,
    apiGetUserDetails: STATUS_IDLE,
    apiGetTimeZoneList: STATUS_IDLE,
    apiGetLanguageList: STATUS_IDLE,
    apiGetNumberList: STATUS_IDLE,
    apiGetExtensionListDropDown: STATUS_IDLE,
    apiGetGroupList: STATUS_IDLE,
    apiUpdateUserGroup: STATUS_IDLE,
    apiGetUserAvailabilityDetails: STATUS_IDLE,
    apiGetUserAvailabilityTimeDetails: STATUS_IDLE,
    apiUpdateUser: STATUS_IDLE,
    apiExtensionUpdateTimeSlot: STATUS_IDLE,
    apiUserCreateTimeSlot: STATUS_IDLE,
    apiCopyUserTimeSlot: STATUS_IDLE,
    apiDeleteUserTimeSlot: STATUS_IDLE,
  },

  reducers: {
    resetUserModuleApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiGetUserList = STATUS_IDLE);
        (state.apiUserDelete = STATUS_IDLE);
        (state.apiGetRoleDp = STATUS_IDLE);
        (state.apiCreateUser = STATUS_IDLE);
        (state.apiGetUserDetails = STATUS_IDLE);
        (state.apiGetTimeZoneList = STATUS_IDLE);
        (state.apiGetLanguageList = STATUS_IDLE);
        (state.apiGetNumberList = STATUS_IDLE);
        (state.apiGetExtensionListDropDown = STATUS_IDLE);
        (state.apiGetGroupList = STATUS_IDLE);
        (state.apiUpdateUserGroup = STATUS_IDLE);
        (state.apiGetUserAvailabilityDetails = STATUS_IDLE);
        (state.apiGetUserAvailabilityTimeDetails = STATUS_IDLE);
        (state.apiUpdateUser = STATUS_IDLE);
        (state.apiExtensionUpdateTimeSlot = STATUS_IDLE);
        (state.apiUserCreateTimeSlot = STATUS_IDLE);
        (state.apiCopyUserTimeSlot = STATUS_IDLE);
        (state.apiDeleteUserTimeSlot = STATUS_IDLE);
        
    },
    storeUserData: (state, action) => {
      state.user_list = action.payload;
    },
    clearData: state => {
      state.user_list = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_User_List.pending, (state, action) => {
      state.apiGetUserList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_User_List.fulfilled, (state, action) => {
      Log('Get_User_List fulfilled : ', JSON.stringify(action));
      state.apiGetUserList = STATUS_FULFILLED;
      state.isLoader = false;
      state.user_list = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_User_List.rejected, (state, action) => {
      Log('Get_User_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetUserList = STATUS_REJECTED;
    });

    builder.addCase(User_Delete.pending, (state, action) => {
        state.apiUserDelete = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(User_Delete.fulfilled, (state, action) => {
        Log('User_Delete fulfilled : ', JSON.stringify(action));
        state.apiUserDelete = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(User_Delete.rejected, (state, action) => {
        Log('User_Delete rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUserDelete = STATUS_REJECTED;
      });

      builder.addCase(Get_Role_List_Dp.pending, (state, action) => {
        state.apiGetRoleDp = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Role_List_Dp.fulfilled, (state, action) => {
        Log('Get_Role_List_Dp fulfilled : ', JSON.stringify(action));
        state.apiGetRoleDp = STATUS_FULFILLED;
        state.isLoader = false;
        state.role_list = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Role_List_Dp.rejected, (state, action) => {
        Log('Get_Role_List_Dp rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetRoleDp = STATUS_REJECTED;
      });

      builder.addCase(Cretae_User.pending, (state, action) => {
        state.apiCreateUser = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Cretae_User.fulfilled, (state, action) => {
        Log('Cretae_User fulfilled : ', JSON.stringify(action));
        state.apiCreateUser = STATUS_FULFILLED;
        state.isLoader = false;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Cretae_User.rejected, (state, action) => {
        Log('Cretae_User rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiCreateUser = STATUS_REJECTED;
      });

      builder.addCase(Get_User_Details.pending, (state, action) => {
        state.apiGetUserDetails = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_User_Details.fulfilled, (state, action) => {
        // Log('Get_User_Details fulfilled : ', JSON.stringify(action));
        state.apiGetUserDetails = STATUS_FULFILLED;
        state.isLoader = false;
        state.user_details = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_User_Details.rejected, (state, action) => {
        Log('Get_User_Details rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetUserDetails = STATUS_REJECTED;
      });

      builder.addCase(Get_Time_Zone_List.pending, (state, action) => {
        state.apiGetTimeZoneList = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Time_Zone_List.fulfilled, (state, action) => {
        // Log('Get_Time_Zone_List fulfilled : ', JSON.stringify(action));
        state.apiGetTimeZoneList = STATUS_FULFILLED;
        state.isLoader = false;
        state.time_zone_list = action.payload?.data?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Time_Zone_List.rejected, (state, action) => {
        Log('Get_Time_Zone_List rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetTimeZoneList = STATUS_REJECTED;
      });

      builder.addCase(Get_Language_List.pending, (state, action) => {
        state.apiGetLanguageList = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Language_List.fulfilled, (state, action) => {
        Log('Get_Language_List fulfilled : ', JSON.stringify(action));
        state.apiGetLanguageList = STATUS_FULFILLED;
        state.isLoader = false;
        state.language_list = action.payload?.data?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Language_List.rejected, (state, action) => {
        Log('Get_Language_List rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetLanguageList = STATUS_REJECTED;
      });

      builder.addCase(Get_Number_List_Dropdown.pending, (state, action) => {
        state.apiGetNumberList = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Number_List_Dropdown.fulfilled, (state, action) => {
        Log('Get_Number_List_Dropdown fulfilled : ', JSON.stringify(action));
        state.apiGetNumberList = STATUS_FULFILLED;
        state.isLoader = false;
        state.number_list = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Number_List_Dropdown.rejected, (state, action) => {
        Log('Get_Number_List_Dropdown rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetNumberList = STATUS_REJECTED;
      });

      builder.addCase(Get_Extension_List_Dropdown.pending, (state, action) => {
        state.apiGetExtensionListDropDown = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Extension_List_Dropdown.fulfilled, (state, action) => {
        Log('Get_Extension_List_Dropdown fulfilled : ', JSON.stringify(action));
        state.apiGetExtensionListDropDown = STATUS_FULFILLED;
        state.isLoader = false;
        state.extension_list = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_Extension_List_Dropdown.rejected, (state, action) => {
        Log('Get_Extension_List_Dropdown rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetExtensionListDropDown = STATUS_REJECTED;
      });

      builder.addCase(Group_List.pending, (state, action) => {
        state.apiGetGroupList = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Group_List.fulfilled, (state, action) => {
        Log('Group_List fulfilled : ', JSON.stringify(action));
        state.apiGetGroupList = STATUS_FULFILLED;
        state.isLoader = false;
        state.group_list = action.payload?.data?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Group_List.rejected, (state, action) => {
        Log('Group_List rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetGroupList = STATUS_REJECTED;
      });

      builder.addCase(Update_User_group.pending, (state, action) => {
        state.apiUpdateUserGroup = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_User_group.fulfilled, (state, action) => {
        Log('Update_User_group fulfilled : ', JSON.stringify(action));
        state.apiUpdateUserGroup = STATUS_FULFILLED;
        state.isLoader = false;
        state.error_message = '';
      });
      builder.addCase(Update_User_group.rejected, (state, action) => {
        Log('Update_User_group rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateUserGroup = STATUS_REJECTED;
      });


      builder.addCase(Get_User_Availablity_Details.pending, (state, action) => {
        state.apiGetUserAvailabilityDetails = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_User_Availablity_Details.fulfilled, (state, action) => {
        Log('Get_User_Availablity_Details fulfilled : ', JSON.stringify(action));
        state.apiGetUserAvailabilityDetails = STATUS_FULFILLED;
        state.isLoader = false;
        state.user_availability_details = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_User_Availablity_Details.rejected, (state, action) => {
        Log('Get_User_Availablity_Details rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetUserAvailabilityDetails = STATUS_REJECTED;
      });

      builder.addCase(Get_User_Time_Availablity_Details.pending, (state, action) => {
        state.apiGetUserAvailabilityTimeDetails = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_User_Time_Availablity_Details.fulfilled, (state, action) => {
        Log('Get_User_Time_Availablity_Details fulfilled : ', JSON.stringify(action));
        state.apiGetUserAvailabilityTimeDetails = STATUS_FULFILLED;
        state.isLoader = false;
        state.user_availability_time_details = action.payload?.data;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Get_User_Time_Availablity_Details.rejected, (state, action) => {
        Log('Get_User_Time_Availablity_Details rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiGetUserAvailabilityTimeDetails = STATUS_REJECTED;
      });

      builder.addCase(Update_User.pending, (state, action) => {
        state.apiUpdateUser = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Update_User.fulfilled, (state, action) => {
        Log('Update_User fulfilled : ', JSON.stringify(action));
        state.apiUpdateUser = STATUS_FULFILLED;
        state.isLoader = false;
        state.error_message = '';
      });
      builder.addCase(Update_User.rejected, (state, action) => {
        Log('Update_User rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUpdateUser = STATUS_REJECTED;
      });

      builder.addCase(Extension_Update_Time_Slot.pending, (state, action) => {
        state.apiExtensionUpdateTimeSlot = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Extension_Update_Time_Slot.fulfilled, (state, action) => {
        Log('Extension_Update_Time_Slot fulfilled : ', JSON.stringify(action));
        state.apiExtensionUpdateTimeSlot = STATUS_FULFILLED;
        state.isLoader = false;
        state.error_message = '';
      });
      builder.addCase(Extension_Update_Time_Slot.rejected, (state, action) => {
        Log('Extension_Update_Time_Slot rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiExtensionUpdateTimeSlot = STATUS_REJECTED;
      });

      builder.addCase(User_Create_Time_Slot.pending, (state, action) => {
        state.apiUserCreateTimeSlot = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(User_Create_Time_Slot.fulfilled, (state, action) => {
        Log('User_Create_Time_Slot fulfilled : ', JSON.stringify(action));
        state.apiUserCreateTimeSlot = STATUS_FULFILLED;
        state.isLoader = false;
        state.error_message = '';
      });
      builder.addCase(User_Create_Time_Slot.rejected, (state, action) => {
        Log('User_Create_Time_Slot rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiUserCreateTimeSlot = STATUS_REJECTED;
      });

      builder.addCase(Copy_User_Time_Slot.pending, (state, action) => {
        state.apiCopyUserTimeSlot = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Copy_User_Time_Slot.fulfilled, (state, action) => {
        Log('Copy_User_Time_Slot fulfilled : ', JSON.stringify(action));
        state.apiCopyUserTimeSlot = STATUS_FULFILLED;
        state.isLoader = false;
        state.error_message = '';
      });
      builder.addCase(Copy_User_Time_Slot.rejected, (state, action) => {
        Log('Copy_User_Time_Slot rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiCopyUserTimeSlot = STATUS_REJECTED;
      });

      builder.addCase(Delete_User_Time_Slot.pending, (state, action) => {
        state.apiDeleteUserTimeSlot = STATUS_PENDING;
        state.isLoader = true;
        state.isError = false;
        state.error_message = '';
      });
      builder.addCase(Delete_User_Time_Slot.fulfilled, (state, action) => {
        Log('Delete_User_Time_Slot fulfilled : ', JSON.stringify(action));
        state.apiDeleteUserTimeSlot = STATUS_FULFILLED;
        state.isLoader = false;
        state.error_message = '';
      });
      builder.addCase(Delete_User_Time_Slot.rejected, (state, action) => {
        Log('Delete_User_Time_Slot rejected : ', JSON.stringify(action));
        state.isLoader = false;
        state.isError = true;
        state.error_message = action.payload?.message;
        state.apiDeleteUserTimeSlot = STATUS_REJECTED;
      });

  },
});

// Action creators are generated for each case reducer function
export const {storeUserData, clearData, resetUserModuleApiStatus} = userModuleReducer.actions;

export const user_list = state => state.userRedux.user_list;

export default userModuleReducer.reducer;
