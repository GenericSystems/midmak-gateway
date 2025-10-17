import {
  GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE,
  GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE_FAIL,
  GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE_SUCCESS,
  GET_REGISTER_TRAINEES_ATTENDANCE,
  GET_REGISTER_TRAINEES_ATTENDANCE_FAIL,
  GET_REGISTER_TRAINEES_ATTENDANCE_SUCCESS,
  ADD_NEW_REGISTER_TRAINEE_ATTENDANCE,
  ADD_REGISTER_TRAINEE_ATTENDANCE_SUCCESS,
  ADD_REGISTER_TRAINEE_ATTENDANCE_FAIL,
  UPDATE_REGISTER_TRAINEE_ATTENDANCE,
  UPDATE_REGISTER_TRAINEE_ATTENDANCE_SUCCESS,
  UPDATE_REGISTER_TRAINEE_ATTENDANCE_FAIL,
  DELETE_REGISTER_TRAINEE_ATTENDANCE,
  DELETE_REGISTER_TRAINEE_ATTENDANCE_SUCCESS,
  DELETE_REGISTER_TRAINEE_ATTENDANCE_FAIL,
} from "./actionTypes";

export const getRegisterTraineesAttendance = trainees => ({
  type: GET_REGISTER_TRAINEES_ATTENDANCE,
  payload: trainees,
});

export const getRegisterTraineesAttendanceSuccess = trainees => ({
  type: GET_REGISTER_TRAINEES_ATTENDANCE_SUCCESS,
  payload: trainees,
});

export const getRegisterTraineesAttendanceFail = error => ({
  type: GET_REGISTER_TRAINEES_ATTENDANCE_FAIL,
  payload: error,
});

export const getRegisterTraineeAttendanceDeletedValue = () => ({
  type: GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE,
});

export const getRegisterTraineeAttendanceDeletedValueSuccess =
  traineeProfile => ({
    type: GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE_SUCCESS,
    payload: traineeProfile,
  });

export const getRegisterTraineeAttendanceDeletedValueFail = error => ({
  type: GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewRegisterTraineeAttendance = trainee => ({
  type: ADD_NEW_REGISTER_TRAINEE_ATTENDANCE,
  payload: trainee,
});

export const addRegisterTraineeAttendanceSuccess = trainee => ({
  type: ADD_REGISTER_TRAINEE_ATTENDANCE_SUCCESS,
  payload: trainee,
});

export const addRegisterTraineeAttendanceFail = error => ({
  type: ADD_REGISTER_TRAINEE_ATTENDANCE_FAIL,
  payload: error,
});

export const updateRegisterTraineeAttendance = trainee => ({
  type: UPDATE_REGISTER_TRAINEE_ATTENDANCE,
  payload: trainee,
});

export const updateRegisterTraineeAttendanceSuccess = trainee => ({
  type: UPDATE_REGISTER_TRAINEE_ATTENDANCE_SUCCESS,
  payload: trainee,
});

export const updateRegisterTraineeAttendanceFail = error => ({
  type: UPDATE_REGISTER_TRAINEE_ATTENDANCE_FAIL,
  payload: error,
});

export const deleteRegisterTraineeAttendance = trainee => ({
  type: DELETE_REGISTER_TRAINEE_ATTENDANCE,
  payload: trainee,
});

export const deleteRegisterTraineeAttendanceSuccess = trainee => ({
  type: DELETE_REGISTER_TRAINEE_ATTENDANCE_SUCCESS,
  payload: trainee,
});

export const deleteRegisterTraineeAttendanceFail = error => ({
  type: DELETE_REGISTER_TRAINEE_ATTENDANCE_FAIL,
  payload: error,
});
