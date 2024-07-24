import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_ROLES,
  ADD_NEW_ROLE,
  DELETE_ROLE,
  UPDATE_ROLE,
  GET_ROLE_DELETED_VALUE,
  GET_ROLE_PERMISSIONS,
  ADD_NEW_ROLE_PERMISSION,
  UPDATE_ROLE_PERMISSION,
  DELETE_ROLE_PERMISSION,
  GET_ROLE_PERMISSION_DELETED_VALUE,
  ADD_NEW_ROLE_USER,
} from "./actionTypes";
import {
  getRolesSuccess,
  getRolesFail,
  addRoleFail,
  addRoleSuccess,
  updateRoleSuccess,
  updateRoleFail,
  deleteRoleSuccess,
  deleteRoleFail,
  getRoleDeletedValueSuccess,
  getRoleDeletedValueFail,
  getRolePermissionsSuccess,
  getRolePermissionsFail,
  addRolePermissionSuccess,
  addRolePermissionFail,
  updateRolePermissionSuccess,
  updateRolePermissionFail,
  deleteRolePermissionSuccess,
  deleteRolePermissionFail,
  getRolePermissionDeletedValueSuccess,
  getRolePermissionDeletedValueFail,
  addRoleUserSuccess,
  addRoleUserFail,
} from "./actions";
import {
  getRoles,
  addNewRole,
  updateRole,
  deleteRole,
  getRoleDeletedValue,
  getRolePermissions,
  addNewRolePermission,
  updateRolePermission,
  deleteRolePermission,
  getRolePermissionDeletedValue,
  addNewRoleUser,
} from "../../helpers/fakebackend_helper";

function* fetchRoles() {
  const get_roles_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Roles",
  };
  try {
    const response = yield call(getRoles, get_roles_req);
    response.map(resp => {
      resp["roleUsers"] = JSON.parse(resp["roleUsers"]);
    });
    yield put(getRolesSuccess(response));
  } catch (error) {
    yield put(getRolesFail(error));
  }
}

function* onAddNewRole({ payload, role }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Roles";
  try {
    const response = yield call(addNewRole, payload);
    yield put(addRoleSuccess(response[0]));
  } catch (error) {
    yield put(addRoleFail(error));
  }
}

function* onUpdateRole({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Roles";
  try {
    const respupdate = yield call(updateRole, payload);
    yield put(updateRoleSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateRoleFail(error));
  }
}
function* onDeleteRole({ payload, Role }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Roles";
  try {
    const respdelete = yield call(deleteRole, payload);
    yield put(deleteRoleSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteRoleFail(error));
  }
}
function* onGetRoleDeletedValue() {
  try {
    const response = yield call(getRoleDeletedValue);
    yield put(getRoleDeletedValueSuccess(response));
  } catch (error) {
    yield put(getRoleDeletedValueFail(error));
  }
}
function* fetchRolePermissions(obj) {
  let rolePermission = obj.payload;
  let filteredObj;

  if (rolePermission.itemId == null) {
    filteredObj = `mi.menuId = ${rolePermission.menuId} and (roleId = ${rolePermission.roleId}  or roleId is null) and mi.itemId is NULL and mi.to is not null`;
  } else {
    filteredObj = `mi.menuId = ${rolePermission.menuId} and (roleId = ${rolePermission.roleId}  or roleId is null) and mi.itemId = ${rolePermission.itemId}`;
  }

  const get_roles_req = {
    source: "db",
    procedure: "Roles_getRolePermissions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    filter: filteredObj,
    roleId: `${rolePermission.roleId}`

  };
  try {
    const response = yield call(getRolePermissions, get_roles_req);
    yield put(getRolePermissionsSuccess(response));
  } catch (error) {
    yield put(getRolePermissionsFail(error));
  }
}

function* onAddNewRolePermission({ payload, role }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "updateRolePermissions";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_RolesPermissions";
  try {
    const response = yield call(addNewRolePermission, payload);
    yield put(addRolePermissionSuccess(response[0]));
  } catch (error) {
    yield put(addRolePermissionFail(error));
  }
}

function* onUpdateRolePermission({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "Roles_updateRolePermissions";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_RolesPermissions";
  try {
    const respupdate = yield call(updateRolePermission, payload);
    yield put(updateRolePermissionSuccess(respupdate[0]));
    if (!payload.Id && !payload.menuItemId) {
      let obj = { payload: { menuId: payload.menuId, roleId: payload.roleId } };
      yield fetchRolePermissions(obj);
    } else if (!payload.Id && payload.menuItemId) {
      let obj = {
        payload: {
          menuId: payload.menuId,
          roleId: payload.roleId,
          itemId: payload.menuItemId,
        },
      };
      yield fetchRolePermissions(obj);
    }
  } catch (error) {
    yield put(updateRolePermissionFail(error));
  }
}
function* onDeleteRolePermission({ payload, RolePermission }) {

  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_RolesPermissions";
  try {
    const respdelete = yield call(deleteRolePermission, payload);
    yield put(deleteRolePermissionSuccess(respdelete[0]));
    if (!payload.Id && !payload.menuItemId) {
      let obj = { payload: { menuId: payload.menuId, roleId: payload.roleId } };
      yield fetchRolePermissions(obj);
    } else if (!payload.Id && payload.menuItemId) {
      let obj = {
        payload: {
          menuId: payload.menuId,
          roleId: payload.roleId,
          itemId: payload.menuItemId,
        },
      };
      yield fetchRolePermissions(obj);
    }
  } catch (error) {
    yield put(deleteRolePermissionFail(error));
  }
}

function* onGetRolePermissionDeletedValue() {
  try {
    const response = yield call(getRolePermissionDeletedValue);
    yield put(getRolePermissionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getRolePermissionDeletedValueFail(error));
  }
}

function* onAddNewRoleUser({ payload, role }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addMultiSelect";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_RoleUsers";
  payload["filter"] = `roleId = ${payload.roleId}`;
  payload["field"] = "userId,roleId";
  try {
    const response = yield call(addNewRoleUser, payload);
    yield put(addRoleUserSuccess(response[0]));
    yield fetchRoles();
  } catch (error) {
    yield put(addRoleUserFail(error));
  }
}

function* rolesSaga() {
  yield takeEvery(GET_ROLES, fetchRoles);
  yield takeEvery(ADD_NEW_ROLE, onAddNewRole);
  yield takeEvery(UPDATE_ROLE, onUpdateRole);
  yield takeEvery(DELETE_ROLE, onDeleteRole);
  yield takeEvery(GET_ROLE_DELETED_VALUE, onGetRoleDeletedValue);
  yield takeEvery(GET_ROLE_PERMISSIONS, fetchRolePermissions);
  yield takeEvery(ADD_NEW_ROLE_PERMISSION, onAddNewRolePermission);
  yield takeEvery(UPDATE_ROLE_PERMISSION, onUpdateRolePermission);
  yield takeEvery(DELETE_ROLE_PERMISSION, onDeleteRolePermission);
  yield takeEvery(
    GET_ROLE_PERMISSION_DELETED_VALUE,
    onGetRolePermissionDeletedValue
  );
  yield takeEvery(ADD_NEW_ROLE_USER, onAddNewRoleUser);
}
export default rolesSaga;
