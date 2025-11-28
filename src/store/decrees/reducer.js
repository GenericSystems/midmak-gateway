import {
  GET_DECREES_SUCCESS,
  GET_DECREES_FAIL,
  ADD_DECREE_SUCCESS,
  ADD_DECREE_FAIL,
  UPDATE_DECREE_SUCCESS,
  UPDATE_DECREE_FAIL,
  DELETE_DECREE_SUCCESS,
  DELETE_DECREE_FAIL,
  GET_DECREE_DELETED_VALUE_SUCCESS,
  GET_DECREE_DELETED_VALUE_FAIL,
  GET_DECREE_CATEGORIES_FAIL,
  GET_DECREES_RULES_REASONS_SUCCESS,
  GET_DECREES_RULES_REASONS_FAIL,
  ADD_DECREES_RULES_REASON_SUCCESS,
  ADD_DECREES_RULES_REASON_FAIL,
  UPDATE_DECREES_RULES_REASON_SUCCESS,
  UPDATE_DECREES_RULES_REASON_FAIL,
  DELETE_DECREES_RULES_REASON_SUCCESS,
  DELETE_DECREES_RULES_REASON_FAIL,
  GET_DECREES_RULES_REASON_DELETED_VALUE_SUCCESS,
  GET_DECREES_RULES_REASON_DELETED_VALUE_FAIL,
  GET_DECREES_RULES_CANCELED_REASONS_SUCCESS,
  GET_DECREES_RULES_CANCELED_REASONS_FAIL,
  ADD_DECREES_RULES_CANCELED_REASON_SUCCESS,
  ADD_DECREES_RULES_CANCELED_REASON_FAIL,
  UPDATE_DECREES_RULES_CANCELED_REASON_SUCCESS,
  UPDATE_DECREES_RULES_CANCELED_REASON_FAIL,
  DELETE_DECREES_RULES_CANCELED_REASON_SUCCESS,
  DELETE_DECREES_RULES_CANCELED_REASON_FAIL,
  GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE_SUCCESS,
  GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE_FAIL,
  GET_DECREE_CATEGORIES_SUCCESS,
  GET_DECREES_RULES_ROLES_SUCCESS,
  GET_DECREES_RULES_ROLES_FAIL,
  ADD_DECREES_RULES_ROLES_SUCCESS,
  ADD_DECREES_RULES_ROLES_FAIL,
  UPDATE_DECREES_RULES_ROLES_SUCCESS,
  UPDATE_DECREES_RULES_ROLES_FAIL,
  DELETE_DECREES_RULES_ROLES_SUCCESS,
  DELETE_DECREES_RULES_ROLES_FAIL,
  GET_DECREES_RULES_ROLES_DELETED_VALUE_SUCCESS,
  GET_DECREES_RULES_ROLES_DELETED_VALUE_FAIL,
} from "./actionTypes";
const INIT_STATE = {
  decrees: [],
  deleted: {},
  error: {},
  decreeCategories: [],
  decreeRulesReasons: [],
  decreeRulesCanceledReasons: [],
  deletedDetail: {},
  decreesRulesRoles: [],
};
const decrees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DECREES_SUCCESS:
      return {
        ...state,
        decrees: action.payload,
      };
    case GET_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_DECREE_SUCCESS:
      return {
        ...state,
        decrees: [...state.decrees, action.payload],
      };
    case ADD_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_DECREE_SUCCESS:
      return {
        ...state,
        decrees: state.decrees.map(decree =>
          decree.Id.toString() === action.payload.Id.toString()
            ? { decree, ...action.payload }
            : decree
        ),
      };
    case UPDATE_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DECREE_SUCCESS:
      return {
        ...state,
        decrees: state.decrees.filter(
          decree => decree.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECREE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_DECREE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DECREE_CATEGORIES_SUCCESS:
      return {
        ...state,
        decreeCategories: action.payload,
      };
    case GET_DECREE_CATEGORIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DECREES_RULES_REASONS_SUCCESS:
      return {
        ...state,
        decreeRulesReasons: action.payload,
      };
    case GET_DECREES_RULES_REASONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_DECREES_RULES_REASON_SUCCESS:
      return {
        ...state,
        decreeRulesReasons: [...state.decreeRulesReasons, action.payload],
      };
    case ADD_DECREES_RULES_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_DECREES_RULES_REASON_SUCCESS:
      return {
        ...state,
        decreeRulesReasons: state.decreeRulesReasons.map(decreeRulesReason =>
          decreeRulesReason.Id.toString() === action.payload.Id.toString()
            ? { decreeRulesReason, ...action.payload }
            : decreeRulesReason
        ),
      };
    case UPDATE_DECREES_RULES_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_DECREES_RULES_REASON_SUCCESS:
      return {
        ...state,
        decreeRulesReasons: state.decreeRulesReasons.filter(
          decreeRulesReason =>
            decreeRulesReason.Id.toString() !== action.payload.Id.toString()
        ),
        deletedDetail: action.payload.deleted,
      };

    case DELETE_DECREES_RULES_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECREES_RULES_REASON_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deletedDetail: action.payload.deleted,
      };
    case GET_DECREES_RULES_REASON_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DECREES_RULES_CANCELED_REASONS_SUCCESS:
      return {
        ...state,
        decreeRulesCanceledReasons: action.payload,
      };
    case GET_DECREES_RULES_CANCELED_REASONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_DECREES_RULES_CANCELED_REASON_SUCCESS:
      return {
        ...state,
        decreeRulesCanceledReasons: [
          ...state.decreeRulesCanceledReasons,
          action.payload,
        ],
      };
    case ADD_DECREES_RULES_CANCELED_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_DECREES_RULES_CANCELED_REASON_SUCCESS:
      return {
        ...state,
        decreeRulesCanceledReasons: state.decreeRulesCanceledReasons.map(
          decreeRulesCanceledReason =>
            decreeRulesCanceledReason.Id.toString() ===
            action.payload.Id.toString()
              ? { decreeRulesCanceledReason, ...action.payload }
              : decreeRulesCanceledReason
        ),
      };
    case UPDATE_DECREES_RULES_CANCELED_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_DECREES_RULES_CANCELED_REASON_SUCCESS:
      return {
        ...state,
        decreeRulesCanceledReasons: state.decreeRulesCanceledReasons.filter(
          decreeRulesCanceledReason =>
            decreeRulesCanceledReason.Id.toString() !==
            action.payload.Id.toString()
        ),
        deletedDetail: action.payload.deleted,
      };

    case DELETE_DECREES_RULES_CANCELED_REASON_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deletedDetail: action.payload.deleted,
      };
    case GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_DECREES_RULES_ROLES_SUCCESS:
      return {
        ...state,
        decreesRulesRoles: action.payload,
      };
    case GET_DECREES_RULES_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_DECREES_RULES_ROLES_SUCCESS:
      const parsedPayload = {
        multiArray: JSON.parse(action.payload.multiArray),
      };

      return {
        ...state,
        decreesRulesRoles: [parsedPayload],
      };
    case ADD_DECREES_RULES_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_DECREES_RULES_ROLES_SUCCESS:
      return {
        ...state,
        decreesRulesRoles: state.decreesRulesRoles.map(decreeRulesReason =>
          decreeRulesReason.Id.toString() === action.payload.Id.toString()
            ? { decreeRulesReason, ...action.payload }
            : decreeRulesReason
        ),
      };
    case UPDATE_DECREES_RULES_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_DECREES_RULES_ROLES_SUCCESS:
      return {
        ...state,
        decreesRulesRoles: state.decreesRulesRoles.filter(
          decreeRulesReason =>
            decreeRulesReason.Id.toString() !== action.payload.Id.toString()
        ),
        deletedDetail: action.payload.deleted,
      };

    case DELETE_DECREES_RULES_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECREES_RULES_ROLES_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deletedDetail: action.payload.deleted,
      };
    case GET_DECREES_RULES_ROLES_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default decrees;
