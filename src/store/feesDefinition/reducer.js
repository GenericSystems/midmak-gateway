import {
  GET_FEES_DEFINITION_SUCCESS,
  GET_FEES_DEFINITION_FAIL,
  ADD_NEW_FEES_DEFINITION_SUCCESS,
  ADD_NEW_FEES_DEFINITION_FAIL,
  UPDATE_FEES_DEFINITION_SUCCESS,
  UPDATE_FEES_DEFINITION_FAIL,
  DELETE_FEES_DEFINITION_SUCCESS,
  DELETE_FEES_DEFINITION_FAIL,
  GET_FEES_DEFINITION_DELETED_VALUE_SUCCESS,
  GET_FEES_DEFINITION_DELETED_VALUE_FAIL,
  COPY_FEES_SUCCESS,
  COPY_FEES_FAIL,
  GET_FEES_CONDITIONS_SUCCESS,
  GET_FEES_CONDITIONS_FAIL,
  ADD_NEW_FEES_CONDITION_SUCCESS,
  ADD_NEW_FEES_CONDITION_FAIL,
  UPDATE_FEES_CONDITION_SUCCESS,
  UPDATE_FEES_CONDITION_FAIL,
  DELETE_FEES_CONDITION_SUCCESS,
  DELETE_FEES_CONDITION_FAIL,
  GET_FEES_PRICES_SUCCESS,
  GET_FEES_PRICES_FAIL,
  ADD_NEW_FEES_PRICE_SUCCESS,
  ADD_NEW_FEES_PRICE_FAIL,
  UPDATE_FEES_PRICE_SUCCESS,
  UPDATE_FEES_PRICE_FAIL,
  DELETE_FEES_PRICE_SUCCESS,
  DELETE_FEES_PRICE_FAIL,
  COPY_FEES_PRICE_SUCCESS,
  COPY_FEES_PRICE_FAIL,
  GET_FEES_SERVICES_SUCCESS,
  GET_FEES_SERVICES_FAIL,
  ADD_NEW_FEES_SERVICE_SUCCESS,
  ADD_NEW_FEES_SERVICE_FAIL,
  UPDATE_FEES_SERVICE_SUCCESS,
  UPDATE_FEES_SERVICE_FAIL,
  DELETE_FEES_SERVICE_SUCCESS,
  DELETE_FEES_SERVICE_FAIL,
  COPY_FEES_SERVICE_SUCCESS,
  COPY_FEES_SERVICE_FAIL,
  GET_FISCAL_YEAR_DETAILS_SUCCESS,
  GET_FISCAL_YEAR_DETAILS_FAIL,
  GET_EXECUTE_METHODS_SUCCESS,
  GET_EXECUTE_METHODS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  feesDefinition: [],
  feesConditions: [],
  feesPrices: [],
  feesServices: [],
  fiscalYearDetails: [],
  executeMethods: [],
  last_created_fees: { Id: 0 },
  deleted: {},
  error: {},
};

const feesDefinition = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FEES_DEFINITION_SUCCESS:
      return {
        ...state,
        feesDefinition: action.payload,
      };

    case GET_FEES_DEFINITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_NEW_FEES_DEFINITION_SUCCESS:
      return {
        ...state,
        feesDefinition: [...state.feesDefinition, action.payload],
        last_created_fees: action.payload.Id,
      };

    case ADD_NEW_FEES_DEFINITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FEES_DEFINITION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case UPDATE_FEES_DEFINITION_SUCCESS:
      return {
        ...state,
        feesDefinition: state.feesDefinition.map(feesDefinition =>
          feesDefinition.Id.toString() === action.payload.Id.toString()
            ? { feesDefinition, ...action.payload }
            : feesDefinition
        ),
      };

    case UPDATE_FEES_DEFINITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_FEES_DEFINITION_SUCCESS:
      return {
        ...state,
        feesDefinition: state.feesDefinition.filter(
          feesDefinition =>
            feesDefinition.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_FEES_DEFINITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FEES_DEFINITION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case COPY_FEES_SUCCESS:
      return {
        ...state,
        feesDefinition: action.payload,
      };

    case COPY_FEES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FEES_CONDITIONS_SUCCESS:
      return {
        ...state,
        feesConditions: action.payload,
      };

    case GET_FEES_CONDITIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_NEW_FEES_CONDITION_SUCCESS:
      return {
        ...state,
        feesConditions: [...state.feesConditions, action.payload],
      };

    case ADD_NEW_FEES_CONDITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_FEES_CONDITION_SUCCESS:
      return {
        ...state,
        feesConditions: state.feesConditions.map(feesCondition =>
          feesCondition.Id.toString() === action.payload.Id.toString()
            ? { feesCondition, ...action.payload }
            : feesCondition
        ),
      };

    case UPDATE_FEES_CONDITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_FEES_CONDITION_SUCCESS:
      return {
        ...state,
        feesConditions: state.feesConditions.filter(
          feesCondition =>
            feesCondition.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_FEES_CONDITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FEES_PRICES_SUCCESS:
      return {
        ...state,
        feesPrices: action.payload,
      };

    case GET_FEES_PRICES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_NEW_FEES_PRICE_SUCCESS:
      return {
        ...state,
        feesPrices: [...state.feesPrices, action.payload],
      };

    case ADD_NEW_FEES_PRICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_FEES_PRICE_SUCCESS:
      return {
        ...state,
        feesPrices: state.feesPrices.map(feesPrice =>
          feesPrice.Id.toString() === action.payload.Id.toString()
            ? { feesPrice, ...action.payload }
            : feesPrice
        ),
      };

    case UPDATE_FEES_PRICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_FEES_PRICE_SUCCESS:
      return {
        ...state,
        feesPrices: state.feesPrices.filter(
          feesPrice => feesPrice.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_FEES_PRICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      
    case COPY_FEES_PRICE_SUCCESS:
      return {
        ...state,
        feesPrice: action.payload,
      };

    case COPY_FEES_PRICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      
    case GET_FEES_SERVICES_SUCCESS:
      return {
        ...state,
        feesServices: action.payload,
      };

    case GET_FEES_SERVICES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_NEW_FEES_SERVICE_SUCCESS:
      return {
        ...state,
        feesServices: [...state.feesServices, action.payload],
      };

    case ADD_NEW_FEES_SERVICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_FEES_SERVICE_SUCCESS:
      return {
        ...state,
        feesServices: state.feesServices.map(feesService =>
          feesService.Id.toString() === action.payload.Id.toString()
            ? { feesService, ...action.payload }
            : feesService
        ),
      };

    case UPDATE_FEES_SERVICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_FEES_SERVICE_SUCCESS:
      return {
        ...state,
        feesServices: state.feesServices.filter(
          feesService => feesService.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_FEES_SERVICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      
    case COPY_FEES_SERVICE_SUCCESS:
      return {
        ...state,
        feesService: action.payload,
      };

    case COPY_FEES_SERVICE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_FISCAL_YEAR_DETAILS_SUCCESS:
        return {
          ...state,
          fiscalYearDetails: action.payload,
        };
  
      case GET_FISCAL_YEAR_DETAILS_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case GET_EXECUTE_METHODS_SUCCESS:
          return {
            ...state,
            executeMethods: action.payload,
          };
    
        case GET_EXECUTE_METHODS_FAIL:
          return {
            ...state,
            error: action.payload,
          };


    default:
      return state;
  }
};

export default feesDefinition;
