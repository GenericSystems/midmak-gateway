import {
    GET_WARNING_RULES,
    GET_WARNING_RULES_FAIL,
    GET_WARNING_RULES_SUCCESS,
    ADD_NEW_WARNING_RULE,
    ADD_WARNING_RULE_FAIL,
    ADD_WARNING_RULE_SUCCESS,
    UPDATE_WARNING_RULE,
    UPDATE_WARNING_RULE_FAIL,
    UPDATE_WARNING_RULE_SUCCESS,
    DELETE_WARNING_RULE,
    DELETE_WARNING_RULE_SUCCESS,
    DELETE_WARNING_RULE_FAIL,
    GET_WARNING_RULE_DELETED_VALUE,
    GET_WARNING_RULE_DELETED_VALUE_FAIL,
    GET_WARNING_RULE_DELETED_VALUE_SUCCESS,
    GET_WARNING_RULES_OPT,
    GET_WARNING_RULES_OPT_FAIL,
    GET_WARNING_RULES_OPT_SUCCESS,
    GET_STUDENT_STATES,
    GET_STUDENT_STATES_SUCCESS,
    GET_STUDENT_STATES_FAIL
      } from "./actionTypes";
      
      export const getWarningRules = () => ({
        type: GET_WARNING_RULES,
      });
      
      export const getWarningRulesSuccess = warnings => ({
        type: GET_WARNING_RULES_SUCCESS,
        payload: warnings,
      });
      
      export const getWarningRulesFail = error => ({
        type: GET_WARNING_RULES_FAIL,
        payload: error,
      });

      
      
      export const addNewWarningRule = warning => ({
        type: ADD_NEW_WARNING_RULE,
        payload: warning,
      });
      
      export const addWarningRuleSuccess = warning => ({
        type: ADD_WARNING_RULE_SUCCESS,
        payload: warning,
      });
      
      export const addWarningRuleFail = error => ({
        type: ADD_WARNING_RULE_FAIL,
        payload: error,
      });
      
      export const updateWarningRule = warning => {
        return {
          type: UPDATE_WARNING_RULE,
          payload: warning,
        };
      };
      
      export const updateWarningRuleSuccess = warning => ({
        type: UPDATE_WARNING_RULE_SUCCESS,
        payload: warning,
      });
      
      export const updateWarningRuleFail = error => ({
        type: UPDATE_WARNING_RULE_FAIL,
        payload: error,
      });
      
      export const deleteWarningRule = warning => ({
        type: DELETE_WARNING_RULE,
        payload: warning,
      });
      
      export const deleteWarningRuleSuccess = warning => ({
        type: DELETE_WARNING_RULE_SUCCESS,
        payload: warning,
      });
      
      export const deleteWarningRuleFail = error => ({
        type: DELETE_WARNING_RULE_FAIL,
        payload: error,
      });
      
      
    export const getWarningRuleDeletedValue = () => ({
      type: GET_WARNING_RULE_DELETED_VALUE,
    });
    
    export const getWarningRuleDeletedValueSuccess = deleted => ({
      type: GET_WARNING_RULE_DELETED_VALUE_SUCCESS,
      payload: deleted,
    });
    
    export const getWarningRuleDeletedValueFail = error => ({
      type: GET_WARNING_RULE_DELETED_VALUE_FAIL,
      payload: error,
    });

    export const getStudentStates = () => ({
      type: GET_STUDENT_STATES,
    });
    
    export const getStudentStatesSuccess = studentStates => ({
      type: GET_STUDENT_STATES_SUCCESS,
      payload: studentStates,
    });
    
    export const getStudentStatesFail = error => ({
      type: GET_STUDENT_STATES_FAIL,
      payload: error,
    });

    export const getWarningRulesOpt = () => ({
      type: GET_WARNING_RULES_OPT,
    });
    
    export const getWarningRulesOptSuccess = warnings => ({
      type: GET_WARNING_RULES_OPT_SUCCESS,
      payload: warnings,
    });
    
    export const getWarningRulesOptFail = error => ({
      type: GET_WARNING_RULES_OPT_FAIL,
      payload: error,
    });