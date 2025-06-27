import {
  GET_TRAINING_FORMATS_SUCCESS,
  GET_TRAINING_FORMATS_FAIL,
  ADD_TRAINING_FORMAT_SUCCESS,
  ADD_TRAINING_FORMAT_FAIL,
  UPDATE_TRAINING_FORMAT_SUCCESS,
  UPDATE_TRAINING_FORMAT_FAIL,
  DELETE_TRAINING_FORMAT_SUCCESS,
  DELETE_TRAINING_FORMAT_FAIL,
  GET_TRAINING_FORMAT_DELETED_VALUE_SUCCESS,
  GET_TRAINING_FORMAT_DELETED_VALUE_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  trainingFormats: [],
  deleted: {},
  error: {},
}

const trainingFormats = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINING_FORMATS_SUCCESS:
      return {
        ...state,
        trainingFormats: action.payload,
      }

    case GET_TRAINING_FORMATS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_TRAINING_FORMAT_SUCCESS:
      return {
        ...state,
        trainingFormats: [...state.trainingFormats, action.payload],
      }

    case ADD_TRAINING_FORMAT_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_TRAINING_FORMAT_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      }

    case GET_TRAINING_FORMAT_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case UPDATE_TRAINING_FORMAT_SUCCESS:
      return {
        ...state,
        trainingFormats: state.trainingFormats.map(trainingFormat =>
          trainingFormat.Id.toString() === action.payload.Id.toString()
            ? { ...trainingFormat, ...action.payload }
            : trainingFormat
        ),
      }

    case UPDATE_TRAINING_FORMAT_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case DELETE_TRAINING_FORMAT_SUCCESS:
      return {
        ...state,
        trainingFormats: state.trainingFormats.filter(
          trainingFormat =>
            trainingFormat.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      }

    case DELETE_TRAINING_FORMAT_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default trainingFormats
