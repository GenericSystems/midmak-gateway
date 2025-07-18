import {
  GET_DIPLOMALEVELS_SUCCESS,
  GET_DIPLOMALEVELS_FAIL,
  ADD_DIPLOMALEVEL_SUCCESS,
  ADD_DIPLOMALEVEL_FAIL,
  UPDATE_DIPLOMALEVEL_SUCCESS,
  UPDATE_DIPLOMALEVEL_FAIL,
  DELETE_DIPLOMALEVEL_SUCCESS,
  DELETE_DIPLOMALEVEL_FAIL,
  GET_DIPLOMALEVEL_DELETED_VALUE_SUCCESS,
  GET_DIPLOMALEVEL_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  diplomalevels: [],
  deleted: {},
  error: {},
};

const diplomalevels = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DIPLOMALEVELS_SUCCESS:
      return {
        ...state,
        diplomalevels: action.payload,
      };

    case GET_DIPLOMALEVELS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DIPLOMALEVEL_SUCCESS:
      return {
        ...state,
        diplomalevels: [...state.diplomalevels, action.payload],
      };

    case ADD_DIPLOMALEVEL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DIPLOMALEVEL_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case GET_DIPLOMALEVEL_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DIPLOMALEVEL_SUCCESS:
      return {
        ...state,
        diplomalevels: state.diplomalevels.map(diplomalevel =>
          diplomalevel.Id.toString() === action.payload.Id.toString()
            ? { ...diplomalevel, ...action.payload }
            : diplomalevel
        ),
      };

    case UPDATE_DIPLOMALEVEL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DIPLOMALEVEL_SUCCESS:
      return {
        ...state,
        diplomalevels: state.diplomalevels.filter(
          diplomalevel =>
            diplomalevel.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DIPLOMALEVEL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default diplomalevels;
