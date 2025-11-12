import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_LECTURE_PERMISSIONS,
  ADD_NEW_LECTURE_PERMISSION,
  DELETE_LECTURE_PERMISSION,
  UPDATE_LECTURE_PERMISSION,
  GET_LECTURE_PERMISSION_DELETED_VALUE,
  // GET_LECTURE_PERMISSION_PERMISSIONS,
  // ADD_NEW_LECTURE_PERMISSION_PERMISSION,
  // UPDATE_LECTURE_PERMISSION_PERMISSION,
  // DELETE_LECTURE_PERMISSION_PERMISSION,
  // GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE,
  ADD_NEW_LECTURE_PERMISSION_USER,
} from "./actionTypes";
import {
  getLecturePermissionsSuccess,
  getLecturePermissionsFail,
  addLecturePermissionFail,
  addLecturePermissionSuccess,
  updateLecturePermissionSuccess,
  updateLecturePermissionFail,
  deleteLecturePermissionSuccess,
  deleteLecturePermissionFail,
  getLecturePermissionDeletedValueSuccess,
  getLecturePermissionDeletedValueFail,
  // getLecturePermissionPermissionsSuccess,
  // getLecturePermissionPermissionsFail,
  // addLecturePermissionPermissionSuccess,
  // addLecturePermissionPermissionFail,
  // updateLecturePermissionPermissionSuccess,
  // updateLecturePermissionPermissionFail,
  // deleteLecturePermissionPermissionSuccess,
  // deleteLecturePermissionPermissionFail,
  // getLecturePermissionPermissionDeletedValueSuccess,
  // getLecturePermissionPermissionDeletedValueFail,
  addLecturePermissionUserSuccess,
  addLecturePermissionUserFail,
} from "./actions";
import {
  getLecturePermissions,
  addNewLecturePermission,
  updateLecturePermission,
  deleteLecturePermission,
  getLecturePermissionDeletedValue,
  getLecturePermissionPermissions,
  addNewLecturePermissionPermission,
  updateLecturePermissionPermission,
  deleteLecturePermissionPermission,
  getLecturePermissionPermissionDeletedValue,
  addNewLecturePermissionUser,
} from "../../helpers/fakebackend_helper";

function* fetchLecturePermissions() {
  const get_lecturePermissions_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Roles",
  };
  try {
    const response = yield call(
      getLecturePermissions,
      get_lecturePermissions_req
    );
    response.map(resp => {
      resp["roleUsers"] = JSON.parse(resp["roleUsers"]);
    });
    yield put(getLecturePermissionsSuccess(response));
  } catch (error) {
    yield put(getLecturePermissionsFail(error));
  }
}

function* onAddNewLecturePermission({ payload, lecturePermission }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_LecturePermissions";
  try {
    const response = yield call(addNewLecturePermission, payload);
    yield put(addLecturePermissionSuccess(response[0]));
  } catch (error) {
    yield put(addLecturePermissionFail(error));
  }
}

function* onUpdateLecturePermission({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_LecturePermissions";
  try {
    const respupdate = yield call(updateLecturePermission, payload);
    yield put(updateLecturePermissionSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateLecturePermissionFail(error));
  }
}
function* onDeleteLecturePermission({ payload, LecturePermission }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_LecturePermissions";
  try {
    const respdelete = yield call(deleteLecturePermission, payload);
    yield put(deleteLecturePermissionSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteLecturePermissionFail(error));
  }
}
function* onGetLecturePermissionDeletedValue() {
  try {
    const response = yield call(getLecturePermissionDeletedValue);
    yield put(getLecturePermissionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getLecturePermissionDeletedValueFail(error));
  }
}
// function* fetchLecturePermissionPermissions(obj) {
//   let lecturePermissionPermission = obj.payload;
//   let filteredObj;

//   if (lecturePermissionPermission.itemId == null) {
//     filteredObj = `mi.menuId = ${lecturePermissionPermission.menuId} and (lecturePermissionId = ${lecturePermissionPermission.lecturePermissionId}  or lecturePermissionId is null) and mi.itemId is NULL and mi.to is not null`;
//   } else {
//     filteredObj = `mi.menuId = ${lecturePermissionPermission.menuId} and (lecturePermissionId = ${lecturePermissionPermission.lecturePermissionId}  or lecturePermissionId is null) and mi.itemId = ${lecturePermissionPermission.itemId}`;
//   }

//   const get_lecturePermissions_req = {
//     source: "db",
//     procedure: "LecturePermissions_getLecturePermissionPermissions",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     filter: filteredObj,
//     lecturePermissionId: `${lecturePermissionPermission.lecturePermissionId}`,
//   };
//   try {
//     const response = yield call(
//       getLecturePermissionPermissions,
//       get_lecturePermissions_req
//     );
//     yield put(getLecturePermissionPermissionsSuccess(response));
//   } catch (error) {
//     yield put(getLecturePermissionPermissionsFail(error));
//   }
// }

// function* onAddNewLecturePermissionPermission({ payload, lecturePermission }) {
//   delete payload["id"];
//   payload["source"] = "db";
//   payload["procedure"] = "updateLecturePermissionPermissions";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "Common_LecturePermissionsPermissions";
//   try {
//     const response = yield call(addNewLecturePermissionPermission, payload);
//     yield put(addLecturePermissionPermissionSuccess(response[0]));
//   } catch (error) {
//     yield put(addLecturePermissionPermissionFail(error));
//   }
// }

// function* onUpdateLecturePermissionPermission({ payload }) {
//   payload["source"] = "db";
//   payload["procedure"] =
//     "LecturePermissions_updateLecturePermissionPermissions";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "Common_LecturePermissionsPermissions";
//   try {
//     const respupdate = yield call(updateLecturePermissionPermission, payload);
//     yield put(updateLecturePermissionPermissionSuccess(respupdate[0]));
//     if (!payload.Id && !payload.menuItemId) {
//       let obj = {
//         payload: {
//           menuId: payload.menuId,
//           lecturePermissionId: payload.lecturePermissionId,
//         },
//       };
//       yield fetchLecturePermissionPermissions(obj);
//     } else if (!payload.Id && payload.menuItemId) {
//       let obj = {
//         payload: {
//           menuId: payload.menuId,
//           lecturePermissionId: payload.lecturePermissionId,
//           itemId: payload.menuItemId,
//         },
//       };
//       yield fetchLecturePermissionPermissions(obj);
//     }
//   } catch (error) {
//     yield put(updateLecturePermissionPermissionFail(error));
//   }
// }
// function* onDeleteLecturePermissionPermission({
//   payload,
//   LecturePermissionPermission,
// }) {
//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_removeData";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "Common_LecturePermissionsPermissions";
//   try {
//     const respdelete = yield call(deleteLecturePermissionPermission, payload);
//     yield put(deleteLecturePermissionPermissionSuccess(respdelete[0]));
//     if (!payload.Id && !payload.menuItemId) {
//       let obj = {
//         payload: {
//           menuId: payload.menuId,
//           lecturePermissionId: payload.lecturePermissionId,
//         },
//       };
//       yield fetchLecturePermissionPermissions(obj);
//     } else if (!payload.Id && payload.menuItemId) {
//       let obj = {
//         payload: {
//           menuId: payload.menuId,
//           lecturePermissionId: payload.lecturePermissionId,
//           itemId: payload.menuItemId,
//         },
//       };
//       yield fetchLecturePermissionPermissions(obj);
//     }
//   } catch (error) {
//     yield put(deleteLecturePermissionPermissionFail(error));
//   }
// }

// function* onGetLecturePermissionPermissionDeletedValue() {
//   try {
//     const response = yield call(getLecturePermissionPermissionDeletedValue);
//     yield put(getLecturePermissionPermissionDeletedValueSuccess(response));
//   } catch (error) {
//     yield put(getLecturePermissionPermissionDeletedValueFail(error));
//   }
// }

function* onAddNewLecturePermissionUser({ payload, lecturePermission }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addMultiSelect";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_LecturePermissionUsers";
  payload["filter"] = `lecturePermissionId = ${payload.lecturePermissionId}`;
  payload["field"] = "userId,lecturePermissionId";
  try {
    const response = yield call(addNewLecturePermissionUser, payload);
    yield put(addLecturePermissionUserSuccess(response[0]));
    yield fetchLecturePermissions();
  } catch (error) {
    yield put(addLecturePermissionUserFail(error));
  }
}

function* lecturePermissionsSaga() {
  yield takeEvery(GET_LECTURE_PERMISSIONS, fetchLecturePermissions);
  yield takeEvery(ADD_NEW_LECTURE_PERMISSION, onAddNewLecturePermission);
  yield takeEvery(UPDATE_LECTURE_PERMISSION, onUpdateLecturePermission);
  yield takeEvery(DELETE_LECTURE_PERMISSION, onDeleteLecturePermission);
  yield takeEvery(
    GET_LECTURE_PERMISSION_DELETED_VALUE,
    onGetLecturePermissionDeletedValue
  );
  // yield takeEvery(
  //   GET_LECTURE_PERMISSION_PERMISSIONS,
  //   fetchLecturePermissionPermissions
  // );
  // yield takeEvery(
  //   ADD_NEW_LECTURE_PERMISSION_PERMISSION,
  //   onAddNewLecturePermissionPermission
  // );
  // yield takeEvery(
  //   UPDATE_LECTURE_PERMISSION_PERMISSION,
  //   onUpdateLecturePermissionPermission
  // );
  // yield takeEvery(
  //   DELETE_LECTURE_PERMISSION_PERMISSION,
  //   onDeleteLecturePermissionPermission
  // );
  // yield takeEvery(
  //   GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE,
  //   onGetLecturePermissionPermissionDeletedValue
  // );
  yield takeEvery(
    ADD_NEW_LECTURE_PERMISSION_USER,
    onAddNewLecturePermissionUser
  );
}
export default lecturePermissionsSaga;
