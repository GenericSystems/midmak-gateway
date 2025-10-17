import {
  GET_DECREES,
  GET_DECREES_SUCCESS,
  GET_DECREES_FAIL,
  ADD_NEW_DECREE,
  ADD_DECREE_SUCCESS,
  ADD_DECREE_FAIL,
  UPDATE_DECREE,
  UPDATE_DECREE_SUCCESS,
  UPDATE_DECREE_FAIL,
  DELETE_DECREE,
  DELETE_DECREE_SUCCESS,
  DELETE_DECREE_FAIL,
  GET_DECREE_DELETED_VALUE,
  GET_DECREE_DELETED_VALUE_FAIL,
  GET_DECREE_DELETED_VALUE_SUCCESS,
  GET_DECREE_CATEGORIES,
  GET_DECREE_CATEGORIES_FAIL,
  GET_DECREE_CATEGORIES_SUCCESS,
  GET_DECREES_RULES_REASONS,
  GET_DECREES_RULES_REASONS_SUCCESS,
  GET_DECREES_RULES_REASONS_FAIL,
  ADD_NEW_DECREES_RULES_REASON,
  ADD_DECREES_RULES_REASON_SUCCESS,
  ADD_DECREES_RULES_REASON_FAIL,
  UPDATE_DECREES_RULES_REASON,
  UPDATE_DECREES_RULES_REASON_SUCCESS,
  UPDATE_DECREES_RULES_REASON_FAIL,
  DELETE_DECREES_RULES_REASON,
  DELETE_DECREES_RULES_REASON_SUCCESS,
  DELETE_DECREES_RULES_REASON_FAIL,
  GET_DECREES_RULES_REASON_DELETED_VALUE,
  GET_DECREES_RULES_REASON_DELETED_VALUE_SUCCESS,
  GET_DECREES_RULES_REASON_DELETED_VALUE_FAIL,
  GET_DECREES_RULES_CANCELED_REASONS,
  GET_DECREES_RULES_CANCELED_REASONS_SUCCESS,
  GET_DECREES_RULES_CANCELED_REASONS_FAIL,
  ADD_NEW_DECREES_RULES_CANCELED_REASON,
  ADD_DECREES_RULES_CANCELED_REASON_SUCCESS,
  ADD_DECREES_RULES_CANCELED_REASON_FAIL,
  UPDATE_DECREES_RULES_CANCELED_REASON,
  UPDATE_DECREES_RULES_CANCELED_REASON_SUCCESS,
  UPDATE_DECREES_RULES_CANCELED_REASON_FAIL,
  DELETE_DECREES_RULES_CANCELED_REASON,
  DELETE_DECREES_RULES_CANCELED_REASON_SUCCESS,
  DELETE_DECREES_RULES_CANCELED_REASON_FAIL,
  GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE,
  GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE_SUCCESS,
  GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE_FAIL,
  GET_DECREES_RULES_ROLES,
  GET_DECREES_RULES_ROLES_SUCCESS,
  GET_DECREES_RULES_ROLES_FAIL,
  ADD_NEW_DECREES_RULES_ROLES,
  ADD_DECREES_RULES_ROLES_SUCCESS,
  ADD_DECREES_RULES_ROLES_FAIL,
  UPDATE_DECREES_RULES_ROLES,
  UPDATE_DECREES_RULES_ROLES_SUCCESS,
  UPDATE_DECREES_RULES_ROLES_FAIL,
  DELETE_DECREES_RULES_ROLES,
  DELETE_DECREES_RULES_ROLES_SUCCESS,
  DELETE_DECREES_RULES_ROLES_FAIL,
  GET_DECREES_RULES_ROLES_DELETED_VALUE,
  GET_DECREES_RULES_ROLES_DELETED_VALUE_SUCCESS,
  GET_DECREES_RULES_ROLES_DELETED_VALUE_FAIL,
} from "./actionTypes";
export const getDecrees = () => ({
  type: GET_DECREES,
});

export const getDecreesSuccess = decrees => ({
  type: GET_DECREES_SUCCESS,
  payload: decrees,
});

export const getDecreesFail = error => ({
  type: GET_DECREES_FAIL,
  payload: error,
});
export const addNewDecree = decree => ({
  type: ADD_NEW_DECREE,
  payload: decree,
});
export const addDecreeSuccess = decree => ({
  type: ADD_DECREE_SUCCESS,
  payload: decree,
});

export const addDecreeFail = error => ({
  type: ADD_DECREE_FAIL,
  payload: error,
});
export const updateDecree = decree => {
  return {
    type: UPDATE_DECREE,
    payload: decree,
  };
};

export const updateDecreeSuccess = decree => ({
  type: UPDATE_DECREE_SUCCESS,
  payload: decree,
});

export const updateDecreeFail = error => ({
  type: UPDATE_DECREE_FAIL,
  payload: error,
});
export const deleteDecree = decree => ({
  type: DELETE_DECREE,
  payload: decree,
});
export const deleteDecreeSuccess = decree => ({
  type: DELETE_DECREE_SUCCESS,
  payload: decree,
});
export const deleteDecreeFail = error => ({
  type: DELETE_DECREE_FAIL,
  payload: error,
});

export const getDecreeDeletedValue = () => ({
  type: GET_DECREE_DELETED_VALUE,
});

export const getDecreeDeletedValueSuccess = deleted => ({
  type: GET_DECREE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getDecreeDeletedValueFail = error => ({
  type: GET_DECREE_DELETED_VALUE_FAIL,
  payload: error,
});

export const getDecreeCategories = () => ({
  type: GET_DECREE_CATEGORIES,
});

export const getDecreeCategoriesSuccess = categories => ({
  type: GET_DECREE_CATEGORIES_SUCCESS,
  payload: categories,
});

export const getDecreeCategoriesFail = error => ({
  type: GET_DECREE_CATEGORIES_FAIL,
  payload: error,
});

export const getDecreesRulesReasons = decreeId => ({
  type: GET_DECREES_RULES_REASONS,
  payload: decreeId,
});

export const getDecreesRulesReasonsSuccess = decrees => ({
  type: GET_DECREES_RULES_REASONS_SUCCESS,
  payload: decrees,
});

export const getDecreesRulesReasonsFail = error => ({
  type: GET_DECREES_RULES_REASONS_FAIL,
  payload: error,
});
export const addNewDecreesRulesReason = decree => ({
  type: ADD_NEW_DECREES_RULES_REASON,
  payload: decree,
});
export const addDecreesRulesReasonSuccess = decree => ({
  type: ADD_DECREES_RULES_REASON_SUCCESS,
  payload: decree,
});

export const addDecreesRulesReasonFail = error => ({
  type: ADD_DECREES_RULES_REASON_FAIL,
  payload: error,
});
export const updateDecreesRulesReason = decree => {
  return {
    type: UPDATE_DECREES_RULES_REASON,
    payload: decree,
  };
};

export const updateDecreesRulesReasonSuccess = decree => ({
  type: UPDATE_DECREES_RULES_REASON_SUCCESS,
  payload: decree,
});

export const updateDecreesRulesReasonFail = error => ({
  type: UPDATE_DECREES_RULES_REASON_FAIL,
  payload: error,
});
export const deleteDecreesRulesReason = decree => ({
  type: DELETE_DECREES_RULES_REASON,
  payload: decree,
});
export const deleteDecreesRulesReasonSuccess = decree => ({
  type: DELETE_DECREES_RULES_REASON_SUCCESS,
  payload: decree,
});
export const deleteDecreesRulesReasonFail = error => ({
  type: DELETE_DECREES_RULES_REASON_FAIL,
  payload: error,
});

export const getDecreesRulesReasonDeletedValue = () => ({
  type: GET_DECREES_RULES_REASON_DELETED_VALUE,
});

export const getDecreesRulesReasonDeletedValueSuccess = deleted => ({
  type: GET_DECREES_RULES_REASON_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getDecreesRulesReasonDeletedValueFail = error => ({
  type: GET_DECREES_RULES_REASON_DELETED_VALUE_FAIL,
  payload: error,
});

export const getDecreesRulesCanceledReasons = decreeId => ({
  type: GET_DECREES_RULES_CANCELED_REASONS,
  payload: decreeId,
});

export const getDecreesRulesCanceledReasonsSuccess = decrees => ({
  type: GET_DECREES_RULES_CANCELED_REASONS_SUCCESS,
  payload: decrees,
});

export const getDecreesRulesCanceledReasonsFail = error => ({
  type: GET_DECREES_RULES_CANCELED_REASONS_FAIL,
  payload: error,
});
export const addNewDecreesRulesCanceledReason = decree => ({
  type: ADD_NEW_DECREES_RULES_CANCELED_REASON,
  payload: decree,
});
export const addDecreesRulesCanceledReasonSuccess = decree => ({
  type: ADD_DECREES_RULES_CANCELED_REASON_SUCCESS,
  payload: decree,
});

export const addDecreesRulesCanceledReasonFail = error => ({
  type: ADD_DECREES_RULES_CANCELED_REASON_FAIL,
  payload: error,
});
export const updateDecreesRulesCanceledReason = decree => {
  return {
    type: UPDATE_DECREES_RULES_CANCELED_REASON,
    payload: decree,
  };
};

export const updateDecreesRulesCanceledReasonSuccess = decree => ({
  type: UPDATE_DECREES_RULES_CANCELED_REASON_SUCCESS,
  payload: decree,
});

export const updateDecreesRulesCanceledReasonFail = error => ({
  type: UPDATE_DECREES_RULES_CANCELED_REASON_FAIL,
  payload: error,
});
export const deleteDecreesRulesCanceledReason = decree => ({
  type: DELETE_DECREES_RULES_CANCELED_REASON,
  payload: decree,
});
export const deleteDecreesRulesCanceledReasonSuccess = decree => ({
  type: DELETE_DECREES_RULES_CANCELED_REASON_SUCCESS,
  payload: decree,
});
export const deleteDecreesRulesCanceledReasonFail = error => ({
  type: DELETE_DECREES_RULES_CANCELED_REASON_FAIL,
  payload: error,
});

export const getDecreesRulesCanceledReasonDeletedValue = () => ({
  type: GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE,
});

export const getDecreesRulesCanceledReasonDeletedValueSuccess = deleted => ({
  type: GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getDecreesRulesCanceledReasonDeletedValueFail = error => ({
  type: GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE_FAIL,
  payload: error,
});

export const getDecreesRulesRoles = decreeId => ({
  type: GET_DECREES_RULES_ROLES,
  payload: decreeId,
});

export const getDecreesRulesRolesSuccess = decrees => ({
  type: GET_DECREES_RULES_ROLES_SUCCESS,
  payload: decrees,
});

export const getDecreesRulesRolesFail = error => ({
  type: GET_DECREES_RULES_ROLES_FAIL,
  payload: error,
});
export const addNewDecreesRulesRole = decree => ({
  type: ADD_NEW_DECREES_RULES_ROLES,
  payload: decree,
});
export const addDecreesRulesRoleSuccess = decree => ({
  type: ADD_DECREES_RULES_ROLES_SUCCESS,
  payload: decree,
});

export const addDecreesRulesRoleFail = error => ({
  type: ADD_DECREES_RULES_ROLES_FAIL,
  payload: error,
});
export const updateDecreesRulesRole = decree => {
  return {
    type: UPDATE_DECREES_RULES_ROLES,
    payload: decree,
  };
};

export const updateDecreesRulesRoleSuccess = decree => ({
  type: UPDATE_DECREES_RULES_ROLES_SUCCESS,
  payload: decree,
});

export const updateDecreesRulesRoleFail = error => ({
  type: UPDATE_DECREES_RULES_ROLES_FAIL,
  payload: error,
});
export const deleteDecreesRulesRole = decree => ({
  type: DELETE_DECREES_RULES_ROLES,
  payload: decree,
});
export const deleteDecreesRulesRoleSuccess = decree => ({
  type: DELETE_DECREES_RULES_ROLES_SUCCESS,
  payload: decree,
});
export const deleteDecreesRulesRoleFail = error => ({
  type: DELETE_DECREES_RULES_ROLES_FAIL,
  payload: error,
});

export const getDecreesRulesRoleDeletedValue = () => ({
  type: GET_DECREES_RULES_ROLES_DELETED_VALUE,
});

export const getDecreesRulesRoleDeletedValueSuccess = deleted => ({
  type: GET_DECREES_RULES_ROLES_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getDecreesRulesRoleDeletedValueFail = error => ({
  type: GET_DECREES_RULES_ROLES_DELETED_VALUE_FAIL,
  payload: error,
});
