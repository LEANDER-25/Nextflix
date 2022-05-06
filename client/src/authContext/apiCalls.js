import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("auth/login", user);
    const responseUser = {
      ...res.data.user,
      accessToken: res.data.accessToken
    }
    dispatch(loginSuccess(responseUser));
  } catch (err) {
    dispatch(loginFailure());
  }
};
