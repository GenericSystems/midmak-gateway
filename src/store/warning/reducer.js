import {
  GET_WARNINGS_SUCCESS,
  GET_WARNINGS_FAIL,
  ADD_WARNING_SUCCESS,
  ADD_WARNING_FAIL,
  UPDATE_WARNING_SUCCESS,
  UPDATE_WARNING_FAIL,
  DELETE_WARNING_SUCCESS,
  DELETE_WARNING_FAIL,
  GET_WARNING_DELETED_VALUE_SUCCESS,
  GET_WARNING_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  warnings: [],
  deleted: {},
  error: {},
};

const warnings = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_WARNINGS_SUCCESS:
      return {
        ...state,
        warnings: action.payload,
      };
    case GET_WARNINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_WARNING_SUCCESS:
      return {
        ...state,
        warnings: [...state.warnings, action.payload],
      };

    case ADD_WARNING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_WARNING_SUCCESS:
      return {
        ...state,
        warnings: state.warnings.map(warning =>
          warning.Id.toString() === action.payload.Id.toString()
            ? { warning, ...action.payload }
            : warning
        ),
      };

    case UPDATE_WARNING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_WARNING_SUCCESS:
      return {
        ...state,
        warnings: state.warnings.filter(
          warning => warning.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_WARNING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_WARNING_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_WARNING_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default warnings;
