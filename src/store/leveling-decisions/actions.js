import {
  GET_LEVELING_DECISIONS,
  GET_LEVELING_DECISIONS_SUCCESS,
  GET_LEVELING_DECISIONS_FAIL,
  ADD_NEW_LEVELING_DECISION,
  ADD_LEVELING_DECISION_SUCCESS,
  ADD_LEVELING_DECISION_FAIL,
  UPDATE_LEVELING_DECISION,
  UPDATE_LEVELING_DECISION_SUCCESS,
  UPDATE_LEVELING_DECISION_FAIL,
  DELETE_LEVELING_DECISION,
  DELETE_LEVELING_DECISION_SUCCESS,
  DELETE_LEVELING_DECISION_FAIL,
  GET_LEVELING_DECISION_DETAILS,
  GET_LEVELING_DECISION_DETAILS_SUCCESS,
  GET_LEVELING_DECISION_DETAILS_FAIL,
  ADD_NEW_LEVELING_DECISION_DETAIL,
  ADD_LEVELING_DECISION_DETAIL_SUCCESS,
  ADD_LEVELING_DECISION_DETAIL_FAIL,
  UPDATE_LEVELING_DECISION_DETAIL,
  UPDATE_LEVELING_DECISION_DETAIL_SUCCESS,
  UPDATE_LEVELING_DECISION_DETAIL_FAIL,
  DELETE_LEVELING_DECISION_DETAIL,
  DELETE_LEVELING_DECISION_DETAIL_SUCCESS,
  DELETE_LEVELING_DECISION_DETAIL_FAIL,
  COPY_FACULTY,
  COPY_FACULTY_SUCCESS,
  COPY_FACULTY_FAIL,
  GET_LEVELING_DECISION_DELETED_VALUE,
  GET_LEVELING_DECISION_DELETED_VALUE_FAIL,
  GET_LEVELING_DECISION_DELETED_VALUE_SUCCESS,
  GET_LEVELING_DECISION_DETAILS_DELETED_VALUE,
GET_LEVELING_DECISION_DETAILS_DELETED_VALUE_SUCCESS,
GET_LEVELING_DECISION_DETAILS_DELETED_VALUE_FAIL,
} from "./actionTypes";

export const getLevelingDecisions = () => ({
  type: GET_LEVELING_DECISIONS,
});

export const getLevelingDecisionsSuccess = levelingDecisions => ({
  type: GET_LEVELING_DECISIONS_SUCCESS,
  payload: levelingDecisions,
});

export const getLevelingDecisionsFail = error => ({
  type: GET_LEVELING_DECISIONS_FAIL,
  payload: error,
});

export const addNewLevelingDecision = levelingDecision => ({
  type: ADD_NEW_LEVELING_DECISION,
  payload: levelingDecision,
});

export const addLevelingDecisionSuccess = levelingDecision => ({
  type: ADD_LEVELING_DECISION_SUCCESS,
  payload: levelingDecision,
});

export const addLevelingDecisionFail = error => ({
  type: ADD_LEVELING_DECISION_FAIL,
  payload: error,
});

export const updateLevelingDecision = levelingDecision => ({
  type: UPDATE_LEVELING_DECISION,
  payload: levelingDecision,
});

export const updateLevelingDecisionSuccess = levelingDecision => ({
  type: UPDATE_LEVELING_DECISION_SUCCESS,
  payload: levelingDecision,
});

export const updateLevelingDecisionFail = error => ({
  type: UPDATE_LEVELING_DECISION_FAIL,
  payload: error,
});

export const deleteLevelingDecision = levelingDecision => ({
  type: DELETE_LEVELING_DECISION,
  payload: levelingDecision,
});

export const deleteLevelingDecisionSuccess = levelingDecision => ({
  type: DELETE_LEVELING_DECISION_SUCCESS,
  payload: levelingDecision,
});

export const deleteLevelingDecisionFail = error => ({
  type: DELETE_LEVELING_DECISION_FAIL,
  payload: error,
});
//levelingDecisionDetails
export const getLevelingDecisionDetails = (decisionId, facultyId) => ({
  type: GET_LEVELING_DECISION_DETAILS,
  payload: {
    decisionId,
    facultyId,
  },
});

export const getLevelingDecisionDetailsSuccess = levelingDecisionDetails => ({
  type: GET_LEVELING_DECISION_DETAILS_SUCCESS,
  payload: levelingDecisionDetails,
});

export const getLevelingDecisionDetailsFail = error => ({
  type: GET_LEVELING_DECISION_DETAILS_FAIL,
  payload: error,
});

export const addNewLevelingDecisionDetail = levelingDecisionDetail => ({
  type: ADD_NEW_LEVELING_DECISION_DETAIL,
  payload: levelingDecisionDetail,
});

export const addLevelingDecisionDetailSuccess = levelingDecisionDetail => ({
  type: ADD_LEVELING_DECISION_DETAIL_SUCCESS,
  payload: levelingDecisionDetail,
});

export const addLevelingDecisionDetailFail = error => ({
  type: ADD_LEVELING_DECISION_DETAIL_FAIL,
  payload: error,
});

export const updateLevelingDecisionDetail = levelingDecisionDetail => ({
  type: UPDATE_LEVELING_DECISION_DETAIL,
  payload: levelingDecisionDetail,
});

export const updateLevelingDecisionDetailSuccess = levelingDecisionDetail => ({
  type: UPDATE_LEVELING_DECISION_DETAIL_SUCCESS,
  payload: levelingDecisionDetail,
});

export const updateLevelingDecisionDetailFail = error => ({
  type: UPDATE_LEVELING_DECISION_DETAIL_FAIL,
  payload: error,
});

export const deleteLevelingDecisionDetail = levelingDecisionDetail => ({
  type: DELETE_LEVELING_DECISION_DETAIL,
  payload: levelingDecisionDetail,
});

export const deleteLevelingDecisionDetailSuccess = levelingDecisionDetail => ({
  type: DELETE_LEVELING_DECISION_DETAIL_SUCCESS,
  payload: levelingDecisionDetail,
});

export const deleteLevelingDecisionDetailFail = error => ({
  type: DELETE_LEVELING_DECISION_DETAIL_FAIL,
  payload: error,
});

/* COPY_FACULTY */
export const copyFaculty = copyFaculty => ({
  type: COPY_FACULTY,
  payload: copyFaculty,
});

export const copyFacultySuccess = copyFaculty => ({
  type: COPY_FACULTY_SUCCESS,
  payload: copyFaculty,
});

export const copyFacultyFail = error => ({
  type: COPY_FACULTY_FAIL,
  payload: error,
});

export const getLevelingDecisionDeletedValue = () => ({
  type: GET_LEVELING_DECISION_DELETED_VALUE,
});

export const getLevelingDecisionDeletedValueSuccess = deleted => ({
  type: GET_LEVELING_DECISION_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getLevelingDecisionDeletedValueFail = error => ({
  type: GET_LEVELING_DECISION_DELETED_VALUE_FAIL,
  payload: error,
});

export const getLevelingDecisionDetailsDeletedValue = () => ({
  type: GET_LEVELING_DECISION_DETAILS_DELETED_VALUE,
});

export const getLevelingDecisionDetailsDeletedValueSuccess = deletedDetail => ({
  type: GET_LEVELING_DECISION_DETAILS_DELETED_VALUE_SUCCESS,
  payload: deletedDetail,
});

export const getLevelingDecisionDetailsDeletedValueFail = error => ({
  type: GET_LEVELING_DECISION_DETAILS_DELETED_VALUE_FAIL,
  payload: error,
});