import {
  GET_STUDENTMANAGEMENT_PROFILE,
  GET_STUDENTMANAGEMENT_PROFILE_FAIL,
  GET_STUDENTMANAGEMENT_PROFILE_SUCCESS,
  GET_STUDENTMANAGEMENTS,
  GET_STUDENTMANAGEMENTS_FAIL,
  GET_STUDENTMANAGEMENTS_SUCCESS,
  ADD_NEW_STUDENTMANAGEMENT,
  ADD_STUDENTMANAGEMENT_SUCCESS,
  ADD_STUDENTMANAGEMENT_FAIL,
  UPDATE_STUDENTMANAGEMENT,
  UPDATE_STUDENTMANAGEMENT_SUCCESS,
  UPDATE_STUDENTMANAGEMENT_FAIL,
  DELETE_STUDENTMANAGEMENT,
  DELETE_STUDENTMANAGEMENT_SUCCESS,
  DELETE_STUDENTMANAGEMENT_FAIL,
} from "./actionTypes";
import { GET_SETTING } from "../mob-app-faculty-accs/actionTypes";
export const getStudentManagements = faculty => ({
  type: GET_STUDENTMANAGEMENTS,
  payload: faculty,
});

export const getStudentManagementsSuccess = StudentManagements => ({
  type: GET_STUDENTMANAGEMENTS_SUCCESS,
  payload: StudentManagements,
});

export const getStudentManagementsFail = error => ({
  type: GET_STUDENTMANAGEMENTS_FAIL,
  payload: error,
});

export const getStudentManagementProfile = () => ({
  type: GET_STUDENTMANAGEMENT_PROFILE,
});

export const getStudentManagementProfileSuccess = StudentManagementProfile => ({
  type: GET_STUDENTMANAGEMENT_PROFILE_SUCCESS,
  payload: StudentManagementProfile,
});

export const getStudentManagementProfileFail = error => ({
  type: GET_STUDENTMANAGEMENT_PROFILE_FAIL,
  payload: error,
});

export const addNewStudentManagement = StudentManagement => ({
  type: ADD_NEW_STUDENTMANAGEMENT,
  payload: StudentManagement,
});

export const addStudentManagementSuccess = StudentManagement => ({
  type: ADD_STUDENTMANAGEMENT_SUCCESS,
  payload: StudentManagement,
});

export const addStudentManagementFail = error => ({
  type: ADD_STUDENTMANAGEMENT_FAIL,
  payload: error,
});

export const updateStudentManagement = StudentManagement => {
  return {
    type: UPDATE_STUDENTMANAGEMENT,
    payload: StudentManagement,
  };
};

export const updateStudentManagementSuccess = StudentManagement => ({
  type: UPDATE_STUDENTMANAGEMENT_SUCCESS,
  payload: StudentManagement,
});

export const updateStudentManagementFail = error => ({
  type: UPDATE_STUDENTMANAGEMENT_FAIL,
  payload: error,
});

export const deleteStudentManagement = StudentManagement => ({
  type: DELETE_STUDENTMANAGEMENT,
  payload: StudentManagement,
});

export const deleteStudentManagementSuccess = StudentManagement => ({
  type: DELETE_STUDENTMANAGEMENT_SUCCESS,
  payload: StudentManagement,
});

export const deleteStudentManagementFail = error => ({
  type: DELETE_STUDENTMANAGEMENT_FAIL,
  payload: error,
});

export const fetchStudentSetting = () => ({
  type: GET_SETTING,
});
