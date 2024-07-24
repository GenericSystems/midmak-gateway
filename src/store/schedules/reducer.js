import {
    GET_SCHEDULES_SUCCESS,
    GET_SCHEDULES_FAIL,
    ADD_SCHEDULE_SUCCESS,
    ADD_SCHEDULE_FAIL,
    UPDATE_SCHEDULE_SUCCESS,
    UPDATE_SCHEDULE_FAIL,
    DELETE_SCHEDULE_SUCCESS,
    DELETE_SCHEDULE_FAIL,
    GET_SCHEDULE_PROFILE_SUCCESS,
    GET_SCHEDULE_PROFILE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    schedules: [],
    scheduleProfile: {},
    error: {},
    }
    
    const schedules = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_SCHEDULES_SUCCESS:
    return {
    ...state,
    schedules: action.payload,
    }
    case GET_SCHEDULES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_SCHEDULE_SUCCESS:
        return {
            ...state,
            schedules: [...state.schedules, action.payload],
        }

    case ADD_SCHEDULE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_SCHEDULE_PROFILE_SUCCESS:
        return {
            ...state,
            scheduleProfile: action.payload,
        }

    case UPDATE_SCHEDULE_SUCCESS:
        return {
            ...state,
            schedules: state.schedules.map(schedule =>
                schedule.Id.toString() === action.payload.Id.toString()
                    ? { schedule, ...action.payload }
                    : schedule
            ),
        }

    case UPDATE_SCHEDULE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_SCHEDULE_SUCCESS:
        return {
            ...state,
            schedules: state.schedules.filter(
                schedule => schedule.Id.toString() !== action.payload.Id.toString()
            ),
        }

    case DELETE_SCHEDULE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_SCHEDULE_PROFILE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default schedules
