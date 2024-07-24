import {
    GET_COURSETYPES_SUCCESS,
    GET_COURSETYPES_FAIL,
    ADD_COURSETYPE_SUCCESS,
    ADD_COURSETYPE_FAIL,
    UPDATE_COURSETYPE_SUCCESS,
    UPDATE_COURSETYPE_FAIL,
    DELETE_COURSETYPE_SUCCESS,
    DELETE_COURSETYPE_FAIL,
    GET_COURSETYPE_DELETED_VALUE_SUCCESS,
    GET_COURSETYPE_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    courseTypes: [],
    deleted: {},
    error: {},
    }
    
    const courseTypes = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_COURSETYPES_SUCCESS:
    return {
    ...state,
    courseTypes: action.payload,
    }
    case GET_COURSETYPES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_COURSETYPE_SUCCESS:
        return {
            ...state,
            courseTypes: [...state.courseTypes, action.payload],
        }

    case ADD_COURSETYPE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_COURSETYPE_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload,
        }

    case UPDATE_COURSETYPE_SUCCESS:
        return {
            ...state,
            courseTypes: state.courseTypes.map(courseType =>
                courseType.Id.toString() === action.payload.Id.toString()
                    ? { courseType, ...action.payload }
                    : courseType
            ),
        }

    case UPDATE_COURSETYPE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_COURSETYPE_SUCCESS:
        return {
            ...state,
            courseTypes: state.courseTypes.filter(
                courseType => courseType.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
        }

    case DELETE_COURSETYPE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_COURSETYPE_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default courseTypes
