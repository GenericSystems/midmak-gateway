import {
  GET_ROLES,
  GET_ROLES_SUCCESS,
  GET_ROLES_FAIL,
  ADD_NEW_ROLE,
  ADD_ROLE_SUCCESS,
  ADD_ROLE_FAIL,
  UPDATE_ROLE,
  UPDATE_ROLE_SUCCESS,
  UPDATE_ROLE_FAIL,
  DELETE_ROLE,
  DELETE_ROLE_SUCCESS,
  DELETE_ROLE_FAIL,
  GET_ROLE_DELETED_VALUE,
  GET_ROLE_DELETED_VALUE_FAIL,
  GET_ROLE_DELETED_VALUE_SUCCESS,
  GET_ROLE_PERMISSIONS,
  GET_ROLE_PERMISSIONS_SUCCESS,
  GET_ROLE_PERMISSIONS_FAIL,
  ADD_NEW_ROLE_PERMISSION,
  ADD_ROLE_PERMISSION_SUCCESS,
  ADD_ROLE_PERMISSION_FAIL,
  UPDATE_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION_SUCCESS,
  UPDATE_ROLE_PERMISSION_FAIL,
  DELETE_ROLE_PERMISSION,
  DELETE_ROLE_PERMISSION_SUCCESS,
  DELETE_ROLE_PERMISSION_FAIL,
  GET_ROLE_PERMISSION_DELETED_VALUE,
  GET_ROLE_PERMISSION_DELETED_VALUE_SUCCESS,
  GET_ROLE_PERMISSION_DELETED_VALUE_FAIL,
  ADD_NEW_ROLE_USER,
  ADD_ROLE_USER_SUCCESS,
  ADD_ROLE_USER_FAIL,
} from "./actionTypes";
export const getRoles = () => ({
  type: GET_ROLES,
});

export const getRolesSuccess = roles => ({
  type: GET_ROLES_SUCCESS,
  payload: roles,
});

export const getRolesFail = error => ({
  type: GET_ROLES_FAIL,
  payload: error,
});
export const addNewRole = role => ({
  type: ADD_NEW_ROLE,
  payload: role,
});
export const addRoleSuccess = role => ({
  type: ADD_ROLE_SUCCESS,
  payload: role,
});

export const addRoleFail = error => ({
  type: ADD_ROLE_FAIL,
  payload: error,
});
export const updateRole = role => {
  return {
    type: UPDATE_ROLE,
    payload: role,
  };
};

export const updateRoleSuccess = role => ({
  type: UPDATE_ROLE_SUCCESS,
  payload: role,
});

export const updateRoleFail = error => ({
  type: UPDATE_ROLE_FAIL,
  payload: error,
});
export const deleteRole = role => ({
  type: DELETE_ROLE,
  payload: role,
});
export const deleteRoleSuccess = role => ({
  type: DELETE_ROLE_SUCCESS,
  payload: role,
});
export const deleteRoleFail = error => ({
  type: DELETE_ROLE_FAIL,
  payload: error,
});

export const getRoleDeletedValue = () => ({
  type: GET_ROLE_DELETED_VALUE,
});

export const getRoleDeletedValueSuccess = deleted => ({
  type: GET_ROLE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getRoleDeletedValueFail = error => ({
  type: GET_ROLE_DELETED_VALUE_FAIL,
  payload: error,
});

export const getRolePermissions = rolePermission => ({
  type: GET_ROLE_PERMISSIONS,
  payload: rolePermission,
});

export const getRolePermissionsSuccess = roles => ({
  type: GET_ROLE_PERMISSIONS_SUCCESS,
  payload: roles,
});

export const getRolePermissionsFail = error => ({
  type: GET_ROLE_PERMISSIONS_FAIL,
  payload: error,
});
export const addNewRolePermission = role => ({
  type: ADD_NEW_ROLE_PERMISSION,
  payload: role,
});
export const addRolePermissionSuccess = role => ({
  type: ADD_ROLE_PERMISSION_SUCCESS,
  payload: role,
});

export const addRolePermissionFail = error => ({
  type: ADD_ROLE_PERMISSION_FAIL,
  payload: error,
});
export const updateRolePermission = role => {
  return {
    type: UPDATE_ROLE_PERMISSION,
    payload: role,
  };
};

export const updateRolePermissionSuccess = role => ({
  type: UPDATE_ROLE_PERMISSION_SUCCESS,
  payload: role,
});

export const updateRolePermissionFail = error => ({
  type: UPDATE_ROLE_PERMISSION_FAIL,
  payload: error,
});
export const deleteRolePermission = role => ({
  type: DELETE_ROLE_PERMISSION,
  payload: role,
});
export const deleteRolePermissionSuccess = role => ({
  type: DELETE_ROLE_PERMISSION_SUCCESS,
  payload: role,
});
export const deleteRolePermissionFail = error => ({
  type: DELETE_ROLE_PERMISSION_FAIL,
  payload: error,
});

export const getRolePermissionDeletedValue = () => ({
  type: GET_ROLE_PERMISSION_DELETED_VALUE,
});

export const getRolePermissionDeletedValueSuccess = deleted => ({
  type: GET_ROLE_PERMISSION_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getRolePermissionDeletedValueFail = error => ({
  type: GET_ROLE_PERMISSION_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewRoleUser = role => ({
  type: ADD_NEW_ROLE_USER,
  payload: role,
});
export const addRoleUserSuccess = role => ({
  type: ADD_ROLE_USER_SUCCESS,
  payload: role,
});

export const addRoleUserFail = error => ({
  type: ADD_ROLE_USER_FAIL,
  payload: error,
});
