import {
  GET_DECISIONS_SUCCESS,
  GET_DECISIONS_FAIL,
  ADD_DECISION_SUCCESS,
  ADD_DECISION_FAIL,
  UPDATE_DECISION_SUCCESS,
  UPDATE_DECISION_FAIL,
  DELETE_DECISION_SUCCESS,
  DELETE_DECISION_FAIL,
  GET_DECISION_DELETED_VALUE_SUCCESS,
  GET_DECISION_DELETED_VALUE_FAIL,
  GET_DECISION_MAKERS_SUCCESS,
  GET_DECISION_MAKERS_FAIL,
  GET_DECISION_STATUS_SUCCESS,
  GET_DECISION_STATUS_FAIL,
} from "./actionTypes";
const INIT_STATE = {
  decisions: [],
  decisionMakers: [],
  deleted: {},
  decisionStatus: [],
  error: {},
};
const decisions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DECISIONS_SUCCESS:
      return {
        ...state,
        decisions: action.payload,
        deleted: {},
      };
    case GET_DECISIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_DECISION_SUCCESS:
      return {
        ...state,
        decisions: [...state.decisions, action.payload],
      };
    case ADD_DECISION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_DECISION_SUCCESS:
      return {
        ...state,
        decisions: state.decisions.map(decision =>
          decision.Id.toString() === action.payload.Id.toString()
            ? { decision, ...action.payload }
            : decision
        ),
      };
    case UPDATE_DECISION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_DECISION_SUCCESS:
      return {
        ...state,
        decisions: state.decisions.filter(
          decision => decision.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DECISION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECISION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_DECISION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECISION_MAKERS_SUCCESS:
      return {
        ...state,
        decisionMakers: action.payload,
      };
    case GET_DECISION_MAKERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECISION_STATUS_SUCCESS:
      return {
        ...state,
        decisionStatus: action.payload,
      };
    case GET_DECISION_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default decisions;
