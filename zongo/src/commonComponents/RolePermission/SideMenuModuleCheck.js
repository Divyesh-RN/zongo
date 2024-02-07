
export const SideMenuModuleCheck = (
    slug,
    userData
) => {

    var user_data = userData?.data;

    if (user_data !== null && user_data !== undefined) {

        var role_permission = user_data?.role_permission;

        if (user_data?.role != "superadmin" && user_data?.role != "admin") {
            var data = role_permission?.filter((item) => item.slug === slug);
            if (data != "" && data !== undefined) {
                if (data[0]?.status === "enable") {
                    return "";
                } else {
                    return "hidden";
                }
            }
        } else {
            if (user_data?.role === "superadmin") {
                return "hidden";
            } else {
                return "";
            }
        }
    }
    else {
        return ""
    }


}

export default SideMenuModuleCheck;
