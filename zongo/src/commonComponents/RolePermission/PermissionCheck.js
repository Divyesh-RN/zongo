import { useSelector } from "react-redux";


function PermissionCheck(
  module_name,
  action,
  group_uuid_check,
  created_by_admin,
  created_by
) {

  const user_data_main = useSelector(state => state.userRedux.user_data);
  const user_data = user_data_main.data;
  const createdby = user_data.user_uuid;
  var role_permission = user_data.role_permission;
  const main_uuid = user_data.main_uuid;

  if (user_data.role != "superadmin" && user_data.role != "admin") {
    var data = role_permission.filter((item) => item.slug === module_name);

    if (data != "") {
      if (action === "add") {
        return data[0].add;
      } else if (action === "listing") {
        return data[0].listing;
      } else if (action === "edit") {
        if (data[0].edit == "all") {
          return "";
        }

        if (data[0].edit == "none") {
          return "hidden";
        }

        if (data[0].edit == "group") {
          if (group_uuid_check === user_data.group_id) {
            return "";
          } else if (created_by_admin === createdby) {
            return "hidden";
          } else {
            return "hidden";
          }
        }

        if (data[0].edit == "owner") {
          if (created_by_admin != null) {
            if (created_by === createdby) {
              return "";
            } else if (created_by_admin == main_uuid) {
              return "hidden";
            } else {
              return "hidden";
            }
          } else {
            return "hidden";
          }
        }

        // return data[0].edit;
      } else if (action === "view") {
        if (data[0].view == "all") {
          return "";
        }

        if (data[0].view == "none") {
          return "hidden";
        }

        if (data[0].view == "group" && created_by_admin != null) {
          if (group_uuid_check === user_data.group_id) {
            return "";
          } else if (created_by_admin === createdby) {
            return "hidden";
          } else {
            return "hidden";
          }
        }

        if (data[0].view == "owner") {
          if (created_by_admin != null) {
            if (created_by === createdby) {
              return "";
            } else if (created_by_admin == main_uuid) {
              return "hidden";
            } else {
              return "hidden";
            }
          } else {
            return "hidden";
          }
        }
        // return data[0].view;
      } else if (action === "delete") {
        if (data[0].delete == "all") {
          return "";
        }

        if (data[0].delete == "none") {
          return "hidden";
        }

        if (data[0].delete == "group") {
          if (group_uuid_check === user_data.group_id) {
            return "";
          } else if (created_by_admin === createdby) {
            return "hidden";
          } else {
            return "hidden";
          }
        }

        if (data[0].delete == "owner") {
          if (created_by_admin != null) {
            if (created_by === createdby) {
              return "";
            } else if (created_by_admin == main_uuid) {
              return "hidden";
            } else {
              return "hidden";
            }
          } else {
            return "hidden";
          }
        }

        // return data[0].delete;
      } else if (action === "deleteAll") {
        return data[0].delete;
      } else {
        return "";
      }
    }
  } else {
    if (action === "add") {
      return "yes";
    } else if (action === "listing") {
      return "all";
    } else if (action === "edit") {
      return "";
    } else if (action === "delete") {
      return "";
    } else if (action === "view") {
      return "";
    }
  }

}

export default PermissionCheck;
