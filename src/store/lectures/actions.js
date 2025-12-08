import {
  GET_LECTURES,
  GET_LECTURES_FAIL,
  GET_LECTURES_SUCCESS,
} from "./actionTypes";

export const getLectures = (lng, traineeId) => ({
  type: GET_LECTURES,
  payload: { lng, traineeId },
});

export const getLecturesSuccess = trainee => ({
  type: GET_LECTURES_SUCCESS,
  payload: trainee,
});

export const getLecturesFail = error => ({
  type: GET_LECTURES_FAIL,
  payload: error,
});
