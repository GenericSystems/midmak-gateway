import {
  GET_DECISIONS,
  GET_DECISIONS_FAIL,
  GET_DECISIONS_SUCCESS,
} from "./actionTypes";

export const getDecisions = (lng, traineeId) => ({
  type: GET_DECISIONS,
  payload: { lng, traineeId },
});

export const getDecisionsSuccess = trainee => ({
  type: GET_DECISIONS_SUCCESS,
  payload: trainee,
});

export const getDecisionsFail = error => ({
  type: GET_DECISIONS_FAIL,
  payload: error,
});
