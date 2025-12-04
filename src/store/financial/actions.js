import {
  GET_FINANCIALS,
  GET_FINANCIALS_FAIL,
  GET_FINANCIALS_SUCCESS,
} from "./actionTypes";

export const getFinancials = (lng, traineeId) => ({
  type: GET_FINANCIALS,
  payload: { lng, traineeId },
});

export const getFinancialsSuccess = trainee => ({
  type: GET_FINANCIALS_SUCCESS,
  payload: trainee,
});

export const getFinancialsFail = error => ({
  type: GET_FINANCIALS_FAIL,
  payload: error,
});
