
import {
  GET_FEES_DEFINITION_DELETED_VALUE,
  GET_FEES_DEFINITION_DELETED_VALUE_FAIL,
  GET_FEES_DEFINITION_DELETED_VALUE_SUCCESS,
  GET_FEES_DEFINITION,
  GET_FEES_DEFINITION_FAIL,
  GET_FEES_DEFINITION_SUCCESS,
  ADD_NEW_FEES_DEFINITION,
  ADD_NEW_FEES_DEFINITION_SUCCESS,
  ADD_NEW_FEES_DEFINITION_FAIL,
  UPDATE_FEES_DEFINITION,
  UPDATE_FEES_DEFINITION_SUCCESS,
  UPDATE_FEES_DEFINITION_FAIL,
  DELETE_FEES_DEFINITION,
  DELETE_FEES_DEFINITION_SUCCESS,
  DELETE_FEES_DEFINITION_FAIL,
  COPY_FEES,
  COPY_FEES_SUCCESS,
  COPY_FEES_FAIL,
  GET_FEES_CONDITIONS,
  GET_FEES_CONDITIONS_FAIL,
  GET_FEES_CONDITIONS_SUCCESS,
  ADD_NEW_FEES_CONDITION,
  ADD_NEW_FEES_CONDITION_SUCCESS,
  ADD_NEW_FEES_CONDITION_FAIL,
  UPDATE_FEES_CONDITION,
  UPDATE_FEES_CONDITION_SUCCESS,
  UPDATE_FEES_CONDITION_FAIL,
  DELETE_FEES_CONDITION,
  DELETE_FEES_CONDITION_SUCCESS,
  DELETE_FEES_CONDITION_FAIL,
  GET_FEES_PRICES,
  GET_FEES_PRICES_FAIL,
  GET_FEES_PRICES_SUCCESS,
  ADD_NEW_FEES_PRICE,
  ADD_NEW_FEES_PRICE_SUCCESS,
  ADD_NEW_FEES_PRICE_FAIL,
  UPDATE_FEES_PRICE,
  UPDATE_FEES_PRICE_SUCCESS,
  UPDATE_FEES_PRICE_FAIL,
  DELETE_FEES_PRICE,
  DELETE_FEES_PRICE_SUCCESS,
  DELETE_FEES_PRICE_FAIL,
  COPY_FEES_PRICE,
  COPY_FEES_PRICE_SUCCESS,
  COPY_FEES_PRICE_FAIL,
  GET_FEES_SERVICES,
  GET_FEES_SERVICES_FAIL,
  GET_FEES_SERVICES_SUCCESS,
  ADD_NEW_FEES_SERVICE,
  ADD_NEW_FEES_SERVICE_SUCCESS,
  ADD_NEW_FEES_SERVICE_FAIL,
  UPDATE_FEES_SERVICE,
  UPDATE_FEES_SERVICE_SUCCESS,
  UPDATE_FEES_SERVICE_FAIL,
  DELETE_FEES_SERVICE,
  DELETE_FEES_SERVICE_SUCCESS,
  DELETE_FEES_SERVICE_FAIL,
  COPY_FEES_SERVICE,
  COPY_FEES_SERVICE_SUCCESS,
  COPY_FEES_SERVICE_FAIL,
  GET_FISCAL_YEAR_DETAILS,
  GET_FISCAL_YEAR_DETAILS_FAIL,
  GET_FISCAL_YEAR_DETAILS_SUCCESS,
  GET_EXECUTE_METHODS,
  GET_EXECUTE_METHODS_FAIL,
  GET_EXECUTE_METHODS_SUCCESS,
} from "./actionTypes";

export const getFeesDefinition = feesDefinitions => ({
  type: GET_FEES_DEFINITION,
  payload: feesDefinitions,
});

export const getFeesDefinitionSuccess = feesDefinitions => ({
  type: GET_FEES_DEFINITION_SUCCESS,
  payload: feesDefinitions,
});

export const getFeesDefinitionFail = error => ({
  type: GET_FEES_DEFINITION_FAIL,
  payload: error,
});

export const getFeesDefinitionDeletedValue = () => ({
  type: GET_FEES_DEFINITION_DELETED_VALUE,
});

export const getFeesDefinitionDeletedValueSuccess = deleted => ({
  type: GET_FEES_DEFINITION_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getFeesDefinitionDeletedValueFail = error => ({
  type: GET_FEES_DEFINITION_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewFeesDefinition = feesDefinition => ({
  type: ADD_NEW_FEES_DEFINITION,
  payload: feesDefinition,
});

export const addFeesDefinitionSuccess = feesDefinition => ({
  type: ADD_NEW_FEES_DEFINITION_SUCCESS,
  payload: feesDefinition,
});

export const addFeesDefinitionFail = error => ({
  type: ADD_NEW_FEES_DEFINITION_FAIL,
  payload: error,
});

export const updateFeesDefinition = feesDefinition => {
  return {
    type: UPDATE_FEES_DEFINITION,
    payload: feesDefinition,
  };
};

export const updateFeesDefinitionSuccess = feesDefinition => ({
  type: UPDATE_FEES_DEFINITION_SUCCESS,
  payload: feesDefinition,
});

export const updateFeesDefinitionFail = error => ({
  type: UPDATE_FEES_DEFINITION_FAIL,
  payload: error,
});

export const deleteFeesDefinition = feesDefinition => ({
  type: DELETE_FEES_DEFINITION,
  payload: feesDefinition,
});

export const deleteFeesDefinitionSuccess = feesDefinition => ({
  type: DELETE_FEES_DEFINITION_SUCCESS,
  payload: feesDefinition,
});

export const deleteFeesDefinitionFail = error => ({
  type: DELETE_FEES_DEFINITION_FAIL,
  payload: error,
});

export const copyFees = feesDefinition => ({
  type: COPY_FEES,
  payload: feesDefinition,
});

export const copyFeesSuccess = feesDefinition => ({
  type: COPY_FEES_SUCCESS,
  payload: feesDefinition,
});

export const copyFeesFail = error => ({
  type: COPY_FEES_FAIL,
  payload: error,
});

export const getFeesConditions = feesConditions => ({
  type: GET_FEES_CONDITIONS,
  payload: feesConditions,
});

export const getFeesConditionsSuccess = feesConditions => ({
  type: GET_FEES_CONDITIONS_SUCCESS,
  payload: feesConditions,
});

export const getFeesConditionsFail = error => ({
  type: GET_FEES_CONDITIONS_FAIL,
  payload: error,
});

export const addNewFeesCondition = feesCondition => ({
  type: ADD_NEW_FEES_CONDITION,
  payload: feesCondition,
});

export const addFeesConditionSuccess = feesCondition => ({
  type: ADD_NEW_FEES_CONDITION_SUCCESS,
  payload: feesCondition,
});

export const addFeesConditionFail = error => ({
  type: ADD_NEW_FEES_CONDITION_FAIL,
  payload: error,
});

export const updateFeesCondition = feesCondition => {
  return {
    type: UPDATE_FEES_CONDITION,
    payload: feesCondition,
  };
};

export const updateFeesConditionSuccess = feesCondition => ({
  type: UPDATE_FEES_CONDITION_SUCCESS,
  payload: feesCondition,
});

export const updateFeesConditionFail = error => ({
  type: UPDATE_FEES_CONDITION_FAIL,
  payload: error,
});

export const deleteFeesCondition = feesCondition => ({
  type: DELETE_FEES_CONDITION,
  payload: feesCondition,
});

export const deleteFeesConditionSuccess = feesCondition => ({
  type: DELETE_FEES_CONDITION_SUCCESS,
  payload: feesCondition,
});

export const deleteFeesConditionFail = error => ({
  type: DELETE_FEES_CONDITION_FAIL,
  payload: error,
});

export const getFeesPrices = feesPrices => ({
  type: GET_FEES_PRICES,
  payload: feesPrices,
});

export const getFeesPricesSuccess = feesPrices => ({
  type: GET_FEES_PRICES_SUCCESS,
  payload: feesPrices,
});

export const getFeesPricesFail = error => ({
  type: GET_FEES_PRICES_FAIL,
  payload: error,
});

export const addNewFeesPrice = feesPrice => ({
  type: ADD_NEW_FEES_PRICE,
  payload: feesPrice,
});

export const addFeesPriceSuccess = feesPrice => ({
  type: ADD_NEW_FEES_PRICE_SUCCESS,
  payload: feesPrice,
});

export const addFeesPriceFail = error => ({
  type: ADD_NEW_FEES_PRICE_FAIL,
  payload: error,
});

export const updateFeesPrice = feesPrice => {
  return {
    type: UPDATE_FEES_PRICE,
    payload: feesPrice,
  };
};

export const updateFeesPriceSuccess = feesPrice => ({
  type: UPDATE_FEES_PRICE_SUCCESS,
  payload: feesPrice,
});

export const updateFeesPriceFail = error => ({
  type: UPDATE_FEES_PRICE_FAIL,
  payload: error,
});

export const deleteFeesPrice = feesPrice => ({
  type: DELETE_FEES_PRICE,
  payload: feesPrice,
});

export const deleteFeesPriceSuccess = feesPrice => ({
  type: DELETE_FEES_PRICE_SUCCESS,
  payload: feesPrice,
});

export const deleteFeesPriceFail = error => ({
  type: DELETE_FEES_PRICE_FAIL,
  payload: error,
});

export const copyFeesPrice = feesPrices => ({
  type: COPY_FEES_PRICE,
  payload: feesPrices,
});

export const copyFeesPriceSuccess = feesPrices => ({
  type: COPY_FEES_PRICE_SUCCESS,
  payload: feesPrices,
});

export const copyFeesPriceFail = error => ({
  type: COPY_FEES_PRICE_FAIL,
  payload: error,
});

export const getFeesServices = feesServices => ({
  type: GET_FEES_SERVICES,
  payload: feesServices,
});

export const getFeesServicesSuccess = feesServices => ({
  type: GET_FEES_SERVICES_SUCCESS,
  payload: feesServices,
});

export const getFeesServicesFail = error => ({
  type: GET_FEES_SERVICES_FAIL,
  payload: error,
});

export const addNewFeesService = feesService => ({
  type: ADD_NEW_FEES_SERVICE,
  payload: feesService,
});

export const addFeesServiceSuccess = feesService => ({
  type: ADD_NEW_FEES_SERVICE_SUCCESS,
  payload: feesService,
});

export const addFeesServiceFail = error => ({
  type: ADD_NEW_FEES_SERVICE_FAIL,
  payload: error,
});

export const updateFeesService = feesService => {
  return {
    type: UPDATE_FEES_SERVICE,
    payload: feesService,
  };
};

export const updateFeesServiceSuccess = feesService => ({
  type: UPDATE_FEES_SERVICE_SUCCESS,
  payload: feesService,
});

export const updateFeesServiceFail = error => ({
  type: UPDATE_FEES_SERVICE_FAIL,
  payload: error,
});

export const deleteFeesService = feesService => ({
  type: DELETE_FEES_SERVICE,
  payload: feesService,
});

export const deleteFeesServiceSuccess = feesService => ({
  type: DELETE_FEES_SERVICE_SUCCESS,
  payload: feesService,
});

export const deleteFeesServiceFail = error => ({
  type: DELETE_FEES_SERVICE_FAIL,
  payload: error,
});

export const copyFeesService = feesServices => ({
  type: COPY_FEES_SERVICE,
  payload: feesServices,
});

export const copyFeesServiceSuccess = feesServices => ({
  type: COPY_FEES_SERVICE_SUCCESS,
  payload: feesServices,
});

export const copyFeesServiceFail = error => ({
  type: COPY_FEES_SERVICE_FAIL,
  payload: error,
});

export const getFiscalYearDetails = FiscalYearDetails => ({
  type: GET_FISCAL_YEAR_DETAILS,
  payload: FiscalYearDetails,
});

export const getFiscalYearDetailsSuccess = FiscalYearDetails => ({
  type: GET_FISCAL_YEAR_DETAILS_SUCCESS,
  payload: FiscalYearDetails,
});

export const getFiscalYearDetailsFail = error => ({
  type: GET_FISCAL_YEAR_DETAILS_FAIL,
  payload: error,
});

export const getExecuteMethods = ExecuteMethods => ({
  type: GET_EXECUTE_METHODS,
  payload: ExecuteMethods,
});

export const getExecuteMethodsSuccess = ExecuteMethods => ({
  type: GET_EXECUTE_METHODS_SUCCESS,
  payload: ExecuteMethods,
});

export const getExecuteMethodsFail = error => ({
  type: GET_EXECUTE_METHODS_FAIL,
  payload: error,
});