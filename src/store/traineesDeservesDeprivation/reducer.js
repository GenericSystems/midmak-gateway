import { getRequestStatus } from "./actions";
import {
  GET_TRAINEES_DESERVES_DEPRIVATION_SUCCESS,
  GET_TRAINEES_DESERVES_DEPRIVATION_FAIL,
  ADD_TRAINEE_DESERVE_DEPRIVATION_SUCCESS,
  ADD_TRAINEE_DESERVE_DEPRIVATION_FAIL,
  UPDATE_TRAINEE_DESERVE_DEPRIVATION_SUCCESS,
  UPDATE_TRAINEE_DESERVE_DEPRIVATION_FAIL,
  GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE_SUCCESS,
  GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE_FAIL,
  DELETE_TRAINEE_DESERVE_DEPRIVATION_SUCCESS,
  DELETE_TRAINEE_DESERVE_DEPRIVATION_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  traineesDeservesDeprivation: [],
  deleted: {},
  error: {},
};

const traineesDeservesDeprivation = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINEES_DESERVES_DEPRIVATION_SUCCESS:
      return {
        ...state,
        traineesDeservesDeprivation: action.payload,
        deleted: {},
      };

    case GET_TRAINEES_DESERVES_DEPRIVATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TRAINEE_DESERVE_DEPRIVATION_SUCCESS:
      return {
        ...state,
        traineesDeservesDeprivation: [
          ...state.traineesDeservesDeprivation,
          action.payload,
        ],
      };

    case ADD_TRAINEE_DESERVE_DEPRIVATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TRAINEE_DESERVE_DEPRIVATION_SUCCESS:
      return {
        ...state,
        traineesDeservesDeprivation: state.traineesDeservesDeprivation.map(
          traineeDeserveDeprivation =>
            traineeDeserveDeprivation.Id.toString() ===
            action.payload.Id.toString()
              ? { traineeDeserveDeprivation, ...action.payload }
              : traineeDeserveDeprivation
        ),
      };

    case UPDATE_TRAINEE_DESERVE_DEPRIVATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TRAINEE_DESERVE_DEPRIVATION_SUCCESS:
      return {
        ...state,
        traineesDeservesDeprivation: state.traineesDeservesDeprivation.filter(
          traineeDeserveDeprivation =>
            traineeDeserveDeprivation.Id.toString() !==
            action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TRAINEE_DESERVE_DEPRIVATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default traineesDeservesDeprivation;
