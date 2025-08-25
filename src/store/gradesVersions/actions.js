import {
  GET_GRADE_VERSION_DELETED_VALUE,
  GET_GRADE_VERSION_DELETED_VALUE_FAIL,
  GET_GRADE_VERSION_DELETED_VALUE_SUCCESS,
  GET_GRADES_VERSIONS,
  GET_GRADES_VERSIONS_FAIL,
  GET_GRADES_VERSIONS_SUCCESS,
  ADD_NEW_GRADE_VERSION,
  ADD_GRADE_VERSION_SUCCESS,
  ADD_GRADE_VERSION_FAIL,
  UPDATE_GRADE_VERSION,
  UPDATE_GRADE_VERSION_SUCCESS,
  UPDATE_GRADE_VERSION_FAIL,
  DELETE_GRADE_VERSION,
  DELETE_GRADE_VERSION_SUCCESS,
  DELETE_GRADE_VERSION_FAIL,
  GET_VERS_GRADE_DELETED_VALUE,
  GET_VERS_GRADE_DELETED_VALUE_FAIL,
  GET_VERS_GRADE_DELETED_VALUE_SUCCESS,
  GET_VERS_GRADES,
  GET_VERS_GRADES_FAIL,
  GET_VERS_GRADES_SUCCESS,
  ADD_NEW_VERS_GRADE,
  ADD_VERS_GRADE_SUCCESS,
  ADD_VERS_GRADE_FAIL,
  UPDATE_VERS_GRADE,
  UPDATE_VERS_GRADE_SUCCESS,
  UPDATE_VERS_GRADE_FAIL,
  DELETE_VERS_GRADE,
  DELETE_VERS_GRADE_SUCCESS,
  DELETE_VERS_GRADE_FAIL,
  GET_RANKS_SUCCESS,
  GET_RANKS_FAIL,
  GET_FINISH_STATUS,
  GET_FINISH_STATUS_SUCCESS,
  GET_FINISH_STATUS_FAIL,
  GET_RANKS,
} from "./actionTypes";

export const getGradesVersions = () => ({
  type: GET_GRADES_VERSIONS,
});

export const getGradesVersionsSuccess = gradesVersions => ({
  type: GET_GRADES_VERSIONS_SUCCESS,
  payload: gradesVersions,
});

export const getGradesVersionsFail = error => ({
  type: GET_GRADES_VERSIONS_FAIL,
  payload: error,
});

export const getGradeVersionDeletedValue = () => ({
  type: GET_GRADE_VERSION_DELETED_VALUE,
});

export const getGradeVersionDeletedValueSuccess = gradeVersion => ({
  type: GET_GRADE_VERSION_DELETED_VALUE_SUCCESS,
  payload: gradeVersion,
});

export const getGradeVersionDeletedValueFail = error => ({
  type: GET_GRADE_VERSION_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewGradeVersion = gradeVersion => ({
  type: ADD_NEW_GRADE_VERSION,
  payload: gradeVersion,
});

export const addGradeVersionSuccess = gradeVersion => ({
  type: ADD_GRADE_VERSION_SUCCESS,
  payload: gradeVersion,
});

export const addGradeVersionFail = error => ({
  type: ADD_GRADE_VERSION_FAIL,
  payload: error,
});

export const updateGradeVersion = gradeVersion => {
  return {
    type: UPDATE_GRADE_VERSION,
    payload: gradeVersion,
  };
};

export const updateGradeVersionSuccess = gradeVersion => ({
  type: UPDATE_GRADE_VERSION_SUCCESS,
  payload: gradeVersion,
});

export const updateGradeVersionFail = error => ({
  type: UPDATE_GRADE_VERSION_FAIL,
  payload: error,
});

export const deleteGradeVersion = gradeVersion => ({
  type: DELETE_GRADE_VERSION,
  payload: gradeVersion,
});

export const deleteGradeVersionSuccess = gradeVersion => ({
  type: DELETE_GRADE_VERSION_SUCCESS,
  payload: gradeVersion,
});

export const deleteGradeVersionFail = error => ({
  type: DELETE_GRADE_VERSION_FAIL,
  payload: error,
});

//VERSION GRADES

export const getVersGrades = VersGrades => ({
  type: GET_VERS_GRADES,
  payload: VersGrades,
});

export const getVersGradesSuccess = VersGrades => ({
  type: GET_VERS_GRADES_SUCCESS,
  payload: VersGrades,
});

export const getVersGradesFail = error => ({
  type: GET_VERS_GRADES_FAIL,
  payload: error,
});

export const getVersGradeDeletedValue = () => ({
  type: GET_VERS_GRADE_DELETED_VALUE,
});

export const getVersGradeDeletedValueSuccess = VersGradeProfile => ({
  type: GET_VERS_GRADE_DELETED_VALUE_SUCCESS,
  payload: VersGradeProfile,
});

export const getVersGradeDeletedValueFail = error => ({
  type: GET_VERS_GRADE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewVersGrade = VersGrade => ({
  type: ADD_NEW_VERS_GRADE,
  payload: VersGrade,
});

export const addVersGradeSuccess = VersGrade => ({
  type: ADD_VERS_GRADE_SUCCESS,
  payload: VersGrade,
});

export const addVersGradeFail = error => ({
  type: ADD_VERS_GRADE_FAIL,
  payload: error,
});

export const updateVersGrade = VersGrade => {
  return {
    type: UPDATE_VERS_GRADE,
    payload: VersGrade,
  };
};

export const updateVersGradeSuccess = VersGrade => ({
  type: UPDATE_VERS_GRADE_SUCCESS,
  payload: VersGrade,
});

export const updateVersGradeFail = error => ({
  type: UPDATE_VERS_GRADE_FAIL,
  payload: error,
});

export const deleteVersGrade = VersGrade => ({
  type: DELETE_VERS_GRADE,
  payload: VersGrade,
});

export const deleteVersGradeSuccess = VersGrade => ({
  type: DELETE_VERS_GRADE_SUCCESS,
  payload: VersGrade,
});

export const deleteVersGradeFail = error => ({
  type: DELETE_VERS_GRADE_FAIL,
  payload: error,
});
export const getRanks = () => ({
  type: GET_RANKS,
});

export const getRanksSuccess = ranks => ({
  type: GET_RANKS_SUCCESS,
  payload: ranks,
});

export const getRanksFail = error => ({
  type: GET_RANKS_FAIL,
  payload: error,
});
export const getFinishStatuses = () => ({
  type: GET_FINISH_STATUS,
});

export const getFinishStatusSuccess = statuses => ({
  type: GET_FINISH_STATUS_SUCCESS,
  payload: statuses,
});

export const getFinishStatusFail = error => ({
  type: GET_FINISH_STATUS_FAIL,
  payload: error,
});
