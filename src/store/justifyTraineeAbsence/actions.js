import {
  GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE,
  GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE_FAIL,
  GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE_SUCCESS,
  GET_JUSTIFY_TRAINEES_ABSENCE,
  GET_JUSTIFY_TRAINEES_ABSENCE_FAIL,
  GET_JUSTIFY_TRAINEES_ABSENCE_SUCCESS,
  ADD_NEW_JUSTIFY_TRAINEE_ABSENCE,
  ADD_JUSTIFY_TRAINEE_ABSENCE_SUCCESS,
  ADD_JUSTIFY_TRAINEE_ABSENCE_FAIL,
  UPDATE_JUSTIFY_TRAINEE_ABSENCE,
  UPDATE_JUSTIFY_TRAINEE_ABSENCE_SUCCESS,
  UPDATE_JUSTIFY_TRAINEE_ABSENCE_FAIL,
  DELETE_JUSTIFY_TRAINEE_ABSENCE,
  DELETE_JUSTIFY_TRAINEE_ABSENCE_SUCCESS,
  DELETE_JUSTIFY_TRAINEE_ABSENCE_FAIL,
} from "./actionTypes";

export const getJustifyTraineesAbsence = () => ({
  type: GET_JUSTIFY_TRAINEES_ABSENCE,
});

export const getJustifyTraineesAbsenceSuccess = justifyTraineesAbsence => ({
  type: GET_JUSTIFY_TRAINEES_ABSENCE_SUCCESS,
  payload: justifyTraineesAbsence,
});

export const getJustifyTraineesAbsenceFail = error => ({
  type: GET_JUSTIFY_TRAINEES_ABSENCE_FAIL,
  payload: error,
});

export const getJustifyTraineeAbsenceDeletedValue = () => ({
  type: GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE,
});

export const getJustifyTraineeAbsenceDeletedValueSuccess =
  JustifyTraineeAbsence => ({
    type: GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE_SUCCESS,
    payload: JustifyTraineeAbsence,
  });

export const getJustifyTraineeAbsenceDeletedValueFail = error => ({
  type: GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewJustifyTraineeAbsence = JustifyTraineeAbsence => ({
  type: ADD_NEW_JUSTIFY_TRAINEE_ABSENCE,
  payload: JustifyTraineeAbsence,
});

export const addJustifyTraineeAbsenceSuccess = JustifyTraineeAbsence => ({
  type: ADD_JUSTIFY_TRAINEE_ABSENCE_SUCCESS,
  payload: JustifyTraineeAbsence,
});

export const addJustifyTraineeAbsenceFail = error => ({
  type: ADD_JUSTIFY_TRAINEE_ABSENCE_FAIL,
  payload: error,
});

export const updateJustifyTraineeAbsence = JustifyTraineeAbsence => {
  return {
    type: UPDATE_JUSTIFY_TRAINEE_ABSENCE,
    payload: JustifyTraineeAbsence,
  };
};

export const updateJustifyTraineeAbsenceSuccess = JustifyTraineeAbsence => ({
  type: UPDATE_JUSTIFY_TRAINEE_ABSENCE_SUCCESS,
  payload: JustifyTraineeAbsence,
});

export const updateJustifyTraineeAbsenceFail = error => ({
  type: UPDATE_JUSTIFY_TRAINEE_ABSENCE_FAIL,
  payload: error,
});

export const deleteJustifyTraineeAbsence = JustifyTraineeAbsence => ({
  type: DELETE_JUSTIFY_TRAINEE_ABSENCE,
  payload: JustifyTraineeAbsence,
});

export const deleteJustifyTraineeAbsenceSuccess = JustifyTraineeAbsence => ({
  type: DELETE_JUSTIFY_TRAINEE_ABSENCE_SUCCESS,
  payload: JustifyTraineeAbsence,
});

export const deleteJustifyTraineeAbsenceFail = error => ({
  type: DELETE_JUSTIFY_TRAINEE_ABSENCE_FAIL,
  payload: error,
});
