import {
  GET_LECTURE_PERMISSIONS,
  GET_LECTURE_PERMISSIONS_SUCCESS,
  GET_LECTURE_PERMISSIONS_FAIL,
  ADD_NEW_LECTURE_PERMISSION,
  ADD_LECTURE_PERMISSION_SUCCESS,
  ADD_LECTURE_PERMISSION_FAIL,
  UPDATE_LECTURE_PERMISSION,
  UPDATE_LECTURE_PERMISSION_SUCCESS,
  UPDATE_LECTURE_PERMISSION_FAIL,
  DELETE_LECTURE_PERMISSION,
  DELETE_LECTURE_PERMISSION_SUCCESS,
  DELETE_LECTURE_PERMISSION_FAIL,
  GET_LECTURE_PERMISSION_DELETED_VALUE,
  GET_LECTURE_PERMISSION_DELETED_VALUE_FAIL,
  GET_LECTURE_PERMISSION_DELETED_VALUE_SUCCESS,
  // GET_LECTURE_PERMISSION_PERMISSIONS,
  // GET_LECTURE_PERMISSION_PERMISSIONS_SUCCESS,
  // GET_LECTURE_PERMISSION_PERMISSIONS_FAIL,
  // ADD_NEW_LECTURE_PERMISSION_PERMISSION,
  // ADD_LECTURE_PERMISSION_PERMISSION_SUCCESS,
  // ADD_LECTURE_PERMISSION_PERMISSION_FAIL,
  // UPDATE_LECTURE_PERMISSION_PERMISSION,
  // UPDATE_LECTURE_PERMISSION_PERMISSION_SUCCESS,
  // UPDATE_LECTURE_PERMISSION_PERMISSION_FAIL,
  // DELETE_LECTURE_PERMISSION_PERMISSION,
  // DELETE_LECTURE_PERMISSION_PERMISSION_SUCCESS,
  // DELETE_LECTURE_PERMISSION_PERMISSION_FAIL,
  // GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE,
  // GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE_SUCCESS,
  // GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE_FAIL,
  ADD_NEW_LECTURE_PERMISSION_USER,
  ADD_LECTURE_PERMISSION_USER_SUCCESS,
  ADD_LECTURE_PERMISSION_USER_FAIL,
} from "./actionTypes";

export const getLecturePermissions = () => ({
  type: GET_LECTURE_PERMISSIONS,
});

export const getLecturePermissionsSuccess = lecturePermissions => ({
  type: GET_LECTURE_PERMISSIONS_SUCCESS,
  payload: lecturePermissions,
});

export const getLecturePermissionsFail = error => ({
  type: GET_LECTURE_PERMISSIONS_FAIL,
  payload: error,
});
export const addNewLecturePermission = lecturePermission => ({
  type: ADD_NEW_LECTURE_PERMISSION,
  payload: lecturePermission,
});
export const addLecturePermissionSuccess = lecturePermission => ({
  type: ADD_LECTURE_PERMISSION_SUCCESS,
  payload: lecturePermission,
});

export const addLecturePermissionFail = error => ({
  type: ADD_LECTURE_PERMISSION_FAIL,
  payload: error,
});
export const updateLecturePermission = lecturePermission => {
  return {
    type: UPDATE_LECTURE_PERMISSION,
    payload: lecturePermission,
  };
};

export const updateLecturePermissionSuccess = lecturePermission => ({
  type: UPDATE_LECTURE_PERMISSION_SUCCESS,
  payload: lecturePermission,
});

export const updateLecturePermissionFail = error => ({
  type: UPDATE_LECTURE_PERMISSION_FAIL,
  payload: error,
});
export const deleteLecturePermission = lecturePermission => ({
  type: DELETE_LECTURE_PERMISSION,
  payload: lecturePermission,
});
export const deleteLecturePermissionSuccess = lecturePermission => ({
  type: DELETE_LECTURE_PERMISSION_SUCCESS,
  payload: lecturePermission,
});
export const deleteLecturePermissionFail = error => ({
  type: DELETE_LECTURE_PERMISSION_FAIL,
  payload: error,
});

export const getLecturePermissionDeletedValue = () => ({
  type: GET_LECTURE_PERMISSION_DELETED_VALUE,
});

export const getLecturePermissionDeletedValueSuccess = deleted => ({
  type: GET_LECTURE_PERMISSION_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getLecturePermissionDeletedValueFail = error => ({
  type: GET_LECTURE_PERMISSION_DELETED_VALUE_FAIL,
  payload: error,
});

// export const getLecturePermissionPermissions = lecturePermissionPermission => ({
//   type: GET_LECTURE_PERMISSION_PERMISSIONS,
//   payload: lecturePermissionPermission,
// });

// export const getLecturePermissionPermissionsSuccess = lecturePermissions => ({
//   type: GET_LECTURE_PERMISSION_PERMISSIONS_SUCCESS,
//   payload: lecturePermissions,
// });

// export const getLecturePermissionPermissionsFail = error => ({
//   type: GET_LECTURE_PERMISSION_PERMISSIONS_FAIL,
//   payload: error,
// });
// export const addNewLecturePermissionPermission = lecturePermission => ({
//   type: ADD_NEW_LECTURE_PERMISSION_PERMISSION,
//   payload: lecturePermission,
// });
// export const addLecturePermissionPermissionSuccess = lecturePermission => ({
//   type: ADD_LECTURE_PERMISSION_PERMISSION_SUCCESS,
//   payload: lecturePermission,
// });

// export const addLecturePermissionPermissionFail = error => ({
//   type: ADD_LECTURE_PERMISSION_PERMISSION_FAIL,
//   payload: error,
// });
// export const updateLecturePermissionPermission = lecturePermission => {
//   return {
//     type: UPDATE_LECTURE_PERMISSION_PERMISSION,
//     payload: lecturePermission,
//   };
// };

// export const updateLecturePermissionPermissionSuccess = lecturePermission => ({
//   type: UPDATE_LECTURE_PERMISSION_PERMISSION_SUCCESS,
//   payload: lecturePermission,
// });

// export const updateLecturePermissionPermissionFail = error => ({
//   type: UPDATE_LECTURE_PERMISSION_PERMISSION_FAIL,
//   payload: error,
// });
// export const deleteLecturePermissionPermission = lecturePermission => ({
//   type: DELETE_LECTURE_PERMISSION_PERMISSION,
//   payload: lecturePermission,
// });
// export const deleteLecturePermissionPermissionSuccess = lecturePermission => ({
//   type: DELETE_LECTURE_PERMISSION_PERMISSION_SUCCESS,
//   payload: lecturePermission,
// });
// export const deleteLecturePermissionPermissionFail = error => ({
//   type: DELETE_LECTURE_PERMISSION_PERMISSION_FAIL,
//   payload: error,
// });

// export const getLecturePermissionPermissionDeletedValue = () => ({
//   type: GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE,
// });

// export const getLecturePermissionPermissionDeletedValueSuccess = deleted => ({
//   type: GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE_SUCCESS,
//   payload: deleted,
// });

// export const getLecturePermissionPermissionDeletedValueFail = error => ({
//   type: GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE_FAIL,
//   payload: error,
// });

export const addNewLecturePermissionUser = lecturePermission => ({
  type: ADD_NEW_LECTURE_PERMISSION_USER,
  payload: lecturePermission,
});
export const addLecturePermissionUserSuccess = lecturePermission => ({
  type: ADD_LECTURE_PERMISSION_USER_SUCCESS,
  payload: lecturePermission,
});

export const addLecturePermissionUserFail = error => ({
  type: ADD_LECTURE_PERMISSION_USER_FAIL,
  payload: error,
});
