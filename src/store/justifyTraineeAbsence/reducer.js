import {
  GET_JUSTIFY_TRAINEES_ABSENCE_SUCCESS,
  GET_JUSTIFY_TRAINEES_ABSENCE_FAIL,
  ADD_JUSTIFY_TRAINEE_ABSENCE_SUCCESS,
  ADD_JUSTIFY_TRAINEE_ABSENCE_FAIL,
  UPDATE_JUSTIFY_TRAINEE_ABSENCE_SUCCESS,
  UPDATE_JUSTIFY_TRAINEE_ABSENCE_FAIL,
  DELETE_JUSTIFY_TRAINEE_ABSENCE_SUCCESS,
  DELETE_JUSTIFY_TRAINEE_ABSENCE_FAIL,
  GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE_SUCCESS,
  GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  justifyTraineesAbsence: [],
  deleted: {},
  error: {},
};

const justifyTraineesAbsence = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_JUSTIFY_TRAINEES_ABSENCE_SUCCESS:
      return {
        ...state,
        justifyTraineesAbsence: action.payload,
      };

    case GET_JUSTIFY_TRAINEES_ABSENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_JUSTIFY_TRAINEE_ABSENCE_SUCCESS:
      return {
        ...state,
        justifyTraineesAbsence: [
          ...state.justifyTraineesAbsence,
          action.payload,
        ],
      };

    case ADD_JUSTIFY_TRAINEE_ABSENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_JUSTIFY_TRAINEE_ABSENCE_SUCCESS:
      return {
        ...state,
        justifyTraineesAbsence: state.justifyTraineesAbsence.map(
          justifyTraineeAbsence =>
            justifyTraineeAbsence.Id.toString() === action.payload.Id.toString()
              ? { justifyTraineeAbsence, ...action.payload }
              : justifyTraineeAbsence
        ),
      };

    case UPDATE_JUSTIFY_TRAINEE_ABSENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_JUSTIFY_TRAINEE_ABSENCE_SUCCESS:
      return {
        ...state,
        justifyTraineesAbsence: state.justifyTraineesAbsence.filter(
          justifyTraineeAbsence =>
            justifyTraineeAbsence.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_JUSTIFY_TRAINEE_ABSENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default justifyTraineesAbsence;
