import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Create_Ring_Group, Delete_Ring_Group, Get_Next_Ring_Group_Id, Get_Ring_Group_Details, Get_Ring_Group_List, Update_Ring_Group,  } from '../api/Api';
import { Log } from '../../commonComponents/Log';

export const ringGroupReducer = createSlice({
  name: 'ringGroupRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',

    ring_group_list: null,
    ring_group_details: null,
    ring_group_extension_data: null,
    next_ring_group_id: null,
    apiRingGroupList: STATUS_IDLE,
    apiRingGroupDetails: STATUS_IDLE,
    apiUpdateRingGroup: STATUS_IDLE,
    apiGetNextRingGroupId: STATUS_IDLE,
    apiCreateRingGroup: STATUS_IDLE,
    apiDeleteRingGroup: STATUS_IDLE,
  },

  reducers: {
    resetApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiRingGroupList = STATUS_IDLE);
        (state.apiRingGroupDetails = STATUS_IDLE);
        (state.apiUpdateRingGroup = STATUS_IDLE);
        (state.apiGetNextRingGroupId= STATUS_IDLE);
        (state.apiCreateRingGroup = STATUS_IDLE);
        (state.apiDeleteRingGroup = STATUS_IDLE);
    },
    storeCallsData: (state, action) => {
      state.ring_group_list = action.payload;
    },
    clearData: state => {
      state.ring_group_list = null;
      state.ring_group_details = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_Ring_Group_List.pending, (state, action) => {
      state.apiRingGroupList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Ring_Group_List.fulfilled, (state, action) => {
      Log('Get_Ring_Group_List fulfilled : ', JSON.stringify(action));
      state.apiRingGroupList = STATUS_FULFILLED;
      state.isLoader = false;
      state.ring_group_list = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Ring_Group_List.rejected, (state, action) => {
      Log('Get_Ring_Group_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiRingGroupList = STATUS_REJECTED;
    });

    builder.addCase(Get_Ring_Group_Details.pending, (state, action) => {
      state.apiRingGroupDetails = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Ring_Group_Details.fulfilled, (state, action) => {
      Log('Get_Ring_Group_Details fulfilled : ', JSON.stringify(action));
      state.apiRingGroupDetails = STATUS_FULFILLED;
      state.isLoader = false;
      state.ring_group_details = action.payload?.data?.ring_group_data;
      state.ring_group_extension_data = action.payload?.data?.ringgroup_destination_data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Ring_Group_Details.rejected, (state, action) => {
      Log('Get_Ring_Group_Details rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiRingGroupDetails = STATUS_REJECTED;
    });

    builder.addCase(Update_Ring_Group.pending, (state, action) => {
      state.apiUpdateRingGroup = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Ring_Group.fulfilled, (state, action) => {
      Log('Update_Ring_Group fulfilled : ', JSON.stringify(action));
      state.apiUpdateRingGroup = STATUS_FULFILLED;
      state.isLoader = false;
      // state.ring_group_details = action.payload?.data?.ring_group_data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Ring_Group.rejected, (state, action) => {
      Log('Update_Ring_Group rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUpdateRingGroup = STATUS_REJECTED;
    });

    builder.addCase(Get_Next_Ring_Group_Id.pending, (state, action) => {
      state.apiGetNextRingGroupId = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Next_Ring_Group_Id.fulfilled, (state, action) => {
      Log('Get_Next_Ring_Group_Id fulfilled : ', JSON.stringify(action));
      state.apiGetNextRingGroupId = STATUS_FULFILLED;
      state.isLoader = false;
      state.next_ring_group_id = action.payload?.data
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Next_Ring_Group_Id.rejected, (state, action) => {
      Log('Get_Next_Ring_Group_Id rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetNextRingGroupId = STATUS_REJECTED;
    });

    builder.addCase(Create_Ring_Group.pending, (state, action) => {
      state.apiCreateRingGroup = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Create_Ring_Group.fulfilled, (state, action) => {
      Log('Create_Ring_Group fulfilled : ', JSON.stringify(action));
      state.apiCreateRingGroup = STATUS_FULFILLED;
      state.isLoader = false;
      // state.next_ring_group_id = action.payload?.data
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Create_Ring_Group.rejected, (state, action) => {
      Log('Create_Ring_Group rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiCreateRingGroup = STATUS_REJECTED;
    });


    builder.addCase(Delete_Ring_Group.pending, (state, action) => {
      state.apiDeleteRingGroup = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Ring_Group.fulfilled, (state, action) => {
      Log('Delete_Ring_Group fulfilled : ', JSON.stringify(action));
      state.apiDeleteRingGroup = STATUS_FULFILLED;
      state.isLoader = false;
      // state.next_ring_group_id = action.payload?.data
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Ring_Group.rejected, (state, action) => {
      Log('Delete_Ring_Group rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiDeleteRingGroup = STATUS_REJECTED;
    });
  },
});

// Action creators are generated for each case reducer function
export const {storeCallsData, clearData, resetApiStatus} = ringGroupReducer.actions;


export default ringGroupReducer.reducer;
