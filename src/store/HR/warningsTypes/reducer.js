import {
  GET_WARNINGS_TYPES_SUCCESS,
  GET_WARNINGS_TYPES_FAIL,
  ADD_WARNING_TYPE_SUCCESS,
  ADD_WARNING_TYPE_FAIL,
  UPDATE_WARNING_TYPE_SUCCESS,
  UPDATE_WARNING_TYPE_FAIL,
  DELETE_WARNING_TYPE_SUCCESS,
  DELETE_WARNING_TYPE_FAIL,
  GET_WARNING_TYPE_DELETED_VALUE_SUCCESS,
  GET_WARNING_TYPE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  warningsTypes: [],
  deleted: {},
  error: {},
};

const warningsTypes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_WARNINGS_TYPES_SUCCESS:
      return {
        ...state,
        warningsTypes: action.payload,
      };

    case GET_WARNINGS_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_WARNING_TYPE_SUCCESS:
      return {
        ...state,
        warningsTypes: [...state.warningsTypes, action.payload],
      };

    case ADD_WARNING_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_WARNING_TYPE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_WARNING_TYPE_SUCCESS:
      return {
        ...state,
        warningsTypes: state.warningsTypes.map(warningType =>
          warningType.Id.toString() === action.payload.Id.toString()
            ? { warningType, ...action.payload }
            : warningType
        ),
      };

    case UPDATE_WARNING_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_WARNING_TYPE_SUCCESS:
      return {
        ...state,
        warningsTypes: state.warningsTypes.filter(
          warningType =>
            warningType.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_WARNING_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_WARNING_TYPE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default warningsTypes;
