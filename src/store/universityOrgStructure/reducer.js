import {
  GET_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
  GET_UNIVERSITY_ORG_STRUCTURE_FAIL,
  ADD_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
  ADD_UNIVERSITY_ORG_STRUCTURE_FAIL,
  UPDATE_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
  UPDATE_UNIVERSITY_ORG_STRUCTURE_FAIL,
  DELETE_UNIVERSITY_ORG_STRUCTURE_SUCCESS,
  DELETE_UNIVERSITY_ORG_STRUCTURE_FAIL,
  GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE_SUCCESS,
  GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  universityOrgStructures: [],
  deleted: {},
  error: {},
};

const universityOrgStructures = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_UNIVERSITY_ORG_STRUCTURE_SUCCESS:
      return {
        ...state,
        universityOrgStructures: action.payload,
      };
    case GET_UNIVERSITY_ORG_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_UNIVERSITY_ORG_STRUCTURE_SUCCESS:
      return {
        ...state,

        universityOrgStructures: [...state.universityOrgStructures, action.payload],
      };
    case ADD_UNIVERSITY_ORG_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_UNIVERSITY_ORG_STRUCTURE_SUCCESS:
      return {
        ...state,
        universityOrgStructures: state.universityOrgStructures.filter(
          universityOrgStructure =>
          universityOrgStructure.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case UPDATE_UNIVERSITY_ORG_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_UNIVERSITY_ORG_STRUCTURE_SUCCESS:
      return {
        ...state,
        universityOrgStructures: state.universityOrgStructures.filter(
          universityOrgStructure =>
          universityOrgStructure.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted
      };

    case DELETE_UNIVERSITY_ORG_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload.deleted,
        }

        case GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE_FAIL:
          return {
              ...state,
              error: action.payload,
          }
  
    

    default:
      return state;
  }
};
export default universityOrgStructures;
