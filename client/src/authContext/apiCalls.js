import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("auth/login", user);
<<<<<<< HEAD
    const responseUser = {
      ...res.data.user,
      accessToken: res.data.accessToken
    }
    dispatch(loginSuccess(responseUser));
=======
    dispatch(loginSuccess(res.data));
>>>>>>> b48fc4c83d1a18c178229637b09bbb2f872d94fe
  } catch (err) {
    dispatch(loginFailure());
  }
};
