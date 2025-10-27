import {
  UPLOAD_FILE,
  UPLOAD_FILE_FAIL,
  UPLOAD_FILE_SUCCESS,
  FETCH_FILE_REQUEST
} from "./actionTypes";

// fileData is : `path`,`entity`,`entityId`,`entityProp`,`entityPropSeq`,`entityProp_entity`

export const uploadFile = fileData => ({
  type: UPLOAD_FILE,
  payload: fileData,
});

export const uploadFileFail = error => ({
  type: UPLOAD_FILE_FAIL,
  payload: error,
});

export const uploadFileSuccess = fileData => ({
  type: UPLOAD_FILE_SUCCESS,
  payload: fileData,
});

export const fetchFile = (fileId) => ({
  type: FETCH_FILE_REQUEST,
  payload: fileId,
});