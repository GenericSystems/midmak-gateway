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
  InputGroup,
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
  getWrittenWarningDecrees,
  addNewWrittenWarningDecree,
  updateWrittenWarningDecree,
  deleteWrittenWarningDecree,
  getWrittenWarningDecreeDeletedValue,
} from "store/writtenWarningDecrees/actions";
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

class WrittenWarningDecreesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      writtenWarningDecrees: [],
      writtenWarningDecree: "",
      deleteModal: false,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      duplicateError: null,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      editModal: false,
      isEdit: false,
      isAdd: false,
      selectedDecreeReason: null,
      decreeReasonName: "",
      selectedTraineeId: null,
      traineeName: "",
      errorMessage: null,
      successMessage: null,
      applyingDateError: false,
      startDateError: false,
      endDateError: false,
      traineeError: false,
      decreeReasonError: false,
      values: "",
    };
    this.state = {};
  }

  componentDidMount() {
    const {
      writtenWarningDecrees,
      decreeReasons,
      employeesNames,
      years,
      onGetWrittenWarningDecrees,
      user_menu,
      deleted,
      decisionStatus,
      turnReasons,
    } = this.props;

    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    onGetWrittenWarningDecrees();
    this.setState({
      writtenWarningDecrees,
      decreeReasons,
      years,
      deleted,
      decisionStatus,
      turnReasons,
      employeesNames,
    });
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

  toggleEdit = () => {
    this.setState(prevState => ({
      editModal: !prevState.editModal,
    }));
  };

  handleAddRow = () => {
    const { onAddNewWrittenWarningDecree, writtenWarningDecrees } = this.props;

    const newRow = {
      TraineeNum: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = writtenWarningDecrees.some(
      writtenWarningDecrees =>
        writtenWarningDecrees.TraineeNum.trim() === "-----"
      // ||
      // writtenWarningDecree.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewWrittenWarningDecree(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteWrittenWarningDecree } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteWrittenWarningDecree(selectedRowId);
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

  handleWrittenWarningDecreeDataChange = (rowId, fieldName, fieldValue) => {
    const { writtenWarningDecrees, onUpdateWrittenWarningDecree } = this.props;
    const isDuplicate = writtenWarningDecrees.some(writtenWarningDecree => {
      return (
        writtenWarningDecree.Id !== rowId &&
        writtenWarningDecree.arTitle.trim() === fieldValue.trim()
      );
    });
    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateWrittenWarningDecree(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateWrittenWarningDecree(onUpdate);
    }
  };
  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
  };

  handleSuccessClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetWrittenWarningDecreeDeletedValue();
  };

  handleErrorClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetWrittenWarningDecreeDeletedValue();
  };

  handleAddRow = () => {
    this.setState({
      writtenWarningDecree: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleSubmit = values => {
    const {
      selectedTraineeId,
      selectedDecreeReason,
      selectedTurnReason,
      selectedDecisionStatus,
      isEdit,
    } = this.state;
    const { onAddNewWrittenWarningDecree, onUpdateWrittenWarningDecree } =
      this.props;

    values["traineeId"] = selectedTraineeId;
    values["decreeReasonId"] = selectedDecreeReason;
    values["decreeStatusId"] = isEdit ? selectedDecisionStatus : 4;
    values["turnReasonId"] = selectedTurnReason;

    console.log("valuesssssssssssssssssssss", values);

    let warningInfo = {};
    if (
      values.startDate &&
      values.endDate &&
      values.applyingDate &&
      selectedTraineeId !== null &&
      selectedDecreeReason !== null
    ) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          warningInfo[key] = values[key];
      });
      console.log(
        "writtenWarningDecreeInfowrittenWarningDecreeInfo",
        warningInfo
      );
      if (isEdit) {
        console.log("9999999", warningInfo);
        // onUpdateWrittenWarningDecree(warningInfo);
      } else {
        // onAddNewWrittenWarningDecree(warningInfo);
      }
      const saveMessage = "Saved successfully ";
      this.setState({
        successMessage: saveMessage,
        errorMessages: {},
      });
      this.toggle();
    } else if (
      values.startDate === "" ||
      values.endDate === "" ||
      values.applyingDate === "" ||
      (values.traineeId === "" && selectedTraineeId === "")(
        values.decreeReasonId === "" && selectedDecreeReason === ""
      )
    ) {
      this.setState({ applyingDateError: true, saveError: true });
      this.setState({ startDateError: true, saveError: true });
      this.setState({ endDateError: true, saveError: true });
      this.setState({ traineeError: true, saveError: true });
      this.setState({ decreeReasonError: true, saveError: true });

      const emptyError = this.props.t("Fill the Required Fields to Save");

      this.setState({ emptyError: emptyError });
    }
  };

  handleWrittenWarningDecreeEdit = arg => {
    console.log("arg", arg);

    this.setState({
      writtenWarningDecree: arg,
      // selectedJobRank: arg.jobRankId,
      // selectedJobTitle: arg.jobTitleId,
      // jobTitleName: arg.jobTitle,
      // selectedCorporateNode: arg.corporateNodeId,
      // selectedContractType: arg.writtenWarningDecreeTypeId,
      // selectedEmploymentCase: arg.employmentCaseId,
      // selectedHasMinistryApprove: arg.hasMinistryApprove,
      // selectedGovernmentWorker: arg.governmentWorker,
      // selectedWorkClassification: arg.workClassificationId,
      // selectedAcademicYearId: arg.academicYearId,
      // academicYear: arg.academicYear,
      isEdit: true,
    });
    this.toggleEdit();
  };

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "decreeReasonId") {
      this.setState({
        selectedDecreeReason: selectedValue,
        writtenWarningDecree: values,
      });
    }
  };

  render() {
    const {
      writtenWarningDecrees,
      employeesNames,
      years,
      decreeReasons,
      t,
      traineesOpt,
      decisionStatus,
      deleted,
      turnReasons,
    } = this.props;
    const {
      modal,
      editModal,
      deleteModal,
      duplicateError,
      showAlert,
      showAddButton,
      showSearchButton,
      isEdit,
      writtenWarningDecree,
      selectedTraineeId,
      selectedDecreeReason,
      applyingDateError,
      startDateError,
      endDateError,
      traineeError,
      decreeReasonError,
      selectedDecreeStatus,
      selectedTurnReason,
      emptyError,
      successMessage,
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
        formatter: (cellContent, writtenWarningDecree) => (
          <Tooltip title={this.props.t("Edit")} placement="top">
            <IconButton
              className="text-sm-end"
              onClick={() =>
                this.handleWrittenWarningDecreeEdit(writtenWarningDecree)
              }
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </IconButton>
          </Tooltip>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: writtenWarningDecrees.length,
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
            <Breadcrumbs
              breadcrumbItem={this.props.t("Written Warning Decrees")}
            />
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
                            onClick={() =>
                              this.handleAlertClose("duplicateError")
                            }
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
                        data={writtenWarningDecrees}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={writtenWarningDecrees}
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
                                  data={writtenWarningDecrees}
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
                                      this.handleWrittenWarningDecreeDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  defaultSorted={defaultSorting}
                                  noDataIndication={t(
                                    "No Written Warning Decrees found"
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
                                      ? t("Edit Written Warning Decree")
                                      : t("Add Decree")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        traineeId:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.traineeId) ||
                                          selectedTraineeId,
                                        decreeReasonId:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.decreeReasonId) ||
                                          selectedDecreeReason,
                                        applyingDate:
                                          writtenWarningDecree?.applyingDate
                                            ? moment
                                                .utc(
                                                  writtenWarningDecree.applyingDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        startDate:
                                          writtenWarningDecree?.startDate
                                            ? moment
                                                .utc(
                                                  writtenWarningDecree.startDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        endDate: writtenWarningDecree?.endDate
                                          ? moment
                                              .utc(writtenWarningDecree.endDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        note:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.note) ||
                                          "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        traineeId: Yup.string().required(
                                          "Please select a trainee"
                                        ),
                                        applyingDate: Yup.string()
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
                                        startDate: Yup.string()
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
                                        endDate: Yup.string()
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
                                      }) => {
                                        return (
                                          <Form>
                                            <Card id="employee-card">
                                              <CardTitle id="course_header">
                                                {t("Written Warning Decree")}
                                              </CardTitle>
                                              <CardBody className="cardBody">
                                                {emptyError && (
                                                  <Alert
                                                    color="danger"
                                                    className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                    role="alert"
                                                  >
                                                    {emptyError}
                                                    <button
                                                      type="button"
                                                      className="btn-close"
                                                      aria-label="Close"
                                                      onClick={() =>
                                                        this.handleAlertClose(
                                                          "emptyError"
                                                        )
                                                      }
                                                    ></button>
                                                  </Alert>
                                                )}
                                                <Card>
                                                  <CardBody>
                                                    <div className="bordered">
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="startDate">
                                                              {this.props.t(
                                                                "Start Date"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              name="startDate"
                                                              className={`form-control ${
                                                                startDateError
                                                                  ? "is-invalid"
                                                                  : ""
                                                              }`}
                                                              type="date"
                                                              value={
                                                                values.startDate
                                                                  ? new Date(
                                                                      values.startDate
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
                                                              id="startDate-date-input"
                                                            />
                                                            {startDateError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "Start Date is required"
                                                                )}
                                                              </div>
                                                            )}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="endDate">
                                                              {this.props.t(
                                                                "End Date"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              name="endDate"
                                                              className={`form-control ${
                                                                endDateError
                                                                  ? "is-invalid"
                                                                  : ""
                                                              }`}
                                                              type="date"
                                                              value={
                                                                values.endDate
                                                                  ? new Date(
                                                                      values.endDate
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
                                                              id="endDate-date-input"
                                                            />
                                                            {endDateError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "End Date is required"
                                                                )}
                                                              </div>
                                                            )}
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
                                                            <span className="text-danger">
                                                              *
                                                            </span>
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
                                                                ((errors.traineeId &&
                                                                  touched.traineeId) ||
                                                                traineeError
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
                                                                  e.target
                                                                    .value;

                                                                const selectedTrainee =
                                                                  traineesOpt.find(
                                                                    trainee =>
                                                                      trainee.value ===
                                                                      newValue
                                                                  );

                                                                if (
                                                                  selectedTrainee
                                                                ) {
                                                                  this.setState(
                                                                    {
                                                                      selectedTraineeId:
                                                                        selectedTrainee.key,
                                                                      traineeName:
                                                                        selectedTrainee.value,
                                                                    }
                                                                  );
                                                                } else {
                                                                  this.setState(
                                                                    {
                                                                      selectedTraineeId:
                                                                        null,
                                                                      traineeName:
                                                                        newValue,
                                                                    }
                                                                  );
                                                                }
                                                              }}
                                                              list="traineesId"
                                                              autoComplete="off"
                                                            />
                                                            <datalist id="traineesId">
                                                              {traineesOpt.map(
                                                                traineeOpt => (
                                                                  <option
                                                                    key={
                                                                      traineeOpt.key
                                                                    }
                                                                    value={
                                                                      traineeOpt.value
                                                                    }
                                                                  />
                                                                )
                                                              )}
                                                            </datalist>
                                                            {traineeError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "Trainee Name is required"
                                                                )}
                                                              </div>
                                                            )}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="decreeReasonId">
                                                              {this.props.t(
                                                                "Decree Reason"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Select
                                                              name="decreeReasonId"
                                                              key={`select_decreeReason`}
                                                              options={
                                                                decreeReasons
                                                              }
                                                              className={
                                                                "form-control" +
                                                                ((errors.decreeReasonId &&
                                                                  touched.decreeReasonId) ||
                                                                decreeReasonError
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              onChange={newValue => {
                                                                this.handleSelect(
                                                                  "decreeReasonId",
                                                                  newValue.value,
                                                                  values
                                                                );
                                                              }}
                                                              defaultValue={decreeReasons.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  writtenWarningDecree?.decreeReasonId
                                                              )}
                                                            />
                                                            {decreeReasonError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "Decree Reason is required"
                                                                )}
                                                              </div>
                                                            )}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </div>
                                                  </CardBody>
                                                </Card>
                                                <Card>
                                                  <CardBody>
                                                    <div className="bordered">
                                                      <div className="mb-2">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="applyingDate">
                                                              {this.props.t(
                                                                "Applying Date"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              name="applyingDate"
                                                              className={`form-control ${
                                                                applyingDateError
                                                                  ? "is-invalid"
                                                                  : ""
                                                              }`}
                                                              type="date"
                                                              value={
                                                                values.applyingDate
                                                                  ? new Date(
                                                                      values.applyingDate
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
                                                              id="applyingDate-date-input"
                                                            />
                                                            {applyingDateError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "Applying Date is required"
                                                                )}
                                                              </div>
                                                            )}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="md-2">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="note">
                                                              {this.props.t(
                                                                "Notes"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="textarea"
                                                              name="note"
                                                              as="textarea"
                                                              id="note"
                                                              className={
                                                                "form-control"
                                                              }
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </div>
                                                  </CardBody>
                                                </Card>
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
                                        );
                                      }}
                                    </Formik>
                                  </ModalBody>
                                </Modal>
                                <Modal
                                  isOpen={editModal}
                                  toggle={this.toggleEdit}
                                  fullscreen
                                >
                                  <ModalHeader
                                    toggle={this.toggleEdit}
                                    tag="h4"
                                  >
                                    {!!isEdit
                                      ? t("Update Decree Details")
                                      : t("Add Written Warning Decree")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          writtenWarningDecree && {
                                            Id: writtenWarningDecree.Id,
                                          }),
                                        decreeCode:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.decreeCode) ||
                                          "",
                                        traineeId:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.traineeId) ||
                                          selectedTraineeId,
                                        decreeReasonId:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.decreeReasonId) ||
                                          selectedDecreeReason,
                                        applyingDate:
                                          writtenWarningDecree?.applyingDate
                                            ? moment
                                                .utc(
                                                  writtenWarningDecree.applyingDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        startDate:
                                          writtenWarningDecree?.startDate
                                            ? moment
                                                .utc(
                                                  writtenWarningDecree.startDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        endDate: writtenWarningDecree?.endDate
                                          ? moment
                                              .utc(writtenWarningDecree.endDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        decreeNum:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.decreeNum) ||
                                          "",
                                        decreeDate:
                                          writtenWarningDecree?.decreeDate
                                            ? moment
                                                .utc(
                                                  writtenWarningDecree.decreeDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        note:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.note) ||
                                          "",
                                        //file: null,
                                        decreeStatusId:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.decreeStatusId) ||
                                          selectedDecreeStatus,
                                        turnReasonId:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.turnReason) ||
                                          selectedTurnReason,
                                        turnDate: writtenWarningDecree?.turnDate
                                          ? moment
                                              .utc(
                                                writtenWarningDecree.turnDate
                                              )
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        turnNote:
                                          (writtenWarningDecree &&
                                            writtenWarningDecree.turnNote) ||
                                          "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        traineeId: Yup.string().required(
                                          "Please select a trainee"
                                        ),
                                        applyingDate: Yup.string()
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
                                        startDate: Yup.string()
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
                                        endDate: Yup.string()
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
                                      }) => {
                                        return (
                                          <Form>
                                            <Card id="employee-card">
                                              <CardBody className="cardBody">
                                                <Row>
                                                  <Col lg="6">
                                                    <Card>
                                                      <CardBody>
                                                        <div className="bordered">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="decreeCode">
                                                                  {this.props.t(
                                                                    "Decree Code"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  type="text"
                                                                  name="decreeCode"
                                                                  id="decreeCode"
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
                                                                    "form-control"
                                                                  }
                                                                  value={
                                                                    traineesOpt.find(
                                                                      trainee =>
                                                                        trainee.key ===
                                                                        this
                                                                          .state
                                                                          .selectedTraineeId
                                                                    )?.value ||
                                                                    ""
                                                                  }
                                                                  onChange={e => {
                                                                    const newValue =
                                                                      e.target
                                                                        .value;

                                                                    const selectedTrainee =
                                                                      traineesOpt.find(
                                                                        trainee =>
                                                                          trainee.value ===
                                                                          newValue
                                                                      );

                                                                    if (
                                                                      selectedTrainee
                                                                    ) {
                                                                      this.setState(
                                                                        {
                                                                          selectedTraineeId:
                                                                            selectedTrainee.key,
                                                                          traineeName:
                                                                            selectedTrainee.value,
                                                                        }
                                                                      );
                                                                    } else {
                                                                      this.setState(
                                                                        {
                                                                          selectedTraineeId:
                                                                            null,
                                                                          traineeName:
                                                                            newValue,
                                                                        }
                                                                      );
                                                                    }
                                                                  }}
                                                                  list="traineesId"
                                                                  autoComplete="off"
                                                                />
                                                                <datalist id="traineesId">
                                                                  {traineesOpt.map(
                                                                    traineeOpt => (
                                                                      <option
                                                                        key={
                                                                          traineeOpt.key
                                                                        }
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
                                                                <Label for="startDate">
                                                                  {this.props.t(
                                                                    "Start Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="startDate"
                                                                  className={`form-control`}
                                                                  type="date"
                                                                  value={
                                                                    values.startDate
                                                                      ? new Date(
                                                                          values.startDate
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
                                                                  id="startDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="endDate">
                                                                  {this.props.t(
                                                                    "End Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="endDate"
                                                                  className={`form-control`}
                                                                  type="date"
                                                                  value={
                                                                    values.endDate
                                                                      ? new Date(
                                                                          values.endDate
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
                                                                  id="endDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </Col>
                                                  <Col lg="6">
                                                    <Card>
                                                      <CardBody>
                                                        <div className="bordered">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="decreeNum">
                                                                  {this.props.t(
                                                                    "Decree Num"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  type="text"
                                                                  name="decreeNum"
                                                                  id="decreeNum"
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
                                                                <Label for="decreeDate">
                                                                  {this.props.t(
                                                                    "Decree Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="decreeDate"
                                                                  className={`form-control`}
                                                                  type="date"
                                                                  value={
                                                                    values.decreeDate
                                                                      ? new Date(
                                                                          values.decreeDate
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
                                                                  id="decreeDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div
                                                            // className="upload-box1"
                                                            onClick={() =>
                                                              document
                                                                .getElementById(
                                                                  "fileInput"
                                                                )
                                                                .click()
                                                            }
                                                          >
                                                            <div className="upload-content text-center">
                                                              <div className="upload-icon-wrapper">
                                                                <i className="bx bx-upload upload-icon"></i>
                                                              </div>
                                                              <p className="upload-text">
                                                                {this.props.t(
                                                                  "Click or drag file to upload"
                                                                )}
                                                              </p>
                                                            </div>

                                                            <input
                                                              id="fileInput"
                                                              name="file"
                                                              type="file"
                                                              className="d-none"
                                                              onChange={event => {
                                                                this.props.setFieldValue(
                                                                  "file",
                                                                  event
                                                                    .currentTarget
                                                                    .files[0]
                                                                );
                                                              }}
                                                            />
                                                          </div>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label
                                                                  for="decreeStatus-Id"
                                                                  className="form-label d-flex"
                                                                >
                                                                  {this.props.t(
                                                                    "Decree Status"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <div className="d-flex flex-wrap gap-3">
                                                                  <div
                                                                    className="btn-group button-or"
                                                                    role="group"
                                                                  >
                                                                    {decisionStatus.map(
                                                                      (
                                                                        status,
                                                                        index
                                                                      ) => (
                                                                        <React.Fragment
                                                                          key={
                                                                            index
                                                                          }
                                                                        >
                                                                          <input
                                                                            type="radio"
                                                                            className={`btn-check button-or ${
                                                                              selectedDecreeStatus ===
                                                                              status.Id
                                                                                ? "active"
                                                                                : ""
                                                                            }`}
                                                                            name="decreeStatusId"
                                                                            id={`btnradio${index}`}
                                                                            autoComplete="off"
                                                                            defaultChecked={
                                                                              selectedDecreeStatus ===
                                                                              status.Id
                                                                                ? "active"
                                                                                : ""
                                                                            }
                                                                            onChange={() => {
                                                                              setFieldValue(
                                                                                "decreeStatusId",
                                                                                status.Id
                                                                              );

                                                                              this.setState(
                                                                                {
                                                                                  selectedDecreeStatus:
                                                                                    status.Id,
                                                                                }
                                                                              );
                                                                            }}
                                                                          />
                                                                          <Label
                                                                            className="btn btn-outline-primary smallButton w-sm"
                                                                            for={`btnradio${index}`}
                                                                          >
                                                                            {
                                                                              status.arTitle
                                                                            }
                                                                          </Label>
                                                                        </React.Fragment>
                                                                      )
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg="6">
                                                    <Card>
                                                      <CardBody>
                                                        <div className="bordered">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="decreeReasonId">
                                                                  {this.props.t(
                                                                    "Decree Reason"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Select
                                                                  name="decreeReasonId"
                                                                  key={`select_decreeReason`}
                                                                  options={
                                                                    decreeReasons
                                                                  }
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onChange={newValue => {
                                                                    this.handleSelect(
                                                                      "decreeReasonId",
                                                                      newValue.value,
                                                                      values
                                                                    );
                                                                  }}
                                                                  defaultValue={decreeReasons.find(
                                                                    opt =>
                                                                      opt.value ===
                                                                      writtenWarningDecree?.decreeReasonId
                                                                  )}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="applyingDate">
                                                                  {this.props.t(
                                                                    "Applying Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="applyingDate"
                                                                  className={`form-control `}
                                                                  type="date"
                                                                  value={
                                                                    values.applyingDate
                                                                      ? new Date(
                                                                          values.applyingDate
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
                                                                  id="applyingDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="note">
                                                                  {this.props.t(
                                                                    "Notes"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  type="textarea"
                                                                  name="note"
                                                                  as="textarea"
                                                                  id="note"
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
                                                                <Label for="userName-Id">
                                                                  {this.props.t(
                                                                    "User Name"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="userNameId"
                                                                  as="input"
                                                                  id="userName-Id"
                                                                  type="text"
                                                                  placeholder="Search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  value={
                                                                    employeesNames.find(
                                                                      empl =>
                                                                        empl.key ===
                                                                        this
                                                                          .state
                                                                          .selectedUserNameId
                                                                    )?.value ||
                                                                    ""
                                                                  }
                                                                  onChange={e => {
                                                                    const newValue =
                                                                      e.target
                                                                        .value;

                                                                    const selectedUserName =
                                                                      employeesNames.find(
                                                                        empl =>
                                                                          empl.value ===
                                                                          newValue
                                                                      );

                                                                    if (
                                                                      selectedUserName
                                                                    ) {
                                                                      this.setState(
                                                                        {
                                                                          selectedUserNameId:
                                                                            selectedUserName.key,
                                                                          userName:
                                                                            selectedUserName.value,
                                                                        }
                                                                      );
                                                                    } else {
                                                                      this.setState(
                                                                        {
                                                                          selectedUserNameId:
                                                                            null,
                                                                          userName:
                                                                            newValue,
                                                                        }
                                                                      );
                                                                    }
                                                                  }}
                                                                  list="userNames"
                                                                  autoComplete="off"
                                                                />

                                                                <datalist id="userNames">
                                                                  {employeesNames.map(
                                                                    employeesName => (
                                                                      <option
                                                                        key={
                                                                          employeesName.key
                                                                        }
                                                                        value={
                                                                          employeesName.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </Col>
                                                  <Col lg="6">
                                                    <Card>
                                                      <CardBody>
                                                        <div className="bordered">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="turnReasonId">
                                                                  {this.props.t(
                                                                    "Turn Reason"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Select
                                                                  name="turnReasonId"
                                                                  key={`select_turnReason`}
                                                                  options={
                                                                    turnReasons
                                                                  }
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onChange={newValue => {
                                                                    this.handleSelect(
                                                                      "turnReasonId",
                                                                      newValue.value,
                                                                      values
                                                                    );
                                                                  }}
                                                                  defaultValue={turnReasons.find(
                                                                    opt =>
                                                                      opt.value ===
                                                                      writtenWarningDecree?.turnReasonId
                                                                  )}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="turnDate">
                                                                  {this.props.t(
                                                                    "Turn Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="turnDate"
                                                                  className={`form-control `}
                                                                  type="date"
                                                                  value={
                                                                    values.turnDate
                                                                      ? new Date(
                                                                          values.turnDate
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
                                                                  id="turnDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="turnNote">
                                                                  {this.props.t(
                                                                    "Notes"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  type="textarea"
                                                                  name="turnNote"
                                                                  as="textarea"
                                                                  id="turnNote"
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
                                                                <Label for="turnUserName-Id">
                                                                  {this.props.t(
                                                                    "User Name"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="turnUserNameId"
                                                                  as="input"
                                                                  id="turnUserName-Id"
                                                                  type="text"
                                                                  placeholder="Search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  value={
                                                                    employeesNames.find(
                                                                      empl =>
                                                                        empl.key ===
                                                                        this
                                                                          .state
                                                                          .selectedTurnUserNameId
                                                                    )?.value ||
                                                                    ""
                                                                  }
                                                                  onChange={e => {
                                                                    const newValue =
                                                                      e.target
                                                                        .value;

                                                                    const selectedTurnUserName =
                                                                      employeesNames.find(
                                                                        empl =>
                                                                          empl.value ===
                                                                          newValue
                                                                      );

                                                                    if (
                                                                      selectedTurnUserName
                                                                    ) {
                                                                      this.setState(
                                                                        {
                                                                          selectedTurnUserNameId:
                                                                            selectedTurnUserName.key,
                                                                          turnUserName:
                                                                            selectedTurnUserName.value,
                                                                        }
                                                                      );
                                                                    } else {
                                                                      this.setState(
                                                                        {
                                                                          selectedTurnUserNameId:
                                                                            null,
                                                                          turnUserName:
                                                                            newValue,
                                                                        }
                                                                      );
                                                                    }
                                                                  }}
                                                                  list="turnUserNames"
                                                                  autoComplete="off"
                                                                />

                                                                <datalist id="turnUserNames">
                                                                  {employeesNames.map(
                                                                    employeesName => (
                                                                      <option
                                                                        key={
                                                                          employeesName.key
                                                                        }
                                                                        value={
                                                                          employeesName.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </Col>
                                                </Row>
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
                                        );
                                      }}
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

const mapStateToProps = ({
  writtenWarningDecrees,
  absenceWarnings,
  trainees,
  years,
  menu_items,
  decisions,
  employees,
}) => ({
  writtenWarningDecrees: writtenWarningDecrees.writtenWarningDecrees,
  deleted: writtenWarningDecrees.deleted,
  decreeReasons: absenceWarnings.decreeReasons,
  turnReasons: absenceWarnings.turnReasons,
  years: years.years,
  employeesNames: employees.employeesNames,
  traineesOpt: trainees.traineesOpt,
  decisionStatus: decisions.decisionStatus,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetWrittenWarningDecrees: () => dispatch(getWrittenWarningDecrees()),
  onAddNewWrittenWarningDecree: writtenWarningDecree =>
    dispatch(addNewWrittenWarningDecree(writtenWarningDecree)),
  onUpdateWrittenWarningDecree: writtenWarningDecree =>
    dispatch(updateWrittenWarningDecree(writtenWarningDecree)),
  onDeleteCWrittenWarningDecree: writtenWarningDecree =>
    dispatch(deleteWrittenWarningDecree(writtenWarningDecree)),
  onGetWrittenWarningDecreeDeletedValue: () =>
    dispatch(getWrittenWarningDecreeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(WrittenWarningDecreesList));
