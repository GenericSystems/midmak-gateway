import { GET_EXAMS, GET_EXAMS_FAIL, GET_EXAMS_SUCCESS } from "./actionTypes";

export const getExams = (lng, traineeId) => ({
  type: GET_EXAMS,
  payload: { lng, traineeId },
});

export const getExamsSuccess = trainee => ({
  type: GET_EXAMS_SUCCESS,
  payload: trainee,
});

export const getExamsFail = error => ({
  type: GET_EXAMS_FAIL,
  payload: error,
});
