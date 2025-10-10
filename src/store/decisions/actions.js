import {
  GET_DECISIONS,
  GET_DECISIONS_SUCCESS,
  GET_DECISIONS_FAIL,
  ADD_NEW_DECISION,
  ADD_DECISION_SUCCESS,
  ADD_DECISION_FAIL,
  UPDATE_DECISION,
  UPDATE_DECISION_SUCCESS,
  UPDATE_DECISION_FAIL,
  DELETE_DECISION,
  DELETE_DECISION_SUCCESS,
  DELETE_DECISION_FAIL,
  GET_DECISION_DELETED_VALUE,
  GET_DECISION_DELETED_VALUE_FAIL,
  GET_DECISION_DELETED_VALUE_SUCCESS,
  GET_DECISION_MAKERS,
  GET_DECISION_MAKERS_SUCCESS,
  GET_DECISION_MAKERS_FAIL,
  GET_DECISION_STATUS,
  GET_DECISION_STATUS_SUCCESS,
  GET_DECISION_STATUS_FAIL,
} from "./actionTypes";
export const getDecisions = () => ({
  type: GET_DECISIONS,
});

export const getDecisionsSuccess = decisions => ({
  type: GET_DECISIONS_SUCCESS,
  payload: decisions,
});

export const getDecisionsFail = error => ({
  type: GET_DECISIONS_FAIL,
  payload: error,
});
export const addNewDecision = decision => ({
  type: ADD_NEW_DECISION,
  payload: decision,
});
export const addDecisionSuccess = decision => ({
  type: ADD_DECISION_SUCCESS,
  payload: decision,
});

export const addDecisionFail = error => ({
  type: ADD_DECISION_FAIL,
  payload: error,
});
export const updateDecision = decision => {
  return {
    type: UPDATE_DECISION,
    payload: decision,
  };
};

export const updateDecisionSuccess = decision => ({
  type: UPDATE_DECISION_SUCCESS,
  payload: decision,
});

export const updateDecisionFail = error => ({
  type: UPDATE_DECISION_FAIL,
  payload: error,
});
export const deleteDecision = decision => ({
  type: DELETE_DECISION,
  payload: decision,
});
export const deleteDecisionSuccess = decision => ({
  type: DELETE_DECISION_SUCCESS,
  payload: decision,
});
export const deleteDecisionFail = error => ({
  type: DELETE_DECISION_FAIL,
  payload: error,
});

export const getDecisionDeletedValue = () => ({
  type: GET_DECISION_DELETED_VALUE,
});

export const getDecisionDeletedValueSuccess = deleted => ({
  type: GET_DECISION_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getDecisionDeletedValueFail = error => ({
  type: GET_DECISION_DELETED_VALUE_FAIL,
  payload: error,
});

export const getDecisionMakers = () => ({
  type: GET_DECISION_MAKERS,
});

export const getDecisionMakersSuccess = decisions => ({
  type: GET_DECISION_MAKERS_SUCCESS,
  payload: decisions,
});

export const getDecisionMakersFail = error => ({
  type: GET_DECISION_MAKERS_FAIL,
  payload: error,
});

export const getDecisionStatus = () => ({
  type: GET_DECISION_STATUS,
});

export const getDecisionStatusSuccess = decisions => ({
  type: GET_DECISION_STATUS_SUCCESS,
  payload: decisions,
});

export const getDecisionStatusFail = error => ({
  type: GET_DECISION_STATUS_FAIL,
  payload: error,
});

// export const getDecisionCategories = () => ({
//   type: GET_DECISION_CATEGORIES,
// });

// export const getDecisionCategoriesSuccess = categories => ({
//   type: GET_DECISION_CATEGORIES_SUCCESS,
//   payload: categories,
// });

// export const getDecisionCategoriesFail = error => ({
//   type: GET_DECISION_CATEGORIES_FAIL,
//   payload: error,
// });

// export const getDecisionsRulesReasons = decisionId => ({
//   type: GET_DECISIONS_RULES_REASONS,
//   payload:decisionId
// });

// export const getDecisionsRulesReasonsSuccess = decisions => ({
//   type: GET_DECISIONS_RULES_REASONS_SUCCESS,
//   payload: decisions,
// });

// export const getDecisionsRulesReasonsFail = error => ({
//   type: GET_DECISIONS_RULES_REASONS_FAIL,
//   payload: error,
// });
// export const addNewDecisionsRulesReason = decision => ({
//   type: ADD_NEW_DECISIONS_RULES_REASON,
//   payload: decision,
// });
// export const addDecisionsRulesReasonSuccess = decision => ({
//   type: ADD_DECISIONS_RULES_REASON_SUCCESS,
//   payload: decision,
// });

// export const addDecisionsRulesReasonFail = error => ({
//   type: ADD_DECISIONS_RULES_REASON_FAIL,
//   payload: error,
// });
// export const updateDecisionsRulesReason = decision => {
//   return {
//     type: UPDATE_DECISIONS_RULES_REASON,
//     payload: decision,
//   };
// };

// export const updateDecisionsRulesReasonSuccess = decision => ({
//   type: UPDATE_DECISIONS_RULES_REASON_SUCCESS,
//   payload: decision,
// });

// export const updateDecisionsRulesReasonFail = error => ({
//   type: UPDATE_DECISIONS_RULES_REASON_FAIL,
//   payload: error,
// });
// export const deleteDecisionsRulesReason = decision => ({
//   type: DELETE_DECISIONS_RULES_REASON,
//   payload: decision,
// });
// export const deleteDecisionsRulesReasonSuccess = decision => ({
//   type: DELETE_DECISIONS_RULES_REASON_SUCCESS,
//   payload: decision,
// });
// export const deleteDecisionsRulesReasonFail = error => ({
//   type: DELETE_DECISIONS_RULES_REASON_FAIL,
//   payload: error,
// });

// export const getDecisionsRulesReasonDeletedValue = () => ({
//   type: GET_DECISIONS_RULES_REASON_DELETED_VALUE,
// });

// export const getDecisionsRulesReasonDeletedValueSuccess = deleted => ({
//   type: GET_DECISIONS_RULES_REASON_DELETED_VALUE_SUCCESS,
//   payload: deleted,
// });

// export const getDecisionsRulesReasonDeletedValueFail = error => ({
//   type: GET_DECISIONS_RULES_REASON_DELETED_VALUE_FAIL,
//   payload: error,
// });

// export const getDecisionsRulesCanceledReasons = decisionId => ({
//   type: GET_DECISIONS_RULES_CANCELED_REASONS,
//   payload:decisionId
// });

// export const getDecisionsRulesCanceledReasonsSuccess = decisions => ({
//   type: GET_DECISIONS_RULES_CANCELED_REASONS_SUCCESS,
//   payload: decisions,
// });

// export const getDecisionsRulesCanceledReasonsFail = error => ({
//   type: GET_DECISIONS_RULES_CANCELED_REASONS_FAIL,
//   payload: error,
// });
// export const addNewDecisionsRulesCanceledReason = decision => ({
//   type: ADD_NEW_DECISIONS_RULES_CANCELED_REASON,
//   payload: decision,
// });
// export const addDecisionsRulesCanceledReasonSuccess = decision => ({
//   type: ADD_DECISIONS_RULES_CANCELED_REASON_SUCCESS,
//   payload: decision,
// });

// export const addDecisionsRulesCanceledReasonFail = error => ({
//   type: ADD_DECISIONS_RULES_CANCELED_REASON_FAIL,
//   payload: error,
// });
// export const updateDecisionsRulesCanceledReason = decision => {
//   return {
//     type: UPDATE_DECISIONS_RULES_CANCELED_REASON,
//     payload: decision,
//   };
// };

// export const updateDecisionsRulesCanceledReasonSuccess = decision => ({
//   type: UPDATE_DECISIONS_RULES_CANCELED_REASON_SUCCESS,
//   payload: decision,
// });

// export const updateDecisionsRulesCanceledReasonFail = error => ({
//   type: UPDATE_DECISIONS_RULES_CANCELED_REASON_FAIL,
//   payload: error,
// });
// export const deleteDecisionsRulesCanceledReason = decision => ({
//   type: DELETE_DECISIONS_RULES_CANCELED_REASON,
//   payload: decision,
// });
// export const deleteDecisionsRulesCanceledReasonSuccess = decision => ({
//   type: DELETE_DECISIONS_RULES_CANCELED_REASON_SUCCESS,
//   payload: decision,
// });
// export const deleteDecisionsRulesCanceledReasonFail = error => ({
//   type: DELETE_DECISIONS_RULES_CANCELED_REASON_FAIL,
//   payload: error,
// });

// export const getDecisionsRulesCanceledReasonDeletedValue = () => ({
//   type: GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE,
// });

// export const getDecisionsRulesCanceledReasonDeletedValueSuccess = deleted => ({
//   type: GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE_SUCCESS,
//   payload: deleted,
// });

// export const getDecisionsRulesCanceledReasonDeletedValueFail = error => ({
//   type: GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE_FAIL,
//   payload: error,
// });

// export const getDecisionsRulesRoles = decisionId => ({
//   type: GET_DECISIONS_RULES_ROLES,
//   payload:decisionId
// });

// export const getDecisionsRulesRolesSuccess = decisions => ({
//   type: GET_DECISIONS_RULES_ROLES_SUCCESS,
//   payload: decisions,
// });

// export const getDecisionsRulesRolesFail = error => ({
//   type: GET_DECISIONS_RULES_ROLES_FAIL,
//   payload: error,
// });
// export const addNewDecisionsRulesRole = decision => ({
//   type: ADD_NEW_DECISIONS_RULES_ROLES,
//   payload: decision,
// });
// export const addDecisionsRulesRoleSuccess = decision => ({
//   type: ADD_DECISIONS_RULES_ROLES_SUCCESS,
//   payload: decision,
// });

// export const addDecisionsRulesRoleFail = error => ({
//   type: ADD_DECISIONS_RULES_ROLES_FAIL,
//   payload: error,
// });
// export const updateDecisionsRulesRole = decision => {
//   return {
//     type: UPDATE_DECISIONS_RULES_ROLES,
//     payload: decision,
//   };
// };

// export const updateDecisionsRulesRoleSuccess = decision => ({
//   type: UPDATE_DECISIONS_RULES_ROLES_SUCCESS,
//   payload: decision,
// });

// export const updateDecisionsRulesRoleFail = error => ({
//   type: UPDATE_DECISIONS_RULES_ROLES_FAIL,
//   payload: error,
// });
// export const deleteDecisionsRulesRole = decision => ({
//   type: DELETE_DECISIONS_RULES_ROLES,
//   payload: decision,
// });
// export const deleteDecisionsRulesRoleSuccess = decision => ({
//   type: DELETE_DECISIONS_RULES_ROLES_SUCCESS,
//   payload: decision,
// });
// export const deleteDecisionsRulesRoleFail = error => ({
//   type: DELETE_DECISIONS_RULES_ROLES_FAIL,
//   payload: error,
// });

// export const getDecisionsRulesRoleDeletedValue = () => ({
//   type: GET_DECISIONS_RULES_ROLES_DELETED_VALUE,
// });

// export const getDecisionsRulesRoleDeletedValueSuccess = deleted => ({
//   type: GET_DECISIONS_RULES_ROLES_DELETED_VALUE_SUCCESS,
//   payload: deleted,
// });

// export const getDecisionsRulesRoleDeletedValueFail = error => ({
//   type: GET_DECISIONS_RULES_ROLES_DELETED_VALUE_FAIL,
//   payload: error,
// });
