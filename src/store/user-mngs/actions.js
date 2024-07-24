import {
  GET_USER_MNGS,
  GET_USER_MNGS_SUCCESS,
  GET_USER_MNGS_FAIL,
  ADD_NEW_USER_MNG,
  ADD_USER_MNG_SUCCESS,
  ADD_USER_MNG_FAIL,
  UPDATE_USER_MNG,
  UPDATE_USER_MNG_SUCCESS,
  UPDATE_USER_MNG_FAIL,
  DELETE_USER_MNG,
  DELETE_USER_MNG_SUCCESS,
  DELETE_USER_MNG_FAIL,
  GET_USER_MNG_DELETED_VALUE,
  GET_USER_MNG_DELETED_VALUE_FAIL,
  GET_USER_MNG_DELETED_VALUE_SUCCESS,
  GET_USER_FACULTIES,
  GET_USER_FACULTIES_SUCCESS,
  GET_USER_FACULTIES_FAIL,
  ADD_NEW_USER_FACULTY,
  ADD_USER_FACULTY_SUCCESS,
  ADD_USER_FACULTY_FAIL,
  DELETE_USER_FACULTY,
  DELETE_USER_FACULTY_SUCCESS,
  DELETE_USER_FACULTY_FAIL,
  GET_USER_FACULTY_DELETED_VALUE,
  GET_USER_FACULTY_DELETED_VALUE_SUCCESS,
  GET_USER_FACULTY_DELETED_VALUE_FAIL,
  ADD_NEW_USER_ROLE,
  ADD_USER_ROLE_SUCCESS,
  ADD_USER_ROLE_FAIL,
} from "./actionTypes";
export const getUserMngs = () => ({
  type: GET_USER_MNGS,
});

export const getUserMngsSuccess = genders => ({
  type: GET_USER_MNGS_SUCCESS,
  payload: genders,
});

export const getUserMngsFail = error => ({
  type: GET_USER_MNGS_FAIL,
  payload: error,
});
export const addNewUserMng = gender => ({
  type: ADD_NEW_USER_MNG,
  payload: gender,
});
export const addUserMngSuccess = gender => ({
  type: ADD_USER_MNG_SUCCESS,
  payload: gender,
});

export const addUserMngFail = error => ({
  type: ADD_USER_MNG_FAIL,
  payload: error,
});
export const updateUserMng = gender => {
  return {
    type: UPDATE_USER_MNG,
    payload: gender,
  };
};

export const updateUserMngSuccess = gender => ({
  type: UPDATE_USER_MNG_SUCCESS,
  payload: gender,
});

export const updateUserMngFail = error => ({
  type: UPDATE_USER_MNG_FAIL,
  payload: error,
});
export const deleteUserMng = gender => ({
  type: DELETE_USER_MNG,
  payload: gender,
});
export const deleteUserMngSuccess = gender => ({
  type: DELETE_USER_MNG_SUCCESS,
  payload: gender,
});
export const deleteUserMngFail = error => ({
  type: DELETE_USER_MNG_FAIL,
  payload: error,
});

export const getUserMngDeletedValue = () => ({
  type: GET_USER_MNG_DELETED_VALUE,
});

export const getUserMngDeletedValueSuccess = deleted => ({
  type: GET_USER_MNG_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getUserMngDeletedValueFail = error => ({
  type: GET_USER_MNG_DELETED_VALUE_FAIL,
  payload: error,
});




export const getUserFaculties = userId => ({
  type: GET_USER_FACULTIES,
  payload:userId,
});

export const getUserFacultiesSuccess = genders => ({
  type: GET_USER_FACULTIES_SUCCESS,
  payload: genders,
});

export const getUserFacultiesFail = error => ({
  type: GET_USER_FACULTIES_FAIL,
  payload: error,
});
export const addNewUserFaculty = gender => ({
  type: ADD_NEW_USER_FACULTY,
  payload: gender,
});
export const addUserFacultySuccess = gender => ({
  type: ADD_USER_FACULTY_SUCCESS,
  payload: gender,
});

export const addUserFacultyFail = error => ({
  type: ADD_USER_FACULTY_FAIL,
  payload: error,
});
export const deleteUserFaculty = userFaculty => ({
  type: DELETE_USER_FACULTY,
  payload: userFaculty,
});
export const deleteUserFacultySuccess = gender => ({
  type: DELETE_USER_FACULTY_SUCCESS,
  payload: gender,
});
export const deleteUserFacultyFail = error => ({
  type: DELETE_USER_FACULTY_FAIL,
  payload: error,
});

export const getUserFacultyDeletedValue = () => ({
  type: GET_USER_FACULTY_DELETED_VALUE,
});

export const getUserFacultyDeletedValueSuccess = deleted => ({
  type: GET_USER_FACULTY_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getUserFacultyDeletedValueFail = error => ({
  type: GET_USER_FACULTY_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewUserRole = role => ({
  type: ADD_NEW_USER_ROLE,
  payload: role,
});
export const addUserRoleSuccess = role => ({
  type: ADD_USER_ROLE_SUCCESS,
  payload: role,
});

export const addUserRoleFail = error => ({
  type: ADD_USER_ROLE_FAIL,
  payload: error,
});
