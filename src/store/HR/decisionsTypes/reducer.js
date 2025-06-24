import {
  GET_DECISIONS_TYPES_SUCCESS,
  GET_DECISIONS_TYPES_FAIL,
  ADD_DECISION_TYPE_SUCCESS,
  ADD_DECISION_TYPE_FAIL,
  UPDATE_DECISION_TYPE_SUCCESS,
  UPDATE_DECISION_TYPE_FAIL,
  DELETE_DECISION_TYPE_SUCCESS,
  DELETE_DECISION_TYPE_FAIL,
  GET_DECISION_TYPE_DELETED_VALUE_SUCCESS,
  GET_DECISION_TYPE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  decisionsTypes: [],
  deleted: {},
  error: {},
};

const decisionsTypes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DECISIONS_TYPES_SUCCESS:
      return {
        ...state,
        decisionsTypes: action.payload,
      };

    case GET_DECISIONS_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DECISION_TYPE_SUCCESS:
      return {
        ...state,
        decisionsTypes: [...state.decisionsTypes, action.payload],
      };

    case ADD_DECISION_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECISION_TYPE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_DECISION_TYPE_SUCCESS:
      return {
        ...state,
        decisionsTypes: state.decisionsTypes.map(decisionType =>
          decisionType.Id.toString() === action.payload.Id.toString()
            ? { decisionType, ...action.payload }
            : decisionType
        ),
      };

    case UPDATE_DECISION_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DECISION_TYPE_SUCCESS:
      return {
        ...state,
        decisionsTypes: state.decisionsTypes.filter(
          decisionType =>
            decisionType.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DECISION_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECISION_TYPE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default decisionsTypes;
