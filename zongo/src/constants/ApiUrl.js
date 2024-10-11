export const BASE_URL = 'https://zongopbx.com/v1/'

export const AUDIO_URL = "https://zongopbx.com/uploads/recording/"
export const IMAGE_URL = "https://zongopbx.com/uploads/profiles/"
export const COMMAN_IMAGE_URL = "https://zongopbx.com/uploads/comman/"
export const INTERNAL_CHAT_IMAGE_URL = "https://zongopbx.com/uploads/internal_chat/xTce64tEYZ/"
export const WEBSOCKET_URL = "ws://zongopbx.com/"

//AUTH APIS
export const  LOGIN = "login"
export const GET_USER_EXTENSION = "get-user-extensions"
export const CHECK_USER_EMAIL = "check-user-email"
export const CHANGE_PASSWORD = "change-password"
export const CHECK_EMAIL_CONFIG = "check-email-config"
export const SAVE_E911_DATA = "save-e911-data" 
export const UPDATE_E911_DATA = "update-e911-data" 
export const UPDATE_ADMIN_COMPANY_INFO = "update-admin-company-info" 
export const UPDATE_ADMIN_PERSONAL_INFO = "update-admin-personal-info" 

//CHAT APIS
export const SMS_CONTACT_LIST = "sms-chat/contact-list"
export const GET_SMS_CHAT = "sms-chat/get-sms-log"
export const SEND_SMS = "sms-chat/send-sms"
export const GET_USER_ASSIGN_LIST = "sms-chat/get-user-assign-list"
export const GET_SMS_TEMPLATE_LIST = "get-sms-templatelist"
export const GET_SMS_TEMPLATE_DETAILS = "get-sms-template-details"
export const SMS_LOG = "sms-log"
export const GET_ALL_CONTACT_LIST = "sms-chat/get-all-contact-list"
export const SMS_TEMPLATE_LIST = "sms-template-list"
export const UPDATE_SMS_TEMPLATE = "update-sms-template"
export const CREATE_SMS_TEMPLATE = "create-sms-template"
export const DELETE_SMS_TEMPLATE = "delete-sms-template"

//CONTACT APIS
export const GET_CONTACT_LIST = "get-contact-list"

// AUDIL FILES APIS
export const GET_RECORDING_LIST = "get-recording-list"
export const UPLOAD_RECORDING_FILE = "upload-recording"
export const UPDATE_RECORDING_FILE = "update-recording"
export const DELETE_RECORDING_FILE = "delete-recording"
export const UPDATE_MOH_FILE = "update-moh-file"
export const DELETE_MOH_FILE = "delete-moh-file"

//EXTENSIONS APIS
export const GET_LOCAL_EXTENSION = "get-extensions-list"
export const GET_EXTENSION_DETAILS = "get-extensions-details"
export const UPDATE_EXTENSION = "update-extensions"
export const CREATE_EXTENSION = "create-extensions"
export const GET_NEXT_EXTENSION = "get-next-extension"

//RING GROUP APIS
export const GET_RING_GROUP_LIST = "get-ringgroups-list"
export const GET_RING_GROUP_DETAILS = "get-ringgroup-details"
export const UPDATE_RING_GROUP = "update-ringgroup"
export const GET_NEXT_RING_GROUP_ID = "get-next-ringgroup-id"
export const CREATE_RING_GROUP = "create-ringgroup"
export const DELETE_RING_GROUP = "delete-ringgroup"

//INBOUND NUMBERS 
export const GET_INBOUND_NUMBERS_LIST = "list-did"
export const UPDATE_INBOUND_NUMBERS_LIST = "update-did-routing"
export const UPDATE_INBOUND_NUMBERS_ROUTE = "update-route"
export const GET_PREFIX = "numbers/get-prefix"
export const GET_DID_ROUTING = "get-did-routing"
export const GET_NUMBER = "get-number"
export const ONBOARDING_BUY_DID = "onboarding-buy-did"

//AUTO_ATTENDANT

export const GET_AUTO_ATTENDANT_LIST = "get-ivr-list"
export const DELETE_AUTO_ATTENDANT = "delete-ivr"
export const CREATE_AUTO_ATTENDANT = "create-ivr"
export const GET_AUTO_ATTENDANT_DETAILS = "get-ivr-details"
export const GET_AUTO_ATTENDANT_NEXT_ID = "get-ivr-next-id"
export const UPDATE_AUTO_ATTENDANT = "update-ivr"
export const UPDATE_AUTO_ATTENDANT_OPTIONS = "update-ivr-options"

//TIME BASED ROUTING
export const GET_TIME_BASED_ROUTING_LIST = "get-time-condition-list"
export const UPDATE_TIME_CONDITION = "update-time-condition"
export const DELETE_TIME_BASED_ROUTING = "delete-time-condition"
export const GET_TIME_BASED_ROUTING_DETAILS = "get-time-condition-details"
export const GET_TIME_SLOT_DETAILS_EVENTS = "get-time-slot-details-events"
export const GET_BUSINESS_HOURS_TIME_DETAILS = "get-business-hours-time-details"
export const CREATE_TIME_SLOT = "create-time-slot"
export const DELETE_TIME_SLOT = "delete-time-slot"
export const DELETE_TIME_SLOT_EVENT = "delete-time-slot-event"
export const UPDATE_TIME_SLOT_WEEKLY = "update-time-slot-weekly"
export const UPDATE_TIME_SLOT = "update-time-slot"
export const GET_TIME_SLOT_EVENTS_PERTICULAR = "get-time-slot-events-particular"
export const COPY_TIME_SLOT = "time-base-routing/copy-time-slot"

//BLOCKED NUMBERS
export const BLOCKED_NUMBERS_LIST = "blocked-number-list"
export const CREATE_BLOCKED_NUMBERS = "create-blocked-number"
export const DELETE_BLOCKED_NUMBERS = "delete-blocked-number"
export const UPDATE_BLOCKED_NUMBERS = "update-blocked-number"
export const UPDATE_BLOCKED_NUMBERS_SETTING = "update-blocked-number-settings"
export const GET_BLOCKED_NUMBERS_SETTING = "get-blocked-number-settings-details"
export const DELETE_MULTIPLE_BLOCKED_NUMBERS = "delete-multiple-blocked-number"
export const GET_EXPORT_BLOCKED_NUMBERS = "get-export-block-numbers"
export const IMPORT_NUMBERS_CSV = "import-number-csv"
export const GET_NUMBERS_MAP_FIELDS = "get-number-mappingFields"
export const INSERT_NUMBER_CSV_DATA = "insert-number-csv-data"

// DNC LIST
export const GET_DNC_LIST = "get-dnclist"
export const CREATE_DNC_LIST = "create-dnclist"
export const DELETE_DNC_LIST = "delete-dnclist"
export const DELETE_MULTIPLE_DNC_LIST = "multiple-delete-dnclist"
export const IMPORT_DNC_CSV = "import-dnc-csv"
export const GET_DNC_MAPPING_FIELDS = "get-dnc-mappingFields"
export const INSERT_DNC_CSV_DATA = "insert-dnc-csv-data"

//CALL CAMPAIGN
export const GET_CALL_CAMPAIGN_LIST = "call-campaign-list"

//USERS
export const GET_USER_LIST = "get-user-list"
export const USER_DELETE = "delete-user"
export const CREATE_USER = "create-user"
export const UPDATE_USER = "update-user"
export const GET_ROLE_LIST_DP = "get-role-list-dp"
export const GET_USER_DETAILS = "get-user-details"
export const GET_TIMEZONE_LIST = "dropdown/get-timezone-list"
export const GET_LANGUAGE_LIST = "dropdown/get-language-list"
export const GET_NUMBER_LIST_DROPDOWN = "dropdown/get-number-list-dropdown"
export const GET_EXTENSION_LIST_DROPDOWN = "dropdown/get-extension-list-dropdown"
export const GROUP_LIST = "permission/group-list"
export const UPDATE_USER_GROUP = "update-user-group"
export const GET_USER_AVAILABILITY_DETAILS = "user-availability/get-availability-details"
export const GET_USER_AVAILABILITY_TIME_DETAILS = "user-availability/get-availability-time-details"
export const EXTENSION_UPDATE_TIME_SLOT = "user-availability/extension-update-time-slot"
export const USER_CREATE_TIME_SLOT = "user-availability/create-time-slot"
export const COPY_USER_TIME_SLOT = "user-availability/copy-avalability-time-slot"
export const DELETE_USER_TIME_SLOT = "user-availability/extension-delete-time-slot"


//GENERAL APIS
export const GET_ROUTE_TO_DESTINATION = "get-destination-type-list"
export const UPDATE_RING_GROUP_DESTINATION_LIST = "update-ringgroup-destination" 
export const DELETE_RING_GROUP_DESTINATION_LIST = "delete-ringgroup-destination"
export const GET_RECORDING_FILE = "get-recording-dropdown"
export const GET_DESTINATION_LIST = "get-destination-list"
export const GET_MUSIC_ON_HOLD_FILE = "get-music-on-hold-file"
export const GET_ADMIN_VOICE_MAIL = "get-admin-voicemail"
export const CHECK_ASSIGN_MODULE = "check-module-assign"
export const GET_AREA_CODE_LIST = "dropdown/get-area-code-list"
export const GET_STATES = "numbers/states"
export const GET_AREA_CODE_BY_STATE = "numbers/get-area-code"
export const GET_PLAN_ALL_LIST = "plan/plan-all-list"
export const GET_PERTICULAR_ROLE_PERMISSION = "permission/get-particular-role-permission"
export const GET_CONTACT_FIELD_LIST = "get-contact-fields-list"

// INTERNAL CHAT 
export const GET_USER_LIST_CHAT = "internal-chat/get-user-list"
export const GET_GROUP_LIST_CHAT = "internal-chat/get-group-list"
export const GET_INTERNAL_CHAT_LOG_USER = "internal-chat/get-internal-chat-log"
export const GET_GROUP_USER_DETAILS = "internal-chat/get-group-user-details"
export const UPDATE_GROUP = "internal-chat/update-group"
export const UPDATE_GROUP_NAME = "internal-chat/update-group-name"
export const DELETE_GROUP_MEMBER = "internal-chat/delete-group-member"
export const CREATE_GROUP = "internal-chat/create-group"
export const SEND_MESSAGE = "internal-chat/send-message"
export const SEND_CHAT_FILE = "internal-chat/send-chat-file"
export const GET_MESSAGE_NOTIFICATION = "internal-chat/get-message-notification"

//CALANDAR EVENTS
export const GET_USER_EVENTS = "calender/user-meeting-events"
export const MANAGE_USER_EVENTS = "calender/create-user-meeting-event"
export const UPDATE_USER_EVENTS = "calender/update-user-meeting-event"
export const DELETE_USER_EVENTS = "calender/delete-user-meeting-event"

export const GET_MEETING_MODE = "calender/get-meeting-modes"
export const GET_USER_MEETING_AVAILABILITY = "calender/user-meeting-availability"
export const CREATE_USER_MEETING_AVAILABILITY = "calender/create-user-meeting-availability"
export const UPDATE_USER_MEETING_AVAILABILITY = "calender/update-user-meeting-availability"
export const DELETE_USER_MEETING_AVAILABILITY = "calender/delete-user-meeting-availability"

export const GET_CALENDAR_ALL_TASK = "get-all-tasks"
export const GET_CALENDAR_ALL_MEETINGS = "calender/get-calendar-meetings"
export const GET_DROPDOWN_CONTACT_LIST = "get-dropdown-contact"
export const GET_DROPDOWN_USER_LIST = "dropdown/get-user-list-dropdown"
export const CREATE_CALENDAR_MEETING = "calender/create-calendar-event"
export const CREATE_CALENDAR_TASK = "create-task"
export const RESCHEDULE_CALENDAR_MEETING = "calender/reschedule-calendar-meeting"
export const CANCEL_CALENDAR_MEETING = "calender/cancel-calendar-meeting"



