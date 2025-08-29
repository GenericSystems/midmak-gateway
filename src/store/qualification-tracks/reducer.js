import {
    GET_QUALIFICATIONS_TRACKS_SUCCESS,
    GET_QUALIFICATIONS_TRACKS_FAIL,
    ADD_QUALIFICATION_TRACK_SUCCESS,
    ADD_QUALIFICATION_TRACK_FAIL,
    UPDATE_QUALIFICATION_TRACK_SUCCESS,
    UPDATE_QUALIFICATION_TRACK_FAIL,
    DELETE_QUALIFICATION_TRACK_SUCCESS,
    DELETE_QUALIFICATION_TRACK_FAIL,
    GET_QUALIFICATION_TRACK_DELETED_VALUE_SUCCESS,
    GET_QUALIFICATION_TRACK_DELETED_VALUE_FAIL,
  } from "./actionTypes"
  
  const INIT_STATE = {
    qualificationTracks: [],
    deleted: {},
    error: {},
  }
  
  const qualificationTracks = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_QUALIFICATIONS_TRACKS_SUCCESS:
        return {
          ...state,
          qualificationTracks: action.payload,
        }
  
      case GET_QUALIFICATIONS_TRACKS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_QUALIFICATION_TRACK_SUCCESS:
        return {
          ...state,
          qualificationTracks: [...state.qualificationTracks, action.payload],
        }
  
      case ADD_QUALIFICATION_TRACK_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_QUALIFICATION_TRACK_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        }
  
        case UPDATE_QUALIFICATION_TRACK_SUCCESS:
          return {
            ...state,
            qualificationTracks: state.qualificationTracks.map(qualificationTrack =>
              qualificationTrack.Id.toString() === action.payload.Id.toString()
                ? { qualificationTrack, ...action.payload }
                : qualificationTrack
            ),
          }
    
        case UPDATE_QUALIFICATION_TRACK_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_QUALIFICATION_TRACK_SUCCESS:
          return {
            ...state,
            qualificationTracks: state.qualificationTracks.filter(
              qualificationTrack => qualificationTrack.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
          }
    
        case DELETE_QUALIFICATION_TRACK_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_QUALIFICATION_TRACK_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default qualificationTracks
  