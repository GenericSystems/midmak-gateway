import {
  GET_STUDENTS_HISTORY,
  GET_STUDENTS_HISTORY_FAIL,
  GET_STUDENTS_HISTORY_SUCCESS,
  ADD_NEW_STUDENT_HISTORY,
  ADD_STUDENT_HISTORY_SUCCESS,
  ADD_STUDENT_HISTORY_FAIL,
  CALCULATE_STUDENT_HISTORY,
  CALCULATE_STUDENT_HISTORY_SUCCESS,
  CALCULATE_STUDENT_HISTORY_FAIL,
  CALCULATE_ALL_STUDENT_HISTORY,
  CALCULATE_ALL_STUDENT_HISTORY_SUCCESS,
  CALCULATE_ALL_STUDENT_HISTORY_FAIL,
} from "./actionTypes";

export const getStudentsHistory = yearsemester => ({
  type: GET_STUDENTS_HISTORY,
  payload: yearsemester,
});

export const getStudentsHistorySuccess = StudentsHistory => ({
  type: GET_STUDENTS_HISTORY_SUCCESS,
  payload: StudentsHistory,
});

export const getStudentsHistoryFail = error => ({
  type: GET_STUDENTS_HISTORY_FAIL,
  payload: error,
});

export const addNewStudentHistory = StudentHistory => ({
  type: ADD_NEW_STUDENT_HISTORY,
  payload: StudentHistory,
});

export const addStudentHistorySuccess = StudentHistory => ({
  type: ADD_STUDENT_HISTORY_SUCCESS,
  payload: StudentHistory,
});

export const addStudentHistoryFail = error => ({
  type: ADD_STUDENT_HISTORY_FAIL,
  payload: error,
});

export const calculateStudentHistory = StudentHistory => {
  return {
    type: CALCULATE_STUDENT_HISTORY,
    payload: StudentHistory,
  };
};

export const calculateStudentHistorySuccess = StudentHistory => ({
  type: CALCULATE_STUDENT_HISTORY_SUCCESS,
  payload: StudentHistory,
});

export const calculateStudentHistoryFail = error => ({
  type: CALCULATE_STUDENT_HISTORY_FAIL,
  payload: error,
});

export const calculateAllStudentHistory = StudentHistory => ({
  type: CALCULATE_ALL_STUDENT_HISTORY,
  payload: StudentHistory,
});

export const calculateAllStudentHistorySuccess = StudentHistory => ({
  type: CALCULATE_ALL_STUDENT_HISTORY_SUCCESS,
  payload: StudentHistory,
});

export const calculateAllStudentHistoryFail = error => ({
  type: CALCULATE_ALL_STUDENT_HISTORY_FAIL,
  payload: error,
});
