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
  GET_VERS_GRADE_DELETED_VALUE_FAIL,
  GET_VERS_GRADE_DELETED_VALUE_SUCCESS,
  GET_VERS_GRADES_FAIL,
  GET_VERS_GRADES_SUCCESS,
  ADD_VERS_GRADE_SUCCESS,
  ADD_VERS_GRADE_FAIL,
  UPDATE_VERS_GRADE_SUCCESS,
  UPDATE_VERS_GRADE_FAIL,
  DELETE_VERS_GRADE_SUCCESS,
  DELETE_VERS_GRADE_FAIL,
  GET_RANKS_SUCCESS,
  GET_RANKS_FAIL,
  GET_FINISH_STATUS_SUCCESS,
  GET_FINISH_STATUS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  gradesVersions: [],
  VersGrades: [],
  ranks: [],
  statuses: [],
  deleted: {},
  error: {},
  isLoading: false,
};

const gradesVersions = (state = INIT_STATE, action) => {
  switch (action.type) {
    
    case GET_GRADES_VERSIONS_SUCCESS:
      return { ...state, gradesVersions: action.payload };
    case GET_GRADES_VERSIONS_FAIL:
      return { ...state, error: action.payload };
    case ADD_GRADE_VERSION_SUCCESS:
      return { ...state, gradesVersions: [...state.gradesVersions, action.payload] };
    case ADD_GRADE_VERSION_FAIL:
      return { ...state, error: action.payload };
    case UPDATE_GRADE_VERSION_SUCCESS:
      return {
        ...state,
        gradesVersions: state.gradesVersions.map(gv =>
          gv.Id.toString() === action.payload.Id.toString() ? { ...gv, ...action.payload } : gv
        ),
      };
    case UPDATE_GRADE_VERSION_FAIL:
      return { ...state, error: action.payload };
    case DELETE_GRADE_VERSION_SUCCESS:
      return {
        ...state,
        gradesVersions: state.gradesVersions.filter(
          gv => gv.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };
    case DELETE_GRADE_VERSION_FAIL:
      return { ...state, error: action.payload };
    case GET_GRADE_VERSION_DELETED_VALUE_SUCCESS:
      return { ...state, deleted: action.payload };
    case GET_GRADE_VERSION_DELETED_VALUE_FAIL:
      return { ...state, error: action.payload };

    
    case GET_VERS_GRADES_SUCCESS:
      return { ...state, VersGrades: action.payload };
    case GET_VERS_GRADES_FAIL:
      return { ...state, error: action.payload };
    case ADD_VERS_GRADE_SUCCESS:
        console.log("Adding VersGrade to state:", action.payload);
      return { ...state, VersGrades: [...state.VersGrades, action.payload] };
    case ADD_VERS_GRADE_FAIL:
      return { ...state, error: action.payload };
    case UPDATE_VERS_GRADE_SUCCESS:
      return {
        ...state,
        VersGrades: state.VersGrades.map(vg =>
          vg.Id.toString() === action.payload.Id.toString() ? { ...vg, ...action.payload } : vg
        ),
      };
    case UPDATE_VERS_GRADE_FAIL:
      return { ...state, error: action.payload };
    case DELETE_VERS_GRADE_SUCCESS:
      return {
        ...state,
        VersGrades: state.VersGrades.filter(
          vg => vg.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };
    case DELETE_VERS_GRADE_FAIL:
      return { ...state, error: action.payload };
    case GET_VERS_GRADE_DELETED_VALUE_SUCCESS:
      return { ...state, deleted: action.payload };
    case GET_VERS_GRADE_DELETED_VALUE_FAIL:
      return { ...state, error: action.payload };

    case GET_RANKS_SUCCESS:
      return { ...state, ranks: action.payload };
    case GET_RANKS_FAIL:
      return { ...state, error: action.payload };

    
    case GET_FINISH_STATUS_SUCCESS:
      return { ...state, statuses: action.payload };
    case GET_FINISH_STATUS_FAIL:
      return { ...state, error: action.payload };

   
    default:
      return state;
  }
};

export default gradesVersions;
