import { axiosApi } from "./api_helper";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
const postFakeRegister = data => {
  return axiosApi
    .post(url.POST_FAKE_REGISTER, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postDbLogin = data => post(url.POST_DB_LOGIN, data);

// postForgetPwd
const postFakeForgetPwd = data => post(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
const postJwtProfile = data => post(url.POST_EDIT_JWT_PROFILE, data);

const postFakeProfile = data => post(url.POST_EDIT_PROFILE, data);

// Register Method
const postJwtRegister = (url, data) => {
  return axiosApi
    .post(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postJwtLogin = data => post(url.POST_FAKE_JWT_LOGIN, data);

// postForgetPwd
const postJwtForgetPwd = data => post(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = data => post(url.SOCIAL_LOGIN, data);

export const getUserId = () => get(url.GET_USER_ID);

// get Products
export const getProducts = () => get(url.GET_PRODUCTS);

// get Data Items
export const getDataItems = config => get(url.GET_DATA_ITEMS, config);

// get Product detail
export const getProductDetail = id =>
  get(`${url.GET_PRODUCTS_DETAIL}/${id}`, { params: { id } });

// get Events
export const getEvents = () => get(url.GET_EVENTS);

// add Events
export const addNewEvent = event => post(url.ADD_NEW_EVENT, event);

// update Event
export const updateEvent = event => put(url.UPDATE_EVENT, event);

// delete Event
export const deleteEvent = event =>
  del(url.DELETE_EVENT, { headers: { event } });

// get Categories
export const getCategories = () => get(url.GET_CATEGORIES);

// get chats
export const getChats = () => get(url.GET_CHATS);

// get groups
export const getGroups = () => get(url.GET_GROUPS);

// get Contacts
export const getContacts = () => get(url.GET_CONTACTS);

// get messages
export const getMessages = (roomId = "") =>
  get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });

// post messages
export const addMessage = message => post(url.ADD_MESSAGE, message);

// get orders
export const getOrders = () => get(url.GET_ORDERS);

// add order
export const addNewOrder = order => post(url.ADD_NEW_ORDER, order);

// update order
export const updateOrder = order => put(url.UPDATE_ORDER, order);

// delete order
export const deleteOrder = order =>
  del(url.DELETE_ORDER, { headers: { order } });

// get cart data
export const getCartData = () => get(url.GET_CART_DATA);

// get customers
export const getCustomers = () => get(url.GET_CUSTOMERS);

// add customer
export const addNewCustomer = customer => post(url.ADD_NEW_CUSTOMER, customer);

// update customer
export const updateCustomer = customer => put(url.UPDATE_CUSTOMER, customer);

// delete customer
export const deleteCustomer = customer =>
  del(url.DELETE_CUSTOMER, { headers: { customer } });

// get shops
export const getShops = () => get(url.GET_SHOPS);

// get wallet
export const getWallet = () => get(url.GET_WALLET);

// get crypto order
export const getCryptoOrder = () => get(url.GET_CRYPTO_ORDERS);

// get invoices
export const getInvoices = () => get(url.GET_INVOICES);

// get invoice details
export const getInvoiceDetail = id =>
  get(`${url.GET_INVOICE_DETAIL}/${id}`, { params: { id } });

// get TempTraineeById
export const getTempTraineeById = data =>
  post(url.GET_TEMP_TRAINEE_BY_ID, data);

export const generateTempTrainee = data =>
  post(url.GENERATE_TEMP_TRAINEE, data);

// get TempStudentsStatistics
export const getTempStudentsStatistics = data =>
  post(url.GET_STUDENTS_STATISTICS, data);

// get tempStdRelative
export const getTempRelatives = data => post(url.GET_TEMP_RELATIVES, data);

export const getTempRelativeDeletedValue = () =>
  get(url.GET_TEMP_RELATIVE_DELETED_VALUE);

// get relative
export const getStdRelatives = data => post(url.GET_STD_RELATIVES, data);

// add relative
export const addNewStdRelative = data => post(url.ADD_NEW_STD_RELATIVE, data);

// update relative
export const updateStdRelative = data => post(url.UPDATE_STD_RELATIVE, data);

// delete relative
export const deleteStdRelative = data => post(url.DELETE_STD_RELATIVE, data);

export const getStdRelativeDeletedValue = () =>
  get(url.GET_STD_RELATIVE_DELETED_VALUE);

// get admissionConditions
export const getAdmissionConditions = data =>
  post(url.GET_ADMISSION_CONDITIONS, data);

// add admissionCondition
export const addNewAdmissionCondition = data =>
  post(url.ADD_NEW_ADMISSION_CONDITION, data);

//update admissionCondition
export const updateAdmissionCondition = data =>
  post(url.UPDATE_ADMISSION_CONDITION, data);

//delete admissionCondition
export const deleteAdmissionCondition = data =>
  post(url.DELETE_ADMISSION_CONDITION, data);

export const getAdmissionConditionDeletedValue = () =>
  get(url.GET_ADMISSION_CONDITION_DELETED_VALUE);

export const getFilteredFaculties = data =>
  post(url.GET_FILTERED_FACULTIES, data);

export const getFilteredAcademicCertificates = data =>
  post(url.GET_FILTERED_ACADEMIC_CERTIFICATES, data);

export const getAcademicCertificateDeletedValue = () =>
  get(url.GET_ACADEMICCERTIFICATE_DELETED_VALUE);

// get trainee_regReqDocs

export const getTempTraineeDefaultRegReqDocs = data =>
  post(url.GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS, data);

//add RequiredDocs
export const addRequiredDocs = data => post(url.ADD_REQUIRED_DOCS, data);

// get Trainees
export const getTrainees = data => post(url.GET_TRAINEES, data);

// add Trainee
export const addNewTrainee = data => post(url.ADD_NEW_TRAINEE, data);

//update Trainee
export const updateTrainee = data => post(url.UPDATE_TRAINEE, data);

//delete Trainee
export const deleteTrainee = data => post(url.DELETE_TRAINEE, data);
export const getTraineeDeletedValue = () => get(url.GET_TRAINEE_DELETED_VALUE);
// get Trainee
export const getTraineeById = data => post(url.GET_TRAINEE_BY_ID, data);

// get Trainee_regReqDocs
export const getTraineeRegReqDocs = data =>
  post(url.GET_TRAINEE_REGREQDOCS, data);

//update Trainee
export const updateTraineeRegReqDoc = data =>
  post(url.UPDATE_TRAINEE_REGREQDOC, data);

// get Trainee Opt
export const getTraineesOpt = data => post(url.GET_TRAINEES_OPT, data);

// get RegTraineesAttendance
export const getRegisterTraineesAttendance = data =>
  post(url.GET_REGISTER_TRAINEES_ATTENDANCE, data);

// add RegisterTraineeAttendance
export const addNewRegisterTraineeAttendance = data =>
  post(url.ADD_NEW_REGISTER_TRAINEE_ATTENDANCE, data);

//update RegisterTraineeAttendance
export const updateRegisterTraineeAttendance = data =>
  post(url.UPDATE_REGISTER_TRAINEE_ATTENDANCE, data);

//delete RegisterTraineeAttendance
export const deleteRegisterTraineeAttendance = data =>
  post(url.DELETE_REGISTER_TRAINEE_ATTENDANCE, data);

export const getRegisterTraineeAttendanceDeletedValue = () =>
  get(url.GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE);

// add brother
export const addBrother = data => post(url.ADD_BROTHER, data);

export const deleteBrother = data => post(url.DELETE_BROTHER, data);

export const updateBrother = data => post(url.UPDATE_BROTHER, data);

export const getBrothers = data => post(url.GET_BROTHERS, data);

// get project
export const getProjects = () => get(url.GET_PROJECTS);

// get project details
export const getProjectsDetails = id =>
  get(`${url.GET_PROJECT_DETAIL}/${id}`, { params: { id } });

// add project
export const addNewProject = project => post(url.ADD_NEW_PROJECT, project);

// update project
export const updateProject = project => put(url.UPDATE_PROJECT, project);

// delete project
export const deleteProject = project =>
  del(url.DELETE_PROJECT, { headers: { project } });

// get tasks
export const getTasks = () => get(url.GET_TASKS);

// get files
export const getFile = () => get(url.GET_FILE);

// get contacts
export const getUsers = () => get(url.GET_USERS);

// add user
export const addNewUser = user => post(url.ADD_NEW_USER, user);

// get LecturePeriods
export const getLecturePeriods = data => post(url.GET_LECTURE_PERIODS, data);

//get LecturePeriods profile
export const getLecturePeriodProfile = () =>
  get(url.GET_LECTURE_PERIOD_PROFILE);

// add LecturePeriod
export const addNewLecturePeriod = data =>
  post(url.ADD_NEW_LECTURE_PERIOD, data);

//update LecturePeriod
export const updateLecturePeriod = data =>
  post(url.UPDATE_LECTURE_PERIOD, data);

//delete LecturePeriod
export const deleteLecturePeriod = data =>
  post(url.DELETE_LECTURE_PERIOD, data);

// get CurrSemMans
export const getCurrSemMans = data => post(url.GET_CURR_SEM_MANS, data);

// add CurrSemMan
export const addNewCurrSemMan = data => post(url.ADD_NEW_CURR_SEM_MAN, data);

//update CurrSemMan
export const updateCurrSemMan = data => post(url.UPDATE_CURR_SEM_MAN, data);

//delete CurrSemMan
export const deleteCurrSemMan = data => post(url.DELETE_CURR_SEM_MAN, data);

// get NonActiveCurrs
export const getNonActiveCurrs = data => post(url.GET_NON_ACTIVE_CURRS, data);
//update NonActiveCurr
export const updateNonActiveCurr = data =>
  post(url.UPDATE_NON_ACTIVE_CURR, data);

export const deleteAllNonActiveCurr = data =>
  post(url.DELETE_ALL_NON_ACTIVE_CURR, data);

export const saveAllNonActiveCurr = data =>
  post(url.SAVE_ALL_NON_ACTIVE_CURR, data);

//delete NonActiveCurr
export const deleteNonActiveCurr = data =>
  post(url.DELETE_NON_ACTIVE_CURR, data);

// get Registration
export const getRegistrations = data => post(url.GET_REGISTRATIONS, data);

// get studentInfo
export const getStudentRegisterInfo = data =>
  post(url.GET_STUDENT_REGISTER_INFO, data);

// add Registration
export const addNewRegistration = data => post(url.ADD_NEW_REGISTRATION, data);

// get AvailableCourse
export const getAvailableCourses = data =>
  post(url.GET_AVAILABLE_COURSES, data);

// add AvailableCourse
export const addNewAvailableCourse = data =>
  post(url.ADD_NEW_AVAILABLE_COURSE, data);

// get TraineeSchedules
export const getTraineeSchedules = data =>
  post(url.GET_TRAINEE_SCHEDULES, data);

// get AchievedCourses
export const getAchievedCourses = data => post(url.GET_ACHIEVED_COURSES, data);

//update Registration
export const updateRegistration = data => post(url.UPDATE_REGISTRATION, data);

//delete Registration
export const deleteRegistration = data => post(url.DELETE_REGISTRATION, data);
// get generateSIDs
export const getGenerateSIDs = data => post(url.GET_GENERATE_SIDS, data);

//get generateSIDs profile
export const getGenerateSIDProfile = () => get(url.GET_GENERATE_SID_PROFILE);

// add generateSID
export const addNewGenerateSID = data => post(url.ADD_NEW_GENERATE_SID, data);

//update generateSID
export const updateGenerateSID = data => post(url.UPDATE_GENERATE_SID, data);

//delete generateSID
export const deleteGenerateSID = data => post(url.DELETE_GENERATE_SID, data);

// get GeneralManagements
export const getGeneralManagements = data =>
  post(url.GET_GENERAL_MANAGEMENTS, data);

//get GeneralManagements profile
export const getGeneralManagementProfile = () =>
  get(url.GET_GENERAL_MANAGEMENT_PROFILE);

// add GeneralManagement
export const addNewGeneralManagement = data =>
  post(url.ADD_NEW_GENERAL_MANAGEMENT, data);

//update GeneralManagement
export const updateGeneralManagement = data =>
  post(url.UPDATE_GENERAL_MANAGEMENT, data);

//delete GeneralManagement
export const deleteGeneralManagement = data =>
  post(url.DELETE_GENERAL_MANAGEMENT, data);

// get mobAppFacultyAccs
export const getMobAppFacultyAccs = data =>
  post(url.GET_MOB_APP_FACULTY_ACCS, data);

//get mobAppFacultyAccs profile
export const getMobAppFacultyAccProfile = () =>
  get(url.GET_MOB_APP_FACULTY_ACC_PROFILE);

// add mobAppFacultyAcc
export const addNewMobAppFacultyAcc = data =>
  post(url.ADD_NEW_MOB_APP_FACULTY_ACC, data);

//update mobAppFacultyAcc
export const updateMobAppFacultyAcc = data =>
  post(url.UPDATE_MOB_APP_FACULTY_ACC, data);

//delete mobAppFacultyAcc
export const deleteMobAppFacultyAcc = data =>
  post(url.DELETE_MOB_APP_FACULTY_ACC, data);

// get ExamRooms
export const getExamRooms = data => post(url.GET_EXAM_ROOMS, data);

//get ExamRooms profile
export const getExamRoomProfile = () => get(url.GET_EXAM_ROOM_PROFILE);

// add ExamRoom
export const addNewExamRoom = data => post(url.ADD_NEW_EXAM_ROOM, data);

//update ExamRoom
export const updateExamRoom = data => post(url.UPDATE_EXAM_ROOM, data);

//delete ExamRoom
export const deleteExamRoom = data => post(url.DELETE_EXAM_ROOM, data);

// get ExamObservers
export const getExamObservers = data => post(url.GET_EXAM_OBSERVERS, data);

//get ExamObservers profile
export const getExamObserverProfile = () => get(url.GET_EXAM_OBSERVER_PROFILE);

// add ExamObserver
export const addNewExamObserver = data => post(url.ADD_NEW_EXAM_OBSERVER, data);

//update ExamRoom
export const updateExamObserver = data => post(url.UPDATE_EXAM_OBSERVER, data);

//delete ExamRoom
export const deleteExamObserver = data => post(url.DELETE_EXAM_OBSERVER, data);
// get Sectors
export const getSectors = data => post(url.GET_SECTORS, data);

//get Sectors profile
export const getSectorProfile = () => get(url.GET_SECTOR_PROFILE);

// add Sector
export const addNewSector = data => post(url.ADD_NEW_SECTOR, data);

export const getSectorDeletedValue = () => get(url.GET_SECTOR_DELETED_VALUE);

// get halls
export const getHalls = data => post(url.GET_HALLS, data);

// get hallsTypes
export const getHallTypes = data => post(url.GET_HALLS_TYPES, data);

// get AcademyBuildingStructures
export const getAcademyBuildingStructures = data =>
  post(url.GET_ACADEMY_BUILDING_STRUCTURES, data);

//get AcademyBuildingStructures profile
//export const getAcademyBuildingStructureProfile = () => get(url.GET_AcademyBuildingStructure_PROFILE);

// add AcademyBuildingStructure
export const addNewAcademyBuildingStructure = data =>
  post(url.ADD_NEW_ACADEMY_BUILDING_STRUCTURE, data);

export const getAcademyBuildingStructureDeletedValue = () =>
  get(url.GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE);

//update AcademyBuildingStructure
export const updateAcademyBuildingStructure = data =>
  post(url.UPDATE_ACADEMY_BUILDING_STRUCTURE, data);

//delete AcademyBuildingStructure
export const deleteAcademyBuildingStructure = data =>
  post(url.DELETE_ACADEMY_BUILDING_STRUCTURE, data);

// GET ACADEMYINFO
export const getAcademyInfo = data => post(url.GET_ACADEMYINFO, data);

export const addAcademyInfo = data => post(url.ADD_ACADEMYINFO, data);

export const updateAcademyInfo = data => post(url.UPDATE_ACADEMYINFO, data);

// UNIVERSITY_ORG_STRUCTURE
export const getUniversityOrgStructure = data =>
  post(url.GET_UNIVERSITY_ORG_STRUCTURES, data);

export const addNewUniversityOrgStructure = data =>
  post(url.ADD_NEW_UNIVERSITY_ORG_STRUCTURE, data);

export const deleteUniversityOrgStructure = data =>
  post(url.DELETE_UNIVERSITY_ORG_STRUCTURE, data);

export const updateUniversityOrgStructure = data =>
  post(url.UPDATE_UNIVERSITY_ORG_STRUCTURE, data);

export const getUniversityOrgStructureDeletedValue = () =>
  get(url.GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE);

//update Sector
export const updateSector = data => post(url.UPDATE_SECTOR, data);

//delete Sector
export const deleteSector = data => post(url.DELETE_SECTOR, data);

// get PreReqTypes
export const getUserTypes = data => post(url.GET_USER_TYPES, data);

export const getUserTypesOpt = data => post(url.GET_USER_TYPES_OPT, data);

//get PreReqTypes profile
export const getUserTypeDeletedValue = () =>
  get(url.GET_USER_TYPE_DELETED_VALUE);

// add PreReqType
export const addNewUserType = data => post(url.ADD_NEW_USER_TYPE, data);

//update PreReqType
export const updateUserType = data => post(url.UPDATE_USER_TYPE, data);

//delete PreReqType
export const deleteUserType = data => post(url.DELETE_USER_TYPE, data);

// get StudyPlans
export const getStudyPlans = data => post(url.GET_STUDY_PLANS, data);

// get AllStudyPlans
export const getAllStudyPlans = data => post(url.GET_ALL_STUDY_PLANS, data);

// add StudyPlan
export const addNewStudyPlan = data => post(url.ADD_NEW_STUDY_PLAN, data);

//update StudyPlan
export const updateStudyPlan = data => post(url.UPDATE_STUDY_PLAN, data);

//delete StudyPlan
export const deleteStudyPlan = data => post(url.DELETE_STUDY_PLAN, data);

// GeneralizeStudyPlans
export const generalizeStudyPlans = data =>
  post(url.GENERALIZE_STUDY_PLANS, data);

// get FilteredCourses
export const getFilteredCourses = data => post(url.GET_FILTERED_COURSES, data);
// get FilteredCoursesPlan
export const getFilteredCoursesPlans = data =>
  post(url.GET_FILTERED_COURSES_PLANS, data);
//get StudyPlans profile
export const getStudyPlanProfile = () => get(url.GET_STUDY_PLAN_PROFILE);

// get PlanHours
export const getPlanHours = data => post(url.GET_PLAN_HOURS, data);
// add PlanHour
export const addNewPlanHour = data => post(url.ADD_NEW_PLAN_HOUR, data);

//update PlanHour
export const updatePlanHour = data => post(url.UPDATE_PLAN_HOUR, data);

// get Certificates
export const getCertificates = data => post(url.GET_CERTIFICATES, data);

// add certificate
export const addNewCertificate = data => post(url.ADD_NEW_CERTIFICATE, data);

//update certificate
export const updateCertificate = data => post(url.UPDATE_CERTIFICATE, data);

// delete Certificate
export const deleteCertificate = data => post(url.DELETE_CERTIFICATE, data);

export const getCertificateDeletedValue = () =>
  get(url.GET_CERTIFICATE_DELETED_VALUE);

// get Grades
export const getGrades = data => post(url.GET_GRADES, data);

export const getFilteredGrades = data => post(url.GET_FILTERED_GRADES, data);

// add certificate
export const addNewGrade = data => post(url.ADD_NEW_GRADE, data);

//update certificate
export const updateGrade = data => post(url.UPDATE_GRADE, data);

// delete Grade
export const deleteGrade = data => post(url.DELETE_GRADE, data);

export const getGradeDeletedValue = () => get(url.GET_GRADE_DELETED_VALUE);

// get CertificateLEVEL
export const getCertificateTypes = data =>
  post(url.GET_CERTIFICATESLEVELS, data);

// add certificateTypes
export const addNewCertificateType = data =>
  post(url.ADD_NEW_CERTIFICATE_TYPE, data);

//CERTIFICATE_TYPE
export const getCertificateTypeDeletedValue = () =>
  get(url.GET_CERTIFICATE_TYPE_DELETED_VALUE);

//update certificateType
export const updateCertificateType = data =>
  post(url.UPDATE_CERTIFICATE_TYPE, data);

//delete certificateType
export const deleteCertificateType = data =>
  post(url.DELETE_CERTIFICATE_TYPE, data);

// get studentManagement
export const getStudentManagements = data =>
  post(url.GET_STUDENTMANAGEMENTS, data);

// add studentManagement
export const addNewStudentManagement = data =>
  post(url.ADD_NEW_STUDENTMANAGEMENT, data);

//studentManagement
export const getStudentManagementProfile = () =>
  get(url.GET_STUDENTMANAGEMENT_PROFILE);

//update studentManagement
export const updateStudentManagement = data =>
  post(url.UPDATE_STUDENTMANAGEMENT, data);

//delete studentManagement
export const deleteStudentManagement = data =>
  post(url.DELETE_STUDENTMANAGEMENT, data);

// get studentsRequests
export const getStudentsRequests = data =>
  post(url.GET_STUDENTS_REQUESTS, data);

// add studentsRequests
export const addNewStudentRequest = data =>
  post(url.ADD_NEW_STUDENT_REQUEST, data);

//update studentsRequests
export const updateStudentRequest = data =>
  post(url.UPDATE_STUDENT_REQUEST, data);

//delete studentsRequests
export const deleteStudentRequest = data =>
  post(url.DELETE_STUDENT_REQUEST, data);

// get lastReqNum
export const getLastReqNum = data => post(url.GET_LAST_REQUEST_NUM, data);

// get RequestDetails
export const getRequestDetails = data => post(url.GET_REQUEST_DETAILS, data);

// TransferCourse
export const getTransferCourses = data => post(url.GET_TRANSFER_COURSES, data);

// TransferCourse
export const addNewTransferCourse = data =>
  post(url.ADD_NEW_TRANSFER_COURSE, data);

//TransferCourse
export const updateTransferCourse = data =>
  post(url.UPDATE_TRANSFER_COURSE, data);

export const updateTransferCourseState = data =>
  post(url.UPDATE_TRANSFER_COURSE_STATE, data);

//TransferCourse
export const deleteTransferCourse = data =>
  post(url.DELETE_TRANSFER_COURSE, data);

// PrevUnivCourse
export const getPrevUnivCourses = data => post(url.GET_PREV_UNI_COURSES, data);

// PrevUnivCourse
export const addNewPrevUnivCourse = data =>
  post(url.ADD_NEW_PREV_UNI_COURSE, data);

// PrevUnivCourse
export const updatePrevUnivCourse = data =>
  post(url.UPDATE_PREV_UNI_COURSE, data);

// PrevUnivCourse
export const deletePrevUnivCourse = data =>
  post(url.DELETE_PREV_UNI_COURSE, data);

// get studentHistory
export const getStudentsHistory = data => post(url.GET_STUDENTS_HISTORY, data);

// add studentHistory
export const addNewStudentHistory = data =>
  post(url.ADD_NEW_STUDENT_HISTORY, data);

//update studentHistory
export const calculateStudentHistory = data =>
  post(url.CALCULATE_STUDENT_HISTORY, data);

//delete studentHistory
export const calculateAllStudentHistory = data =>
  post(url.CALCULATE_ALL_STUDENT_HISTORY, data);

// update user
export const updateUser = user => put(url.UPDATE_USER, user);

// delete user
export const deleteUser = user => del(url.DELETE_USER, { headers: { user } });

// get Nationalities
export const getNationalities = data => post(url.GET_NATIONALITIES, data);

// add nationality
export const addNewNationality = data => post(url.ADD_NEW_NATIONALITY, data);

// import nationality
export const importNationalities = data => post(url.IMPORT_NATIONALITIES, data);

//update nationality
export const updateNationality = data => post(url.UPDATE_NATIONALITY, data);

// delete user
export const deleteNationality = data => post(url.DELETE_NATIONALITY, data);

// get Relatives
export const getRelatives = data => post(url.GET_RELATIVES, data);

// add relative
export const addNewRelative = data => post(url.ADD_NEW_RELATIVE, data);

// import relative
export const importRelatives = data => post(url.IMPORT_RELATIVES, data);

//update relative
export const updateRelative = data => post(url.UPDATE_RELATIVE, data);

// delete user
export const deleteRelative = data => post(url.DELETE_RELATIVE, data);

export const getRelativeDeletedValue = () =>
  get(url.GET_RELATIVE_DELETED_VALUE);

//CONTACTS
export const getUserProfile = () => get(url.GET_USER_PROFILE);

// get Countries
export const getCountries = data => post(url.GET_COUNTRIES, data);

//get country profile
export const getCountryDeletedValue = () => get(url.GET_COUNTRY_DELETED_VALUE);

// add Country
export const addNewCountry = data => post(url.ADD_NEW_COUNTRY, data);

//update country
export const updateCountry = data => post(url.UPDATE_COUNTRY, data);

// import country
export const importCountries = data => post(url.IMPORT_COUNTRIES, data);

//delete country
export const deleteCountry = data => post(url.DELETE_COUNTRY, data);

// get Cities
export const getCities = data => post(url.GET_CITIES, data);

// add City
export const addNewCity = data => post(url.ADD_NEW_CITY, data);

// import cities
export const importCities = data => post(url.IMPORT_CITIES, data);

//update city
export const updateCity = data => post(url.UPDATE_CITY, data);

//delete city
export const deleteCity = data => post(url.DELETE_CITY, data);

export const getCityDeletedValue = () => get(url.GET_CITY_DELETED_VALUE);

// get Genders
export const getGenders = data => post(url.GET_GENDERS, data);

export const addNewGender = data => post(url.ADD_NEW_GENDER, data);

export const updateGender = data => post(url.UPDATE_GENDER, data);

export const deleteGender = data => post(url.DELETE_GENDER, data);

export const getGenderDeletedValue = () => get(url.GET_GENDER_DELETED_VALUE);
// get StudentsDecrees

export const getUniversityStudentsDecrees = data =>
  post(url.GET_UNIVERSITY_STUDENTS_DECREES, data);
// get coursesDecrees

export const getCoursesDecrees = data => post(url.GET_COURSES_DECREES, data);

export const getStudentsDecrees = data => post(url.GET_STUDENTS_DECREES, data);

export const addNewStudentsDecree = data =>
  post(url.ADD_NEW_STUDENTS_DECREES, data);

export const updateStudentsDecree = data =>
  post(url.UPDATE_STUDENTS_DECREES, data);

export const deleteStudentsDecree = data =>
  post(url.DELETE_STUDENTS_DECREES, data);

export const getStudentsDecreeDeletedValue = () =>
  get(url.GET_STUDENTS_DECREES_DELETED_VALUE);

export const getDecreeStatus = data => post(url.GET_DECREE_STATUS, data);

export const getStudentDecreesDismiss = data =>
  post(url.GET_STUDENT_DECREES_DISMISS, data);

// get Decisions
export const getDecisions = data => post(url.GET_DECISIONS, data);

export const addNewDecision = data => post(url.ADD_NEW_DECISION, data);

export const updateDecision = data => post(url.UPDATE_DECISION, data);

export const deleteDecision = data => post(url.DELETE_DECISION, data);

export const getDecisionDeletedValue = () =>
  get(url.GET_DECISION_DELETED_VALUE);

export const getDecisionCategories = data =>
  post(url.GET_DECISION_CATEGORIES, data);

// get Decision Makers
export const getDecisionMakers = data => post(url.GET_DECISION_MAKERS, data);

// get Decision Status
export const getDecisionStatus = data => post(url.GET_DECISION_STATUS, data);

// getTurnReason
export const getTurnReasons = data => post(url.GET_TURN_REASONS, data);

// get DecisionsRulesCanceledReasons
export const getDecisionsRulesCanceledReasons = data =>
  post(url.GET_DECISIONS_RULES_CANCELED_REASONS, data);

export const addNewDecisionsRulesCanceledReason = data =>
  post(url.ADD_NEW_DECISIONS_RULES_CANCELED_REASON, data);

export const updateDecisionsRulesCanceledReason = data =>
  post(url.UPDATE_DECISIONS_RULES_CANCELED_REASON, data);

export const deleteDecisionsRulesCanceledReason = data =>
  post(url.DELETE_DECISIONS_RULES_CANCELED_REASON, data);

export const getDecisionsRulesCanceledReasonDeletedValue = () =>
  get(url.GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE);
// get DecisionsRulesReasons
export const getDecisionsRulesReasons = data =>
  post(url.GET_DECISIONS_RULES_REASONS, data);

export const addNewDecisionsRulesReason = data =>
  post(url.ADD_NEW_DECISIONS_RULES_REASON, data);

export const updateDecisionsRulesReason = data =>
  post(url.UPDATE_DECISIONS_RULES_REASON, data);

export const deleteDecisionsRulesReason = data =>
  post(url.DELETE_DECISIONS_RULES_REASON, data);

export const getDecisionsRulesReasonDeletedValue = () =>
  get(url.GET_DECISIONS_RULES_REASON_DELETED_VALUE);

// get DecisionsRulesRoles
export const getDecisionsRulesRoles = data =>
  post(url.GET_DECISIONS_RULES_ROLES, data);

export const addNewDecisionsRulesRole = data =>
  post(url.ADD_NEW_DECISIONS_RULES_ROLE, data);

export const updateDecisionsRulesRole = data =>
  post(url.UPDATE_DECISIONS_RULES_ROLE, data);

export const deleteDecisionsRulesRole = data =>
  post(url.DELETE_DECISIONS_RULES_ROLE, data);

export const getDecisionsRulesRoleDeletedValue = () =>
  get(url.GET_DECISIONS_RULES_ROLE_DELETED_VALUE);

// get Grants
export const getGrants = data => post(url.GET_GRANTS, data);

export const addNewGrant = data => post(url.ADD_NEW_GRANT, data);

export const updateGrant = data => post(url.UPDATE_GRANT, data);

export const deleteGrant = data => post(url.DELETE_GRANT, data);

export const getGrantDeletedValue = () => get(url.GET_GRANT_DELETED_VALUE);

// get Roles
export const getRoles = data => post(url.GET_ROLES, data);

export const addNewRole = data => post(url.ADD_NEW_ROLE, data);

export const updateRole = data => post(url.UPDATE_ROLE, data);

export const deleteRole = data => post(url.DELETE_ROLE, data);

export const getRoleDeletedValue = () => get(url.GET_ROLE_DELETED_VALUE);

// get RoleUsers
export const addNewRoleUser = data => post(url.ADD_NEW_ROLE_USER, data);

// get RolePermissions
export const getRolePermissions = data => post(url.GET_ROLE_PERMISSIONS, data);

export const addNewRolePermission = data =>
  post(url.ADD_NEW_ROLE_PERMISSION, data);

export const updateRolePermission = data =>
  post(url.UPDATE_ROLE_PERMISSION, data);

export const deleteRolePermission = data =>
  post(url.DELETE_ROLE_PERMISSION, data);

export const getRolePermissionDeletedValue = () =>
  get(url.GET_ROLE_PERMISSION_DELETED_VALUE);

// get UserMngs
export const getUserMngs = data => post(url.GET_USER_MNGS, data);

export const addNewUserMng = data => post(url.ADD_NEW_USER_MNG, data);

export const updateUserMng = data => post(url.UPDATE_USER_MNG, data);

export const deleteUserMng = data => post(url.DELETE_USER_MNG, data);

export const getUserMngDeletedValue = () => get(url.GET_USER_MNG_DELETED_VALUE);

export const addNewUserRole = data => post(url.ADD_NEW_USER_ROLE, data);

// get UserFaculties
export const getUserFaculties = data => post(url.GET_USER_FACULTIES, data);

export const addNewUserFaculty = data => post(url.ADD_NEW_USER_FACULTY, data);

export const deleteUserFaculty = data => post(url.DELETE_USER_FACULTY, data);

export const getUserFacultyDeletedValue = () =>
  get(url.GET_USER_FACULTY_DELETED_VALUE);

// get prereqs
export const getPrereqs = data => post(url.GET_PREREQS, data);

//get prereq profile
export const getPrereqDeletedValue = () => get(url.GET_PREREQ_DELETED_VALUE);

// add Prereq
export const addNewPrereq = data => post(url.ADD_NEW_PREREQ, data);

//update prereq
export const updatePrereq = data => post(url.UPDATE_PREREQ, data);

//delete prereq
export const deletePrereq = data => post(url.DELETE_PREREQ, data);

// get Governorate
export const getGovernorates = data => post(url.GET_GOVERNORATES, data);

//get Governorate profile
export const getGovernorateDeletedValue = () =>
  get(url.GET_GOVERNORATE_DELETED_VALUE);

// add Governorate
export const addNewGovernorate = data => post(url.ADD_NEW_GOVERNORATE, data);

// import Governorate
export const importGovernorates = data => post(url.IMPORT_GOVERNORATES, data);

//update Governorate
export const updateGovernorate = data => post(url.UPDATE_GOVERNORATE, data);

//delete Governorate
export const deleteGovernorate = data => post(url.DELETE_GOVERNORATE, data);

// get Structure
export const getStructures = data => post(url.GET_STRUCTURES, data);

//get Structure profile
export const getStructureDeletedValue = () =>
  get(url.GET_STRUCTURE_DELETED_VALUE);

// add Structure
export const addNewStructure = data => post(url.ADD_NEW_STRUCTURE, data);

//update Structure
export const updateStructure = data => post(url.UPDATE_STRUCTURE, data);

//delete Structure
export const deleteStructure = data => post(url.DELETE_STRUCTURE, data);

// get Currency
export const getCurrencies = data => post(url.GET_CURRENCIES, data);

//get Currency profile
export const getCurrencyDeletedValue = () =>
  get(url.GET_CURRENCY_DELETED_VALUE);

// add Currency
export const addNewCurrency = data => post(url.ADD_NEW_CURRENCY, data);

//update Currency
export const updateCurrency = data => post(url.UPDATE_CURRENCY, data);

//delete Currency
export const deleteCurrency = data => post(url.DELETE_CURRENCY, data);

// get Fines
export const getFines = data => post(url.GET_FINES, data);

//get Fine Deleted value
export const getFineDeletedValue = () => get(url.GET_FINE_DELETED_VALUE);

// add Fine
export const addNewFine = data => post(url.ADD_NEW_FINE, data);

//update Fine
export const updateFine = data => post(url.UPDATE_FINE, data);

//delete Fine
export const deleteFine = data => post(url.DELETE_FINE, data);

// get FineDefinitions
export const getFinesDefinition = data => post(url.GET_FINES_DEFINITION, data);

// get criteria
export const getCriteria = data => post(url.GET_CRITERIA, data);

//get FineDefinition Deleted value
export const getFineDefinitionDeletedValue = () =>
  get(url.GET_FINE_DEFINITION_DELETED_VALUE);

// add FineDefinition
export const addNewFineDefinition = data =>
  post(url.ADD_NEW_FINE_DEFINITION, data);

//update FineDefinition
export const updateFineDefinition = data =>
  post(url.UPDATE_FINE_DEFINITION, data);

//delete FineDefinition
export const deleteFineDefinition = data =>
  post(url.DELETE_FINE_DEFINITION, data);

// get RequestFeess
export const getRequestsFees = data => post(url.GET_REQUESTS_FEES, data);

//get RequestFees Deleted value
export const getRequestFeesDeletedValue = () =>
  get(url.GET_REQUEST_FEES_DELETED_VALUE);

// add RequestFees
export const addNewRequestFees = data => post(url.ADD_NEW_REQUEST_FEES, data);

//update RequestFees
export const updateRequestFees = data => post(url.UPDATE_REQUEST_FEES, data);

//delete RequestFees
export const deleteRequestFees = data => post(url.DELETE_REQUEST_FEES, data);

export const getRequestCriteria = data => post(url.GET_REQUEST_CRITERIA, data);

export const copyRequestFees = data => post(url.COPY_REQUEST_FEES, data);

export const getYearContents = data => post(url.GET_YEAR_CONTENTS, data);

// get periods
export const getPeriods = data => post(url.GET_PERIODS, data);
export const getFilteredPeriods = data => post(url.GET_FILTERED_PERIODS, data);

//get Period Deleted value
export const getPeriodDeletedValue = () => get(url.GET_PERIOD_DELETED_VALUE);

// add Period
export const addNewPeriod = data => post(url.ADD_NEW_PERIOD, data);

//update Period
export const updatePeriod = data => post(url.UPDATE_PERIOD, data);

//delete Period
export const deletePeriod = data => post(url.DELETE_PERIOD, data);

// get yearContent
export const getFiscalYearContents = data =>
  post(url.GET_FISCAL_YEAR_CONTENTS, data);
export const getFiscalYears = data => post(url.GET_FISCAL_YEARS, data);

//delete FineDefinition
export const copyFine = data => post(url.COPY_FINE, data);

// get Fees Definition
export const getFeesDefinition = data => post(url.GET_FEES_DEFINITION, data);

//get FeesDefinition Deleted value
export const getFeesDefinitionDeletedValue = () =>
  get(url.GET_FEES_DEFINITION_DELETED_VALUE);

// add FeesDefinition
export const addNewFeesDefinition = data =>
  post(url.ADD_NEW_FEES_DEFINITION, data);

//update FeesDefinition
export const updateFeesDefinition = data =>
  post(url.UPDATE_FEES_DEFINITION, data);

//delete FeesDefinition
export const deleteFeesDefinition = data =>
  post(url.DELETE_FEES_DEFINITION, data);

//copy
export const copyFees = data => post(url.COPY_FEES, data);

// get Fees Condition
export const getFeesConditions = data => post(url.GET_FEES_CONDITIONS, data);

// add FeesCondition
export const addNewFeesCondition = data =>
  post(url.ADD_NEW_FEES_CONDITION, data);

//update FeesCondition
export const updateFeesCondition = data =>
  post(url.UPDATE_FEES_CONDITION, data);

//delete FeesCondition
export const deleteFeesCondition = data =>
  post(url.DELETE_FEES_CONDITION, data);

// get Fees Price
export const getFeesPrices = data => post(url.GET_FEES_PRICES, data);

// add FeesPrice
export const addNewFeesPrice = data => post(url.ADD_NEW_FEES_PRICE, data);

//update FeesPrice
export const updateFeesPrice = data => post(url.UPDATE_FEES_PRICE, data);

//delete FeesPrice
export const deleteFeesPrice = data => post(url.DELETE_FEES_PRICE, data);

//copy
export const copyFeesPrice = data => post(url.COPY_FEES_PRICE, data);

// get Fees Service
export const getFeesServices = data => post(url.GET_FEES_SERVICES, data);

// add FeesService
export const addNewFeesService = data => post(url.ADD_NEW_FEES_SERVICE, data);

//update FeesService
export const updateFeesService = data => post(url.UPDATE_FEES_SERVICE, data);

//delete FeesService
export const deleteFeesService = data => post(url.DELETE_FEES_SERVICE, data);

//copy
export const copyFeesService = data => post(url.COPY_FEES_SERVICE, data);

// get Services
export const getServices = data => post(url.GET_SERVICES, data);

//get Service Deleted value
export const getServiceDeletedValue = () => get(url.GET_SERVICE_DELETED_VALUE);

// add Service
export const addNewService = data => post(url.ADD_NEW_SERVICE, data);

//update Service
export const updateService = data => post(url.UPDATE_SERVICE, data);

//delete Service
export const deleteService = data => post(url.DELETE_SERVICE, data);

// get filtered periods
export const getFiscalYearDetails = data =>
  post(url.GET_FISCAL_YEAR_DETAILS, data);

// get execute methods
export const getExecuteMethods = data => post(url.GET_EXECUTE_METHODS, data);

// get Requests
export const getRequests = data => post(url.GET_REQUESTS, data);

//get Request Deleted value
export const getRequestDeletedValue = () => get(url.GET_REQUEST_DELETED_VALUE);

// add Request
export const addNewRequest = data => post(url.ADD_NEW_REQUEST, data);

//update Request
export const updateRequest = data => post(url.UPDATE_REQUEST, data);

//delete Request
export const deleteRequest = data => post(url.DELETE_REQUEST, data);

// get Document
export const getDocuments = data => post(url.GET_DOCUMENTS, data);

//get Document profile
export const getDocumentDeletedValue = () =>
  get(url.GET_DOCUMENT_DELETED_VALUE);

// add Document
export const addNewDocument = data => post(url.ADD_NEW_DOCUMENT, data);

//update Document
export const updateDocument = data => post(url.UPDATE_DOCUMENT, data);

//delete Document
export const deleteDocument = data => post(url.DELETE_DOCUMENT, data);

// get regReqDocument
export const getRegReqDocuments = data => post(url.GET_REG_REQ_DOCUMENTS, data);

export const getRegReqDocumentDeletedValue = () =>
  get(url.GET_REG_REQ_DOCUMENT_DELETED_VALUE);

export const addNewRegReqDocument = data =>
  post(url.ADD_NEW_REG_REQ_DOCUMENT, data);

export const updateRegReqDocument = data =>
  post(url.UPDATE_REG_REQ_DOCUMENT, data);

export const deleteRegReqDocument = data =>
  post(url.DELETE_REG_REQ_DOCUMENT, data);

export const copyRegReqDoc = data => post(url.COPY_REG_REQ_DOC, data);

// get Document
export const getUniDocuments = data => post(url.GET_UNI_DOCUMENTS, data);

//get UniDocument
export const getUniDocumentDeletedValue = () =>
  get(url.GET_UNI_DOCUMENT_DELETED_VALUE);

// add UniDocument
export const addNewUniDocument = data => post(url.ADD_NEW_UNI_DOCUMENT, data);

//update UniDocument
export const updateUniDocument = data => post(url.UPDATE_UNI_DOCUMENT, data);

//delete UniDocument
export const deleteUniDocument = data => post(url.DELETE_UNI_DOCUMENT, data);

// get Universityrequirement
export const getUniversityrequirements = () =>
  get(url.GET_UNIVERSITYREQUIREMENTS);

//get Universityrequirement profile
export const getUniversityrequirementProfile = () =>
  get(url.GET_UNIVERSITYREQUIREMENTS_PROFILE);

// add Universityrequirement
export const addNewUniversityrequirement = universityrequirement =>
  post(url.ADD_NEW_UNIVERSITYREQUIREMENTS, universityrequirement);

//update Universityrequirement
export const updateUniversityrequirement = universityrequirement => {
  put(url.UPDATE_UNIVERSITYREQUIREMENTS, universityrequirement);
};

//delete Universityrequirement
export const deleteUniversityrequirement = universityrequirement =>
  del(url.DELETE_UNIVERSITYREQUIREMENTS, {
    headers: { universityrequirement },
  });

// get AcademicCertificate
export const getAcademicCertificates = data =>
  post(url.GET_ACADEMICCERTIFICATES, data);

// add course
export const addNewAcademicCertificate = data =>
  post(url.ADD_NEW_ACADEMICCERTIFICATE, data);

//update course
export const updateAcademicCertificate = data =>
  post(url.UPDATE_ACADEMICCERTIFICATE, data);

//delete course
export const deleteAcademicCertificate = data =>
  post(url.DELETE_ACADEMICCERTIFICATE, data);

// get Course
export const getCourses = data => post(url.GET_COURSES, data);

// add course
export const addNewCourse = data => post(url.ADD_NEW_COURSE, data);

//update course
export const updateCourse = data => post(url.UPDATE_COURSE, data);

//delete course
export const deleteCourse = data => post(url.DELETE_COURSE, data);

export const getCourseDeletedValue = () => get(url.GET_COURSE_DELETED_VALUE);

// get Course_Content_Course
export const getCourseContentsCourse = data =>
  post(url.GET_COURSE_CONTENTS_COURSE, data);

// add course
export const addNewCourseContentCourse = data =>
  post(url.ADD_NEW_COURSE_CONTENT_COURSE, data);

//update course
export const updateCourseContentCourse = data =>
  post(url.UPDATE_COURSE_CONTENT_COURSE, data);

//delete course
export const deleteCourseContentCourse = data =>
  post(url.DELETE_COURSE_CONTENT_COURSE, data);

export const getCourseContentDeletedValue = () =>
  get(url.GET_COURSE_CONTENT_DELETED_VALUE);

// get default value
export const getDefaultValues = data => post(url.GET_DEFAULTVALUES, data);

// get Course_Required_Course
export const getCourseRequiredCourses = data =>
  post(url.GET_COURSE_REQUIRED_COURSES, data);

// get Course Opt
export const getCoursesOpt = data => post(url.GET_COURSES_OPT, data);

// add course
export const addNewCourseRequiredCourse = data =>
  post(url.ADD_NEW_COURSE_REQUIRED_COURSE, data);

//update course
export const updateCourseRequiredCourse = data =>
  post(url.UPDATE_COURSE_REQUIRED_COURSE, data);

//delete course
export const deleteCourseRequiredCourse = data =>
  post(url.DELETE_COURSE_REQUIRED_COURSE, data);

// get CourseContent
export const getCourseContents = data => post(url.GET_COURSE_CONTENTS, data);

//get CourseContent profile
export const getCourseContentProfile = () =>
  get(url.GET_COURSE_CONTENTS_PROFILE);

// add CourseContent
export const addNewCourseContent = data =>
  post(url.ADD_NEW_COURSE_CONTENT, data);

//update CourseContent
export const updateCourseContent = data =>
  post(url.UPDATE_COURSE_CONTENT, data);

//delete CourseContent
export const deleteCourseContent = data =>
  post(url.DELETE_COURSE_CONTENT, data);

// get CourseType
export const getCourseTypes = data => post(url.GET_COURSETYPES, data);

//get CourseType profile
export const getCourseTypeDeletedValue = () =>
  get(url.GET_COURSETYPE_DELETED_VALUE);

// add CourseType
export const addNewCourseType = data => post(url.ADD_NEW_COURSETYPE, data);

//update CourseType
export const updateCourseType = data => post(url.UPDATE_COURSETYPE, data);

//delete CourseType
export const deleteCourseType = data => post(url.DELETE_COURSETYPE, data);

// get Level
export const getLevels = data => post(url.GET_LEVELS, data);

//get Level profile
export const getLevelDeletedValue = () => get(url.GET_LEVEL_DELETED_VALUE);

// add Level
export const addNewLevel = data => post(url.ADD_NEW_LEVEL, data);

//update Level
export const updateLevel = data => post(url.UPDATE_LEVEL, data);

//delete Level
export const deleteLevel = data => post(url.DELETE_LEVEL, data);

// get Schedule
export const getSchedules = data => post(url.GET_SCHEDULES, data);

//get Schedule profile
export const getScheduleProfile = () => get(url.GET_SCHEDULES_PROFILE);

// add Schedule
export const addNewSchedule = data => post(url.ADD_NEW_SCHEDULE, data);

//update Schedule
export const updateSchedule = data => post(url.UPDATE_SCHEDULE, data);

//delete Schedule
export const deleteSchedule = data => post(url.DELETE_SCHEDULE, data);

// get CoursesOffering
export const getCoursesOffering = data => post(url.GET_COURSES_OFFERING, data);

// get MethodsOfOfferingCourses
export const getMethodsOfOfferingCourses = data =>
  post(url.GET_METHODS_OF_OFFERING_COURSES, data);

// get ALlCoursesOffering
export const getAllCoursesOffering = data =>
  post(url.GET_ALL_COURSES_OFFERING, data);

//get CoursesOffering profile
export const getCourseOfferingProfile = () =>
  get(url.GET_COURSE_OFFERING_PROFILE);

// add CoursesOffering
export const addNewCourseOffering = data =>
  post(url.ADD_NEW_COURSE_OFFERING, data);

//update CoursesOffering
export const updateCourseOffering = data =>
  post(url.UPDATE_COURSE_OFFERING, data);

//delete CoursesOffering
export const deleteCourseOffering = data =>
  post(url.DELETE_COURSE_OFFERING, data);

export const getFilteredSections = data =>
  post(url.GET_FILTERED_SECTIONS, data);

// get SectionLabs
export const getSectionLabs = data => post(url.GET_SECTION_LABS, data);

// get SectionLabDetails
export const getSectionLabDetails = data =>
  post(url.GET_SECTION_LAB_DETAILS, data);

//get SectionLabs profile
export const getSectionLabProfile = () => get(url.GET_SECTION_LAB_PROFILE);

// add SectionLabs
export const addNewSectionLab = data => post(url.ADD_NEW_SECTION_LAB, data);

// add SectionLabs
export const addNewSectionLabDetail = data =>
  post(url.ADD_NEW_SECTION_LAB_DETAIL, data);

//update SectionLabs
export const updateSectionLab = data => post(url.UPDATE_SECTION_LAB, data);

//updateSectionLabDetail
export const updateSectionLabDetail = data =>
  post(url.UPDATE_SECTION_LAB_DETAIL, data);

//delete SectionLabs
export const deleteSectionLab = data => post(url.DELETE_SECTION_LAB, data);

//delete SectionLab
export const deleteSectionLabDetail = data =>
  post(url.DELETE_SECTION_LAB_DETAIL, data);

// get ScheduleTiming
export const getScheduleTimings = data => post(url.GET_SCHEDULE_TIMINGS, data);

// getHallTimings,
export const getHallTimings = data => post(url.GET_HALL_TIMINGS, data);

//get ScheduleTiming profile
export const getScheduleTimingProfile = () =>
  get(url.GET_SCHEDULE_TIMINGS_PROFILE);

// add ScheduleTiming
export const addNewScheduleTiming = data =>
  post(url.ADD_NEW_SCHEDULE_TIMING, data);

export const getScheduleMsgValue = () => get(url.GET_SCHEDULE_MSG_VALUE);
//delete ScheduleTiming
export const deleteScheduleTiming = data =>
  post(url.DELETE_SCHEDULE_TIMING, data);
// get ScheduleTimingDescs
export const getScheduleTimingDescs = data =>
  post(url.GET_SCHEDULE_TIMING_DESCS, data);

// get TimeLine
export const getTimeLines = data => post(url.GET_TIMELINES, data);

export const getRequestsPeriodAllowance = data =>
  post(url.GET_REQUEST_PERIOD_ALLOWANCE, data);

//get RequestsPeriodAllowanceTime
export const getRequestsPeriodAllowanceTime = data =>
  post(url.GET_REQUEST_PERIOD_ALLOWANCE_TIME, data);

export const updateRequestsPeriodAllowanceTime = data =>
  post(url.UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME, data);

export const generalizeRequestsPeriodAllowanceTime = data =>
  post(url.GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME, data);

// get RequestsPeriodPermission
export const getRequestsPeriodPermission = data =>
  post(url.GET_REQUEST_PERIOD_PERMISSION, data);

export const addRequestsPeriodPermission = data =>
  post(url.ADD_REQUEST_PERIOD_PERMISSION, data);

export const updateRequestsPeriodPermission = data =>
  post(url.UPDATE_REQUEST_PERIOD_PERMISSION, data);

export const deleteRequestsPeriodPermission = data =>
  post(url.DELETE_REQUEST_PERIOD_PERMISSION, data);

//get TimeLine profile
export const getTimeLineDeletedValue = () =>
  get(url.GET_TIMELINE_DELETED_VALUE);

// add TimeLine
export const addNewTimeLine = data => post(url.ADD_NEW_TIMELINE, data);

//update TimeLine
export const updateTimeLine = data => post(url.UPDATE_TIMELINE, data);

//delete TimeLine
export const deleteTimeLine = data => post(url.DELETE_TIMELINE, data);

// get WeekDay
export const getWeekDays = data => post(url.GET_WEEKDAYS, data);

//get WeekDay profile
export const getWeekDayProfile = () => get(url.GET_WEEKDAYS_PROFILE);

// add WeekDay
export const addNewWeekDay = data => post(url.ADD_NEW_WEEKDAY, data);

//update WeekDay
export const updateWeekDay = data => post(url.UPDATE_WEEKDAY, data);

//delete WeekDay
export const deleteWeekDay = data => post(url.DELETE_WEEKDAY, data);

// get Year
export const getYears = data => post(url.GET_YEARS, data);

//get Year profile
export const getYearDeletedValue = () => get(url.GET_YEAR_DELETED_VALUE);

// add Year
export const addNewYear = data => post(url.ADD_NEW_YEAR, data);

//update Year
export const updateYear = data => post(url.UPDATE_YEAR, data);

//delete Year
export const deleteYear = data => post(url.DELETE_YEAR, data);

// get Semester
export const getSemesters = data => post(url.GET_SEMESTERS, data);

//get Semester profile
export const getCurrentSemester = data => post(url.GET_CURRENT_SEMESTER, data);

// add Semester
export const addNewSemester = data => post(url.ADD_NEW_SEMESTER, data);

//update Semester
export const updateSemester = data => post(url.UPDATE_SEMESTER, data);

//delete Semester
export const deleteSemester = data => post(url.DELETE_SEMESTER, data);

export const getSemesterDeletedValue = () =>
  get(url.GET_SEMESTER_DELETED_VALUE);

// get Estimate
export const getEstimates = data => post(url.GET_ESTIMATES, data);

//get Estimate profile
export const getEstimateDeletedValue = () =>
  get(url.GET_ESTIMATE_DELETED_VALUE);

// add Estimate
export const addNewEstimate = data => post(url.ADD_NEW_ESTIMATE, data);

//update Estimate
export const updateEstimate = data => post(url.UPDATE_ESTIMATE, data);

//delete Estimate
export const deleteEstimate = data => post(url.DELETE_ESTIMATE, data);

// get GrantSponsor
export const getGrantSponsors = data => post(url.GET_GRANT_SPONSORS, data);

//get GrantSponsor profile
export const getGrantSponsorProfile = () => get(url.GET_GRANT_SPONSORS_PROFILE);

// add GrantSponsor
export const addNewGrantSponsor = data => post(url.ADD_NEW_GRANT_SPONSOR, data);

//update GrantSponsor
export const updateGrantSponsor = data => post(url.UPDATE_GRANT_SPONSOR, data);

//delete GrantSponsor
export const deleteGrantSponsor = data => post(url.DELETE_GRANT_SPONSOR, data);

export const getGrantSponsorDeletedValue = () =>
  get(url.GET_GRANT_SPONSOR_DELETED_VALUE);

// get AdmissionRequirement
export const getAdmissionRequirements = () =>
  get(url.GET_ADMISSIONREQUIREMENTS);

//get AdmissionRequirement profile
export const getAdmissionRequirementProfile = () =>
  get(url.GET_ADMISSIONREQUIREMENTS_PROFILE);

// add AdmissionRequirement
export const addNewAdmissionRequirement = admissionrequirement =>
  post(url.ADD_NEW_ADMISSIONREQUIREMENT, admissionrequirement);

//update AdmissionRequirement
export const updateAdmissionRequirement = admissionrequirement => {
  put(url.UPDATE_ADMISSIONREQUIREMENT, admissionrequirement);
};

//delete AdmissionRequirement
export const deleteAdmissionRequirement = admissionrequirement =>
  del(url.DELETE_ADMISSIONREQUIREMENT, { headers: { admissionrequirement } });

export const copyAdmissionCond = data => post(url.COPY_ADMISSION_COND, data);

//get nationality profile
export const getNationalityDeletedValue = () =>
  get(url.GET_NATIONALITY_DELETED_VALUE);

// get inboxmail
export const getInboxMails = () => get(url.GET_INBOX_MAILS);

// add inboxmail
export const addNewInboxMail = inboxmail =>
  post(url.ADD_NEW_INBOX_MAIL, inboxmail);

// delete inboxmail
export const deleteInboxMail = inboxmail =>
  del(url.DELETE_INBOX_MAIL, { headers: { inboxmail } });

// get starredmail
export const getStarredMails = () => get(url.GET_STARRED_MAILS);
// get importantmail
export const getImportantMails = () => get(url.GET_IMPORTANT_MAILS);

// get sent mail
export const getSentMails = () => get(url.GET_SENT_MAILS);

// get trash mail
export const getTrashMails = () => get(url.GET_TRASH_MAILS);

// get starredmail
export const getDraftMails = () => get(url.GET_DRAFT_MAILS);

// get dashboard charts data
export const getWeeklyData = () => get(url.GET_WEEKLY_DATA);
export const getYearlyData = () => get(url.GET_YEARLY_DATA);
export const getMonthlyData = () => get(url.GET_MONTHLY_DATA);

// get Faculties
export const getFaculties = data => post(url.GET_FACULTIES, data);
//update faculty
export const updateFaculty = data => post(url.UPDATE_FACULTY, data);

// get TempStudents
export const getTempStudents = data => post(url.GET_TEMPSTUDENTS, data);

// get YearSemesters
export const getYearSemesters = data => post(url.GET_YEAR_SEMESTERS, data);

// get Departments
export const getDepartments = data => post(url.GET_DEPARTMENTS, data);

// get Departments
export const getFilteredDepartments = data =>
  post(url.GET_FILTERED_DEPARTMENTS, data);

// add Department
export const addNewDepartment = data => post(url.ADD_NEW_DEPARTMENT, data);

//update Department
export const updateDepartment = data => post(url.UPDATE_DEPARTMENT, data);

//delete Department
export const deleteDepartment = data => post(url.DELETE_DEPARTMENT, data);

// get Trainee options
export const getTraineesOptions = data => post(url.GET_TRAINEES_OPTIONS, data);

// update password
export const updatePassword = data => post(url.UPDATE_PASSWORD, data);

//GET SidbarContent
export const getSidebarContent = data => post(url.GET_SIDEBAR_CONTENTS, data);

export const getUserSidebarContent = data =>
  post(url.GET_USER_SIDEBAR_CONTENTS, data);

export const getRoleSidebar = data => post(url.GET_ROLE_SIDEBAR, data);

export const getSearchMenu = data => post(url.GET_SEARCH_MENU, data);

//GET TrainingMembers
export const getTrainingMembers = data => post(url.GET_TRAINING_MEMBERS, data);

export const getFilteredMembers = data => post(url.GET_FILTERED_MEMBERS, data);

export const addNewTrainingMember = data =>
  post(url.ADD_NEW_TRAINING_MEMBER, data);

export const updateTrainingMember = data =>
  post(url.UPDATE_TRAINING_MEMBER, data);

export const deleteTrainingMember = data =>
  post(url.DELETE_TRAINING_MEMBER, data);

export const getTrainingMemberDeletedValue = () =>
  get(url.GET_TRAINING_MEMBER_DELETED_VALUE);

//GET WarningRules
export const getWarningRules = data => post(url.GET_WARNING_RULES, data);

export const addNewWarningRule = data => post(url.ADD_NEW_WARNING_RULE, data);

export const updateWarningRule = data => post(url.UPDATE_WARNING_RULE, data);

export const deleteWarningRule = data => post(url.DELETE_WARNING_RULE, data);

export const getWarningRuleDeletedValue = () =>
  get(url.GET_WARNING_RULE_DELETED_VALUE);

export const getWarningRulesOpt = data => post(url.GET_WARNING_RULES_OPT, data);

//GET StdWarningTest
export const getStdWarningTest = data => post(url.GET_STD_WARNING_TEST, data);

export const addNewStdWarningTest = data =>
  post(url.ADD_NEW_STD_WARNING_TEST, data);

export const updateStdWarningTest = data =>
  post(url.UPDATE_STD_WARNING_TEST, data);

export const deleteStdWarningTest = data =>
  post(url.DELETE_STD_WARNING_TEST, data);

export const getStdWarningTestDeletedValue = () =>
  get(url.GET_STD_WARNING_TEST_DELETED_VALUE);

//GET ExceptionalPeriods
export const getExceptionalPeriods = data =>
  post(url.GET_EXCEPTIONAL_PERIODS, data);

export const addNewExceptionalPeriod = data =>
  post(url.ADD_NEW_EXCEPTIONAL_PERIOD, data);

export const updateExceptionalPeriod = data =>
  post(url.UPDATE_EXCEPTIONAL_PERIOD, data);

export const deleteExceptionalPeriod = data =>
  post(url.DELETE_EXCEPTIONAL_PERIOD, data);

export const getExceptionalPeriodDeletedValue = () =>
  get(url.GET_EXCEPTIONAL_PERIOD_DELETED_VALUE);

export const getExceptionalPeriodsOpt = data =>
  post(url.GET_EXCEPTIONAL_PERIODS_OPT, data);

export const getStudentStates = data => post(url.GET_STUDENT_STATES, data);

//Academic Load

export const getAcademicLoads = data => post(url.GET_ACADEMIC_LOADS, data);

export const addNewAcademicLoad = data => post(url.ADD_NEW_ACADEMIC_LOAD, data);

export const updateAcademicLoad = data => post(url.UPDATE_ACADEMIC_LOAD, data);

export const deleteAcademicLoad = data => post(url.DELETE_ACADEMIC_LOAD, data);

export const getAcademicLoadDeletedValue = () =>
  get(url.GET_ACADEMIC_LOAD_DELETED_VALUE);

//Distributing courses methods

export const getDistributingCoursesMethods = data =>
  post(url.GET_DISTRIBUTING_COURSES_METHODS, data);

export const addDistributingCoursesMethod = data =>
  post(url.ADD_NEW_DISTRIBUTING_COURSES_METHOD, data);

export const updateDistributingCoursesMethod = data =>
  post(url.UPDATE_DISTRIBUTING_COURSES_METHOD, data);

export const deleteDistributingCoursesMethod = data =>
  post(url.DELETE_DISTRIBUTING_COURSES_METHOD, data);

// Distributing courses methods Content

export const getDistributingCoursesMethodsContents = data =>
  post(url.GET_DISTRIBUTING_COURSES_METHODS_CONTENTS, data);

export const addDistributingCoursesMethodsContent = data =>
  post(url.ADD_NEW_DISTRIBUTING_COURSES_METHOD_CONTENT, data);

export const updateDistributingCoursesMethodsContent = data =>
  post(url.UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT, data);

export const deleteDistributingCoursesMethodsContent = data =>
  post(url.DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT, data);

//copy Distributing Methods
export const copyDistributingMethods = data =>
  post(url.COPY_DISTRIBUTING_METHODS, data);

//  Distributing courses

export const getDistributingCourses = data =>
  post(url.GET_DISTRIBUTING_COURSES, data);

export const addDistributingCourse = data =>
  post(url.ADD_NEW_DISTRIBUTING_COURSE, data);

export const deleteDistributingCourse = data =>
  post(url.DELETE_DISTRIBUTING_COURSE, data);

// Letter Grades

export const getLetterGrades = data => post(url.GET_LETTER_GRADES, data);

export const addNewLetterGrade = data => post(url.ADD_NEW_LETTER_GRADE, data);

export const updateLetterGrade = data => post(url.UPDATE_LETTER_GRADE, data);

export const deleteLetterGrade = data => post(url.DELETE_LETTER_GRADE, data);

export const getLetterGradeDeletedValue = () =>
  get(url.GET_LETTER_GRADE_DELETED_VALUE);

// Letter Grades details

export const getLetterGradeDetails = data =>
  post(url.GET_LETTER_GRADE_DETAILS, data);

export const addNewLetterGradeDetail = data =>
  post(url.ADD_NEW_LETTER_GRADE_DETAIL, data);

export const updateLetterGradeDetail = data =>
  post(url.UPDATE_LETTER_GRADE_DETAIL, data);

export const deleteLetterGradeDetail = data =>
  post(url.DELETE_LETTER_GRADE_DETAIL, data);

export const getLetterGradeDetailsDeletedValue = () =>
  get(url.GET_LETTER_GRADE_DETAILS_DELETED_VALUE);

// Transport Lines

export const getTransportLines = data => post(url.GET_TRANSPORT_LINES, data);

export const addNewTransportLine = data =>
  post(url.ADD_NEW_TRANSPORT_LINE, data);

export const updateTransportLine = data =>
  post(url.UPDATE_TRANSPORT_LINE, data);

export const deleteTransportLine = data =>
  post(url.DELETE_TRANSPORT_LINE, data);

export const getTransportLineDeletedValue = () =>
  get(url.GET_TRANSPORT_LINE_DELETED_VALUE);

// Transport Lines details

export const getTransportLineDetails = data =>
  post(url.GET_TRANSPORT_LINE_DETAILS, data);

export const addNewTransportLineDetail = data =>
  post(url.ADD_NEW_TRANSPORT_LINE_DETAIL, data);

export const updateTransportLineDetail = data =>
  post(url.UPDATE_TRANSPORT_LINE_DETAIL, data);

export const deleteTransportLineDetail = data =>
  post(url.DELETE_TRANSPORT_LINE_DETAIL, data);

export const getTransportLineDetailsDeletedValue = () =>
  get(url.GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE);

export const getStdsTransportLine = data =>
  post(url.GET_STDS_TRANSPORT_LINE, data);

export const addNewStdTransportLine = data =>
  post(url.ADD_NEW_STD_TRANSPORT_LINE, data);

export const updateStdTransportLine = data =>
  post(url.UPDATE_STD_TRANSPORT_LINE, data);

export const deleteStdTransportLine = data =>
  post(url.DELETE_STD_TRANSPORT_LINE, data);

export const getStdTransportLineDeletedValue = () =>
  get(url.GET_TRANSPORT_LINE_DELETED_VALUE);

export const getUnivStdDataList = data =>
  post(url.GET_UNIV_STD_DATA_LIST, data);

// levelingDecision

export const getLevelingDecisions = data =>
  post(url.GET_LEVELING_DECISIONS, data);

export const addNewLevelingDecision = data =>
  post(url.ADD_NEW_LEVELING_DECISION, data);

export const updateLevelingDecision = data =>
  post(url.UPDATE_LEVELING_DECISION, data);

export const deleteLevelingDecision = data =>
  post(url.DELETE_LEVELING_DECISION, data);

export const getLevelingDecisionDeletedValue = () =>
  get(url.GET_LEVELING_DECISION_DELETED_VALUE);

export const getLevelingDecisionDetailsDeletedValue = () =>
  get(url.GET_LEVELING_DECISION_DETAILS_DELETED_VALUE);

// levelingDecision details

export const getLevelingDecisionDetails = data =>
  post(url.GET_LEVELING_DECISION_DETAILS, data);

export const addNewLevelingDecisionDetail = data =>
  post(url.ADD_NEW_LEVELING_DECISION_DETAIL, data);

export const updateLevelingDecisionDetail = data =>
  post(url.UPDATE_LEVELING_DECISION_DETAIL, data);

export const deleteLevelingDecisionDetail = data =>
  post(url.DELETE_LEVELING_DECISION_DETAIL, data);
//copyFaculty
export const copyFaculty = data => post(url.COPY_FACULTY, data);

export const topSellingData = month =>
  get(`${url.TOP_SELLING_DATA}/${month}`, { params: { month } });

export const getEarningChartsData = month =>
  get(`${url.GET_EARNING_DATA}/${month}`, { params: { month } });

//CONTRACT_TYPE
export const getContractsTypes = data => post(url.GET_CONTRACTS_TYPES, data);

// add contractTypes
export const addNewContractType = data => post(url.ADD_NEW_CONTRACT_TYPE, data);

//CONTRACT_TYPE
export const getContractTypeDeletedValue = () =>
  get(url.GET_CONTRACT_TYPE_DELETED_VALUE);

//update contractType
export const updateContractType = data => post(url.UPDATE_CONTRACT_TYPE, data);

//delete contractType
export const deleteContractType = data => post(url.DELETE_CONTRACT_TYPE, data);

//ABSENCE_TYPE
export const getAbsencesTypes = data => post(url.GET_ABSENCES_TYPES, data);

// add
export const addNewAbsenceType = data => post(url.ADD_NEW_ABSENCE_TYPE, data);

//ABSENCE_TYPE
export const getAbsenceTypeDeletedValue = () =>
  get(url.GET_ABSENCE_TYPE_DELETED_VALUE);

//update
export const updateAbsenceType = data => post(url.UPDATE_ABSENCE_TYPE, data);

//delete
export const deleteAbsenceType = data => post(url.DELETE_ABSENCE_TYPE, data);

//ABSENCE_JUSTIFICATION
export const getAbsencesJustifications = data =>
  post(url.GET_ABSENCES_JUSTIFICATIONS, data);

// add
export const addNewAbsenceJustification = data =>
  post(url.ADD_NEW_ABSENCE_JUSTIFICATION, data);

export const getAbsenceJustificationDeletedValue = () =>
  get(url.GET_ABSENCE_JUSTIFICATION_DELETED_VALUE);

//update
export const updateAbsenceJustification = data =>
  post(url.UPDATE_ABSENCE_JUSTIFICATION, data);

//delete
export const deleteAbsenceJustification = data =>
  post(url.DELETE_ABSENCE_JUSTIFICATION, data);

//QUALIFICATION_TRACK
export const getQualificationsTracks = data =>
  post(url.GET_QUALIFICATIONS_TRACKS, data);
// ADD
export const addNewQualificationTrack = data =>
  post(url.ADD_NEW_QUALIFICATION_TRACK, data);
//
export const getQualificationTrackDeletedValue = () =>
  get(url.GET_QUALIFICATION_TRACK_DELETED_VALUE);
//UPDATE
export const updateQualificationTrack = data =>
  post(url.UPDATE_QUALIFICATION_TRACK, data);
//DELETE
export const deleteQualificationTrack = data =>
  post(url.DELETE_QUALIFICATION_TRACK, data);

//ABSENCE_PERCENT
export const getAbsencePercents = data => post(url.GET_ABSENCES_PERCENTS, data);

// add
export const addNewAbsencePercent = data =>
  post(url.ADD_NEW_ABSENCE_PERCENT, data);
export const getAbsencePercentDeletedValue = () =>
  get(url.GET_ABSENCE_PERCENT_DELETED_VALUE);

//update
export const updateAbsencePercent = data =>
  post(url.UPDATE_ABSENCE_PERCENT, data);

//delete
export const deleteAbsencePercent = data =>
  post(url.DELETE_ABSENCE_PERCENT, data);

//GRADE_VERSION
export const getGradesVersions = data => post(url.GET_GRADES_VERSIONS, data);

// add
export const addNewGradeVersion = data => post(url.ADD_NEW_GRADE_VERSION, data);

//GRADE_VERSION
export const getGradeVersionDeletedValue = () =>
  get(url.GET_GRADE_VERSION_DELETED_VALUE);

//update
export const updateGradeVersion = data => post(url.UPDATE_GRADE_VERSION, data);

//delete
export const deleteGradeVersion = data => post(url.DELETE_GRADE_VERSION, data);

// //Grade

export const getVersGrades = data => post(url.GET_VERS_GRADES, data);

// add
export const addNewVersGrade = data => post(url.ADD_NEW_VERS_GRADE, data);

//GRADE_VERSION
export const getVersGradeDeletedValue = () =>
  get(url.GET_VERS_GRADE_DELETED_VALUE);

//update
export const updateVersGrade = data => post(url.UPDATE_VERS_GRADE, data);

//delete
export const deleteVersGrade = data => post(url.DELETE_VERS_GRADE, data);
//ranks
export const getRanks = data => post(url.GET_RANKS, data);
//statuses
export const getFinishStatus = data => post(url.GET_FINISH_STATUS, data);

//ABSENCE WARNINGS
export const getAbsenceWarnings = data => post(url.GET_ABSENCE_WARNINGS, data);

export const getDecreeReason = data => post(url.GET_DECISION_REASONS, data);

export const addNewAbsenceWarning = data =>
  post(url.ADD_NEW_ABSENCE_WARNING, data);

export const getAbsenceWarningDeletedValue = () =>
  get(url.GET_ABSENCE_WARNING_DELETED_VALUE);

export const updateAbsenceWarning = data =>
  post(url.UPDATE_ABSENCE_WARNING, data);

export const deleteAbsenceWarning = data =>
  post(url.DELETE_ABSENCE_WARNING, data);

//OralWarningDecree
export const getOralWarningDecrees = data =>
  post(url.GET_ORAL_WARNING_DECREES, data);

export const addNewOralWarningDecree = data =>
  post(url.ADD_NEW_ORAL_WARNING_DECREE, data);

export const getOralWarningDecreeDeletedValue = () =>
  get(url.GET_ORAL_WARNING_DECREE_DELETED_VALUE);

export const updateOralWarningDecree = data =>
  post(url.UPDATE_ORAL_WARNING_DECREE, data);

export const deleteOralWarningDecree = data =>
  post(url.DELETE_ORAL_WARNING_DECREE, data);

//writtenWarningDecrees
export const getWrittenWarningDecrees = data =>
  post(url.GET_WRITTEN_WARNING_DECREES, data);

export const addNewWrittenWarningDecree = data =>
  post(url.ADD_NEW_WRITTEN_WARNING_DECREE, data);

export const getWrittenWarningDecreeDeletedValue = () =>
  get(url.GET_WRITTEN_WARNING_DECREE_DELETED_VALUE);

export const updateWrittenWarningDecree = data =>
  post(url.UPDATE_WRITTEN_WARNING_DECREE, data);

export const deleteWrittenWarningDecree = data =>
  post(url.DELETE_WRITTEN_WARNING_DECREE, data);

//DismissDecreeAbsence
export const getDismissDecreesAbsence = data =>
  post(url.GET_DISMISS_DECREES_ABSENCE, data);

export const addNewDismissDecreeAbsence = data =>
  post(url.ADD_NEW_DISMISS_DECREE_ABSENCE, data);

export const getDismissDecreeAbsenceDeletedValue = () =>
  get(url.GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE);

export const updateDismissDecreeAbsence = data =>
  post(url.UPDATE_DISMISS_DECREE_ABSENCE, data);

export const deleteDismissDecreeAbsence = data =>
  post(url.DELETE_DISMISS_DECREE_ABSENCE, data);

// DOCUMENT_TYPE
export const getDocumentsTypes = data => post(url.GET_DOCUMENTS_TYPES, data);

// add documentTypes
export const addNewDocumentType = data => post(url.ADD_NEW_DOCUMENT_TYPE, data);

// DOCUMENT_TYPE
export const getDocumentTypeDeletedValue = () =>
  get(url.GET_DOCUMENT_TYPE_DELETED_VALUE);

// update documentType
export const updateDocumentType = data => post(url.UPDATE_DOCUMENT_TYPE, data);

//hiddenGrade

export const getHiddenGrades = data => post(url.GET_HIDDEN_GRADES, data);

// add
export const addNewHiddenGrade = data => post(url.ADD_NEW_HIDDEN_GRADE, data);

// HIDDEN_GRADE
export const getHiddenGradeDeletedValue = () =>
  get(url.GET_HIDDEN_GRADE_DELETED_VALUE);

// update
export const updateHiddenGrade = data => post(url.UPDATE_HIDDEN_GRADE, data);
//getHideReasons
export const getHideReasons = data => post(url.GET_HIDE_REASONS, data);
//delete
export const deleteHiddenGrade = data => post(url.DELETE_HIDDEN_GRADE, data);

//EMPLOYMENT_CASE
export const getEmploymentCases = data => post(url.GET_EMPLOYMENT_CASES, data);

// add EmploymentCase

export const addNewEmploymentCase = data =>
  post(url.ADD_NEW_EMPLOYMENT_CASE, data);

//EMPLOYMENT_CASE
export const getEmploymentCaseDeletedValue = () =>
  get(url.GET_EMPLOYMENT_CASE_DELETED_VALUE);

//update EmploymentCase
export const updateEmploymentCase = data =>
  post(url.UPDATE_EMPLOYMENT_CASE, data);

//delete EmploymentCase
export const deleteEmploymentCase = data =>
  post(url.DELETE_EMPLOYMENT_CASE, data);

//WORK_CLASSIFICATION
export const getWorkClassifications = data =>
  post(url.GET_WORK_CLASSIFICATIONS, data);

// add WorkClassification

export const addNewWorkClassification = data =>
  post(url.ADD_NEW_WORK_CLASSIFICATION, data);

//WORK_CLASSIFICATION
export const getWorkClassificationDeletedValue = () =>
  get(url.GET_WORK_CLASSIFICATION_DELETED_VALUE);

//update WorkClassification
export const updateWorkClassification = data =>
  post(url.UPDATE_WORK_CLASSIFICATION, data);

//delete WorkClassification
export const deleteWorkClassification = data =>
  post(url.DELETE_WORK_CLASSIFICATION, data);

//EMPLOYEESNAMES
export const getEmployeesNames = data => post(url.GET_EMPLOYEES_NAMES, data);

//EMPLOYEE
export const getEmployees = data => post(url.GET_EMPLOYEES, data);

// add Employee

export const addNewEmployee = data => post(url.ADD_NEW_EMPLOYEE, data);

//EMPLOYEE
export const getEmployeeDeletedValue = () =>
  get(url.GET_EMPLOYEE_DELETED_VALUE);

//update Employee
export const updateEmployee = data => post(url.UPDATE_EMPLOYEE, data);

//delete Employee
export const deleteEmployee = data => post(url.DELETE_EMPLOYEE, data);

export const getNationalitiesOpt = data =>
  post(url.GET_NATIONALITIES_OPT, data);

export const getGendersch = data => post(url.GET_GENDERSCH, data);

export const getAdministrativeSupervisorsOpt = data =>
  post(url.GET_ADMINISTRATIVE_SUPERVISORS_OPT, data);

export const getPhysicalWorkLocationsOpt = data =>
  post(url.GET_PHYSIACL_WORK_LOCATIONS_OPT, data);

export const getJobRanksOpt = data => post(url.GET_JOB_RANKS_OPT, data);

export const getJobTitlesOpt = data => post(url.GET_JOB_TITLES_OPT, data);

export const getAcademicYearsOpt = data =>
  post(url.GET_ACADEMIC_YEARS_OPT, data);

export const getCountriesOpt = data => post(url.GET_COUNTRIES_OPT, data);

export const getCitiesOpt = data => post(url.GET_CITIES_OPT, data);

export const getStatesOpt = data => post(url.GET_STATES_OPT, data);

export const getCorporateNodesOpt = data =>
  post(url.GET_CORPORATE_NODES_OPT, data);

export const getCostCentersOpt = data => post(url.GET_COST_CENTERS_OPT, data);

//CONTRACT
export const getContracts = data => post(url.GET_CONTRACTS, data);

// add Contract

export const addNewContract = data => post(url.ADD_NEW_CONTRACT, data);

//CONTRACT
export const getContractDeletedValue = () =>
  get(url.GET_CONTRACT_DELETED_VALUE);

//update Contract
export const updateContract = data => post(url.UPDATE_CONTRACT, data);

//delete Contract
export const deleteContract = data => post(url.DELETE_CONTRACT, data);

//JustifyTraineeAbsence

export const getJustifyTraineesAbsence = data =>
  post(url.GET_JUSTIFY_TRAINEES_ABSENCE, data);

// add JustifyTraineeAbsence

export const addNewJustifyTraineeAbsence = data =>
  post(url.ADD_NEW_JUSTIFY_TRAINEE_ABSENCE, data);

//JUSTIFY_TRAINEE_ABSENCE
export const getJustifyTraineeAbsenceDeletedValue = () =>
  get(url.GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE);

//update JustifyTraineeAbsence
export const updateJustifyTraineeAbsence = data =>
  post(url.UPDATE_JUSTIFY_TRAINEE_ABSENCE, data);

//delete JustifyTraineeAbsence
export const deleteJustifyTraineeAbsence = data =>
  post(url.DELETE_JUSTIFY_TRAINEE_ABSENCE, data);

//attend status
export const getAttendStatus = data => post(url.GET_ATTEND_STATUS, data);

//ExamAttendance
export const getExamsAttendance = data => post(url.GET_EXAMS_ATTENDANCE, data);

// add ExamAttendance

export const addNewExamAttendance = data =>
  post(url.ADD_NEW_EXAM_ATTENDANCE, data);

//ExamAttendance
export const getExamAttendanceDeletedValue = () =>
  get(url.GET_EXAM_ATTENDANCE_DELETED_VALUE);

//update ExamAttendance
export const updateExamAttendance = data =>
  post(url.UPDATE_EXAM_ATTENDANCE, data);

//delete ExamAttendance
export const deleteExamAttendance = data =>
  post(url.DELETE_EXAM_ATTENDANCE, data);

//ExamAttendanceObserver
export const getExamAttendanceObservers = data =>
  post(url.GET_EXAM_ATTENDANCE_OBSERVERS, data);

// add ExamAttendanceObserver

export const addNewExamAttendanceObserver = data =>
  post(url.ADD_NEW_EXAM_ATTENDANCE_OBSERVER, data);

//ExamAttendanceObserver
export const getExamAttendanceObserverDeletedValue = () =>
  get(url.GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE);

//update ExamAttendanceObserver
export const updateExamAttendanceObserver = data =>
  post(url.UPDATE_EXAM_ATTENDANCE_OBSERVER, data);

//delete ExamAttendanceObserver
export const deleteExamAttendanceObserver = data =>
  post(url.DELETE_EXAM_ATTENDANCE_OBSERVER, data);

//HallSchedule
export const getHallSchedules = data => post(url.GET_HALL_SCHEDULES, data);

// add HallSchedule

export const addNewHallSchedule = data => post(url.ADD_NEW_HALL_SCHEDULE, data);

//HallSchedule
export const getHallScheduleDeletedValue = () =>
  get(url.GET_HALL_SCHEDULE_DELETED_VALUE);

//update HallSchedule
export const updateHallSchedule = data => post(url.UPDATE_HALL_SCHEDULE, data);

//delete HallSchedule
export const deleteHallSchedule = data => post(url.DELETE_HALL_SCHEDULE, data);

//DefineExamDate
export const getDefineExamDates = data => post(url.GET_DEFINE_EXAM_DATES, data);

// add DefineExamDate

export const addNewDefineExamDate = data =>
  post(url.ADD_NEW_DEFINE_EXAM_DATE, data);

//DefineExamDate
export const getDefineExamDateDeletedValue = () =>
  get(url.GET_DEFINE_EXAM_DATE_DELETED_VALUE);

//update DefineExamDate
export const updateDefineExamDate = data =>
  post(url.UPDATE_DEFINE_EXAM_DATE, data);

//delete DefineExamDate
export const deleteDefineExamDate = data =>
  post(url.DELETE_DEFINE_EXAM_DATE, data);

//students order
export const getStudentsOrder = data => post(url.GET_STUDENTS_ORDER, data);

//DefinePeriod
export const getDefinePeriods = data => post(url.GET_DEFINE_PERIODS, data);

// add DefinePeriod

export const addNewDefinePeriod = data => post(url.ADD_NEW_DEFINE_PERIOD, data);

//DefinePeriod
export const getDefinePeriodDeletedValue = () =>
  get(url.GET_DEFINE_PERIOD_DELETED_VALUE);

//update DefinePeriod
export const updateDefinePeriod = data => post(url.UPDATE_DEFINE_PERIOD, data);

//delete DefinePeriod
export const deleteDefinePeriod = data => post(url.DELETE_DEFINE_PERIOD, data);

//WARNING_TYPE
export const getWarningsTypes = data => post(url.GET_WARNINGS_TYPES, data);

// add warningTypes
export const addNewWarningType = data => post(url.ADD_NEW_WARNING_TYPE, data);

//WARNING_TYPE
export const getWarningTypeDeletedValue = () =>
  get(url.GET_WARNING_TYPE_DELETED_VALUE);

//update warningType
export const updateWarningType = data => post(url.UPDATE_WARNING_TYPE, data);

//delete warningType
export const deleteWarningType = data => post(url.DELETE_WARNING_TYPE, data);

//REWARD_TYPE
export const getRewardsTypes = data => post(url.GET_REWARDS_TYPES, data);

// add rewardType
export const addNewRewardType = data => post(url.ADD_NEW_REWARD_TYPE, data);

//REWARD_TYPE
export const getRewardTypeDeletedValue = () =>
  get(url.GET_REWARD_TYPE_DELETED_VALUE);

//update RewardType
export const updateRewardType = data => post(url.UPDATE_REWARD_TYPE, data);

//delete RewardType
export const deleteRewardType = data => post(url.DELETE_REWARD_TYPE, data);

//DECISION_TYPE
export const getDecisionsTypes = data => post(url.GET_DECISIONS_TYPES, data);

// add decisionsTypes
export const addNewDecisionType = data => post(url.ADD_NEW_DECISION_TYPE, data);

//Decision_TYPE
export const getDecisionTypeDeletedValue = () =>
  get(url.GET_DECISION_TYPE_DELETED_VALUE);

//update DecisionType
export const updateDecisionType = data => post(url.UPDATE_DECISION_TYPE, data);

//delete DecisionType
export const deleteDecisionType = data => post(url.DELETE_DECISION_TYPE, data);

//TempTrainee
export const getTempTrainees = data => post(url.GET_TEMP_TRAINEES, data);
export const getTempTraineeDeletedValue = () =>
  get(url.GET_TEMP_TRAINEE_DELETED_VALUE);
export const addNewTempTrainee = data => post(url.ADD_NEW_TEMP_TRAINEE, data);
export const updateTempTrainee = data => post(url.UPDATE_TEMP_TRAINEE, data);
export const deleteTempTrainee = data => post(url.DELETE_TEMP_TRAINEE, data);
export const getTempTraineeRegCertificate = data =>
  post(url.GET_REGISTER_CERTIFICATES, data);

//social status
export const getSocialStatus = data => post(url.GET_SOCIAL_STATUS, data);

//trainee status
export const getTempTraineeStatus = data =>
  post(url.GET_TEMP_TRAINEE_STATUS, data);

//trainee status
export const getTraineeStatus = data => post(url.GET_TRAINEE_STATUS, data);

//ProfessionalExperience
export const addNewProfessionalExperience = data =>
  post(url.ADD_NEW_PROFESSIONAL_EXPERIENCE, data);
export const updateProfessionalExperience = data =>
  post(url.UPDATE_PROFESSIONAL_EXPERIENCE, data);
export const deleteProfessionalExperience = data =>
  post(url.DELETE_PROFESSIONAL_EXPERIENCE, data);

// Upload File
export const uploadFile = data => post(url.uploadFileToStorage, data);

//trainingFormat
export const getTrainingFormats = data => post(url.GET_TRAINING_FORMATS, data);
export const getTrainingFormatDeletedValue = () =>
  get(url.GET_TRAINING_FORMAT_DELETED_VALUE);
export const addNewTrainingFormat = data =>
  post(url.ADD_NEW_TRAINING_FORMAT, data);
export const updateTrainingFormat = data =>
  post(url.UPDATE_TRAINING_FORMAT, data);
export const deleteTrainingFormat = data =>
  post(url.DELETE_TRAINING_FORMAT, data);

//coursesCatalogs
export const getCoursesCatalogs = data => post(url.GET_COURSES_CATALOGS, data);
export const addNewCoursesCatalog = data =>
  post(url.ADD_NEW_COURSES_CATALOGS, data);
export const updateCoursesCatalog = data =>
  post(url.UPDATE_COURSES_CATALOGS, data);
export const deleteCoursesCatalog = data =>
  post(url.DELETE_COURSES_CATALOGS, data);

export const getCoursesCatalogsDeletedValue = () =>
  get(url.GET_COURSES_CATALOG_DELETED_VALUE);

export const getCoursesCatalogDatalist = data =>
  post(url.GET_COURSES_CATALOGS_DATALIST, data);
export const getCourseCatalogePrerequisites = data =>
  post(url.GET_COURSE_CATALOGE_PREREQUISITES, data);
export const addNewCourseCatalogePrerequisite = data =>
  post(url.ADD_NEW_COURSE_CATALOGE_PREREQUISITES, data);
export const updateCourseCatalogePrerequisite = data =>
  post(url.UPDATE_COURSE_CATALOGE_PREREQUISITES, data);
export const deleteCourseCatalogePrerequisite = data =>
  post(url.DELETE_COURSE_CATALOGE_PREREQUISITES, data);
export const getCourseCatalogePrerequisitesDeletedValue = () =>
  get(url.GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE);

//academyOrgStructures

export const getAcademyOrgStructure = data =>
  post(url.GET_ACADEMY_ORG_STRUCTURES, data);
export const addNewAcademyOrgStructure = data =>
  post(url.ADD_NEW_ACADEMY_ORG_STRUCTURE, data);
export const updateAcademyOrgStructure = data =>
  post(url.UPDATE_ACADEMY_ORG_STRUCTURE, data);
export const deleteAcademyOrgStructure = data =>
  post(url.DELETE_ACADEMY_ORG_STRUCTURE, data);
export const getAcademyOrgStructureDeletedValue = () =>
  get(url.GET_ACADEMY_ORG_STRUCTURE_DELETED_VALUE);

//gradeTypes

export const getGradeTypes = data => post(url.GET_GRADE_TYPES, data);
export const getGradeTypeDeletedValue = () =>
  get(url.GET_GRADE_TYPE_DELETED_VALUE);
export const addNewGradeType = data => post(url.ADD_NEW_GRADE_TYPE, data);
export const updateGradeType = data => post(url.UPDATE_GRADE_TYPE, data);
export const deleteGradeType = data => post(url.DELETE_GRADE_TYPE, data);

export const getCourseDistributions = data =>
  post(url.GET_COURSE_DISTRIBUTIONS, data);
export const getCourseDistributionDeletedValue = () =>
  get(url.GET_COURSE_DISTRIBUTION_DELETED_VALUE);
export const addNewCourseDistribution = data =>
  post(url.ADD_NEW_COURSE_DISTRIBUTION, data);
export const updateCourseDistribution = data =>
  post(url.UPDATE_COURSE_DISTRIBUTION, data);
export const deleteCourseDistribution = data =>
  post(url.DELETE_COURSE_DISTRIBUTION, data);

//enter grades
export const getEnteredGrades = data => post(url.GET_ENTERED_GRADES, data);
export const getCourseStatistics = data =>
  post(url.GET_COURSE_STATISTICS, data);
export const updateEnteredGrade = data => post(url.UPDATE_ENTERED_GRADE, data);
export const getCourseContentsEnteredGrades = data =>
  post(url.GET_COURSE_CONTENTS_ENTERED_GRADES, data);

//certeficate grades

export const getCertificateGrades = data =>
  post(url.GET_CERTIFICATE_GRADES, data);
export const getFilteredCertificateGrades = data =>
  post(url.GET_FILTERED_CERTIFICATE_GRADES, data);
export const addNewCertificateGrade = data =>
  post(url.ADD_NEW_CERTIFICATE_GRADE, data);
export const updateCertificateGrade = data =>
  post(url.UPDATE_CERTIFICATE_GRADE, data);
export const deleteCertificateGrade = data =>
  post(url.DELETE_CERTIFICATE_GRADE, data);
export const getCertificateGradeDeletedValue = () =>
  get(url.GET_CERTIFICATE_GRADE_DELETED_VALUE);

//CheckedGrade
export const updateCheckedGrade = data => post(url.UPDATE_CHECKED_GRADE, data);
export const getCheckedGrades = data => post(url.GET_CHECKED_GRADES, data);
export const importCheckedGrades = data =>
  post(url.IMPORT_CHECKED_GRADES, data);

//archived_grades

export const getArchivedGrades = data => post(url.GET_ARCHIVED_GRADES, data);
export const updateArchivedGrade = data =>
  post(url.UPDATE_ARCHIVED_GRADE, data);

//Unarchive Course Requests

export const getUnarchiveCourseRequests = data =>
  post(url.UNARCHIVE_COURSE_REQUESTS, data);
export const addUnarchiveCourseRequest = data =>
  post(url.ADD_UNARCHIVE_COURSE_REQUEST, data);
export const updateUnarchiveCourseRequest = data =>
  post(url.UPDATE_UNARCHIVE_COURSE_REQUEST, data);
export const deleteUnarchiveCourseRequest = data =>
  post(url.DELETE_UNARCHIVE_COURSE_REQUEST, data);
export const getUnarchiveCourseRequestDeletedValue = () =>
  get(url.GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE);

//diploma levels
export const getDiplomaLevels = data => post(url.GET_DIPLOMALEVELS, data);
export const getDiplomaLevelDeletedValue = () =>
  get(url.GET_DIPLOMALEVEL_DELETED_VALUE, data);
export const addNewDiplomaLevel = data => post(url.ADD_NEW_DIPLOMALEVEL, data);
export const updateDiplomaLevel = data => post(url.UPDATE_DIPLOMALEVEL, data);
export const deleteDiplomaLevel = data => post(url.DELETE_DIPLOMALEVEL, data);

//HighStudyType
export const getHighStudyTypes = data => post(url.GET_HIGHSTUDYTYPES, data);
export const getHighStudyTypeDeletedValue = () =>
  get(url.GET_HIGHSTUDYTYPE_DELETED_VALUE);
export const addNewHighStudyType = data =>
  post(url.ADD_NEW_HIGHSTUDYTYPE, data);
export const updateHighStudyType = data => post(url.UPDATE_HIGHSTUDYTYPE, data);
export const deleteHighStudyType = data => post(url.DELETE_HIGHSTUDYTYPE, data);

export {
  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postDbLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile,
};
