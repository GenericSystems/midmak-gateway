import {
  GET_ABSENCE_JUSTIFICATION_DELETED_VALUE,
  GET_ABSENCE_JUSTIFICATION_DELETED_VALUE_FAIL,
  GET_ABSENCE_JUSTIFICATION_DELETED_VALUE_SUCCESS,
  GET_ABSENCES_JUSTIFICATIONS,
  GET_ABSENCES_JUSTIFICATIONS_FAIL,
  GET_ABSENCES_JUSTIFICATIONS_SUCCESS,
  ADD_NEW_ABSENCE_JUSTIFICATION,
  ADD_ABSENCE_JUSTIFICATION_SUCCESS,
  ADD_ABSENCE_JUSTIFICATION_FAIL,
  UPDATE_ABSENCE_JUSTIFICATION,
  UPDATE_ABSENCE_JUSTIFICATION_SUCCESS,
  UPDATE_ABSENCE_JUSTIFICATION_FAIL,
  DELETE_ABSENCE_JUSTIFICATION,
  DELETE_ABSENCE_JUSTIFICATION_SUCCESS,
  DELETE_ABSENCE_JUSTIFICATION_FAIL,
} from "./actionTypes";

export const getAbsencesJustifications = () => ({
  type: GET_ABSENCES_JUSTIFICATIONS,
});

export const getAbsencesJustificationsSuccess = absencesJustifications => ({
  type: GET_ABSENCES_JUSTIFICATIONS_SUCCESS,
  payload: absencesJustifications,
});

export const getAbsencesJustificationsFail = error => ({
  type: GET_ABSENCES_JUSTIFICATIONS_FAIL,
  payload: error,
});

export const getAbsenceJustificationDeletedValue = () => ({
  type: GET_ABSENCE_JUSTIFICATION_DELETED_VALUE,
});

export const getAbsenceJustificationDeletedValueSuccess = absenceJustification => ({
  type: GET_ABSENCE_JUSTIFICATION_DELETED_VALUE_SUCCESS,
  payload: absenceJustification,
});

export const getAbsenceJustificationDeletedValueFail = error => ({
  type: GET_ABSENCE_JUSTIFICATION_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewAbsenceJustification = absenceJustification => ({
  type: ADD_NEW_ABSENCE_JUSTIFICATION,
  payload: absenceJustification,
});

export const addAbsenceJustificationSuccess = absenceJustification => ({
  type: ADD_ABSENCE_JUSTIFICATION_SUCCESS,
  payload: absenceJustification,
});

export const addAbsenceJustificationFail = error => ({
  type: ADD_ABSENCE_JUSTIFICATION_FAIL,
  payload: error,
});

export const updateAbsenceJustification = absenceJustification => {
  return {
    type: UPDATE_ABSENCE_JUSTIFICATION,
    payload: absenceJustification,
  };
};

export const updateAbsenceJustificationSuccess = absenceJustification => ({
  type: UPDATE_ABSENCE_JUSTIFICATION_SUCCESS,
  payload: absenceJustification,
});

export const updateAbsenceJustificationFail = error => ({
  type: UPDATE_ABSENCE_JUSTIFICATION_FAIL,
  payload: error,
});

export const deleteAbsenceJustification = absenceJustification => ({
  type: DELETE_ABSENCE_JUSTIFICATION,
  payload: absenceJustification,
});

export const deleteAbsenceJustificationSuccess = absenceJustification => ({
  type: DELETE_ABSENCE_JUSTIFICATION_SUCCESS,
  payload: absenceJustification,
});

export const deleteAbsenceJustificationFail = error => ({
  type: DELETE_ABSENCE_JUSTIFICATION_FAIL,
  payload: error,
});
