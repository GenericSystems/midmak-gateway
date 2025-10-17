import {
  GET_EXAM_OBSERVERS_SUCCESS,
  GET_EXAM_OBSERVERS_FAIL,
  ADD_EXAM_OBSERVER_SUCCESS,
  ADD_EXAM_OBSERVER_FAIL,
  UPDATE_EXAM_OBSERVER_SUCCESS,
  UPDATE_EXAM_OBSERVER_FAIL,
  DELETE_EXAM_OBSERVER_SUCCESS,
  DELETE_EXAM_OBSERVER_FAIL,
  GET_EXAM_OBSERVER_PROFILE_SUCCESS,
  GET_EXAM_OBSERVER_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  examObservers: [],
  faculties: [],
  examObserverProfile: {},
  error: {},
};

const examObservers = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EXAM_OBSERVERS_SUCCESS:
      return {
        ...state,
        examObservers: action.payload,
      };

    case GET_EXAM_OBSERVERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_EXAM_OBSERVER_SUCCESS:
      return {
        ...state,
        examObservers: [...state.examObservers, action.payload],
      };

    case ADD_EXAM_OBSERVER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EXAM_OBSERVER_PROFILE_SUCCESS:
      return {
        ...state,
        examObserverProfile: action.payload,
      };

    case UPDATE_EXAM_OBSERVER_SUCCESS:
      return {
        ...state,
        examObservers: state.examObservers.map(examObserver =>
          examObserver.Id.toString() === action.payload.Id.toString()
            ? { examObserver, ...action.payload }
            : examObserver
        ),
      };

    case UPDATE_EXAM_OBSERVER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_EXAM_OBSERVER_SUCCESS:
      return {
        ...state,
        examObservers: state.examObservers.filter(
          examObserver =>
            examObserver.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_EXAM_OBSERVER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EXAM_OBSERVER_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default examObservers;
