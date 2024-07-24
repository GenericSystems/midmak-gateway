import {
  GET_ROLES_SUCCESS,
  GET_ROLES_FAIL,
  ADD_ROLE_SUCCESS,
  ADD_ROLE_FAIL,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAIL,
  GET_ROLE_DELETED_VALUE_SUCCESS,
  GET_ROLE_DELETED_VALUE_FAIL,
  GET_ROLE_PERMISSIONS_SUCCESS,
  GET_ROLE_PERMISSIONS_FAIL,
  ADD_ROLE_PERMISSION_SUCCESS,
  ADD_ROLE_PERMISSION_FAIL,
  UPDATE_ROLE_PERMISSION_SUCCESS,
  UPDATE_ROLE_PERMISSION_FAIL,
  DELETE_ROLE_PERMISSION_SUCCESS,
  DELETE_ROLE_PERMISSION_FAIL,
  GET_ROLE_PERMISSION_DELETED_VALUE_SUCCESS,
  GET_ROLE_PERMISSION_DELETED_VALUE_FAIL,
  ADD_ROLE_USER_SUCCESS,
  ADD_ROLE_USER_FAIL,
} from "./actionTypes";
const INIT_STATE = {
  roles: [],
  deleted: {},
  rolePermissions: [],
  error: {},
  roleUsers: [],
  deletedDetail: null,
};
const roles = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ROLES_SUCCESS:
      return {
        ...state,
        roles: action.payload,
      };
    case GET_ROLES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_ROLE_SUCCESS:
      return {
        ...state,
        roles: [...state.roles, action.payload],
      };
    case ADD_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        roles: state.roles.map(role =>
          role.Id.toString() === action.payload.Id.toString()
            ? { role, ...action.payload }
            : role
        ),
      };
    case UPDATE_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_ROLE_SUCCESS:
      return {
        ...state,
        roles: state.roles.filter(
          role => role.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_ROLE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ROLE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_ROLE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_ROLE_PERMISSIONS_SUCCESS:
      return {
        ...state,
        rolePermissions: action.payload,
      };
    case GET_ROLE_PERMISSIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_ROLE_PERMISSION_SUCCESS:
      return {
        ...state,
        rolePermissions: [...state.rolePermissions, action.payload],
      };
    case ADD_ROLE_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_ROLE_PERMISSION_SUCCESS:
      return {
        ...state,
        rolePermissions: state.rolePermissions.map(rolePermission =>
          rolePermission.Id === action.payload.Id
            ? { rolePermission, ...action.payload }
            : rolePermission
        ),
      };
    case UPDATE_ROLE_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_ROLE_PERMISSION_SUCCESS:
      return {
        ...state,
        rolePermissions: state.rolePermissions.filter(
          rolePermission =>
            rolePermission.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_ROLE_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ROLE_PERMISSION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_ROLE_PERMISSION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ROLE_USER_SUCCESS:
      return {
        ...state,
        roleUsers: [...state.roleUsers, action.payload],
      };
    case ADD_ROLE_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default roles;
