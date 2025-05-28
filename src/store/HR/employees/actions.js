import {
  GET_EMPLOYEE_DELETED_VALUE,
  GET_EMPLOYEE_DELETED_VALUE_FAIL,
  GET_EMPLOYEE_DELETED_VALUE_SUCCESS,
  GET_EMPLOYEES,
  GET_EMPLOYEES_FAIL,
  GET_EMPLOYEES_SUCCESS,
  ADD_NEW_EMPLOYEE,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAIL,
  UPDATE_EMPLOYEE,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAIL,
  DELETE_EMPLOYEE,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAIL,
} from "./actionTypes";

export const getEmployees = () => ({
  type: GET_EMPLOYEES,
});

export const getEmployeesSuccess = employees => ({
  type: GET_EMPLOYEES_SUCCESS,
  payload: employees,
});

export const getEmployeesFail = error => ({
  type: GET_EMPLOYEES_FAIL,
  payload: error,
});

export const getEmployeeDeletedValue = () => ({
  type: GET_EMPLOYEE_DELETED_VALUE,
});

export const getEmployeeDeletedValueSuccess = employee => ({
  type: GET_EMPLOYEE_DELETED_VALUE_SUCCESS,
  payload: employee,
});

export const getEmployeeDeletedValueFail = error => ({
  type: GET_EMPLOYEE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewEmployee = employee => ({
  type: ADD_NEW_EMPLOYEE,
  payload: employee,
});

export const addEmployeeSuccess = employee => ({
  type: ADD_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const addEmployeeFail = error => ({
  type: ADD_EMPLOYEE_FAIL,
  payload: error,
});

export const updateEmployee = employee => {
  return {
    type: UPDATE_EMPLOYEE,
    payload: employee,
  };
};

export const updateEmployeeSuccess = employee => ({
  type: UPDATE_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const updateEmployeeFail = error => ({
  type: UPDATE_EMPLOYEE_FAIL,
  payload: error,
});

export const deleteEmployee = employee => ({
  type: DELETE_EMPLOYEE,
  payload: employee,
});

export const deleteEmployeeSuccess = employee => ({
  type: DELETE_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const deleteEmployeeFail = error => ({
  type: DELETE_EMPLOYEE_FAIL,
  payload: error,
});
