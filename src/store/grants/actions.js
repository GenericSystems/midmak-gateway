import {
  GET_GRANTS,
  GET_GRANTS_SUCCESS,
  GET_GRANTS_FAIL,
  ADD_NEW_GRANT,
  ADD_GRANT_SUCCESS,
  ADD_GRANT_FAIL,
  UPDATE_GRANT,
  UPDATE_GRANT_SUCCESS,
  UPDATE_GRANT_FAIL,
  DELETE_GRANT,
  DELETE_GRANT_SUCCESS,
  DELETE_GRANT_FAIL,
  GET_GRANT_DELETED_VALUE,
  GET_GRANT_DELETED_VALUE_FAIL,
  GET_GRANT_DELETED_VALUE_SUCCESS,
} from "./actionTypes";
export const getGrants = () => ({
  type: GET_GRANTS,
});

export const getGrantsSuccess = grants => ({
  type: GET_GRANTS_SUCCESS,
  payload: grants,
});

export const getGrantsFail = error => ({
  type: GET_GRANTS_FAIL,
  payload: error,
});
export const addNewGrant = grant => ({
  type: ADD_NEW_GRANT,
  payload: grant,
});
export const addGrantSuccess = grant => ({
  type: ADD_GRANT_SUCCESS,
  payload: grant,
});

export const addGrantFail = error => ({
  type: ADD_GRANT_FAIL,
  payload: error,
});
export const updateGrant = grant => {
  return {
    type: UPDATE_GRANT,
    payload: grant,
  };
};

export const updateGrantSuccess = grant => ({
  type: UPDATE_GRANT_SUCCESS,
  payload: grant,
});

export const updateGrantFail = error => ({
  type: UPDATE_GRANT_FAIL,
  payload: error,
});
export const deleteGrant = grant => ({
  type: DELETE_GRANT,
  payload: grant,
});
export const deleteGrantSuccess = grant => ({
  type: DELETE_GRANT_SUCCESS,
  payload: grant,
});
export const deleteGrantFail = error => ({
  type: DELETE_GRANT_FAIL,
  payload: error,
});

export const getGrantDeletedValue = () => ({
  type: GET_GRANT_DELETED_VALUE,
});

export const getGrantDeletedValueSuccess = deleted => ({
  type: GET_GRANT_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getGrantDeletedValueFail = error => ({
  type: GET_GRANT_DELETED_VALUE_FAIL,
  payload: error,
});

