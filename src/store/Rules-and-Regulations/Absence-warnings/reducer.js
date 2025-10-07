import { getDecisionReason } from "./actions";
import {
  GET_ABSENCE_WARNINGS_SUCCESS,
  GET_ABSENCE_WARNINGS_FAIL,
  ADD_ABSENCE_WARNING_SUCCESS,
  ADD_ABSENCE_WARNING_FAIL,
  UPDATE_ABSENCE_WARNING_SUCCESS,
  UPDATE_ABSENCE_WARNING_FAIL,
  DELETE_ABSENCE_WARNING_SUCCESS,
  DELETE_ABSENCE_WARNING_FAIL,
  GET_ABSENCE_WARNING_DELETED_VALUE_SUCCESS,
  GET_ABSENCE_WARNING_DELETED_VALUE_FAIL,
  GET_DECISION_REASONS_FAIL,
  GET_DECISION_REASONS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  absenceWarnings: [],
  decisionReasons: [],
  deleted: {},
  error: {},
};

const absenceWarnings = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ABSENCE_WARNINGS_SUCCESS:
      return {
        ...state,
        absenceWarnings: action.payload,
      };

    case GET_ABSENCE_WARNINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ABSENCE_WARNING_SUCCESS:
      return {
        ...state,
        absenceWarnings: [...state.absenceWarnings, action.payload],
      };

    case ADD_ABSENCE_WARNING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ABSENCE_WARNING_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_ABSENCE_WARNING_SUCCESS:
      return {
        ...state,
        absenceWarnings: state.absenceWarnings.map(absenceWarning =>
          absenceWarning.Id.toString() === action.payload.Id.toString()
            ? { ...absenceWarning, ...action.payload }
            : absenceWarning
        ),
      };

    case UPDATE_ABSENCE_WARNING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ABSENCE_WARNING_SUCCESS:
      return {
        ...state,
        absenceWarnings: state.absenceWarnings.filter(
          absenceWarning =>
            absenceWarning.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_ABSENCE_WARNING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ABSENCE_WARNING_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECISION_REASONS_SUCCESS:
      return {
        ...state,
        decisionReasons: action.payload,
      };

    case GET_DECISION_REASONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default absenceWarnings;
