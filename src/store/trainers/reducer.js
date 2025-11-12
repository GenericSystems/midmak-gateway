import {
  GET_TRAINERS_SUCCESS,
  GET_TRAINERS_FAIL,
  ADD_TRAINER_SUCCESS,
  ADD_TRAINER_FAIL,
  UPDATE_TRAINER_SUCCESS,
  UPDATE_TRAINER_FAIL,
  DELETE_TRAINER_SUCCESS,
  DELETE_TRAINER_FAIL,
  GET_TRAINER_DELETED_VALUE_SUCCESS,
  GET_TRAINER_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  trainers: [],
  deleted: {},
  error: {},
};

const trainers = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINERS_SUCCESS:
      return {
        ...state,
        trainers: action.payload,
        deleted: {},
      };

    case GET_TRAINERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TRAINER_SUCCESS:
      return {
        ...state,
        trainers: [...state.trainers, action.payload],
      };

    case ADD_TRAINER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINER_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_TRAINER_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TRAINER_SUCCESS:
      return {
        ...state,
        trainers: state.trainers.map(trainer =>
          trainer.Id.toString() === action.payload.Id.toString()
            ? { trainer, ...action.payload }
            : trainer
        ),
      };

    case UPDATE_TRAINER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TRAINER_SUCCESS:
      return {
        ...state,
        trainers: state.trainers.filter(
          trainer => trainer.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TRAINER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default trainers;
