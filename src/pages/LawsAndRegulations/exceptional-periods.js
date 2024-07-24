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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";

import {
  getExceptionalPeriods,
  addNewExceptionalPeriod,
  updateExceptionalPeriod,
  deleteExceptionalPeriod,
  getExceptionalPeriodDeletedValue,
} from "store/exceptionalPeriods/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import OtherChart from "pages/generate-SIDs/OtherChart";

import { getCurrentSemester } from "store/semesters/actions";
import { BackburgerIcon } from "@icons/material";
import { checkIsAddForPage, checkIsDeleteForPage,  checkIsEditForPage,
  checkIsSearchForPage, } from "../../utils/menuUtils";

class ExceptionalPeriods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedView: "",
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      modal: false,
      selectedMulti: null,
      selectedFromSemes: "",
      selectedToSemes: "",
      selectedAcceptedFromSemes: "",
      selectedAcceptedToSemes: "",
      selectedDate: "#556ee6",
      stdStatusArray: [],
      notIncludedPeriodsArray: [],
      warningsArray: [],
      requestsArray: [],
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
      exceptionalPeriods,
      exceptionalPeriodsOpt,
      warningRules,
      currencies,
      yearSemesters,
      currentSemester,
      studentStates,
      faculties,
      requests,
      onGetExceptionalPeriods,
      deleted,
      user_menu
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    if (exceptionalPeriods && !exceptionalPeriods.length) {
      onGetExceptionalPeriods();

      this.setState({ exceptionalPeriods, exceptionalPeriodsOpt });
      this.setState({ currencies });
      this.setState({ faculties });
      this.setState({ yearSemesters });
      this.setState({ currentSemester, studentStates, warningRules,requests });
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

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };


  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
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
    const { onGetExceptionalPeriods, faculties } = this.props;
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
      onGetExceptionalPeriods(obj);
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
      onGetExceptionalPeriods(obj);
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
        onGetExceptionalPeriods(obj);
      } else if (!facultyObj) {
        this.setState({
          selectedFaculty: null,
        });
        let obj = {
          currencyId: selectedCurrency,
          facultyId: null,
          yearSemesterId: defaultSemester["value"],
        };
        onGetExceptionalPeriods(obj);
      }
    }
  };

  handleExceptionalPeriodDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateExceptionalPeriod, exceptionalPeriods } = this.props;

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
        onUpdateExceptionalPeriod(onUpdate);
      }
    }

    if (fieldName == "amount") {
      const onUpdate = { Id: rowId, [fieldName]: fieldValue };
      this.setState({ errorMessage: null });
      onUpdateExceptionalPeriod(onUpdate);
    }

    if (fieldName == "fromdate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateExceptionalPeriod(onUpdate);
    }

    if (fieldName == "toDate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateExceptionalPeriod(onUpdate);
    }
  };

  handleSelectFine = (rowId, fieldName, selectedValue) => {
    const { onUpdateExceptionalPeriod } = this.props;
    const { exceptionalPeriods } = this.state;

    this.setState({
      selectedFine: selectedValue,
    });

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateExceptionalPeriod(onUpdate);
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
    const { onDeleteExceptionalPeriod } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteExceptionalPeriod({ Id: selectedRowId.Id });

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

  handleAddWarning = () => {
    this.setState({
      exceptionalPeriodId: "",
      arExtraordinary: "",
      enExtraordinary: "",
      decisionNumber: "",
      selectedDate: "",
      selectedFromSemes: "",
      selectedToSemes: "",
      selectedAcceptedFromSemes: "",
      selectedAcceptedToSemes: "",
      selectedStateFromSemes: "",
      selectedStateToSemes: "",
      stdStatusArray: [],
      notIncludedPeriodsArray: [],
      warningsArray: [],
      requestsArray: [],

      isEdit: false,
    });
    this.toggle();
  };

  handleMulti = (fieldName, selectedMulti) => {
    if (fieldName === "applyForSemester") {
      this.setState({ applyForSemesterArray: selectedMulti });
    }

    if (fieldName === "ExceptionalPeriodsStudentState") {
      this.setState({ stdStatusArray: selectedMulti });
    }

    if (fieldName === "ExceptionalPeriodsNotInclude") {
      this.setState({ notIncludedPeriodsArray: selectedMulti });
    }

    if (fieldName === "ExceptionalPeriodsWarnings") {
      this.setState({ warningsArray: selectedMulti });
    }

    if (fieldName === "AllowedRequests") {
      this.setState({ requestsArray: selectedMulti });
    }
  };

  handleInputBlur = fieldName => {
    const {
      selectedFromSemes,
      selectedToSemes,
      selectedAcceptedFromSemes,
      selectedacceptedToSemes,
      selectedStateFromSemes,
      selectedStateToSemes,
    } = this.state;

    if (fieldName == "fromSemesId") {
      this.setState({ selectedFromSemes });
    }

    if (fieldName == "toSemesId") {
      this.setState({ selectedToSemes });
    }

    if (fieldName == "acceptedFromSemesId") {
      this.setState({ selectedAcceptedFromSemes });
    }

    if (fieldName == "acceptedToSemesId") {
      this.setState({ selectedacceptedToSemes });
    }

    if (fieldName == "stateFromSemesId") {
      this.setState({ selectedStateFromSemes });
    }

    if (fieldName == "stateToSemesId") {
      this.setState({ selectedStateToSemes });
    }

  
  };

  handleInputFocus = fieldName => {
    const {
      selectedFromSemes,
      selectedToSemes,
      selectedAcceptedFromSemes,
      selectedacceptedToSemes,
      selectedStateFromSemes,
      selectedStateToSemes,
    } = this.state;

    if (fieldName == "fromSemesId") {
      this.setState({ selectedFromSemes });
    }

    if (fieldName == "toSemesId") {
      this.setState({ selectedToSemes });
    }

    if (fieldName == "acceptedFromSemesId") {
      this.setState({ selectedAcceptedFromSemes });
    }

    if (fieldName == "acceptedToSemesId") {
      this.setState({ selectedacceptedToSemes });
    }

    if (fieldName == "stateFromSemesId") {
      this.setState({ selectedStateFromSemes });
    }

    if (fieldName == "stateToSemesId") {
      this.setState({ selectedStateToSemes });
    }

  };

  handleDataListChange = (event, fieldName) => {
    const selectedValue = event.target.value;

    if (fieldName == "fromSemesId") {
      this.setState({ selectedFromSemes: selectedValue });
    }

    if (fieldName == "toSemesId") {
      this.setState({ selectedToSemes: selectedValue });
    }

    if (fieldName == "acceptedFromSemesId") {
      this.setState({ selectedAcceptedFromSemes: selectedValue });
    }

    if (fieldName == "acceptedToSemesId") {
      this.setState({ selectedAcceptedToSemes: selectedValue });
    }

    if (fieldName == "stateFromSemesId") {
      this.setState({ selectedStateFromSemes: selectedValue });
    }

    if (fieldName == "stateToSemesId") {
      this.setState({ selectedStateToSemes: selectedValue });
    }

  };

  handleColorChange(event) {
    const selectedValue = event.target.value;
    this.setState({ selectedDate: selectedValue });
  }

  handleSave = values => {
    const { onAddNewExceptionalPeriod, yearSemesters, requests } = this.props;
    const {
      selectedDate,
      selectedFromSemes,
      selectedToSemes,
      selectedAcceptedFromSemes,
      selectedAcceptedToSemes,
      selectedStateFromSemes,
      selectedStateToSemes,
      warningsArray,
      requestsArray,
      stdStatusArray,
      notIncludedPeriodsArray,
    } = this.state;

    const fromSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromSemes
    );

    const toSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToSemes
    );

    const acceptedFromSemesterObj = yearSemesters.find(
      semes => semes.value === selectedAcceptedFromSemes
    );

    const acceptedToSemesterObj = yearSemesters.find(
      semes => semes.value === selectedAcceptedToSemes
    );

    const stateFromSemesterObj = yearSemesters.find(
      semes => semes.value === selectedStateFromSemes
    );

    const stateToSemesterObj = yearSemesters.find(
      semes => semes.value === selectedStateToSemes
    );

    const obj = {
      arAddPeriod: values["arAddPeriod"],
      enAddPeriod: values["enAddPeriod"],
      decreeNum: values["decreeNum"],
      decreeDate: values["decreeDate"] || null,
      fromSemesId: fromSemesterObj ? fromSemesterObj.key: null,
      toSemesId: toSemesterObj ? toSemesterObj.key: null ,
      AllowedRequests: requestsArray,
      ExceptionalPeriodsWarnings: warningsArray,
      ExceptionalPeriodsStudentState: stdStatusArray,
      ExceptionalPeriodsNotInclude: notIncludedPeriodsArray,
      acceptedFromSemesId:  acceptedFromSemesterObj ? acceptedFromSemesterObj.key: null ,
      acceptedToSemesId: acceptedToSemesterObj ? acceptedToSemesterObj.key: null , 
      stateFromSemesId: stateFromSemesterObj ? stateFromSemesterObj.key: null , 
      stateToSemesId: stateToSemesterObj ? stateToSemesterObj.key: null ,
    };

    onAddNewExceptionalPeriod(obj);
    this.toggle()
  };

  handleEditExceptionalPeriod = arg => {
    const exceptionalPeriod = arg;

    this.setState({
      exceptionalPeriodId: exceptionalPeriod.Id,
      arExtraordinary: exceptionalPeriod.arAddPeriod,
      enExtraordinary: exceptionalPeriod.enAddPeriod,
      decisionNumber: exceptionalPeriod.decreeNum,
      selectedDate: new Date(
        exceptionalPeriod.decreeDate
      )
        .toISOString()
        .slice(
          0,
          10
        ),
      selectedFromSemesId: exceptionalPeriod.fromSemesId,
      selectedToSemesId: exceptionalPeriod.toSemesId,
      selectedAcceptedFromSemesId: exceptionalPeriod.acceptedFromSemesId,
      selectedAcceptedToSemesId: exceptionalPeriod.acceptedToSemesId,
      selectedStateFromSemesId: exceptionalPeriod.stateFromSemesId,
      selectedStateToSemesId: exceptionalPeriod.stateToSemesId,
      requestsArray: exceptionalPeriod.AllowedRequests,
      warningsArray: exceptionalPeriod.ExceptionalPeriodsWarnings,
      stdStatusArray: exceptionalPeriod.ExceptionalPeriodsStudentState,
      notIncludedPeriodsArray: exceptionalPeriod.ExceptionalPeriodsNotInclude,

      isEdit: true,
    });

    this.toggle();
    const { yearSemesters , requests} = this.props;

    if (exceptionalPeriod.fromSemesId) {
      const fromSemes = yearSemesters.find(
        yearSemester => yearSemester.key === exceptionalPeriod.fromSemesId
      );
      this.setState({
        selectedFromSemes: fromSemes.value,
      });
    }

    if (exceptionalPeriod.toSemesId) {
      const toSemes = yearSemesters.find(
        yearSemester => yearSemester.key === exceptionalPeriod.toSemesId
      );
      this.setState({
        selectedToSemes: toSemes.value,
      });
    }

    if (exceptionalPeriod.acceptedFromSemesId) {
      const acceptedFromSemesId = yearSemesters.find(
        yearSemester =>
          yearSemester.key === exceptionalPeriod.acceptedFromSemesId
      );
      this.setState({
        selectedAcceptedFromSemes: acceptedFromSemesId.value,
      });
    }

    if (exceptionalPeriod.acceptedToSemesId) {
      const acceptedToSemesId = yearSemesters.find(
        yearSemester => yearSemester.key === exceptionalPeriod.acceptedToSemesId
      );
      this.setState({
        selectedAcceptedToSemes: acceptedToSemesId.value,
      });
    }

    if (exceptionalPeriod.stateFromSemesId) {
      const stateFromSemesId = yearSemesters.find(
        yearSemester => yearSemester.key === exceptionalPeriod.stateFromSemesId
      );
      this.setState({
        selectedStateFromSemes: stateFromSemesId.value,
      });
    }

    if (exceptionalPeriod.stateToSemesId) {
      const stateToSemesId = yearSemesters.find(
        yearSemester => yearSemester.key === exceptionalPeriod.stateToSemesId
      );
      this.setState({
        selectedStateToSemes: stateToSemesId.value,
      });
    }

   
  };

  

  handleUpdate = values => {
    const { onUpdateExceptionalPeriod, yearSemesters, requests } = this.props;
    const {
      exceptionalPeriodId,
      selectedDate,
      selectedFromSemes,
      selectedToSemes,
      selectedAcceptedFromSemes,
      selectedAcceptedToSemes,
      selectedStateFromSemes,
      selectedStateToSemes,
      warningsArray,
      requestsArray,
      stdStatusArray,
      notIncludedPeriodsArray,
    } = this.state;

    const fromSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromSemes
    );

    const toSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToSemes
    );

    const acceptedFromSemesterObj = yearSemesters.find(
      semes => semes.value === selectedAcceptedFromSemes
    );

    const acceptedToSemesterObj = yearSemesters.find(
      semes => semes.value === selectedAcceptedToSemes
    );

    const stateFromSemesterObj = yearSemesters.find(
      semes => semes.value === selectedStateFromSemes
    );

    const stateToSemesterObj = yearSemesters.find(
      semes => semes.value === selectedStateToSemes
    );

    const obj = {
      Id: exceptionalPeriodId,
      arAddPeriod: values["arAddPeriod"],
      enAddPeriod: values["enAddPeriod"],
      decreeNum: values["decreeNum"],
      decreeDate: values["decreeDate"],
      fromSemesId: fromSemesterObj ? fromSemesterObj.key: null,
      toSemesId: toSemesterObj ? toSemesterObj.key: null ,
      AllowedRequests: requestsArray,
      acceptedFromSemesId:  acceptedFromSemesterObj ? acceptedFromSemesterObj.key: null ,
      acceptedToSemesId: acceptedToSemesterObj ? acceptedToSemesterObj.key: null , 
      stateFromSemesId: stateFromSemesterObj ? stateFromSemesterObj.key: null , 
      stateToSemesId: stateToSemesterObj ? stateToSemesterObj.key: null ,
      ExceptionalPeriodsWarnings: warningsArray,
      ExceptionalPeriodsStudentState: stdStatusArray,
      ExceptionalPeriodsNotInclude: notIncludedPeriodsArray,
    };
    onUpdateExceptionalPeriod(obj);
    this.toggle();
  };

  handleDeletedSuccessClose = () => {
    const { onGetExceptionalPeriodDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetExceptionalPeriodDeletedValue();
  };

  handleDeletedErrorClose = () => {
    const { onGetExceptionalPeriodDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetExceptionalPeriodDeletedValue();
  };

  handledecisionNumChange = event => {
    const decisionNumValue = event.target.value;
    this.setState({ decisionNumber: decisionNumValue });
  };

  render() {
    const {
      exceptionalPeriods,
      exceptionalPeriodsOpt,
      warningRules,
      yearSemesters,
      currencies,
      studentStates,
      requests,
      deleted,
      t,
    } = this.props;
    const {
      errorMessage,
      deleteModal,
      isEdit,
      modal,
      exceptionalPeriodId,
      arExtraordinary,
      enExtraordinary,
      decisionNumber,
      selectedMulti,
      selectedFromSemes,
      selectedToSemes,
      selectedAcceptedFromSemes,
      selectedAcceptedToSemes,
      selectedStateFromSemes,
      selectedStateToSemes,
      selectedDate,
      stdStatusArray,
      notIncludedPeriodsArray,
      warningsArray,
      requestsArray,
      exceptionalPeriod,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;

    let filteredOptions = exceptionalPeriodsOpt.filter(
      option => option.value !== exceptionalPeriodId
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

    const exceptionalPeriodsColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },

      {
        dataField: "arAddPeriod",
        text: this.props.t("Additional Period"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "decreeNum",
        text: this.props.t("Decree Number"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "decreeDate",
        text: this.props.t("Decree Date"),
        sort: true,
        editable: false,
        formatter: (cell, row) => {
          const date = row.decreeDate; 
          if (date) {
            return date.slice(0, 10);
          } else {
            return "";
          }
        },
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "fromSemesId",

        text: this.props.t("From Semester"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <div>
         {
                (
                  yearSemesters.find(
                    yearSemester => yearSemester.key === row.fromSemesId
                  ) || ""
                ).value
              }
         
          </div>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "toSemesId",

        text: this.props.t("To Semester"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <div>
            {
                (
                  yearSemesters.find(
                    yearSemester => yearSemester.key === row.toSemesId
                  ) || ""
                ).value
              }
          </div>
        ),
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
            {showEditButton &&(
            <Tooltip title={this.props.t("Edit")} placement="top">
              <IconButton
                onClick={() => this.handleEditExceptionalPeriod(warning)}
              >
                <i
                  className="mdi mdi-pencil font-size-18 text-secondary"
                  id="deletetooltip"
                ></i>
              </IconButton>
            </Tooltip>)}
{showDeleteButton &&(
            <Tooltip title={this.props.t("Delete")} placement="top">
              <IconButton
                onClick={() => this.onClickDelete(warning)}
                color="danger"
              >
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
      totalSize: exceptionalPeriods.length,
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
                  <Col>
                    <Card>
                      <CardBody>
                        <div className="table-responsive">
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            keyField="Id"
                            columns={exceptionalPeriodsColumns}
                            data={exceptionalPeriods}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={exceptionalPeriods}
                                columns={exceptionalPeriodsColumns}
                                search
                              >
                                {toolkitprops => (
                                  <React.Fragment>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                      centered={true}
                                      size="xl"
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t(
                                              "Edit Additional Courses"
                                            )
                                          : this.props.t(
                                              "Add Additional Courses"
                                            )}
                                      </ModalHeader>
                                      <ModalBody className="py-3 px-5">
                                        <Formik
                                          initialValues={
                                            (isEdit && {
                                              Id: exceptionalPeriodId,
                                              arAddPeriod: arExtraordinary,
                                              enAddPeriod: enExtraordinary,
                                              decreeNum: decisionNumber,
                                              decreeDate: selectedDate,
                                              fromSemesId: selectedFromSemes,
                                              toSemesId: selectedToSemes,
                                              acceptedFromSemesId:
                                                selectedAcceptedFromSemes,
                                              acceptedToSemesId:
                                                selectedAcceptedToSemes,
                                              stateFromSemesId:
                                                selectedStateFromSemes,
                                              stateToSemesId:
                                                selectedStateToSemes,
                                             
                                            }) ||
                                            (!isEdit && {
                                              arAddPeriod: "",
                                              enAddPeriod: "",
                                              decreeNum: "",
                                              decreeDate: "",
                                              notIncludedPeriod: "",
                                              fromSemesId: "",
                                              toSemesId: "",
                                              acceptedFromSemesId: "",
                                              acceptedToSemesId: "",
                                              stateFromSemesId: "",
                                              stateToSemesId: "",
                                              AllowedRequests: "",
                                            })
                                          }
                                          enableReinitialize={true}
                                          validationSchema={
                                            (!isEdit &&
                                              Yup.object().shape({
                                                arAddPeriod: Yup.string()
                                                  .required(
                                                    "Additional Period(ar) is required"
                                                  )
                                                  .notOneOf(
                                                    exceptionalPeriods.map(
                                                      user => user.arAddPeriod
                                                    ),
                                                    "Additional Period already taken"
                                                  ),
                                                enAddPeriod:
                                                  Yup.string().required(
                                                    "Additional Period is required"
                                                  ),
                                              })) ||
                                            (isEdit &&
                                              Yup.object().shape({
                                                arAddPeriod:
                                                  Yup.string().required(
                                                    "Additional Period(ar) is required"
                                                  ),
                                                enAddPeriod:
                                                  Yup.string().required(
                                                    "Additional Period is required"
                                                  ),
                                              }))
                                          }
                                          onSubmit={(
                                            values,
                                            { setSubmitting }
                                          ) => {
                                            if (isEdit) {
                                              const updateFees = {
                                                Id: exceptionalPeriodId,
                                                arAddPeriod: values.arAddPeriod,
                                                enAddPeriod: values.enAddPeriod,
                                                decreeNum: values.decreeNum,
                                                decreeDate: values.decreeDate,
                                                fromSemesId: selectedFromSemes,
                                                toSemesId: selectedToSemes,
                                                acceptedFromSemesId:
                                                  selectedAcceptedFromSemes,
                                                acceptedToSemesId:
                                                  selectedAcceptedToSemes,
                                                stateFromSemesId:
                                                  selectedStateFromSemes,
                                                stateToSemesId:
                                                  selectedStateToSemes,
                                               
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
                                            handleChange,
                                            handleBlur,
                                          }) => (
                                            <Form onSubmit={handleSubmit}>
                                              <Row className="justify-content-center">
                                                <Col>
                                                  <Card>
                                                    <CardTitle id="add_header">
                                                      {this.props.t(
                                                        "Decree Information"
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
                                                                    "Additional Period(ar)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="arAddPeriod"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.arAddPeriod &&
                                                                    touched.arAddPeriod
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name="arAddPeriod"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "From Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="fromSemesId"
                                                                  id="year-semester"
                                                                  list="fromSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "fromSemesId"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "fromSemesId"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "fromSemesId"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedFromSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedFromSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="fromSemesterdatalistOptions">
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

                                                          <div className="mb-4">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Decree Number"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  type="number"
                                                                  name="decreeNum"
                                                                  id="applying-order"
                                                                  className={`form-control`}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "Don't Include"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Select
                                                                  value={
                                                                    notIncludedPeriodsArray
                                                                  }
                                                                  name="ExceptionalPeriodsNotInclude"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "ExceptionalPeriodsNotInclude",
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
                                                        </Col>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Additional Period(en)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="enAddPeriod"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.enAddPeriod &&
                                                                    touched.enAddPeriod
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name="enAddPeriod"
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
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "To Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="toSemesId"
                                                                  id="year-semester"
                                                                  list="toSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "toSemesId"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "toSemesId"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "toSemesId"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedToSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedToSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="toSemesterdatalistOptions">
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
                                                                    "Decree Date"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="decreeDate"
                                                                  className={`form-control `}
                                                                  type="date"
                                                                 
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  onBlur={
                                                                    handleBlur
                                                                  }
                                                                  id="ardecisionDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </CardBody>
                                                  </Card>
                                                </Col>
                                              </Row>

                                              <Row className="justify-content-center">
                                                <Col>
                                                  <Card>
                                                    <CardTitle id="add_header">
                                                      {this.props.t(
                                                        "Students State"
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
                                                                    "Status of Covered Students"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Select
                                                                  value={
                                                                    stdStatusArray
                                                                  }
                                                                  name="ExceptionalPeriodsStudentState"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "ExceptionalPeriodsStudentState",
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

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "Warnings Included"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Select
                                                                  value={
                                                                    warningsArray
                                                                  }
                                                                  name="ExceptionalPeriodsWarnings"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "ExceptionalPeriodsWarnings",
                                                                      selectedOption
                                                                    )
                                                                  }
                                                                  options={
                                                                    warningRules
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
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "Allowed Requests"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                               

                                                                <Select
                                                                  value={
                                                                    requestsArray
                                                                  }
                                                                  name="AllowedRequests"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "AllowedRequests",
                                                                      selectedOption
                                                                    )
                                                                  }
                                                                  options={
                                                                    requests
                                                                  }
                                                                  classNamePrefix="select2-selection"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                      <Row>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "Accepted From Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="acceptedFromSemesId"
                                                                  id="year-semester"
                                                                  list="acceptedFromSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "acceptedFromSemesId"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "acceptedFromSemesId"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "acceptedFromSemesId"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedAcceptedFromSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedAcceptedFromSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="acceptedFromSemesterdatalistOptions">
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
                                                                    "State From Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="stateFromSemesId"
                                                                  id="year-semester"
                                                                  list="stateFromSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "stateFromSemesId"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "stateFromSemesId"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "stateFromSemesId"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedStateFromSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedStateFromSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="stateFromSemesterdatalistOptions">
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
                                                        </Col>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "Accepted To Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="acceptedToSemesId"
                                                                  id="year-semester"
                                                                  list="acceptedToSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "acceptedToSemesId"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "acceptedToSemesId"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "acceptedToSemesId"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedAcceptedToSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedAcceptedToSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="acceptedToSemesterdatalistOptions">
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
                                                                    "State To Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="stateToSemesId"
                                                                  id="year-semester"
                                                                  list="stateToSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "stateToSemesId"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "stateToSemesId"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "stateToSemesId"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedStateToSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedStateToSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="stateToSemesterdatalistOptions">
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
                                      data={exceptionalPeriods}
                                      columns={exceptionalPeriodsColumns}
                                      cellEdit={cellEditFactory({
                                        mode: "click",
                                        blurToSave: true,
                                        afterSaveCell: (
                                          oldValue,
                                          newValue,
                                          row,
                                          column
                                        ) => {
                                          this.handleExceptionalPeriodDataChange(
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
  exceptionalPeriods,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  semesters,
  warningRules,
  requests,
  menu_items
}) => ({
  exceptionalPeriods: exceptionalPeriods.exceptionalPeriods,
  exceptionalPeriodsOpt: exceptionalPeriods.exceptionalPeriodsOpt,
  deleted: exceptionalPeriods.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  yearSemesters: generalManagements.yearSemesters,
  studentStates: warningRules.studentStates,
  currentSemester: semesters.currentSemester,
  warningRules: warningRules.warningRules,
  requests :requests.requests,
  user_menu: menu_items.user_menu || [],

});

const mapDispatchToProps = dispatch => ({
  onGetExceptionalPeriods: exceptionalPeriods =>
    dispatch(getExceptionalPeriods(exceptionalPeriods)),
  onAddNewExceptionalPeriod: exceptionalPeriod =>
    dispatch(addNewExceptionalPeriod(exceptionalPeriod)),
  onUpdateExceptionalPeriod: exceptionalPeriod =>
    dispatch(updateExceptionalPeriod(exceptionalPeriod)),
  onDeleteExceptionalPeriod: exceptionalPeriod =>
    dispatch(deleteExceptionalPeriod(exceptionalPeriod)),
  onGetExceptionalPeriodDeletedValue: () =>
    dispatch(getExceptionalPeriodDeletedValue()),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ExceptionalPeriods));
