import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  dispatch()
  try {
    console.log('In Login ApiCall');
    console.log(user);
    const res = await axios.post("auth/login", user);
    console.log('In Login ApiCall');
    console.log(res);
    res.data.isAdmin && dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};
