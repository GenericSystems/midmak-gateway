import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardHeader,
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
import filterFactory, { textFilter,  customFilter } from "react-bootstrap-table2-filter";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";

import {
  getWarningRules,
  addNewWarningRule,
  updateWarningRule,
  deleteWarningRule,
  getWarningRuleDeletedValue
} from "store/warningRules/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import OtherChart from "pages/generate-SIDs/OtherChart";

import { getCurrentSemester } from "store/semesters/actions";
import { BackburgerIcon } from "@icons/material";
import { checkIsAddForPage, checkIsDeleteForPage,   checkIsEditForPage,
  checkIsSearchForPage, } from "../../utils/menuUtils";
class WarningRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedView: "",
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      showAppearIn: true,
      showWarningStatus: true,
      showFromSemester: true,
      showToSemester: false,
      showFromRegSemester: true,
      showGPA: true,
      showCredits: true,
      showPreviousWarning: false,
      showOldStatus: false,
      showApplyStatus: false,
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
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }
  componentDidMount() {
    const {
      warningRules,
      studentStates,
      warningRulesOpt,
      currencies,
      yearSemesters,
      currentSemester,
      semesters,
      faculties,
      onGetWarningRules,
      deleted,
      user_menu
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (warningRules && !warningRules.length) {
      onGetWarningRules();

      this.setState({ warningRules, warningRulesOpt });
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
      this.updateShowEditButton(
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

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
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

  handleSelectOption = (fieldName, selectedValue) => {
    const { onGetWarningRules, faculties } = this.props;
    const {
      selectedCurrency,
      selectedFaculty,
      selectedSemester,
      defaultSemester,
    } = this.state;
    if (fieldName == "currencyId") {
      this.setState({
        selectedCurrency: selectedValue,
      });
      let obj = {
        currencyId: selectedValue,
        facultyId: selectedFaculty,
        yearSemesterId: defaultSemester["value"],
      };
      onGetWarningRules(obj);
    }

    if (fieldName == "semesterId") {
      this.setState({
        defaultSemester: selectedValue,
      });
      let obj = {
        currencyId: selectedCurrency,
        facultyId: selectedFaculty,
        yearSemesterId: selectedValue["value"],
      };
      onGetWarningRules(obj);
    }

    if (fieldName == "facultyId") {
      const facultyObj = faculties.find(
        faculty => faculty.value === selectedValue
      );
      if (facultyObj) {
        this.setState({
          selectedFaculty: facultyObj.key,
        });
        let obj = {
          currencyId: selectedCurrency,
          facultyId: facultyObj.key,
          yearSemesterId: defaultSemester["value"],
        };
        onGetWarningRules(obj);
      } else if (!facultyObj) {
        this.setState({
          selectedFaculty: null,
        });
        let obj = {
          currencyId: selectedCurrency,
          facultyId: null,
          yearSemesterId: defaultSemester["value"],
        };
        onGetWarningRules(obj);
      }
    }
  };

  handleWarningRuleDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateWarningRule, warningRules } = this.props;

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
        onUpdateWarningRule(onUpdate);
      }
    }

    if (fieldName == "amount") {
      const onUpdate = { Id: rowId, [fieldName]: fieldValue };
      this.setState({ errorMessage: null });
      onUpdateWarningRule(onUpdate);
    }

    if (fieldName == "fromdate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateWarningRule(onUpdate);
    }

    if (fieldName == "toDate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateWarningRule(onUpdate);
    }
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
    const { onDeleteWarningRule } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteWarningRule({Id : selectedRowId.Id});

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
    if (fieldName == "warningStatus") {
      this.setState(prevState => ({
        showWarningStatus: !prevState.showWarningStatus,
      }));
    }

    if (fieldName == "arTransStatement") {
      this.setState(prevState => ({
        showAppearIn: !prevState.showAppearIn,
      }));
    }

    if (fieldName == "fromSemester") {
      this.setState(prevState => ({
        showFromSemester: !prevState.showFromSemester,
      }));
    }

    if (fieldName == "toSemester") {
      this.setState(prevState => ({
        showToSemester: !prevState.showToSemester,
      }));
    }

    if (fieldName == "fromRegSemester") {
      this.setState(prevState => ({
        showFromRegSemester: !prevState.showFromRegSemester,
      }));
    }

    if (fieldName == "toRegSemester") {
      this.setState(prevState => ({
        showToRegSemester: !prevState.showToRegSemester,
      }));
    }

    if (fieldName == "GPA") {
      this.setState(prevState => ({
        showGPA: !prevState.showGPA,
      }));
    }

    if (fieldName == "credits") {
      this.setState(prevState => ({
        showCredits: !prevState.showCredits,
      }));
    }

    if (fieldName == "previousWarning") {
      this.setState(prevState => ({
        showPreviousWarning: !prevState.showPreviousWarning,
      }));
    }

    if (fieldName == "oldStatus") {
      this.setState(prevState => ({
        showOldStatus: !prevState.showOldStatus,
      }));
    }

    if (fieldName == "applyStatus") {
      this.setState(prevState => ({
        showApplyStatus: !prevState.showApplyStatus,
      }));
    }

  }; handleShowColumn = fieldName => {
    if (fieldName == "warningStatus") {
      this.setState(prevState => ({
        showWarningStatus: !prevState.showWarningStatus,
      }));
    }

    if (fieldName == "arTransStatement") {
      this.setState(prevState => ({
        showAppearIn: !prevState.showAppearIn,
      }));
    }

    if (fieldName == "fromSemester") {
      this.setState(prevState => ({
        showFromSemester: !prevState.showFromSemester,
      }));
    }

    if (fieldName == "toSemester") {
      this.setState(prevState => ({
        showToSemester: !prevState.showToSemester,
      }));
    }

    if (fieldName == "fromRegSemester") {
      this.setState(prevState => ({
        showFromRegSemester: !prevState.showFromRegSemester,
      }));
    }

    if (fieldName == "toRegSemester") {
      this.setState(prevState => ({
        showToRegSemester: !prevState.showToRegSemester,
      }));
    }

    if (fieldName == "GPA") {
      this.setState(prevState => ({
        showGPA: !prevState.showGPA,
      }));
    }

    if (fieldName == "credits") {
      this.setState(prevState => ({
        showCredits: !prevState.showCredits,
      }));
    }

    if (fieldName == "previousWarning") {
      this.setState(prevState => ({
        showPreviousWarning: !prevState.showPreviousWarning,
      }));
    }

    if (fieldName == "oldStatus") {
      this.setState(prevState => ({
        showOldStatus: !prevState.showOldStatus,
      }));
    }

    if (fieldName == "applyStatus") {
      this.setState(prevState => ({
        showApplyStatus: !prevState.showApplyStatus,
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
      applyStatusArray : [],
      prevAcademicWarningArray : [],
      prevStatusSemesArray : [],

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

    if (fieldName === "prevStatusSemes") {
      this.setState({ prevStatusSemesArray: selectedMulti });
    }

    if (fieldName === "prevAcademicWarning") {
      this.setState({ prevAcademicWarningArray: selectedMulti });
    }

    if (fieldName === "applyStatus") {
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

    if (fieldName == "fromAdmSemesId") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "toAdmSemesId") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "fromRegSemesId ") {
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

    if (fieldName == "fromAdmSemesId") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "toAdmSemesId") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "fromRegSemesId ") {
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

    if (fieldName == "fromAdmSemesId") {
      this.setState({ selectedFromAdmSemes: selectedValue });
    }

    if (fieldName == "toAdmSemesId") {
      this.setState({ selectedToAdmSemes: selectedValue });
    }

    if (fieldName == "fromRegSemesId ") {
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
    const { onAddNewWarningRule, yearSemesters } = this.props;
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
      arWarningStatus: values["arWarningStatus"],
      enWarningStatus: values["enWarningStatus"],
      arTransStatement: values["arTransStatement"],
      enTransStatement: values["enTransStatement"],
      priority: values["priority"],
      warningColor: selectedColor,
      ruleType: selectedRuleType,
      fromAdmSemesId:fromAdmSemesterObj? fromAdmSemesterObj.key: null,
      toAdmSemesId:toAdmSemesterObj? toAdmSemesterObj.key: null,
      fromRegSemesId:fromRegSemesterObj? fromRegSemesterObj.key: null,
      toRegSemesId: toRegSemesterObj? toRegSemesterObj.key: null,
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
      applyStatus: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      prevStatusSemes: prevStatusSemesArray,
      prevAcademicWarning: prevAcademicWarningArray,
    }; 



   onAddNewWarningRule(obj);
    this.toggle()
  };

  handleEditWarningRule = arg => {
    const warningRule = arg;

    this.setState({
      warningId: warningRule.Id,
      arWarning: warningRule.arWarningStatus,
      enWarning: warningRule.enWarningStatus,
      arTransStatementWarning: warningRule.arTransStatement,
      enTransStatementWarning: warningRule.enTransStatement,
      priorityWarning: warningRule.priority,
      selectedColor: warningRule.warningColor,
      selectedRuleType: warningRule.ruleType,
      selectedFromAdmSemesId: warningRule.fromAdmSemesId,
      selectedToAdmSemesId: warningRule.toAdmSemesId,
      selectedFromRegSemesId: warningRule.fromRegSemesId,
      selectedToRegSemesId: warningRule.toRegSemesId,
      stdFromGPAWarning: warningRule.stdFromGPA,
      stdTillGPAWarning: warningRule.stdTillGPA,
      stdFromCreditsWarning: warningRule.stdFromCredits,
      stdTillCreditsWarning: warningRule.stdTillCredits,
      selectedCalculatedTransferCred:
        warningRule.calculatedTransferCred == 1 ? "yes" : "no",
      selectedActiveAdditionalPeriod:
        warningRule.activeAdditionalPeriod == 1 ? "yes" : "no",
      stdSemestersNumber: warningRule.stdSemestersNb,
      prevFromGPAWarning: warningRule.prevFromGPA,
      prevTillGPAWarning: warningRule.prevTillGPA,
      prevFromCreditsWarning: warningRule.prevFromCredits,
      prevTillCreditsWarning: warningRule.prevTillCredits,
      applyForSemesterArray: warningRule.applyForSemester,
      applyStatusArray: warningRule.applyStatus,
      prevAcademicWarningArray: warningRule.prevAcademicWarning,
      prevStatusSemesArray: warningRule.prevStatusSemes,
      isEdit: true,
    });

    this.toggle();
    const { fiscalYears, yearSemesters, onGetFeesConditions, currencies } =
      this.props;
    let obj = { Id: warningRule.Id };

    if (warningRule.fromAdmSemesId) {
      const fromAdmSemes = yearSemesters.find(
        yearSemester => yearSemester.key === warningRule.fromAdmSemesId
      );
      this.setState({
        selectedFromAdmSemes: fromAdmSemes.value,
      });
    }

    if (warningRule.toAdmSemesId) {
      const toAdmSemes = yearSemesters.find(
        yearSemester => yearSemester.key === warningRule.toAdmSemesId
      );
      this.setState({
        selectedToAdmSemes: toAdmSemes.value,
      });
    }

    if (warningRule.fromRegSemesId) {
      const fromRegSemes = yearSemesters.find(
        yearSemester => yearSemester.key === warningRule.fromRegSemesId
      );
      this.setState({
        selectedFromRegSemes: fromRegSemes.value,
      });
    }

    if (warningRule.toRegSemesId) {
      const toRegSemes = yearSemesters.find(
        yearSemester => yearSemester.key === warningRule.toRegSemesId
      );
      this.setState({
        selectedToRegSemes: toRegSemes.value,
      });
    }
  };

  handleUpdate = values => {
    const { onUpdateWarningRule, yearSemesters } = this.props;
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
      arWarningStatus: values["arWarningStatus"],
      enWarningStatus: values["enWarningStatus"],
      arTransStatement: values["arTransStatement"],
      enTransStatement: values["enTransStatement"],
      priority: values["priority"],
      warningColor: selectedColor,
      ruleType: values["ruleType"],
      fromAdmSemesId:fromAdmSemesterObj? fromAdmSemesterObj.key: null,
      toAdmSemesId:toAdmSemesterObj? toAdmSemesterObj.key: null,
      fromRegSemesId:fromRegSemesterObj? fromRegSemesterObj.key: null,
      toRegSemesId: toRegSemesterObj? toRegSemesterObj.key: null,
      stdFromGPA: values["stdFromGPA"],
      stdTillGPA: values["stdTillGPA"],
      stdFromCredits: values["stdFromCredits"],
      stdTillCredits: values["stdTillCredits"],
      calculatedTransferCred:
         values["calculatedTransferCred"] == "yes"
          ? 1
          :  values["calculatedTransferCred"] == "no"
          ? 0
          :  values["calculatedTransferCred"],
      activeAdditionalPeriod:
          values["activeAdditionalPeriod"] == "yes"
          ? 1
          :   values["activeAdditionalPeriod"] == "no"
          ? 0
          :   values["activeAdditionalPeriod"],
      stdSemestersNb: values["stdSemestersNb"],
      prevFromGPA: values["prevFromGPA"],
      prevTillGPA: values["prevTillGPA"],
      prevFromCredits: values["prevFromCredits"],
      prevTillCredits: values["prevTillCredits"],
      applyStatus: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      prevStatusSemes: prevStatusSemesArray,
      prevAcademicWarning: prevAcademicWarningArray,
    };

    onUpdateWarningRule(obj);
    this.toggle();
  };

  handleDeletedSuccessClose = () => {
    const { onGetWarningRuleDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetWarningRuleDeletedValue();
  };

  handleDeletedErrorClose = () => {
    const { onGetWarningRuleDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetWarningRuleDeletedValue();
  };

  handlePriorityChange = (event) => {
    const priorityValue = event.target.value;
    this.setState({ priorityWarning: priorityValue });
  };

  render() {
    const {
      warningRules,
      warningRulesOpt,
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
      showWarningStatus,
      showAppearIn,
      showFromSemester,
      showToSemester,
      showFromRegSemester,
      showGPA,
      showToRegSemester,
      showCredits,
      showPreviousWarning,
      showOldStatus,
      showApplyStatus,
      modal,
      warningRule,
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
      showEditButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;

    let filteredOptions = warningRulesOpt.filter(
      option => option.value !== warningId
    );



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

    const warningRulesColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },

      {
        dataField: "arWarningStatus",
        text: this.props.t("Warning Status"),
        sort: true,
        editable: false,
        hidden: !showWarningStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "arTransStatement",
        text: this.props.t("Appear in"),
        sort: true,
        editable: false,
        hidden: !showAppearIn,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "fromAdmSemesId",

        text: this.props.t("From Semester"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <div>
            <Input
              type="text"
              name="fromAdmSemesId"
              id="year-semester"
              list="fromAdmSemesterdatalistOptions"
              placeholder="Type to search..."
              className={"form-control"}
              defaultValue={
                (
                  yearSemesters.find(
                    yearSemester => yearSemester.key === row.fromAdmSemesId
                  ) || ""
                ).value
              }
              disabled
            />
            <datalist id="fromAdmSemesterdatalistOptions">
              {yearSemesters.map(yearSemester => (
                <option key={yearSemester.key} value={yearSemester.value} />
              ))}
            </datalist>
          </div>
        ),
        hidden: !showFromSemester,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "toAdmSemesId",

        text: this.props.t("To Semester"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <div>
            <Input
              type="text"
              name="toAdmSemesId"
              id="year-semester"
              list="toAdmSemesterdatalistOptions"
              placeholder="Type to search..."
              className={"form-control"}
              defaultValue={
                (
                  yearSemesters.find(
                    yearSemester => yearSemester.key === row.toAdmSemesId
                  ) || ""
                ).value
              }
              disabled
            />
            <datalist id="toAdmSemesterdatalistOptions">
              {yearSemesters.map(yearSemester => (
                <option key={yearSemester.key} value={yearSemester.value} />
              ))}
            </datalist>
          </div>
        ),
        hidden: !showToSemester,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "fromRegSemester",

        text: this.props.t("From Reg Semester"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <div>
            <Input
              type="text"
              name="fromRegSemesId"
              id="year-semester"
              list="fromRegSemesterdatalistOptions"
              placeholder="Type to search..."
              className={"form-control"}
              defaultValue={
                (
                  yearSemesters.find(
                    yearSemester => yearSemester.key === row.fromRegSemesId
                  ) || ""
                ).value
              }
              disabled
            />
            <datalist id="fromRegSemesterdatalistOptions">
              {yearSemesters.map(yearSemester => (
                <option key={yearSemester.key} value={yearSemester.value} />
              ))}
            </datalist>
          </div>
        ),
        hidden: !showFromRegSemester,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "GPA",
        text: this.props.t("Cumulative Average"),
        sort: true,
        editable: false,
        hidden: !showGPA,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },

      {
        dataField: "credits",
        text: this.props.t("Completed Hours"),
        sort: true,
        editable: false,
        hidden: !showCredits,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "prevAcademicWarning",
        text: this.props.t("Previous Warning"),
        sort: true,
        formatter: (cell, row) => (
          cell && Array.isArray(cell) ? cell.map(option => option.label).join(" , ") : ""
        ),
        editable: false,
        hidden: !showPreviousWarning,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
        
      },
      {
        dataField: "prevStatusSemes",
        text: this.props.t("Old Status"),
        sort: true,
        formatter: (cell, row) => (
          cell && Array.isArray(cell) ? cell.map(option => option.label).join(" , ") : ""
        ),
        editable: false,
        hidden: !showOldStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
       
      },
      {
        dataField: "applyStatus",
        text: this.props.t("Apply Status"),
        formatter: (cell, row) => (
          cell && Array.isArray(cell) ? cell.map(option => option.label).join(" , ") : ""
        ),
        editable: false,
        hidden: !showApplyStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      
      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, warning) => (
          <div className="d-flex justify-content-center gap-3">
           { showEditButton &&(
            <Tooltip title={this.props.t("Edit")} placement="top">
              
              <IconButton onClick={() => this.handleEditWarningRule(warning)} >
               <i
              className="mdi mdi-pencil font-size-18 text-secondary"
              id="deletetooltip"
            ></i>
              </IconButton>
            </Tooltip>)}
{showDeleteButton &&(
            <Tooltip title={this.props.t("Delete")} placement="top">
              <IconButton color="danger"  onClick={() => this.onClickDelete(warning)} >
              <i
                className="mdi mdi-delete font-size-18 text-danger"
                id="deletetooltip"
               
              ></i>
              </IconButton>
            </Tooltip>)}
          </div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: warningRules.length,
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
            <Breadcrumbs
              title={t("Academic Warning Rules")}
              breadcrumbItem={t("Academic Warning Rules List")}
            />

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
                  {sidebarOpen && (
                    <div style={{ width: sidebarOpen ? "14%" : "0" }}>
                      <Card>
                        <CardTitle id="warning_rules_header">
                          {t("Required Data")}
                        </CardTitle>
                        <CardBody>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck1"
                                  autoComplete="off"
                                  defaultChecked={showWarningStatus}
                                  onClick={() =>
                                    this.handleShowColumn("warningStatus")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck1"
                                >
                                  {this.props.t("Warning Status")}
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
                                  defaultChecked={showAppearIn}
                                  onClick={() =>
                                    this.handleShowColumn("arTransStatement")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck2"
                                >
                                  {this.props.t("Appear in")}
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
                                  defaultChecked={showFromSemester}
                                  onClick={() =>
                                    this.handleShowColumn("fromSemester")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck3"
                                >
                                  {this.props.t("From Semester")}
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
                                  defaultChecked={showToSemester}
                                  onClick={() =>
                                    this.handleShowColumn("toSemester")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck4"
                                >
                                  {this.props.t("To Semester")}
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
                                  defaultChecked={showFromRegSemester}
                                  onClick={() =>
                                    this.handleShowColumn("fromRegSemester")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck5"
                                >
                                  {this.props.t("From Reg Semester")}
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
                                  defaultChecked={showGPA}
                                  onClick={() =>
                                    this.handleShowColumn("GPA")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck6"
                                >
                                  {this.props.t("Cumulative Average")}
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
                                  defaultChecked={showCredits}
                                  onClick={() =>
                                    this.handleShowColumn("credits")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck7"
                                >
                                  {this.props.t("Completed Hours")}
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
                                  defaultChecked={showPreviousWarning}
                                  onClick={() =>
                                    this.handleShowColumn("previousWarning")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck8"
                                >
                                  {this.props.t("Previous Warning")}
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
                                  defaultChecked={showOldStatus}
                                  onClick={() =>
                                    this.handleShowColumn("oldStatus")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck9"
                                >
                                  {this.props.t("Old Status")}
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
                                  defaultChecked={showApplyStatus}
                                  onClick={() =>
                                    this.handleShowColumn("applyStatus")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck10"
                                >
                                  {this.props.t("Apply Status")}
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
                            columns={warningRulesColumns}
                            data={warningRules}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={warningRules}
                                columns={warningRulesColumns}
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
                                              arWarningStatus: arWarning,
                                              enWarningStatus: enWarning,
                                              arTransStatement:
                                                arTransStatementWarning,
                                              enTransStatement:
                                                enTransStatementWarning,
                                              priority: priorityWarning,
                                              warningColor: selectedColor,
                                              ruleType: selectedRuleType,
                                              fromAdmSemesId:
                                                selectedFromAdmSemes,
                                              toAdmSemesId: selectedToAdmSemes,
                                              fromRegSemesId:
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
                                              arWarningStatus: "",
                                              enWarningStatus: "",
                                              arTransStatement: "",
                                              enTransStatement: "",
                                              priority: "",
                                              warningColor: "",
                                              ruleType: "",
                                              fromAdmSemesId: "",
                                              toAdmSemesId: "",
                                              fromRegSemesId: "",
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
                                                arWarningStatus: Yup.string()
                                                  .required(
                                                    "Warning Status(ar) is required"
                                                  )
                                                  .notOneOf(
                                                    warningRules.map(
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
                                                arWarningStatus:
                                                  Yup.string().required(
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
                                                arWarningStatus:
                                                  values.arWarningStatus,
                                                enWarningStatus:
                                                  values.enWarningStatus,
                                                arTransStatement:
                                                  values.arTransStatement,
                                                enTransStatement:
                                                  values.enTransStatement,
                                                priority: values.priority,
                                                warningColor: selectedColor,
                                                ruleType: values.ruleType,
                                                fromAdmSemesId:
                                                  selectedFromAdmSemes,
                                                toAdmSemesId:
                                                  selectedToAdmSemes,
                                                fromRegSemesId:
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
                                                                  name="arWarningStatus"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.arWarningStatus &&
                                                                    touched.arWarningStatus
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name="arWarningStatus"
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
                                                                  name="arTransStatement"
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
                                                                      onChange={() => setFieldValue('ruleType', 'addWarning')}
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
                                                                      onChange={() => setFieldValue('ruleType', 'removeWarning')}
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
                                                                  {this.props.t("Warning Status(en)")}
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
                                                                    "Apply Status"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Select
                                                                  value={
                                                                    applyStatusArray
                                                                  }
                                                                  name="applyStatus"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "applyStatus",
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

                                                  <Card>
                                                    <CardTitle id="add_header">
                                                      {this.props.t(
                                                        "Prev. Status"
                                                      )}
                                                    </CardTitle>
                                                    <CardBody>
                                                      <Row>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Prev. Academic Warn"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="7">
                                                                <Select
                                                                  value={
                                                                    prevAcademicWarningArray
                                                                  }
                                                                  name="prevAcademicWarning"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "prevAcademicWarning",
                                                                      selectedOption
                                                                    )
                                                                  }
                                                                  options={
                                                                    filteredOptions
                                                                  }
                                                                  classNamePrefix="select2-selection"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div>
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Prev. Status Semester"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="7">
                                                                <Select
                                                                  value={
                                                                    prevStatusSemesArray
                                                                  }
                                                                  name="prevStatusSemes"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "prevStatusSemes",
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
                                                        </Col>
                                                        <Col lg="6">
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
                                                                    name="prevFromGPA"
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
                                                                    name="prevTillGPA"
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
                                                                    name="prevFromCredits"
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
                                                                    name="prevTillCredits"
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
                                                        </Col>
                                                      </Row>
                                                    </CardBody>
                                                  </Card>
                                                </Col>

                                                <Col className="col-6">
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
                                                                  name="fromAdmSemesId"
                                                                  id="year-semester"
                                                                  list="fromAdmSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "fromAdmSemesId"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "fromAdmSemesId"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "fromAdmSemesId"
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
                                                                  name="fromRegSemesId "
                                                                  id="year-semester"
                                                                  list="fromRegSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "fromRegSemesId "
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "fromRegSemesId "
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "fromRegSemesId "
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
                                                                     onChange={() => setFieldValue('calculatedTransferCred', 'yes')}
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
                                                                      onChange={() => setFieldValue('calculatedTransferCred', 'no')}
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
                                                                  name="toAdmSemesId"
                                                                  id="year-semester"
                                                                  list="toAdmSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "toAdmSemesId"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "toAdmSemesId"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "toAdmSemesId"
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
                                                                      onChange={() => setFieldValue('activeAdditionalPeriod', 'yes')}
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
                                                                      onChange={() => setFieldValue('activeAdditionalPeriod', 'no')}
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
                                                      style={{backgroundColor: "#0086BF", border: "#0086BF"}}
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
                                          </div>)}
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
                                        </div>)}
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
                                        onClick={this.handleDeletedErrorClose}
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
                                        onClick={this.handleDeletedSuccessClose}
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
                                      data={warningRules}
                                      columns={warningRulesColumns}
                                      cellEdit={cellEditFactory({
                                        mode: "click",
                                        blurToSave: true,
                                        afterSaveCell: (
                                          oldValue,
                                          newValue,
                                          row,
                                          column
                                        ) => {
                                          this.handleWarningRuleDataChange(
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
                  </Col>
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
  warningRules,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  semesters,
  menu_items
}) => ({
  warningRules: warningRules.warningRules,
  warningRulesOpt: warningRules.warningRulesOpt,
  studentStates: warningRules.studentStates,
  deleted: warningRules.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  yearSemesters: generalManagements.yearSemesters,
  semesters: semesters.semesters,
  currentSemester: semesters.currentSemester,
  user_menu: menu_items.user_menu || [],

});

const mapDispatchToProps = dispatch => ({
  onGetWarningRules: warningRules => dispatch(getWarningRules(warningRules)),
  onAddNewWarningRule: warningRule => dispatch(addNewWarningRule(warningRule)),
  onUpdateWarningRule: warningRule => dispatch(updateWarningRule(warningRule)),
  onDeleteWarningRule: warningRule => dispatch(deleteWarningRule(warningRule)),
  onGetWarningRuleDeletedValue: () => dispatch(getWarningRuleDeletedValue()),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(WarningRules));
