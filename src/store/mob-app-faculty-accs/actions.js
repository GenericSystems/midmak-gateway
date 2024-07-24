import {
  GET_SETTING,
  GET_MOB_APP_FACULTY_ACCS,
  GET_MOB_APP_FACULTY_ACCS_FAIL,
  GET_MOB_APP_FACULTY_ACCS_SUCCESS,
  GET_MOB_APP_FACULTY_ACC_PROFILE,
  GET_MOB_APP_FACULTY_ACC_PROFILE_FAIL,
  GET_MOB_APP_FACULTY_ACC_PROFILE_SUCCESS,
  ADD_NEW_MOB_APP_FACULTY_ACC,
  ADD_MOB_APP_FACULTY_ACC_SUCCESS,
  ADD_MOB_APP_FACULTY_ACC_FAIL,
  UPDATE_MOB_APP_FACULTY_ACC,
  UPDATE_MOB_APP_FACULTY_ACC_SUCCESS,
  UPDATE_MOB_APP_FACULTY_ACC_FAIL,
  DELETE_MOB_APP_FACULTY_ACC,
  DELETE_MOB_APP_FACULTY_ACC_SUCCESS,
  DELETE_MOB_APP_FACULTY_ACC_FAIL,
  GET_FACULTIES,
  GET_FACULTIES_FAIL,
  GET_FACULTIES_SUCCESS,
  UPDATE_FACULTY,
  UPDATE_FACULTY_FAIL,
  UPDATE_FACULTY_SUCCESS
} from "./actionTypes";

export const getMobAppFacultyAccs = faculty => ({
  type: GET_MOB_APP_FACULTY_ACCS,
  payload: faculty,
});

export const getMobAppFacultyAccsSuccess = mobAppFacultyAccs => ({
  type: GET_MOB_APP_FACULTY_ACCS_SUCCESS,
  payload: mobAppFacultyAccs,
});

export const getMobAppFacultyAccsFail = error => ({
  type: GET_MOB_APP_FACULTY_ACCS_FAIL,
  payload: error,
});

export const getMobAppFacultyAccProfile = mobAppFacultyAccId => ({
  type: GET_MOB_APP_FACULTY_ACC_PROFILE,
  mobAppFacultyAccId,
});

export const getMobAppFacultyAccProfileSuccess = mobAppFacultyAccProfiles => ({
  type: GET_MOB_APP_FACULTY_ACC_PROFILE_SUCCESS,
  payload: mobAppFacultyAccProfiles,
});

export const getMobAppFacultyAccProfileFail = error => ({
  type: GET_MOB_APP_FACULTY_ACC_PROFILE_FAIL,
  payload: error,
});

export const addNewMobAppFacultyAcc = mobAppFacultyAcc => ({
  type: ADD_NEW_MOB_APP_FACULTY_ACC,
  payload: mobAppFacultyAcc,
});

export const addMobAppFacultyAccSuccess = mobAppFacultyAcc => ({
  type: ADD_MOB_APP_FACULTY_ACC_SUCCESS,
  payload: mobAppFacultyAcc,
});

export const addMobAppFacultyAccFail = error => ({
  type: ADD_MOB_APP_FACULTY_ACC_FAIL,
  payload: error,
});

export const updateMobAppFacultyAcc = mobAppFacultyAcc => ({
  type: UPDATE_MOB_APP_FACULTY_ACC,
  payload: mobAppFacultyAcc,
});

export const updateMobAppFacultyAccSuccess = mobAppFacultyAcc => ({
  type: UPDATE_MOB_APP_FACULTY_ACC_SUCCESS,
  payload: mobAppFacultyAcc,
});

export const updateMobAppFacultyAccFail = error => ({
  type: UPDATE_MOB_APP_FACULTY_ACC_FAIL,
  payload: error,
});

export const deleteMobAppFacultyAcc = mobAppFacultyAcc => ({
  type: DELETE_MOB_APP_FACULTY_ACC,
  payload: mobAppFacultyAcc,
});

export const deleteMobAppFacultyAccSuccess = mobAppFacultyAcc => ({
  type: DELETE_MOB_APP_FACULTY_ACC_SUCCESS,
  payload: mobAppFacultyAcc,
});

export const deleteMobAppFacultyAccFail = error => ({
  type: DELETE_MOB_APP_FACULTY_ACC_FAIL,
  payload: error,
});

export const getFaculties = () => ({
  type: GET_FACULTIES,
});

export const getFacultiesSuccess = Faculties => ({
  type: GET_FACULTIES_SUCCESS,
  payload: Faculties,
});

export const getFacultiesFail = error => ({
  type: GET_FACULTIES_FAIL,
  payload: error,
});

export const updateFaculty = Faculty=> ({
  type: UPDATE_FACULTY,
  payload: Faculty,
});

export const updateFacultySuccess = Faculty => ({
  type: UPDATE_FACULTY_SUCCESS,
  payload: Faculty,
});

export const updateFacultyFail = error => ({
  type: UPDATE_FACULTY_FAIL,
  payload: error,
});

export const fetchSetting = () => ({
  type: GET_SETTING,
});
