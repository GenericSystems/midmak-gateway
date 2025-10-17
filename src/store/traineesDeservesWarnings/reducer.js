import { getRequestStatus } from "./actions";
import {
  GET_TRAINEES_DESERVES_WARNINGS_SUCCESS,
  GET_TRAINEES_DESERVES_WARNINGS_FAIL,
  ADD_TRAINEE_DESERVE_WARNING_SUCCESS,
  ADD_TRAINEE_DESERVE_WARNING_FAIL,
  UPDATE_TRAINEE_DESERVE_WARNING_SUCCESS,
  UPDATE_TRAINEE_DESERVE_WARNING_FAIL,
  GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE_SUCCESS,
  GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE_FAIL,
  DELETE_TRAINEE_DESERVE_WARNING_SUCCESS,
  DELETE_TRAINEE_DESERVE_WARNING_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  traineesDeservesWarnings: [],
  deleted: {},
  error: {},
};

const traineesDeservesWarnings = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINEES_DESERVES_WARNINGS_SUCCESS:
      return {
        ...state,
        traineesDeservesWarnings: action.payload,
        deleted: {},
      };

    case GET_TRAINEES_DESERVES_WARNINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TRAINEE_DESERVE_WARNING_SUCCESS:
      return {
        ...state,
        traineesDeservesWarnings: [
          ...state.traineesDeservesWarnings,
          action.payload,
        ],
      };

    case ADD_TRAINEE_DESERVE_WARNING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TRAINEE_DESERVE_WARNING_SUCCESS:
      return {
        ...state,
        traineesDeservesWarnings: state.traineesDeservesWarnings.map(
          traineeDeserveWarning =>
            traineeDeserveWarning.Id.toString() === action.payload.Id.toString()
              ? { traineeDeserveWarning, ...action.payload }
              : traineeDeserveWarning
        ),
      };

    case UPDATE_TRAINEE_DESERVE_WARNING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TRAINEE_DESERVE_WARNING_SUCCESS:
      return {
        ...state,
        traineesDeservesWarnings: state.traineesDeservesWarnings.filter(
          traineeDeserveWarning =>
            traineeDeserveWarning.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TRAINEE_DESERVE_WARNING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default traineesDeservesWarnings;
