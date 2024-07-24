import {
  GET_USER_MNGS_SUCCESS,
  GET_USER_MNGS_FAIL,
  ADD_USER_MNG_SUCCESS,
  ADD_USER_MNG_FAIL,
  UPDATE_USER_MNG_SUCCESS,
  UPDATE_USER_MNG_FAIL,
  DELETE_USER_MNG_SUCCESS,
  DELETE_USER_MNG_FAIL,
  GET_USER_MNG_DELETED_VALUE_SUCCESS,
  GET_USER_MNG_DELETED_VALUE_FAIL,
  GET_USER_FACULTIES_SUCCESS,
  GET_USER_FACULTIES_FAIL,
  ADD_USER_FACULTY_SUCCESS,
  ADD_USER_FACULTY_FAIL,
  DELETE_USER_FACULTY_SUCCESS,
  DELETE_USER_FACULTY_FAIL,
  GET_USER_FACULTY_DELETED_VALUE_SUCCESS,
  GET_USER_FACULTY_DELETED_VALUE_FAIL,
  ADD_USER_ROLE_SUCCESS,
  ADD_USER_ROLE_FAIL,
} from "./actionTypes";
const INIT_STATE = {
  userMngs: [],
  deleted: {},
  error: {},
  userFaculties: [],
  userRoles:[],
  deletedDetail:null,
};
const userMngs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USER_MNGS_SUCCESS:
      return {
        ...state,
        userMngs: action.payload,
      };
    case GET_USER_MNGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_USER_MNG_SUCCESS:
      return {
        ...state,
        userMngs: [...state.userMngs, action.payload],
      };
    case ADD_USER_MNG_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_USER_MNG_SUCCESS:
      return {
        ...state,
        userMngs: state.userMngs.map(userMng =>
          userMng.Id.toString() === action.payload.Id.toString()
            ? { userMng, ...action.payload }
            : userMng
        ),
      };
    case UPDATE_USER_MNG_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_USER_MNG_SUCCESS:
      return {
        ...state,
        userMngs: state.userMngs.filter(
          userMng => userMng.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_USER_MNG_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_USER_MNG_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_USER_MNG_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_USER_FACULTIES_SUCCESS:
      return {
        ...state,
        userFaculties: action.payload,
      };
    case GET_USER_FACULTIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_USER_FACULTY_SUCCESS:
      return {
        ...state,
        userFaculties:  action.payload,
      };
    case ADD_USER_FACULTY_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_USER_FACULTY_SUCCESS:
      return {
        ...state,
        userFaculties: state.userFaculties.filter(
          userMng => userMng.Id.toString() !== action.payload.Id.toString()
        ),
        deletedDetail: action.payload.deleted,
      };

    case DELETE_USER_FACULTY_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_USER_FACULTY_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deletedDetail: action.payload.deleted,
      };
    case GET_USER_FACULTY_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case ADD_USER_ROLE_SUCCESS:
        return {
          ...state,
          userRoles: [...state.userRoles, action.payload],
        };
      case ADD_USER_ROLE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    default:
      return state;
  }
};
export default userMngs;
