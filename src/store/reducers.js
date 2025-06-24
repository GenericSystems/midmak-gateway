import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

//E-commerce
import ecommerce from "./e-commerce/reducer";

//Calendar
import calendar from "./calendar/reducer";

//chat
import chat from "./chat/reducer";

//crypto
import crypto from "./crypto/reducer";

//invoices
import invoices from "./invoices/reducer";

//students
import students from "./students/reducer";

//universityStudents
import universityStudents from "./university-students/reducer";

//admissionConditions
import admissionConditions from "./admissionConditions/reducer";

//projects
import projects from "./projects/reducer";

//tasks
import tasks from "./tasks/reducer";

//contacts
import contacts from "./contacts/reducer";

// data-items
import dataitems from "./data-items/reducer";

//lecturePeriods
import lecturePeriods from "./lecture-periods/reducer";

//currSemMans
import currSemMans from "./current-sem-man/reducer";

//coursesregistrations
import coursesRegistration from "./courses-registration/reducer";
//generateSIDs
import generateSIDs from "./generate-SIDs/reducer";

//generalManagements
import generalManagements from "./general-management/reducer";

//mobAppFacultyAccs
import mobAppFacultyAccs from "./mob-app-faculty-accs/reducer";

//studyplans
import studyPlans from "./study-plans/reducer";

//StudentsStatistics
import studentsStatistics from "./students-statistics/reducer";

//sectors
import sectors from "./sectors/reducer";

//preReqTypes
import userTypes from "./user-types/reducer";

//certificates
import certificates from "./certificates/reducer";

//certificateTypes
import certificateTypes from "./certificateTypes/reducer";

//studentManagements
import studentManagements from "./studentManagements/reducer";

//Academic Certificate
import academiccertificates from "./academicvertificates/reducer";

//Courses
import courses from "./courses/reducer";
//contries
import countries from "./country/reducer";

//governorate
import governorates from "./governorate/reducer";

//structure
import structures from "./universitystructures/reducer";

//currencies
import currencies from "./currencies/reducer";

//requests
import requests from "./requests/reducer";

//files
import file from "./files/reducer";

//fines
import fines from "./fines/reducer";

//finesDefinition
import finesDefinition from "./finesDefinition/reducer";

//periods
import periods from "./periods/reducer";

//requestsFees
import requestsFees from "./requestsFees/reducer";

//feesDefinition
import feesDefinition from "./feesDefinition/reducer";

//services
import services from "./services/reducer";

//document
import documents from "./documents-types/reducer";

//document
import uniDocuments from "./university-documents/reducer";

//reg-req-document
import regReqDocuments from "./reg-req-documents/reducer";

//universityrequirements
import universityrequirements from "./universityrequirements/reducer";

//nationalities
import nationalities from "./nationality/reducer";

//relatives
import relatives from "./relatives/reducer";

//mails
import mails from "./mails/reducer";

//Estimates
import estimates from "./estimates/reducer";

//cities
import cities from "./cities/reducer";

//Dashboard
import Dashboard from "./dashboard/reducer";

//Dasboard saas
import DashboardSaas from "./dashboard-saas/reducer";

//Course Contents
import coursecontents from "./coursecontents/reducer";

//Course Types
import courseTypes from "./coursetypes/reducer";

//GrantSponsors
import grantSponsors from "./grantSponsors/reducer";

//Levels
import levels from "./levels/reducer";

//Departments
import departments from "./departments/reducer";

//Schedules
import schedules from "./schedules/reducer";

//SchedulingLectures
import schedulingLectures from "./scheduling-lectures/reducer";

//Years
import years from "./years/reducer";

//Semester
import semesters from "./semesters/reducer";

//Week Days
import weekDays from "./weekdays/reducer";

//Timeline
import timeLines from "./timeline/reducer";
//prereqs
import prereqs from "./prereq-conditions/reducer";

//reset-password
import studentsInfo from "./reset-password/reducer";

//genders
import genders from "./genders/reducer";
//studentsDecrees
import studentsDecrees from "./student-decrees/reducer";
//decisions
import decisions from "./decisions/reducer";
import universityInfo from "./universitydef/reducer";
//grants
import grants from "./grants/reducer";
//userMngs
import userMngs from "./user-mngs/reducer";

//roles
import roles from "./roles/reducer";
import universityOrgStructures from "./universityOrgStructure/reducer";

//sidbarcontent
import menu_items from "./sidebarcontent/reducer";

//trainer
import trainingMembers from "./trainingMembers/reducer";

//warningRule
import warningRules from "./warningRules/reducer";

//stdWarningTest
import stdWarningTest from "./stdWarningTest/reducer";

//exceptionalPeriods
import exceptionalPeriods from "./exceptionalPeriods/reducer";

//Academic load

import academicLoads from "./academicloads/reducer";

// grades
import grades from "./grades/reducer";

// contractsTypes
import contractsTypes from "./HR/contractsTypes/reducer";

// employmentCases
import employmentCases from "./HR/employmentCases/reducer";

// workClassifications
import workClassifications from "./HR/workClassifications/reducer";

// employees
import employees from "./HR/employees/reducer";

//Distributing courses methods

import distributingCoursesMethods from "./distributing-courses-methods/reducer";

import letterGrades from "./letter-grade/reducer";

// transport lines
import transportLines from "./transportLines/reducer";

// levelingDecisions
import levelingDecisions from "./leveling-decisions/reducer";

//studentsHistory
import studentsHistory from "./students-history/reducer";

//studentsRequests
import studentsRequests from "./students-requests/reducer";

//contract
import contracts from "./HR/contracts/reducer";

//Trainees
import trainees from "./new-Trainee/reducer";

const rootReducer = combineReducers({
  // public
  genders,
  studentsDecrees,
  decisions,
  grants,
  userMngs,
  roles,
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  ecommerce,
  calendar,
  chat,
  mails,
  crypto,
  invoices,
  students,
  admissionConditions,
  projects,
  tasks,
  contacts,
  nationalities,
  certificateTypes,
  studentManagements,
  nationalities,
  relatives,
  Dashboard,
  DashboardSaas,
  countries,
  structures,
  currencies,
  requests,
  services,
  file,
  fines,
  finesDefinition,
  feesDefinition,
  periods,
  requestsFees,
  documents,
  uniDocuments,
  regReqDocuments,
  governorates,
  dataitems,
  universityrequirements,
  academiccertificates,
  userTypes,
  lecturePeriods,
  currSemMans,
  coursesRegistration,
  generateSIDs,
  generalManagements,
  mobAppFacultyAccs,
  sectors,
  studentsStatistics,
  studyPlans,
  courses,
  estimates,
  coursecontents,
  courseTypes,
  levels,
  departments,
  schedules,
  schedulingLectures,
  grantSponsors,
  years,
  universityStudents,
  semesters,
  weekDays,
  timeLines,
  prereqs,
  cities,
  certificates,
  studentsInfo,
  universityInfo,
  universityOrgStructures,
  menu_items,
  trainingMembers,
  warningRules,
  stdWarningTest,
  exceptionalPeriods,
  academicLoads,
  grades,
  distributingCoursesMethods,
  letterGrades,
  transportLines,
  levelingDecisions,
  studentsHistory,
  studentsRequests,
  contractsTypes,
  employmentCases,
  workClassifications,
  employees,
  contracts,
  trainees,
});

export default rootReducer;
