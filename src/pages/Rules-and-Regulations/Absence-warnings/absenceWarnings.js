import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Select from "react-select";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Alert,
  Input,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import {
  getAbsenceWarnings,
  addNewAbsenceWarning,
  updateAbsenceWarning,
  deleteAbsenceWarning,
  getAbsenceWarningDeletedValue,
} from "store/Rules-and-Regulations/Absence-warnings/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import absenceWarnings from "store/Rules-and-Regulations/Absence-warnings/reducer";
import decisions from "pages/HR/decisions/decisions";

class AbsenceWarningsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      absenceWarnings: [],
      absenceWarning: "",
      deleteModal: false,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      duplicateError: null,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      isEdit: false,
      isAdd: false,
      selectedDecisionReason: null,
      decisionReasonName: "",
      selectedTraineeId: null,
      traineeName: "",
      selectedYearId: null,
      yearName: "",
      selectedCourseId: null,
      courseName: "",
      errorMessage: null,
      successMessage: null,
      values: "",
    };
    this.state = {};
  }

  componentDidMount() {
    const {
      absenceWarnings,
      decisionReasons,
      years,
      onGetAbsenceWarnings,
      user_menu,
      deleted,
    } = this.props;

    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    onGetAbsenceWarnings();
    this.setState({ absenceWarnings, decisionReasons, years, deleted });
  }

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
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  toggle2 = () => {
    this.setState(prevState => ({
      modal2: !prevState.modal2,
    }));
  };

  handleAddRow = () => {
    const { onAddNewAbsenceWarning, absenceWarnings } = this.props;

    const newRow = {
      TraineeNum: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = absenceWarnings.some(
      absenceWarnings => absenceWarnings.TraineeNum.trim() === "-----"
      // ||
      // absenceWarning.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewAbsenceWarning(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteAbsenceWarning } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteAbsenceWarning(selectedRowId);
      this.setState({
        deleteModal: false,
        selectedRowId: null,
        showAlert: true,
      });
    }
  };

  toggleDeleteModal = () => {
    this.setState(prev => ({ deleteModal: !prev.deleteModal }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAbsenceWarningDataChange = (rowId, fieldName, fieldValue) => {
    const { absenceWarnings, onUpdateAbsenceWarning } = this.props;
    const isDuplicate = absenceWarnings.some(absenceWarning => {
      return (
        absenceWarning.Id !== rowId &&
        absenceWarning.arTitle.trim() === fieldValue.trim()
      );
    });
    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateAbsenceWarning(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateAbsenceWarning(onUpdate);
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetAbsenceWarningDeletedValue();
  };

  handleErrorClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetAbsenceWarningDeletedValue();
  };

  handleAddRow = () => {
    this.setState({
      absenceWarning: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleSubmit = values => {
    const {
      // selectedAdministrativeSupervisor,
      selectedPhysicalWorkLocations,
      selectedJobRank,
      selectedJobTitle,
      selectedCorporateNode,
      selectedContractType,
      selectedEmploymentCase,
      selectedNcsDate,
      selectedEndDate,
      selectedHireDate,
      selectedSignatureDate,
      selectedWorkClassification,
      selectedAcademicYearId,
      absenceWarning,
      isEdit,
      isAdd,
      selectEmpId,
      selectedHasMinistryApprove,
      selectedGovernmentWorker,
      selectedFullName,
      fullNamesOpt,
      selectedYearId,
    } = this.state;
    const { onAddNewContract, onUpdateContract } = this.props;

    //values["administrativeSupervisor"] = selectedAdministrativeSupervisor;
    // values["physicalWorkLocation"] = selectedPhysicalWorkLocations;
    // values["employeeId"] = selectEmpId;

    values["jobRankId"] = selectedJobRank;
    values["yearId"] = selectedYearId;
    // values["corporateNodeId"] = selectedCorporateNode;
    values["absenceWarningTypeId"] = selectedContractType;
    values["employeeId"] = selectedFullName;
    values["employmentCaseId"] = selectedEmploymentCase;
    values["hasMinistryApprove"] = selectedHasMinistryApprove;
    values["governmentWorker"] = selectedGovernmentWorker;
    values["workClassificationId"] = selectedWorkClassification;
    values["academicYearId"] = selectedAcademicYearId;
    console.log("valuesssssssssssssssssssss", values);

    let warningInfo = {};
    // if (values.employeeId) {
    //   const nameObject = fullNamesOpt.find(
    //     fullName => fullName.value === values.employeeId
    //   );
    //   console.log("nameObject", nameObject);
    //   values["employeeId"] = nameObject.key;
    // }
    // console.log("valuesssssssssssssssssssss", values);
    if (
      // values.jobNumber &&
      selectedYearId !== null
    ) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          warningInfo[key] = values[key];
      });
      console.log("absenceWarningInfoabsenceWarningInfo", warningInfo);
      if (isEdit) {
        console.log("9999999", warningInfo);
        // onUpdateContract(warningInfo);
      } else {
        // onAddNewContract(warningInfo);
      }
      this.setState({
        errorMessages: {},
      });
      this.toggle();
    } else {
      let emptyError = "";
      // if (selectedAdministrativeSupervisor === undefined) {
      //   emptyError = "Fill the empty select";
      // }
      // if (selectedPhysicalWorkLocations === undefined) {
      //   emptyError = "Fill the empty select";
      // }
      if (selectedJobTitle === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedNcsDate === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedContractType === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedAcademicYearId === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedHireDate === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedSignatureDate === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedFullName === undefined) {
        emptyError = "Fill the empty select";
      }
      // if (selectedCorporateNode === undefined) {
      //   emptyError = "Fill the empty select";
      // }
      this.setState({ emptyError: emptyError });
    }
  };

  handleAbsenceWarningEdit = arg => {
    console.log("arg", arg);

    this.setState({
      absenceWarning: arg,
      selectedYearId: arg.yearId,
      yearName: arg.yearName,
      // selectedJobRank: arg.jobRankId,
      // selectedJobTitle: arg.jobTitleId,
      // jobTitleName: arg.jobTitle,
      // selectedCorporateNode: arg.corporateNodeId,
      // selectedContractType: arg.absenceWarningTypeId,
      // selectedEmploymentCase: arg.employmentCaseId,
      // selectedHasMinistryApprove: arg.hasMinistryApprove,
      // selectedGovernmentWorker: arg.governmentWorker,
      // selectedWorkClassification: arg.workClassificationId,
      // selectedAcademicYearId: arg.academicYearId,
      // academicYear: arg.academicYear,
      isEdit: true,
      isOpen: false,
    });
    this.toggle();
  };

  render() {
    const { absenceWarnings, years, decisionReasons, t, traineesOpt, deleted } =
      this.props;
    const {
      modal,
      deleteModal,
      duplicateError,
      showAlert,
      showAddButton,
      showSearchButton,
      isEdit,
      absenceWarning,
      selectedTraineeId,
      selectedYear,
      selectedDecisionReason,
      selectedCourseId,
    } = this.state;

    const { SearchBar } = Search;
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

    const columns = [
      {
        dataField: "Id",
        text: this.props.t("ID"),
        hidden: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "TraineeNum",
        text: t("Trainee Num"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "traineeName",
        text: t("Trainee Name"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "ApplyingDate",
        text: t("Applying Date"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "StartDate",
        text: t("Start Date"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "courseName",
        text: t("Course"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DecreeStatus",
        text: t("Decree Status"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "edit",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, absenceWarning) => (
          <Tooltip title={this.props.t("Edit")} placement="top">
            <Link className="text-sm-end" to="#">
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </Link>
          </Tooltip>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: absenceWarnings.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRowId: null })
          }
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={this.props.t("AbsenceWarning")} />
            <Row>
              <Col>
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
                        columns={columns}
                        data={absenceWarnings}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={absenceWarnings}
                            columns={columns}
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
                                  data={absenceWarnings}
                                  columns={columns}
                                  cellEdit={cellEditFactory({
                                    mode: "dbclick",
                                    blurToSave: true,
                                    afterSaveCell: (
                                      oldValue,
                                      newValue,
                                      row,
                                      column
                                    ) => {
                                      this.handleAbsenceWarningDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  defaultSorted={defaultSorting}
                                  noDataIndication={t(
                                    "No Absence Warnings found"
                                  )}
                                  filter={filterFactory()}
                                />
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                                <Modal
                                  isOpen={modal}
                                  toggle={this.toggle}
                                  size="lg"
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit
                                      ? t("Edit Absence Warning")
                                      : t("Add Absence Warning")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          absenceWarning && {
                                            Id: absenceWarning.Id,
                                          }),
                                        traineeId:
                                          (absenceWarning &&
                                            absenceWarning.traineeId) ||
                                          selectedTraineeId,
                                        yearId:
                                          (absenceWarning &&
                                            absenceWarning.yearId) ||
                                          selectedYear,
                                        decisionReasonId:
                                          (absenceWarning &&
                                            absenceWarning.decisionReasonId) ||
                                          selectedDecisionReason,
                                        coursesId:
                                          (absenceWarning &&
                                            absenceWarning.coursesId) ||
                                          selectedCourseId,
                                        absenceRate:
                                          (absenceWarning &&
                                            absenceWarning.absenceRate) ||
                                          "",
                                        dateAdded: absenceWarning?.dateAdded
                                          ? moment
                                              .utc(absenceWarning.dateAdded)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        note:
                                          (absenceWarning &&
                                            absenceWarning.note) ||
                                          "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        traineeId: Yup.string().required(
                                          "Please select a trainee"
                                        ),
                                        dateAdded: Yup.string()
                                          .nullable()
                                          .test(
                                            "is-valid-date",
                                            "Date must be valid",
                                            value =>
                                              !value ||
                                              moment(
                                                value,
                                                "YYYY-MM-DD",
                                                true
                                              ).isValid()
                                          ),
                                        absenceRate: Yup.number()
                                          .required("Absence rate is required")
                                          .min(
                                            0,
                                            "Absence rate cannot be less than 0"
                                          )
                                          .max(
                                            100,
                                            "Absence rate cannot be more than 100"
                                          )
                                          .typeError(
                                            "Absence rate must be a number"
                                          ),
                                        coursesId: Yup.string().required(
                                          "Please select or enter a course"
                                        ),
                                        jobTitleId: Yup.string().required(
                                          t("Please Enter Your Job Title")
                                        ),
                                      })}
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
                                        <Form>
                                          <Card id="employee-card">
                                            <CardTitle id="course_header">
                                              {t("Absence Warning")}
                                            </CardTitle>
                                            <CardBody className="cardBody">
                                              <div className="mb-3">
                                                <Row>
                                                  <Col className="col-4">
                                                    <Label for="yearId">
                                                      {this.props.t("Year")}
                                                    </Label>
                                                  </Col>
                                                  <Col className="col-8">
                                                    <Field
                                                      name="yearId"
                                                      as="input"
                                                      id="year-Id"
                                                      type="text"
                                                      placeholder="Search..."
                                                      className={
                                                        "form-control" +
                                                        (errors.yearId &&
                                                        touched.yearId
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        years.find(
                                                          year =>
                                                            year.key ===
                                                            this.state
                                                              .selectedYearId
                                                        )?.value || ""
                                                      }
                                                      onChange={e => {
                                                        const newValue =
                                                          e.target.value;

                                                        const selectedYear =
                                                          years.find(
                                                            year =>
                                                              year.value ===
                                                              newValue
                                                          );

                                                        if (selectedYear) {
                                                          this.setState({
                                                            selectedYearId:
                                                              selectedYear.key,
                                                            yearName:
                                                              selectedYear.value,
                                                          });
                                                        } else {
                                                          this.setState({
                                                            selectedYearId:
                                                              null,
                                                            yearName: newValue,
                                                          });
                                                        }
                                                      }}
                                                      list="yearsId"
                                                      autoComplete="off"
                                                    />
                                                    <datalist id="yearsId">
                                                      {years.map(yearOpt => (
                                                        <option
                                                          key={yearOpt.key}
                                                          value={yearOpt.value}
                                                        />
                                                      ))}
                                                    </datalist>
                                                  </Col>
                                                </Row>
                                              </div>
                                              <div className="mb-3">
                                                <Row>
                                                  <Col className="col-4">
                                                    <Label for="traineeId">
                                                      {this.props.t(
                                                        "Trainee Name"
                                                      )}
                                                    </Label>
                                                  </Col>
                                                  <Col className="col-8">
                                                    <Field
                                                      name="traineeId"
                                                      as="input"
                                                      id="trainee-Id"
                                                      type="text"
                                                      placeholder="Search..."
                                                      className={
                                                        "form-control" +
                                                        (errors.traineeId &&
                                                        touched.traineeId
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        traineesOpt.find(
                                                          trainee =>
                                                            trainee.key ===
                                                            this.state
                                                              .selectedTraineeId
                                                        )?.value || ""
                                                      }
                                                      onChange={e => {
                                                        const newValue =
                                                          e.target.value;

                                                        const selectedTrainee =
                                                          traineesOpt.find(
                                                            trainee =>
                                                              trainee.value ===
                                                              newValue
                                                          );

                                                        if (selectedTrainee) {
                                                          this.setState({
                                                            selectedTraineeId:
                                                              selectedTrainee.key,
                                                            traineeName:
                                                              selectedTrainee.value,
                                                          });
                                                        } else {
                                                          this.setState({
                                                            selectedTraineeId:
                                                              null,
                                                            traineeName:
                                                              newValue,
                                                          });
                                                        }
                                                      }}
                                                      list="traineesOptId"
                                                      autoComplete="off"
                                                    />
                                                    <datalist id="traineesOptId">
                                                      {traineesOpt.map(
                                                        traineeOpt => (
                                                          <option
                                                            key={traineeOpt.key}
                                                            value={
                                                              traineeOpt.value
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
                                                  <Col className="col-4">
                                                    <Label for="decisionReasonId">
                                                      {this.props.t(
                                                        "Decision Reason"
                                                      )}
                                                    </Label>
                                                  </Col>
                                                  <Col className="col-8">
                                                    <Select
                                                      name="decisionReasonId"
                                                      key={`select_decisionReason`}
                                                      options={decisionReasons}
                                                      className={`form-control`}
                                                      onChange={newValue => {
                                                        this.handleSelect(
                                                          "decisionReasonId",
                                                          newValue.value
                                                        );
                                                      }}
                                                      defaultValue={decisionReasons.find(
                                                        opt =>
                                                          opt.value ===
                                                          absenceWarning?.decisionReasonId
                                                      )}
                                                    />
                                                  </Col>
                                                </Row>
                                              </div>
                                            </CardBody>
                                          </Card>
                                          <Row>
                                            <Col>
                                              <div className="text-center">
                                                <Link
                                                  to="#"
                                                  className="btn btn-primary me-2"
                                                  onClick={() => {
                                                    this.handleSubmit(values);
                                                  }}
                                                >
                                                  {t("Save")}
                                                </Link>
                                              </div>
                                            </Col>
                                          </Row>
                                        </Form>
                                      )}
                                    </Formik>
                                  </ModalBody>
                                </Modal>
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ absenceWarnings, trainees, years, menu_items }) => ({
  absenceWarnings: absenceWarnings.absenceWarnings,
  deleted: absenceWarnings.deleted,
  decisionReasons: absenceWarnings.decisionReasons,
  years: years.years,
  traineesOpt: trainees.traineesOpt,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetAbsenceWarnings: () => dispatch(getAbsenceWarnings()),
  onAddNewAbsenceWarning: absenceWarning =>
    dispatch(addNewAbsenceWarning(absenceWarning)),
  onUpdateAbsenceWarning: absenceWarning =>
    dispatch(updateAbsenceWarning(absenceWarning)),
  onDeleteCAbsenceWarning: absenceWarning =>
    dispatch(deleteAbsenceWarning(absenceWarning)),
  onGetAbsenceWarningDeletedValue: () =>
    dispatch(getAbsenceWarningDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AbsenceWarningsList));
