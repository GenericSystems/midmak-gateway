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
  GET_DECISION_CATEGORIES_FAIL,
  GET_DECISIONS_RULES_REASONS_SUCCESS,
  GET_DECISIONS_RULES_REASONS_FAIL,
  ADD_DECISIONS_RULES_REASON_SUCCESS,
  ADD_DECISIONS_RULES_REASON_FAIL,
  UPDATE_DECISIONS_RULES_REASON_SUCCESS,
  UPDATE_DECISIONS_RULES_REASON_FAIL,
  DELETE_DECISIONS_RULES_REASON_SUCCESS,
  DELETE_DECISIONS_RULES_REASON_FAIL,
  GET_DECISIONS_RULES_REASON_DELETED_VALUE_SUCCESS,
  GET_DECISIONS_RULES_REASON_DELETED_VALUE_FAIL,
  GET_DECISIONS_RULES_CANCELED_REASONS_SUCCESS,
  GET_DECISIONS_RULES_CANCELED_REASONS_FAIL,
  ADD_DECISIONS_RULES_CANCELED_REASON_SUCCESS,
  ADD_DECISIONS_RULES_CANCELED_REASON_FAIL,
  UPDATE_DECISIONS_RULES_CANCELED_REASON_SUCCESS,
  UPDATE_DECISIONS_RULES_CANCELED_REASON_FAIL,
  DELETE_DECISIONS_RULES_CANCELED_REASON_SUCCESS,
  DELETE_DECISIONS_RULES_CANCELED_REASON_FAIL,
  GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE_SUCCESS,
  GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE_FAIL,
  GET_DECISION_CATEGORIES_SUCCESS,
  GET_DECISIONS_RULES_ROLES_SUCCESS,
  GET_DECISIONS_RULES_ROLES_FAIL,
  ADD_DECISIONS_RULES_ROLES_SUCCESS,
  ADD_DECISIONS_RULES_ROLES_FAIL,
  UPDATE_DECISIONS_RULES_ROLES_SUCCESS,
  UPDATE_DECISIONS_RULES_ROLES_FAIL,
  DELETE_DECISIONS_RULES_ROLES_SUCCESS,
  DELETE_DECISIONS_RULES_ROLES_FAIL,
  GET_DECISIONS_RULES_ROLES_DELETED_VALUE_SUCCESS,
  GET_DECISIONS_RULES_ROLES_DELETED_VALUE_FAIL,
} from "./actionTypes";
const INIT_STATE = {
  decisions: [],
  deleted: {},
  error: {},
  decisionCategories: [],
  decisionRulesReasons: [],
  decisionRulesCanceledReasons: [],
  deletedDetail: {},
  decisionsRulesRoles: [],
};
const decisions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DECISIONS_SUCCESS:
      return {
        ...state,
        decisions: action.payload,
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
    case GET_DECISION_CATEGORIES_SUCCESS:
      return {
        ...state,
        decisionCategories: action.payload,
      };
    case GET_DECISION_CATEGORIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DECISIONS_RULES_REASONS_SUCCESS:
      return {
        ...state,
        decisionRulesReasons: action.payload,
      };
    case GET_DECISIONS_RULES_REASONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_DECISIONS_RULES_REASON_SUCCESS:
      return {
        ...state,
        decisionRulesReasons: [...state.decisionRulesReasons, action.payload],
      };
    case ADD_DECISIONS_RULES_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_DECISIONS_RULES_REASON_SUCCESS:
      return {
        ...state,
        decisionRulesReasons: state.decisionRulesReasons.map(
          decisionRulesReason =>
            decisionRulesReason.Id.toString() === action.payload.Id.toString()
              ? { decisionRulesReason, ...action.payload }
              : decisionRulesReason
        ),
      };
    case UPDATE_DECISIONS_RULES_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_DECISIONS_RULES_REASON_SUCCESS:
      return {
        ...state,
        decisionRulesReasons: state.decisionRulesReasons.filter(
          decisionRulesReason =>
            decisionRulesReason.Id.toString() !== action.payload.Id.toString()
        ),
        deletedDetail: action.payload.deleted,
      };

    case DELETE_DECISIONS_RULES_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECISIONS_RULES_REASON_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deletedDetail: action.payload.deleted,
      };
    case GET_DECISIONS_RULES_REASON_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DECISIONS_RULES_CANCELED_REASONS_SUCCESS:
      return {
        ...state,
        decisionRulesCanceledReasons: action.payload,
      };
    case GET_DECISIONS_RULES_CANCELED_REASONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_DECISIONS_RULES_CANCELED_REASON_SUCCESS:
      return {
        ...state,
        decisionRulesCanceledReasons: [
          ...state.decisionRulesCanceledReasons,
          action.payload,
        ],
      };
    case ADD_DECISIONS_RULES_CANCELED_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_DECISIONS_RULES_CANCELED_REASON_SUCCESS:
      return {
        ...state,
        decisionRulesCanceledReasons: state.decisionRulesCanceledReasons.map(
          decisionRulesCanceledReason =>
            decisionRulesCanceledReason.Id.toString() ===
            action.payload.Id.toString()
              ? { decisionRulesCanceledReason, ...action.payload }
              : decisionRulesCanceledReason
        ),
      };
    case UPDATE_DECISIONS_RULES_CANCELED_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_DECISIONS_RULES_CANCELED_REASON_SUCCESS:
      return {
        ...state,
        decisionRulesCanceledReasons: state.decisionRulesCanceledReasons.filter(
          decisionRulesCanceledReason =>
            decisionRulesCanceledReason.Id.toString() !==
            action.payload.Id.toString()
        ),
        deletedDetail: action.payload.deleted,
      };

    case DELETE_DECISIONS_RULES_CANCELED_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deletedDetail: action.payload.deleted,
      };
    case GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DECISIONS_RULES_ROLES_SUCCESS:
      return {
        ...state,
        decisionsRulesRoles: action.payload,
      };
    case GET_DECISIONS_RULES_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_DECISIONS_RULES_ROLES_SUCCESS:
      const parsedPayload = {
        multiArray: JSON.parse(action.payload.multiArray),
      };

      return {
        ...state,
        decisionsRulesRoles: [parsedPayload],
      };
    case ADD_DECISIONS_RULES_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_DECISIONS_RULES_ROLES_SUCCESS:
      return {
        ...state,
        decisionsRulesRoles: state.decisionsRulesRoles.map(
          decisionRulesReason =>
            decisionRulesReason.Id.toString() === action.payload.Id.toString()
              ? { decisionRulesReason, ...action.payload }
              : decisionRulesReason
        ),
      };
    case UPDATE_DECISIONS_RULES_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_DECISIONS_RULES_ROLES_SUCCESS:
      return {
        ...state,
        decisionsRulesRoles: state.decisionsRulesRoles.filter(
          decisionRulesReason =>
            decisionRulesReason.Id.toString() !== action.payload.Id.toString()
        ),
        deletedDetail: action.payload.deleted,
      };

    case DELETE_DECISIONS_RULES_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECISIONS_RULES_ROLES_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deletedDetail: action.payload.deleted,
      };
    case GET_DECISIONS_RULES_ROLES_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default decisions;
