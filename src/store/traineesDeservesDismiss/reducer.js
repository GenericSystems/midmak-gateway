import { getRequestStatus } from "./actions";
import {
  GET_TRAINEES_DESERVES_DISMISS_SUCCESS,
  GET_TRAINEES_DESERVES_DISMISS_FAIL,
  ADD_TRAINEE_DESERVE_DISMISS_SUCCESS,
  ADD_TRAINEE_DESERVE_DISMISS_FAIL,
  UPDATE_TRAINEE_DESERVE_DISMISS_SUCCESS,
  UPDATE_TRAINEE_DESERVE_DISMISS_FAIL,
  GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE_SUCCESS,
  GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE_FAIL,
  DELETE_TRAINEE_DESERVE_DISMISS_SUCCESS,
  DELETE_TRAINEE_DESERVE_DISMISS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  traineesDeservesDismiss: [],
  deleted: {},
  error: {},
};

const traineesDeservesDismiss = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINEES_DESERVES_DISMISS_SUCCESS:
      return {
        ...state,
        traineesDeservesDismiss: action.payload,
        deleted: {},
      };

    case GET_TRAINEES_DESERVES_DISMISS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TRAINEE_DESERVE_DISMISS_SUCCESS:
      return {
        ...state,
        traineesDeservesDismiss: [
          ...state.traineesDeservesDismiss,
          action.payload,
        ],
      };

    case ADD_TRAINEE_DESERVE_DISMISS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TRAINEE_DESERVE_DISMISS_SUCCESS:
      return {
        ...state,
        traineesDeservesDismiss: state.traineesDeservesDismiss.map(
          traineeDeserveDismiss =>
            traineeDeserveDismiss.Id.toString() === action.payload.Id.toString()
              ? { traineeDeserveDismiss, ...action.payload }
              : traineeDeserveDismiss
        ),
      };

    case UPDATE_TRAINEE_DESERVE_DISMISS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TRAINEE_DESERVE_DISMISS_SUCCESS:
      return {
        ...state,
        traineesDeservesDismiss: state.traineesDeservesDismiss.filter(
          traineeDeserveDismiss =>
            traineeDeserveDismiss.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TRAINEE_DESERVE_DISMISS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default traineesDeservesDismiss;
