import { useSelector } from "react-redux";


function CheckModulePermisson(slug) {
    const user_data_main = useSelector(state => state.userRedux.user_data);
    const user_data = user_data_main?.data;
    var role_permission = user_data?.role_permission;
    if (user_data !== null && user_data !== undefined) {
    if (user_data?.role != "superadmin" && user_data?.role != "admin") {
        var data = role_permission?.filter((item) => item.slug === slug);
        if (data != "") {
            if (data[0].status === "enable") {
                return "";
            } else {
                return "hidden";
            }
        }
    } else {
        if (user_data.role === "superadmin") {
            return "hidden";
        } else {
            return "";
        }
    }
}
}

export default CheckModulePermisson;
