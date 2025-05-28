import {
  GET_EMPLOYMENT_CASE_DELETED_VALUE,
  GET_EMPLOYMENT_CASE_DELETED_VALUE_FAIL,
  GET_EMPLOYMENT_CASE_DELETED_VALUE_SUCCESS,
  GET_EMPLOYMENT_CASES,
  GET_EMPLOYMENT_CASES_FAIL,
  GET_EMPLOYMENT_CASES_SUCCESS,
  ADD_NEW_EMPLOYMENT_CASE,
  ADD_EMPLOYMENT_CASE_SUCCESS,
  ADD_EMPLOYMENT_CASE_FAIL,
  UPDATE_EMPLOYMENT_CASE,
  UPDATE_EMPLOYMENT_CASE_SUCCESS,
  UPDATE_EMPLOYMENT_CASE_FAIL,
  DELETE_EMPLOYMENT_CASE,
  DELETE_EMPLOYMENT_CASE_SUCCESS,
  DELETE_EMPLOYMENT_CASE_FAIL,
} from "./actionTypes";

export const getEmploymentCases = () => ({
  type: GET_EMPLOYMENT_CASES,
});

export const getEmploymentCasesSuccess = employmentCases => ({
  type: GET_EMPLOYMENT_CASES_SUCCESS,
  payload: employmentCases,
});

export const getEmploymentCasesFail = error => ({
  type: GET_EMPLOYMENT_CASES_FAIL,
  payload: error,
});

export const getEmploymentCaseDeletedValue = () => ({
  type: GET_EMPLOYMENT_CASE_DELETED_VALUE,
});

export const getEmploymentCaseDeletedValueSuccess = employmentCase => ({
  type: GET_EMPLOYMENT_CASE_DELETED_VALUE_SUCCESS,
  payload: employmentCase,
});

export const getEmploymentCaseDeletedValueFail = error => ({
  type: GET_EMPLOYMENT_CASE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewEmploymentCase = employmentCase => ({
  type: ADD_NEW_EMPLOYMENT_CASE,
  payload: employmentCase,
});

export const addEmploymentCaseSuccess = employmentCase => ({
  type: ADD_EMPLOYMENT_CASE_SUCCESS,
  payload: employmentCase,
});

export const addEmploymentCaseFail = error => ({
  type: ADD_EMPLOYMENT_CASE_FAIL,
  payload: error,
});

export const updateEmploymentCase = employmentCase => {
  return {
    type: UPDATE_EMPLOYMENT_CASE,
    payload: employmentCase,
  };
};

export const updateEmploymentCaseSuccess = employmentCase => ({
  type: UPDATE_EMPLOYMENT_CASE_SUCCESS,
  payload: employmentCase,
});

export const updateEmploymentCaseFail = error => ({
  type: UPDATE_EMPLOYMENT_CASE_FAIL,
  payload: error,
});

export const deleteEmploymentCase = employmentCase => ({
  type: DELETE_EMPLOYMENT_CASE,
  payload: employmentCase,
});

export const deleteEmploymentCaseSuccess = employmentCase => ({
  type: DELETE_EMPLOYMENT_CASE_SUCCESS,
  payload: employmentCase,
});

export const deleteEmploymentCaseFail = error => ({
  type: DELETE_EMPLOYMENT_CASE_FAIL,
  payload: error,
});
