import {
  GET_ACADEMY_ORG_STRUCTURE_SUCCESS,
  GET_ACADEMY_ORG_STRUCTURE_FAIL,
  ADD_ACADEMY_ORG_STRUCTURE_SUCCESS,
  ADD_ACADEMY_ORG_STRUCTURE_FAIL,
  UPDATE_ACADEMY_ORG_STRUCTURE_SUCCESS,
  UPDATE_ACADEMY_ORG_STRUCTURE_FAIL,
  DELETE_ACADEMY_ORG_STRUCTURE_SUCCESS,
  DELETE_ACADEMY_ORG_STRUCTURE_FAIL,
  GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE_SUCCESS,
  GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  academyOrgStructures: [],
  deleted: {},
  error: {},
};

const academyOrgStructures = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACADEMY_ORG_STRUCTURE_SUCCESS:
      return {
        ...state,
        academyOrgStructures: action.payload,
      };
    case GET_ACADEMY_ORG_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ACADEMY_ORG_STRUCTURE_SUCCESS:
      return {
        ...state,
        academyOrgStructures: [...state.academyOrgStructures, action.payload],
      };
    case ADD_ACADEMY_ORG_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ACADEMY_ORG_STRUCTURE_SUCCESS:
      return {
        ...state,
        academyOrgStructures: state.academyOrgStructures.filter(
          academyOrgStructure =>
            academyOrgStructure.Id.toString() !== action.payload.Id.toString()
        ),
      };
    case UPDATE_ACADEMY_ORG_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ACADEMY_ORG_STRUCTURE_SUCCESS:
      return {
        ...state,
        academyOrgStructures: state.academyOrgStructures.filter(
          academyOrgStructure =>
            academyOrgStructure.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };
    case DELETE_ACADEMY_ORG_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default academyOrgStructures;
