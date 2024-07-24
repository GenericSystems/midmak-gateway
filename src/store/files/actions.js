import {
    GET_FILE,
    GET_FILE_FAIL,
    GET_FILE_SUCCESS,
  } from "./actionTypes";
  
  export const getFile = file => ({
    type: GET_FILE,
    payload: file,

  });
  
  export const getFileSuccess = file => ({
    type: GET_FILE_SUCCESS,
    payload: file,
  });
  
  export const getFileFail = error => ({
    type: GET_FILE_FAIL,
    payload: error,
  });

  