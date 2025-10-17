import {
  GET_DISTRIBUTING_COURSES_METHODS,
  GET_DISTRIBUTING_COURSES_METHODS_SUCCESS,
  GET_DISTRIBUTING_COURSES_METHODS_FAIL,
  ADD_NEW_DISTRIBUTING_COURSES_METHOD,
  ADD_DISTRIBUTING_COURSES_METHOD_FAIL,
  ADD_DISTRIBUTING_COURSES_METHOD_SUCCESS,
  UPDATE_DISTRIBUTING_COURSES_METHOD,
  UPDATE_DISTRIBUTING_COURSES_METHOD_SUCCESS,
  UPDATE_DISTRIBUTING_COURSES_METHOD_FAIL,
  DELETE_DISTRIBUTING_COURSES_METHOD,
  DELETE_DISTRIBUTING_COURSES_METHOD_FAIL,
  DELETE_DISTRIBUTING_COURSES_METHOD_SUCCESS,
  GET_DISTRIBUTING_COURSES_METHODS_CONTENTS,
  GET_DISTRIBUTING_COURSES_METHODS_CONTENTS_SUCCESS,
  GET_DISTRIBUTING_COURSES_METHODS_CONTENTS_FAIL,
  ADD_NEW_DISTRIBUTING_COURSES_METHOD_CONTENT,
  ADD_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS,
  ADD_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL,
  UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT,
  UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS,
  UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL,
  DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT,
  DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS,
  DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL,
  GET_DISTRIBUTING_COURSES,
  GET_DISTRIBUTING_COURSES_SUCCESS,
  GET_DISTRIBUTING_COURSES_FAIL,
  ADD_NEW_DISTRIBUTING_COURSE,
  ADD_DISTRIBUTING_COURSE_SUCCESS,
  ADD_DISTRIBUTING_COURSE_FAIL,
  DELETE_DISTRIBUTING_COURSE,
  DELETE_DISTRIBUTING_COURSE_SUCCESS,
  DELETE_DISTRIBUTING_COURSE_FAIL,
} from "./actionTypes";

// getDistributingCoursesMethods

export const getDistributingCoursesMethods = () => ({
  type: GET_DISTRIBUTING_COURSES_METHODS,
});

export const getDistributingCoursesMethodsSuccess =
  distributingCoursesMethods => ({
    type: GET_DISTRIBUTING_COURSES_METHODS_SUCCESS,
    payload: distributingCoursesMethods,
  });

export const getDistributingCoursesMethodsFail = error => ({
  type: GET_DISTRIBUTING_COURSES_METHODS_FAIL,
  payload: error,
});

// getDistributingCoursesMethodsContents

export const getDistributingCoursesMethodsContents =
  distributingCoursesMethodsContents => ({
    type: GET_DISTRIBUTING_COURSES_METHODS_CONTENTS,
    payload: distributingCoursesMethodsContents,
  });

export const getDistributingCoursesMethodContentsSuccess =
  distributingCoursesMethodsContents => ({
    type: GET_DISTRIBUTING_COURSES_METHODS_CONTENTS_SUCCESS,
    payload: distributingCoursesMethodsContents,
  });

export const getDistributingCoursesMethodsContentsFail = error => ({
  type: GET_DISTRIBUTING_COURSES_METHODS_CONTENTS_FAIL,
  payload: error,
});

// addNewDistributingCoursesMethod

export const addNewDistributingCoursesMethod = distributingCoursesMethod => ({
  type: ADD_NEW_DISTRIBUTING_COURSES_METHOD,
  payload: distributingCoursesMethod,
});

export const addDistributingCoursesMethodSuccess =
  distributingCoursesMethod => ({
    type: ADD_DISTRIBUTING_COURSES_METHOD_SUCCESS,
    payload: distributingCoursesMethod,
  });

export const addDistributingCoursesMethodFail = error => ({
  type: ADD_DISTRIBUTING_COURSES_METHOD_FAIL,
  payload: error,
});
//

// addNewDistributingCoursesMethodContent

export const addNewDistributingCoursesMethodContent =
  distributingCoursesMethodContent => ({
    type: ADD_NEW_DISTRIBUTING_COURSES_METHOD_CONTENT,
    payload: distributingCoursesMethodContent,
  });

export const addDistributingCoursesMethodContentSuccess =
  distributingCoursesMethodContent => ({
    type: ADD_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS,
    payload: distributingCoursesMethodContent,
  });

export const addDistributingCoursesMethodContentFail = error => ({
  type: ADD_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL,
  payload: error,
});

//

//   updateDistributingCoursesMethod

export const updateDistributingCoursesMethod = distributingCoursesMethod => {
  return {
    type: UPDATE_DISTRIBUTING_COURSES_METHOD,
    payload: distributingCoursesMethod,
  };
};

export const updateDistributingCoursesMethodSuccess =
  distributingCoursesMethod => ({
    type: UPDATE_DISTRIBUTING_COURSES_METHOD_SUCCESS,
    payload: distributingCoursesMethod,
  });

export const updateDistributingCoursesMethodFail = error => ({
  type: UPDATE_DISTRIBUTING_COURSES_METHOD_FAIL,
  payload: error,
});

export const updateDistributingCoursesMethodContent =
  distributingCoursesMethodContent => {
    return {
      type: UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT,
      payload: distributingCoursesMethodContent,
    };
  };

export const updateDistributingCoursesMethodContentSuccess =
  distributingCoursesMethodContent => ({
    type: UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS,
    payload: distributingCoursesMethodContent,
  });

export const updateDistributingCoursesMethodContentFail = error => ({
  type: UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL,
  payload: error,
});

export const deleteDistributingCoursesMethod = distributingCoursesMethod => ({
  type: DELETE_DISTRIBUTING_COURSES_METHOD,
  payload: distributingCoursesMethod,
});

export const deleteDistributingCoursesMethodSuccess =
  distributingCoursesMethod => ({
    type: DELETE_DISTRIBUTING_COURSES_METHOD_SUCCESS,
    payload: distributingCoursesMethod,
  });

export const deleteDistributingCoursesMethodFail = error => ({
  type: DELETE_DISTRIBUTING_COURSES_METHOD_FAIL,
  payload: error,
});

export const deleteDistributingCoursesMethodContent =
  distributingCoursesMethodContent => ({
    type: DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT,
    payload: distributingCoursesMethodContent,
  });

export const deleteDistributingCoursesMethodContentSuccess =
  distributingCoursesMethodContent => ({
    type: DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS,
    payload: distributingCoursesMethodContent,
  });

export const deleteDistributingCoursesMethodContentFail = error => ({
  type: DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL,
  payload: error,
});

//

export const getDistributingCourses = distributingCourses => ({
  type: GET_DISTRIBUTING_COURSES,
  payload: distributingCourses,
});

export const getDistributingCoursesSuccess = distributingCourses => ({
  type: GET_DISTRIBUTING_COURSES_SUCCESS,
  payload: distributingCourses,
});

export const getDistributingCoursesFail = error => ({
  type: GET_DISTRIBUTING_COURSES_FAIL,
  payload: error,
});

export const addNewDistributingCourse = distributingCourse => ({
  type: ADD_NEW_DISTRIBUTING_COURSE,
  payload: distributingCourse,
});

export const addDistributingCourseSuccess = distributingCourse => ({
  type: ADD_DISTRIBUTING_COURSE_SUCCESS,
  payload: distributingCourse,
});

export const addDistributingCourseFail = error => ({
  type: ADD_DISTRIBUTING_COURSE_FAIL,
  payload: error,
});

export const deleteDistributingCourse = distributingCourse => ({
  type: DELETE_DISTRIBUTING_COURSE,
  payload: distributingCourse,
});

export const deleteDistributingCourseSuccess = distributingCourse => ({
  type: DELETE_DISTRIBUTING_COURSE_SUCCESS,
  payload: distributingCourse,
});

export const deleteDistributingCourseFail = error => ({
  type: DELETE_DISTRIBUTING_COURSE_FAIL,
  payload: error,
});
