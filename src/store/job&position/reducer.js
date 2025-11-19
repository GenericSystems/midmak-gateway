import {
  GET_POSITIONS_SUCCESS,
  GET_POSITIONS_FAIL,
  GET_POSITION_TYPES_SUCCESS,
  GET_POSITION_TYPES_FAIL,
  GET_POSITIONS_OPT_SUCCESS,
  GET_POSITIONS_OPT_FAIL,
  ADD_POSITION_SUCCESS,
  ADD_POSITION_FAIL,
  UPDATE_POSITION_SUCCESS,
  UPDATE_POSITION_FAIL,
  GET_POSITION_DELETED_VALUE_SUCCESS,
  GET_POSITION_DELETED_VALUE_FAIL,
  DELETE_POSITION_SUCCESS,
  DELETE_POSITION_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  positions: [],
  positionTypes: [],
  positionsOpt: [],
  deleted: {},
  error: {},
};

const positions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_POSITIONS_SUCCESS:
      return {
        ...state,
        positions: action.payload,
        deleted: {},
      };

    case GET_POSITIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_POSITION_SUCCESS:
      return {
        ...state,
        positions: [...state.positions, action.payload],
      };

    case ADD_POSITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_POSITION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_POSITION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_POSITION_SUCCESS:
      return {
        ...state,
        positions: state.positions.map(position =>
          position.Id.toString() === action.payload.Id.toString()
            ? { position, ...action.payload }
            : position
        ),
      };

    case UPDATE_POSITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_POSITION_SUCCESS:
      return {
        ...state,
        positions: state.positions.filter(
          position => position.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_POSITION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_POSITION_TYPES_SUCCESS:
      return {
        ...state,
        positionTypes: action.payload,
        deleted: {},
      };

    case GET_POSITION_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_POSITIONS_OPT_SUCCESS:
      return {
        ...state,
        positionsOpt: action.payload,
        deleted: {},
      };

    case GET_POSITIONS_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default positions;
