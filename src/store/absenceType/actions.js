import {
  GET_ABSENCE_TYPE_DELETED_VALUE,
  GET_ABSENCE_TYPE_DELETED_VALUE_FAIL,
  GET_ABSENCE_TYPE_DELETED_VALUE_SUCCESS,
  GET_ABSENCES_TYPES,
  GET_ABSENCES_TYPES_FAIL,
  GET_ABSENCES_TYPES_SUCCESS,
  ADD_NEW_ABSENCE_TYPE,
  ADD_ABSENCE_TYPE_SUCCESS,
  ADD_ABSENCE_TYPE_FAIL,
  UPDATE_ABSENCE_TYPE,
  UPDATE_ABSENCE_TYPE_SUCCESS,
  UPDATE_ABSENCE_TYPE_FAIL,
  DELETE_ABSENCE_TYPE,
  DELETE_ABSENCE_TYPE_SUCCESS,
  DELETE_ABSENCE_TYPE_FAIL,
} from "./actionTypes";

export const getAbsencesTypes = () => ({
  type: GET_ABSENCES_TYPES,
});

export const getAbsencesTypesSuccess = absencesTypes => ({
  type: GET_ABSENCES_TYPES_SUCCESS,
  payload: absencesTypes,
});

export const getAbsencesTypesFail = error => ({
  type: GET_ABSENCES_TYPES_FAIL,
  payload: error,
});

export const getAbsenceTypeDeletedValue = () => ({
  type: GET_ABSENCE_TYPE_DELETED_VALUE,
});

export const getAbsenceTypeDeletedValueSuccess = absenceType => ({
  type: GET_ABSENCE_TYPE_DELETED_VALUE_SUCCESS,
  payload: absenceType,
});

export const getAbsenceTypeDeletedValueFail = error => ({
  type: GET_ABSENCE_TYPE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewAbsenceType = absenceType => ({
  type: ADD_NEW_ABSENCE_TYPE,
  payload: absenceType,
});

export const addAbsenceTypeSuccess = absenceType => ({
  type: ADD_ABSENCE_TYPE_SUCCESS,
  payload: absenceType,
});

export const addAbsenceTypeFail = error => ({
  type: ADD_ABSENCE_TYPE_FAIL,
  payload: error,
});

export const updateAbsenceType = absenceType => {
  return {
    type: UPDATE_ABSENCE_TYPE,
    payload: absenceType,
  };
};

export const updateAbsenceTypeSuccess = absenceType => ({
  type: UPDATE_ABSENCE_TYPE_SUCCESS,
  payload: absenceType,
});

export const updateAbsenceTypeFail = error => ({
  type: UPDATE_ABSENCE_TYPE_FAIL,
  payload: error,
});

export const deleteAbsenceType = absenceType => ({
  type: DELETE_ABSENCE_TYPE,
  payload: absenceType,
});

export const deleteAbsenceTypeSuccess = absenceType => ({
  type: DELETE_ABSENCE_TYPE_SUCCESS,
  payload: absenceType,
});

export const deleteAbsenceTypeFail = error => ({
  type: DELETE_ABSENCE_TYPE_FAIL,
  payload: error,
});
