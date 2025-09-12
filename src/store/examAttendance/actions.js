import {
  GET_EXAMS_ATTENDANCE,
  GET_EXAMS_ATTENDANCE_FAIL,
  GET_EXAMS_ATTENDANCE_SUCCESS,
  ADD_NEW_EXAM_ATTENDANCE,
  ADD_EXAM_ATTENDANCE_SUCCESS,
  ADD_EXAM_ATTENDANCE_FAIL,
  UPDATE_EXAM_ATTENDANCE,
  UPDATE_EXAM_ATTENDANCE_SUCCESS,
  UPDATE_EXAM_ATTENDANCE_FAIL,
  DELETE_EXAM_ATTENDANCE,
  DELETE_EXAM_ATTENDANCE_SUCCESS,
  DELETE_EXAM_ATTENDANCE_FAIL,
  GET_EXAM_ATTENDANCE_DELETED_VALUE,
  GET_EXAM_ATTENDANCE_DELETED_VALUE_FAIL,
  GET_EXAM_ATTENDANCE_DELETED_VALUE_SUCCESS,
} from "./actionTypes";

export const getExamsAttendance = () => ({
  type: GET_EXAMS_ATTENDANCE,
  // payload: examsAttendance,
});

export const getExamsAttendanceSuccess = examsAttendance => ({
  type: GET_EXAMS_ATTENDANCE_SUCCESS,
  payload: examsAttendance,
});

export const getExamsAttendanceFail = error => ({
  type: GET_EXAMS_ATTENDANCE_FAIL,
  payload: error,
});

export const addNewExamAttendance = examAttendance => ({
  type: ADD_NEW_EXAM_ATTENDANCE,
  payload: examAttendance,
});

export const addExamAttendanceSuccess = examAttendance => ({
  type: ADD_EXAM_ATTENDANCE_SUCCESS,
  payload: examAttendance,
});

export const addExamAttendanceFail = error => ({
  type: ADD_EXAM_ATTENDANCE_FAIL,
  payload: error,
});

export const updateExamAttendance = examAttendance => {
  return {
    type: UPDATE_EXAM_ATTENDANCE,
    payload: examAttendance,
  };
};

export const updateExamAttendanceSuccess = examAttendance => ({
  type: UPDATE_EXAM_ATTENDANCE_SUCCESS,
  payload: examAttendance,
});

export const updateExamAttendanceFail = error => ({
  type: UPDATE_EXAM_ATTENDANCE_FAIL,
  payload: error,
});

export const deleteExamAttendance = examAttendance => ({
  type: DELETE_EXAM_ATTENDANCE,
  payload: examAttendance,
});

export const deleteExamAttendanceSuccess = examAttendance => ({
  type: DELETE_EXAM_ATTENDANCE_SUCCESS,
  payload: examAttendance,
});

export const deleteExamAttendanceFail = error => ({
  type: DELETE_EXAM_ATTENDANCE_FAIL,
  payload: error,
});

export const getExamAttendanceDeletedValue = () => ({
  type: GET_EXAM_ATTENDANCE_DELETED_VALUE,
});

export const getExamAttendanceDeletedValueSuccess = deleted => ({
  type: GET_EXAM_ATTENDANCE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getExamAttendanceDeletedValueFail = error => ({
  type: GET_EXAM_ATTENDANCE_DELETED_VALUE_FAIL,
  payload: error,
});
