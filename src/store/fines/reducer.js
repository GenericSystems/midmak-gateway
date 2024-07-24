import {
  GET_FINES_SUCCESS,
  GET_FINES_FAIL,
  ADD_FINE_SUCCESS,
  ADD_FINE_FAIL,
  UPDATE_FINE_SUCCESS,
  UPDATE_FINE_FAIL,
  DELETE_FINE_SUCCESS,
  DELETE_FINE_FAIL,
  GET_FINE_DELETED_VALUE_SUCCESS,
  GET_FINE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  fines: [],
  deleted: {},
  error: {},
};

const fines = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FINES_SUCCESS:
      return {
        ...state,
        fines: action.payload,
      };

    case GET_FINES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_FINE_SUCCESS:
      return {
        ...state,
        fines: [...state.fines, action.payload],
      };

    case ADD_FINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FINE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case UPDATE_FINE_SUCCESS:
      return {
        ...state,
        fines: state.fines.map(fine =>
          fine.Id.toString() === action.payload.Id.toString()
            ? { fine, ...action.payload }
            : fine
        ),
      };

    case UPDATE_FINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_FINE_SUCCESS:
      return {
        ...state,
        fines: state.fines.filter(
          fine => fine.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_FINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FINE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default fines;
