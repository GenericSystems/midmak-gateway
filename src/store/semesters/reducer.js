import {
    GET_SEMESTERS_SUCCESS,
    GET_SEMESTERS_FAIL,
    ADD_SEMESTER_SUCCESS,
    ADD_SEMESTER_FAIL,
    UPDATE_SEMESTER_SUCCESS,
    UPDATE_SEMESTER_FAIL,
    DELETE_SEMESTER_SUCCESS,
    DELETE_SEMESTER_FAIL,
    GET_CURRENT_SEMESTER_SUCCESS,
    GET_CURRENT_SEMESTER_FAIL,
    GET_SEMESTER_DELETED_VALUE_SUCCESS,
    GET_SEMESTER_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    semesters: [],
    currentSemester: {},
    deleted : {},
    error: {},
    }
    
    const semesters = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_SEMESTERS_SUCCESS:
    return {
    ...state,
    semesters: action.payload,
    }
    case GET_SEMESTERS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_SEMESTER_SUCCESS:
        return {
            ...state,
            semesters: [...state.semesters, action.payload],
        }

    case ADD_SEMESTER_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_CURRENT_SEMESTER_SUCCESS:
        return {
            ...state,
            currentSemester: action.payload,
        }

    case UPDATE_SEMESTER_SUCCESS:
        return {
            ...state,
            semesters: state.semesters.map(semester =>
                semester.Id.toString() === action.payload.Id.toString()
                    ? { semester, ...action.payload }
                    : semester
            ),
        }

    case UPDATE_SEMESTER_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_SEMESTER_SUCCESS:
        return {
            ...state,
            semesters: state.semesters.filter(
                semester => semester.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted
        }

    case DELETE_SEMESTER_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_CURRENT_SEMESTER_FAIL:
        return {
            ...state,
            error: action.payload,
        }

        case GET_SEMESTER_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload.deleted,
        }

        case GET_SEMESTER_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }



    default:
        return state
}
}

export default semesters
