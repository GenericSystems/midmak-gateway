import {
  GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE,
  GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE_FAIL,
  GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE_SUCCESS,
  GET_DISMISS_ACADEMY_DECREES,
  GET_DISMISS_ACADEMY_DECREES_FAIL,
  GET_DISMISS_ACADEMY_DECREES_SUCCESS,
  ADD_NEW_DISMISS_ACADEMY_DECREE,
  ADD_DISMISS_ACADEMY_DECREE_SUCCESS,
  ADD_DISMISS_ACADEMY_DECREE_FAIL,
  UPDATE_DISMISS_ACADEMY_DECREE,
  UPDATE_DISMISS_ACADEMY_DECREE_SUCCESS,
  UPDATE_DISMISS_ACADEMY_DECREE_FAIL,
  DELETE_DISMISS_ACADEMY_DECREE,
  DELETE_DISMISS_ACADEMY_DECREE_SUCCESS,
  DELETE_DISMISS_ACADEMY_DECREE_FAIL,
} from "./actionTypes";

export const getDismissAcademyDecrees = () => ({
  type: GET_DISMISS_ACADEMY_DECREES,
});

export const getDismissAcademyDecreesSuccess = dismissAcademyDecrees => ({
  type: GET_DISMISS_ACADEMY_DECREES_SUCCESS,
  payload: dismissAcademyDecrees,
});

export const getDismissAcademyDecreesFail = error => ({
  type: GET_DISMISS_ACADEMY_DECREES_FAIL,
  payload: error,
});

export const getDismissAcademyDecreeDeletedValue = () => ({
  type: GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE,
});

export const getDismissAcademyDecreeDeletedValueSuccess =
  dismissAcademyDecree => ({
    type: GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE_SUCCESS,
    payload: dismissAcademyDecree,
  });

export const getDismissAcademyDecreeDeletedValueFail = error => ({
  type: GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewDismissAcademyDecree = dismissAcademyDecree => ({
  type: ADD_NEW_DISMISS_ACADEMY_DECREE,
  payload: dismissAcademyDecree,
});

export const addDismissAcademyDecreeSuccess = dismissAcademyDecree => ({
  type: ADD_DISMISS_ACADEMY_DECREE_SUCCESS,
  payload: dismissAcademyDecree,
});

export const addDismissAcademyDecreeFail = error => ({
  type: ADD_DISMISS_ACADEMY_DECREE_FAIL,
  payload: error,
});

export const updateDismissAcademyDecree = dismissAcademyDecree => ({
  type: UPDATE_DISMISS_ACADEMY_DECREE,
  payload: dismissAcademyDecree,
});

export const updateDismissAcademyDecreeSuccess = dismissAcademyDecree => ({
  type: UPDATE_DISMISS_ACADEMY_DECREE_SUCCESS,
  payload: dismissAcademyDecree,
});

export const updateDismissAcademyDecreeFail = error => ({
  type: UPDATE_DISMISS_ACADEMY_DECREE_FAIL,
  payload: error,
});

export const deleteDismissAcademyDecree = dismissAcademyDecree => ({
  type: DELETE_DISMISS_ACADEMY_DECREE,
  payload: dismissAcademyDecree,
});

export const deleteDismissAcademyDecreeSuccess = dismissAcademyDecree => ({
  type: DELETE_DISMISS_ACADEMY_DECREE_SUCCESS,
  payload: dismissAcademyDecree,
});

export const deleteDismissAcademyDecreeFail = error => ({
  type: DELETE_DISMISS_ACADEMY_DECREE_FAIL,
  payload: error,
});
