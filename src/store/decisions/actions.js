import {
  GET_DECISIONS,
  GET_DECISIONS_SUCCESS,
  GET_DECISIONS_FAIL,
  ADD_NEW_DECISION,
  ADD_DECISION_SUCCESS,
  ADD_DECISION_FAIL,
  UPDATE_DECISION,
  UPDATE_DECISION_SUCCESS,
  UPDATE_DECISION_FAIL,
  DELETE_DECISION,
  DELETE_DECISION_SUCCESS,
  DELETE_DECISION_FAIL,
  GET_DECISION_DELETED_VALUE,
  GET_DECISION_DELETED_VALUE_FAIL,
  GET_DECISION_DELETED_VALUE_SUCCESS,
  GET_DECISION_MAKERS,
  GET_DECISION_MAKERS_SUCCESS,
  GET_DECISION_MAKERS_FAIL,
  GET_DECISION_STATUS,
  GET_DECISION_STATUS_SUCCESS,
  GET_DECISION_STATUS_FAIL,
} from "./actionTypes";

export const getDecisions = () => ({
  type: GET_DECISIONS,
});

export const getDecisionsSuccess = decisions => ({
  type: GET_DECISIONS_SUCCESS,
  payload: decisions,
});

export const getDecisionsFail = error => ({
  type: GET_DECISIONS_FAIL,
  payload: error,
});
export const addNewDecision = decision => ({
  type: ADD_NEW_DECISION,
  payload: decision,
});
export const addDecisionSuccess = decision => ({
  type: ADD_DECISION_SUCCESS,
  payload: decision,
});

export const addDecisionFail = error => ({
  type: ADD_DECISION_FAIL,
  payload: error,
});
export const updateDecision = decision => ({
  type: UPDATE_DECISION,
  payload: decision,
});

export const updateDecisionSuccess = decision => ({
  type: UPDATE_DECISION_SUCCESS,
  payload: decision,
});

export const updateDecisionFail = error => ({
  type: UPDATE_DECISION_FAIL,
  payload: error,
});
export const deleteDecision = decision => ({
  type: DELETE_DECISION,
  payload: decision,
});
export const deleteDecisionSuccess = decision => ({
  type: DELETE_DECISION_SUCCESS,
  payload: decision,
});
export const deleteDecisionFail = error => ({
  type: DELETE_DECISION_FAIL,
  payload: error,
});

export const getDecisionDeletedValue = () => ({
  type: GET_DECISION_DELETED_VALUE,
});

export const getDecisionDeletedValueSuccess = deleted => ({
  type: GET_DECISION_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getDecisionDeletedValueFail = error => ({
  type: GET_DECISION_DELETED_VALUE_FAIL,
  payload: error,
});

export const getDecisionMakers = () => ({
  type: GET_DECISION_MAKERS,
});

export const getDecisionMakersSuccess = decisions => ({
  type: GET_DECISION_MAKERS_SUCCESS,
  payload: decisions,
});

export const getDecisionMakersFail = error => ({
  type: GET_DECISION_MAKERS_FAIL,
  payload: error,
});

export const getDecisionStatus = () => ({
  type: GET_DECISION_STATUS,
});

export const getDecisionStatusSuccess = decisions => ({
  type: GET_DECISION_STATUS_SUCCESS,
  payload: decisions,
});

export const getDecisionStatusFail = error => ({
  type: GET_DECISION_STATUS_FAIL,
  payload: error,
});
