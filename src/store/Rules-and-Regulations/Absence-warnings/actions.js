import {
  GET_ABSENCE_WARNING_DELETED_VALUE,
  GET_ABSENCE_WARNING_DELETED_VALUE_FAIL,
  GET_ABSENCE_WARNING_DELETED_VALUE_SUCCESS,
  // GET_ABSENCE_WARNINGS,
  // GET_ABSENCE_WARNINGS_FAIL,
  // GET_ABSENCE_WARNINGS_SUCCESS,
  GET_DECISION_REASONS,
  GET_DECISION_REASONS_FAIL,
  GET_DECISION_REASONS_SUCCESS,
  ADD_NEW_ABSENCE_WARNING,
  ADD_ABSENCE_WARNING_SUCCESS,
  ADD_ABSENCE_WARNING_FAIL,
  UPDATE_ABSENCE_WARNING,
  UPDATE_ABSENCE_WARNING_SUCCESS,
  UPDATE_ABSENCE_WARNING_FAIL,
  DELETE_ABSENCE_WARNING,
  DELETE_ABSENCE_WARNING_SUCCESS,
  DELETE_ABSENCE_WARNING_FAIL,
} from "./actionTypes";

export const getAbsenceWarnings = () => ({
  type: GET_ABSENCE_WARNINGS,
});

export const getAbsenceWarningsSuccess = absenceWarnings => ({
  type: GET_ABSENCE_WARNINGS_SUCCESS,
  payload: absenceWarnings,
});

export const getAbsenceWarningsFail = error => ({
  type: GET_ABSENCE_WARNINGS_FAIL,
  payload: error,
});

export const getAbsenceWarningDeletedValue = () => ({
  type: GET_ABSENCE_WARNING_DELETED_VALUE,
});

export const getAbsenceWarningDeletedValueSuccess = absenceWarning => ({
  type: GET_ABSENCE_WARNING_DELETED_VALUE_SUCCESS,
  payload: absenceWarning,
});

export const getAbsenceWarningDeletedValueFail = error => ({
  type: GET_ABSENCE_WARNING_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewAbsenceWarning = absenceWarning => ({
  type: ADD_NEW_ABSENCE_WARNING,
  payload: absenceWarning,
});

export const addAbsenceWarningSuccess = absenceWarning => ({
  type: ADD_ABSENCE_WARNING_SUCCESS,
  payload: absenceWarning,
});

export const addAbsenceWarningFail = error => ({
  type: ADD_ABSENCE_WARNING_FAIL,
  payload: error,
});

export const updateAbsenceWarning = absenceWarning => ({
  type: UPDATE_ABSENCE_WARNING,
  payload: absenceWarning,
});

export const updateAbsenceWarningSuccess = absenceWarning => ({
  type: UPDATE_ABSENCE_WARNING_SUCCESS,
  payload: absenceWarning,
});

export const updateAbsenceWarningFail = error => ({
  type: UPDATE_ABSENCE_WARNING_FAIL,
  payload: error,
});

export const deleteAbsenceWarning = absenceWarning => ({
  type: DELETE_ABSENCE_WARNING,
  payload: absenceWarning,
});

export const deleteAbsenceWarningSuccess = absenceWarning => ({
  type: DELETE_ABSENCE_WARNING_SUCCESS,
  payload: absenceWarning,
});

export const deleteAbsenceWarningFail = error => ({
  type: DELETE_ABSENCE_WARNING_FAIL,
  payload: error,
});

// export const getDecisionReason = () => ({
//   type: GET_DECISION_REASONS,
// });

// export const getDecisionReasonSuccess = decisionReason => ({
//   type: GET_DECISION_REASONS_SUCCESS,
//   payload: decisionReason,
// });

// export const getDecisionReasonFail = error => ({
//   type: GET_DECISION_REASONS_FAIL,
//   payload: error,
// });
