import { useDispatch } from "react-redux";
import { changeIncomingAlertState } from "../redux/reducers/userReducer";

const dispatch = useDispatch()
export const  incomingAlert = (a) =>{
    dispatch(changeIncomingAlertState(a));
}

