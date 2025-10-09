import {
  GET_DISMISS_PERIOD_DECREE_DELETED_VALUE,
  GET_DISMISS_PERIOD_DECREE_DELETED_VALUE_FAIL,
  GET_DISMISS_PERIOD_DECREE_DELETED_VALUE_SUCCESS,
  GET_DISMISS_PERIOD_DECREES,
  GET_DISMISS_PERIOD_DECREES_FAIL,
  GET_DISMISS_PERIOD_DECREES_SUCCESS,
  ADD_NEW_DISMISS_PERIOD_DECREE,
  ADD_DISMISS_PERIOD_DECREE_SUCCESS,
  ADD_DISMISS_PERIOD_DECREE_FAIL,
  UPDATE_DISMISS_PERIOD_DECREE,
  UPDATE_DISMISS_PERIOD_DECREE_SUCCESS,
  UPDATE_DISMISS_PERIOD_DECREE_FAIL,
  DELETE_DISMISS_PERIOD_DECREE,
  DELETE_DISMISS_PERIOD_DECREE_SUCCESS,
  DELETE_DISMISS_PERIOD_DECREE_FAIL,
} from "./actionTypes";

export const getDismissPeriodDecrees = () => ({
  type: GET_DISMISS_PERIOD_DECREES,
});

export const getDismissPeriodDecreesSuccess = dismissPeriodDecrees => ({
  type: GET_DISMISS_PERIOD_DECREES_SUCCESS,
  payload: dismissPeriodDecrees,
});

export const getDismissPeriodDecreesFail = error => ({
  type: GET_DISMISS_PERIOD_DECREES_FAIL,
  payload: error,
});

export const getDismissPeriodDecreeDeletedValue = () => ({
  type: GET_DISMISS_PERIOD_DECREE_DELETED_VALUE,
});

export const getDismissPeriodDecreeDeletedValueSuccess =
  dismissPeriodDecree => ({
    type: GET_DISMISS_PERIOD_DECREE_DELETED_VALUE_SUCCESS,
    payload: dismissPeriodDecree,
  });

export const getDismissPeriodDecreeDeletedValueFail = error => ({
  type: GET_DISMISS_PERIOD_DECREE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewDismissPeriodDecree = dismissPeriodDecree => ({
  type: ADD_NEW_DISMISS_PERIOD_DECREE,
  payload: dismissPeriodDecree,
});

export const addDismissPeriodDecreeSuccess = dismissPeriodDecree => ({
  type: ADD_DISMISS_PERIOD_DECREE_SUCCESS,
  payload: dismissPeriodDecree,
});

export const addDismissPeriodDecreeFail = error => ({
  type: ADD_DISMISS_PERIOD_DECREE_FAIL,
  payload: error,
});

export const updateDismissPeriodDecree = dismissPeriodDecree => ({
  type: UPDATE_DISMISS_PERIOD_DECREE,
  payload: dismissPeriodDecree,
});

export const updateDismissPeriodDecreeSuccess = dismissPeriodDecree => ({
  type: UPDATE_DISMISS_PERIOD_DECREE_SUCCESS,
  payload: dismissPeriodDecree,
});

export const updateDismissPeriodDecreeFail = error => ({
  type: UPDATE_DISMISS_PERIOD_DECREE_FAIL,
  payload: error,
});

export const deleteDismissPeriodDecree = dismissPeriodDecree => ({
  type: DELETE_DISMISS_PERIOD_DECREE,
  payload: dismissPeriodDecree,
});

export const deleteDismissPeriodDecreeSuccess = dismissPeriodDecree => ({
  type: DELETE_DISMISS_PERIOD_DECREE_SUCCESS,
  payload: dismissPeriodDecree,
});

export const deleteDismissPeriodDecreeFail = error => ({
  type: DELETE_DISMISS_PERIOD_DECREE_FAIL,
  payload: error,
});
