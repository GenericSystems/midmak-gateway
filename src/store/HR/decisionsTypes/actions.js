import {
  GET_DECISION_TYPE_DELETED_VALUE,
  GET_DECISION_TYPE_DELETED_VALUE_FAIL,
  GET_DECISION_TYPE_DELETED_VALUE_SUCCESS,
  GET_DECISIONS_TYPES,
  GET_DECISIONS_TYPES_FAIL,
  GET_DECISIONS_TYPES_SUCCESS,
  ADD_NEW_DECISION_TYPE,
  ADD_DECISION_TYPE_SUCCESS,
  ADD_DECISION_TYPE_FAIL,
  UPDATE_DECISION_TYPE,
  UPDATE_DECISION_TYPE_SUCCESS,
  UPDATE_DECISION_TYPE_FAIL,
  DELETE_DECISION_TYPE,
  DELETE_DECISION_TYPE_SUCCESS,
  DELETE_DECISION_TYPE_FAIL,
} from "./actionTypes";

export const getDecisionsTypes = () => ({
  type: GET_DECISIONS_TYPES,
});

export const getDecisionsTypesSuccess = decisionsTypes => ({
  type: GET_DECISIONS_TYPES_SUCCESS,
  payload: decisionsTypes,
});

export const getDecisionsTypesFail = error => ({
  type: GET_DECISIONS_TYPES_FAIL,
  payload: error,
});

export const getDecisionTypeDeletedValue = () => ({
  type: GET_DECISION_TYPE_DELETED_VALUE,
});

export const getDecisionTypeDeletedValueSuccess = decisionType => ({
  type: GET_DECISION_TYPE_DELETED_VALUE_SUCCESS,
  payload: decisionType,
});

export const getDecisionTypeDeletedValueFail = error => ({
  type: GET_DECISION_TYPE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewDecisionType = decisionType => ({
  type: ADD_NEW_DECISION_TYPE,
  payload: decisionType,
});

export const addDecisionTypeSuccess = decisionType => ({
  type: ADD_DECISION_TYPE_SUCCESS,
  payload: decisionType,
});

export const addDecisionTypeFail = error => ({
  type: ADD_DECISION_TYPE_FAIL,
  payload: error,
});

export const updateDecisionType = decisionType => {
  return {
    type: UPDATE_DECISION_TYPE,
    payload: decisionType,
  };
};

export const updateDecisionTypeSuccess = decisionType => ({
  type: UPDATE_DECISION_TYPE_SUCCESS,
  payload: decisionType,
});

export const updateDecisionTypeFail = error => ({
  type: UPDATE_DECISION_TYPE_FAIL,
  payload: error,
});

export const deleteDecisionType = decisionType => ({
  type: DELETE_DECISION_TYPE,
  payload: decisionType,
});

export const deleteDecisionTypeSuccess = decisionType => ({
  type: DELETE_DECISION_TYPE_SUCCESS,
  payload: decisionType,
});

export const deleteDecisionTypeFail = error => ({
  type: DELETE_DECISION_TYPE_FAIL,
  payload: error,
});
