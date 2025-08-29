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

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";

import {
  getTrainees,
  addNewTrainee,
  updateTrainee,
  deleteTrainee,
  getTraineeById,
  // getTraineeRegReqDocs,
} from "store/trainees/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import tempTrainees from "store/new-Trainee/reducer";
class TraineesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profExperiencesArray: [],
      trainees: {},
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
      showFatherName: false,
      showTraineeStatus: false,
      showYear: false,
      showGrandFatherName: false,
      showMotherName: false,
      showBirthDate: false,
      showNationalityId: false,
      BirthLocation: false,
      showFirstName: false,
      showLastName: false,
      showIdentityNo: false,
      showNationalNo: false,
      showIdentityIssueDate: false,
      showPassNumber: false,
      showPassportIssueDate: false,
      showGender: false,
      showCivicZone: false,
      showRegisterZone: false,
      showRegisterNo: false,
      showPassportExpiryDate: false,
      showRegistrationDate: false,
      showCertificateLevel: false,
      showFaculty: false,
      showSpecialty: false,
      showUniversityAverage: false,
      showUniversityName: false,
      showUniversityCountry: false,
      showDiplomaName: false,
      showInstituteCountry: false,
      showDiplomaAverage: false,
      showEstimate: false,
      showCertificateType: false,
      showAcademicYear: false,
      showDiplomaDate: false,
      showDiplomaId: false,
      showDiplomaCountryId: false,
      showDiplomaGovernorateId: false,
      showDiplomaYear: false,
      showExaminationSession: false,
      showDiplomaNumber: false,
      showAverage: false,
      showCurrentAddress: false,
      showCurrentAddrPhone: false,
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
      showGrade: false,
      showCourseStatus: false,
      showDecisionCode: false,
      showDecisionType: false,
      showDecisionDate: false,
      showApplyingDate: false,
      showAcademyCouncilNo: false,
      showAcademyCouncilDate: false,
      showDecisionNote: false,
      modal: false,
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
      showAcademicForm: false,
      showRegistrationForm: false,
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
      selectedTempTraineeStatus: "",
      languageState: "",
      selectedHightStudyTypeId: "",
      selectedEstimateId: "",
      selectedRegUniDate: "",
      isTempTraineeSaved: false,
      selectedTempTraineeId: 0,
      isAdd: false,
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      tempTraineeStatus,
      last_created_trainee,
      tempTrainees,
      tempTrainee_regReqDocs,
      onGetTempTrainees,
      generated_tempTrainee,
      diplomalevels,
      nationalities,
      relatives,
      countries,
      cities,
      yearSemesters,
      governorates,
      regReqDocuments,
      genders,
      certificatelevels,
      admissionConditions,
      academiccertificates,
      filteredFaculties,
      filteredAcademicCertificates,
      grants,
      tempTraineeBrothers,
      onGetTempTraineesRegCertificates,
      trnProfExperiences,
      tempTraineesDocuments,
      generated_student,
      //onGetTempRelatives,
      regcertificates,
      trainees,
      tempTrainee,
      traineeStatus,
      stdWarningTestOpt,
      currencies,
      FatherNames,
      currentSemester,
      semesters,
      faculties,
      onGetTrainees,
      deleted,
      user_menu,
      i18n,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (trainees && !trainees.length) {
    onGetTrainees(lang);

    this.setState({ trainees, tempTrainee });
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
    const { onGetTrainees } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
      onGetTrainees(lng);
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

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
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
        showFatherName: !prevState.showFatherName,
      }));
    }

    if (fieldName == "grandFatherName") {
      this.setState(prevState => ({
        showGrandFatherName: !prevState.showGrandFatherName,
      }));
    }

    if (fieldName == "MotherName") {
      this.setState(prevState => ({
        showMotherName: !prevState.showMotherName,
      }));
    }

    if (fieldName == "birthdate") {
      this.setState(prevState => ({
        showBirthDate: !prevState.showBirthDate,
      }));
    }

    if (fieldName == "NationalityId") {
      this.setState(prevState => ({
        showNationalityId: !prevState.showNationalityId,
      }));
    }

    if (fieldName == "BirthLocation") {
      this.setState(prevState => ({
        BirthLocation: !prevState.BirthLocation,
      }));
    }

    if (fieldName == "FirstName") {
      this.setState(prevState => ({
        showFirstName: !prevState.showFirstName,
      }));
    }

    if (fieldName == "LastName") {
      this.setState(prevState => ({
        showLastName: !prevState.showLastName,
      }));
    }

    if (fieldName == "identityNo") {
      this.setState(prevState => ({
        showIdentityNo: !prevState.showIdentityNo,
      }));
    }

    if (fieldName == "nationalNo") {
      this.setState(prevState => ({
        showNationalNo: !prevState.showNationalNo,
      }));
    }

    if (fieldName == "identityIssueDate") {
      this.setState(prevState => ({
        showIdentityIssueDate: !prevState.showIdentityIssueDate,
      }));
    }

    if (fieldName == "PassNumber") {
      this.setState(prevState => ({
        showPassNumber: !prevState.showPassNumber,
      }));
    }

    if (fieldName == "passportIssueDate") {
      this.setState(prevState => ({
        showPassportIssueDate: !prevState.showPassportIssueDate,
      }));
    }

    if (fieldName == "passportExpiryDate") {
      this.setState(prevState => ({
        showPassportExpiryDate: !prevState.showPassportExpiryDate,
      }));
    }

    if (fieldName == "GenderId") {
      this.setState(prevState => ({
        showGender: !prevState.showGender,
      }));
    }

    if (fieldName == "civicZone") {
      this.setState(prevState => ({
        showCivicZone: !prevState.showCivicZone,
      }));
    }

    if (fieldName == "registerZone") {
      this.setState(prevState => ({
        showRegisterZone: !prevState.showRegisterZone,
      }));
    }

    if (fieldName == "registerNo") {
      this.setState(prevState => ({
        showRegisterNo: !prevState.showRegisterNo,
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
        showRegistrationDate: !prevState.showRegistrationDate,
      }));
    }

    if (fieldName == "registrationCertLevelId") {
      this.setState(prevState => ({
        showCertificateLevel: !prevState.showCertificateLevel,
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
        showUniversityName: !prevState.showUniversityName,
      }));
    }

    if (fieldName == "UnivCountryId") {
      this.setState(prevState => ({
        showUniversityCountry: !prevState.showUniversityCountry,
      }));
    }

    if (fieldName == "uniAverage") {
      this.setState(prevState => ({
        showUniversityAverage: !prevState.showUniversityAverage,
      }));
    }

    if (fieldName == "RegUniDate") {
      this.setState(prevState => ({
        showDiplomaDate: !prevState.showDiplomaDate,
      }));
    }

    if (fieldName == "EstimateId") {
      this.setState(prevState => ({
        showEstimate: !prevState.showEstimate,
      }));
    }

    if (fieldName == "diplomaName") {
      this.setState(prevState => ({
        showDiplomaName: !prevState.showDiplomaName,
      }));
    }

    if (fieldName == "InstituteCountryId") {
      this.setState(prevState => ({
        showInstituteCountry: !prevState.showInstituteCountry,
      }));
    }

    if (fieldName == "registrationDiplomaAverage") {
      this.setState(prevState => ({
        showDiplomaAverage: !prevState.showDiplomaAverage,
      }));
    }

    if (fieldName == "academicYear") {
      this.setState(prevState => ({
        showAcademicYear: !prevState.showAcademicYear,
      }));
    }

    if (fieldName == "HighStudyTypeId") {
      this.setState(prevState => ({
        showCertificateType: !prevState.showCertificateType,
      }));
    }

    if (fieldName == "diplomaId") {
      this.setState(prevState => ({
        showDiplomaId: !prevState.showDiplomaId,
      }));
    }

    if (fieldName == "DiplomaCountryId") {
      this.setState(prevState => ({
        showDiplomaCountryId: !prevState.showDiplomaCountryId,
      }));
    }

    if (fieldName == "DiplomaGovernorateId") {
      this.setState(prevState => ({
        showDiplomaGovernorateId: !prevState.showDiplomaGovernorateId,
      }));
    }

    if (fieldName == "DiplomaYear") {
      this.setState(prevState => ({
        showDiplomaYear: !prevState.showDiplomaYear,
      }));
    }

    if (fieldName == "ExaminationSession") {
      this.setState(prevState => ({
        showExaminationSession: !prevState.showExaminationSession,
      }));
    }

    if (fieldName == "DiplomaNumber") {
      this.setState(prevState => ({
        showDiplomaNumber: !prevState.showDiplomaNumber,
      }));
    }

    if (fieldName == "Average") {
      this.setState(prevState => ({
        showAverage: !prevState.showAverage,
      }));
    }

    if (fieldName == "CurrentAddress") {
      this.setState(prevState => ({
        showCurrentAddress: !prevState.showCurrentAddress,
      }));
    }

    if (fieldName == "CurrentAddrPhone") {
      this.setState(prevState => ({
        showCurrentAddrPhone: !prevState.showCurrentAddrPhone,
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

    if (fieldName == "grade") {
      this.setState(prevState => ({
        showGrade: !prevState.showGrade,
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

  // handleMulti = (fieldName, selectedMulti) => {
  //   if (fieldName === "applyForSemester") {
  //     this.setState({ applyForSemesterArray: selectedMulti });
  //   }

  //   if (fieldName === "nationalNo") {
  //     this.setState({ prevStatusSemesArray: selectedMulti });
  //   }

  //   if (fieldName === "identityNo") {
  //     this.setState({ prevAcademicWarningArray: selectedMulti });
  //   }

  //   if (fieldName === "identityIssueDate") {
  //     this.setState({ applyStatusArray: selectedMulti });
  //   }
  // };

  handleColorChange(event) {
    const selectedValue = event.target.value;
    this.setState({ selectedColor: selectedValue });
  }

  handleViewTrainee = arg => {
    console.log("arg", arg);
    const { onGetTraineeById } = this.props;
    // const { stdDocsArray, profExperiencesArray } = this.state;

    // const filteredTempTrainee = tempTrainees.filter(tempTrainee => tempTrainee.key != arg.Id);
    // console.log("BEFORE tempTrainee", tempTrainee);
    // console.log("BEFORE tempTrainee", tempTrainee);
    onGetTraineeById(arg);
    // console.log("aFTER Btrainee", tempTrainee.Id);
    // console.log("aFTER Btrainee", tempTrainee.ProfessionalExperiences);
    this.setState({
      //   showGenerateButton: true,
      //   // tempTrainee: {
      //   // Id: tempTrainee.Id,
      tempTrainee: arg,
      selectedTempTraineeId: arg.Id,
      nationalityName: arg.nationality || "",
      selectedNationalityId: arg.NationalityId || null,
      // //   //selectedRegistrationDate: arg.RegistrationDate || null,
      selectedGender: arg.GenderId || null,
      genderName: arg.gender || "",
      selectedDiploma: arg.diplomaId || null,
      diplomaTypeName: arg.diplomaTypeName || null,
      averageValue: arg.Average || null,
      selectedCountry: arg.DiplomaCountryId || null,
      facultyName: arg.facultyName || "",
      selectedFacultyId: arg.FacultyId || null,
      studyPlanName: arg.plan_study || "",
      selectedGovernorate: arg.DiplomaGovernorateId || null,
      selectedExaminationSession: arg.ExaminationSession || "",
      selectedRegistrationCertLevelId: arg.registrationCertLevelId || "",
      // // selectedSocialStatus: arg.socialStatusId || "",
      socialStatusName: arg.socialStatusName || null,
      selectedRegistrationDiplomaDate: arg.registrationDiplomaDate || "",
      // //   // },
      // //   tempTraineeId: arg.Id,
      profExperiencesArray:
        arg &&
        arg.ProfessionalExperiences !== undefined &&
        arg.ProfessionalExperiences !== null
          ? arg.ProfessionalExperiences
          : [],
      stdDocsArray:
        arg &&
        arg.RegReqDocTempTrainee !== undefined &&
        arg.RegReqDocTempTrainee !== null
          ? arg.RegReqDocTempTrainee
          : [],
      isEdit: true,
    });
    // console.log("traaaaaaaaaaaineeeerrrrr", tempTraineeId);
    this.toggle();
  };

  handleRegistrationForm = () => {
    this.setState({
      showRegistrationForm: true,
      showAcademicForm: false,
    });
  };

  handleAcademicForm = () => {
    this.setState({
      showAcademicForm: true,
      showRegistrationForm: false,
    });
  };

  handleReportsDropdown = () => {
    const { showAcademicForm, showRegistrationForm } = this.state;

    this.setState({
      showAcademicForm: showAcademicForm ? true : false,
      showRegistrationForm: showRegistrationForm ? true : false,
    });
    this.setState(prevState => ({
      showReportsLi: !prevState.showReportsLi,
    }));
  };

  handleUniTraineesDropdown = () => {
    const { showAcademicForm, showRegistrationForm, showReportsLi } =
      this.state;
    this.setState({
      showAcademicForm: showAcademicForm ? true : false,
      showRegistrationForm: showRegistrationForm ? true : false,
      showReportsLi: showReportsLi ? true : false,
    });
    this.setState(prevState => ({
      showTraineeLifeLi: !prevState.showTraineeLifeLi,
    }));
  };

  toggleTab(tab) {
    if (tab === 5 && !this.state.isTempTraineeSaved && !this.state.isEdit) {
      return;
    }
    if (tab === 4 && !this.state.isTempTraineeSaved && !this.state.isEdit) {
      return;
    }
    const {
      tempTrainee,
      isEdit,
      siblingsArray,
      trnProfExperiences,
      stdDocsArray,
      profExperiencesArray,
    } = this.state;
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        var modifiedSteps = [...this.state.passedSteps, tab];
        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps,
        });
        if (isEdit) {
          this.setState({
            stdDocsArray: tempTrainee.RegReqDocTempTrainee || [],
            profExperiencesArray: tempTrainee.ProfessionalExperiences || [],
          });
        }
      }
      if (tab == 4 && isEdit == false) {
        const { trnProfExperiences } = this.props;
        this.setState({
          profExperiencesArray: trnProfExperiences,
        });
      }

      if (tab == 5 && isEdit == false) {
        const { tempTraineesDocuments } = this.props;
        this.setState({
          stdDocsArray: tempTraineesDocuments,
        });
      }
    }
  }

  handleCollapseButtonClick = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapse-sidebar");
  };

  render() {
    const {
      trainees,
      tempTrainee,
      stdWarningTestOpt,
      FatherNames,
      currencies,
      semesters,
      traineeStatus,
      deleted,
      t,
      faculties,
      isLoading,
      years,
      nationalities,
      relatives,
      countries,
      yearSemesters,
      cities,
      certificates,
      governorates,
      genders,
      certificatelevels,
      admissionConditions,
      academiccertificates,
      filteredFaculties,
      filteredAcademicCertificates,
      generated_tempTrainee,
      grants,
      regReqDocuments,
      tempTraineeBrothers,
      lastAddedId,
      trnProfExperiences,
      socialStatus,
      tempTraineesDocuments,
      diplomalevels,
      onGetFilteredAcademicCertificates,
      getFilteredFaculties,
      regcertificates,
      highstudytypes,
      estimates,
      tempTraineeStatus,
    } = this.props;
    const {
      profExperiencesArray,
      duplicateErrorProfExperiences,
      selectedRegistrationDate,
      selectedRegistrationCertLevelId,
      selectedStudyPattern,
      selectedExaminationSession,
      selectedBirthDate,
      selectedRegistrationDiplomaDate,
      selectedIdentityIssueDate,
      selectedPassportIssueDate,
      selectedPassportExpiryDate,
      selectedDiploma,
      selectedDiplomaDate,
      selectedDiplomaVerificationDate,
      selectedNationalityId,
      showRegistrationForm,
      showAcademicForm,
      showReportsLi,
      showTraineeLifeLi,
      languageState,
      duplicateError,
      errorMessage,
      successMessage,
      sidebarOpen,
      deleteModal,
      isEdit,
      showTraineeStatus,
      showYear,
      showFatherName,
      showGrandFatherName,
      showMotherName,
      showBirthDate,
      showNationalityId,
      BirthLocation,
      showFirstName,
      showLastName,
      showIdentityNo,
      showNationalNo,
      showIdentityIssueDate,
      showPassNumber,
      showPassportIssueDate,
      showPassportExpiryDate,
      showGender,
      showCivicZone,
      showRegisterNo,
      showRegisterZone,
      showFaculty,
      showSpecialty,
      showEstimate,
      showUniversityName,
      showUniversityAverage,
      showUniversityCountry,
      showInstituteCountry,
      showDiplomaAverage,
      showDiplomaName,
      showDiplomaDate,
      showCertificateType,
      showDiplomaId,
      showDiplomaCountryId,
      showAcademicYear,
      showAverage,
      showDiplomaGovernorateId,
      showDiplomaNumber,
      showDiplomaYear,
      showRegistrationDate,
      showCertificateLevel,
      showExaminationSession,
      showCurrentAddress,
      showCurrentAddrCell,
      showCurrentAddrPhone,
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
      showAddButton,
      showDeleteButton,
      showSearchButton,
      selectedFacultyId,
      selectedStudyPlanId,
      facultyName,
      studyPlanName,
      selectedCountry,
      selectedUnivCountry,
      selectedCity,
      selectedSemester,
      selectedGovernorate,
      selectedSocialStatus,
      selectedGender,
      emptyTempTrainee,
      firstNameError,
      lastNameError,
      fatherNameError,
      grandFatherNameError,
      motherNameError,
      birthLocError,
      birthdateError,
      nationalityError,
      genderError,
      facultyError,
      HasBrotherCheck,
      showGenerateButton,
      attestatedValue,
      duplicateErrorSibling,
      stdDocsArray,
      gradeError,
      selectedInstituteCountry,
      selectedHightStudyTypeId,
      selectedEstimateId,
      selectedRegUniDate,
      nationalNoError,
      identityNoError,
      plan_studyError,
      examinationSessionError,
      averageError,
      errorMessage1,
      successMessage1,
      diplomaIdError,
    } = this.state;

    console.log("qqqqqqqqqqqqqqqqqqqqq", tempTrainee);
    const showNewInput =
      selectedRegistrationCertLevelId === 1 ||
      selectedRegistrationCertLevelId === 2;

    const isShowInstituteinfo = selectedRegistrationCertLevelId === 2;

    const isShowUlterStudy = selectedRegistrationCertLevelId === 5;

    const isHightSchooll = selectedRegistrationCertLevelId === 3;

    const showUniForm = selectedRegistrationCertLevelId === 79;

    const formattedRegistrationDate =
      tempTrainee && tempTrainee.RegistrationDate
        ? new Date(tempTrainee.RegistrationDate).toISOString().split("T")[0]
        : selectedRegistrationDate;

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

    const trnProfExperienceColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      { dataField: "workType", text: t("Work Type"), sort: true },
      { dataField: "companyName", text: t("Company Name"), sort: true },
      { dataField: "workPlace", text: t("Work Place"), sort: true },
      { dataField: "workField", text: t("Work Field"), sort: true },
      { dataField: "duaration", text: t("Duration"), sort: true },
      {
        dataField: "uploadFile",
        id: 8,
        key: "file",
        text: this.props.t("Upload Experience Certificate File"),
        editable: false,
        formatter: (cellContent, row) => (
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={event => this.handleupload(row.Id, event)}
            >
              {this.props.t("Upload File")}
            </button>
          </div>
        ),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        // hidden: !showDeleteButton,
        formatter: (cellContent, trnProfExperience) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(trnProfExperience)}
            ></i>
          </Link>
        ),
      },
    ];

    const preReqColumns = [
      {
        dataField: "Id",
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",

        text: this.props.t("Document Name"),
        editable: false,
      },
      {
        dataField: "requiredNumber",

        text: this.props.t("Required Number"),
        editable: false,
      },
      {
        dataField: "availableNumber",

        text: this.props.t("Available Number"),
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue < 0) {
            return {
              valid: false,
              message: this.props.t("Available number value must be > 0"),
            };
          }
          return true;
        },
      },
      {
        dataField: "preventAdmission",

        text: this.props.t("Prevent Admission"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() => this.handleCheckboxEdit(row.Id, "preventAdmission")}
          />
        ),
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Prevent Registration"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() =>
              this.handleCheckboxEdit(row.Id, "preventRegistration")
            }
          />
        ),
      },
      {
        dataField: "preventGraduation",

        text: this.props.t("Prevent Graduation"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() =>
              this.handleCheckboxEdit(row.Id, "preventGraduation")
            }
          />
        ),
      },
      {
        dataField: "requireAttestation",

        text: this.props.t("Require Attestation"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() =>
              this.handleCheckboxEdit(row.Id, "requireAttestation")
            }
          />
        ),
      },
      {
        dataField: "attestated",

        text: this.props.t("Attestated"),
        editable: false,
        formatter: (cellContent, row) => (
          <input
            type="checkbox"
            checked={cellContent === 1}
            disabled
            onChange={() => this.handleCheckboxEdit(row.Id, "attestated")}
          />
        ),
      },

      // {
      //   dataField: "attestated",

      //   text: this.props.t("Attestated"),
      //   formatter: (cellContent, row) => (
      //     <div className="btn-group">
      //       <button
      //         type="button"
      //         className={`btn ${
      //           row.attestated === 1 ? "btn-primary" : "btn-outline-secondary"
      //         }`}
      //         onClick={() =>
      //           this.handleRegReqDocDataChange(row.Id, "attestated", 1)
      //         }
      //       >
      //         {this.props.t("Yes")}
      //       </button>
      //       <button
      //         type="button"
      //         className={`btn ${
      //           row.attestated === 0 ? "btn-primary" : "btn-outline-secondary"
      //         }`}
      //         onClick={() =>
      //           this.handleRegReqDocDataChange(row.Id, "attestated", 0)
      //         }
      //       >
      //         {this.props.t("No")}
      //       </button>
      //     </div>
      //   ),
      //   editorRenderer: (
      //     editorProps,
      //     value,
      //     row,
      //     column,
      //     rowIndex,
      //     columnIndex
      //   ) => (
      //     <div className="btn-group">
      //       <button
      //         type="button"
      //         className={`btn ${
      //           value === 1 ? "btn-primary" : "btn-outline-secondary"
      //         }`}
      //         onClick={() =>
      //           this.handleRegReqDocDataChange(row.regReqDocId, "attestated", 1)
      //         }
      //       >
      //         {this.props.t("Yes")}
      //       </button>
      //       <button
      //         type="button"
      //         className={`btn ${
      //           value === 0 ? "btn-primary" : "btn-outline-secondary"
      //         }`}
      //         onClick={() =>
      //           this.handleRegReqDocDataChange(row.regReqDocId, "attestated", 0)
      //         }
      //       >
      //         {this.props.t("No")}
      //       </button>
      //     </div>
      //   ),
      // },
      {
        dataField: "uploadFile",
        id: 8,
        key: "file",
        text: this.props.t("Upload File"),
        editable: false,
        formatter: (cellContent, row) => (
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={event => this.handleupload(row.Id, event)}
            >
              {this.props.t("Upload File")}
            </button>
          </div>
        ),
      },
    ];

    const MainInfoColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "TraineeNum",
        text: this.props.t("Trainee Number"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "fullName",
        text: this.props.t("Trainee Name"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "admissionDate",
        text: this.props.t("Admission Date"),
        sort: true,
        editable: false,
        hidden: !showAdmissionDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "yearId",
        text: this.props.t("Register Year"),
        sort: true,
        editable: false,
        hidden: !showRegisterYear,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "traineeStatusId",
        text: this.props.t("Trainee Status"),
        sort: true,
        editable: false,
        hidden: !showTraineeStatus,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      // {
      //   dataField: "tempStatusId",
      //   text: this.props.t("tempStatus"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showTraineeName,
      //   // filter: textFilter({
      //   //   placeholder: this.props.t("Search..."),
      //   // }),
      // },

      {
        dataField: "FirstName",
        text: this.props.t("First Name"),
        sort: true,
        editable: false,
        hidden: !showFirstName,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "LastName",
        text: this.props.t("Last Name"),
        sort: true,
        editable: false,
        hidden: !showLastName,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "FatherName",
        text: this.props.t("Father Name"),
        sort: true,
        editable: false,
        hidden: !showFatherName,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "grandFatherName",
        text: this.props.t("Grandfather Name"),
        sort: true,
        editable: false,
        hidden: !showGrandFatherName,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "MotherName",
        text: this.props.t("Mother Name"),
        sort: true,
        editable: false,
        hidden: !showMotherName,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "BirthLocation",
        text: this.props.t("Birth Location"),
        sort: true,
        editable: false,
        hidden: !BirthLocation,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "birthdate",

        text: this.props.t("Birth Date"),
        sort: true,
        editable: false,
        hidden: !showBirthDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "nationalNo",
        text: this.props.t("National No"),
        sort: true,
        editable: false,
        hidden: !showNationalNo,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "identityNo",
        text: this.props.t("Identity No"),
        sort: true,
        // formatter: (cell, row) =>
        //   cell && Array.isArray(cell)
        //     ? cell.map(option => option.label).join(" , ")
        //     : "",
        editable: false,
        hidden: !showIdentityNo,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "identityIssueDate",
        text: this.props.t("Identity Issue Date"),
        editable: false,
        sort: true,
        hidden: !showIdentityIssueDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "PassNumber",
        text: this.props.t("Passport Number"),
        editable: false,
        sort: true,
        hidden: !showPassNumber,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "passportIssueDate",
        text: this.props.t("passport Issue Date"),
        editable: false,
        sort: true,
        hidden: !showPassportIssueDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "passportExpiryDate",
        text: this.props.t("Passport Expiry Date"),
        editable: false,
        sort: true,
        hidden: !showPassportExpiryDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "GenderId",
        text: this.props.t("Gender"),
        editable: false,
        sort: true,
        hidden: !showGender,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "NationalityId",

        text: this.props.t("Nationality"),
        sort: true,
        editable: false,
        hidden: !showNationalityId,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "civicZone",
        text: this.props.t("Civic Zone"),
        editable: false,
        sort: true,
        hidden: !showCivicZone,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "registerZone",
        text: this.props.t("Register Zone"),
        editable: false,
        sort: true,
        hidden: !showRegisterZone,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "registerNo",
        text: this.props.t("Register No"),
        editable: false,
        sort: true,
        hidden: !showRegisterNo,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      ,
      // {
      //   dataField: "passportExpiryDate",
      //   text: this.props.t("Passport Expiry Date"),
      //   editable: false,
      //   hidden: !showPassportExpiryDate,
      //   // filter: textFilter({
      //   //   placeholder: this.props.t("Search..."),
      //   // }),
      // },
      {
        dataField: "RegistrationDate",
        text: this.props.t("Registration Date"),
        editable: false,
        sort: true,
        hidden: !showRegistrationDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "registrationCertLevelId",
        text: this.props.t("Certificate Level"),
        editable: false,
        sort: true,
        hidden: !showCertificateLevel,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "uniName",
        text: this.props.t("UniversityName"),
        editable: false,
        sort: true,
        hidden: !showUniversityName,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "diplomaName",
        text: this.props.t("Diploma Name"),
        editable: false,
        sort: true,
        hidden: !showDiplomaName,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "UnivCountryId",
        text: this.props.t("University Country"),
        editable: false,
        sort: true,
        hidden: !showUniversityCountry,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "InstituteCountryId",
        text: this.props.t("Institute Country"),
        editable: false,
        sort: true,
        hidden: !showInstituteCountry,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "uniAverage",
        text: this.props.t("University Average"),
        editable: false,
        sort: true,
        hidden: !showUniversityAverage,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "registrationDiplomaAverage",
        text: this.props.t("Diploma Average"),
        editable: false,
        sort: true,
        hidden: !showDiplomaAverage,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "EstimateId",
        text: this.props.t("Estimate"),
        editable: false,
        sort: true,
        hidden: !showEstimate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "RegUniDate",
        text: this.props.t("Diploma Date"),
        editable: false,
        sort: true,
        hidden: !showDiplomaDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "academicYear",
        text: this.props.t("Academic Year"),
        editable: false,
        sort: true,
        hidden: !showAcademicYear,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "HighStudyTypeId",
        text: this.props.t("Certificate Type"),
        editable: false,
        sort: true,
        hidden: !showCertificateType,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "diplomaId",
        text: this.props.t("Diploma Type"),
        editable: false,
        sort: true,
        hidden: !showDiplomaId,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "DiplomaCountryId",
        text: this.props.t("Diploma Country"),
        editable: false,
        sort: true,
        hidden: !showDiplomaCountryId,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "DiplomaGovernorateId",
        text: this.props.t("Diploma Governorate"),
        editable: false,
        sort: true,
        hidden: !showDiplomaGovernorateId,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "DiplomaYear",
        text: this.props.t("Diploma Year"),
        editable: false,
        sort: true,
        hidden: !showDiplomaYear,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "ExaminationSession",
        text: this.props.t("Examination Session"),
        editable: false,
        sort: true,
        hidden: !showExaminationSession,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "DiplomaNumber",
        text: this.props.t("Diploma Number"),
        editable: false,
        sort: true,
        hidden: !showDiplomaNumber,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "Average",
        text: this.props.t("Averager"),
        editable: false,
        sort: true,
        hidden: !showAverage,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "CurrentAddress",
        text: this.props.t("Current Address"),
        editable: false,
        sort: true,
        hidden: !showCurrentAddress,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      ,
      {
        dataField: "CurrentAddrPhone",
        text: this.props.t("Current Phone"),
        editable: false,
        sort: true,
        hidden: !showCurrentAddrPhone,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      ,
      {
        dataField: "CurrentAddrCell",
        text: this.props.t("Current Mobile"),
        editable: false,
        sort: true,
        hidden: !showCurrentAddrCell,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      ,
      {
        dataField: "PermanentAddress",
        text: this.props.t("Permanent Address"),
        editable: false,
        sort: true,
        hidden: !showPermanentAddress,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "ParentAddrPhone",
        text: this.props.t("Parent Phone"),
        editable: false,
        sort: true,
        hidden: !showParentAddrPhone,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "WhatsappMobileNum",
        text: this.props.t("Whatsapp Number"),
        editable: false,
        sort: true,
        hidden: !showWhatsappMobileNum,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "Email",
        text: this.props.t("Email"),
        editable: false,
        sort: true,
        hidden: !showEmail,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "workType",
        text: this.props.t("Job Title"),
        editable: false,
        sort: true,
        hidden: !showJobTitle,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "companyName",
        text: this.props.t("Work Place"),
        editable: false,
        sort: true,
        hidden: !showWorkPlace,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "workPlace",
        text: this.props.t("Work address"),
        editable: false,
        sort: true,
        hidden: !showWorkAddress,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "workField",
        text: this.props.t("Work Field"),
        editable: false,
        sort: true,
        hidden: !showWorkField,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "duaration",
        text: this.props.t("work Duration"),
        editable: false,
        sort: true,
        hidden: !showWorkDuration,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "lastRegCourse",
        text: this.props.t("Last Reg.Course"),
        editable: false,
        sort: true,
        hidden: !showLastRegCourse,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "grade",
        text: this.props.t("Grade"),
        editable: false,
        sort: true,
        hidden: !showGrade,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      // {
      //   dataField: "LastRegCourse",
      //   text: this.props.t("Last Reg.Course"),
      //   editable: false,
      //   hidden: !showLastRegCourse,
      //   // filter: textFilter({
      //   //   placeholder: this.props.t("Search..."),
      //   // }),
      // },
      {
        dataField: "courseStatus",
        text: this.props.t("Course Status"),
        editable: false,
        sort: true,
        hidden: !showCourseStatus,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "decisionCode",
        text: this.props.t("Decision Code"),
        editable: false,
        sort: true,
        hidden: !showDecisionCode,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "decisionType",
        text: this.props.t("Decision Type"),
        editable: false,
        sort: true,
        hidden: !showDecisionType,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "decisionDate",
        text: this.props.t("Decision Date"),
        editable: false,
        sort: true,
        hidden: !showDecisionDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "applyingDate",
        text: this.props.t("Applying Date"),
        editable: false,
        sort: true,
        hidden: !showApplyingDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "academyCouncilNo",
        text: this.props.t("Academy Council No"),
        editable: false,
        sort: true,
        hidden: !showAcademyCouncilNo,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "academyCouncilDate",
        text: this.props.t("Academy Council Date"),
        editable: false,
        sort: true,
        hidden: !showAcademyCouncilDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "decisionNote",
        text: this.props.t("Decision Note"),
        editable: false,
        sort: true,
        hidden: !showDecisionNote,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
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
                        <CardHeader>{t("Required data")}</CardHeader>
                        <CardBody style={{ padding: "0" }}>
                          <Accordion flush>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>
                                {t("Main Info")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck17"
                                        autoComplete="off"
                                        defaultChecked={showYear}
                                        onClick={() =>
                                          this.handleShowColumn("yearId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck17"
                                      >
                                        {this.props.t("Year")}
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
                                        defaultChecked={showTraineeStatus}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "traineeStatusId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck18"
                                      >
                                        {this.props.t("Trainee Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                              <Accordion.Header>
                                {t("Personal Information")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <Col>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck15"
                                          autoComplete="off"
                                          defaultChecked={showFirstName}
                                          onClick={() =>
                                            this.handleShowColumn("FirstName")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck15"
                                        >
                                          {this.props.t("First Name")}
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
                                          id="btncheck4"
                                          autoComplete="off"
                                          defaultChecked={showLastName}
                                          onClick={() =>
                                            this.handleShowColumn("LastName")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck4"
                                        >
                                          {this.props.t("Last Name")}
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
                                          defaultChecked={showFatherName}
                                          onClick={() =>
                                            this.handleShowColumn("FatherName")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck16"
                                        >
                                          {this.props.t("Father Name")}
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
                                          defaultChecked={showGrandFatherName}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "grandFatherName"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck3"
                                        >
                                          {this.props.t("Grandfather Name")}
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
                                          defaultChecked={showMotherName}
                                          onClick={() =>
                                            this.handleShowColumn("MotherName")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck6"
                                        >
                                          {this.props.t("Mother Name")}
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
                                          defaultChecked={BirthLocation}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "BirthLocation"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck5"
                                        >
                                          {this.props.t("Birth Location")}
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
                                          defaultChecked={showBirthDate}
                                          onClick={() =>
                                            this.handleShowColumn("birthdate")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck7"
                                        >
                                          {this.props.t("Birth Date")}
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
                                          defaultChecked={showNationalityId}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "NationalityId"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck8"
                                        >
                                          {this.props.t("Nationality")}
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
                                          defaultChecked={showNationalNo}
                                          onClick={() =>
                                            this.handleShowColumn("nationalNo")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck9"
                                        >
                                          {this.props.t("National No")}
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
                                          defaultChecked={showIdentityNo}
                                          onClick={() =>
                                            this.handleShowColumn("identityNo")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck10"
                                        >
                                          {this.props.t("Identity No")}
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
                                          defaultChecked={showIdentityIssueDate}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "identityIssueDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck11"
                                        >
                                          {this.props.t("Identity Issue Date")}
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
                                          defaultChecked={showPassNumber}
                                          onClick={() =>
                                            this.handleShowColumn("PassNumber")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck12"
                                        >
                                          {this.props.t("Passport Number")}
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
                                          defaultChecked={showPassportIssueDate}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "passportIssueDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck14"
                                        >
                                          {this.props.t("Passport Issue Date")}
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
                                          id="btncheck13"
                                          autoComplete="off"
                                          defaultChecked={
                                            showPassportExpiryDate
                                          }
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "passportExpiryDate"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck13"
                                        >
                                          {this.props.t("Passport Expiry Date")}
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
                                          defaultChecked={showGender}
                                          onClick={() =>
                                            this.handleShowColumn("GenderId")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck21"
                                        >
                                          {this.props.t("Gender")}
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
                                          defaultChecked={showCivicZone}
                                          onClick={() =>
                                            this.handleShowColumn("civicZone")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck22"
                                        >
                                          {this.props.t("Civic Zone")}
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
                                          defaultChecked={showRegisterZone}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "registerZone"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck19"
                                        >
                                          {this.props.t("Register Zone")}
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
                                          defaultChecked={showRegisterNo}
                                          onClick={() =>
                                            this.handleShowColumn("registerNo")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck20"
                                        >
                                          {this.props.t("Register No")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                              <Accordion.Header>
                                {t("Academic Info")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck30"
                                        autoComplete="off"
                                        defaultChecked={showRegistrationDate}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "RegistrationDate"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck30"
                                      >
                                        {this.props.t("Registration Date")}
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
                                        defaultChecked={showAdmissionDate}
                                        onClick={() =>
                                          this.handleShowColumn("admissionDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck2"
                                      >
                                        {this.props.t("Admission Date")}
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
                                        id="btncheck1"
                                        autoComplete="off"
                                        defaultChecked={showRegisterYear}
                                        onClick={() =>
                                          this.handleShowColumn("yearId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck1"
                                      >
                                        {this.props.t("Register Year")}
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
                                        defaultChecked={showCertificateLevel}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "registrationCertLevelId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck31"
                                      >
                                        {this.props.t("Certificate Level")}
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
                                        id="btncheck55"
                                        autoComplete="off"
                                        defaultChecked={showFaculty}
                                        onClick={() =>
                                          this.handleShowColumn("FacultyId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck55"
                                      >
                                        {this.props.t("Faculty")}
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
                                        id="btncheck56"
                                        autoComplete="off"
                                        defaultChecked={showSpecialty}
                                        onClick={() =>
                                          this.handleShowColumn("plan_study")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck56"
                                      >
                                        {this.props.t("Specialty")}
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
                                        id="btncheck57"
                                        autoComplete="off"
                                        defaultChecked={showUniversityName}
                                        onClick={() =>
                                          this.handleShowColumn("uniName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck57"
                                      >
                                        {this.props.t("University Name")}
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
                                        id="btncheck58"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaName}
                                        onClick={() =>
                                          this.handleShowColumn("diplomaName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck58"
                                      >
                                        {this.props.t("Diploma Name")}
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
                                        id="btncheck59"
                                        autoComplete="off"
                                        defaultChecked={showUniversityCountry}
                                        onClick={() =>
                                          this.handleShowColumn("UnivCountryId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck59"
                                      >
                                        {this.props.t("University Country")}
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
                                        id="btncheck60"
                                        autoComplete="off"
                                        defaultChecked={showInstituteCountry}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "InstituteCountryId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck60"
                                      >
                                        {this.props.t("Institute Country")}
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
                                        id="btncheck61"
                                        autoComplete="off"
                                        defaultChecked={showUniversityAverage}
                                        onClick={() =>
                                          this.handleShowColumn("uniAverage")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck61"
                                      >
                                        {this.props.t("University Average")}
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
                                        id="btncheck62"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaAverage}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "registrationDiplomaAverage"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck62"
                                      >
                                        {this.props.t("Diploma Average")}
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
                                        id="btncheck63"
                                        autoComplete="off"
                                        defaultChecked={showEstimate}
                                        onClick={() =>
                                          this.handleShowColumn("EstimateId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck63"
                                      >
                                        {this.props.t("Estimate")}
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
                                        id="btncheck64"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaDate}
                                        onClick={() =>
                                          this.handleShowColumn("RegUniDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck64"
                                      >
                                        {this.props.t("Diploma Date")}
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
                                        id="btncheck65"
                                        autoComplete="off"
                                        defaultChecked={showAcademicYear}
                                        onClick={() =>
                                          this.handleShowColumn("academicYear")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck65"
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
                                        id="btncheck66"
                                        autoComplete="off"
                                        defaultChecked={showCertificateType}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "HighStudyTypeId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck66"
                                      >
                                        {this.props.t("Certificate Type")}
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
                                        defaultChecked={showDiplomaId}
                                        onClick={() =>
                                          this.handleShowColumn("diplomaId")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck32"
                                      >
                                        {this.props.t("Diploma Type")}
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
                                        id="btncheck33"
                                        autoComplete="off"
                                        defaultChecked={showDiplomaCountryId}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "DiplomaCountryId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck33"
                                      >
                                        {this.props.t("Diploma Country")}
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
                                        defaultChecked={
                                          showDiplomaGovernorateId
                                        }
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "DiplomaGovernorateId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck34"
                                      >
                                        {this.props.t("Diploma Governorate")}
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
                                        defaultChecked={showDiplomaYear}
                                        onClick={() =>
                                          this.handleShowColumn("DiplomaYear")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck35"
                                      >
                                        {this.props.t("Diploma Year")}
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
                                        defaultChecked={showExaminationSession}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "ExaminationSession"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck36"
                                      >
                                        {this.props.t("Examination Session")}
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
                                        defaultChecked={showDiplomaNumber}
                                        onClick={() =>
                                          this.handleShowColumn("DiplomaNumber")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck37"
                                      >
                                        {this.props.t("Diploma Number")}
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
                                        defaultChecked={showAverage}
                                        onClick={() =>
                                          this.handleShowColumn("Average")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck38"
                                      >
                                        {this.props.t("Average")}
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
                                        defaultChecked={showRegistrationDate}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "RegistrationDate"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck39"
                                      >
                                        {this.props.t("Registration Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                              <Accordion.Header>
                                {t("Contact Info")}
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
                                        defaultChecked={showCurrentAddress}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "CurrentAddress"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck23"
                                      >
                                        {this.props.t("Current Address")}
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
                                        defaultChecked={showCurrentAddrPhone}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "CurrentAddrPhone"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck24"
                                      >
                                        {this.props.t("Current Phone")}
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
                                        defaultChecked={showCurrentAddrCell}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "CurrentAddrCell"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck25"
                                      >
                                        {this.props.t("Current Mobile")}
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
                                        defaultChecked={showPermanentAddress}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "PermanentAddress"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck26"
                                      >
                                        {this.props.t("Permanent Address")}
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
                                        defaultChecked={showParentAddrPhone}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "ParentAddrPhone"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck27"
                                      >
                                        {this.props.t("Parent Phone")}
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
                                        defaultChecked={showWhatsappMobileNum}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "WhatsappMobileNum"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck28"
                                      >
                                        {this.props.t("WhatsApp Number")}
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
                                        defaultChecked={showEmail}
                                        onClick={() =>
                                          this.handleShowColumn("Email")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck29"
                                      >
                                        {this.props.t("Email")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="4">
                              <Accordion.Header>
                                {t("Professional experiences")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck40"
                                        autoComplete="off"
                                        defaultChecked={showJobTitle}
                                        onClick={() =>
                                          this.handleShowColumn("workType")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck40"
                                      >
                                        {this.props.t("Job Title")}
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
                                        defaultChecked={showWorkPlace}
                                        onClick={() =>
                                          this.handleShowColumn("companyName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck41"
                                      >
                                        {this.props.t("Work Place")}
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
                                        defaultChecked={showWorkAddress}
                                        onClick={() =>
                                          this.handleShowColumn("workPlace")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck42"
                                      >
                                        {this.props.t("Work Address")}
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
                                        defaultChecked={showWorkField}
                                        onClick={() =>
                                          this.handleShowColumn("workField")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck43"
                                      >
                                        {this.props.t("Work Field")}
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
                                        id="btncheck44"
                                        autoComplete="off"
                                        defaultChecked={showWorkDuration}
                                        onClick={() =>
                                          this.handleShowColumn("duaration")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck44"
                                      >
                                        {this.props.t("work Duration")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="5">
                              <Accordion.Header>
                                {t("Register Info")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck45"
                                        autoComplete="off"
                                        defaultChecked={showLastRegCourse}
                                        onClick={() =>
                                          this.handleShowColumn("lastRegCourse")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck45"
                                      >
                                        {this.props.t("Last Reg.Course")}
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
                                        id="btncheck46"
                                        autoComplete="off"
                                        defaultChecked={showGrade}
                                        onClick={() =>
                                          this.handleShowColumn("grade")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck46"
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
                                        id="btncheck47"
                                        autoComplete="off"
                                        defaultChecked={showCourseStatus}
                                        onClick={() =>
                                          this.handleShowColumn("courseStatus")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck47"
                                      >
                                        {this.props.t("Course Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="6">
                              <Accordion.Header>
                                {t("Trainee Decisions")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck48"
                                        autoComplete="off"
                                        defaultChecked={showDecisionCode}
                                        onClick={() =>
                                          this.handleShowColumn("decisionCode")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck48"
                                      >
                                        {this.props.t("Decision Code")}
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
                                        id="btncheck49"
                                        autoComplete="off"
                                        defaultChecked={showDecisionType}
                                        onClick={() =>
                                          this.handleShowColumn("decisionType")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck49"
                                      >
                                        {this.props.t("Decision Type")}
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
                                        id="btncheck50"
                                        autoComplete="off"
                                        defaultChecked={showDecisionDate}
                                        onClick={() =>
                                          this.handleShowColumn("decisionDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck50"
                                      >
                                        {this.props.t("Decision Date")}
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
                                        id="btncheck51"
                                        autoComplete="off"
                                        defaultChecked={showApplyingDate}
                                        onClick={() =>
                                          this.handleShowColumn("applyingDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck51"
                                      >
                                        {this.props.t("Applying Date")}
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
                                        id="btncheck52"
                                        autoComplete="off"
                                        defaultChecked={showAcademyCouncilNo}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "academyCouncilNo"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck52"
                                      >
                                        {this.props.t("Academy Council No")}
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
                                        id="btncheck53"
                                        autoComplete="off"
                                        defaultChecked={showAcademyCouncilDate}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "academyCouncilDate"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck53"
                                      >
                                        {this.props.t("Academy Council Date")}
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
                                        id="btncheck54"
                                        autoComplete="off"
                                        defaultChecked={showDecisionNote}
                                        onClick={() =>
                                          this.handleShowColumn("decisionNote")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck54"
                                      >
                                        {this.props.t("Decision Note")}
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
                                        <Modal
                                          isOpen={this.state.modal}
                                          className={this.props.className}
                                          fullscreen
                                        >
                                          <ModalHeader
                                            toggle={this.toggle}
                                            tag="h4"
                                          >
                                            {!!isEdit
                                              ? this.props.t("Edit Trainee")
                                              : this.props.t("Add New Trainee")}
                                          </ModalHeader>
                                          <Row>
                                            <div>
                                              {errorMessage && (
                                                <Alert
                                                  color="danger"
                                                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                  role="alert"
                                                >
                                                  {errorMessage}
                                                  <button
                                                    type="button"
                                                    className="btn-close"
                                                    aria-label="Close"
                                                    onClick={
                                                      this.handleErrorClose
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}
                                            </div>
                                          </Row>
                                          <ModalBody>
                                            <div className="modal">
                                              <div className="sidebar">
                                                <h2 className="trainee-info">
                                                  {languageState === "ar"
                                                    ? tempTrainee.FirstName +
                                                      " " +
                                                      tempTrainee.FatherName +
                                                      " " +
                                                      tempTrainee.LastName +
                                                      " "
                                                    : tempTrainee.FirstNameE +
                                                      " " +
                                                      tempTrainee.FatherNameE +
                                                      " " +
                                                      tempTrainee.LastNameE +
                                                      " "}

                                                  <span className="trainee-id">
                                                    {tempTrainee.TraineeNum}
                                                  </span>
                                                </h2>
                                                <ul>
                                                  <li>
                                                    <a
                                                      href="#"
                                                      onClick={
                                                        this.handleAcademicForm
                                                      }
                                                      style={{
                                                        color: showAcademicForm
                                                          ? "orange"
                                                          : "black",
                                                      }}
                                                    >
                                                      {this.props.t(
                                                        "Academic File"
                                                      )}
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <a
                                                      href="#"
                                                      onClick={
                                                        this
                                                          .handleRegistrationForm
                                                      }
                                                      style={{
                                                        color:
                                                          showRegistrationForm
                                                            ? "orange"
                                                            : "black",
                                                      }}
                                                    >
                                                      {this.props.t(
                                                        "Registration File"
                                                      )}
                                                    </a>
                                                  </li>
                                                  <li>
                                                    <a
                                                      href="#"
                                                      onClick={
                                                        this
                                                          .handleUniTraineesDropdown
                                                      }
                                                    >
                                                      {this.props.t(
                                                        "Trainee Life"
                                                      )}
                                                      {showTraineeLifeLi && (
                                                        <span>
                                                          <i className="mdi mdi-chevron-down float-end" />
                                                        </span>
                                                      )}
                                                      {!showTraineeLifeLi && (
                                                        <span>
                                                          <i className="bx bx-chevron-right float-end" />
                                                        </span>
                                                      )}
                                                    </a>
                                                    {showTraineeLifeLi && (
                                                      <ul className="included-items">
                                                        <li>
                                                          <a>
                                                            {this.props.t(
                                                              "Trainee status"
                                                            )}
                                                          </a>
                                                        </li>
                                                        <li>
                                                          <a>
                                                            {this.props.t(
                                                              "Remaining Courses"
                                                            )}
                                                          </a>
                                                        </li>
                                                        <li>
                                                          <a>
                                                            {this.props.t(
                                                              "Trainee Performance"
                                                            )}
                                                          </a>
                                                        </li>
                                                        <li>
                                                          <a>
                                                            {this.props.t(
                                                              "Trainee Requests"
                                                            )}
                                                          </a>
                                                        </li>
                                                        <li>
                                                          <a>
                                                            {this.props.t(
                                                              "Trainee Exceptions"
                                                            )}
                                                          </a>
                                                        </li>
                                                        <li>
                                                          <a>
                                                            {this.props.t(
                                                              "Disciplinary Decisions"
                                                            )}
                                                          </a>
                                                        </li>
                                                        <li>
                                                          <a>
                                                            {this.props.t(
                                                              "Decisions of the Registered Office"
                                                            )}
                                                          </a>
                                                        </li>
                                                        <li>
                                                          <a>
                                                            {this.props.t(
                                                              "Documents Requests"
                                                            )}
                                                          </a>
                                                        </li>

                                                        <li>
                                                          <a
                                                            href="#"
                                                            onClick={
                                                              this
                                                                .handleReportsDropdown
                                                            }
                                                          >
                                                            {this.props.t(
                                                              "Trainee Reports"
                                                            )}
                                                            {showReportsLi && (
                                                              <span>
                                                                <i className="mdi mdi-chevron-down float-end" />
                                                              </span>
                                                            )}
                                                            {!showReportsLi && (
                                                              <span>
                                                                <i className="bx bx-chevron-right float-end" />
                                                              </span>
                                                            )}
                                                          </a>
                                                          {showReportsLi && (
                                                            <ul className="included-items">
                                                              <li>
                                                                <a>
                                                                  {this.props.t(
                                                                    "Grades detection (all majors)"
                                                                  )}
                                                                </a>
                                                              </li>
                                                              <li>
                                                                <a>
                                                                  {this.props.t(
                                                                    "Current Semester Grades"
                                                                  )}
                                                                </a>
                                                              </li>
                                                              <li>
                                                                <a>
                                                                  {this.props.t(
                                                                    "Grade detection (according to current semester)"
                                                                  )}
                                                                </a>
                                                              </li>
                                                              <li>
                                                                <a>
                                                                  {this.props.t(
                                                                    "Grade detection (according to certificates)"
                                                                  )}
                                                                </a>
                                                              </li>
                                                              <li>
                                                                <a>
                                                                  {this.props.t(
                                                                    "Grade detection (according to requirements)"
                                                                  )}
                                                                </a>
                                                              </li>
                                                              <li>
                                                                <a>
                                                                  {this.props.t(
                                                                    "Grade detection (according to courses)"
                                                                  )}
                                                                </a>
                                                              </li>
                                                              <li>
                                                                <a>
                                                                  {this.props.t(
                                                                    "Grade detection (according to courses newspaper)"
                                                                  )}
                                                                </a>
                                                              </li>
                                                              <li>
                                                                <a>
                                                                  {this.props.t(
                                                                    "Grade detection (without blocking)"
                                                                  )}
                                                                </a>
                                                              </li>
                                                            </ul>
                                                          )}
                                                        </li>
                                                      </ul>
                                                    )}
                                                  </li>
                                                </ul>
                                              </div>
                                              <div className="collapse-button">
                                                <i
                                                  onClick={
                                                    this
                                                      .handleCollapseButtonClick
                                                  }
                                                  className="bx bx-menu"
                                                ></i>
                                              </div>

                                              <div className="modal-content">
                                                {showAcademicForm && (
                                                  <div>
                                                    <Card className="bordered">
                                                      <CardHeader className="card-header">
                                                        <h4>
                                                          <i className="fas fa-user-circle" />{" "}
                                                          {languageState ===
                                                          "ar"
                                                            ? tempTrainee.FirstName +
                                                              " " +
                                                              tempTrainee.FatherName +
                                                              " " +
                                                              tempTrainee.LastName +
                                                              " [" +
                                                              tempTrainee.TraineeNum +
                                                              "]"
                                                            : tempTrainee.FirstNameE +
                                                              " " +
                                                              tempTrainee.FatherNameE +
                                                              " " +
                                                              tempTrainee.LastNameE +
                                                              " [" +
                                                              tempTrainee.TraineeNum +
                                                              "]"}
                                                        </h4>
                                                      </CardHeader>
                                                      <CardBody>
                                                        <Row>
                                                          <Col lg="4">
                                                            <div className="mb-2">
                                                              <Label className="right-label">
                                                                {this.props.t(
                                                                  "Faculty"
                                                                )}{" "}
                                                                :
                                                              </Label>
                                                              <Label className="left-label">
                                                                {
                                                                  (
                                                                    faculties.find(
                                                                      opt =>
                                                                        opt.value ===
                                                                        tempTrainee.FacultyId
                                                                    ) || ""
                                                                  ).label
                                                                }
                                                              </Label>
                                                            </div>

                                                            {/* <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Last Semester"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label">
                                                            {tempTrainee.registerYearSemesterId
                                                              ? yearSemesters.find(
                                                                  yearSemester =>
                                                                    yearSemester.key ===
                                                                      tempTrainee.registerYearSemesterId ||
                                                                    ""
                                                                ).value
                                                              : ""}
                                                          </Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Level"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Finished Hours"
                                                            )}
                                                          </Label>

                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "GPA"
                                                            )}{" "}
                                                            :
                                                          </Label>

                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Academic Warning"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>
                                                      </Col>
                                                      <Col lg="4">
                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Academic Director"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Trainee Status"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Last Semester Status"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Current Semester Status"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Label className="right-label">
                                                            {this.props.t(
                                                              "Transfer Hours"
                                                            )}{" "}
                                                            :
                                                          </Label>
                                                          <Label className="left-label"></Label>
                                                        </div>*/}
                                                          </Col>
                                                        </Row>
                                                      </CardBody>
                                                    </Card>

                                                    {/* <Card className="bordered">
                                                  <CardHeader className="card-header">
                                                    <h4>
                                                      {" "}
                                                      {this.props.t(
                                                        "Financial Informations"
                                                      )}
                                                    </h4>
                                                  </CardHeader>
                                                  <CardBody>
                                                    <Row>
                                                      <Col lg="4">
                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Semester Fees"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Total Payments"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Total Semester Payments"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Amount to be paid"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Remaining Balance"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Col>
                                                      <Col lg="4">
                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Currency"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Financial Hourly Rate"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-2">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Study Fees"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-2">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label className="label-style">
                                                                {this.props.t(
                                                                  "Service and Order Fees"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Label></Label>
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Col>
                                                    </Row> 
                                                  </CardBody>
                                                </Card>*/}
                                                  </div>
                                                )}

                                                {showRegistrationForm && (
                                                  <Formik
                                                    enableReinitialize={true}
                                                    initialValues={
                                                      (isEdit && {
                                                        Id: tempTrainee.Id,
                                                        FirstName:
                                                          (tempTrainee &&
                                                            tempTrainee.FirstName) ||
                                                          "",
                                                        LastName:
                                                          (tempTrainee &&
                                                            tempTrainee.LastName) ||
                                                          "",
                                                        FatherName:
                                                          (tempTrainee &&
                                                            tempTrainee.FatherName) ||
                                                          "",
                                                        grandFatherName:
                                                          (tempTrainee &&
                                                            tempTrainee.grandFatherName) ||
                                                          "",
                                                        MotherName:
                                                          (tempTrainee &&
                                                            tempTrainee.MotherName) ||
                                                          "",
                                                        BirthLocation:
                                                          (tempTrainee &&
                                                            tempTrainee.BirthLocation) ||
                                                          "",
                                                        FirstNameE:
                                                          (tempTrainee &&
                                                            tempTrainee.FirstNameE) ||
                                                          "",
                                                        LastNameE:
                                                          (tempTrainee &&
                                                            tempTrainee.LastNameE) ||
                                                          "",
                                                        FatherNameE:
                                                          (tempTrainee &&
                                                            tempTrainee.FatherNameE) ||
                                                          "",
                                                        grandFatherNameE:
                                                          (tempTrainee &&
                                                            tempTrainee.grandFatherNameE) ||
                                                          "",
                                                        MotherNameE:
                                                          (tempTrainee &&
                                                            tempTrainee.MotherNameE) ||
                                                          "",
                                                        BirthLocationE:
                                                          (tempTrainee &&
                                                            tempTrainee.BirthLocationE) ||
                                                          "",
                                                        birthdate:
                                                          (tempTrainee &&
                                                            tempTrainee.birthdate) ||
                                                          selectedBirthDate,
                                                        NationalityId:
                                                          (tempTrainee &&
                                                            tempTrainee.NationalityId) ||
                                                          selectedNationalityId,
                                                        GenderId:
                                                          (tempTrainee &&
                                                            tempTrainee.GenderId) ||
                                                          selectedGender ||
                                                          "",

                                                        nationalNo:
                                                          (tempTrainee &&
                                                            tempTrainee.nationalNo) ||
                                                          "",
                                                        identityNo:
                                                          (tempTrainee &&
                                                            tempTrainee.identityNo) ||
                                                          "",
                                                        identityIssueDate:
                                                          (tempTrainee &&
                                                            tempTrainee.identityIssueDate) ||
                                                          selectedIdentityIssueDate ||
                                                          "",
                                                        civicZone:
                                                          (tempTrainee &&
                                                            tempTrainee.civicZone) ||
                                                          "",
                                                        registerZone:
                                                          (tempTrainee &&
                                                            tempTrainee.registerZone) ||
                                                          "",
                                                        registerNo:
                                                          (tempTrainee &&
                                                            tempTrainee.registerNo) ||
                                                          "",
                                                        PassNumber:
                                                          (tempTrainee &&
                                                            tempTrainee.PassNumber) ||
                                                          "",
                                                        passportIssueDate:
                                                          (tempTrainee &&
                                                            tempTrainee.passportIssueDate) ||
                                                          selectedPassportIssueDate,
                                                        passportExpiryDate:
                                                          (tempTrainee &&
                                                            tempTrainee.passportExpiryDate) ||
                                                          selectedPassportExpiryDate,
                                                        diplomaId:
                                                          (tempTrainee &&
                                                            tempTrainee.diplomaId) ||
                                                          selectedDiploma,
                                                        DiplomaCountryId:
                                                          (tempTrainee &&
                                                            tempTrainee.DiplomaCountryId) ||
                                                          selectedCountry,

                                                        DiplomaNumber:
                                                          (tempTrainee &&
                                                            tempTrainee.DiplomaNumber) ||
                                                          "",
                                                        DiplomaGovernorateId:
                                                          (tempTrainee &&
                                                            tempTrainee.DiplomaGovernorateId) ||
                                                          selectedGovernorate,

                                                        /* DiplomaCityId:
                                                                            (tempTrainee && tempTrainee.DiplomaCityId) ||
                                                                            selectedCity, */

                                                        DiplomaYear:
                                                          (tempTrainee &&
                                                            tempTrainee.DiplomaYear) ||
                                                          "",
                                                        ExaminationSession:
                                                          (tempTrainee &&
                                                            tempTrainee.ExaminationSession) ||
                                                          "",
                                                        Average:
                                                          (tempTrainee &&
                                                            tempTrainee.Average) ||
                                                          "",
                                                        diplomaDate:
                                                          (tempTrainee &&
                                                            tempTrainee.diplomaDate) ||
                                                          selectedDiplomaDate,
                                                        diplomaVerificationNum:
                                                          (tempTrainee &&
                                                            tempTrainee.diplomaVerificationNum) ||
                                                          "",
                                                        diplomaVerificationDate:
                                                          (tempTrainee &&
                                                            tempTrainee.diplomaVerificationDate) ||
                                                          selectedDiplomaVerificationDate,
                                                        socialStatusId:
                                                          tempTrainee &&
                                                          tempTrainee.socialStatusId,
                                                        registrationCertLevelId:
                                                          (tempTrainee &&
                                                            tempTrainee.registrationCertLevelId) ||
                                                          selectedRegistrationCertLevelId,
                                                        registrationDiplomaName:
                                                          (tempTrainee &&
                                                            tempTrainee.registrationDiplomaName) ||
                                                          "",
                                                        registrationDiplomaDepartment:
                                                          (tempTrainee &&
                                                            tempTrainee.registrationDiplomaDepartment) ||
                                                          "",
                                                        diplomaName:
                                                          (tempTrainee &&
                                                            tempTrainee.diplomaName) ||
                                                          "",

                                                        registrationDiplomaAverage:
                                                          (tempTrainee &&
                                                            tempTrainee.registrationDiplomaAverage) ||
                                                          "",
                                                        uniAverage:
                                                          (tempTrainee &&
                                                            tempTrainee.uniAverage) ||
                                                          "",
                                                        registrationDiplomaDate:
                                                          (tempTrainee &&
                                                            tempTrainee.registrationDiplomaDate) ||
                                                          selectedRegistrationDiplomaDate,

                                                        uniName:
                                                          (tempTrainee &&
                                                            tempTrainee.uniName) ||
                                                          "",
                                                        UnivCountryId:
                                                          (tempTrainee &&
                                                            tempTrainee.UnivCountryId) ||
                                                          selectedUnivCountry,

                                                        /* TransferUnivAverage:
                                                                            (tempTrainee && tempTrainee.TransferUnivAverage) ||
                                                                            "", */
                                                        studyPattern:
                                                          (tempTrainee &&
                                                            tempTrainee.studyPattern) ||
                                                          "",
                                                        /*  selectedSemester:
                                                                            (tempTrainee && tempTrainee.selectedSemester) ||
                                                                            selectedSemester ||
                                                                            null, */
                                                        RegistrationDate:
                                                          (tempTrainee &&
                                                            tempTrainee.RegistrationDate) ||
                                                          selectedRegistrationDate, //""
                                                        FacultyId:
                                                          (tempTrainee &&
                                                            tempTrainee.FacultyId) ||
                                                          selectedFacultyId,
                                                        plan_study:
                                                          (tempTrainee &&
                                                            tempTrainee.plan_study) ||
                                                          "",
                                                        CurrentAddress:
                                                          (tempTrainee &&
                                                            tempTrainee.CurrentAddress) ||
                                                          "",
                                                        CurrentAddrPhone:
                                                          (tempTrainee &&
                                                            tempTrainee.CurrentAddrPhone) ||
                                                          "",
                                                        CurrentAddrCell:
                                                          (tempTrainee &&
                                                            tempTrainee.CurrentAddrCell) ||
                                                          "",
                                                        PermanentAddress:
                                                          (tempTrainee &&
                                                            tempTrainee.PermanentAddress) ||
                                                          "",
                                                        ParentAddrPhone:
                                                          (tempTrainee &&
                                                            tempTrainee.ParentAddrPhone) ||
                                                          "",
                                                        WhatsappMobileNum:
                                                          (tempTrainee &&
                                                            tempTrainee.WhatsappMobileNum) ||
                                                          "",
                                                        Email:
                                                          (tempTrainee &&
                                                            tempTrainee.Email) ||
                                                          "",
                                                        GeneralNote:
                                                          (tempTrainee &&
                                                            tempTrainee.GeneralNote) ||
                                                          "",
                                                        academicYear:
                                                          (tempTrainee &&
                                                            tempTrainee.academicYear) ||
                                                          "",

                                                        InstituteCountryId:
                                                          (tempTrainee &&
                                                            tempTrainee.InstituteCountryId) ||
                                                          selectedInstituteCountry,
                                                        HighStudyTypeId:
                                                          (tempTrainee &&
                                                            tempTrainee.HighStudyTypeId) ||
                                                          selectedHightStudyTypeId,
                                                        EstimateId:
                                                          (tempTrainee &&
                                                            tempTrainee.EstimateId) ||
                                                          selectedEstimateId,

                                                        RegUniDate:
                                                          (tempTrainee &&
                                                            tempTrainee.RegUniDate) ||
                                                          selectedRegUniDate,
                                                        statusId:
                                                          tempTrainee &&
                                                          tempTrainee.statusId,
                                                      }) ||
                                                      (!isEdit && {
                                                        FirstName:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.FirstName) ||
                                                          "",
                                                        LastName:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.LastName) ||
                                                          "",
                                                        FatherName:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.FatherName) ||
                                                          "",
                                                        grandFatherName:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.grandFatherName) ||
                                                          "",
                                                        MotherName:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.MotherName) ||
                                                          "",
                                                        BirthLocation:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.BirthLocation) ||
                                                          "",
                                                        birthdate:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.birthdate) ||
                                                          selectedBirthDate,
                                                        NationalityId:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.NationalityId) ||
                                                          "",
                                                        diplomaId:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.diplomaId) ||
                                                          "",
                                                        Average:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.Average) ||
                                                          "",
                                                        FacultyId:
                                                          (emptyTempTrainee &&
                                                            emptyTempTrainee.FacultyId) ||
                                                          "",
                                                      })
                                                    }
                                                    validationSchema={Yup.object().shape(
                                                      {
                                                        FirstName: Yup.string()
                                                          .matches(/^[أ-ي]+$/)
                                                          .required(
                                                            "Please Enter Your First Name"
                                                          ),
                                                        LastName: Yup.string()
                                                          .matches(/^[أ-ي]+$/)
                                                          .required(
                                                            "Please Enter Your Last Name"
                                                          ),
                                                        FatherName: Yup.string()
                                                          .matches(/^[أ-ي]+$/)
                                                          .required(
                                                            "Please Enter Your Father Name"
                                                          ),
                                                        diplomaId: Yup.string()
                                                          .matches(
                                                            /^[\u0600-\u06FF\s]+$/
                                                          )
                                                          .required(
                                                            "Please Enter Your Certificate Type"
                                                          ),
                                                        ExaminationSession:
                                                          Yup.string().required(
                                                            "Examination Session Is Required"
                                                          ),
                                                        grandFatherName:
                                                          Yup.string()
                                                            .matches(/^[أ-ي]+$/)
                                                            .required(
                                                              "Please Enter Your Grandfather Name"
                                                            ),
                                                        MotherName: Yup.string()
                                                          .matches(/^[أ-ي]+$/)
                                                          .required(
                                                            "Please Enter Your Mother Name"
                                                          ),
                                                        BirthLocation:
                                                          Yup.string()
                                                            .matches(/^[أ-ي]+$/)
                                                            .required(
                                                              "Please Enter Your Birth Location"
                                                            ),
                                                        FirstNameE:
                                                          Yup.string().matches(
                                                            /^[a-zA-Z]+$/
                                                          ),
                                                        LastNameE:
                                                          Yup.string().matches(
                                                            /^[a-zA-Z]+$/
                                                          ),
                                                        FatherNameE:
                                                          Yup.string().matches(
                                                            /^[a-zA-Z]+$/
                                                          ),
                                                        grandFatherNameE:
                                                          Yup.string().matches(
                                                            /^[a-zA-Z]+$/
                                                          ),
                                                        MotherNameE:
                                                          Yup.string().matches(
                                                            /^[a-zA-Z]+$/
                                                          ),
                                                        BirthLocationE:
                                                          Yup.string().matches(
                                                            /^[a-zA-Z]+$/
                                                          ),
                                                        DiplomaNumber:
                                                          Yup.string()
                                                            .matches(/^[0-9]+$/)
                                                            .required(
                                                              "Please Enter Your Certificate Number"
                                                            ),
                                                        DiplomaCountryId:
                                                          Yup.string()
                                                            .matches(/^[أ-ي]+$/)
                                                            .required(
                                                              "Please Enter Your Certificate Country"
                                                            ),
                                                        birthdate:
                                                          Yup.date().required(
                                                            "Please Enter Your Date of Birth"
                                                          ),
                                                        FacultyId:
                                                          Yup.string().required(
                                                            "Please Enter Your Faculty"
                                                          ),

                                                        Average: Yup.string()
                                                          .matches(/^[0-9]+$/)
                                                          .required(
                                                            "Please Enter Your Average"
                                                          ),
                                                        Email:
                                                          Yup.string().email(
                                                            "Must be a valid Email"
                                                          ),
                                                      }
                                                    )}
                                                  >
                                                    {({
                                                      errors,
                                                      status,
                                                      touched,
                                                      values,
                                                      handleChange,
                                                      handleBlur,
                                                      setFieldValue,
                                                    }) => (
                                                      <div className="student-form">
                                                        <Form>
                                                          <Col lg="12">
                                                            <Card>
                                                              <CardBody>
                                                                <div className="wizard clearfix">
                                                                  <div className="steps clearfix">
                                                                    <ul className="nav-list">
                                                                      <NavItem
                                                                        key={1}
                                                                        className={`nav-item ${
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          1
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
                                                                              .activeTab ===
                                                                            1
                                                                              ? "active"
                                                                              : ""
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.toggleTab(
                                                                              1
                                                                            )
                                                                          }
                                                                        >
                                                                          <h3 className="navItem-header">
                                                                            <span className="number">
                                                                              1.
                                                                            </span>
                                                                            {this.props.t(
                                                                              "Main Info"
                                                                            )}
                                                                          </h3>
                                                                        </NavLink>
                                                                      </NavItem>
                                                                      <NavItem
                                                                        key={2}
                                                                        className={`nav-item ${
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          2
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
                                                                              .activeTab ===
                                                                            2
                                                                              ? "active"
                                                                              : ""
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.toggleTab(
                                                                              2
                                                                            )
                                                                          }
                                                                        >
                                                                          <h3 className="navItem-header">
                                                                            <span className="number">
                                                                              2.
                                                                            </span>
                                                                            {this.props.t(
                                                                              "Academic Info"
                                                                            )}
                                                                          </h3>
                                                                        </NavLink>
                                                                      </NavItem>
                                                                      <NavItem
                                                                        key={3}
                                                                        className={`nav-item ${
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          3
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
                                                                              .activeTab ===
                                                                            3
                                                                              ? "active"
                                                                              : ""
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.toggleTab(
                                                                              3
                                                                            )
                                                                          }
                                                                        >
                                                                          <h3 className="navItem-header">
                                                                            <span className="number">
                                                                              3.
                                                                            </span>
                                                                            {this.props.t(
                                                                              "Contact Info"
                                                                            )}
                                                                          </h3>
                                                                        </NavLink>
                                                                      </NavItem>
                                                                      <NavItem
                                                                        key={4}
                                                                        className={`nav-item ${
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          4
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
                                                                              .activeTab ===
                                                                            4
                                                                              ? "active"
                                                                              : ""
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.toggleTab(
                                                                              4
                                                                            )
                                                                          }
                                                                        >
                                                                          <h3 className="navItem-header">
                                                                            <span className="number">
                                                                              4.
                                                                            </span>
                                                                            {this.props.t(
                                                                              "Professional experiences"
                                                                            )}
                                                                          </h3>
                                                                        </NavLink>
                                                                      </NavItem>
                                                                      <NavItem
                                                                        key={5}
                                                                        className={`nav-item ${
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          5
                                                                            ? "current"
                                                                            : ""
                                                                        }`}
                                                                      >
                                                                        <NavLink
                                                                          className={`nav-link ${
                                                                            this
                                                                              .state
                                                                              .activeTab ===
                                                                            5
                                                                              ? "active"
                                                                              : ""
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.toggleTab(
                                                                              5
                                                                            )
                                                                          }
                                                                        >
                                                                          <h3 className="navItem-header">
                                                                            <span className="number">
                                                                              5.
                                                                            </span>
                                                                            {this.props.t(
                                                                              "Required Docs"
                                                                            )}
                                                                          </h3>
                                                                        </NavLink>
                                                                      </NavItem>
                                                                    </ul>
                                                                  </div>
                                                                  <div className="content clearfix">
                                                                    <TabContent
                                                                      activeTab={
                                                                        this
                                                                          .state
                                                                          .activeTab
                                                                      }
                                                                      className="body"
                                                                    >
                                                                      <TabPane
                                                                        key={1}
                                                                        tabId={
                                                                          1
                                                                        }
                                                                      >
                                                                        <Row>
                                                                          <Card id="tempTrainee-card">
                                                                            <CardBody className="cardBody">
                                                                              <Row>
                                                                                <div className="bordered">
                                                                                  <Row>
                                                                                    <Col lg="4">
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="arfirstName">
                                                                                              {this.props.t(
                                                                                                "First Name(ar)"
                                                                                              )}
                                                                                            </Label>
                                                                                            <span className="text-danger">
                                                                                              *
                                                                                            </span>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="FirstName"
                                                                                              id="arfirstName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.FirstName &&
                                                                                                  touched.FirstName) ||
                                                                                                firstNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            {firstNameError && (
                                                                                              <div className="invalid-feedback">
                                                                                                {this.props.t(
                                                                                                  "First Name is required"
                                                                                                )}
                                                                                              </div>
                                                                                            )}
                                                                                            <ErrorMessage
                                                                                              name="FirstName"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="arlastName">
                                                                                              {this.props.t(
                                                                                                "Last Name(ar)"
                                                                                              )}
                                                                                            </Label>
                                                                                            <span className="text-danger">
                                                                                              *
                                                                                            </span>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="LastName"
                                                                                              id="arlastName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.LastName &&
                                                                                                  touched.LastName) ||
                                                                                                lastNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            {lastNameError && (
                                                                                              <div className="invalid-feedback">
                                                                                                {this.props.t(
                                                                                                  "Last Name is required"
                                                                                                )}
                                                                                              </div>
                                                                                            )}
                                                                                            <ErrorMessage
                                                                                              name="LastName"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="arfatherName">
                                                                                              {this.props.t(
                                                                                                "Father Name(ar)"
                                                                                              )}
                                                                                            </Label>
                                                                                            <span className="text-danger">
                                                                                              *
                                                                                            </span>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="FatherName"
                                                                                              id="arfatherName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.FatherName &&
                                                                                                  touched.FatherName) ||
                                                                                                fatherNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            {fatherNameError && (
                                                                                              <div className="invalid-feedback">
                                                                                                {this.props.t(
                                                                                                  "Father Name is required"
                                                                                                )}
                                                                                              </div>
                                                                                            )}
                                                                                            <ErrorMessage
                                                                                              name="FatherName"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="argrandFatherName">
                                                                                              {this.props.t(
                                                                                                "Grandfather Name(ar)"
                                                                                              )}
                                                                                            </Label>
                                                                                            <span className="text-danger">
                                                                                              *
                                                                                            </span>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="grandFatherName"
                                                                                              id="argrandFatherName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.grandFatherName &&
                                                                                                  touched.grandFatherName) ||
                                                                                                grandFatherNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            {grandFatherNameError && (
                                                                                              <div className="invalid-feedback">
                                                                                                {this.props.t(
                                                                                                  "Father Name is required"
                                                                                                )}
                                                                                              </div>
                                                                                            )}
                                                                                            <ErrorMessage
                                                                                              name="grandFatherName"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="armotherName">
                                                                                              {this.props.t(
                                                                                                "Mother Name(ar)"
                                                                                              )}
                                                                                            </Label>
                                                                                            <span className="text-danger">
                                                                                              *
                                                                                            </span>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="MotherName"
                                                                                              id="armotherName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.MotherName &&
                                                                                                  touched.MotherName) ||
                                                                                                motherNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            {motherNameError && (
                                                                                              <div className="invalid-feedback">
                                                                                                {this.props.t(
                                                                                                  "Mother Name is required"
                                                                                                )}
                                                                                              </div>
                                                                                            )}
                                                                                            <ErrorMessage
                                                                                              name="MotherName"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="abirthLoc">
                                                                                              {this.props.t(
                                                                                                "Birth Location(ar)"
                                                                                              )}
                                                                                            </Label>
                                                                                            <span className="text-danger">
                                                                                              *
                                                                                            </span>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="BirthLocation"
                                                                                              id="abirthLoc"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.BirthLocation &&
                                                                                                  touched.BirthLocation) ||
                                                                                                birthLocError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            {birthLocError && (
                                                                                              <div className="invalid-feedback">
                                                                                                {this.props.t(
                                                                                                  "Birth Location is required"
                                                                                                )}
                                                                                              </div>
                                                                                            )}
                                                                                            <ErrorMessage
                                                                                              name="BirthLocation"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                    </Col>
                                                                                    <Col lg="4">
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="enfirstName">
                                                                                              {this.props.t(
                                                                                                "First Name(En)"
                                                                                              )}
                                                                                            </Label>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="FirstNameE"
                                                                                              id="enfirstName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.FirstNameE &&
                                                                                                  touched.FirstNameE) ||
                                                                                                lastNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            <ErrorMessage
                                                                                              name="FirstNameE"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="enlastName">
                                                                                              {this.props.t(
                                                                                                "Last Name(En)"
                                                                                              )}
                                                                                            </Label>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="LastNameE"
                                                                                              id="enlastName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.LastNameE &&
                                                                                                  touched.LastNameE) ||
                                                                                                lastNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            <ErrorMessage
                                                                                              name="LastNameE"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="enfatherName">
                                                                                              {this.props.t(
                                                                                                "Father Name(En)"
                                                                                              )}
                                                                                            </Label>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="FatherNameE"
                                                                                              id="enfatherName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.FatherNameE &&
                                                                                                  touched.FatherNameE) ||
                                                                                                lastNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            <ErrorMessage
                                                                                              name="FatherNameE"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="enGrandFatherName">
                                                                                              {this.props.t(
                                                                                                "Grandfather Name(En)"
                                                                                              )}
                                                                                            </Label>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="grandFatherNameE"
                                                                                              id="enGrandFatherName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.grandFatherNameE &&
                                                                                                  touched.grandFatherNameE) ||
                                                                                                lastNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            <ErrorMessage
                                                                                              name="grandFatherNameE"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="enmotherName">
                                                                                              {this.props.t(
                                                                                                "Mother Name(En)"
                                                                                              )}
                                                                                            </Label>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="MotherNameE"
                                                                                              id="enmotherName"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.MotherNameE &&
                                                                                                  touched.MotherNameE) ||
                                                                                                lastNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            <ErrorMessage
                                                                                              name="motherNameE"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="enbirthLoc">
                                                                                              {this.props.t(
                                                                                                "Birth Location(En)"
                                                                                              )}
                                                                                            </Label>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              type="text"
                                                                                              name="BirthLocationE"
                                                                                              id="enbirthLoc"
                                                                                              className={
                                                                                                "form-control" +
                                                                                                ((errors.BirthLocationE &&
                                                                                                  touched.BirthLocationE) ||
                                                                                                lastNameError
                                                                                                  ? " is-invalid"
                                                                                                  : "")
                                                                                              }
                                                                                            />
                                                                                            <ErrorMessage
                                                                                              name="BirthLocationE"
                                                                                              component="div"
                                                                                              className="invalid-feedback"
                                                                                            />
                                                                                          </Col>
                                                                                        </Row>
                                                                                      </div>
                                                                                    </Col>
                                                                                    <Col lg="4">
                                                                                      <div className="mb-3">
                                                                                        <Card
                                                                                          style={{
                                                                                            width:
                                                                                              "18rem",
                                                                                          }}
                                                                                        >
                                                                                          <img
                                                                                            src={
                                                                                              this
                                                                                                .state
                                                                                                .photoURL
                                                                                            }
                                                                                          />
                                                                                          <CardBody>
                                                                                            <Label
                                                                                              htmlFor="photoInput"
                                                                                              className="btn btn-primary"
                                                                                            >
                                                                                              {this.props.t(
                                                                                                "Add your photo"
                                                                                              )}

                                                                                              <Input
                                                                                                name="img"
                                                                                                type="file"
                                                                                                id="photoInput"
                                                                                                accept="image/*"
                                                                                                style={{
                                                                                                  display:
                                                                                                    "none",
                                                                                                }}
                                                                                                onChange={
                                                                                                  this
                                                                                                    .handlePhotoChange
                                                                                                }
                                                                                                className={
                                                                                                  "form-control"
                                                                                                }
                                                                                              />
                                                                                            </Label>
                                                                                          </CardBody>
                                                                                        </Card>
                                                                                      </div>
                                                                                    </Col>
                                                                                  </Row>
                                                                                </div>

                                                                                <div className="bordered">
                                                                                  <Row>
                                                                                    <Col lg="4">
                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <Label for="arbirthDate">
                                                                                              {this.props.t(
                                                                                                "Date of Birth"
                                                                                              )}
                                                                                            </Label>
                                                                                            <span className="text-danger">
                                                                                              *
                                                                                            </span>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Field
                                                                                              name="birthdate"
                                                                                              className={`form-control ${
                                                                                                birthdateError
                                                                                                  ? "is-invalid"
                                                                                                  : ""
                                                                                              }`}
                                                                                              type="date"
                                                                                              value={
                                                                                                values.birthdate
                                                                                                  ? new Date(
                                                                                                      values.birthdate
                                                                                                    )
                                                                                                      .toISOString()
                                                                                                      .split(
                                                                                                        "T"
                                                                                                      )[0]
                                                                                                  : ""
                                                                                              }
                                                                                              onChange={
                                                                                                handleChange
                                                                                              }
                                                                                              onBlur={
                                                                                                handleBlur
                                                                                              }
                                                                                              id="arbirthdate-date-input"
                                                                                            />
                                                                                          </Col>
                                                                                          {birthdateError && (
                                                                                            <div className="invalid-feedback">
                                                                                              {this.props.t(
                                                                                                "Birth Date is required"
                                                                                              )}
                                                                                            </div>
                                                                                          )}
                                                                                        </Row>
                                                                                      </div>

                                                                                      <div className="mb-3">
                                                                                        <Row>
                                                                                          <Col className="col-4">
                                                                                            <div>
                                                                                              <Label className="nationalityId">
                                                                                                {this.props.t(
                                                                                                  "Nationality"
                                                                                                )}
                                                                                              </Label>
                                                                                              <span className="text-danger">
                                                                                                *
                                                                                              </span>
                                                                                            </div>
                                                                                          </Col>
                                                                                          <Col className="col-8">
                                                                                            <Select
                                                                                              className={`form-control ${
                                                                                                nationalityError
                                                                                                  ? "is-invalid"
                                                                                                  : ""
                                                                                              }`}
                                                                                              name="NationalityId"
                                                                                              id="nationalityId"
                                                                                              key={`nationality_select`}
                                                                                              options={
                                                                                                nationalities
                                                                                              }
                                                                                              onChange={newValue =>
                                                                                                this.handleSelectChange(
                                                                                                  "NationalityId",
                                                                                                  newValue.value,
                                                                                                  values
                                                                                                )
                                                                                              }
                                                                                              defaultValue={nationalities.find(
                                                                                                opt =>
                                                                                                  opt.value ===
                                                                                                  values.NationalityId
                                                                                              )}
                                                                                            />
                                                                                          </Col>
                                                                                          {nationalityError && (
                                                                                            <div className="invalid-feedback">
                                                                                              {this.props.t(
                                                                                                "Nationality is required"
                                                                                              )}
                                                                                            </div>
                                                                                          )}
                                                                                        </Row>
                                                                                      </div>
                                                                                    </Col>
                                                                                    <Col lg="4">
                                                                                      <div className="mb-3">
                                                                                        <Row className="align-items-center">
                                                                                          <Col className="col-4">
                                                                                            <Label className="form-label mt-4">
                                                                                              {this.props.t(
                                                                                                "Gender"
                                                                                              )}
                                                                                            </Label>
                                                                                            <span className="text-danger">
                                                                                              *
                                                                                            </span>
                                                                                          </Col>
                                                                                          <Col
                                                                                            lg="3"
                                                                                            // className="mb-3"
                                                                                          >
                                                                                            <div className="d-flex gap-3">
                                                                                              {genders.map(
                                                                                                gender => (
                                                                                                  <div
                                                                                                    className="radio-button-gender d-flex align-items-center"
                                                                                                    key={
                                                                                                      gender.value
                                                                                                    }
                                                                                                  >
                                                                                                    <Input
                                                                                                      id="genderId"
                                                                                                      className={
                                                                                                        errors.GenderId &&
                                                                                                        touched.GenderId
                                                                                                          ? "is-invalid"
                                                                                                          : ""
                                                                                                      }
                                                                                                      type="radio"
                                                                                                      name="GenderId"
                                                                                                      value={
                                                                                                        gender.value
                                                                                                      }
                                                                                                      onChange={event => {
                                                                                                        this.handleGenderChange(
                                                                                                          "GenderId",
                                                                                                          event
                                                                                                            .target
                                                                                                            .value,
                                                                                                          values
                                                                                                        );
                                                                                                      }}
                                                                                                      defaultChecked={
                                                                                                        gender.value ===
                                                                                                        selectedGender
                                                                                                      }
                                                                                                    />
                                                                                                    <Label for="genderId">
                                                                                                      {this.props.t(
                                                                                                        gender.label
                                                                                                      )}
                                                                                                    </Label>
                                                                                                  </div>
                                                                                                )
                                                                                              )}
                                                                                              {genderError && (
                                                                                                <div className="invalid-feedback">
                                                                                                  {this.props.t(
                                                                                                    "Gender is required"
                                                                                                  )}
                                                                                                </div>
                                                                                              )}
                                                                                              <ErrorMessage
                                                                                                name="GenderId"
                                                                                                component="div"
                                                                                                className="invalid-feedback"
                                                                                              />
                                                                                            </div>
                                                                                          </Col>
                                                                                          <div className="mb-3">
                                                                                            <Row>
                                                                                              <Col className="col-4">
                                                                                                <Label for="socialStatus">
                                                                                                  {t(
                                                                                                    "Social Status"
                                                                                                  )}
                                                                                                </Label>
                                                                                              </Col>
                                                                                              <Col className="col-8">
                                                                                                <Select
                                                                                                  name="socialStatusId"
                                                                                                  options={
                                                                                                    socialStatus
                                                                                                  }
                                                                                                  className={`form-control`}
                                                                                                  onChange={newValue => {
                                                                                                    this.handleSelect(
                                                                                                      "socialStatusId",
                                                                                                      newValue.value,
                                                                                                      values
                                                                                                    );
                                                                                                  }}
                                                                                                  defaultValue={socialStatus.find(
                                                                                                    opt =>
                                                                                                      opt.value ===
                                                                                                      tempTrainee?.socialStatusId
                                                                                                  )}
                                                                                                />
                                                                                              </Col>
                                                                                            </Row>
                                                                                          </div>
                                                                                        </Row>
                                                                                      </div>
                                                                                    </Col>
                                                                                  </Row>
                                                                                </div>
                                                                              </Row>
                                                                            </CardBody>
                                                                          </Card>
                                                                        </Row>

                                                                        <Row>
                                                                          <Accordion defaultActiveKey="1">
                                                                            <Accordion.Item eventKey="2">
                                                                              <Accordion.Header>
                                                                                {this.props.t(
                                                                                  "Personal Informations and Passport"
                                                                                )}
                                                                              </Accordion.Header>
                                                                              <Accordion.Body>
                                                                                <Row>
                                                                                  <Col
                                                                                    className="bordered"
                                                                                    lg="4"
                                                                                  >
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label for="idNum">
                                                                                            {this.props.t(
                                                                                              "National No"
                                                                                            )}
                                                                                          </Label>
                                                                                          <span className="text-danger">
                                                                                            *
                                                                                          </span>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Field
                                                                                            type="text"
                                                                                            name="nationalNo"
                                                                                            id="idNum"
                                                                                            className={
                                                                                              "form-control" +
                                                                                              ((errors.nationalNo &&
                                                                                                touched.nationalNo) ||
                                                                                              nationalNoError
                                                                                                ? " is-invalid"
                                                                                                : "")
                                                                                            }
                                                                                          />

                                                                                          {nationalNoError && (
                                                                                            <div className="invalid-feedback">
                                                                                              {this.props.t(
                                                                                                "National Number is required"
                                                                                              )}
                                                                                            </div>
                                                                                          )}
                                                                                          <ErrorMessage
                                                                                            name="nationalNo"
                                                                                            component="div"
                                                                                            className="invalid-feedback"
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label for="cardNum">
                                                                                            {this.props.t(
                                                                                              "Identity No"
                                                                                            )}
                                                                                          </Label>
                                                                                          <span className="text-danger">
                                                                                            *
                                                                                          </span>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Field
                                                                                            type="text"
                                                                                            name="identityNo"
                                                                                            id="cardNum"
                                                                                            className={
                                                                                              "form-control" +
                                                                                              ((errors.identityNo &&
                                                                                                touched.identityNo) ||
                                                                                              identityNoError
                                                                                                ? " is-invalid"
                                                                                                : "")
                                                                                            }
                                                                                          />
                                                                                          {identityNoError && (
                                                                                            <div className="invalid-feedback">
                                                                                              {this.props.t(
                                                                                                "Identity Number is required"
                                                                                              )}
                                                                                            </div>
                                                                                          )}
                                                                                          <ErrorMessage
                                                                                            name="identityNo"
                                                                                            component="div"
                                                                                            className="invalid-feedback"
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label for="emissionDate">
                                                                                            {this.props.t(
                                                                                              "Identity Issue Date"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Field
                                                                                            name="identityIssueDate"
                                                                                            className={`form-control`}
                                                                                            type="date"
                                                                                            value={
                                                                                              values.identityIssueDate
                                                                                                ? new Date(
                                                                                                    values.identityIssueDate
                                                                                                  )
                                                                                                    .toISOString()
                                                                                                    .split(
                                                                                                      "T"
                                                                                                    )[0]
                                                                                                : ""
                                                                                            }
                                                                                            onChange={
                                                                                              handleChange
                                                                                            }
                                                                                            onBlur={
                                                                                              handleBlur
                                                                                            }
                                                                                            id="identityIssueDate-date-input"
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label for="cardCaza">
                                                                                            {this.props.t(
                                                                                              "Civic Zone"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Field
                                                                                            type="text"
                                                                                            name="civicZone"
                                                                                            id="cardCaza"
                                                                                            className={
                                                                                              "form-control"
                                                                                            }
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label for="cardCazaReg">
                                                                                            {this.props.t(
                                                                                              "Register Zone"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Field
                                                                                            type="text"
                                                                                            name="registerZone"
                                                                                            id="cardCazaReg"
                                                                                            className={
                                                                                              "form-control"
                                                                                            }
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label for="cardRegNum">
                                                                                            {this.props.t(
                                                                                              "Register No"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Field
                                                                                            type="text"
                                                                                            name="registerNo"
                                                                                            id="cardRegNum"
                                                                                            className={
                                                                                              "form-control"
                                                                                            }
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                  </Col>

                                                                                  <Col
                                                                                    className="bordered"
                                                                                    lg="4"
                                                                                  >
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label for="passNum">
                                                                                            {this.props.t(
                                                                                              "Passport Number"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Field
                                                                                            type="text"
                                                                                            name="PassNumber"
                                                                                            id="passNum"
                                                                                            className={
                                                                                              "form-control"
                                                                                            }
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label for="passGrantdate">
                                                                                            {this.props.t(
                                                                                              "Passport Issue Date"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Field
                                                                                            name="passportIssueDate"
                                                                                            className={`form-control`}
                                                                                            type="date"
                                                                                            value={
                                                                                              values.passportIssueDate
                                                                                                ? new Date(
                                                                                                    values.passportIssueDate
                                                                                                  )
                                                                                                    .toISOString()
                                                                                                    .split(
                                                                                                      "T"
                                                                                                    )[0]
                                                                                                : ""
                                                                                            }
                                                                                            onChange={
                                                                                              handleChange
                                                                                            }
                                                                                            onBlur={
                                                                                              handleBlur
                                                                                            }
                                                                                            id="passportIssueDate-date-input"
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label for="passExpDate">
                                                                                            {this.props.t(
                                                                                              "Passport Expiry Date"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Field
                                                                                            name="passportExpiryDate"
                                                                                            className={`form-control`}
                                                                                            type="date"
                                                                                            value={
                                                                                              values.passportExpiryDate
                                                                                                ? new Date(
                                                                                                    values.passportExpiryDate
                                                                                                  )
                                                                                                    .toISOString()
                                                                                                    .split(
                                                                                                      "T"
                                                                                                    )[0]
                                                                                                : ""
                                                                                            }
                                                                                            onChange={
                                                                                              handleChange
                                                                                            }
                                                                                            onBlur={
                                                                                              handleBlur
                                                                                            }
                                                                                            id="passportExpiryDate-date-input"
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                  </Col>
                                                                                </Row>
                                                                              </Accordion.Body>
                                                                            </Accordion.Item>
                                                                          </Accordion>
                                                                        </Row>
                                                                      </TabPane>
                                                                      <TabPane
                                                                        key={2}
                                                                        tabId={
                                                                          2
                                                                        }
                                                                      >
                                                                        <Row className="bordered">
                                                                          <Col lg="4">
                                                                            <div className="mb-3">
                                                                              <Row>
                                                                                <Col className="col-4">
                                                                                  <Label for="reg-date">
                                                                                    {this.props.t(
                                                                                      "Registration Date"
                                                                                    )}
                                                                                  </Label>
                                                                                </Col>
                                                                                {isEdit && (
                                                                                  <Col className="col-8">
                                                                                    <Input
                                                                                      type="text"
                                                                                      name="RegistrationDate"
                                                                                      id="reg-date"
                                                                                      className={
                                                                                        "form-control"
                                                                                      }
                                                                                      value={
                                                                                        formattedRegistrationDate
                                                                                      }
                                                                                      readOnly
                                                                                    />
                                                                                  </Col>
                                                                                )}
                                                                                {!isEdit && (
                                                                                  <Col className="col-8">
                                                                                    <Input
                                                                                      type="text"
                                                                                      name="RegistrationDate"
                                                                                      id="reg-date"
                                                                                      className={
                                                                                        "form-control"
                                                                                      }
                                                                                      defaultValue={
                                                                                        selectedRegistrationDate
                                                                                      }
                                                                                      readOnly
                                                                                    />
                                                                                  </Col>
                                                                                )}
                                                                              </Row>
                                                                            </div>
                                                                          </Col>
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <div className="mb-2">
                                                                                <Row>
                                                                                  <Col className="col-4">
                                                                                    <Label for="regDiploma">
                                                                                      {this.props.t(
                                                                                        "Registered under"
                                                                                      )}
                                                                                    </Label>
                                                                                  </Col>
                                                                                  <Col className="col-8">
                                                                                    <div
                                                                                      name="registrationCertLevelId"
                                                                                      id="regDiploma"
                                                                                      role="group"
                                                                                      className={
                                                                                        "btn-group btn-group-example mb-3" +
                                                                                        (errors.registrationCertLevelId &&
                                                                                        touched.registrationCertLevelId
                                                                                          ? " is-invalid"
                                                                                          : "")
                                                                                      }
                                                                                    >
                                                                                      {regcertificates
                                                                                        .slice()
                                                                                        .sort(
                                                                                          (
                                                                                            a,
                                                                                            b
                                                                                          ) =>
                                                                                            b.Id -
                                                                                            a.Id
                                                                                        )
                                                                                        .map(
                                                                                          level => (
                                                                                            <button
                                                                                              key={
                                                                                                level.Id
                                                                                              }
                                                                                              type="button"
                                                                                              name="registrationCertLevelId"
                                                                                              value={
                                                                                                selectedRegistrationCertLevelId ==
                                                                                                level.arTitle //arcertificatelevel
                                                                                                  ? "active"
                                                                                                  : ""
                                                                                              }
                                                                                              className={`btn btn-outline-primary w-sm ${
                                                                                                selectedRegistrationCertLevelId ===
                                                                                                level.Id
                                                                                                  ? "active"
                                                                                                  : ""
                                                                                              }`}
                                                                                              onClick={() =>
                                                                                                this.handleButtonClick2(
                                                                                                  "registrationCertLevelId",
                                                                                                  level.Id,
                                                                                                  values
                                                                                                )
                                                                                              }
                                                                                            >
                                                                                              {languageState ===
                                                                                              "ar"
                                                                                                ? level.arTitle
                                                                                                : level.enTitle}
                                                                                            </button>
                                                                                          )
                                                                                        )}
                                                                                    </div>
                                                                                  </Col>
                                                                                </Row>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>

                                                                          <Row>
                                                                            {isShowUlterStudy && (
                                                                              <FormGroup>
                                                                                <Row>
                                                                                  <Col lg="4">
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label
                                                                                            for="HighStudyType_select"
                                                                                            className="form-label"
                                                                                          >
                                                                                            {this.props.t(
                                                                                              "Certificate Type"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Select
                                                                                            className={`select-style-std ${
                                                                                              facultyError
                                                                                                ? "is-invalid"
                                                                                                : ""
                                                                                            }`}
                                                                                            name="HighStudyTypeId"
                                                                                            key={`HighStudyType_select`}
                                                                                            options={
                                                                                              highstudytypes
                                                                                            }
                                                                                            onChange={hight => {
                                                                                              setFieldValue(
                                                                                                "HighStudyTypeId",
                                                                                                hight.value
                                                                                              );
                                                                                            }}
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                  </Col>
                                                                                </Row>
                                                                              </FormGroup>
                                                                            )}
                                                                          </Row>

                                                                          <Row>
                                                                            <Col lg="4">
                                                                              {(showNewInput ||
                                                                                isShowUlterStudy) && (
                                                                                <FormGroup>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="uniName"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "University Name"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="uniName"
                                                                                          id="uniName"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="UnivCountryId-Id"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "University Country"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="UnivCountryId"
                                                                                          className={`form-control }`}
                                                                                          list="univCountryDatalistOptions"
                                                                                          value={
                                                                                            values.UnivCountryId
                                                                                          }
                                                                                          onChange={event => {
                                                                                            setFieldValue(
                                                                                              "UnivCountryId",
                                                                                              event
                                                                                                .target
                                                                                                .value
                                                                                            );
                                                                                          }}
                                                                                          onBlur={
                                                                                            handleBlur
                                                                                          }
                                                                                          id="UnivCountryId-Id"
                                                                                        />

                                                                                        <datalist id="univCountryDatalistOptions">
                                                                                          {countries.map(
                                                                                            country => (
                                                                                              <option
                                                                                                key={
                                                                                                  country.key
                                                                                                }
                                                                                                value={
                                                                                                  country.value
                                                                                                }
                                                                                              />
                                                                                            )
                                                                                          )}
                                                                                        </datalist>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </FormGroup>
                                                                              )}
                                                                            </Col>
                                                                            <Col lg="4">
                                                                              {(showNewInput ||
                                                                                isShowUlterStudy) && (
                                                                                <FormGroup>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="regUniAvg"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "University Average"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="uniAverage"
                                                                                          id="regUniAvg"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="registration-Diploma-Date"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Diploma Date"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          name="RegUniDate"
                                                                                          className={`form-control`}
                                                                                          type="date"
                                                                                          value={
                                                                                            values.RegUniDate
                                                                                              ? new Date(
                                                                                                  values.RegUniDate
                                                                                                )
                                                                                                  .toISOString()
                                                                                                  .split(
                                                                                                    "T"
                                                                                                  )[0]
                                                                                              : ""
                                                                                          }
                                                                                          onChange={
                                                                                            handleChange
                                                                                          }
                                                                                          onBlur={
                                                                                            handleBlur
                                                                                          }
                                                                                          id="registrationDiploma-date-input"
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </FormGroup>
                                                                              )}
                                                                            </Col>
                                                                            <Col lg="4">
                                                                              {(showNewInput ||
                                                                                isShowUlterStudy) && (
                                                                                <FormGroup>
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="Estimate-id"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Estimate"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="">
                                                                                        <Select
                                                                                          className={`select-style-std ${
                                                                                            gradeError
                                                                                              ? "is-invalid"
                                                                                              : ""
                                                                                          }`}
                                                                                          name="EstimateId"
                                                                                          key={`grade_select`}
                                                                                          options={
                                                                                            estimates
                                                                                          }
                                                                                          onChange={estimate => {
                                                                                            setFieldValue(
                                                                                              "EstimateId",
                                                                                              estimate.value
                                                                                            );
                                                                                          }}
                                                                                        />
                                                                                      </Col>
                                                                                      {gradeError && (
                                                                                        <div className="invalid-feedback">
                                                                                          {this.props.t(
                                                                                            "Estimate is required"
                                                                                          )}
                                                                                        </div>
                                                                                      )}
                                                                                    </Row>
                                                                                  </div>
                                                                                </FormGroup>
                                                                              )}
                                                                            </Col>
                                                                            {(showNewInput ||
                                                                              isShowUlterStudy) && (
                                                                              <FormGroup>
                                                                                <Row>
                                                                                  <Col lg="4">
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label
                                                                                            for="faculty-id"
                                                                                            className="form-label"
                                                                                          >
                                                                                            {this.props.t(
                                                                                              "Faculty"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Select
                                                                                            className={`select-style-std ${
                                                                                              facultyError
                                                                                                ? "is-invalid"
                                                                                                : ""
                                                                                            }`}
                                                                                            name="FacultyId"
                                                                                            key={`faculty_select`}
                                                                                            options={
                                                                                              faculties
                                                                                            }
                                                                                            onChange={faculty => {
                                                                                              setFieldValue(
                                                                                                "FacultyId",
                                                                                                faculty.value
                                                                                              );
                                                                                            }}
                                                                                            defaultValue={faculties.find(
                                                                                              opt =>
                                                                                                opt.label ===
                                                                                                facultyName
                                                                                            )}
                                                                                          />
                                                                                        </Col>
                                                                                        {facultyError && (
                                                                                          <div className="invalid-feedback">
                                                                                            {this.props.t(
                                                                                              "Faculty is required"
                                                                                            )}
                                                                                          </div>
                                                                                        )}
                                                                                      </Row>
                                                                                    </div>
                                                                                  </Col>

                                                                                  <Col lg="4">
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label
                                                                                            for="study-plan"
                                                                                            className="form-label"
                                                                                          >
                                                                                            {this.props.t(
                                                                                              "Specialty"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Input
                                                                                            type="text"
                                                                                            name="plan_study"
                                                                                            id="study-plan"
                                                                                            className="form-control"
                                                                                            value={
                                                                                              values.plan_study
                                                                                            }
                                                                                            onChange={e =>
                                                                                              setFieldValue(
                                                                                                "plan_study",
                                                                                                e
                                                                                                  .target
                                                                                                  .value
                                                                                              )
                                                                                            }
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                  </Col>
                                                                                </Row>
                                                                              </FormGroup>
                                                                            )}

                                                                            {/* for a  not Instituteinfooooooooooooooo */}

                                                                            <Col lg="4">
                                                                              {isShowInstituteinfo && (
                                                                                <FormGroup>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="diplomaName"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Diploma Name"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="diplomaName"
                                                                                          id="diplomaName"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="reg-diploma-dep"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Diploma Department"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="registrationDiplomaDepartment"
                                                                                          id="reg-diploma-dep"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </FormGroup>
                                                                              )}
                                                                            </Col>
                                                                            <Col lg="4">
                                                                              {isShowInstituteinfo && (
                                                                                <FormGroup>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="InstituteCountryId-Id"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Institute Country"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="InstituteCountryId"
                                                                                          className={`form-control }`}
                                                                                          list="InstituteCountryIdDatalistOptions"
                                                                                          value={
                                                                                            values.InstituteCountryId
                                                                                          }
                                                                                          onChange={event => {
                                                                                            const selectedInstituteCountry =
                                                                                              event
                                                                                                .target
                                                                                                .value;
                                                                                            setFieldValue(
                                                                                              "InstituteCountryId",
                                                                                              selectedInstituteCountry
                                                                                            );
                                                                                          }}
                                                                                          onBlur={
                                                                                            handleBlur
                                                                                          }
                                                                                          id="InstituteCountryId-Id"
                                                                                        />

                                                                                        <datalist id="InstituteCountryIdDatalistOptions">
                                                                                          {countries.map(
                                                                                            country => (
                                                                                              <option
                                                                                                key={
                                                                                                  country.key
                                                                                                }
                                                                                                value={
                                                                                                  country.value
                                                                                                }
                                                                                              />
                                                                                            )
                                                                                          )}
                                                                                        </datalist>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>

                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="registration-Diploma-Date"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Reg Diploma Date"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          name="registrationDiplomaDate"
                                                                                          className={`form-control`}
                                                                                          type="date"
                                                                                          value={
                                                                                            values.registrationDiplomaDate
                                                                                              ? new Date(
                                                                                                  values.registrationDiplomaDate
                                                                                                )
                                                                                                  .toISOString()
                                                                                                  .split(
                                                                                                    "T"
                                                                                                  )[0]
                                                                                              : ""
                                                                                          }
                                                                                          onChange={
                                                                                            handleChange
                                                                                          }
                                                                                          onBlur={
                                                                                            handleBlur
                                                                                          }
                                                                                          id="registrationDiploma-date-input"
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </FormGroup>
                                                                              )}
                                                                            </Col>
                                                                            <Col lg="4">
                                                                              {isShowInstituteinfo && (
                                                                                <FormGroup>
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="grade-id"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Estimate"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col>
                                                                                        <Select
                                                                                          className={`select-style-std ${
                                                                                            gradeError
                                                                                              ? "is-invalid"
                                                                                              : ""
                                                                                          }`}
                                                                                          name="EstimateId"
                                                                                          key={`grade_select`}
                                                                                          options={
                                                                                            estimates
                                                                                          }
                                                                                          onChange={estimate => {
                                                                                            setFieldValue(
                                                                                              "EstimateId",
                                                                                              estimate.value
                                                                                            );
                                                                                          }}
                                                                                        />
                                                                                      </Col>
                                                                                      {gradeError && (
                                                                                        <div className="invalid-feedback">
                                                                                          {this.props.t(
                                                                                            "EstimateId is required"
                                                                                          )}
                                                                                        </div>
                                                                                      )}
                                                                                    </Row>
                                                                                  </div>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="regDiplomaAverage"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Diploma Average"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="registrationDiplomaAverage"
                                                                                          id="regDiplomaAverage"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </FormGroup>
                                                                              )}
                                                                            </Col>
                                                                          </Row>

                                                                          <Row>
                                                                            <Col lg="4">
                                                                              {showUniForm && (
                                                                                <FormGroup>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="uniName"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "University Name"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="uniName"
                                                                                          id="uniName"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="UnivCountryId-Id"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "University Country"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="UnivCountryId"
                                                                                          className={`form-control }`}
                                                                                          list="univCountryDatalistOptions"
                                                                                          value={
                                                                                            values.UnivCountryId
                                                                                          }
                                                                                          onChange={event => {
                                                                                            setFieldValue(
                                                                                              "UnivCountryId",
                                                                                              event
                                                                                                .target
                                                                                                .value
                                                                                            );
                                                                                          }}
                                                                                          onBlur={
                                                                                            handleBlur
                                                                                          }
                                                                                          id="UnivCountryId-Id"
                                                                                        />

                                                                                        <datalist id="univCountryDatalistOptions">
                                                                                          {countries.map(
                                                                                            country => (
                                                                                              <option
                                                                                                key={
                                                                                                  country.key
                                                                                                }
                                                                                                value={
                                                                                                  country.value
                                                                                                }
                                                                                              />
                                                                                            )
                                                                                          )}
                                                                                        </datalist>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </FormGroup>
                                                                              )}
                                                                            </Col>
                                                                            <Col lg="4">
                                                                              {showUniForm && (
                                                                                <FormGroup>
                                                                                  <div className="mb-2">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="academicYear"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Academic Year"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="academicYear"
                                                                                          id="academicYear"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                          value={
                                                                                            values.academicYear
                                                                                          }
                                                                                          onChange={event => {
                                                                                            setFieldValue(
                                                                                              "academicYear",
                                                                                              event
                                                                                                .target
                                                                                                .value
                                                                                            );
                                                                                          }}
                                                                                          onBlur={
                                                                                            handleBlur
                                                                                          }
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </FormGroup>
                                                                              )}
                                                                            </Col>
                                                                          </Row>
                                                                          <Row>
                                                                            {showUniForm && (
                                                                              <FormGroup>
                                                                                <Row>
                                                                                  <Col lg="4">
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label
                                                                                            for="faculty-id"
                                                                                            className="form-label"
                                                                                          >
                                                                                            {this.props.t(
                                                                                              "Faculty"
                                                                                            )}
                                                                                          </Label>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Select
                                                                                            className={`select-style-std ${
                                                                                              facultyError
                                                                                                ? "is-invalid"
                                                                                                : ""
                                                                                            }`}
                                                                                            name="FacultyId"
                                                                                            key={`faculty_select`}
                                                                                            options={
                                                                                              faculties
                                                                                            }
                                                                                            onChange={faculty => {
                                                                                              setFieldValue(
                                                                                                "FacultyId",
                                                                                                faculty.value
                                                                                              );
                                                                                            }}
                                                                                          />
                                                                                        </Col>
                                                                                        {facultyError && (
                                                                                          <div className="invalid-feedback">
                                                                                            {this.props.t(
                                                                                              "Faculty is required"
                                                                                            )}
                                                                                          </div>
                                                                                        )}
                                                                                      </Row>
                                                                                    </div>
                                                                                  </Col>

                                                                                  <Col lg="4">
                                                                                    <div className="mb-3">
                                                                                      <Row>
                                                                                        <Col className="col-4">
                                                                                          <Label
                                                                                            for="study-plan"
                                                                                            className="form-label"
                                                                                          >
                                                                                            {this.props.t(
                                                                                              "Specialty"
                                                                                            )}
                                                                                          </Label>
                                                                                          <span className="text-danger">
                                                                                            *
                                                                                          </span>
                                                                                        </Col>
                                                                                        <Col className="col-8">
                                                                                          <Input
                                                                                            type="text"
                                                                                            name="plan_study"
                                                                                            id="study-plan"
                                                                                            className={
                                                                                              "form-control" +
                                                                                              ((errors.plan_study &&
                                                                                                touched.plan_study) ||
                                                                                              plan_studyError
                                                                                                ? " is-invalid"
                                                                                                : "")
                                                                                            }
                                                                                            value={
                                                                                              values.plan_study
                                                                                            }
                                                                                            onChange={e =>
                                                                                              setFieldValue(
                                                                                                "plan_study",
                                                                                                e
                                                                                                  .target
                                                                                                  .value
                                                                                              )
                                                                                            }
                                                                                          />
                                                                                          {plan_studyError && (
                                                                                            <div className="invalid-feedback">
                                                                                              {this.props.t(
                                                                                                "Specialty is required"
                                                                                              )}
                                                                                            </div>
                                                                                          )}
                                                                                          <ErrorMessage
                                                                                            name="plan_study"
                                                                                            component="div"
                                                                                            className="invalid-feedback"
                                                                                          />
                                                                                        </Col>
                                                                                      </Row>
                                                                                    </div>
                                                                                  </Col>
                                                                                </Row>
                                                                              </FormGroup>
                                                                            )}
                                                                          </Row>

                                                                          <Card>
                                                                            {!isHightSchooll && (
                                                                              <CardTitle id="card_header">
                                                                                {this.props.t(
                                                                                  "Hight School Diploma Info "
                                                                                )}
                                                                              </CardTitle>
                                                                            )}

                                                                            <CardBody>
                                                                              <Row>
                                                                                <Col lg="4">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label for="diploma-id">
                                                                                          {this.props.t(
                                                                                            "Diploma Type"
                                                                                          )}
                                                                                        </Label>
                                                                                        <span className="text-danger">
                                                                                          *
                                                                                        </span>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="diplomaId"
                                                                                          id="diploma-Id"
                                                                                          list="certificateDatalistOptions"
                                                                                          placeholder="Type to search..."
                                                                                          onBlur={() =>
                                                                                            this.handleInputBlur(
                                                                                              "diplomaId"
                                                                                            )
                                                                                          }
                                                                                          onFocus={() =>
                                                                                            this.handleInputFocus(
                                                                                              "diplomaId"
                                                                                            )
                                                                                          }
                                                                                          onChange={event =>
                                                                                            this.handleDiplomaSelect(
                                                                                              event,
                                                                                              "diplomaId",
                                                                                              setFieldValue,
                                                                                              values
                                                                                            )
                                                                                          }
                                                                                          value={
                                                                                            (
                                                                                              diplomalevels.find(
                                                                                                certificate =>
                                                                                                  certificate.key ===
                                                                                                  selectedDiploma
                                                                                              ) ||
                                                                                              ""
                                                                                            )
                                                                                              .value
                                                                                          }
                                                                                          className={
                                                                                            "form-control" +
                                                                                            ((errors.diplomaId &&
                                                                                              touched.diplomaId) ||
                                                                                            diplomaIdError
                                                                                              ? " is-invalid"
                                                                                              : "")
                                                                                          }
                                                                                        />
                                                                                        <datalist id="certificateDatalistOptions">
                                                                                          {diplomalevels.map(
                                                                                            certificate => (
                                                                                              <option
                                                                                                key={
                                                                                                  certificate.key
                                                                                                }
                                                                                                value={
                                                                                                  certificate.value
                                                                                                }
                                                                                              />
                                                                                            )
                                                                                          )}
                                                                                        </datalist>
                                                                                        {diplomaIdError && (
                                                                                          <div className="invalid-feedback">
                                                                                            {this.props.t(
                                                                                              "Certificate is required"
                                                                                            )}
                                                                                          </div>
                                                                                        )}
                                                                                        <ErrorMessage
                                                                                          name="diplomaId"
                                                                                          component="div"
                                                                                          className="invalid-feedback"
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                              </Row>
                                                                              <Row>
                                                                                <Col lg="4">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label for="diplomaCountry">
                                                                                          {this.props.t(
                                                                                            "Diploma Country"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="DiplomaCountryId"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                          list="CountrydatalistOptions"
                                                                                          value={
                                                                                            values.DiplomaCountryId
                                                                                          }
                                                                                          onChange={event => {
                                                                                            const selectedCountry =
                                                                                              event
                                                                                                .target
                                                                                                .value;
                                                                                            setFieldValue(
                                                                                              "DiplomaCountryId",
                                                                                              selectedCountry
                                                                                            );
                                                                                          }}
                                                                                          onBlur={
                                                                                            handleBlur
                                                                                          }
                                                                                          id="diploma-Id"
                                                                                        />

                                                                                        <datalist id="CountrydatalistOptions">
                                                                                          {countries.map(
                                                                                            country => (
                                                                                              <option
                                                                                                key={
                                                                                                  country.key
                                                                                                }
                                                                                                value={
                                                                                                  country.value
                                                                                                }
                                                                                              />
                                                                                            )
                                                                                          )}
                                                                                        </datalist>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                                <Col lg="4">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label for="diplomaGovernorate">
                                                                                          {this.props.t(
                                                                                            "Governorate"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="DiplomaGovernorateId"
                                                                                          className={`form-control }`}
                                                                                          list="GovernoratedatalistOptions"
                                                                                          value={
                                                                                            values.DiplomaGovernorateId
                                                                                          }
                                                                                          onChange={event => {
                                                                                            setFieldValue(
                                                                                              "DiplomaGovernorateId",
                                                                                              event
                                                                                                .target
                                                                                                .value
                                                                                            );
                                                                                          }}
                                                                                          onBlur={
                                                                                            handleBlur
                                                                                          }
                                                                                          id="diplomaGovernorate-Id"
                                                                                        />

                                                                                        <datalist id="GovernoratedatalistOptions">
                                                                                          {governorates.map(
                                                                                            governorate => (
                                                                                              <option
                                                                                                key={
                                                                                                  governorate.key
                                                                                                }
                                                                                                value={
                                                                                                  governorate.value
                                                                                                }
                                                                                              />
                                                                                            )
                                                                                          )}
                                                                                        </datalist>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                              </Row>
                                                                              <Row>
                                                                                <Col lg="4">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label for="diploma-year">
                                                                                          {this.props.t(
                                                                                            "High School Year"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="DiplomaYear"
                                                                                          id="diploma-year"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                        />
                                                                                        <span className="font-13 text-muted">
                                                                                          yyyy
                                                                                        </span>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                                <Col lg="4">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label for="exam-session">
                                                                                          {this.props.t(
                                                                                            "Examination Session"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <div
                                                                                          name="ExaminationSession"
                                                                                          id="exam-session"
                                                                                          role="group"
                                                                                          className={
                                                                                            "btn-group btn-group-example mb-3 bg-transparent form-control"
                                                                                          }
                                                                                        >
                                                                                          <button
                                                                                            id="firstSession"
                                                                                            type="button"
                                                                                            name="ExaminationSession"
                                                                                            value={
                                                                                              selectedExaminationSession ==
                                                                                              "firstSession"
                                                                                                ? "active"
                                                                                                : ""
                                                                                            }
                                                                                            className={`btn btn-outline-primary w-sm ${
                                                                                              selectedExaminationSession ===
                                                                                              "firstSession"
                                                                                                ? "active"
                                                                                                : ""
                                                                                            }`}
                                                                                            onClick={() =>
                                                                                              this.handleButtonClick(
                                                                                                "ExaminationSession",
                                                                                                "firstSession"
                                                                                              )
                                                                                            }
                                                                                          >
                                                                                            {this.props.t(
                                                                                              "First Session"
                                                                                            )}
                                                                                          </button>

                                                                                          <button
                                                                                            id="secondSession"
                                                                                            type="button"
                                                                                            name="ExaminationSession"
                                                                                            value={
                                                                                              selectedExaminationSession ===
                                                                                              "secondSession"
                                                                                                ? "active"
                                                                                                : ""
                                                                                            }
                                                                                            className={`btn btn-outline-primary w-sm ${
                                                                                              selectedExaminationSession ===
                                                                                              "secondSession"
                                                                                                ? "active"
                                                                                                : ""
                                                                                            }`}
                                                                                            onClick={() =>
                                                                                              this.handleButtonClick(
                                                                                                "ExaminationSession",
                                                                                                "secondSession"
                                                                                              )
                                                                                            }
                                                                                          >
                                                                                            {this.props.t(
                                                                                              "Second Session"
                                                                                            )}
                                                                                          </button>
                                                                                        </div>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                                <Col lg="4">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label for="diploma-num">
                                                                                          {this.props.t(
                                                                                            "Diploma Number"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="text"
                                                                                          name="DiplomaNumber"
                                                                                          id="diploma-num"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                              </Row>
                                                                              <Row>
                                                                                <Col lg="4">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label for="avg">
                                                                                          {this.props.t(
                                                                                            "Average"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <InputGroup>
                                                                                          <Field
                                                                                            type="text"
                                                                                            name="Average"
                                                                                            id="avg"
                                                                                            className="form-control"
                                                                                          />
                                                                                          <div className="input-group-text">
                                                                                            %
                                                                                          </div>

                                                                                          <ErrorMessage
                                                                                            name="Average"
                                                                                            component="div"
                                                                                            className="invalid-feedback"
                                                                                          />
                                                                                        </InputGroup>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                              </Row>

                                                                              <Row>
                                                                                {/*   <Col lg="4">
                                                                                                                                            <div className="mb-3">
                                                                                                                                              <Row>
                                                                                                                                                <Col className="col-4">
                                                                                                                                                  <Label for="diploma-verficationNum">
                                                                                                                                                    {this.props.t(
                                                                                                                                                      "Verification Number"
                                                                                                                                                    )}
                                                                                                                                                  </Label>
                                                                                                                                                </Col>
                                                                                                                                                <Col className="col-8">
                                                                                                                                                  <Field
                                                                                                                                                    type="text"
                                                                                                                                                    name="diplomaVerificationNum"
                                                                                                                                                    id="diploma-verficationNum"
                                                                                                                                                    className={
                                                                                                                                                      "form-control"
                                                                                                                                                    }
                                                                                                                                                  />
                                                                                                                                                </Col>
                                                                                                                                              </Row>
                                                                                                                                            </div>
                                                                                                                                          </Col>
                                                                                                                                          <Col lg="4">
                                                                                                                                            <div className="mb-3">
                                                                                                                                              <Row>
                                                                                                                                                <Col className="col-4">
                                                                                                                                                  <Label for="diploma-verficationDate">
                                                                                                                                                    {this.props.t(
                                                                                                                                                      "Verification Date"
                                                                                                                                                    )}
                                                                                                                                                  </Label>
                                                                                                                                                </Col>
                                                                                                                                                <Col className="col-8">
                                                                                                                                                  <Field
                                                                                                                                                    name="diplomaVerificationDate"
                                                                                                                                                    className={`form-control`}
                                                                                                                                                    type="date"
                                                                                                                                                    value={
                                                                                                                                                      values.diplomaVerificationDate
                                                                                                                                                        ? new Date(
                                                                                                                                                            values.diplomaVerificationDate
                                                                                                                                                          )
                                                                                                                                                            .toISOString()
                                                                                                                                                            .split(
                                                                                                                                                              "T"
                                                                                                                                                            )[0]
                                                                                                                                                        : ""
                                                                                                                                                    }
                                                                                                                                                    onChange={
                                                                                                                                                      handleChange
                                                                                                                                                    }
                                                                                                                                                    onBlur={
                                                                                                                                                      handleBlur
                                                                                                                                                    }
                                                                                                                                                    id="diplomaVerificationDate-date-input"
                                                                                                                                                  />
                                                                                                                                                </Col>
                                                                                                                                              </Row>
                                                                                                                                            </div>
                                                                                                                                          </Col> */}
                                                                              </Row>
                                                                              <Row>
                                                                                {/*     <Col lg="4">
                                                                                                                                            <div className="mb-3">
                                                                                                                                              <Row>
                                                                                                                                                <Col className="col-4">
                                                                                                                                                  <Label for="study-pattern">
                                                                                                                                                    {this.props.t(
                                                                                                                                                      "Study Pattern"
                                                                                                                                                    )}
                                                                                                                                                  </Label>
                                                                                                                                                </Col>
                                                                                                                                                <Col className="col-8">
                                                                                                                                                  <div
                                                                                                                                                    name="studyPattern"
                                                                                                                                                    id="study-pattern"
                                                                                                                                                    role="group"
                                                                                                                                                    className={
                                                                                                                                                      "btn-group btn-group-example mb-3" +
                                                                                                                                                      (errors.studyPattern &&
                                                                                                                                                      touched.studyPattern
                                                                                                                                                        ? " is-invalid"
                                                                                                                                                        : "")
                                                                                                                                                    }
                                                                                                                                                  >
                                                                                                                                                    <button
                                                                                                                                                      id="creditHours"
                                                                                                                                                      type="button"
                                                                                                                                                      name="studyPattern"
                                                                                                                                                      value={
                                                                                                                                                        selectedStudyPattern ==
                                                                                                                                                        "creditHours"
                                                                                                                                                          ? "active"
                                                                                                                                                          : ""
                                                                                                                                                      }
                                                                                                                                                      className={`btn btn-outline-primary w-sm ${
                                                                                                                                                        selectedStudyPattern ===
                                                                                                                                                        "creditHours"
                                                                                                                                                          ? "active"
                                                                                                                                                          : ""
                                                                                                                                                      }`}
                                                                                                                                                      onClick={() =>
                                                                                                                                                        this.handleButtonClick(
                                                                                                                                                          "studyPattern",
                                                                                                                                                          "creditHours"
                                                                                                                                                        )
                                                                                                                                                      }
                                                                                                                                                    >
                                                                                                                                                      {this.props.t(
                                                                                                                                                        "Credit Hours"
                                                                                                                                                      )}
                                                                                                                                                    </button>
                                                                                                                                                    <button
                                                                                                                                                      id="semester"
                                                                                                                                                      type="button"
                                                                                                                                                      name="studyPattern"
                                                                                                                                                      value={
                                                                                                                                                        selectedStudyPattern ==
                                                                                                                                                        "semester"
                                                                                                                                                          ? "active"
                                                                                                                                                          : ""
                                                                                                                                                      }
                                                                                                                                                      className={`btn btn-outline-primary w-sm ${
                                                                                                                                                        selectedStudyPattern ===
                                                                                                                                                        "semester"
                                                                                                                                                          ? "active"
                                                                                                                                                          : ""
                                                                                                                                                      }`}
                                                                                                                                                      onClick={() =>
                                                                                                                                                        this.handleButtonClick(
                                                                                                                                                          "studyPattern",
                                                                                                                                                          "semester"
                                                                                                                                                        )
                                                                                                                                                      }
                                                                                                                                                    >
                                                                                                                                                      {this.props.t(
                                                                                                                                                        "Semester"
                                                                                                                                                      )}
                                                                                                                                                    </button>
                                                                                                                                                  </div>
                                                                                                                                                </Col>
                                                                                                                                              </Row>
                                                                                                                                            </div>
                                                                                                                                          </Col> */}
                                                                              </Row>

                                                                              <Row>
                                                                                <Col lg="4">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label
                                                                                          for="hasBrother"
                                                                                          className="form-label"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Has Sibling / Relative"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <div className="form-check mb-2">
                                                                                          <input
                                                                                            type="checkbox"
                                                                                            name="HasBrother"
                                                                                            className={`form-check-input input-mini`}
                                                                                            onChange={
                                                                                              this
                                                                                                .handleHasBrotherChange
                                                                                            }
                                                                                            defaultChecked={
                                                                                              HasBrotherCheck
                                                                                            }
                                                                                          />
                                                                                        </div>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                                <Col lg="4">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col lg="4">
                                                                                        <Label
                                                                                          for="tempTraineeStatus-Id"
                                                                                          className="form-label d-flex"
                                                                                        >
                                                                                          {this.props.t(
                                                                                            "Trainee Status"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Select
                                                                                          id="tempTraineeStatus-Id"
                                                                                          name="statusId"
                                                                                          options={
                                                                                            tempTraineeStatus
                                                                                          }
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                          onChange={newValue =>
                                                                                            this.handleSelect(
                                                                                              "statusId",
                                                                                              newValue.value,
                                                                                              values
                                                                                            )
                                                                                          }
                                                                                          defaultValue={tempTraineeStatus.find(
                                                                                            opt =>
                                                                                              opt.value ===
                                                                                              tempTrainee?.statusId
                                                                                          )}
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                              </Row>
                                                                              {/* <Row>
                                                                                                              {showSiblingsSelect && (
                                                                                                                <Col lg="4">
                                                                                                                  <div className="mb-3">
                                                                                                                    <Row>
                                                                                                                      <Col className="col-4"></Col>
                                                                                                                      <Col className="col-8">
                                                                                                                        <Select
                                                                                                                          value={
                                                                                                                            siblingsArray
                                                                                                                          }
                                                                                                                          name="tempSiblings"
                                                                                                                          isMulti={
                                                                                                                            true
                                                                                                                          }
                                                                                                                          onChange={selectedOption =>
                                                                                                                            this.handleMulti(
                                                                                                                              "tempSiblings",
                                                                                                                              selectedOption
                                                                                                                            )
                                                                                                                          }
                                                                                                                          options={
                                                                                                                            universityTrainees
                                                                                                                          }
                                                                                                                          classNamePrefix="select2-selection"
                                                                                                                        />
                                                                                                                      </Col>
                                                                                                                    </Row>
                                                                                                                  </div>
                                                                                                                </Col>
                                                                                                              )}
                                                                                                            </Row> */}
                                                                            </CardBody>
                                                                          </Card>
                                                                        </Row>
                                                                      </TabPane>
                                                                      <TabPane
                                                                        key={3}
                                                                        tabId={
                                                                          3
                                                                        }
                                                                      >
                                                                        <Row className="bordered">
                                                                          <Row>
                                                                            <Col
                                                                              className="bordered"
                                                                              lg="4"
                                                                            >
                                                                              <div className="mb-3">
                                                                                <Row>
                                                                                  <Col className="col-4">
                                                                                    <Label for="current-address">
                                                                                      {this.props.t(
                                                                                        "Current Address"
                                                                                      )}
                                                                                    </Label>
                                                                                  </Col>
                                                                                  <Col className="col-8">
                                                                                    <Field
                                                                                      type="text"
                                                                                      name="CurrentAddress"
                                                                                      id="current-address"
                                                                                      className={
                                                                                        "form-control"
                                                                                      }
                                                                                    />
                                                                                  </Col>
                                                                                </Row>
                                                                              </div>
                                                                              {/* <div className="mb-3">
                                                                                                                                              <Row>
                                                                                                                                                <Col className="col-4">
                                                                                                                                                  <Label for="current-street">
                                                                                                                                                    {this.props.t(
                                                                                                                                                      "Current Street"
                                                                                                                                                    )}
                                                                                                                                                  </Label>
                                                                                                                                                </Col>
                                                                                                                                                <Col className="col-8">
                                                                                                                                                  <Field
                                                                                                                                                    type="text"
                                                                                                                                                    name="currentAddrStreet"
                                                                                                                                                    id="current-street"
                                                                                                                                                    className={
                                                                                                                                                      "form-control"
                                                                                                                                                    }
                                                                                                                                                  />
                                                                                                                                                </Col>
                                                                                                                                              </Row>
                                                                                                                                            </div>
                                                                                                                                            <div className="mb-3">
                                                                                                                                              <Row>
                                                                                                                                                <Col className="col-4">
                                                                                                                                                  <Label for="current-building">
                                                                                                                                                    {this.props.t(
                                                                                                                                                      "Current Building Number"
                                                                                                                                                    )}
                                                                                                                                                  </Label>
                                                                                                                                                </Col>
                                                                                                                                                <Col className="col-8">
                                                                                                                                                  <Field
                                                                                                                                                    type="text"
                                                                                                                                                    name="currentAddrBuildingNum"
                                                                                                                                                    id="current-building"
                                                                                                                                                    className={
                                                                                                                                                      "form-control"
                                                                                                                                                    }
                                                                                                                                                  />
                                                                                                                                                </Col>
                                                                                                                                              </Row>
                                                                                                                                            </div> */}
                                                                              <div className="mb-3">
                                                                                <Row>
                                                                                  <Col className="col-4">
                                                                                    <Label for="current-phone">
                                                                                      {this.props.t(
                                                                                        "Current Phone"
                                                                                      )}
                                                                                    </Label>
                                                                                  </Col>
                                                                                  <Col className="col-8">
                                                                                    <Field
                                                                                      type="text"
                                                                                      name="CurrentAddrPhone"
                                                                                      id="current-phone"
                                                                                      className={
                                                                                        "form-control"
                                                                                      }
                                                                                    />
                                                                                  </Col>
                                                                                </Row>
                                                                              </div>
                                                                              <div className="mb-3">
                                                                                <Row>
                                                                                  <Col className="col-4">
                                                                                    <Label for="current-cell">
                                                                                      {this.props.t(
                                                                                        "Current Mobile"
                                                                                      )}
                                                                                    </Label>
                                                                                  </Col>
                                                                                  <Col className="col-8">
                                                                                    <Field
                                                                                      type="text"
                                                                                      name="CurrentAddrCell"
                                                                                      id="current-cell"
                                                                                      className={
                                                                                        "form-control"
                                                                                      }
                                                                                    />
                                                                                  </Col>
                                                                                </Row>
                                                                              </div>
                                                                            </Col>
                                                                            <Col
                                                                              className="bordered"
                                                                              lg="4"
                                                                            >
                                                                              <div className="mb-3">
                                                                                <Row>
                                                                                  <Col className="col-4">
                                                                                    <Label for="permenant-address">
                                                                                      {this.props.t(
                                                                                        "Permanent Address"
                                                                                      )}
                                                                                    </Label>
                                                                                  </Col>
                                                                                  <Col className="col-8">
                                                                                    <Field
                                                                                      type="text"
                                                                                      name="PermanentAddress"
                                                                                      id="permenant-address"
                                                                                      className={
                                                                                        "form-control"
                                                                                      }
                                                                                    />
                                                                                  </Col>
                                                                                </Row>
                                                                              </div>
                                                                              {/* <div className="mb-3">
                                                                                                                                              <Row>
                                                                                                                                                <Col className="col-4">
                                                                                                                                                  <Label for="permenant-street">
                                                                                                                                                    {this.props.t(
                                                                                                                                                      "Permanent Street"
                                                                                                                                                    )}
                                                                                                                                                  </Label>
                                                                                                                                                </Col>
                                                                                                                                                <Col className="col-8">
                                                                                                                                                  <Field
                                                                                                                                                    type="text"
                                                                                                                                                    name="permanentAddrStreet"
                                                                                                                                                    id="permenant-street"
                                                                                                                                                    className={
                                                                                                                                                      "form-control"
                                                                                                                                                    }
                                                                                                                                                  />
                                                                                                                                                </Col>
                                                                                                                                              </Row>
                                                                                                                                            </div>
                                                                                                                                            <div className="mb-3">
                                                                                                                                              <Row>
                                                                                                                                                <Col className="col-4">
                                                                                                                                                  <Label for="permenant-building">
                                                                                                                                                    {this.props.t(
                                                                                                                                                      "Permanent Building Number"
                                                                                                                                                    )}
                                                                                                                                                  </Label>
                                                                                                                                                </Col>
                                                                                                                                                <Col className="col-8">
                                                                                                                                                  <Field
                                                                                                                                                    type="text"
                                                                                                                                                    name="permanentAddrBuildingNum"
                                                                                                                                                    id="permenant-building"
                                                                                                                                                    className={
                                                                                                                                                      "form-control"
                                                                                                                                                    }
                                                                                                                                                  />
                                                                                                                                                </Col>
                                                                                                                                              </Row>
                                                                                                                                            </div> */}
                                                                              <div className="mb-3">
                                                                                <Row>
                                                                                  <Col className="col-4">
                                                                                    <Label for="permenant-phobe">
                                                                                      {this.props.t(
                                                                                        "Parent Phone"
                                                                                      )}
                                                                                    </Label>
                                                                                  </Col>
                                                                                  <Col className="col-8">
                                                                                    <Field
                                                                                      type="text"
                                                                                      name="ParentAddrPhone"
                                                                                      id="permenant-phobe"
                                                                                      className={
                                                                                        "form-control"
                                                                                      }
                                                                                    />
                                                                                  </Col>
                                                                                </Row>
                                                                              </div>
                                                                              <div className="mb-3">
                                                                                <Row>
                                                                                  <Col className="col-4">
                                                                                    <Label for="permenant-cell">
                                                                                      {this.props.t(
                                                                                        "Whatsapp Mobile"
                                                                                      )}
                                                                                    </Label>
                                                                                  </Col>
                                                                                  <Col className="col-8">
                                                                                    <Field
                                                                                      type="text"
                                                                                      name="WhatsappMobileNum"
                                                                                      id="permenant-cell"
                                                                                      className={
                                                                                        "form-control"
                                                                                      }
                                                                                    />
                                                                                    <span className="text-danger">
                                                                                      *
                                                                                    </span>
                                                                                  </Col>
                                                                                </Row>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>
                                                                          <Row>
                                                                            <Col
                                                                              className="bordered"
                                                                              lg="8"
                                                                            >
                                                                              <Row>
                                                                                <Col lg="6">
                                                                                  <div className="mb-3">
                                                                                    <Row>
                                                                                      <Col className="col-4">
                                                                                        <Label for="email">
                                                                                          {this.props.t(
                                                                                            "Email"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <InputGroup>
                                                                                          <Field
                                                                                            type="text"
                                                                                            name="Email"
                                                                                            id="email"
                                                                                            className={
                                                                                              "form-control"
                                                                                            }
                                                                                          />
                                                                                          <div className="input-group-text">
                                                                                            @
                                                                                          </div>
                                                                                        </InputGroup>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                                <Col lg="6">
                                                                                  <div className="md-3">
                                                                                    <Row>
                                                                                      <Col className="col-4 text-center">
                                                                                        <Label for="note">
                                                                                          {this.props.t(
                                                                                            "Notes"
                                                                                          )}
                                                                                        </Label>
                                                                                      </Col>
                                                                                      <Col className="col-8">
                                                                                        <Field
                                                                                          type="textarea"
                                                                                          name="GeneralNote"
                                                                                          as="textarea"
                                                                                          id="note"
                                                                                          className={
                                                                                            "form-control"
                                                                                          }
                                                                                        />
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </div>
                                                                                </Col>
                                                                              </Row>
                                                                            </Col>
                                                                          </Row>
                                                                        </Row>
                                                                        {/*     <Row>
                                                                                                                                        <Accordion defaultActiveKey="1">
                                                                                                                                          <Accordion.Item eventKey="2">
                                                                                                                                            <Accordion.Header>
                                                                                                                                              {this.props.t(
                                                                                                                                                "Relatives Information"
                                                                                                                                              )}
                                                                                                                                            </Accordion.Header>
                                                                                                                                            <Accordion.Body>
                                                                                                                                              {duplicateErrorRelative && (
                                                                                                                                                <Alert
                                                                                                                                                  color="danger"
                                                                                                                                                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                                                                                                  role="alert"
                                                                                                                                                >
                                                                                                                                                  {
                                                                                                                                                    duplicateErrorRelative
                                                                                                                                                  }
                                                                                                                                                  <button
                                                                                                                                                    type="button"
                                                                                                                                                    className="btn-close"
                                                                                                                                                    aria-label="Close"
                                                                                                                                                    onClick={
                                                                                                                                                      this
                                                                                                                                                        .handleAlertCloseRelative
                                                                                                                                                    }
                                                                                                                                                  ></button>
                                                                                                                                                </Alert>
                                                                                                                                              )}
                                                                                                                                              <Row>
                                                                                                                                                <Col>
                                                                                                                                                  <div className="text-sm-end">
                                                                                                                                                    <Tooltip
                                                                                                                                                      title={this.props.t(
                                                                                                                                                        "Add"
                                                                                                                                                      )}
                                                                                                                                                      placement="top"
                                                                                                                                                    >
                                                                                                                                                      <IconButton
                                                                                                                                                        color="primary"
                                                                                                                                                        onClick={
                                                                                                                                                          this
                                                                                                                                                            .handleAddRowRelative
                                                                                                                                                        }
                                                                                                                                                      >
                                                                                                                                                        <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                                                                                                                      </IconButton>
                                                                                                                                                    </Tooltip>
                                                                                                                                                  </div>
                                                                                                                                                </Col>
                                                                                                                                              </Row>
                                                                                                                                              <BootstrapTable
                                                                                                                                                keyField="Id"
                                                                                                                                                data={relativesArray}
                                                                                                                                                columns={
                                                                                                                                                  ParentsColumns
                                                                                                                                                }
                                                                                                                                                cellEdit={cellEditFactory(
                                                                                                                                                  {
                                                                                                                                                    mode: "click",
                                                                                                                                                    blurToSave: true,
                                                                                                                                                    afterSaveCell: (
                                                                                                                                                      oldValue,
                                                                                                                                                      newValue,
                                                                                                                                                      row,
                                                                                                                                                      column
                                                                                                                                                    ) => {
                                                                                                                                                      this.handleParentsDataChange(
                                                                                                                                                        row.Id,
                                                                                                                                                        column.dataField,
                                                                                                                                                        newValue
                                                                                                                                                      );
                                                                                                                                                    },
                                                                                                                                                  }
                                                                                                                                                )}
                                                                                                                                                noDataIndication={t(
                                                                                                                                                  "No Relatives Found"
                                                                                                                                                )}
                                                                                                                                                defaultSorted={
                                                                                                                                                  defaultSorting
                                                                                                                                                }
                                                                                                                                              />
                                                                                                                                            </Accordion.Body>
                                                                                                                                          </Accordion.Item>
                                                                                                                                        </Accordion>
                                                                                                                                      </Row> */}
                                                                      </TabPane>
                                                                      <TabPane
                                                                        key={4}
                                                                        tabId={
                                                                          4
                                                                        }
                                                                      >
                                                                        <Row className="documents-table">
                                                                          <Col>
                                                                            <Card>
                                                                              <CardBody>
                                                                                <div className="table-responsive">
                                                                                  {/* {duplicateErrorProfExperiences && (
                                                                                                                                                  <Alert
                                                                                                                                                    color="danger"
                                                                                                                                                    className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                                                                                                    role="alert"
                                                                                                                                                  >
                                                                                                                                                    {
                                                                                                                                                      duplicateErrorProfExperiences
                                                                                                                                                    }
                                                                                                                                                    <button
                                                                                                                                                      type="button"
                                                                                                                                                      className="btn-close"
                                                                                                                                                      aria-label="Close"
                                                                                                                                                      onClick={
                                                                                                                                                        this
                                                                                                                                                          .handleAlertCloseProfExperiences
                                                                                                                                                      }
                                                                                                                                                    ></button>
                                                                                                                                                  </Alert>
                                                                                                                                                )} */}
                                                                                  <Row>
                                                                                    <div>
                                                                                      {errorMessage1 && (
                                                                                        <Alert
                                                                                          color="danger"
                                                                                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                                          role="alert"
                                                                                        >
                                                                                          {
                                                                                            errorMessage1
                                                                                          }
                                                                                          <button
                                                                                            type="button"
                                                                                            className="btn-close"
                                                                                            aria-label="Close"
                                                                                            onClick={
                                                                                              this
                                                                                                .handleExpErrorClose
                                                                                            }
                                                                                          ></button>
                                                                                        </Alert>
                                                                                      )}
                                                                                    </div>
                                                                                    <div>
                                                                                      {successMessage1 && (
                                                                                        <Alert
                                                                                          color="success"
                                                                                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                                          role="alert"
                                                                                        >
                                                                                          {
                                                                                            successMessage1
                                                                                          }
                                                                                          <button
                                                                                            type="button"
                                                                                            className="btn-close"
                                                                                            aria-label="Close"
                                                                                            onClick={
                                                                                              this
                                                                                                .handleExpSuccessClose
                                                                                            }
                                                                                          ></button>
                                                                                        </Alert>
                                                                                      )}
                                                                                    </div>
                                                                                  </Row>
                                                                                  <div>
                                                                                    {duplicateErrorProfExperiences && (
                                                                                      <Alert
                                                                                        color="danger"
                                                                                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                                        role="alert"
                                                                                      >
                                                                                        {
                                                                                          duplicateErrorProfExperiences
                                                                                        }
                                                                                        <button
                                                                                          type="button"
                                                                                          className="btn-close"
                                                                                          aria-label="Close"
                                                                                          onClick={
                                                                                            this
                                                                                              .handleAlertClose
                                                                                          }
                                                                                        ></button>
                                                                                      </Alert>
                                                                                    )}
                                                                                    {deleted ==
                                                                                      0 &&
                                                                                      showAlert && (
                                                                                        <Alert
                                                                                          color="danger"
                                                                                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                                          role="alert"
                                                                                        >
                                                                                          {
                                                                                            alertMessage
                                                                                          }
                                                                                          <button
                                                                                            type="button"
                                                                                            className="btn-close"
                                                                                            aria-label="Close"
                                                                                            onClick={
                                                                                              this
                                                                                                .handleExpErrorClose
                                                                                            }
                                                                                          ></button>
                                                                                        </Alert>
                                                                                      )}
                                                                                    {deleted ==
                                                                                      1 &&
                                                                                      showAlert && (
                                                                                        <Alert
                                                                                          color="success"
                                                                                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                                          role="alert"
                                                                                        >
                                                                                          {
                                                                                            alertMessage
                                                                                          }
                                                                                          <button
                                                                                            type="button"
                                                                                            className="btn-close"
                                                                                            aria-label="Close"
                                                                                            onClick={
                                                                                              this
                                                                                                .handleExpSuccessClose
                                                                                            }
                                                                                          ></button>
                                                                                        </Alert>
                                                                                      )}
                                                                                  </div>
                                                                                  <Row>
                                                                                    <Col>
                                                                                      <div className="text-sm-end">
                                                                                        <Tooltip
                                                                                          title={this.props.t(
                                                                                            "Add"
                                                                                          )}
                                                                                          placement="top"
                                                                                        >
                                                                                          <IconButton
                                                                                            color="primary"
                                                                                            onClick={
                                                                                              this
                                                                                                .handelAddExperience
                                                                                            }
                                                                                            disabled={
                                                                                              !lastAddedId &&
                                                                                              !isEdit
                                                                                            }
                                                                                          >
                                                                                            <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                                                          </IconButton>
                                                                                        </Tooltip>
                                                                                      </div>
                                                                                    </Col>
                                                                                  </Row>
                                                                                  <DeleteModal
                                                                                    show={
                                                                                      deleteModal
                                                                                    }
                                                                                    onDeleteClick={
                                                                                      this
                                                                                        .handleDelete
                                                                                    }
                                                                                    onCloseClick={() =>
                                                                                      this.setState(
                                                                                        {
                                                                                          deleteModal: false,
                                                                                          selectedRowId:
                                                                                            null,
                                                                                        }
                                                                                      )
                                                                                    }
                                                                                  />
                                                                                  <BootstrapTable
                                                                                    keyField="Id"
                                                                                    data={
                                                                                      profExperiencesArray
                                                                                    }
                                                                                    columns={
                                                                                      trnProfExperienceColumns
                                                                                    }
                                                                                    cellEdit={cellEditFactory(
                                                                                      {
                                                                                        mode: "dbclick",
                                                                                        blurToSave: true,
                                                                                        afterSaveCell:
                                                                                          (
                                                                                            oldValue,
                                                                                            newValue,
                                                                                            row,
                                                                                            column
                                                                                          ) => {
                                                                                            this.handleExperienceDataChange(
                                                                                              row.Id,
                                                                                              column.dataField,
                                                                                              newValue
                                                                                            );
                                                                                          },
                                                                                      }
                                                                                    )}
                                                                                  />
                                                                                </div>
                                                                              </CardBody>
                                                                            </Card>
                                                                          </Col>
                                                                        </Row>
                                                                      </TabPane>
                                                                      <TabPane
                                                                        key={5}
                                                                        tabId={
                                                                          5
                                                                        }
                                                                      >
                                                                        <Row className="documents-table">
                                                                          <Col>
                                                                            <Card>
                                                                              <CardBody>
                                                                                <div className="table-responsive">
                                                                                  <BootstrapTable
                                                                                    keyField="Id"
                                                                                    data={
                                                                                      stdDocsArray
                                                                                    }
                                                                                    columns={
                                                                                      preReqColumns
                                                                                    }
                                                                                    key={
                                                                                      document.Id
                                                                                    }
                                                                                    cellEdit={cellEditFactory(
                                                                                      {
                                                                                        mode: "click",
                                                                                        blurToSave: true,
                                                                                        afterSaveCell:
                                                                                          (
                                                                                            oldValue,
                                                                                            newValue,
                                                                                            row,
                                                                                            column
                                                                                          ) => {
                                                                                            this.handleRegReqDocDataChange(
                                                                                              row.Id,
                                                                                              column.dataField,
                                                                                              newValue
                                                                                            );
                                                                                          },
                                                                                      }
                                                                                    )}
                                                                                  />
                                                                                </div>
                                                                              </CardBody>
                                                                            </Card>
                                                                          </Col>
                                                                        </Row>
                                                                      </TabPane>
                                                                    </TabContent>
                                                                  </div>
                                                                  <div className="actions clearfix">
                                                                    <ul>
                                                                      {!isEdit &&
                                                                        this
                                                                          .state
                                                                          .activeTab ===
                                                                          3 && (
                                                                          <li>
                                                                            <Link
                                                                              to="#"
                                                                              onClick={() => {
                                                                                this.handleSave(
                                                                                  values
                                                                                );
                                                                              }}
                                                                            >
                                                                              save
                                                                            </Link>
                                                                          </li>
                                                                        )}
                                                                      {isEdit &&
                                                                        this
                                                                          .state
                                                                          .activeTab ===
                                                                          3 && (
                                                                          <li>
                                                                            <Link
                                                                              to="#"
                                                                              onClick={() => {
                                                                                this.handleSave(
                                                                                  values
                                                                                );
                                                                              }}
                                                                            >
                                                                              save
                                                                            </Link>
                                                                          </li>
                                                                        )}

                                                                      {!isEdit &&
                                                                        this
                                                                          .state
                                                                          .activeTab ===
                                                                          4 && (
                                                                          <li>
                                                                            <Link
                                                                              to="#"
                                                                              onClick={() => {
                                                                                this.handleExperienceSubmit(
                                                                                  values
                                                                                );
                                                                              }}
                                                                            >
                                                                              save
                                                                            </Link>
                                                                          </li>
                                                                        )}
                                                                      {isEdit &&
                                                                        this
                                                                          .state
                                                                          .activeTab ===
                                                                          4 && (
                                                                          <li>
                                                                            <Link
                                                                              to="#"
                                                                              onClick={() => {
                                                                                this.handleExperienceSubmit(
                                                                                  values
                                                                                );
                                                                              }}
                                                                            >
                                                                              save
                                                                            </Link>
                                                                          </li>
                                                                        )}
                                                                      {!isEdit &&
                                                                        this
                                                                          .state
                                                                          .activeTab ===
                                                                          5 && (
                                                                          <li>
                                                                            <Link
                                                                              to="#"
                                                                              onClick={() => {
                                                                                this.handleSubmit(
                                                                                  values
                                                                                );
                                                                              }}
                                                                            >
                                                                              save
                                                                            </Link>
                                                                          </li>
                                                                        )}
                                                                      {isEdit &&
                                                                        this
                                                                          .state
                                                                          .activeTab ===
                                                                          5 && (
                                                                          <li>
                                                                            <Link
                                                                              to="#"
                                                                              onClick={() => {
                                                                                this.handleSubmit(
                                                                                  values
                                                                                );
                                                                              }}
                                                                            >
                                                                              save
                                                                            </Link>
                                                                          </li>
                                                                        )}

                                                                      <li
                                                                        className={
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          1
                                                                            ? "previous disabled"
                                                                            : "previous"
                                                                        }
                                                                      >
                                                                        <Link
                                                                          to="#"
                                                                          onClick={() => {
                                                                            this.toggleTab(
                                                                              this
                                                                                .state
                                                                                .activeTab -
                                                                                1
                                                                            );
                                                                          }}
                                                                        >
                                                                          {this.props.t(
                                                                            "Previous"
                                                                          )}
                                                                        </Link>
                                                                      </li>
                                                                      <li
                                                                        className={
                                                                          this
                                                                            .state
                                                                            .activeTab ===
                                                                          5
                                                                            ? "next disabled"
                                                                            : "next"
                                                                        }
                                                                      >
                                                                        <Link
                                                                          to="#"
                                                                          onClick={() => {
                                                                            this.toggleTab(
                                                                              this
                                                                                .state
                                                                                .activeTab +
                                                                                1
                                                                            );
                                                                          }}
                                                                        >
                                                                          {this.props.t(
                                                                            "Next"
                                                                          )}
                                                                        </Link>
                                                                      </li>
                                                                    </ul>
                                                                  </div>
                                                                </div>
                                                              </CardBody>
                                                            </Card>
                                                          </Col>
                                                        </Form>
                                                      </div>
                                                    )}
                                                  </Formik>
                                                )}
                                              </div>
                                            </div>
                                          </ModalBody>
                                        </Modal>
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
  tempTrainee: trainees.tempTrainee,
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
  tempTraineeStatus: tempTrainees.tempTraineeStatus,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetTrainees: () => dispatch(getTrainees()),
  onAddNewTrainee: trainee => dispatch(addNewTrainee(trainee)),
  onUpdateTrainee: trainee => dispatch(updateTrainee(trainee)),
  onDeleteTrainee: trainee => dispatch(deleteTrainee(trainee)),
  onGetTraineeById: tempTrainee => dispatch(getTraineeById(tempTrainee)),
  // onGetTraineeRegReqDocs: tempTrainees =>
  //   dispatch(getTraineeRegReqDocs(tempTrainees)),
  // onUpdateTraineeRegReqDoc: tempTrainee =>
  //   dispatch(updateTraineeRegReqDoc(tempTrainee)),
  // onGetFilteredFaculties: admissionCond =>
  //   dispatch(getFilteredFaculties(admissionCond)),
  // onGetFilteredAcademicCertificates: academicCer =>
  //   dispatch(getFilteredAcademicCertificates(academicCer)),
  // onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TraineesList));
