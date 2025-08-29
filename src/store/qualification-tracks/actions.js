import {
  GET_QUALIFICATION_TRACK_DELETED_VALUE,
  GET_QUALIFICATION_TRACK_DELETED_VALUE_FAIL,
  GET_QUALIFICATION_TRACK_DELETED_VALUE_SUCCESS,
  GET_QUALIFICATIONS_TRACKS,
  GET_QUALIFICATIONS_TRACKS_FAIL,
  GET_QUALIFICATIONS_TRACKS_SUCCESS,
  ADD_NEW_QUALIFICATION_TRACK,
  ADD_QUALIFICATION_TRACK_SUCCESS,
  ADD_QUALIFICATION_TRACK_FAIL,
  UPDATE_QUALIFICATION_TRACK,
  UPDATE_QUALIFICATION_TRACK_SUCCESS,
  UPDATE_QUALIFICATION_TRACK_FAIL,
  DELETE_QUALIFICATION_TRACK,
  DELETE_QUALIFICATION_TRACK_SUCCESS,
  DELETE_QUALIFICATION_TRACK_FAIL,
} from "./actionTypes";

export const getQualificationsTracks= () => ({
  type: GET_QUALIFICATIONS_TRACKS,
});

export const getQualificationsTracksSuccess = qualificationTracks => ({
  type: GET_QUALIFICATIONS_TRACKS_SUCCESS,
  payload: qualificationTracks,
});

export const getQualificationsTracksFail = error => ({
  type: GET_QUALIFICATIONS_TRACKS_FAIL,
  payload: error,
});

export const getQualificationTrackDeletedValue = () => ({
  type: GET_QUALIFICATION_TRACK_DELETED_VALUE,
});

export const getQualificationTrackDeletedValueSuccess = QualificationTrackProfile => ({
  type: GET_QUALIFICATION_TRACK_DELETED_VALUE_SUCCESS,
  payload: QualificationTrackProfile,
});

export const getQualificationTrackDeletedValueFail = error => ({
  type: GET_QUALIFICATION_TRACK_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewQualificationTrack = qualificationTrack => ({
  type: ADD_NEW_QUALIFICATION_TRACK,
  payload: qualificationTrack,
});

export const addQualificationTrackSuccess = qualificationTrack => ({
  type: ADD_QUALIFICATION_TRACK_SUCCESS,
  payload: qualificationTrack,
});

export const addQualificationTrackFail = error => ({
  type: ADD_QUALIFICATION_TRACK_FAIL,
  payload: error,
});

export const updateQualificationTrack = qualificationTrack => {
  return {
    type: UPDATE_QUALIFICATION_TRACK,
    payload: qualificationTrack,
  };
};

export const updateQualificationTrackSuccess = qualificationTrack => ({
  type: UPDATE_QUALIFICATION_TRACK_SUCCESS,
  payload: qualificationTrack,
});

export const updateQualificationTrackFail = error => ({
  type: UPDATE_QUALIFICATION_TRACK_FAIL,
  payload: error,
});

export const deleteQualificationTrack = qualificationTrack => ({
  type: DELETE_QUALIFICATION_TRACK,
  payload: qualificationTrack,
});

export const deleteQualificationTrackSuccess = qualificationTrack => ({
  type: DELETE_QUALIFICATION_TRACK_SUCCESS,
  payload: qualificationTrack,
});

export const deleteQualificationTrackFail = error => ({
  type: DELETE_QUALIFICATION_TRACK_FAIL,
  payload: error,
});
