import React, { Component } from "react";
import classnames from "classnames";

import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  FormGroup,
  TabContent,
  TabPane,
} from "reactstrap";
import * as Yup from "yup";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterFactory, {
  textFilter,
  customFilter,
} from "react-bootstrap-table2-filter";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";

import // getTrainees,
// addNewTrainee,
// updateTrainee,
// deleteTrainee,
// getTraineeById,
// getTraineeRegReqDocs,
"store/trainees/actions";
import { getYears } from "store/years/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class TraineesReportList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profExperiencesArray: [],
      trainees: {},
      trainee: "",
      years: [],
      tempTraineeLocal: "",
      activeTab: 1,
      activeTabVartical: 1,
      passedSteps: [1],
      passedStepsVertical: [1],
      selectedView: "",
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      showRegisterStatus: false,
      showStartDate: false,
      showTraineeStatus: false,
      showYear: false,
      showPracticalMarks: false,
      showFinalExam: false,
      showGradingMethod: false,
      showTest3Ent: false,
      BirthLocation: false,
      showCourseName: false,
      showCourseCode: false,
      showAcademicYear: false,
      showFinalMarks: false,
      showGrade: false,
      showTotalMarksEnt: false,
      showPracticalMarksEnt: false,
      showFinalExamEnt: false,
      showTest2Ent: false,
      showTest4Ent: false,
      showTest5Ent: false,
      showTest6Ent: false,
      showTest1Ent: false,
      showTest7Ent: false,
      showTotalMarksAud: false,
      showFaculty: false,
      showSpecialty: false,
      showTest3Aud: false,
      showPracticalMarksAud: false,
      showTest1Aud: false,
      showFinalExamAud: false,
      showTest2Aud: false,
      showTest4Aud: false,
      showTest5Aud: false,
      showTotalMarksArch: false,
      showTest7Aud: false,
      showTest6Aud: false,
      showPracticalMarksArch: false,
      showFinalExamArch: false,
      showTest1Arch: false,
      showTest2Arch: false,
      showTest3Arch: false,
      showTest4Arch: false,
      showTest5Arch: false,
      showTest6Arch: false,
      showTest7Arch: false,
      showCurrentAddrCell: false,
      showPermanentAddress: false,
      showParentAddrPhone: false,
      showWhatsappMobileNum: false,
      showEmail: false,
      showWorkPlace: false,
      showWorkField: false,
      showWorkDuration: false,
      showWorkAddress: false,
      showJobTitle: false,
      showAdmissionDate: false,
      showRegisterYear: false,
      showLastRegCourse: false,
      showCourseStatus: false,
      showDecisionCode: false,
      showDecisionType: false,
      showDecisionDate: false,
      showApplyingDate: false,
      showAcademyCouncilNo: false,
      showAcademyCouncilDate: false,
      showDecisionNote: false,
      modal: false,
      modal1: false,
      selectedMulti: null,
      selectedFromAdmSemes: "",
      selectedToAdmSemes: "",
      selectedFromRegSemes: "",
      selectedToRegSemes: "",
      selectedColor: "#556ee6",
      selectedRuleType: "",
      selectedCalculatedTransferCred: "",
      selectedActiveAdditionalPeriod: "",
      applyForSemesterArray: [],
      prevStatusSemesArray: [],
      applyStatusArray: [],
      prevAcademicWarningArray: [],
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      successMessage: null,
      showTraineeFile: false,
      showRegistrationForm: false,
      showTranscript: false,
      showDocuments: false,
      showTranscriptNoHide: false,
      showReportsLi: false,
      showTraineeLifeLi: false,
      selecetdDiplomaId: "",
      selectedFacultyId: 0,
      tempTrainee: "",
      hasError: false,
      isOpen: false,
      generateModal: false,
      averageValue: "",
      selectedDiploma: "",
      IsSpecial: false,
      grantCond: 0,
      selectedStudyPlanId: 0,
      selectedYear: null,
      currentYearObj: {},
      facultyName: "",
      studyPlanName: "",
      socialStatusName: "",
      selectedRegistrationCertLevelId: "",
      selectedStudyPattern: "",
      selectedExaminationSession: "",
      IsTransferTempTraineeCheck: false,
      transferUniName: "",
      selectedTransferUnivCountry: "",
      selectedUnivCountry: "",
      selectedRegistrationDate: new Date().toISOString().split("T")[0],
      selectedNationalityId: 0,
      nationalityName: "",
      grantName: "",
      selectedCountry: "",
      selectedSemester: "",
      selectedGovernorate: "",
      genderName: "",
      diplomaTypeName: "",
      selectedSocialStatus: "",
      selectedBirthDate: "",
      selectedRegistrationDiplomaDate: "",
      selectedEmissionDate: "",
      selectedIdentityIssueDate: "",
      selectedPassportGrantDate: "",
      selectedPassportExpirationDate: "",
      selectedPassportIssueDate: "",
      selectedPassportExpiryDate: "",
      selectedDiplomaDate: "",
      selectedDiplomaVerificationDate: "",
      values: "",
      firstNameError: false,
      lastNameError: false,
      fatherNameError: false,
      grandFatherNameError: false,
      motherNameError: false,
      birthLocError: false,
      birthdateError: false,
      nationalityError: false,
      genderError: false,
      facultyError: false,
      diplomaError: false,
      diplomaIdError: false,
      diplomaNumberError: false,
      averageError: false,
      stdTotalGradeError: false,
      gradeError: false,
      nationalNoError: false,
      identityNoError: false,
      examinationSessionError: false,
      plan_studyError: false,
      errorMessage1: null,
      successMessage1: null,
      HasBrotherCheck: false,
      showGenerateButton: false,
      totalGradeValue: "",
      traineeGrade: "",
      studentGrade: "",
      attestatedValue: 0,
      rows: [],
      bloodTypeName: "",
      duplicateRelativeError: null,
      duplicateError: null,
      duplicateErrorSibling: null,
      lastUsedId: 0,
      stdDocsArray: [],
      lastUsedExperienceId: 0,
      trnProfExperiences: {},
      trnProfExperience: "",
      showSiblingsSelect: false,
      siblingsArray: [],
      deleteBroModal: false,
      tempTrainees: {},
      selectedParentNationality: null,
      selectedInstituteCountry: "",
      selectedTraineeStatus: "",
      languageState: "",
      selectedHightStudyTypeId: "",
      selectedEstimateId: "",
      selectedRegUniDate: "",
      isTempTraineeSaved: false,
      selectedTraineeId: 0,
      isAdd: false,
    };
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      diplomalevels,
      nationalities,
      countries,
      cities,
      governorates,
      regReqDocuments,
      genders,
      certificatelevels,
      regcertificates,
      trainees,
      tempTrainee,
      traineeStatus,
      faculties,
      onGetTrainees,
      onGetYears,
      deleted,
      user_menu,
      years,
      i18n,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (trainees && !trainees.length) {
    // onGetTrainees(lang);
    onGetYears();
    this.setState({ trainees, years, tempTrainee });
    this.setState({
      deleted,
      certificatelevels,
      genders,
      regReqDocuments,
      governorates,
      cities,
      countries,
      faculties,
      nationalities,
      regcertificates,
      diplomalevels,
      traineeStatus,
    });
    // }

    let curentueardata = localStorage.getItem("authUser");
    if (curentueardata) {
      try {
        const parsed = JSON.parse(curentueardata);
        const firstYear = parsed[0];
        const selectedYear = {
          value: firstYear.currentYearId,
          label: firstYear.currentYearName,
        };
        this.setState({
          selectedYear,
          currentYearObj: {
            currentYearId: firstYear.currentYearId,
            currentYearName: firstYear.currentYearName,
          },
        });
      } catch (error) {
        console.error("Error parsing authUser:", error);
      }
    }
    this.setState({ languageState: lang });

    i18n.on("languageChanged", this.handleLanguageChange);
    console.log(this.state.currentYearObj, "gggg");
  }
  handleLanguageChange = lng => {
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
    }
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updateShowAddButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowDeleteButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowSearchButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }
  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };

  // toggle = () => {
  //   this.setState(prevState => ({
  //     modal: !prevState.modal,
  //   }));
  //   this.props.onGetTrainees();
  // };

  toggle1 = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1,
    }));
  };

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleExpSuccessClose = () => {
    this.setState({ successMessage1: null, showAlert: null });
  };

  handleExpErrorClose = () => {
    this.setState({ errorMessage1: null, showAlert: null });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  toggleSidebar() {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  }

  handleDeleteRow = () => {
    const { onDeleteStdWarningTest } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteStdWarningTest({ Id: selectedRowId.Id });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleShowColumn = fieldName => {
    if (fieldName == "FatherName") {
      this.setState(prevState => ({
        showRegisterStatus: !prevState.showRegisterStatus,
      }));
    }
    if (fieldName == "startDate") {
      this.setState(prevState => ({
        showStartDate: !prevState.showStartDate,
      }));
    }

    if (fieldName == "grandFatherName") {
      this.setState(prevState => ({
        showPracticalMarks: !prevState.showPracticalMarks,
      }));
    }

    if (fieldName == "MotherName") {
      this.setState(prevState => ({
        showFinalExam: !prevState.showFinalExam,
      }));
    }

    if (fieldName == "birthdate") {
      this.setState(prevState => ({
        showGradingMethod: !prevState.showGradingMethod,
      }));
    }

    if (fieldName == "NationalityId") {
      this.setState(prevState => ({
        showTest3Ent: !prevState.showTest3Ent,
      }));
    }

    if (fieldName == "BirthLocation") {
      this.setState(prevState => ({
        BirthLocation: !prevState.BirthLocation,
      }));
    }

    if (fieldName == "FirstName") {
      this.setState(prevState => ({
        showCourseName: !prevState.showCourseName,
      }));
    }

    if (fieldName == "LastName") {
      this.setState(prevState => ({
        showCourseCode: !prevState.showCourseCode,
      }));
    }

    if (fieldName == "academicYear") {
      this.setState(prevState => ({
        showAcademicYear: !prevState.showAcademicYear,
      }));
    }

    if (fieldName == "identityNo") {
      this.setState(prevState => ({
        showFinalMarks: !prevState.showFinalMarks,
      }));
    }

    if (fieldName == "nationalNo") {
      this.setState(prevState => ({
        showGrade: !prevState.showGrade,
      }));
    }

    if (fieldName == "identityIssueDate") {
      this.setState(prevState => ({
        showTotalMarksEnt: !prevState.showTotalMarksEnt,
      }));
    }

    if (fieldName == "PassNumber") {
      this.setState(prevState => ({
        showPracticalMarksEnt: !prevState.showPracticalMarksEnt,
      }));
    }

    if (fieldName == "passportIssueDate") {
      this.setState(prevState => ({
        showFinalExamEnt: !prevState.showFinalExamEnt,
      }));
    }

    if (fieldName == "passportExpiryDate") {
      this.setState(prevState => ({
        showTest1Ent: !prevState.showTest1Ent,
      }));
    }

    if (fieldName == "GenderId") {
      this.setState(prevState => ({
        showTest2Ent: !prevState.showTest2Ent,
      }));
    }

    if (fieldName == "civicZone") {
      this.setState(prevState => ({
        showTest4Ent: !prevState.showTest4Ent,
      }));
    }

    if (fieldName == "registerZone") {
      this.setState(prevState => ({
        showTest5Ent: !prevState.showTest5Ent,
      }));
    }

    if (fieldName == "registerNo") {
      this.setState(prevState => ({
        showTest6Ent: !prevState.showTest6Ent,
      }));
    }

    if (fieldName == "yearId") {
      this.setState(prevState => ({
        showYear: !prevState.showYear,
      }));
    }

    if (fieldName == "traineeStatusId") {
      this.setState(prevState => ({
        showTraineeStatus: !prevState.showTraineeStatus,
      }));
    }

    if (fieldName == "RegistrationDate") {
      this.setState(prevState => ({
        showTest7Ent: !prevState.showTest7Ent,
      }));
    }

    if (fieldName == "registrationCertLevelId") {
      this.setState(prevState => ({
        showTotalMarksAud: !prevState.showTotalMarksAud,
      }));
    }

    if (fieldName == "Faculty") {
      this.setState(prevState => ({
        showFaculty: !prevState.showFaculty,
      }));
    }

    if (fieldName == "plan_study") {
      this.setState(prevState => ({
        showSpecialty: !prevState.showSpecialty,
      }));
    }

    if (fieldName == "uniName") {
      this.setState(prevState => ({
        showPracticalMarksAud: !prevState.showPracticalMarksAud,
      }));
    }

    if (fieldName == "UnivCountryId") {
      this.setState(prevState => ({
        showTest1Aud: !prevState.showTest1Aud,
      }));
    }

    if (fieldName == "uniAverage") {
      this.setState(prevState => ({
        showTest3Aud: !prevState.showTest3Aud,
      }));
    }

    if (fieldName == "RegUniDate") {
      this.setState(prevState => ({
        showTest6Aud: !prevState.showTest6Aud,
      }));
    }

    if (fieldName == "EstimateId") {
      this.setState(prevState => ({
        showTest5Aud: !prevState.showTest5Aud,
      }));
    }

    if (fieldName == "diplomaName") {
      this.setState(prevState => ({
        showFinalExamAud: !prevState.showFinalExamAud,
      }));
    }

    if (fieldName == "InstituteCountryId") {
      this.setState(prevState => ({
        showTest2Aud: !prevState.showTest2Aud,
      }));
    }

    if (fieldName == "registrationDiplomaAverage") {
      this.setState(prevState => ({
        showTest4Aud: !prevState.showTest4Aud,
      }));
    }

    if (fieldName == "academicYear") {
      this.setState(prevState => ({
        showTest7Aud: !prevState.showTest7Aud,
      }));
    }

    if (fieldName == "HighStudyTypeId") {
      this.setState(prevState => ({
        showTotalMarksArch: !prevState.showTotalMarksArch,
      }));
    }

    if (fieldName == "diplomaId") {
      this.setState(prevState => ({
        showPracticalMarksArch: !prevState.showPracticalMarksArch,
      }));
    }

    if (fieldName == "DiplomaCountryId") {
      this.setState(prevState => ({
        showFinalExamArch: !prevState.showFinalExamArch,
      }));
    }

    if (fieldName == "DiplomaGovernorateId") {
      this.setState(prevState => ({
        showTest1Arch: !prevState.showTest1Arch,
      }));
    }

    if (fieldName == "DiplomaYear") {
      this.setState(prevState => ({
        showTest2Arch: !prevState.showTest2Arch,
      }));
    }

    if (fieldName == "ExaminationSession") {
      this.setState(prevState => ({
        showTest3Arch: !prevState.showTest3Arch,
      }));
    }

    if (fieldName == "DiplomaNumber") {
      this.setState(prevState => ({
        showTest4Arch: !prevState.showTest4Arch,
      }));
    }

    if (fieldName == "Average") {
      this.setState(prevState => ({
        showTest5Arch: !prevState.showTest5Arch,
      }));
    }

    if (fieldName == "CurrentAddress") {
      this.setState(prevState => ({
        showTest6Arch: !prevState.showTest6Arch,
      }));
    }

    if (fieldName == "CurrentAddrPhone") {
      this.setState(prevState => ({
        showTest7Arch: !prevState.showTest7Arch,
      }));
    }

    if (fieldName == "CurrentAddrCell") {
      this.setState(prevState => ({
        showCurrentAddrCell: !prevState.showCurrentAddrCell,
      }));
    }

    if (fieldName == "PermanentAddress") {
      this.setState(prevState => ({
        showPermanentAddress: !prevState.showPermanentAddress,
      }));
    }

    if (fieldName == "ParentAddrPhone") {
      this.setState(prevState => ({
        showParentAddrPhone: !prevState.showParentAddrPhone,
      }));
    }

    if (fieldName == "WhatsappMobileNum") {
      this.setState(prevState => ({
        showWhatsappMobileNum: !prevState.showWhatsappMobileNum,
      }));
    }

    if (fieldName == "Email") {
      this.setState(prevState => ({
        showEmail: !prevState.showEmail,
      }));
    }

    if (fieldName == "workType") {
      this.setState(prevState => ({
        showJobTitle: !prevState.showJobTitle,
      }));
    }

    if (fieldName == "companyName") {
      this.setState(prevState => ({
        showWorkPlace: !prevState.showWorkPlace,
      }));
    }

    if (fieldName == "workPlace") {
      this.setState(prevState => ({
        showWorkAddress: !prevState.showWorkAddress,
      }));
    }

    if (fieldName == "workField") {
      this.setState(prevState => ({
        showWorkField: !prevState.showWorkField,
      }));
    }

    if (fieldName == "duaration") {
      this.setState(prevState => ({
        showWorkDuration: !prevState.showWorkDuration,
      }));
    }

    if (fieldName == "registerYear") {
      this.setState(prevState => ({
        showRegisterYear: !prevState.showRegisterYear,
      }));
    }

    if (fieldName == "admissionDate") {
      this.setState(prevState => ({
        showAdmissionDate: !prevState.showAdmissionDate,
      }));
    }

    if (fieldName == "lastRegCourse") {
      this.setState(prevState => ({
        showLastRegCourse: !prevState.showLastRegCourse,
      }));
    }

    if (fieldName == "courseStatus") {
      this.setState(prevState => ({
        showCourseStatus: !prevState.showCourseStatus,
      }));
    }
    if (fieldName == "decisionCode") {
      this.setState(prevState => ({
        showDecisionCode: !prevState.showDecisionCode,
      }));
    }
    if (fieldName == "decisionType") {
      this.setState(prevState => ({
        showDecisionType: !prevState.showDecisionType,
      }));
    }
    if (fieldName == "decisionDate") {
      this.setState(prevState => ({
        showDecisionDate: !prevState.showDecisionDate,
      }));
    }
    if (fieldName == "applyingDate") {
      this.setState(prevState => ({
        showApplyingDate: !prevState.showApplyingDate,
      }));
    }
    if (fieldName == "academyCouncilNo") {
      this.setState(prevState => ({
        showAcademyCouncilNo: !prevState.showAcademyCouncilNo,
      }));
    }
    if (fieldName == "academyCouncilDate") {
      this.setState(prevState => ({
        showAcademyCouncilDate: !prevState.showAcademyCouncilDate,
      }));
    }
    if (fieldName == "decisionNote") {
      this.setState(prevState => ({
        showDecisionNote: !prevState.showDecisionNote,
      }));
    }
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleSelectYear = (name, value) => {
    document.getElementById("square-switch1").checked = false;
    this.setState({
      selectedYear: value,
      currentYearObj: {
        currentYearId: value.value,
        currentYearName: value.label,
      },
    });
  };

  render() {
    const { trainees, deleted, years, t } = this.props;
    const {
      trainee,
      selectedYear,
      selectedRegistrationDate,
      selectedRegistrationCertLevelId,
      languageState,
      duplicateError,
      sidebarOpen,
      deleteModal,
      showTraineeStatus,
      showYear,
      showRegisterStatus,
      showStartDate,
      showPracticalMarks,
      showFinalExam,
      showGradingMethod,
      showTest3Ent,
      BirthLocation,
      showCourseName,
      showCourseCode,
      showAcademicYear,
      showFinalMarks,
      showTotalMarksEnt,
      showPracticalMarksEnt,
      showFinalExamEnt,
      showTest1Ent,
      showTest2Ent,
      showTest4Ent,
      showTest6Ent,
      showTest5Ent,
      showFaculty,
      showSpecialty,
      showTest5Aud,
      showPracticalMarksAud,
      showTest3Aud,
      showTest1Aud,
      showTest2Aud,
      showTest4Aud,
      showFinalExamAud,
      showTest6Aud,
      showTotalMarksArch,
      showPracticalMarksArch,
      showFinalExamArch,
      showTest7Aud,
      showTest5Arch,
      showTest1Arch,
      showTest4Arch,
      showTest2Arch,
      showTest7Ent,
      showTotalMarksAud,
      showTest3Arch,
      showTest6Arch,
      showCurrentAddrCell,
      showTest7Arch,
      showEmail,
      showWhatsappMobileNum,
      showParentAddrPhone,
      showPermanentAddress,
      showJobTitle,
      showWorkDuration,
      showWorkField,
      showWorkPlace,
      showWorkAddress,
      showAdmissionDate,
      showRegisterYear,
      showLastRegCourse,
      showGrade,
      showCourseStatus,
      showDecisionCode,
      showDecisionNote,
      showDecisionType,
      showDecisionDate,
      showApplyingDate,
      showAcademyCouncilDate,
      showAcademyCouncilNo,
      showAlert,
    } = this.state;
    console.log("88888", years, selectedYear);
    const { SearchBar } = Search;

    console.log("trainees", trainees);
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    const MainInfoColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "TraineeNum",
        text: this.props.t("Trainee Num"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "fullName",
        text: this.props.t("Trainee Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "traineeStatus",
        text: this.props.t("Trainee Status"),
        sort: true,
        editable: false,
        hidden: !showTraineeStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "FirstName",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
        hidden: !showCourseName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "LastName",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
        hidden: !showCourseCode,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "academicYear",
        text: this.props.t("Academic Year"),
        sort: true,
        editable: false,
        hidden: !showAcademicYear,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "FatherName",
        text: this.props.t("Register Status"),
        sort: true,
        editable: false,
        hidden: !showRegisterStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "startDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
        hidden: !showStartDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "FatherName",
        text: this.props.t("Course Status"),
        sort: true,
        editable: false,
        hidden: !showCourseStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "grandFatherName",
        text: this.props.t("Practical Marks - Full Mark"),
        sort: true,
        editable: false,
        hidden: !showPracticalMarks,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "MotherName",
        text: this.props.t("Final Exam - Full Mark"),
        sort: true,
        editable: false,
        hidden: !showFinalExam,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "birthdate",

        text: this.props.t("Grading Method"),
        sort: true,
        editable: false,
        hidden: !showGradingMethod,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "nationalNo",
        text: this.props.t("Grade"),
        sort: true,
        editable: false,
        hidden: !showGrade,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "identityNo",
        text: this.props.t("Final Marks"),
        sort: true,
        editable: false,
        hidden: !showFinalMarks,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "identityIssueDate",
        text: this.props.t("Total Marks (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTotalMarksEnt,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "PassNumber",
        text: this.props.t("Practical Marks (Enter)"),
        editable: false,
        sort: true,
        hidden: !showPracticalMarksEnt,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "passportIssueDate",
        text: this.props.t("Final Exam (Enter)"),
        editable: false,
        sort: true,
        hidden: !showFinalExamEnt,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "passportExpiryDate",
        text: this.props.t("Test1 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest1Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "GenderId",
        text: this.props.t("Test2 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest2Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "NationalityId",

        text: this.props.t("Test3 (Enter)"),
        sort: true,
        editable: false,
        hidden: !showTest3Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "civicZone",
        text: this.props.t("Test4 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest4Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registerZone",
        text: this.props.t("Test5 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest5Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registerNo",
        text: this.props.t("Test6 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest6Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "RegistrationDate",
        text: this.props.t("Test7 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest7Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registrationCertLevelId",
        text: this.props.t("Total Marks (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTotalMarksAud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "uniName",
        text: this.props.t("Practical Marks (Audit)"),
        editable: false,
        sort: true,
        hidden: !showPracticalMarksAud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "diplomaName",
        text: this.props.t("Final Exam (Audit)"),
        editable: false,
        sort: true,
        hidden: !showFinalExamAud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "UnivCountryId",
        text: this.props.t("Test1 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest1Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "InstituteCountryId",
        text: this.props.t("Test2 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest2Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "uniAverage",
        text: this.props.t("Test3 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest3Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registrationDiplomaAverage",
        text: this.props.t("Test4 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest4Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "EstimateId",
        text: this.props.t("Test5 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest5Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "RegUniDate",
        text: this.props.t("Test6 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest6Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "academicYear",
        text: this.props.t("Test7 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest7Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "HighStudyTypeId",
        text: this.props.t("Total Marks (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTotalMarksArch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "diplomaId",
        text: this.props.t("Practical Marks (Archive)"),
        editable: false,
        sort: true,
        hidden: !showPracticalMarksArch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DiplomaCountryId",
        text: this.props.t("Final Exam (Archive)"),
        editable: false,
        sort: true,
        hidden: !showFinalExamArch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DiplomaGovernorateId",
        text: this.props.t("Test1 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest1Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DiplomaYear",
        text: this.props.t("Test2 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest2Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "ExaminationSession",
        text: this.props.t("Test3 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest3Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DiplomaNumber",
        text: this.props.t("Test4 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest4Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "Average",
        text: this.props.t("Test5 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest5Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "CurrentAddress",
        text: this.props.t("Test6 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest6Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      ,
      {
        dataField: "CurrentAddrPhone",
        text: this.props.t("Test7 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest7Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, trainee) => (
          <div className="d-flex justify-content-center gap-3">
            {/* {showDeleteButton && (
              <Tooltip title={this.props.t("Delete")} placement="top">
                <IconButton color="danger">
                  <i
                    className="mdi mdi-delete font-size-18 text-danger"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(warning)}
                  ></i>
                </IconButton>
              </Tooltip>
            )} */}

            <Tooltip title={this.props.t("View Trainee")} placement="top">
              <IconButton>
                <i
                  className="bx bxs-user font-size-18 text-secondary"
                  id="deletetooltip"
                  onClick={() => this.handleViewTrainee(trainee)}
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: trainees.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={t("Academy Trainees")} />

            <Row>
              {sidebarOpen && (
                <Row>
                  <Col lg={2}>
                    <div
                      style={{
                        marginLeft: "220px",
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      <Card className="accordion-card">
                        <CardHeader className="card-header1">
                          {t("Required data")}
                        </CardHeader>
                        <CardBody style={{ padding: "0" }}>
                          <Accordion flush>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>
                                {t("Trainee Info")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck1"
                                        autoComplete="off"
                                        defaultChecked={showTraineeStatus}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "traineeStatusId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck1"
                                      >
                                        {this.props.t("Trainee Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck2"
                                        autoComplete="off"
                                        defaultChecked={showCourseName}
                                        onClick={() =>
                                          this.handleShowColumn("FirstName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck2"
                                      >
                                        {this.props.t("Course Name")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck3"
                                        autoComplete="off"
                                        defaultChecked={showCourseCode}
                                        onClick={() =>
                                          this.handleShowColumn("LastName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck3"
                                      >
                                        {this.props.t("Course Code")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck5"
                                        autoComplete="off"
                                        defaultChecked={showAcademicYear}
                                        onClick={() =>
                                          this.handleShowColumn("academicYear")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck5"
                                      >
                                        {this.props.t("Academic Year")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck6"
                                        autoComplete="off"
                                        defaultChecked={showRegisterStatus}
                                        onClick={() =>
                                          this.handleShowColumn("FatherName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check big-width-check"
                                        htmlFor="btncheck6"
                                      >
                                        {this.props.t("Register Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck43"
                                        autoComplete="off"
                                        defaultChecked={showStartDate}
                                        onClick={() =>
                                          this.handleShowColumn("startDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check big-width-check"
                                        htmlFor="btncheck43"
                                      >
                                        {this.props.t("Start Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck7"
                                        autoComplete="off"
                                        defaultChecked={showCourseStatus}
                                        onClick={() =>
                                          this.handleShowColumn("FatherName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check big-width-check"
                                        htmlFor="btncheck7"
                                      >
                                        {this.props.t("Course Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck8"
                                        autoComplete="off"
                                        defaultChecked={showPracticalMarks}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "grandFatherName"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check big-width-check"
                                        htmlFor="btncheck8"
                                      >
                                        {this.props.t(
                                          "Practical Marks - Full Mark"
                                        )}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck9"
                                        autoComplete="off"
                                        defaultChecked={showFinalExam}
                                        onClick={() =>
                                          this.handleShowColumn("MotherName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck9"
                                      >
                                        {this.props.t("Final Exam - Full Mark")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck10"
                                        autoComplete="off"
                                        defaultChecked={showGradingMethod}
                                        onClick={() =>
                                          this.handleShowColumn("birthdate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck10"
                                      >
                                        {this.props.t("Grading Method")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck11"
                                        autoComplete="off"
                                        defaultChecked={showGrade}
                                        onClick={() =>
                                          this.handleShowColumn("nationalNo")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck11"
                                      >
                                        {this.props.t("Grade")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>

                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck12"
                                        autoComplete="off"
                                        defaultChecked={showFinalMarks}
                                        onClick={() =>
                                          this.handleShowColumn("identityNo")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck12"
                                      >
                                        {this.props.t("Final Marks")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                              <Accordion.Header>
                                {t("Enter Marks")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <Col>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck13"
                                          autoComplete="off"
                                          defaultChecked={showTotalMarksEnt}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "identityIssueDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck13"
                                        >
                                          {this.props.t("Total Marks (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck14"
                                          autoComplete="off"
                                          defaultChecked={showPracticalMarksEnt}
                                          onClick={() =>
                                            this.handleShowColumn("PassNumber")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck14"
                                        >
                                          {this.props.t(
                                            "Practical Marks (Enter)"
                                          )}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck15"
                                          autoComplete="off"
                                          defaultChecked={showFinalExamEnt}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "passportIssueDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck15"
                                        >
                                          {this.props.t("Final Exam (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck16"
                                          autoComplete="off"
                                          defaultChecked={showTest1Ent}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "passportExpiryDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck16"
                                        >
                                          {this.props.t("Test1 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck17"
                                          autoComplete="off"
                                          defaultChecked={showTest2Ent}
                                          onClick={() =>
                                            this.handleShowColumn("GenderId")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck17"
                                        >
                                          {this.props.t("Test2 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck18"
                                          autoComplete="off"
                                          defaultChecked={showTest3Ent}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "NationalityId"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck18"
                                        >
                                          {this.props.t("Test3 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck19"
                                          autoComplete="off"
                                          defaultChecked={showTest4Ent}
                                          onClick={() =>
                                            this.handleShowColumn("civicZone")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck19"
                                        >
                                          {this.props.t("Test4 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck20"
                                          autoComplete="off"
                                          defaultChecked={showTest5Ent}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "registerZone"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck20"
                                        >
                                          {this.props.t("Test5 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck21"
                                          autoComplete="off"
                                          defaultChecked={showTest6Ent}
                                          onClick={() =>
                                            this.handleShowColumn("registerNo")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck21"
                                        >
                                          {this.props.t("Test6 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck22"
                                          autoComplete="off"
                                          defaultChecked={showTest7Ent}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "RegistrationDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck22"
                                        >
                                          {this.props.t("Test7 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                              <Accordion.Header>
                                {t("Audit Marks")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck23"
                                        autoComplete="off"
                                        defaultChecked={showTotalMarksAud}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "registrationCertLevelId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck23"
                                      >
                                        {this.props.t("Total Marks (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck24"
                                        autoComplete="off"
                                        defaultChecked={showPracticalMarksAud}
                                        onClick={() =>
                                          this.handleShowColumn("uniName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck24"
                                      >
                                        {this.props.t(
                                          "Practical Marks (Audit)"
                                        )}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck25"
                                        autoComplete="off"
                                        defaultChecked={showFinalExamAud}
                                        onClick={() =>
                                          this.handleShowColumn("diplomaName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck25"
                                      >
                                        {this.props.t("Final Exam (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck26"
                                        autoComplete="off"
                                        defaultChecked={showTest1Aud}
                                        onClick={() =>
                                          this.handleShowColumn("UnivCountryId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck26"
                                      >
                                        {this.props.t("Test1 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck27"
                                        autoComplete="off"
                                        defaultChecked={showTest2Aud}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "InstituteCountryId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck27"
                                      >
                                        {this.props.t("Test2 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck28"
                                        autoComplete="off"
                                        defaultChecked={showTest3Aud}
                                        onClick={() =>
                                          this.handleShowColumn("uniAverage")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck28"
                                      >
                                        {this.props.t("Test3 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck29"
                                        autoComplete="off"
                                        defaultChecked={showTest4Aud}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "registrationDiplomaAverage"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck29"
                                      >
                                        {this.props.t("Test4 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck30"
                                        autoComplete="off"
                                        defaultChecked={showTest5Aud}
                                        onClick={() =>
                                          this.handleShowColumn("EstimateId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck30"
                                      >
                                        {this.props.t("Test5 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck31"
                                        autoComplete="off"
                                        defaultChecked={showTest6Aud}
                                        onClick={() =>
                                          this.handleShowColumn("RegUniDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck31"
                                      >
                                        {this.props.t("Test6 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck32"
                                        autoComplete="off"
                                        defaultChecked={showTest7Aud}
                                        onClick={() =>
                                          this.handleShowColumn("academicYear")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck32"
                                      >
                                        {this.props.t("Test7 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                              <Accordion.Header>
                                {t("Archive Marks")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck33"
                                        autoComplete="off"
                                        defaultChecked={showTotalMarksArch}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "HighStudyTypeId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck33"
                                      >
                                        {this.props.t("Total Marks (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck34"
                                        autoComplete="off"
                                        defaultChecked={showPracticalMarksArch}
                                        onClick={() =>
                                          this.handleShowColumn("diplomaId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck34"
                                      >
                                        {this.props.t(
                                          "Practical Marks (Archive)"
                                        )}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck35"
                                        autoComplete="off"
                                        defaultChecked={showFinalExamArch}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "DiplomaCountryId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck35"
                                      >
                                        {this.props.t("Final Exam (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck36"
                                        autoComplete="off"
                                        defaultChecked={showTest1Arch}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "DiplomaGovernorateId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck36"
                                      >
                                        {this.props.t("Test1 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck37"
                                        autoComplete="off"
                                        defaultChecked={showTest2Arch}
                                        onClick={() =>
                                          this.handleShowColumn("DiplomaYear")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck37"
                                      >
                                        {this.props.t("Test2 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck38"
                                        autoComplete="off"
                                        defaultChecked={showTest3Arch}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "ExaminationSession"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck38"
                                      >
                                        {this.props.t("Test3 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck39"
                                        autoComplete="off"
                                        defaultChecked={showTest4Arch}
                                        onClick={() =>
                                          this.handleShowColumn("DiplomaNumber")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck39"
                                      >
                                        {this.props.t("Test4 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck40"
                                        autoComplete="off"
                                        defaultChecked={showTest5Arch}
                                        onClick={() =>
                                          this.handleShowColumn("Average")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck40"
                                      >
                                        {this.props.t("Test5 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck41"
                                        autoComplete="off"
                                        defaultChecked={showTest6Arch}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "CurrentAddress"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck41"
                                      >
                                        {this.props.t("Test6 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck42"
                                        autoComplete="off"
                                        defaultChecked={showTest7Arch}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "CurrentAddrPhone"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck42"
                                      >
                                        {this.props.t("Test7 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                          </Accordion>
                        </CardBody>
                      </Card>
                    </div>
                  </Col>

                  <Col lg={10}>
                    <Card>
                      <CardBody>
                        <div>
                          {duplicateError && (
                            <Alert
                              color="danger"
                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                              role="alert"
                            >
                              {duplicateError}
                              <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={this.handleAlertClose}
                              ></button>
                            </Alert>
                          )}
                          {deleted == 0 && showAlert && (
                            <Alert
                              color="danger"
                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                              role="alert"
                            >
                              {alertMessage}
                              <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={this.handleErrorClose}
                              ></button>
                            </Alert>
                          )}
                          {deleted == 1 && showAlert && (
                            <Alert
                              color="success"
                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                              role="alert"
                            >
                              {alertMessage}
                              <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={this.handleSuccessClose}
                              ></button>
                            </Alert>
                          )}
                        </div>
                        <div className="table-responsive">
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            key="unique-pagination-key"
                            keyField="Pagination-Provider"
                            columns={MainInfoColumns}
                            data={trainees}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Pagination-Provider"
                                key="unique-pagination-key"
                                data={trainees}
                                columns={MainInfoColumns}
                                search
                              >
                                {toolkitprops => (
                                  <React.Fragment>
                                    <Row>
                                      <Col sm="4">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                          {/*   {showSearchButton && ( */}
                                          <div className="position-relative">
                                            <SearchBar
                                              {...toolkitprops.searchProps}
                                              placeholder={t("Search...")}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                      <Col lg="3">
                                        <Select
                                          className="select-style-year"
                                          name="yearId"
                                          key={`yearId`}
                                          options={years}
                                          onChange={newValue => {
                                            this.handleSelectYear(
                                              "yearId",
                                              newValue
                                            );
                                          }}
                                          value={selectedYear}
                                        />
                                      </Col>
                                      {/*    {showAddButton && ( */}
                                      {/* <Col sm="8">
                                        <div className="text-sm-end">
                                          <Tooltip
                                            title={this.props.t("Add")}
                                            placement="top"
                                          >
                                            <IconButton
                                              color="primary"
                                              onClick={this.handleAddRow}
                                            >
                                              <i className="mdi mdi-plus-circle blue-noti-icon" />
                                            </IconButton>
                                          </Tooltip>
                                        </div>
                                      </Col> */}
                                    </Row>
                                    <Col xl="12">
                                      <div className="table-responsive">
                                        <BootstrapTable
                                          keyField="Id"
                                          {...toolkitprops.baseProps}
                                          {...paginationTableProps}
                                          data={trainees}
                                          columns={MainInfoColumns}
                                          noDataIndication={this.props.t(
                                            "No Trainees found"
                                          )}
                                          defaultSorted={defaultSorting}
                                          classes={
                                            "table align-middle table-nowrap table-hover"
                                          }
                                          bordered={false}
                                          striped={false}
                                          responsive
                                          ref={this.node}
                                          filter={filterFactory()}
                                          filterPosition="top"
                                        />
                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                          <PaginationListStandalone
                                            {...paginationProps}
                                          />
                                        </Col>
                                      </div>
                                    </Col>
                                  </React.Fragment>
                                )}
                              </ToolkitProvider>
                            )}
                          </PaginationProvider>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  trainees,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  menu_items,
  tempTrainees,
  nationalities,
  countries,
  cities,
  diplomalevels,
  certificates,
  governorates,
  regReqDocuments,
  genders,
  certificatelevels,
  admissionConditions,
  academiccertificates,
  highstudytypes,
  grants,
  years,
  relatives,
  estimates,
}) => ({
  trainees: trainees.trainees,
  // trainee: trainees.trainee,
  deleted: trainees.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  FatherNames: generalManagements.FatherNames,
  years: years.years,
  nationalities: nationalities.nationalities,
  faculties: mobAppFacultyAccs.faculties,
  countries: countries.countries,
  cities: cities.cities,
  diplomalevels: diplomalevels.diplomalevels,
  governorates: governorates.governorates,
  regReqDocuments: regReqDocuments.regReqDocuments,
  genders: genders.genders,
  academiccertificates: academiccertificates.academiccertificates,
  filteredAcademicCertificates:
    academiccertificates.filteredAcademicCertificates,
  socialStatus: tempTrainees.socialStatus,
  relatives: relatives.relatives,
  regcertificates: tempTrainees.regcertificates,
  deleted: tempTrainees.deleted,
  highstudytypes: highstudytypes.highstudytypes,
  estimates: estimates.estimates,
  requiredDocs: tempTrainees.requiredDocs,
  traineeStatus: trainees.traineeStatus,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  // onGetTrainees: lng => dispatch(getTrainees(lng)),
  onGetYears: () => dispatch(getYears()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TraineesReportList));
