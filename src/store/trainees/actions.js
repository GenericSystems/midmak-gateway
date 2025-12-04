import {
  GET_TRAINEES,
  GET_TRAINEES_FAIL,
  GET_TRAINEES_SUCCESS,
  GET_SOCIAL_STATUS,
  GET_SOCIAL_STATUS_FAIL,
  GET_SOCIAL_STATUS_SUCCESS,
} from "./actionTypes";

export const getTrainees = (lng, traineeId) => ({
  type: GET_TRAINEES,
  payload: { lng, traineeId },
});

export const getTraineesSuccess = trainee => ({
  type: GET_TRAINEES_SUCCESS,
  payload: trainee,
});

export const getTraineesFail = error => ({
  type: GET_TRAINEES_FAIL,
  payload: error,
});

export const getSocialStatus = socialStatus => ({
  type: GET_SOCIAL_STATUS,
  payload: socialStatus,
});

export const getSocialStatusSuccess = socialStatus => ({
  type: GET_SOCIAL_STATUS_SUCCESS,
  payload: socialStatus,
});

export const getSocialStatusFail = error => ({
  type: GET_SOCIAL_STATUS_FAIL,
  payload: error,
});
