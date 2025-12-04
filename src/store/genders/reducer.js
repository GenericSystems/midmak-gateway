import {
  GET_GENDERS_SUCCESS,
  GET_GENDERS_FAIL,
  ADD_GENDER_SUCCESS,
  ADD_GENDER_FAIL,
  UPDATE_GENDER_SUCCESS,
  UPDATE_GENDER_FAIL,
  DELETE_GENDER_SUCCESS,
  DELETE_GENDER_FAIL,
  GET_GENDER_DELETED_VALUE_SUCCESS,
  GET_GENDER_DELETED_VALUE_FAIL,
} from "./actionTypes";
const INIT_STATE = {
  genders: [],
  deleted: {},
  error: {},
};
const genders = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GENDERS_SUCCESS:
      return {
        ...state,
        genders: action.payload,
      };
    case GET_GENDERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_GENDER_SUCCESS:
      return {
        ...state,
        genders: [...state.genders, action.payload],
      };
    case ADD_GENDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_GENDER_SUCCESS:
      return {
        ...state,
        genders: state.genders.map(gender =>
          gender.Id.toString() === action.payload.Id.toString()
            ? { gender, ...action.payload }
            : gender
        ),
      };
    case UPDATE_GENDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_GENDER_SUCCESS:
      return {
        ...state,
        genders: state.genders.filter(
          gender => gender.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_GENDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GENDER_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_GENDER_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default genders;
