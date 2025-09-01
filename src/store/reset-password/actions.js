import {
  GET_TRAINEES_OPTIONS,
  GET_TRAINEES_OPTIONS_SUCCESS,
  GET_TRAINEES_OPTIONS_FAIL,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
} from "./actionTypes";

export const getTraineesOptions = () => ({
  type: GET_TRAINEES_OPTIONS,
});

export const getTraineesOptionsSuccess = Trainees => ({
  type: GET_TRAINEES_OPTIONS_SUCCESS,
  payload: Trainees,
});

export const getTraineesOptionsFail = error => ({
  type: GET_TRAINEES_OPTIONS_FAIL,
  payload: error,
});

export const updatePassword = studentinfo => {
  return {
    type: UPDATE_PASSWORD,
    payload: studentinfo,
  };
};

export const updatePasswordSuccess = studentinfo => ({
  type: UPDATE_PASSWORD_SUCCESS,
  payload: studentinfo,
});

export const updatePasswordFail = error => ({
  type: UPDATE_PASSWORD_FAIL,
  payload: error,
});
