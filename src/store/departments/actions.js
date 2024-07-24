import {
  GET_DEPARTMENTS,
  GET_DEPARTMENTS_FAIL,
  GET_DEPARTMENTS_SUCCESS,
  GET_FILTERED_DEPARTMENTS,
  GET_FILTERED_DEPARTMENTS_FAIL,
  GET_FILTERED_DEPARTMENTS_SUCCESS,
  ADD_NEW_DEPARTMENT,
  ADD_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_FAIL,
  UPDATE_DEPARTMENT,
  UPDATE_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT_FAIL,
  DELETE_DEPARTMENT,
  DELETE_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT_FAIL,
} from "./actionTypes";

export const getDepartments = () => ({
  type: GET_DEPARTMENTS,
});

export const getDepartmentsSuccess = departments => ({
  type: GET_DEPARTMENTS_SUCCESS,
  payload: departments,
});

export const getDepartmentsFail = error => ({
  type: GET_DEPARTMENTS_FAIL,
  payload: error,
});

export const getFilteredDepartments = filteredDepartments => ({
  type: GET_FILTERED_DEPARTMENTS,
  payload: filteredDepartments,
});

export const getFilteredDepartmentsSuccess = filteredDepartments => ({
  type: GET_FILTERED_DEPARTMENTS_SUCCESS,
  payload: filteredDepartments,
});

export const getFilteredDepartmentsFail = error => ({
  type: GET_FILTERED_DEPARTMENTS_FAIL,
  payload: error,
});

export const addNewDepartment = department => ({
  type: ADD_NEW_DEPARTMENT,
  payload: department,
});

export const addDepartmentSuccess = department => ({
  type: ADD_DEPARTMENT_SUCCESS,
  payload: department,
});

export const addDepartmentFail = error => ({
  type: ADD_DEPARTMENT_FAIL,
  payload: error,
});

export const updateDepartment = department => {
  return {
    type: UPDATE_DEPARTMENT,
    payload: department,
  };
};

export const updateDepartmentSuccess = department => ({
  type: UPDATE_DEPARTMENT_SUCCESS,
  payload: department,
});

export const updateDepartmentFail = error => ({
  type: UPDATE_DEPARTMENT_FAIL,
  payload: error,
});

export const deleteDepartment = department => ({
  type: DELETE_DEPARTMENT,
  payload: department,
});

export const deleteDepartmentSuccess = department => ({
  type: DELETE_DEPARTMENT_SUCCESS,
  payload: department,
});

export const deleteDepartmentFail = error => ({
  type: DELETE_DEPARTMENT_FAIL,
  payload: error,
});
