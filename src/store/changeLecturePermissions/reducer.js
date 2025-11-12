import {
  GET_LECTURE_PERMISSIONS_SUCCESS,
  GET_LECTURE_PERMISSIONS_FAIL,
  ADD_LECTURE_PERMISSION_SUCCESS,
  ADD_LECTURE_PERMISSION_FAIL,
  UPDATE_LECTURE_PERMISSION_SUCCESS,
  UPDATE_LECTURE_PERMISSION_FAIL,
  DELETE_LECTURE_PERMISSION_SUCCESS,
  DELETE_LECTURE_PERMISSION_FAIL,
  GET_LECTURE_PERMISSION_DELETED_VALUE_SUCCESS,
  GET_LECTURE_PERMISSION_DELETED_VALUE_FAIL,
  // GET_LECTURE_PERMISSION_PERMISSIONS_SUCCESS,
  // GET_LECTURE_PERMISSION_PERMISSIONS_FAIL,
  // ADD_LECTURE_PERMISSION_PERMISSION_SUCCESS,
  // ADD_LECTURE_PERMISSION_PERMISSION_FAIL,
  // UPDATE_LECTURE_PERMISSION_PERMISSION_SUCCESS,
  // UPDATE_LECTURE_PERMISSION_PERMISSION_FAIL,
  // DELETE_LECTURE_PERMISSION_PERMISSION_SUCCESS,
  // DELETE_LECTURE_PERMISSION_PERMISSION_FAIL,
  // GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE_SUCCESS,
  // GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE_FAIL,
  ADD_LECTURE_PERMISSION_USER_SUCCESS,
  ADD_LECTURE_PERMISSION_USER_FAIL,
} from "./actionTypes";
const INIT_STATE = {
  lecturePermissions: [],
  deleted: {},
  lecturePermissionPermissions: [],
  error: {},
  lecturePermissionUsers: [],
  deletedDetail: null,
};
const lecturePermissions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LECTURE_PERMISSIONS_SUCCESS:
      return {
        ...state,
        lecturePermissions: action.payload,
      };
    case GET_LECTURE_PERMISSIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_LECTURE_PERMISSION_SUCCESS:
      return {
        ...state,
        lecturePermissions: [...state.lecturePermissions, action.payload],
      };
    case ADD_LECTURE_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_LECTURE_PERMISSION_SUCCESS:
      return {
        ...state,
        lecturePermissions: state.lecturePermissions.map(lecturePermission =>
          lecturePermission.Id.toString() === action.payload.Id.toString()
            ? { lecturePermission, ...action.payload }
            : lecturePermission
        ),
      };
    case UPDATE_LECTURE_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_LECTURE_PERMISSION_SUCCESS:
      return {
        ...state,
        lecturePermissions: state.lecturePermissions.filter(
          lecturePermission =>
            lecturePermission.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_LECTURE_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_LECTURE_PERMISSION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_LECTURE_PERMISSION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    // case GET_LECTURE_PERMISSION_PERMISSIONS_SUCCESS:
    //   return {
    //     ...state,
    //     lecturePermissionPermissions: action.payload,
    //   };
    // case GET_LECTURE_PERMISSION_PERMISSIONS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };
    // case ADD_LECTURE_PERMISSION_PERMISSION_SUCCESS:
    //   return {
    //     ...state,
    //     lecturePermissionPermissions: [...state.lecturePermissionPermissions, action.payload],
    //   };
    // case ADD_LECTURE_PERMISSION_PERMISSION_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };
    // case UPDATE_LECTURE_PERMISSION_PERMISSION_SUCCESS:
    //   return {
    //     ...state,
    //     lecturePermissionPermissions: state.lecturePermissionPermissions.map(lecturePermissionPermission =>
    //       lecturePermissionPermission.Id === action.payload.Id
    //         ? { lecturePermissionPermission, ...action.payload }
    //         : lecturePermissionPermission
    //     ),
    //   };
    // case UPDATE_LECTURE_PERMISSION_PERMISSION_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };
    // case DELETE_LECTURE_PERMISSION_PERMISSION_SUCCESS:
    //   return {
    //     ...state,
    //     lecturePermissionPermissions: state.lecturePermissionPermissions.filter(
    //       lecturePermissionPermission =>
    //         lecturePermissionPermission.Id.toString() !== action.payload.Id.toString()
    //     ),
    //     deleted: action.payload.deleted,
    //   };

    // case DELETE_LECTURE_PERMISSION_PERMISSION_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    // case GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE_SUCCESS:
    //   return {
    //     ...state,
    //     deleted: action.payload.deleted,
    //   };
    // case GET_LECTURE_PERMISSION_PERMISSION_DELETED_VALUE_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    case ADD_LECTURE_PERMISSION_USER_SUCCESS:
      return {
        ...state,
        lecturePermissionUsers: [
          ...state.lecturePermissionUsers,
          action.payload,
        ],
      };
    case ADD_LECTURE_PERMISSION_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default lecturePermissions;
