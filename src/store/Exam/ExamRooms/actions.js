import {
  GET_EXAM_ROOMS,
  GET_EXAM_ROOMS_FAIL,
  GET_EXAM_ROOMS_SUCCESS,
  GET_EXAM_ROOM_PROFILE,
  GET_EXAM_ROOM_PROFILE_FAIL,
  GET_EXAM_ROOM_PROFILE_SUCCESS,
  ADD_NEW_EXAM_ROOM,
  ADD_EXAM_ROOM_SUCCESS,
  ADD_EXAM_ROOM_FAIL,
  UPDATE_EXAM_ROOM,
  UPDATE_EXAM_ROOM_SUCCESS,
  UPDATE_EXAM_ROOM_FAIL,
  DELETE_EXAM_ROOM,
  DELETE_EXAM_ROOM_SUCCESS,
  DELETE_EXAM_ROOM_FAIL,
  GET_SETTING_EXAM_ROOM,
} from "./actionTypes";

export const getExamRooms = examRooms => ({
  type: GET_EXAM_ROOMS,
  payload: examRooms,
});

export const getExamRoomsSuccess = examRooms => ({
  type: GET_EXAM_ROOMS_SUCCESS,
  payload: examRooms,
});

export const getExamRoomsFail = error => ({
  type: GET_EXAM_ROOMS_FAIL,
  payload: error,
});

export const getExamRoomProfile = examRoomId => ({
  type: GET_EXAM_ROOM_PROFILE,
  examRoomId,
});

export const getExamRoomProfileSuccess = examRoomProfiles => ({
  type: GET_EXAM_ROOM_PROFILE_SUCCESS,
  payload: examRoomProfiles,
});

export const getExamRoomProfileFail = error => ({
  type: GET_EXAM_ROOM_PROFILE_FAIL,
  payload: error,
});

export const addNewExamRoom = examRoom => ({
  type: ADD_NEW_EXAM_ROOM,
  payload: examRoom,
});

export const addExamRoomSuccess = examRoom => ({
  type: ADD_EXAM_ROOM_SUCCESS,
  payload: examRoom,
});

export const addExamRoomFail = error => ({
  type: ADD_EXAM_ROOM_FAIL,
  payload: error,
});

export const updateExamRoom = examRoom => ({
  type: UPDATE_EXAM_ROOM,
  payload: examRoom,
});

export const updateExamRoomSuccess = examRoom => ({
  type: UPDATE_EXAM_ROOM_SUCCESS,
  payload: examRoom,
});

export const updateExamRoomFail = error => ({
  type: UPDATE_EXAM_ROOM_FAIL,
  payload: error,
});

export const deleteExamRoom = examRoom => ({
  type: DELETE_EXAM_ROOM,
  payload: examRoom,
});

export const deleteExamRoomSuccess = examRoom => ({
  type: DELETE_EXAM_ROOM_SUCCESS,
  payload: examRoom,
});

export const deleteExamRoomFail = error => ({
  type: DELETE_EXAM_ROOM_FAIL,
  payload: error,
});

export const fetchSettingExam = () => ({
  type: GET_SETTING_EXAM_ROOM,
});
