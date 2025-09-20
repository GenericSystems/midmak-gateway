import {
  GET_ABSENCE_PERCENT_DELETED_VALUE,
  GET_ABSENCE_PERCENT_DELETED_VALUE_FAIL,
  GET_ABSENCE_PERCENT_DELETED_VALUE_SUCCESS,
  GET_ABSENCE_PERCENTS,
  GET_ABSENCE_PERCENTS_FAIL,
  GET_ABSENCE_PERCENTS_SUCCESS,
  ADD_NEW_ABSENCE_PERCENT,
  ADD_ABSENCE_PERCENT_SUCCESS,
  ADD_ABSENCE_PERCENT_FAIL,
  UPDATE_ABSENCE_PERCENT,
  UPDATE_ABSENCE_PERCENT_SUCCESS,
  UPDATE_ABSENCE_PERCENT_FAIL,
  DELETE_ABSENCE_PERCENT,
  DELETE_ABSENCE_PERCENT_SUCCESS,
  DELETE_ABSENCE_PERCENT_FAIL,

} from "./actionTypes";

export const getAbsencePercents = () => ({
  type: GET_ABSENCE_PERCENTS,
});

export const getAbsencePercentsSuccess = absencePercents => ({
  type: GET_ABSENCE_PERCENTS_SUCCESS,
  payload: absencePercents,
});

export const getAbsencePercentsFail = error => ({
  type: GET_ABSENCE_PERCENTS_FAIL,
  payload: error,
});



export const getAbsencePercentDeletedValue = () => ({
  type: GET_ABSENCE_PERCENT_DELETED_VALUE,
});

export const getAbsencePercentDeletedValueSuccess = absencePercentProfile => ({
  type: GET_ABSENCE_PERCENT_DELETED_VALUE_SUCCESS,
  payload: absencePercentProfile,
});

export const getAbsencePercentDeletedValueFail = error => ({
  type: GET_ABSENCE_PERCENT_DELETED_VALUE_FAIL,
  payload: error,
});



export const addNewAbsencePercent = absencePercent => ({
  type: ADD_NEW_ABSENCE_PERCENT,
  payload: absencePercent,
});

export const addAbsencePercentSuccess = absencePercent => ({
  type: ADD_ABSENCE_PERCENT_SUCCESS,
  payload: absencePercent,
});

export const addAbsencePercentFail = error => ({
  type: ADD_ABSENCE_PERCENT_FAIL,
  payload: error,
});

export const updateAbsencePercent = absencePercent => {
  return {
    type: UPDATE_ABSENCE_PERCENT,
    payload: absencePercent,
  };
};

export const updateAbsencePercentSuccess = absencePercent => ({
  type: UPDATE_ABSENCE_PERCENT_SUCCESS,
  payload: absencePercent,
});

export const updateAbsencePercentFail = error => ({
  type: UPDATE_ABSENCE_PERCENT_FAIL,
  payload: error,
});

export const deleteAbsencePercent = absencePercent => ({
  type: DELETE_ABSENCE_PERCENT,
  payload: absencePercent,
});

export const deleteAbsencePercentSuccess = absencePercent => ({
  type: DELETE_ABSENCE_PERCENT_SUCCESS,
  payload: absencePercent,
});

export const deleteAbsencePercentFail = error => ({
  type: DELETE_ABSENCE_PERCENT_FAIL,
  payload: error,
});
