import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    console.log('In Login ApiCall');
    console.log(user);
    const res = await axios.post("auth/login", user);
    console.log('In Login ApiCall');
    console.log(res);
    const responseUser = {
      ...res.data.user,
      accessToken: res.data.accessToken
    }
    res.data.user.isAdmin && dispatch(loginSuccess(responseUser));
  } catch (err) {
    dispatch(loginFailure());
  }
};
