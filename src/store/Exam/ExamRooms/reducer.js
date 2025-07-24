import {
  GET_EXAM_ROOMS_SUCCESS,
  GET_EXAM_ROOMS_FAIL,
  ADD_EXAM_ROOM_SUCCESS,
  ADD_EXAM_ROOM_FAIL,
  UPDATE_EXAM_ROOM_SUCCESS,
  UPDATE_EXAM_ROOM_FAIL,
  DELETE_EXAM_ROOM_SUCCESS,
  DELETE_EXAM_ROOM_FAIL,
  GET_EXAM_ROOM_PROFILE_SUCCESS,
  GET_EXAM_ROOM_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  examRooms: [],
  faculties: [],
  examRoomProfile: {},
  error: {},
};

const examRooms = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EXAM_ROOMS_SUCCESS:
      return {
        ...state,
        examRooms: action.payload,
      };

    case GET_EXAM_ROOMS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_EXAM_ROOM_SUCCESS:
      return {
        ...state,
        examRooms: [...state.examRooms, action.payload],
      };

    case ADD_EXAM_ROOM_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EXAM_ROOM_PROFILE_SUCCESS:
      return {
        ...state,
        examRoomProfile: action.payload,
      };

    case UPDATE_EXAM_ROOM_SUCCESS:
      return {
        ...state,
        examRooms: state.examRooms.map(examRoom =>
          examRoom.Id.toString() === action.payload.Id.toString()
            ? { examRoom, ...action.payload }
            : examRoom
        ),
      };

    case UPDATE_EXAM_ROOM_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_EXAM_ROOM_SUCCESS:
      return {
        ...state,
        examRooms: state.examRooms.filter(
          examRoom => examRoom.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_EXAM_ROOM_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EXAM_ROOM_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default examRooms;
