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
// import { getStudentsRequests } from "store/students-requests/actions";
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
      selectedView: "",
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      showStudentName: true,
      showYearSemester: true,
      showActivationSemester: true,
      showStudentID: true,
      showStateId: true,
      showRequestOrganizer: true,
      showRequestOrgNotes: true,
      requestDate: true,
      showRequestNum: true,
      showRequestId: true,
      showDecreeOrganizer: false,
      showDecreeDate: false,
      showDecreeOrgNotes: false,
      showFoldingDate: false,
      showFoldingOrganizer: false,
      showFoldingOrgNotes: false,
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
      activeTab1: "5",
      activeTab2: "5",
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }
  toggle1(tab) {
    // const { onGetCoursesOffering } = this.props;
    const { ifUpdateCourse, selectedYear } = this.state;
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
      });
    }
    if (ifUpdateCourse != 0) {
      // onGetCoursesOffering();
      this.setState({ ifUpdateCourse: 0 });
    }

    document.getElementById("square-switch1").checked = false;
  }

  componentDidMount() {
    const {
      studentsRequests,
      studentStates,
      stdWarningTestOpt,
      currencies,
      yearSemesters,
      currentSemester,
      semesters,
      faculties,
      onGetStudentsRequests,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (studentsRequests && !studentsRequests.length) {
      // onGetStudentsRequests({ yearSemesterId: 78 });

      this.setState({ studentsRequests, stdWarningTestOpt });
      this.setState({ studentStates });
      this.setState({ currencies });
      this.setState({ faculties });
      this.setState({ yearSemesters });
      this.setState({ currentSemester, semesters });
      this.setState({ deleted });
    }
  }
  componentDidUpdate(prevProps) {
    const { currentSemester, yearSemesters } = this.props;
    if (
      (currentSemester &&
        currentSemester.cuYearSemesterId !==
          prevProps.currentSemester.cuYearSemesterId) ||
      yearSemesters !== prevProps.yearSemesters
    ) {
      this.initializeState();
    }
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

  initializeState() {
    const { currentSemester, yearSemesters, onGetSchedulingLectures } =
      this.props;
    const defaultSemester =
      yearSemesters.find(
        opt => opt.value === currentSemester.cuYearSemesterId
      ) || "";
    this.setState({ defaultSemester: defaultSemester });
  }

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
    const { onUpdateStdWarningTest, studentsRequests } = this.props;

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
    const { studentsRequests } = this.state;

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
    if (fieldName == "studentId") {
      this.setState(prevState => ({
        showStudentID: !prevState.showStudentID,
      }));
    }

    if (fieldName == "studentName") {
      this.setState(prevState => ({
        showStudentName: !prevState.showStudentName,
      }));
    }

    if (fieldName == "yearSemester") {
      this.setState(prevState => ({
        showYearSemester: !prevState.showYearSemester,
      }));
    }

    if (fieldName == "activationSemester") {
      this.setState(prevState => ({
        showActivationSemester: !prevState.showActivationSemester,
      }));
    }

    if (fieldName == "stateId") {
      this.setState(prevState => ({
        showStateId: !prevState.showStateId,
      }));
    }

    if (fieldName == "requestOrganizer") {
      this.setState(prevState => ({
        showRequestOrganizer: !prevState.showRequestOrganizer,
      }));
    }

    if (fieldName == "requestOrgNotes") {
      this.setState(prevState => ({
        showRequestOrgNotes: !prevState.showRequestOrgNotes,
      }));
    }

    if (fieldName == "requestOrgNotes") {
      this.setState(prevState => ({
        showToRegSemester: !prevState.showToRegSemester,
      }));
    }

    if (fieldName == "requestDate") {
      this.setState(prevState => ({
        requestDate: !prevState.requestDate,
      }));
    }

    if (fieldName == "requestNum") {
      this.setState(prevState => ({
        showRequestNum: !prevState.showRequestNum,
      }));
    }

    if (fieldName == "requestId") {
      this.setState(prevState => ({
        showRequestId: !prevState.showRequestId,
      }));
    }

    if (fieldName == "decreeOrganizer") {
      this.setState(prevState => ({
        showDecreeOrganizer: !prevState.showDecreeOrganizer,
      }));
    }

    if (fieldName == "decreeDate") {
      this.setState(prevState => ({
        showDecreeDate: !prevState.showDecreeDate,
      }));
    }

    if (fieldName == "decreeOrgNotes") {
      this.setState(prevState => ({
        showDecreeOrgNotes: !prevState.showDecreeOrgNotes,
      }));
    }

    if (fieldName == "foldingDate") {
      this.setState(prevState => ({
        showFoldingDate: !prevState.showFoldingDate,
      }));
    }

    if (fieldName == "foldingOrganizer") {
      this.setState(prevState => ({
        showFoldingOrganizer: !prevState.showFoldingOrganizer,
      }));
    }

    if (fieldName == "foldingOrgNotes") {
      this.setState(prevState => ({
        showFoldingOrgNotes: !prevState.showFoldingOrgNotes,
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

    if (fieldName === "decreeDate") {
      this.setState({ prevStatusSemesArray: selectedMulti });
    }

    if (fieldName === "decreeOrganizer") {
      this.setState({ prevAcademicWarningArray: selectedMulti });
    }

    if (fieldName === "decreeOrgNotes") {
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

    if (fieldName == "stateId") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "requestOrgNotes ") {
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

    if (fieldName == "stateId") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "requestOrgNotes ") {
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

    if (fieldName == "stateId") {
      this.setState({ selectedFromAdmSemes: selectedValue });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes: selectedValue });
    }

    if (fieldName == "requestOrgNotes ") {
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
    const { onAddNewStdWarningTest, yearSemesters } = this.props;
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

    const fromAdmSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromAdmSemes
    );

    const toAdmSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToAdmSemes
    );

    const fromRegSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromRegSemes
    );

    const toRegSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToRegSemes
    );

    const obj = {
      SID: values["SID"],
      enWarningStatus: values["enWarningStatus"],
      studentName: values["studentName"],
      enTransStatement: values["enTransStatement"],
      priority: values["priority"],
      warningColor: selectedColor,
      ruleType: selectedRuleType,
      stateId: fromAdmSemesterObj.key,
      academicStatus: toAdmSemesterObj.key,
      requestOrgNotes: fromRegSemesterObj.key,
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
      decreeOrgNotes: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      decreeDate: prevStatusSemesArray,
      decreeOrganizer: prevAcademicWarningArray,
    };

    onAddNewStdWarningTest(obj);
  };

  handleEditStdWarningTest = arg => {
    const studentsRequests = arg;

    this.setState({
      warningId: studentsRequests.Id,
      arWarning: studentsRequests.SID,
      enWarning: studentsRequests.enWarningStatus,
      arTransStatementWarning: studentsRequests.studentName,
      enTransStatementWarning: studentsRequests.enTransStatement,
      priorityWarning: studentsRequests.priority,
      selectedColor: studentsRequests.warningColor,
      selectedRuleType: studentsRequests.ruleType,
      selectedFromAdmSemesId: studentsRequests.stateId,
      selectedToAdmSemesId: studentsRequests.academicStatus,
      selectedFromRegSemesId: studentsRequests.requestOrgNotes,
      selectedToRegSemesId: studentsRequests.toRegSemesId,
      stdFromGPAWarning: studentsRequests.stdFromGPA,
      stdTillGPAWarning: studentsRequests.stdTillGPA,
      stdFromCreditsWarning: studentsRequests.stdFromCredits,
      stdTillCreditsWarning: studentsRequests.stdTillCredits,
      selectedCalculatedTransferCred:
        studentsRequests.calculatedTransferCred == 1 ? "yes" : "no",
      selectedActiveAdditionalPeriod:
        studentsRequests.activeAdditionalPeriod == 1 ? "yes" : "no",
      stdSemestersNumber: studentsRequests.stdSemestersNb,
      prevFromGPAWarning: studentsRequests.prevFromGPA,
      prevTillGPAWarning: studentsRequests.prevTillGPA,
      prevFromCreditsWarning: studentsRequests.prevFromCredits,
      prevTillCreditsWarning: studentsRequests.prevTillCredits,
      applyForSemesterArray: studentsRequests.applyForSemester,
      applyStatusArray: studentsRequests.decreeOrgNotes,
      prevAcademicWarningArray: studentsRequests.decreeOrganizer,
      prevStatusSemesArray: studentsRequests.decreeDate,
      isEdit: true,
    });

    this.toggle();
    const { fiscalYears, yearSemesters, onGetFeesConditions, currencies } =
      this.props;
    let obj = { Id: studentsRequests.Id };

    if (studentsRequests.stateId) {
      const fromAdmSemes = yearSemesters.find(
        yearSemester => yearSemester.key === studentsRequests.stateId
      );
      this.setState({
        selectedFromAdmSemes: fromAdmSemes.value,
      });
    }

    if (studentsRequests.academicStatus) {
      const toAdmSemes = yearSemesters.find(
        yearSemester => yearSemester.key === studentsRequests.academicStatus
      );
      this.setState({
        selectedToAdmSemes: toAdmSemes.value,
      });
    }

    if (studentsRequests.requestOrgNotes) {
      const fromRegSemes = yearSemesters.find(
        yearSemester => yearSemester.key === studentsRequests.requestOrgNotes
      );
      this.setState({
        selectedFromRegSemes: fromRegSemes.value,
      });
    }

    if (studentsRequests.toRegSemesId) {
      const toRegSemes = yearSemesters.find(
        yearSemester => yearSemester.key === studentsRequests.toRegSemesId
      );
      this.setState({
        selectedToRegSemes: toRegSemes.value,
      });
    }
  };

  handleUpdate = values => {
    const { onUpdateStdWarningTest, yearSemesters } = this.props;
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

    const fromAdmSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromAdmSemes
    );

    const toAdmSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToAdmSemes
    );

    const fromRegSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromRegSemes
    );

    const toRegSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToRegSemes
    );

    const obj = {
      Id: warningId,
      SID: values["SID"],
      enWarningStatus: values["enWarningStatus"],
      studentName: values["studentName"],
      enTransStatement: values["enTransStatement"],
      priority: values["priority"],
      warningColor: selectedColor,
      ruleType: values["ruleType"],
      stateId: fromAdmSemesterObj.key,
      academicStatus: toAdmSemesterObj.key,
      requestOrgNotes: fromRegSemesterObj.key,
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
      decreeOrgNotes: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      decreeDate: prevStatusSemesArray,
      decreeOrganizer: prevAcademicWarningArray,
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
      studentsRequests,
      stdWarningTestOpt,
      yearSemesters,
      currencies,
      semesters,
      studentStates,
      deleted,
      t,
    } = this.props;
    const {
      errorMessage,
      sidebarOpen,
      deleteModal,
      isEdit,
      showStudentID,
      showStudentName,
      showYearSemester,
      showActivationSemester,
      showStateId,
      showRequestOrganizer,
      showRequestOrgNotes,
      requestDate,
      showToRegSemester,
      showRequestNum,
      showRequestId,
      showDecreeOrganizer,
      showDecreeDate,
      showDecreeOrgNotes,
      showFoldingDate,
      showFoldingOrganizer,
      showFoldingOrgNotes,
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

    console.log("studentsRequests", studentsRequests);
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
        dataField: "FirstName",
        text: this.props.t("Firs tName"),
        sort: true,
        editable: false,
        hidden: !showRequestNum,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "LastName",
        text: this.props.t("Last Name"),
        sort: true,
        editable: false,
        hidden: !showRequestId,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "FatherName",
        text: this.props.t("Father Name"),
        sort: true,
        editable: false,
        hidden: !showYearSemester,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "MotherName",
        text: this.props.t("Mother Name"),
        sort: true,
        editable: false,
        hidden: !showActivationSemester,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "grandFatherName",
        text: this.props.t("grand Father Name"),
        sort: true,
        editable: false,
        hidden: !showStateId,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "BirthLocation",
        text: this.props.t("Birth Location"),
        sort: true,
        editable: false,
        hidden: !requestDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "birthdate",

        text: this.props.t("Birth Date"),
        sort: true,
        editable: false,
        hidden: !showRequestOrganizer,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "IdNumber",

        text: this.props.t("Id Number"),
        sort: true,
        editable: false,
        hidden: !showRequestOrgNotes,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "perosonalCardNum",
        text: this.props.t("perosonal Card Number"),
        sort: true,
        editable: false,
        hidden: !showDecreeDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "EmissionDate",
        text: this.props.t("Emission Date"),
        sort: true,
        formatter: (cell, row) =>
          cell && Array.isArray(cell)
            ? cell.map(option => option.label).join(" , ")
            : "",
        editable: false,
        hidden: !showDecreeOrganizer,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "PassNumber",
        text: this.props.t("Passport Number"),
        editable: false,
        hidden: !showDecreeOrgNotes,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "passportGrantDate",
        text: this.props.t("Passport Grant Date"),
        editable: false,
        hidden: !showFoldingDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "passportExpirationDate",
        text: this.props.t("Passport Expiration Date"),
        editable: false,
        hidden: !showFoldingOrganizer,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "Gender",
        text: this.props.t("Gender"),
        editable: false,
        hidden: !showFoldingOrgNotes,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "Nationality",
        text: this.props.t("Nationality"),
        sort: true,
        editable: false,
        hidden: !showStudentID,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "perCardCaza",
        text: this.props.t("Amana"),
        sort: true,
        editable: false,
        hidden: !showStudentName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "perCardPlaceRegistration",
        text: this.props.t("Place Registration"),
        sort: true,
        editable: false,
        hidden: !showStudentName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "perCardRegNum",
        text: this.props.t("Registration Number"),
        sort: true,
        editable: false,
        hidden: !showStudentName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
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
      totalSize: studentsRequests.length,
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

            <Card>
              <CardBody>
                <DeleteModal
                  show={deleteModal}
                  onDeleteClick={this.handleDeleteRow}
                  onCloseClick={() =>
                    this.setState({ deleteModal: false, selectedRowId: null })
                  }
                />
                <Row>
                  {/* <Col md="2">
                    <Nav pills className="flex-column" id="margTop">
                      <NavItem>
                        <NavLink
                          id="horizontal-home-link"
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: this.state.activeTab1 === "5",
                          })}
                          onClick={() => {
                            this.toggle1("5");
                          }}
                        >
                          {this.props.t("Main Info")}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          id="horizontal-home-link"
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: this.state.activeTab1 === "6",
                          })}
                          onClick={() => {
                            this.toggle1("6");
                          }}
                        >
                          {this.props.t("Section&Labs")}
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col> */}
                  {/* {sidebarOpen && (
                  <Row>
                                        
                    <div style={{ width: sidebarOpen ? "14%" : "0" }}>
                      <Card>
                        <CardTitle id="warning_rules_header">
                          {t("Main Info")}
                        </CardTitle>
                        <CardBody>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck4"
                                  autoComplete="off"
                                  defaultChecked={showRequestNum}
                                  onClick={() =>
                                    this.handleShowColumn("requestNum")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck4"
                                >
                                  {this.props.t("Request Number")}
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
                                  defaultChecked={showRequestId}
                                  onClick={() =>
                                    this.handleShowColumn("requestId")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck4"
                                >
                                  {this.props.t("Request Type")}
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
                                  defaultChecked={showYearSemester}
                                  onClick={() =>
                                    this.handleShowColumn("yearSemester")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck3"
                                >
                                  {this.props.t("Request Semester")}
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
                                  defaultChecked={showActivationSemester}
                                  onClick={() =>
                                    this.handleShowColumn("activationSemester")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck3"
                                >
                                  {this.props.t("Activation Semester")}
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
                                  defaultChecked={showStateId}
                                  onClick={() =>
                                    this.handleShowColumn("stateId")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck6"
                                >
                                  {this.props.t("Request State")}
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
                                  defaultChecked={requestDate}
                                  onClick={() =>
                                    this.handleShowColumn("requestDate")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck5"
                                >
                                  {this.props.t("Request Date")}
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
                                  defaultChecked={showRequestOrganizer}
                                  onClick={() =>
                                    this.handleShowColumn("requestOrganizer")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck7"
                                >
                                  {this.props.t("Request Organizer")}
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
                                  defaultChecked={showRequestOrgNotes}
                                  onClick={() =>
                                    this.handleShowColumn("requestOrgNotes")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck8"
                                >
                                  {this.props.t("Requesting Notes")}
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
                                  defaultChecked={showDecreeDate}
                                  onClick={() =>
                                    this.handleShowColumn("decreeDate")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck9"
                                >
                                  {this.props.t("Decree Date")}
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
                                  defaultChecked={showDecreeOrganizer}
                                  onClick={() =>
                                    this.handleShowColumn("decreeOrganizer")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck10"
                                >
                                  {this.props.t("Decree Organizer")}
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
                                  defaultChecked={showDecreeOrgNotes}
                                  onClick={() =>
                                    this.handleShowColumn("decreeOrgNotes")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck11"
                                >
                                  {this.props.t("Decree Notes")}
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
                                  defaultChecked={showFoldingDate}
                                  onClick={() =>
                                    this.handleShowColumn("foldingDate")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck12"
                                >
                                  {this.props.t("Folding Date")}
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
                                  defaultChecked={showFoldingOrganizer}
                                  onClick={() =>
                                    this.handleShowColumn("foldingOrganizer")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck13"
                                >
                                  {this.props.t("Folding Organizer")}
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
                                  defaultChecked={showFoldingOrgNotes}
                                  onClick={() =>
                                    this.handleShowColumn("foldingOrgNotes")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck13"
                                >
                                  {this.props.t("Folding Notes")}
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
                                  defaultChecked={showStudentID}
                                  onClick={() =>
                                    this.handleShowColumn("studentId")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck1"
                                >
                                  {this.props.t("Student ID")}
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
                                  defaultChecked={showStudentName}
                                  onClick={() =>
                                    this.handleShowColumn("studentName")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck2"
                                >
                                  {this.props.t("Student Name")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}

                  <Col lg="auto" className="p-0">
                    <div className="collapse-course">
                      <i
                        onClick={this.toggleSidebar}
                        className="bx bx-menu"
                      ></i>
                    </div>
                  </Col>

                  <Col lg={sidebarOpen ? "" : ""}>
                    <Card>
                      <CardBody>
                        <div className="table-responsive">
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            keyField="Id"
                            columns={studentsRequestsColumns}
                            data={studentsRequests}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={studentsRequests}
                                columns={studentsRequestsColumns}
                                search
                              >
                                {toolkitprops => (
                                  <React.Fragment>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                      centered={true}
                                      size="xl"
                                      fullscreen
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t("Edit Warning")
                                          : this.props.t("Add Warning")}
                                      </ModalHeader>
                                      <ModalBody className="py-3 px-5">
                                        <Formik
                                          initialValues={
                                            (isEdit && {
                                              Id: warningId,
                                              SID: arWarning,
                                              enWarningStatus: enWarning,
                                              studentName:
                                                arTransStatementWarning,
                                              enTransStatement:
                                                enTransStatementWarning,
                                              priority: priorityWarning,
                                              warningColor: selectedColor,
                                              ruleType: selectedRuleType,
                                              stateId: selectedFromAdmSemes,
                                              academicStatus:
                                                selectedToAdmSemes,
                                              requestOrgNotes:
                                                selectedFromRegSemes,
                                              toRegSemesId: selectedToRegSemes,
                                              stdFromGPA: stdFromGPAWarning,
                                              stdTillGPA: stdTillGPAWarning,
                                              stdFromCredits:
                                                stdFromCreditsWarning,
                                              stdTillCredits:
                                                stdTillCreditsWarning,
                                              calculatedTransferCred:
                                                selectedCalculatedTransferCred,
                                              activeAdditionalPeriod:
                                                selectedActiveAdditionalPeriod,
                                              stdSemestersNb:
                                                stdSemestersNumber,
                                              prevFromGPA: prevFromGPAWarning,
                                              prevTillGPA: prevTillGPAWarning,
                                              prevFromCredits:
                                                prevFromCreditsWarning,
                                              prevTillCredits:
                                                prevTillCreditsWarning,
                                            }) ||
                                            (!isEdit && {
                                              SID: "",
                                              enWarningStatus: "",
                                              studentName: "",
                                              enTransStatement: "",
                                              priority: "",
                                              warningColor: "",
                                              ruleType: "",
                                              stateId: "",
                                              academicStatus: "",
                                              requestOrgNotes: "",
                                              toRegSemesId: "",
                                              stdFromGPA: "",
                                              stdTillGPA: "",
                                              calculatedTransferCred: "",
                                              activeAdditionalPeriod: "",
                                              stdSemestersNb: "",
                                              prevFromGPA: "",
                                              prevTillGPA: "",
                                            })
                                          }
                                          enableReinitialize={true}
                                          validationSchema={
                                            (!isEdit &&
                                              Yup.object().shape({
                                                SID: Yup.string()
                                                  .required(
                                                    "Warning Status(ar) is required"
                                                  )
                                                  .notOneOf(
                                                    studentsRequests.map(
                                                      user => user.warningStatus
                                                    ),
                                                    "warningStatus already taken"
                                                  ),
                                                enWarningStatus:
                                                  Yup.string().required(
                                                    "Warning Status is required"
                                                  ),
                                              })) ||
                                            (isEdit &&
                                              Yup.object().shape({
                                                SID: Yup.string().required(
                                                  "Warning Status(ar) is required"
                                                ),
                                                enWarningStatus:
                                                  Yup.string().required(
                                                    "Warning Status is required"
                                                  ),
                                              }))
                                          }
                                          onSubmit={(
                                            values,
                                            { setSubmitting }
                                          ) => {
                                            if (isEdit) {
                                              const updateFees = {
                                                Id: warningId,
                                                SID: values.SID,
                                                enWarningStatus:
                                                  values.enWarningStatus,
                                                studentName: values.studentName,
                                                enTransStatement:
                                                  values.enTransStatement,
                                                priority: values.priority,
                                                warningColor: selectedColor,
                                                ruleType: values.ruleType,
                                                stateId: selectedFromAdmSemes,
                                                academicStatus:
                                                  selectedToAdmSemes,
                                                requestOrgNotes:
                                                  selectedFromRegSemes,
                                                toRegSemesId:
                                                  selectedToRegSemes,
                                                stdFromGPA: values.stdFromGPA,
                                                stdTillGPA: values.stdTillGPA,
                                                stdFromCredits:
                                                  values.stdFromCredits,
                                                stdTillCredits:
                                                  values.stdTillCredits,
                                                calculatedTransferCred:
                                                  values.calculatedTransferCred,
                                                activeAdditionalPeriod:
                                                  values.activeAdditionalPeriod,
                                                stdSemestersNb:
                                                  values.stdSemestersNb,
                                                prevFromGPA: values.prevFromGPA,
                                                prevTillGPA: values.prevTillGPA,
                                                prevFromCredits:
                                                  values.prevFromCredits,
                                                prevTillCredits:
                                                  values.prevTillCredits,
                                              };
                                              this.handleUpdate(updateFees);
                                            } else {
                                              this.handleSave(values);
                                            }
                                            setSubmitting(false);
                                          }}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleSubmit,
                                            setFieldValue,
                                          }) => (
                                            <Form onSubmit={handleSubmit}>
                                              <Row>
                                                <Col className="col-6">
                                                  <Card>
                                                    <CardTitle id="add_header">
                                                      {this.props.t(
                                                        "Basic Information"
                                                      )}
                                                    </CardTitle>
                                                    <CardBody>
                                                      <Row>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Warning Status(ar)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="SID"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.SID &&
                                                                    touched.SID
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name="SID"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Transcript Statement(ar)"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="studentName"
                                                                  type="text"
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-4">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Priority"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="priority"
                                                                    id="applying-order"
                                                                    className={`form-control`}
                                                                    defaultValue={
                                                                      priorityWarning
                                                                    }
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    ?
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Rule Type"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <div className="d-flex flex-wrap gap-3">
                                                                  <div
                                                                    className="btn-group button-or"
                                                                    role="group"
                                                                  >
                                                                    <input
                                                                      type="radio"
                                                                      className={`btn-check button-or ${
                                                                        selectedRuleType ===
                                                                        "addWarning"
                                                                          ? "active"
                                                                          : ""
                                                                      }`}
                                                                      name="ruleType"
                                                                      id="btnradio4"
                                                                      autoComplete="off"
                                                                      defaultChecked={
                                                                        selectedRuleType ==
                                                                        "addWarning"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "ruleType",
                                                                          "addWarning"
                                                                        )
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio4"
                                                                    >
                                                                      {this.props.t(
                                                                        "Add Warning"
                                                                      )}
                                                                    </label>

                                                                    <input
                                                                      type="radio"
                                                                      className={`btn-check button-or ${
                                                                        selectedRuleType ===
                                                                        "removeWarning"
                                                                          ? "active"
                                                                          : ""
                                                                      }`}
                                                                      name="ruleType"
                                                                      id="btnradio6"
                                                                      autoComplete="off"
                                                                      defaultChecked={
                                                                        selectedRuleType ==
                                                                        "removeWarning"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "ruleType",
                                                                          "removeWarning"
                                                                        )
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio6"
                                                                    >
                                                                      {this.props.t(
                                                                        "Remove Warning"
                                                                      )}
                                                                    </label>
                                                                  </div>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Warning Color"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <div className="row justify-content-center">
                                                                  <input
                                                                    name="warningColor"
                                                                    className="form-control form-control-color mw-100"
                                                                    value={
                                                                      selectedColor
                                                                    }
                                                                    onChange={
                                                                      this
                                                                        .handleColorChange
                                                                    }
                                                                    onBlur={() =>
                                                                      this.handleInputBlur(
                                                                        "warningColor"
                                                                      )
                                                                    }
                                                                    type="color"
                                                                    id="example-color-input"
                                                                  />
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Warning Status(en)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="enWarningStatus"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.enWarningStatus &&
                                                                    touched.enWarningStatus
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name="enWarningStatus"
                                                                  component="div"
                                                                  className="invalid
                                                                       -feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Transcript Statement(en)"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="enTransStatement"
                                                                  type="text"
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Apply for Semesters"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Select
                                                                  value={
                                                                    applyForSemesterArray
                                                                  }
                                                                  name="applyForSemester"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "applyForSemester",
                                                                      selectedOption
                                                                    )
                                                                  }
                                                                  options={
                                                                    semesters
                                                                  }
                                                                  classNamePrefix="select2-selection"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Semester"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Select
                                                                  value={
                                                                    applyStatusArray
                                                                  }
                                                                  name="decreeOrgNotes"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "decreeOrgNotes",
                                                                      selectedOption
                                                                    )
                                                                  }
                                                                  options={
                                                                    studentStates
                                                                  }
                                                                  classNamePrefix="select2-selection"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </CardBody>
                                                  </Card>
                                                </Col> */}

                  {/* <Col className="col-6">
                                                  <Card>
                                                    <CardTitle id="add_header">
                                                      {this.props.t(
                                                        "Students Included"
                                                      )}
                                                    </CardTitle>
                                                    <CardBody>
                                                      <Row>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "From Adm. Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="stateId"
                                                                  id="year-semester"
                                                                  list="fromAdmSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "stateId"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "stateId"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "stateId"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedFromAdmSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedFromAdmSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="fromAdmSemesterdatalistOptions">
                                                                  {yearSemesters.map(
                                                                    yearSemester => (
                                                                      <option
                                                                        key={
                                                                          yearSemester.key
                                                                        }
                                                                        value={
                                                                          yearSemester.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "From Reg. Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="requestOrgNotes "
                                                                  id="year-semester"
                                                                  list="fromRegSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "requestOrgNotes "
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "requestOrgNotes "
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "requestOrgNotes "
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedFromRegSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedFromRegSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="fromRegSemesterdatalistOptions">
                                                                  {yearSemesters.map(
                                                                    yearSemester => (
                                                                      <option
                                                                        key={
                                                                          yearSemester.key
                                                                        }
                                                                        value={
                                                                          yearSemester.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "End AGPA"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="stdFromGPA"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    Pts
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="stdTillGPA"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    Pts
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Calculating the Transfer Credits"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="7">
                                                                <div className="d-flex flex-wrap gap-3">
                                                                  <div
                                                                    className="btn-group button-or"
                                                                    role="group"
                                                                  >
                                                                    <input
                                                                      type="radio"
                                                                      className="btn-check button-or"
                                                                      name="calculatedTransferCred"
                                                                      id="btnradio10"
                                                                      autoComplete="off"
                                                                      defaultChecked={
                                                                        selectedCalculatedTransferCred ==
                                                                        "yes"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "calculatedTransferCred",
                                                                          "yes"
                                                                        )
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio10"
                                                                    >
                                                                      {this.props.t(
                                                                        "Yes"
                                                                      )}
                                                                    </label>

                                                                    <input
                                                                      type="radio"
                                                                      className="btn-check button-or"
                                                                      name="calculatedTransferCred"
                                                                      id="btnradio11"
                                                                      autoComplete="off"
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "calculatedTransferCred",
                                                                          "no"
                                                                        )
                                                                      }
                                                                      defaultChecked={
                                                                        selectedCalculatedTransferCred ==
                                                                        "no"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio11"
                                                                    >
                                                                      {this.props.t(
                                                                        "No"
                                                                      )}
                                                                    </label>
                                                                  </div>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div>
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Student Semesters"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="4">
                                                                <Field
                                                                  type="number"
                                                                  name="stdSemestersNb"
                                                                  className={`form-control`}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "To Adm. Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="academicStatus"
                                                                  id="year-semester"
                                                                  list="toAdmSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "academicStatus"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "academicStatus"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "academicStatus"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedToAdmSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedToAdmSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="toAdmSemesterdatalistOptions">
                                                                  {yearSemesters.map(
                                                                    yearSemester => (
                                                                      <option
                                                                        key={
                                                                          yearSemester.key
                                                                        }
                                                                        value={
                                                                          yearSemester.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "To Reg. Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="toRegSemesId "
                                                                  id="year-semester"
                                                                  list="toRegSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "toRegSemesId "
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "toRegSemesId "
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "toRegSemesId "
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedToRegSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedToRegSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="toRegSemesterdatalistOptions">
                                                                  {yearSemesters.map(
                                                                    yearSemester => (
                                                                      <option
                                                                        key={
                                                                          yearSemester.key
                                                                        }
                                                                        value={
                                                                          yearSemester.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Passed Credits"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="stdFromCredits"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    CHs
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="stdTillCredits"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    CHs
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Active with Additional Period"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="7">
                                                                <div className="d-flex flex-wrap gap-3">
                                                                  <div
                                                                    className="btn-group button-or"
                                                                    role="group"
                                                                  >
                                                                    <input
                                                                      type="radio"
                                                                      className="btn-check button-or"
                                                                      name="activeAdditionalPeriod"
                                                                      id="btnradio12"
                                                                      autoComplete="off"
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "activeAdditionalPeriod",
                                                                          "yes"
                                                                        )
                                                                      }
                                                                      defaultChecked={
                                                                        selectedActiveAdditionalPeriod ==
                                                                        "yes"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio12"
                                                                    >
                                                                      {this.props.t(
                                                                        "Yes"
                                                                      )}
                                                                    </label>

                                                                    <input
                                                                      type="radio"
                                                                      className="btn-check button-or"
                                                                      name="activeAdditionalPeriod"
                                                                      id="btnradio13"
                                                                      autoComplete="off"
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "activeAdditionalPeriod",
                                                                          "no"
                                                                        )
                                                                      }
                                                                      defaultChecked={
                                                                        selectedActiveAdditionalPeriod ==
                                                                        "no"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio13"
                                                                    >
                                                                      {this.props.t(
                                                                        "No"
                                                                      )}
                                                                    </label>
                                                                  </div>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </CardBody>
                                                  </Card>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-center">
                                                    <Button
                                                      type="submit"
                                                      style={{
                                                        backgroundColor:
                                                          "#0086BF",
                                                        border: "#0086BF",
                                                      }}
                                                    >
                                                      {t("Save")}
                                                    </Button>
                                                  </div>
                                                </Col>
                                              </Row>

                                              <Row></Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>

                                    <Row>
                                      <Col sm="3">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                          {showSearchButton && (
                                            <div className="position-relative">
                                              <SearchBar
                                                {...toolkitprops.searchProps}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                      <Col>
                                        {showAddButton && (
                                          <div className="text-sm-end">
                                            <Tooltip
                                              title={this.props.t("Add")}
                                              placement="top"
                                            >
                                              <IconButton
                                                color="primary"
                                                onClick={this.handleAddWarning}
                                              >
                                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                                              </IconButton>
                                            </Tooltip>
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                    <Row>
                                      <div>
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
                                              onClick={
                                                this.handleDeletedErrorClose
                                              }
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
                                              onClick={
                                                this.handleDeletedSuccessClose
                                              }
                                            ></button>
                                          </Alert>
                                        )}
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
                                              onClick={this.handleErrorClose}
                                            ></button>
                                          </Alert>
                                        )}
                                      </div>
                                    </Row>
                                    <BootstrapTable
                                      keyField="Id"
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      data={studentsRequests}
                                      columns={studentsRequestsColumns}
                                      cellEdit={cellEditFactory({
                                        mode: "click",
                                        blurToSave: true,
                                        afterSaveCell: (
                                          oldValue,
                                          newValue,
                                          row,
                                          column
                                        ) => {
                                          this.handleStdWarningTestDataChange(
                                            row.Id,
                                            column.dataField,
                                            newValue
                                          );
                                        },
                                      })}
                                      noDataIndication={t(
                                        "No Warning Rules Definition found"
                                      )}
                                      defaultSorted={defaultSorting}
                                      filter={filterFactory()}
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
                  </Col>*/}
                </Row>
              </CardBody>
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  studentsRequests,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  semesters,
  menu_items,
}) => ({
  studentsRequests: studentsRequests.studentsRequests,
  deleted: studentsRequests.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  yearSemesters: generalManagements.yearSemesters,
  semesters: semesters.semesters,
  currentSemester: semesters.currentSemester,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  // onGetStudentsRequests: regReqDocs =>
  //   dispatch(getStudentsRequests(regReqDocs)),
  // onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TraineesList));
