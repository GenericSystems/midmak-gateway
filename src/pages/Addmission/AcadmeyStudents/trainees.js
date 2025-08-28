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
// import OtherChart from "pages/generate-SIDs/OtherChart";

// import { getCurrentSemester } from "store/semesters/actions";
import { getTrainees } from "store/trainees/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class TraineesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainees: {},
      selectedView: "",
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      showFatherName: false,
      showTraineeStatus: false,
      showYear: false,
      showFatherName: false,
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
      activeAccordion: "personalInfo",
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      trainees,
      traineeStates,
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
    if (trainees && !trainees.length) {
      onGetTrainees(lang);

      this.setState({ trainees, stdWarningTestOpt });
      this.setState({ traineeStates });
      this.setState({ currencies });
      this.setState({ faculties });
      this.setState({ deleted });
    }

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

  handleStdWarningTestDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateStdWarningTest, trainees } = this.props;

    if (fieldName == "percentage") {
      const numericValue = parseFloat(fieldValue);

      if (isNaN(numericValue)) {
        console.error("Entered value is not a number");
        const errorNonNumeric = this.props.t(`Please enter a valid number`);
        this.setState({ errorMessage: errorNonNumeric });
      } else if (numericValue > 100) {
        console.error("Entered value is greater than grade value");
        const errorGreaterGrade = this.props.t(`Enter Grade From 0 to 100`);
        this.setState({ errorMessage: errorGreaterGrade });
      } else if (numericValue < 0) {
        console.error("Entered value is negative");
        const errorNegativeGrade = this.props.t("You Entered Negative Grade");
        this.setState({ errorMessage: errorNegativeGrade });
      } else {
        const onUpdate = { Id: rowId, [fieldName]: numericValue };
        this.setState({ errorMessage: null });
        onUpdateStdWarningTest(onUpdate);
      }
    }

    if (fieldName == "amount") {
      const onUpdate = { Id: rowId, [fieldName]: fieldValue };
      this.setState({ errorMessage: null });
      onUpdateStdWarningTest(onUpdate);
    }

    if (fieldName == "fromdate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateStdWarningTest(onUpdate);
    }

    if (fieldName == "toDate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateStdWarningTest(onUpdate);
    }
  };

  handleSelectFine = (rowId, fieldName, selectedValue) => {
    const { onUpdateStdWarningTest } = this.props;
    const { trainees } = this.state;

    this.setState({
      selectedFine: selectedValue,
    });

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateStdWarningTest(onUpdate);
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
  };

  handleAddWarning = () => {
    this.setState({
      warningId: "",
      arWarning: "",
      enWarning: "",
      arTransStatementWarning: "",
      enTransStatementWarning: "",
      priorityWarning: "",
      selectedColor: "#FFFFFF",
      selectedRuleType: "",
      selectedFromAdmSemes: "",
      selectedToAdmSemes: "",
      selectedFromRegSemes: "",
      selectedToRegSemes: "",
      stdFromGPAWarning: "",
      stdTillGPAWarning: "",
      stdFromCreditsWarning: "",
      stdTillCreditsWarning: "",
      selectedCalculatedTransferCred: "",
      selectedActiveAdditionalPeriod: "",
      stdSemestersNumber: "",
      prevFromGPAWarning: "",
      prevTillGPAWarning: "",
      prevFromCreditsWarning: "",
      prevTillCreditsWarning: "",
      applyForSemesterArray: [],
      applyStatusArray: [],
      prevAcademicWarningArray: [],
      prevStatusSemesArray: [],

      isEdit: false,
    });
    this.toggle();
  };

  handleButtonClick = (fieldName, option) => {
    if (fieldName == "ruleType") {
      this.setState({ selectedRuleType: option });
    }
    if (fieldName == "calculatedTransferCred") {
      this.setState({
        selectedCalculatedTransferCred: option == "yes" ? 1 : 0,
      });
    }
    if (fieldName == "activeAdditionalPeriod") {
      this.setState({
        selectedActiveAdditionalPeriod: option == "yes" ? 1 : 0,
      });
    }
  };

  handleMulti = (fieldName, selectedMulti) => {
    if (fieldName === "applyForSemester") {
      this.setState({ applyForSemesterArray: selectedMulti });
    }

    if (fieldName === "nationalNo") {
      this.setState({ prevStatusSemesArray: selectedMulti });
    }

    if (fieldName === "identityNo") {
      this.setState({ prevAcademicWarningArray: selectedMulti });
    }

    if (fieldName === "identityIssueDate") {
      this.setState({ applyStatusArray: selectedMulti });
    }
  };

  handleInputBlur = fieldName => {
    const {
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedOldWarningStatus,
      selectedColor,
    } = this.state;

    if (fieldName == "MotherName") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "NationalityId ") {
      this.setState({ selectedFromRegSemes });
    }

    if (fieldName == "toRegSemesId ") {
      this.setState({ selectedToRegSemes });
    }

    if (fieldName == "oldWarningStatusId") {
      this.setState({ selectedOldWarningStatus });
    }

    if (fieldName == "warningColor") {
      this.setState({ selectedColor });
    }
  };

  handleInputFocus = fieldName => {
    const {
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedOldWarningStatus,
    } = this.state;

    if (fieldName == "MotherName") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "NationalityId ") {
      this.setState({ selectedFromRegSemes });
    }

    if (fieldName == "toRegSemesId ") {
      this.setState({ selectedToRegSemes });
    }

    if (fieldName == "oldWarningStatusId") {
      this.setState({ selectedOldWarningStatus });
    }
  };

  handleDataListChange = (event, fieldName) => {
    const selectedValue = event.target.value;

    if (fieldName == "MotherName") {
      this.setState({ selectedFromAdmSemes: selectedValue });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes: selectedValue });
    }

    if (fieldName == "NationalityId ") {
      this.setState({ selectedFromRegSemes: selectedValue });
    }

    if (fieldName == "toRegSemesId ") {
      this.setState({ selectedToRegSemes: selectedValue });
    }

    if (fieldName == "oldWarningStatusId") {
      this.setState({ selectedOldWarningStatus: selectedValue });
    }
  };

  handleColorChange(event) {
    const selectedValue = event.target.value;
    this.setState({ selectedColor: selectedValue });
  }

  handleSave = values => {
    const { onAddNewStdWarningTest, FatherNames } = this.props;
    const {
      selectedColor,
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedRuleType,
      selectedActiveAdditionalPeriod,
      selectedCalculatedTransferCred,
      applyStatusArray,
      applyForSemesterArray,
      prevStatusSemesArray,
      prevAcademicWarningArray,
    } = this.state;

    const fromAdmSemesterObj = FatherNames.find(
      semes => semes.value === selectedFromAdmSemes
    );

    const toAdmSemesterObj = FatherNames.find(
      semes => semes.value === selectedToAdmSemes
    );

    const fromRegSemesterObj = FatherNames.find(
      semes => semes.value === selectedFromRegSemes
    );

    const toRegSemesterObj = FatherNames.find(
      semes => semes.value === selectedToRegSemes
    );

    const obj = {
      SID: values["SID"],
      enWarningStatus: values["enWarningStatus"],
      fullName: values["fullName"],
      enTransStatement: values["enTransStatement"],
      priority: values["priority"],
      warningColor: selectedColor,
      ruleType: selectedRuleType,
      MotherName: fromAdmSemesterObj.key,
      academicStatus: toAdmSemesterObj.key,
      NationalityId: fromRegSemesterObj.key,
      toRegSemesId: toRegSemesterObj.key,
      stdFromGPA: values["stdFromGPA"],
      stdTillGPA: values["stdTillGPA"],
      stdFromCredits: values["stdFromCredits"],
      stdTillCredits: values["stdTillCredits"],
      calculatedTransferCred: selectedCalculatedTransferCred,
      activeAdditionalPeriod: selectedActiveAdditionalPeriod,
      stdSemestersNb: values["stdSemestersNb"],
      prevFromGPA: values["prevFromGPA"],
      prevTillGPA: values["prevTillGPA"],
      prevFromCredits: values["prevFromCredits"],
      prevTillCredits: values["prevTillCredits"],
      identityIssueDate: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      nationalNo: prevStatusSemesArray,
      identityNo: prevAcademicWarningArray,
    };

    onAddNewStdWarningTest(obj);
  };

  handleEditStdWarningTest = arg => {
    const trainees = arg;

    this.setState({
      warningId: trainees.Id,
      arWarning: trainees.SID,
      enWarning: trainees.enWarningStatus,
      arTransStatementWarning: trainees.fullName,
      enTransStatementWarning: trainees.enTransStatement,
      priorityWarning: trainees.priority,
      selectedColor: trainees.warningColor,
      selectedRuleType: trainees.ruleType,
      selectedFromAdmSemesId: trainees.MotherName,
      selectedToAdmSemesId: trainees.academicStatus,
      selectedFromRegSemesId: trainees.NationalityId,
      selectedToRegSemesId: trainees.toRegSemesId,
      stdFromGPAWarning: trainees.stdFromGPA,
      stdTillGPAWarning: trainees.stdTillGPA,
      stdFromCreditsWarning: trainees.stdFromCredits,
      stdTillCreditsWarning: trainees.stdTillCredits,
      selectedCalculatedTransferCred:
        trainees.calculatedTransferCred == 1 ? "yes" : "no",
      selectedActiveAdditionalPeriod:
        trainees.activeAdditionalPeriod == 1 ? "yes" : "no",
      stdSemestersNumber: trainees.stdSemestersNb,
      prevFromGPAWarning: trainees.prevFromGPA,
      prevTillGPAWarning: trainees.prevTillGPA,
      prevFromCreditsWarning: trainees.prevFromCredits,
      prevTillCreditsWarning: trainees.prevTillCredits,
      applyForSemesterArray: trainees.applyForSemester,
      applyStatusArray: trainees.identityIssueDate,
      prevAcademicWarningArray: trainees.identityNo,
      prevStatusSemesArray: trainees.nationalNo,
      isEdit: true,
    });

    this.toggle();
    const { fiscalYears, FatherNames, onGetFeesConditions, currencies } =
      this.props;
    let obj = { Id: trainees.Id };

    if (trainees.MotherName) {
      const fromAdmSemes = FatherNames.find(
        FatherName => FatherName.key === trainees.MotherName
      );
      this.setState({
        selectedFromAdmSemes: fromAdmSemes.value,
      });
    }

    if (trainees.academicStatus) {
      const toAdmSemes = FatherNames.find(
        FatherName => FatherName.key === trainees.academicStatus
      );
      this.setState({
        selectedToAdmSemes: toAdmSemes.value,
      });
    }

    if (trainees.NationalityId) {
      const fromRegSemes = FatherNames.find(
        FatherName => FatherName.key === trainees.NationalityId
      );
      this.setState({
        selectedFromRegSemes: fromRegSemes.value,
      });
    }

    if (trainees.toRegSemesId) {
      const toRegSemes = FatherNames.find(
        FatherName => FatherName.key === trainees.toRegSemesId
      );
      this.setState({
        selectedToRegSemes: toRegSemes.value,
      });
    }
  };

  handleUpdate = values => {
    const { onUpdateStdWarningTest, FatherNames } = this.props;
    const {
      warningId,
      selectedColor,
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedRuleType,
      selectedActiveAdditionalPeriod,
      selectedCalculatedTransferCred,
      applyStatusArray,
      applyForSemesterArray,
      prevStatusSemesArray,
      prevAcademicWarningArray,
    } = this.state;

    const fromAdmSemesterObj = FatherNames.find(
      semes => semes.value === selectedFromAdmSemes
    );

    const toAdmSemesterObj = FatherNames.find(
      semes => semes.value === selectedToAdmSemes
    );

    const fromRegSemesterObj = FatherNames.find(
      semes => semes.value === selectedFromRegSemes
    );

    const toRegSemesterObj = FatherNames.find(
      semes => semes.value === selectedToRegSemes
    );

    const obj = {
      Id: warningId,
      SID: values["SID"],
      enWarningStatus: values["enWarningStatus"],
      fullName: values["fullName"],
      enTransStatement: values["enTransStatement"],
      priority: values["priority"],
      warningColor: selectedColor,
      ruleType: values["ruleType"],
      MotherName: fromAdmSemesterObj.key,
      academicStatus: toAdmSemesterObj.key,
      NationalityId: fromRegSemesterObj.key,
      toRegSemesId: toRegSemesterObj.key,
      stdFromGPA: values["stdFromGPA"],
      stdTillGPA: values["stdTillGPA"],
      stdFromCredits: values["stdFromCredits"],
      stdTillCredits: values["stdTillCredits"],
      calculatedTransferCred:
        values["calculatedTransferCred"] == "yes"
          ? 1
          : values["calculatedTransferCred"] == "no"
          ? 0
          : values["calculatedTransferCred"],
      activeAdditionalPeriod:
        values["activeAdditionalPeriod"] == "yes"
          ? 1
          : values["activeAdditionalPeriod"] == "no"
          ? 0
          : values["activeAdditionalPeriod"],
      stdSemestersNb: values["stdSemestersNb"],
      prevFromGPA: values["prevFromGPA"],
      prevTillGPA: values["prevTillGPA"],
      prevFromCredits: values["prevFromCredits"],
      prevTillCredits: values["prevTillCredits"],
      identityIssueDate: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      nationalNo: prevStatusSemesArray,
      identityNo: prevAcademicWarningArray,
    };

    onUpdateStdWarningTest(obj);
    this.toggle();
  };

  handlePriorityChange = event => {
    const priorityValue = event.target.value;
    this.setState({ priorityWarning: priorityValue });
  };

  render() {
    const {
      trainees,
      stdWarningTestOpt,
      FatherNames,
      currencies,
      semesters,
      traineeStates,
      deleted,
      t,
    } = this.props;
    const {
      languageState,
      duplicateError,
      errorMessage,
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
      showDiplomaId,
      showDiplomaCountryId,
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
      modal,
      warningId,
      arWarning,
      enWarning,
      arTransStatementWarning,
      enTransStatementWarning,
      priorityWarning,
      stdFromGPAWarning,
      stdTillGPAWarning,
      stdFromCreditsWarning,
      stdTillCreditsWarning,
      stdSemestersNumber,
      prevFromGPAWarning,
      prevTillGPAWarning,
      prevFromCreditsWarning,
      prevTillCreditsWarning,
      selectedRuleType,
      selectedActiveAdditionalPeriod,
      selectedCalculatedTransferCred,
      selectedMulti,
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedColor,
      applyForSemesterArray,
      prevStatusSemesArray,
      applyStatusArray,
      prevAcademicWarningArray,
      showAlert,
      showAddButton,
      showDeleteButton,
      showSearchButton,
    } = this.state;
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
        hidden: !showIdentityIssueDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "PassNumber",
        text: this.props.t("Passport Number"),
        editable: false,
        hidden: !showPassNumber,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "passportIssueDate",
        text: this.props.t("passport Issue Date"),
        editable: false,
        hidden: !showPassportIssueDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "passportExpiryDate",
        text: this.props.t("Passport Expiry Date"),
        editable: false,
        hidden: !showPassportExpiryDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "GenderId",
        text: this.props.t("Gender"),
        editable: false,
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
        hidden: !showCivicZone,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "registerZone",
        text: this.props.t("Register Zone"),
        editable: false,
        hidden: !showRegisterZone,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "registerNo",
        text: this.props.t("Register No"),
        editable: false,
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
        hidden: !showRegistrationDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "registrationCertLevelId",
        text: this.props.t("Certificate Level"),
        editable: false,
        hidden: !showCertificateLevel,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "diplomaId",
        text: this.props.t("Diploma Type"),
        editable: false,
        hidden: !showDiplomaId,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "DiplomaCountryId",
        text: this.props.t("Diploma Country"),
        editable: false,
        hidden: !showDiplomaCountryId,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "DiplomaGovernorateId",
        text: this.props.t("Diploma Governorate"),
        editable: false,
        hidden: !showDiplomaGovernorateId,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "DiplomaYear",
        text: this.props.t("Diploma Year"),
        editable: false,
        hidden: !showDiplomaYear,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "ExaminationSession",
        text: this.props.t("Examination Session"),
        editable: false,
        hidden: !showExaminationSession,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "DiplomaNumber",
        text: this.props.t("Diploma Number"),
        editable: false,
        hidden: !showDiplomaNumber,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "Average",
        text: this.props.t("Averager"),
        editable: false,
        hidden: !showAverage,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "CurrentAddress",
        text: this.props.t("Current Address"),
        editable: false,
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
        hidden: !showPermanentAddress,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "ParentAddrPhone",
        text: this.props.t("Parent Phone"),
        editable: false,
        hidden: !showParentAddrPhone,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "WhatsappMobileNum",
        text: this.props.t("Whatsapp Number"),
        editable: false,
        hidden: !showWhatsappMobileNum,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "Email",
        text: this.props.t("Email"),
        editable: false,
        hidden: !showEmail,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "workType",
        text: this.props.t("Job Title"),
        editable: false,
        hidden: !showJobTitle,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "companyName",
        text: this.props.t("Work Place"),
        editable: false,
        hidden: !showWorkPlace,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "workPlace",
        text: this.props.t("Work address"),
        editable: false,
        hidden: !showWorkAddress,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "workField",
        text: this.props.t("Work Field"),
        editable: false,
        hidden: !showWorkField,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "duaration",
        text: this.props.t("work Duration"),
        editable: false,
        hidden: !showWorkDuration,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, warning) => (
          <div className="d-flex justify-content-center gap-3">
            {showDeleteButton && (
              <Tooltip title={this.props.t("Delete")} placement="top">
                <IconButton color="danger">
                  <i
                    className="mdi mdi-delete font-size-18 text-danger"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(warning)}
                  ></i>
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={this.props.t("Student Status")} placement="top">
              <IconButton>
                <i
                  className="bx bxs-user font-size-18 text-secondary"
                  id="deletetooltip"
                  onClick={() => this.onClickStdStatus(warning)}
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
            <Breadcrumbs breadcrumbItem={t("Acadmey Students")} />

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
                                        {this.props.t("Job title")}
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
                                        {this.props.t("Work address")}
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
                              <Accordion.Body></Accordion.Body>{" "}
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
                            keyField="Id"
                            columns={MainInfoColumns}
                            data={trainees}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
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
                                      <Col sm="8">
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
                                      </Col>
                                    </Row>

                                    <BootstrapTable
                                      keyField="Id"
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      data={trainees}
                                      columns={MainInfoColumns}
                                      cellEdit={cellEditFactory({
                                        mode: "dbclick",
                                        blurToSave: true,
                                        afterSaveCell: (
                                          oldValue,
                                          newValue,
                                          row,
                                          column
                                        ) => {
                                          this.handleContractTypeDataChange(
                                            row.Id,
                                            column.dataField,
                                            newValue
                                          );
                                        },
                                      })}
                                      noDataIndication={this.props.t(
                                        "No ContractsTypes found"
                                      )}
                                      defaultSorted={defaultSorting}
                                    />
                                    <Col className="pagination pagination-rounded justify-content-end mb-2">
                                      <PaginationListStandalone
                                        {...paginationProps}
                                      />
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
  semesters,
  menu_items,
}) => ({
  trainees: trainees.trainees,
  deleted: trainees.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  FatherNames: generalManagements.FatherNames,
  semesters: semesters.semesters,
  currentSemester: semesters.currentSemester,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetTrainees: () => dispatch(getTrainees()),
  // onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TraineesList));
