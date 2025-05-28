import {
  GET_USER_TYPES_SUCCESS,
  GET_USER_TYPES_FAIL,
  GET_USER_TYPES_OPT_SUCCESS,
  GET_USER_TYPES_OPT_FAIL,
  ADD_USER_TYPE_SUCCESS,
  ADD_USER_TYPE_FAIL,
  UPDATE_USER_TYPE_SUCCESS,
  UPDATE_USER_TYPE_FAIL,
  DELETE_USER_TYPE_SUCCESS,
  DELETE_USER_TYPE_FAIL,
  GET_USER_TYPE_DELETED_VALUE_SUCCESS,
  GET_USER_TYPE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  userTypes: [],
  userTypesOpt: [],
  deleted: {},
  error: {},
};

const userTypes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USER_TYPES_SUCCESS:
      return {
        ...state,
        userTypes: action.payload,
      };

    case GET_USER_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_USER_TYPES_OPT_SUCCESS:
      return {
        ...state,
        userTypesOpt: action.payload,
      };

    case GET_USER_TYPES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_USER_TYPE_SUCCESS:
      return {
        ...state,
        userTypes: [...state.userTypes, action.payload],
      };

    case ADD_USER_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_USER_TYPE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_USER_TYPE_SUCCESS:
      return {
        ...state,
        userTypes: state.userTypes.map(userType =>
          userType.Id.toString() === action.payload.Id.toString()
            ? { userType, ...action.payload }
            : userType
        ),
      };

    case UPDATE_USER_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_USER_TYPE_SUCCESS:
      return {
        ...state,
        userTypes: state.userTypes.filter(
          userType => userType.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_USER_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_USER_TYPE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userTypes;
