import {
  GET_GRADES_VERSIONS_SUCCESS,
  GET_GRADES_VERSIONS_FAIL,
  ADD_GRADE_VERSION_SUCCESS,
  ADD_GRADE_VERSION_FAIL,
  UPDATE_GRADE_VERSION_SUCCESS,
  UPDATE_GRADE_VERSION_FAIL,
  DELETE_GRADE_VERSION_SUCCESS,
  DELETE_GRADE_VERSION_FAIL,
  GET_GRADE_VERSION_DELETED_VALUE_SUCCESS,
  GET_GRADE_VERSION_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  gradesVersions: [],
  deleted: {},
  error: {},
};

const gradesVersions = (state = INIT_STATE, action) => {
  switch (action.type) {
    
    case GET_GRADES_VERSIONS_SUCCESS:
      return {
        ...state,
        gradesVersions: action.payload,

      };
      

    case GET_GRADES_VERSIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_GRADE_VERSION_SUCCESS:
      return {
        ...state,
        gradesVersions: [...state.gradesVersions, action.payload],
      };

    case ADD_GRADE_VERSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GRADE_VERSION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_GRADE_VERSION_SUCCESS:
      return {
        ...state,
        gradesVersions: state.gradesVersions.map(gradeVersion =>
          gradeVersion.Id.toString() === action.payload.Id.toString()
            ? { gradeVersion, ...action.payload }
            : gradeVersion
        ),
      };

    case UPDATE_GRADE_VERSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_GRADE_VERSION_SUCCESS:
      return {
        ...state,
        gradesVersions: state.gradesVersions.filter(
          gradeVersion =>
            gradeVersion.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_GRADE_VERSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GRADE_VERSION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default gradesVersions;
