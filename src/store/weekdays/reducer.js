import {
    GET_WEEKDAYS_SUCCESS,
    GET_WEEKDAYS_FAIL,
    ADD_WEEKDAY_SUCCESS,
    ADD_WEEKDAY_FAIL,
    UPDATE_WEEKDAY_SUCCESS,
    UPDATE_WEEKDAY_FAIL,
    DELETE_WEEKDAY_SUCCESS,
    DELETE_WEEKDAY_FAIL,
    GET_WEEKDAY_PROFILE_SUCCESS,
    GET_WEEKDAY_PROFILE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    weekDays: [],
    weekDayProfile: {},
    error: {},
    }
    
    const weekDays = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_WEEKDAYS_SUCCESS:
    return {
    ...state,
    weekDays: action.payload,
    }
    case GET_WEEKDAYS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_WEEKDAY_SUCCESS:
        return {
            ...state,
            weekDays: [...state.weekDays, action.payload],
        }

    case ADD_WEEKDAY_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_WEEKDAY_PROFILE_SUCCESS:
        return {
            ...state,
            weekDayProfile: action.payload,
        }

    case UPDATE_WEEKDAY_SUCCESS:
        return {
            ...state,
            weekDays: state.weekDays.map(weekDay =>
                weekDay.Id.toString() === action.payload.Id.toString()
                    ? { weekDay, ...action.payload }
                    : weekDay
            ),
        }

    case UPDATE_WEEKDAY_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_WEEKDAY_SUCCESS:
        return {
            ...state,
            weekDays: state.weekDays.filter(
                weekDay => weekDay.Id.toString() !== action.payload.Id.toString()
            ),
        }

    case DELETE_WEEKDAY_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_WEEKDAY_PROFILE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default weekDays
