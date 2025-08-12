import { all, fork } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";
import ecommerceSaga from "./e-commerce/saga";
import calendarSaga from "./calendar/saga";
import chatSaga from "./chat/saga";
import cryptoSaga from "./crypto/saga";
import invoiceSaga from "./invoices/saga";
// import StudentsSaga from "./students/saga";
import projectsSaga from "./projects/saga";
import tasksSaga from "./tasks/saga";
import mailsSaga from "./mails/saga";
import userTypesSaga from "./user-types/saga";
import admissionConditionsSaga from "./admissionConditions/saga";
import levelingDecisionsSaga from "./leveling-decisions/saga";
import StudentsHistorySaga from "./students-history/saga";
import LecturePeriodsSaga from "./lecture-periods/saga";
import currSemMansSaga from "./current-sem-man/saga";
import RegistrationSaga from "./Registration/saga";
import GenerateSIDsSaga from "./generate-SIDs/saga";
import GeneralManagementsSaga from "./general-management/saga";
import MobAppFacultyAccsSaga from "./mob-app-faculty-accs/saga";
import sectorsSaga from "./sectors/saga";
import StudyPlansSaga from "./study-plans/saga";
import nationalitiesSaga from "./nationality/saga";
import relativesSaga from "./relatives/saga";
import CertificatesSaga from "./certificates/saga";
import CertificatelevelSaga from "./certificateTypes/saga";
import StudentManagementSaga from "./studentManagements/saga";
import universityStudentsSaga from "./university-students/saga";
import contactsSaga from "./contacts/saga";
import dashboardSaga from "./dashboard/saga";
import dashboardSaasSaga from "./dashboard-saas/saga";
import countriesSaga from "./country/saga";
import dataitemsSaga from "./data-items/saga";
import governoratesSaga from "./governorate/saga";
import structuresSaga from "./universitystructures/saga";
import currenciesSaga from "./currencies/saga";
import servicesSaga from "./services/saga";
import fileSaga from "./files/saga";
import finesSaga from "./fines/saga";
import finesDefinitionSaga from "./finesDefinition/saga";
import periodsSaga from "./periods/saga";
import requestsFeesSaga from "./requestsFees/saga";
import feesDefinitionSaga from "./feesDefinition/saga";
import requestsSaga from "./requests/saga";
import documentsSaga from "./documents-types/saga";
import uniDocumentsSaga from "./university-documents/saga";
import regReqDocumentsSaga from "./reg-req-documents/saga";
import universityrequirementsSaga from "./universityrequirements/saga";
import academiccertificatesSaga from "./academicvertificates/saga";
import coursesSaga from "./courses/saga";
import estimatesSaga from "./estimates/saga";
import courseContentsSaga from "./coursecontents/saga";
import courseTypesSaga from "./coursetypes/saga";
import levelsSaga from "./levels/saga";
import departmentsSaga from "./departments/saga";
import schedulesSaga from "./schedules/saga";
import classSchedulingSaga from "./classScheduling/saga";
import grantSponsorsSaga from "./grantSponsors/saga";
import yearsSaga from "./years/saga";
import semestersSaga from "./semesters/saga";
import weekDaysSaga from "./weekdays/saga";
import timeLinesSaga from "./timeline/saga";
import citiesSaga from "./cities/saga";
import prereqsSaga from "./prereq-conditions/saga";
import studentsStatisticsSaga from "./students-statistics/saga";
import passwordsSaga from "./reset-password/saga";
import gendersSaga from "./genders/saga";
import studentsDecreesSaga from "./student-decrees/saga";
import DecisionsSaga from "./decisions/saga";
import grantsSaga from "./grants/saga";
import rolesSaga from "./roles/saga";
import userMngsSaga from "./user-mngs/saga";
import universityInfoSaga from "./universitydef/saga";
import universityOrgStructure from "./universityOrgStructure/saga";
import sidbarcontentsSaga from "./sidebarcontent/saga";
import trainingMembersSaga from "./trainingMembers/saga";
import warningRulesSaga from "./warningRules/saga";
import stdWarningTestSaga from "./stdWarningTest/saga";
import exceptionalPeriodsSaga from "./exceptionalPeriods/saga";
import academicLoadSaga from "./academicloads/saga";
import certificateGradesSaga from "./certificateGrades/saga";
import academyBuildingStructureSaga from "./academyBuildingStructure/saga";
import contractsTypesSaga from "./HR/contractsTypes/saga";
import ExamRoomsSaga from "./Exam/ExamRooms/saga";
import employmentCasesSaga from "./HR/employmentCases/saga";
import workClassificationsSaga from "./HR/workClassifications/saga";
import employeesSaga from "./HR/employees/saga";
import DistributingCoursesMethodsSaga from "./distributing-courses-methods/saga";
import letterGradesSaga from "./letter-grade/saga";
import transportLinesSaga from "./transportLines/saga";
import StudentsRequestsSaga from "./students-requests/saga";
import ContractsSaga from "./HR/contracts/saga";
import DefineExamDatesSaga from "./Exam/DefineExamDates/saga";
import WarningsTypesSaga from "./HR/warningsTypes/saga";
import RewardsTypesSaga from "./HR/rewardsTypes/saga";
import DecisionsTypesSaga from "./HR/decisionsTypes/saga";
import ApplicantsSaga from "./Admission/Applicants/saga";
import AbsenceWarningsSaga from "./Rules-and-Regulations/Absence-warnings/saga";

import DocumentTypesSaga from "./documents-types/saga";

import traineesSaga from "./new-Trainee/saga";

import trainingFormatsSaga from "./trainingFormat/saga";

import coursesCatalogsSaga from "./CourseCataloge/saga";

import academyOrgStructureSaga from "./academyOrgStructure/saga";

import gradeTypesSaga from "./grade-types/saga";

import courseDistributionsSaga from "./courses-distribution/saga";

import enteredGradesSaga from "./enterGrades/saga";

import checkedGradesSaga from "./checkGrades/saga";

import archiveGradesSaga from "./archiveGrades/saga";

import DiplomaLevelSaga from "./diploma-level/saga";

import HighStudyTypeSaga from "./high-study-types/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(ecommerceSaga),
    fork(calendarSaga),
    fork(chatSaga),
    fork(mailsSaga),
    fork(cryptoSaga),
    fork(invoiceSaga),
    // fork(StudentsSaga),
    fork(admissionConditionsSaga),
    fork(projectsSaga),
    fork(tasksSaga),
    fork(contactsSaga),
    fork(sectorsSaga),
    fork(StudyPlansSaga),
    fork(userTypesSaga),
    fork(LecturePeriodsSaga),
    fork(levelingDecisionsSaga),
    fork(RegistrationSaga),
    fork(GenerateSIDsSaga),
    fork(GeneralManagementsSaga),
    fork(MobAppFacultyAccsSaga),
    fork(CertificatesSaga),
    fork(CertificatelevelSaga),
    fork(universityStudentsSaga),
    fork(StudentManagementSaga),
    fork(nationalitiesSaga),
    fork(relativesSaga),
    fork(dashboardSaga),
    fork(dashboardSaasSaga),
    fork(countriesSaga),
    fork(dataitemsSaga),
    fork(governoratesSaga),
    fork(structuresSaga),
    fork(currenciesSaga),
    fork(servicesSaga),
    fork(fileSaga),
    fork(finesSaga),
    fork(periodsSaga),
    fork(requestsFeesSaga),
    fork(finesDefinitionSaga),
    fork(feesDefinitionSaga),
    fork(requestsSaga),
    fork(documentsSaga),
    fork(uniDocumentsSaga),
    fork(regReqDocumentsSaga),
    fork(universityrequirementsSaga),
    fork(academiccertificatesSaga),
    fork(coursesSaga),
    fork(estimatesSaga),
    fork(courseContentsSaga),
    fork(courseTypesSaga),
    fork(levelsSaga),
    fork(departmentsSaga),
    fork(schedulesSaga),
    fork(classSchedulingSaga),
    fork(grantSponsorsSaga),
    fork(grantsSaga),
    fork(yearsSaga),
    fork(semestersSaga),
    fork(weekDaysSaga),
    fork(timeLinesSaga),
    fork(prereqsSaga),
    fork(currSemMansSaga),
    fork(citiesSaga),
    fork(passwordsSaga),
    fork(studentsStatisticsSaga),
    fork(gendersSaga),
    fork(studentsDecreesSaga),
    fork(DecisionsSaga),
    fork(rolesSaga),
    fork(userMngsSaga),
    fork(universityInfoSaga),
    fork(universityOrgStructure),
    fork(sidbarcontentsSaga),
    fork(trainingMembersSaga),
    fork(warningRulesSaga),
    fork(stdWarningTestSaga),
    fork(exceptionalPeriodsSaga),
    fork(certificateGradesSaga),
    fork(contractsTypesSaga),
    fork(ExamRoomsSaga),
    fork(employmentCasesSaga),
    fork(workClassificationsSaga),
    fork(employeesSaga),
    fork(academicLoadSaga),
    fork(DistributingCoursesMethodsSaga),
    fork(letterGradesSaga),
    fork(transportLinesSaga),
    fork(StudentsHistorySaga),
    fork(StudentsRequestsSaga),
    fork(ContractsSaga),
    fork(DefineExamDatesSaga),
    fork(academyBuildingStructureSaga),
    fork(WarningsTypesSaga),
    fork(RewardsTypesSaga),
    fork(DecisionsTypesSaga),
    fork(traineesSaga),
    fork(trainingFormatsSaga),
    fork(coursesCatalogsSaga),
    fork(academyOrgStructureSaga),
    fork(gradeTypesSaga),
    fork(courseDistributionsSaga),
    fork(enteredGradesSaga),
    fork(checkedGradesSaga),
    fork(archiveGradesSaga),
    fork(DiplomaLevelSaga),
    fork(HighStudyTypeSaga),
    fork(ApplicantsSaga),
    fork(AbsenceWarningsSaga),
    fork(DocumentTypesSaga),
  ]);
}
