import {
  GET_EXAM_OBSERVERS,
  GET_EXAM_OBSERVERS_FAIL,
  GET_EXAM_OBSERVERS_SUCCESS,
  GET_EXAM_OBSERVER_PROFILE,
  GET_EXAM_OBSERVER_PROFILE_FAIL,
  GET_EXAM_OBSERVER_PROFILE_SUCCESS,
  ADD_NEW_EXAM_OBSERVER,
  ADD_EXAM_OBSERVER_SUCCESS,
  ADD_EXAM_OBSERVER_FAIL,
  UPDATE_EXAM_OBSERVER,
  UPDATE_EXAM_OBSERVER_SUCCESS,
  UPDATE_EXAM_OBSERVER_FAIL,
  DELETE_EXAM_OBSERVER,
  DELETE_EXAM_OBSERVER_SUCCESS,
  DELETE_EXAM_OBSERVER_FAIL,
} from "./actionTypes";

export const getExamObservers = examObservers => ({
  type: GET_EXAM_OBSERVERS,
  payload: examObservers,
});

export const getExamObserversSuccess = examObservers => ({
  type: GET_EXAM_OBSERVERS_SUCCESS,
  payload: examObservers,
});

export const getExamObserversFail = error => ({
  type: GET_EXAM_OBSERVERS_FAIL,
  payload: error,
});

export const getExamObserverProfile = examObserverId => ({
  type: GET_EXAM_OBSERVER_PROFILE,
  examObserverId,
});

export const getExamObserverProfileSuccess = examObserverProfiles => ({
  type: GET_EXAM_OBSERVER_PROFILE_SUCCESS,
  payload: examObserverProfiles,
});

export const getExamObserverProfileFail = error => ({
  type: GET_EXAM_OBSERVER_PROFILE_FAIL,
  payload: error,
});

export const addNewExamObserver = examObserver => ({
  type: ADD_NEW_EXAM_OBSERVER,
  payload: examObserver,
});

export const addExamObserverSuccess = examObserver => ({
  type: ADD_EXAM_OBSERVER_SUCCESS,
  payload: examObserver,
});

export const addExamObserverFail = error => ({
  type: ADD_EXAM_OBSERVER_FAIL,
  payload: error,
});

export const updateExamObserver = examObserver => ({
  type: UPDATE_EXAM_OBSERVER,
  payload: examObserver,
});

export const updateExamObserverSuccess = examObserver => ({
  type: UPDATE_EXAM_OBSERVER_SUCCESS,
  payload: examObserver,
});

export const updateExamObserverFail = error => ({
  type: UPDATE_EXAM_OBSERVER_FAIL,
  payload: error,
});

export const deleteExamObserver = examObserver => ({
  type: DELETE_EXAM_OBSERVER,
  payload: examObserver,
});

export const deleteExamObserverSuccess = examObserver => ({
  type: DELETE_EXAM_OBSERVER_SUCCESS,
  payload: examObserver,
});

export const deleteExamObserverFail = error => ({
  type: DELETE_EXAM_OBSERVER_FAIL,
  payload: error,
});
