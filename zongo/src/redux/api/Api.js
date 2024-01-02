import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiManager from "../../commonComponents/ApiManager";
import { BASE_URL, BLOCKED_NUMBERS_LIST, CHECK_ASSIGN_MODULE, COPY_TIME_SLOT, CREATE_AUTO_ATTENDANT, CREATE_BLOCKED_NUMBERS, CREATE_EXTENSION, CREATE_RING_GROUP, CREATE_TIME_SLOT, DELETE_AUTO_ATTENDANT, DELETE_BLOCKED_NUMBERS, DELETE_MOH_FILE, DELETE_MULTIPLE_BLOCKED_NUMBERS, DELETE_RECORDING_FILE, DELETE_RING_GROUP, DELETE_RING_GROUP_DESTINATION_LIST, DELETE_TIME_BASED_ROUTING, DELETE_TIME_SLOT, DELETE_TIME_SLOT_EVENT, GET_ADMIN_VOICE_MAIL, GET_AUTO_ATTENDANT_DETAILS, GET_AUTO_ATTENDANT_LIST, GET_AUTO_ATTENDANT_NEXT_ID, GET_BLOCKED_NUMBERS_SETTING, GET_BUSINESS_HOURS_TIME_DETAILS, GET_CONTACT_LIST, GET_DESTINATION_LIST, GET_DID_ROUTING, GET_EXPORT_BLOCKED_NUMBERS, GET_EXTENSION_DETAILS, GET_INBOUND_NUMBERS_LIST, GET_LOCAL_EXTENSION, GET_MUSIC_ON_HOLD_FILE, GET_NEXT_EXTENSION, GET_NEXT_RING_GROUP_ID, GET_NUMBERS_MAP_FIELDS, GET_PREFIX, GET_RECORDING_FILE, GET_RECORDING_LIST, GET_RING_GROUP_DETAILS, GET_RING_GROUP_LIST, GET_ROUTE_TO_DESTINATION, GET_SMS_CHAT, GET_TIME_BASED_ROUTING_DETAILS, GET_TIME_BASED_ROUTING_LIST, GET_TIME_SLOT_DETAILS_EVENTS, GET_TIME_SLOT_EVENTS_PERTICULAR, GET_USER_EXTENSION, IMPORT_NUMBERS_CSV, LOGIN, SEND_SMS, SMS_CONTACT_LIST, UPDATE_AUTO_ATTENDANT, UPDATE_AUTO_ATTENDANT_OPTIONS, UPDATE_BLOCKED_NUMBERS, UPDATE_BLOCKED_NUMBERS_SETTING, UPDATE_EXTENSION, UPDATE_INBOUND_NUMBERS_LIST, UPDATE_INBOUND_NUMBERS_ROUTE, UPDATE_MOH_FILE, UPDATE_RECORDING_FILE, UPDATE_RING_GROUP, UPDATE_RING_GROUP_DESTINATION_LIST, UPDATE_TIME_CONDITION, UPDATE_TIME_SLOT, UPDATE_TIME_SLOT_WEEKLY, UPLOAD_RECORDING_FILE } from "../../constants/ApiUrl";
import { Log } from "../../commonComponents/Log";



export const AuthLogin = createAsyncThunk("AuthLogin", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(LOGIN, body)

        Log(" ==== AuthLogin Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === AuthLogin Error ", error);

        return rejectWithValue(error)
    }
});

export const Sms_Chat_Contact_List = createAsyncThunk("Sms_Chat_Contact_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(SMS_CONTACT_LIST, body)

        Log(" ==== Sms_Chat_Contact_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Sms_Chat_Contact_List Error ", error);

        return rejectWithValue(error)
    }
}); 

export const Get_Sms_Chat = createAsyncThunk("Get_Sms_Chat", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_SMS_CHAT, body)

        Log(" ==== Get_Sms_Chat Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Sms_Chat Error ", error);

        return rejectWithValue(error)
    }
});

export const Send_sms = createAsyncThunk("Send_sms", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(SEND_SMS, body)

        Log(" ==== Send_sms Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Send_sms Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Contacts_List = createAsyncThunk("Get_Contacts_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_CONTACT_LIST, body)

        Log(" ==== Get_Contacts_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Contacts_List Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_User_Extension = createAsyncThunk("Get_User_Extension", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_USER_EXTENSION, body)

        Log(" ==== Get_User_Extension Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_User_Extension Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Local_Extension = createAsyncThunk("Get_Local_Extension", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_LOCAL_EXTENSION, body)

        Log(" ==== Get_Local_Extension Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Local_Extension Error ", error);

        return rejectWithValue(error)
    }
});
export const Get_Extension_Details = createAsyncThunk("Get_Extension_Details", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_EXTENSION_DETAILS, body)

        Log(" ==== Get_Extension_Details Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Extension_Details Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Extension = createAsyncThunk("Update_Extension", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_EXTENSION, body)

        Log(" ==== Update_Extension Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Extension Error ", error);

        return rejectWithValue(error)
    }
});
export const Create_Extension = createAsyncThunk("Create_Extension", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(CREATE_EXTENSION, body)

        Log(" ==== Create_Extension Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Create_Extension Error ", error);

        return rejectWithValue(error)
    }
});
export const Get_Next_Extension = createAsyncThunk("Get_Next_Extension", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_NEXT_EXTENSION, body)

        Log(" ==== Get_Next_Extension Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Next_Extension Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Ring_Group_List = createAsyncThunk("Get_Ring_Group_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_RING_GROUP_LIST, body)

        Log(" ==== Get_Ring_Group_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Ring_Group_List Error ", error);

        return rejectWithValue(error)
    }
});
export const Get_Audio_File_List = createAsyncThunk("Get_Audio_File_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_RECORDING_FILE, body)

        Log(" ==== Get_Audio_File_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Audio_File_List Error ", error);

        return rejectWithValue(error)
    }
});
export const Get_Audio_List_By_Type = createAsyncThunk("Get_Audio_List_By_Type", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_RECORDING_LIST, body)

        Log(" ==== Get_Audio_List_By_Type Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Audio_List_By_Type Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Moh_File = createAsyncThunk("Update_Moh_File", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_MOH_FILE, body)

        Log(" ==== Update_Moh_File Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Moh_File Error ", error);

        return rejectWithValue(error)
    }
});

export const Delete_Moh_File = createAsyncThunk("Delete_Moh_File", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_MOH_FILE, body)

        Log(" ==== Delete_Moh_File Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Moh_File Error ", error);

        return rejectWithValue(error)
    }
});

export const Upload_Audio_File = createAsyncThunk("Upload_Audio_File", async (body, { rejectWithValue }) => {
    try {
        const headers = {
            'Content-Type': 'multipart/form-data',
        };
        const response = await ApiManager.post(UPLOAD_RECORDING_FILE, body,{headers})

        Log(" ==== Upload_Audio_File Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Upload_Audio_File Error ", error);

        return rejectWithValue(error)
    }
});
export const Update_Audio_File = createAsyncThunk("Update_Audio_File", async (body, { rejectWithValue }) => {
    try {
        const headers = {
            'Content-Type': 'multipart/form-data',
        };
        const response = await ApiManager.post(UPDATE_RECORDING_FILE, body,{headers})

        Log(" ==== Update_Audio_File Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Audio_File Error ", error);

        return rejectWithValue(error)
    }
});
export const Delete_Audio_File = createAsyncThunk("Delete_Audio_File", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_RECORDING_FILE, body)

        Log(" ==== Delete_Audio_File Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Audio_File Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Route_To_Destination = createAsyncThunk("Get_Route_To_Destination", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_ROUTE_TO_DESTINATION, body)

        Log(" ==== Get_Route_To_Destination Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Route_To_Destination Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Ring_Group_Details = createAsyncThunk("Get_Ring_Group_Details", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_RING_GROUP_DETAILS, body)

        Log(" ==== Get_Ring_Group_Details Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Ring_Group_Details Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Destination_List = createAsyncThunk("Get_Destination_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_DESTINATION_LIST, body)

        Log(" ==== Get_Destination_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Destination_List Error ", error);

        return rejectWithValue(error)
    }
});
export const Get_Music_On_Hold_File = createAsyncThunk("Get_Music_On_Hold_File", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_MUSIC_ON_HOLD_FILE, body)

        Log(" ==== Get_Music_On_Hold_File Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Music_On_Hold_File Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Ring_Group = createAsyncThunk("Update_Ring_Group", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_RING_GROUP, body)

        Log(" ==== Update_Ring_Group Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Ring_Group Error ", error);

        return rejectWithValue(error)
    }
});
export const Delete_Ring_Group = createAsyncThunk("Delete_Ring_Group", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_RING_GROUP, body)

        Log(" ==== Delete_Ring_Group Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Ring_Group Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Next_Ring_Group_Id = createAsyncThunk("Get_Next_Ring_Group_Id", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_NEXT_RING_GROUP_ID, body)

        Log(" ==== Get_Next_Ring_Group_Id Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Next_Ring_Group_Id Error ", error);

        return rejectWithValue(error)
    }
});
export const Create_Ring_Group = createAsyncThunk("Create_Ring_Group", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(CREATE_RING_GROUP, body)

        Log(" ==== Create_Ring_Group Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Create_Ring_Group Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Ring_Group_Destination_List = createAsyncThunk("Update_Ring_Group_Destination_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_RING_GROUP_DESTINATION_LIST, body)

        Log(" ==== Update_Ring_Group_Destination_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Ring_Group_Destination_List Error ", error);

        return rejectWithValue(error)
    }
});

export const Delete_Ring_Group_Destination_List = createAsyncThunk("Delete_Ring_Group_Destination_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_RING_GROUP_DESTINATION_LIST, body)

        Log(" ==== Delete_Ring_Group_Destination_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Ring_Group_Destination_List Error ", error);

        return rejectWithValue(error)
    }
});
export const Get_Admin_Voice_Mail = createAsyncThunk("Get_Admin_Voice_Mail", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_ADMIN_VOICE_MAIL, body)

        Log(" ==== Get_Admin_Voice_Mail Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Admin_Voice_Mail Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Inbound_Number_List = createAsyncThunk("Get_Inbound_Number_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_INBOUND_NUMBERS_LIST, body)

        Log(" ==== Get_Inbound_Number_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Inbound_Number_List Error ", error);

        return rejectWithValue(error)
    }
});
export const Update_Inbound_Number_Route = createAsyncThunk("Update_Inbound_Number_Route", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_INBOUND_NUMBERS_ROUTE, body)

        Log(" ==== Update_Inbound_Number_Route Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Inbound_Number_Route Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Prefix = createAsyncThunk("Get_Prefix", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_PREFIX, body)

        Log(" ==== Get_Prefix Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Prefix Error ", error);

        return rejectWithValue(error)
    }
});
export const Get_Did_Routing = createAsyncThunk("Get_Did_Routing", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_DID_ROUTING, body)

        Log(" ==== Get_Did_Routing Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Did_Routing Error ", error);

        return rejectWithValue(error)
    }
});
export const Update_Inbound_Number = createAsyncThunk("Update_Inbound_Number", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_INBOUND_NUMBERS_LIST, body)

        Log(" ==== Update_Inbound_Number Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Inbound_Number Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Auto_Attendant_List = createAsyncThunk("Get_Auto_Attendant_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_AUTO_ATTENDANT_LIST, body)

        Log(" ==== Get_Auto_Attendant_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Auto_Attendant_List Error ", error);

        return rejectWithValue(error)
    }
});
export const Check_Assign_Module = createAsyncThunk("Check_Assign_Module", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(CHECK_ASSIGN_MODULE, body)

        Log(" ==== Check_Assign_Module Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Check_Assign_Module Error ", error);

        return rejectWithValue(error)
    }
});

export const Delete_Auto_Attendant = createAsyncThunk("Delete_Auto_Attendant", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_AUTO_ATTENDANT, body)

        Log(" ==== Delete_Auto_Attendant Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Auto_Attendant Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Auto_Attendant_Details = createAsyncThunk("Get_Auto_Attendant_Details", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_AUTO_ATTENDANT_DETAILS, body)

        Log(" ==== Get_Auto_Attendant_Details Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Auto_Attendant_Details Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Auto_Attendant_Options = createAsyncThunk("Update_Auto_Attendant_Options", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_AUTO_ATTENDANT_OPTIONS, body)

        Log(" ==== Update_Auto_Attendant_Options Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Auto_Attendant_Options Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Auto_Attendant = createAsyncThunk("Update_Auto_Attendant", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_AUTO_ATTENDANT, body)

        Log(" ==== Update_Auto_Attendant Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Auto_Attendant Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Auto_Attendant_Next_Id = createAsyncThunk("Get_Auto_Attendant_Next_Id", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_AUTO_ATTENDANT_NEXT_ID, body)

        Log(" ==== Get_Auto_Attendant_Next_Id Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Auto_Attendant_Next_Id Error ", error);

        return rejectWithValue(error)
    }
});

export const Create_Auto_Attendant = createAsyncThunk("Create_Auto_Attendant", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(CREATE_AUTO_ATTENDANT, body)

        Log(" ==== Create_Auto_Attendant Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Create_Auto_Attendant Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Time_Based_Routing_List = createAsyncThunk("Get_Time_Based_Routing_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_TIME_BASED_ROUTING_LIST, body)

        Log(" ==== Get_Time_Based_Routing_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Time_Based_Routing_List Error ", error);

        return rejectWithValue(error)
    }
});

export const Delete_Time_Based_Routing = createAsyncThunk("Delete_Time_Based_Routing", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_TIME_BASED_ROUTING, body)

        Log(" ==== Delete_Time_Based_Routing Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Time_Based_Routing Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Time_Based_Routing_Details = createAsyncThunk("Get_Time_Based_Routing_Details", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_TIME_BASED_ROUTING_DETAILS, body)

        Log(" ==== Get_Time_Based_Routing_Details Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Time_Based_Routing_Details Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Time_Slot_Details_Events = createAsyncThunk("Get_Time_Slot_Details_Events", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_TIME_SLOT_DETAILS_EVENTS, body)

        Log(" ==== Get_Time_Slot_Details_Events Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Time_Slot_Details_Events Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Business_Hours_Time_Details = createAsyncThunk("Get_Business_Hours_Time_Details", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_BUSINESS_HOURS_TIME_DETAILS, body)

        Log(" ==== Get_Business_Hours_Time_Details Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Business_Hours_Time_Details Error ", error);

        return rejectWithValue(error)
    }
});
export const Create_Time_Slot = createAsyncThunk("Create_Time_Slot", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(CREATE_TIME_SLOT, body)

        Log(" ==== Create_Time_Slot Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Create_Time_Slot Error ", error);

        return rejectWithValue(error)
    }
});

export const Delete_Time_Slot = createAsyncThunk("Delete_Time_Slot", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_TIME_SLOT, body)

        Log(" ==== Delete_Time_Slot Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Time_Slot Error ", error);

        return rejectWithValue(error)
    }
});

export const Delete_Time_Slot_Event = createAsyncThunk("Delete_Time_Slot_Event", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_TIME_SLOT_EVENT, body)

        Log(" ==== Delete_Time_Slot_Event Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Time_Slot_Event Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Time_Condition = createAsyncThunk("Update_Time_Condition", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_TIME_CONDITION, body)

        Log(" ==== Update_Time_Condition Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Time_Condition Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Time_Slot_Weekly = createAsyncThunk("Update_Time_Slot_Weekly", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_TIME_SLOT_WEEKLY, body)

        Log(" ==== Update_Time_Slot_Weekly Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Time_Slot_Weekly Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Time_Slot_Events_Perticular = createAsyncThunk("Get_Time_Slot_Events_Perticular", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_TIME_SLOT_EVENTS_PERTICULAR, body)

        Log(" ==== Get_Time_Slot_Events_Perticular Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Time_Slot_Events_Perticular Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Time_Slot = createAsyncThunk("Update_Time_Slot", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_TIME_SLOT, body)

        Log(" ==== Update_Time_Slot Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Time_Slot Error ", error);

        return rejectWithValue(error)
    }
});

export const Copy_Time_Slot = createAsyncThunk("Copy_Time_Slot", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(COPY_TIME_SLOT, body)

        Log(" ==== Copy_Time_Slot Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Copy_Time_Slot Error ", error);

        return rejectWithValue(error)
    }
});

export const Blocked_Numbers_List = createAsyncThunk("Blocked_Numbers_List", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(BLOCKED_NUMBERS_LIST, body)

        Log(" ==== Blocked_Numbers_List Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Blocked_Numbers_List Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Blocked_Numbers_Settings = createAsyncThunk("Get_Blocked_Numbers_Settings", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_BLOCKED_NUMBERS_SETTING, body)

        Log(" ==== Get_Blocked_Numbers_Settings Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Blocked_Numbers_Settings Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Blocked_Numbers_Settings = createAsyncThunk("Update_Blocked_Numbers_Settings", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_BLOCKED_NUMBERS_SETTING, body)

        Log(" ==== Update_Blocked_Numbers_Settings Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Blocked_Numbers_Settings Error ", error);

        return rejectWithValue(error)
    }
});

export const Create_Blocked_Numbers = createAsyncThunk("Create_Blocked_Numbers", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(CREATE_BLOCKED_NUMBERS, body)

        Log(" ==== Create_Blocked_Numbers Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Create_Blocked_Numbers Error ", error);

        return rejectWithValue(error)
    }
});

export const Delete_Blocked_Numbers = createAsyncThunk("Delete_Blocked_Numbers", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_BLOCKED_NUMBERS, body)

        Log(" ==== Delete_Blocked_Numbers Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Blocked_Numbers Error ", error);

        return rejectWithValue(error)
    }
});

export const Update_Blocked_Numbers = createAsyncThunk("Update_Blocked_Numbers", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(UPDATE_BLOCKED_NUMBERS, body)

        Log(" ==== Update_Blocked_Numbers Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Update_Blocked_Numbers Error ", error);

        return rejectWithValue(error)
    }
});

export const Delete_Multiple_Blocked_Numbers = createAsyncThunk("Delete_Multiple_Blocked_Numbers", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(DELETE_MULTIPLE_BLOCKED_NUMBERS, body)

        Log(" ==== Delete_Multiple_Blocked_Numbers Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Delete_Multiple_Blocked_Numbers Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Export_Blocked_Numbers = createAsyncThunk("Get_Export_Blocked_Numbers", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_EXPORT_BLOCKED_NUMBERS, body)

        Log(" ==== Get_Export_Blocked_Numbers Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Export_Blocked_Numbers Error ", error);

        return rejectWithValue(error)
    }
});

export const Import_Numbers_Csv = createAsyncThunk("Import_Numbers_Csv", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(IMPORT_NUMBERS_CSV, body)

        Log(" ==== Import_Numbers_Csv Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Import_Numbers_Csv Error ", error);

        return rejectWithValue(error)
    }
});

export const Get_Number_Map_Fields = createAsyncThunk("Get_Number_Map_Fields", async (body, { rejectWithValue }) => {
    try {

        const response = await ApiManager.post(GET_NUMBERS_MAP_FIELDS, body)

        Log(" ==== Get_Number_Map_Fields Response ===   : ", response.data)

        return response.data

    } catch (error) {
        Log(" === Get_Number_Map_Fields Error ", error);

        return rejectWithValue(error)
    }
});

