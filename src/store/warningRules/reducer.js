import {
    GET_WARNING_RULES_SUCCESS,
    GET_WARNING_RULES_FAIL,
    ADD_WARNING_RULE_SUCCESS,
    ADD_WARNING_RULE_FAIL,
    UPDATE_WARNING_RULE_SUCCESS,
    UPDATE_WARNING_RULE_FAIL,
    DELETE_WARNING_RULE_SUCCESS,
    DELETE_WARNING_RULE_FAIL,
    GET_WARNING_RULE_DELETED_VALUE_SUCCESS,
    GET_WARNING_RULE_DELETED_VALUE_FAIL,
    GET_WARNING_RULES_OPT_SUCCESS,
    GET_WARNING_RULES_OPT_FAIL,
    GET_STUDENT_STATES_SUCCESS,
    GET_STUDENT_STATES_FAIL,
  } from "./actionTypes";
  
  const INIT_STATE = {
    warningRules: [],
    warningRulesOpt: [],
    studentStates: [],
    deleted: {},
    error: {},
  };
  
  const warningRules = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_WARNING_RULES_SUCCESS:
        return {
          ...state,
          warningRules: action.payload,
        };
      case GET_WARNING_RULES_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_WARNING_RULE_SUCCESS:
        return {
          ...state,
          warningRules: [...state.warningRules, action.payload],
        };
  
      case ADD_WARNING_RULE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case UPDATE_WARNING_RULE_SUCCESS:
        return {
          ...state,
          warningRules: state.warningRules.map(warningRule =>
            warningRule.Id === action.payload.Id
              ? { warningRule, ...action.payload }
              : warningRule
          ),
        };
  
      case UPDATE_WARNING_RULE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_WARNING_RULE_SUCCESS:
        return {
          ...state,
          warningRules: state.warningRules.filter(
            warningRule => warningRule.Id.toString() !== action.payload.Id.toString()
          ),
          deleted: action.payload.deleted,
        };
  
      case DELETE_WARNING_RULE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_WARNING_RULE_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        };
      case GET_WARNING_RULE_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case GET_WARNING_RULES_OPT_SUCCESS:
        return {
          ...state,
          warningRulesOpt: action.payload,
        };
      case GET_WARNING_RULES_OPT_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case GET_STUDENT_STATES_SUCCESS:
          return {
            ...state,
            studentStates: action.payload,
          };
        case GET_STUDENT_STATES_FAIL:
          return {
            ...state,
            error: action.payload,
          };
  
      default:
        return state;
    }
  };
  
  export default warningRules;
  