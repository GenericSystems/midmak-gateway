import {
  GET_HIGHSTUDYTYPES_SUCCESS,
  GET_HIGHSTUDYTYPES_FAIL,
  ADD_HIGHSTUDYTYPE_SUCCESS,
  ADD_HIGHSTUDYTYPE_FAIL,
  UPDATE_HIGHSTUDYTYPE_SUCCESS,
  UPDATE_HIGHSTUDYTYPE_FAIL,
  DELETE_HIGHSTUDYTYPE_SUCCESS,
  DELETE_HIGHSTUDYTYPE_FAIL,
  GET_HIGHSTUDYTYPE_DELETED_VALUE_SUCCESS,
  GET_HIGHSTUDYTYPE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  highstudytypes: [],
  deleted: {},
  error: {},
};

const highstudytypes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_HIGHSTUDYTYPES_SUCCESS:
      return {
        ...state,
        highstudytypes: action.payload,
      };

    case GET_HIGHSTUDYTYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_HIGHSTUDYTYPE_SUCCESS:
      return {
        ...state,
        highstudytypes: [...state.highstudytypes, action.payload],
      };

    case ADD_HIGHSTUDYTYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_HIGHSTUDYTYPE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case GET_HIGHSTUDYTYPE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_HIGHSTUDYTYPE_SUCCESS:
      return {
        ...state,
        highstudytypes: state.highstudytypes.map(highstudytype =>
          highstudytype.Id.toString() === action.payload.Id.toString()
            ? { highstudytype, ...action.payload }
            : highstudytype
        ),
      };

    case UPDATE_HIGHSTUDYTYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_HIGHSTUDYTYPE_SUCCESS:
      return {
        ...state,
        highstudytypes: state.highstudytypes.filter(
          highstudytype =>
            highstudytype.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_HIGHSTUDYTYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default highstudytypes;
