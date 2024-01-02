import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FULFILLED, STATUS_IDLE, STATUS_PENDING, STATUS_REJECTED } from '../../constants/ConstantKey';
import { Log } from '../../commonComponents/Log';
import { Delete_Audio_File, Delete_Moh_File, Get_Audio_File_List, Get_Audio_List, Get_Audio_List_By_Type, Get_Music_On_Hold_File, Update_Audio_File, Update_Moh_File, Upload_Audio_File } from '../api/Api';

export const AudioReducer = createSlice({
  name: 'audioRedux',
  initialState: {
    isLoader: false,
    isError: false,
    error_message: '',

    audio_file_list: null,
    audio_file_list_by_type: null,
    music_on_hold_file_list: null,
    moh_list: null,
    apiUploadRecordingStatus:null,
    apiUpdateRecordingStatus:null,
    apiAudioFileList: STATUS_IDLE,
    apiAudioListByType: STATUS_IDLE,
    apiUploadRecording: STATUS_IDLE,
    apiUpdateRecording: STATUS_IDLE,
    apiDeleteRecording: STATUS_IDLE,
    apiGetMusicOnHoldFile: STATUS_IDLE,
    apiUpdateMoh: STATUS_IDLE,
    apiDeleteMohFile: STATUS_IDLE,
  },

  reducers: {
    resetAudioApiStatus: (state, action) => {
      (state.isLoader = false),
        (state.isError = false),
        (state.error_message = ''),
        (state.apiAudioFileList = STATUS_IDLE);
        (state.apiAudioListByType = STATUS_IDLE);
        (state.apiUploadRecording= STATUS_IDLE);
        (state.apiUpdateRecording= STATUS_IDLE);
        (state.apiDeleteRecording= STATUS_IDLE);
        (state.apiGetMusicOnHoldFile = STATUS_IDLE);
        (state.apiUpdateMoh = STATUS_IDLE);
        (state.apiDeleteMohFile = STATUS_IDLE);
    },
    storeCallsData: (state, action) => {
      state.audio_file_list = action.payload;
      state.audio_file_list_by_type = action.payload;
    },
    clearData: state => {
      state.audio_file_list = null;
      state.audio_file_list_by_type = null;
      state.apiUploadRecordingStatus = null;
      state.apiUpdateRecordingStatus = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(Get_Audio_File_List.pending, (state, action) => {
      state.apiAudioFileList = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Audio_File_List.fulfilled, (state, action) => {
      Log('Get_Audio_File_List fulfilled : ', JSON.stringify(action.payload?.data?.data));
      state.apiAudioFileList = STATUS_FULFILLED;
      state.isLoader = false;
      state.audio_file_list = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Audio_File_List.rejected, (state, action) => {
      Log('Get_Audio_File_List rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiAudioFileList = STATUS_REJECTED;
    });

    builder.addCase(Get_Audio_List_By_Type.pending, (state, action) => {
      state.apiAudioListByType = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Audio_List_By_Type.fulfilled, (state, action) => {
      Log('Get_Audio_List_By_Type fulfilled : ', JSON.stringify(action));
      state.apiAudioListByType = STATUS_FULFILLED;
      state.isLoader = false;
      state.audio_file_list_by_type = action.payload?.data?.data;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Audio_List_By_Type.rejected, (state, action) => {
      Log('Get_Audio_List_By_Type rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiAudioListByType = STATUS_REJECTED;
    });


    builder.addCase(Upload_Audio_File.pending, (state, action) => {
      state.apiUploadRecording = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Upload_Audio_File.fulfilled, (state, action) => {
      Log('Upload_Audio_File fulfilled : ', JSON.stringify(action));
      state.apiUploadRecording = STATUS_FULFILLED;
      state.isLoader = false;
      state.apiUploadRecordingStatus = action?.payload
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Upload_Audio_File.rejected, (state, action) => {
      Log('Upload_Audio_File rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUploadRecording = STATUS_REJECTED;
    });

    builder.addCase(Update_Audio_File.pending, (state, action) => {
      state.apiUpdateRecording = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Audio_File.fulfilled, (state, action) => {
      Log('Update_Audio_File fulfilled : ', JSON.stringify(action));
      state.apiUpdateRecording = STATUS_FULFILLED;
      state.isLoader = false;
      state.apiUpdateRecordingStatus = action?.payload
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Audio_File.rejected, (state, action) => {
      Log('Update_Audio_File rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUpdateRecording = STATUS_REJECTED;
    });

    builder.addCase(Delete_Audio_File.pending, (state, action) => {
      state.apiDeleteRecording = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Audio_File.fulfilled, (state, action) => {
      Log('Delete_Audio_File fulfilled : ', JSON.stringify(action));
      state.apiDeleteRecording = STATUS_FULFILLED;
      state.isLoader = false;
      // state.apiUpdateRecordingStatus = action?.payload
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Audio_File.rejected, (state, action) => {
      Log('Delete_Audio_File rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiDeleteRecording = STATUS_REJECTED;
    });
    builder.addCase(Get_Music_On_Hold_File.pending, (state, action) => {
      state.apiGetMusicOnHoldFile = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Music_On_Hold_File.fulfilled, (state, action) => {
      Log('Get_Music_On_Hold_File fulfilled : ', JSON.stringify(action));
      state.apiGetMusicOnHoldFile = STATUS_FULFILLED;
      state.isLoader = false;
      state.music_on_hold_file_list = action?.payload?.data
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Get_Music_On_Hold_File.rejected, (state, action) => {
      Log('Get_Music_On_Hold_File rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiGetMusicOnHoldFile = STATUS_REJECTED;
    });

    builder.addCase(Update_Moh_File.pending, (state, action) => {
      state.apiUpdateMoh = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Moh_File.fulfilled, (state, action) => {
      Log('Update_Moh_File fulfilled : ', JSON.stringify(action));
      state.apiUpdateMoh = STATUS_FULFILLED;
      state.isLoader = false;
      state.moh_list = action?.payload?.data
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Update_Moh_File.rejected, (state, action) => {
      Log('Update_Moh_File rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiUpdateMoh = STATUS_REJECTED;
    });

    builder.addCase(Delete_Moh_File.pending, (state, action) => {
      state.apiDeleteMohFile = STATUS_PENDING;
      state.isLoader = true;
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Moh_File.fulfilled, (state, action) => {
      Log('Delete_Moh_File fulfilled : ', JSON.stringify(action));
      state.apiDeleteMohFile = STATUS_FULFILLED;
      state.isLoader = false;
      state.moh_list = action?.payload?.data
      state.isError = false;
      state.error_message = '';
    });
    builder.addCase(Delete_Moh_File.rejected, (state, action) => {
      Log('Delete_Moh_File rejected : ', JSON.stringify(action));
      state.isLoader = false;
      state.isError = true;
      state.error_message = action.payload?.message;
      state.apiDeleteMohFile = STATUS_REJECTED;
    });
  },
});

// Action creators are generated for each case reducer function
export const {storeCallsData, clearData, resetAudioApiStatus} = AudioReducer.actions;


export default AudioReducer.reducer;
