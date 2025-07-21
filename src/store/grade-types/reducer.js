import {
  GET_GRADE_TYPES_SUCCESS,
  GET_GRADE_TYPES_FAIL,
  ADD_GRADE_TYPE_SUCCESS,
  ADD_GRADE_TYPE_FAIL,
  UPDATE_GRADE_TYPE_SUCCESS,
  UPDATE_GRADE_TYPE_FAIL,
  DELETE_GRADE_TYPE_SUCCESS,
  DELETE_GRADE_TYPE_FAIL,
  GET_GRADE_TYPE_DELETED_VALUE_SUCCESS,
  GET_GRADE_TYPE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  gradeTypes: [],
  deleted: {},
  error: {},
};

const gradeTypes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GRADE_TYPES_SUCCESS:
      return {
        ...state,
        gradeTypes: action.payload,
      };

    case GET_GRADE_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_GRADE_TYPE_SUCCESS:
      return {
        ...state,
        gradeTypes: [...state.gradeTypes, action.payload],
      };

    case ADD_GRADE_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GRADE_TYPE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_GRADE_TYPE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_GRADE_TYPE_SUCCESS:
      return {
        ...state,
        gradeTypes: state.gradeTypes.map(gradeType =>
          gradeType.Id.toString() === action.payload.Id.toString()
            ? { gradeType, ...action.payload }
            : gradeType
        ),
      };

    case UPDATE_GRADE_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_GRADE_TYPE_SUCCESS:
      return {
        ...state,
        gradeTypes: state.gradeTypes.filter(
          gradeType => gradeType.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_GRADE_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default gradeTypes;
