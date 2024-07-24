import {
  GET_GRANTS_SUCCESS,
  GET_GRANTS_FAIL,
  ADD_GRANT_SUCCESS,
  ADD_GRANT_FAIL,
  UPDATE_GRANT_SUCCESS,
  UPDATE_GRANT_FAIL,
  DELETE_GRANT_SUCCESS,
  DELETE_GRANT_FAIL,
  GET_GRANT_DELETED_VALUE_SUCCESS,
  GET_GRANT_DELETED_VALUE_FAIL,
} from "./actionTypes";
const INIT_STATE = {
  grants: [],
  deleted: {},
  error: {},
};
const grants = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_GRANTS_SUCCESS:
      return {
        ...state,
        grants: action.payload,
      };
    case GET_GRANTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_GRANT_SUCCESS:
      return {
        ...state,
        grants: [...state.grants, action.payload],
      };
    case ADD_GRANT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_GRANT_SUCCESS:
      return {
        ...state,
        grants: state.grants.map(grant =>
          grant.Id.toString() === action.payload.Id.toString()
            ? { grant, ...action.payload }
            : grant
        ),
      };
    case UPDATE_GRANT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_GRANT_SUCCESS:
      return {
        ...state,
        grants: state.grants.filter(
          grant => grant.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_GRANT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GRANT_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_GRANT_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default grants;
