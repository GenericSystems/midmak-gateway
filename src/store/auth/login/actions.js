import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
  GET_USER_ID,
  GET_USER_ID_SUCCESS,
  GET_USER_ID_FAIL
} from "./actionTypes"

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history },
  }
}

export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const loginFailed = user => {
  return {
    type: LOGIN_FAILED,
    payload: user,
  }
}

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  }
}

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  }
}

export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  }
}

export const getUserId = () => ({
  type: GET_USER_ID,
});

export const getUserIdSuccess = deleted => ({
  type: GET_USER_ID_SUCCESS,
  payload: deleted,
});

export const getUserIdFail = error => ({
  type: GET_USER_ID_FAIL,
  payload: error,
});