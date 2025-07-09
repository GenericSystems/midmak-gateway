import {
  GET_ACADEMY_BUILDING_STRUCTURES_SUCCESS,
  GET_ACADEMY_BUILDING_STRUCTURES_FAIL,
  GET_HALLS_SUCCESS,
  GET_HALLS_FAIL,
  GET_HALL_TYPES_SUCCESS,
  GET_HALL_TYPES_FAIL,
  ADD_ACADEMY_BUILDING_STRUCTURE_SUCCESS,
  ADD_ACADEMY_BUILDING_STRUCTURE_FAIL,
  UPDATE_ACADEMY_BUILDING_STRUCTURE_SUCCESS,
  UPDATE_ACADEMY_BUILDING_STRUCTURE_FAIL,
  DELETE_ACADEMY_BUILDING_STRUCTURE_SUCCESS,
  DELETE_ACADEMY_BUILDING_STRUCTURE_FAIL,
  GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE_SUCCESS,
  GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  academyBuildingStructures: [],
  halls: [],
  hallTypes: [],
  deleted: {},
  error: {},
};

const academyBuildingStructures = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACADEMY_BUILDING_STRUCTURES_SUCCESS:
      return {
        ...state,
        academyBuildingStructures: action.payload,
      };

    case GET_ACADEMY_BUILDING_STRUCTURES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_HALLS_SUCCESS:
      return {
        ...state,
        halls: action.payload,
      };

    case GET_HALLS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_HALL_TYPES_SUCCESS:
      return {
        ...state,
        hallTypes: action.payload,
      };

    case GET_HALL_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ACADEMY_BUILDING_STRUCTURE_SUCCESS:
      return {
        ...state,
        academyBuildingStructures: [
          ...state.academyBuildingStructures,
          action.payload,
        ],
      };

    case ADD_ACADEMY_BUILDING_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case UPDATE_ACADEMY_BUILDING_STRUCTURE_SUCCESS:
      return {
        ...state,
        academyBuildingStructures: state.academyBuildingStructures.map(
          academyBuildingStructure =>
            academyBuildingStructure.Id.toString() ===
            action.payload.Id.toString()
              ? { academyBuildingStructure, ...action.payload }
              : academyBuildingStructure
        ),
      };

    case UPDATE_ACADEMY_BUILDING_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ACADEMY_BUILDING_STRUCTURE_SUCCESS:
      return {
        ...state,
        academyBuildingStructures: state.academyBuildingStructures.filter(
          academyBuildingStructure =>
            academyBuildingStructure.Id.toString() !==
            action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_ACADEMY_BUILDING_STRUCTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default academyBuildingStructures;
