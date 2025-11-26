import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import * as Yup from "yup";
import Select from "react-select";
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
  FormGroup,
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
  getPositions,
  addNewPosition,
  updatePosition,
  deletePosition,
  getPositionDeletedValue,
  getJobTitles,
  addNewJobTitle,
  updateJobTitle,
  deleteJobTitle,
} from "store/job&position/actions";
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
import academicLoadSaga from "store/academicloads/saga";
class PositionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positions: [],
      position: "",
      jobTitles: [],
      selectConId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      deleteModal: false,
      deleteModal1: false,
      duplicateError: null,
      selectedRowId: null,
      selectedRow: null,
      modal: false,
      modal2: false,
      isEdit: false,
      isOpen: false,
      isAdd: false,
      selectedPositionType: null,
      selectedPositionId: 0,
      positionTypeError: false,
      positionError: false,
      errorMessage: null,
      successMessage: null,
      values: "",
      isNestedModalOpen: false,
      isModalOpen: false,
      isShowJobTitle: false,
      languageState: "",
      successMessage: null,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      positions,
      jobTitles,
      i18n,
      positionTypes,
      corporateNodesOpt,
      positionsOpt,
      onGetPositions,
      deleted,
      user_menu,
      employees,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (position && !positions.length) {
    //   onGetPositions();
    // }
    onGetPositions(lang);
    this.setState({
      positions,
      deleted,
      positionTypes,
      corporateNodesOpt,
      positionsOpt,
      languageState: lang,
      jobTitles,
    });
    i18n.on("languageChanged", this.handleLanguageChange);
  }
  handleLanguageChange = lng => {
    const { onGetPositions } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
      onGetPositions(lng);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
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

  toggleDeleteModal1 = () => {
    this.setState(prevState => ({
      deleteModal1: !prevState.deleteModal1,
    }));
  };

  toggleLanguage = () => {
    this.setState(prevState => ({
      languageState: prevState.languageState === "ar" ? "en" : "ar",
    }));
  };

  toggleNestedModal = () => {
    this.setState(prevState => ({
      isNestedModalOpen: !prevState.isNestedModalOpen,
    }));
  };

  toggleModal = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  onClickDelete1 = rowId => {
    console.log("selectedRowselectedRow", rowId);
    this.setState({ selectedRow: rowId, deleteModal1: true });
  };

  handleDeleteRow = () => {
    const { onDeletePosition } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeletePosition(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleDeleteRow1 = () => {
    const { onDeleteJobTitle } = this.props;
    const { selectedRow } = this.state;

    if (selectedRow !== null) {
      console.log("selectedRowselectedRow", selectedRow);
      onDeleteJobTitle(selectedRow);

      this.setState({
        selectedRow: null,
        deleteModal1: false,
        showAlert: true,
      });
    }
  };

  handleButtonClick = (fieldName, option) => {
    if (fieldName === "hasMinistryApprove") {
      this.setState({ selectedHasMinistryApprove: option });
    }

    if (fieldName === "governmentWorker") {
      this.setState({ selectedGovernmentWorker: option });
    }
  };

  handleSave = values => {
    const {
      selectedOption,
      isEdit,
      position,
      selectedPositionType,
      selectedPositionId,
      isAdd,
      selectedCorporateKey,
    } = this.state;
    const { onAddNewPosition, onUpdatePosition, positions } = this.props;
    values["arTitle"] = values["arTitle"] || "";
    values["enTitle"] = values["enTitle"] || "";
    values["positionCode"] = values["positionCode"] || "";
    values["positionRank"] = values["positionRank"] || "";
    values["positionTypeId"] = selectedPositionType;
    console.log("valuesssssssssssssssssssss", values);

    let positionInfo = {};
    if (
      values.arTitle &&
      values.enTitle &&
      values.positionCode &&
      values.positionRank &&
      positionTypeId !== null
    ) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", positionInfo);
        positionInfo[key] = values[key];
      });

      if (isEdit) {
        console.log("333333", positionInfo);
        onUpdatePosition(positionInfo);
        // onGetDefinePeriods(positionInfo);
        this.toggleNestedModal();
      } else {
        console.log("55555", positionInfo);
        const response = onAddNewPosition(positionInfo);
        if (response?.Id) {
          this.setState({ positionId: response.Id });
        }
        this.setState({ isShowJobTitle: true });
      }
      this.setState({
        errorMessages: {},
      });
      const saveMessage = "Saved successfully ";
      this.setState({
        successMessage: saveMessage,
      });
    } else {
      const errorSaveTraineeMessage = this.props.t(
        "Fill the Required Fields to Save Trainee"
      );
      this.setState({ emptyErroe: errorSaveTraineeMessage }, () => {
        window.scrollTo(0, 0);
      });
    }
  };

  handleSubmit = values => {
    const { isAdd, isEdit1, selectedPositionId, selectedCorporateKey, isEdit } =
      this.state;
    const { onAddNewJobTitle, onUpdateJobTitle, lastAddedId } = this.props;

    console.log("selectedPositionIdselectedPositionId", selectedPositionId);
    values["arJobTitle"] = values["arJobTitle"] || "";
    values["enJobTitle"] = values["enJobTitle"] || "";
    values["jobTitleCode"] = values["jobTitleCode"] || "";
    values["corporateNodeId"] = selectedCorporateKey;
    (values["positionId"] = isEdit ? selectedPositionId : lastAddedId),
      console.log("valuesssssssssssssssssssss", values);

    let jobTitlesInfo = {};
    if (
      values.arJobTitle &&
      values.enJobTitle &&
      values.jobTitleCode &&
      values["corporateNodeId"] !== null
    ) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", jobTitlesInfo);
        jobTitlesInfo[key] = values[key];
      });
      if (isEdit1) {
        console.log("9999999", jobTitlesInfo);
        onUpdateJobTitle(jobTitlesInfo);
        this.toggleModal();
      } else {
        onAddNewJobTitle(jobTitlesInfo);
        this.toggleModal();
      }
      this.setState({
        errorMessages: {},
      });
    } else {
      let emptyError = "";
      if (selectedCorporateKey === undefined) {
        emptyError = "Fill the empty select";
      }

      this.setState({ emptyError: emptyError });
    }
  };

  handleSelect = (fieldName, selectedValue) => {
    if (fieldName == "positionTypeId") {
      this.setState({
        selectedPositionType: selectedValue,
      });
    }
  };

  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
  };

  handleSuccessClose = () => {
    const { onGetPositionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetPositionDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetPositionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetPositionDeletedValue();
  };

  handlePositionClick = arg => {
    console.log("arg", arg);
    const { jobTitles, onGetJobTitles } = this.props;
    console.log("1", arg.jobTitles);
    const filteredJobTitles = jobTitles.filter(
      position => position.key != arg.Id
    );
    console.log("222", filteredJobTitles);

    this.setState({
      position: arg,
      filteredJobTitles: filteredJobTitles,
      selectedPositionId: arg.Id,
      selectedPositionType: arg.positionTypeId,
      selectedPositionId: arg.Id,
      isEdit: true,
      isOpen: false,
    });

    onGetJobTitles(arg.Id);
    this.toggleNestedModal();
  };

  handleJobTitlesClick = arg => {
    console.log("arg", arg);

    this.setState({
      position: arg,
      selectedCorporateKey: arg.corporateNodeId,
      isEdit1: true,
    });
    this.toggleModal();
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleChangeOption = event => {
    const { onGetScheduleTimings, onGetScheduleTimingDescs, onGetHallTimings } =
      this.props;
    this.setState({
      selectedOption: event.target.value,
    });
  };

  handleSelectChange = (fieldName, selectedValue, values) => {
    console.log("selectedValue", selectedValue);
    const { positionTypes, positionsOpt } = this.props;

    if (fieldName == "positionTypeId") {
      const name = positionTypes.find(
        positionType => positionType.value === selectedValue
      );

      this.setState({
        selectedPositionType: selectedValue,
        positionTypeId: name.label,
      });
    }

    if (fieldName == "positionId") {
      const name = positionsOpt.find(
        position => position.value === selectedValue
      );

      this.setState({
        selectedPositionId: selectedValue,
        positionId: name.label,
      });
    }
  };

  render() {
    const {
      positions,
      jobTitles,
      corporateNodesOpt,
      positionTypes,
      positionsOpt,
      t,
      deleted,
    } = this.props;
    const {
      duplicateError,
      isEdit1,
      deleteModal,
      deleteModal1,
      isEdit,
      emptyError,
      showAlert,
      selectedOption,
      corporateNodeError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      isNestedModalOpen,
      isModalOpen,
      position,
      positionTypeError,
      positionError,
      isShowJobTitle,
      languageState,
      errorMessage,
      successMessage,
    } = this.state;

    const direction = languageState === "ar" ? "rtl" : "ltr";

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
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: languageState === "ar" ? "arTitle" : "enTitle",
        text:
          languageState === "ar"
            ? this.props.t("Position(ar)")
            : this.props.t("Position(en)"),
        sort: true,
        editable: false,
      },
      {
        dataField: "positionCode",
        text: this.props.t("Position Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "positionTypeId",
        text: this.props.t("Position Type"),
        sort: true,
        editable: false,
      },
      {
        dataField: "positionRank",
        text: this.props.t("Position Rank"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, position) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Edit")} placement="top">
              <IconButton onClick={() => this.handlePositionClick(position)}>
                <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
              </IconButton>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <IconButton onClick={() => this.onClickDelete(position)}>
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const columns2 = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "arJobTitle",
        text: this.props.t("Job Title(ar)"),
        sort: true,
        editable: false,
      },
      {
        dataField: "enJobTitle",
        text: this.props.t("Job Title(en)"),
        sort: true,
        editable: false,
      },
      {
        dataField: "jobTitleCode",
        text: this.props.t("Job Title Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "corporateNodeId",
        text: this.props.t("Corporate Node"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, JobTitle) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Edit")} placement="top">
              <IconButton onClick={() => this.handleJobTitlesClick(JobTitle)}>
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="editjobtooltip"
                ></i>
              </IconButton>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <IconButton onClick={() => this.onClickDelete1(JobTitle)}>
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletejobtooltip"
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: positions.length,
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
        <div dir={direction} className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              breadcrumbItem={this.props.t("Positions & Job Titles")}
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
                        data={positions}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={positions}
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
                                          onClick={this.toggleNestedModal}
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
                                  data={positions}
                                  columns={columns}
                                  cellEdit={cellEditFactory({
                                    mode: "click",
                                    blurToSave: true,
                                    afterSaveCell: (
                                      oldValue,
                                      newValue,
                                      row,
                                      column
                                    ) => {
                                      row.Id, column.dataField, newValue;
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Positions found"
                                  )}
                                  defaultSorted={defaultSorting}
                                />
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                                <Modal
                                  isOpen={isNestedModalOpen}
                                  toggle={this.toggleNestedModal}
                                >
                                  <ModalHeader toggle={this.toggleNestedModal}>
                                    {isEdit
                                      ? t("Edit Position")
                                      : t("Add Position")}
                                  </ModalHeader>
                                  <ModalBody>
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
                                              onClick={this.handleErrorClose}
                                            ></button>
                                          </Alert>
                                        )}
                                      </div>
                                      <div>
                                        {successMessage && (
                                          <Alert
                                            color="success"
                                            className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                            role="alert"
                                          >
                                            {successMessage}
                                            <button
                                              type="button"
                                              className="btn-close"
                                              aria-label="Close"
                                              onClick={this.handleSuccessClose}
                                            ></button>
                                          </Alert>
                                        )}
                                      </div>
                                    </Row>
                                    <div>
                                      <div>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            ...(isEdit &&
                                              position && {
                                                Id: position.Id,
                                              }),
                                            arTitle:
                                              (position && position.arTitle) ||
                                              "",
                                            enTitle:
                                              (position && position.enTitle) ||
                                              "",
                                            positionTypeId:
                                              (position &&
                                                position.positionTypeId) ||
                                              "",
                                            positionRank:
                                              (position &&
                                                position.positionRank) ||
                                              "",
                                            positionCode:
                                              (position &&
                                                position.positionCode) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            arTitle: Yup.string().required(
                                              "Please Enter Your Position in Arabic"
                                            ),
                                            enTitle: Yup.string().required(
                                              "Please Enter Your Position in English"
                                            ),
                                            positionRank: Yup.string().required(
                                              "Please Enter Your Position Rank"
                                            ),
                                            positionCode: Yup.string().required(
                                              "Please Enter Your Position Code"
                                            ),
                                          })}
                                          onSubmit={values => {}}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleChange,
                                            handleBlur,
                                          }) => (
                                            <>
                                              <DeleteModal
                                                show={deleteModal1}
                                                onDeleteClick={
                                                  this.handleDeleteRow1
                                                }
                                                onCloseClick={() =>
                                                  this.setState({
                                                    deleteModal1: false,
                                                    selectedRow: null,
                                                  })
                                                }
                                              />
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
                                                        this.handleAlertClose(
                                                          "duplicateError"
                                                        )
                                                      }
                                                    ></button>
                                                  </Alert>
                                                )}
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
                                                        this.handleErrorClose
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
                                                        this.handleSuccessClose
                                                      }
                                                    ></button>
                                                  </Alert>
                                                )}
                                              </div>
                                              <Form className="needs-validation">
                                                <div className="bordered">
                                                  <Row>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">
                                                          {t("Position(ar)")}
                                                        </Label>
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                        <Field
                                                          name="arTitle"
                                                          placeholder={t(
                                                            "Position(ar)"
                                                          )}
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            (errors.arTitle &&
                                                            touched.arTitle
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                        />
                                                        <ErrorMessage
                                                          name="arTitle"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom05">
                                                          {t("Position(en)")}
                                                        </Label>
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                        <Field
                                                          name="enTitle"
                                                          placeholder={t(
                                                            "Position(en)"
                                                          )}
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            (errors.enTitle &&
                                                            touched.enTitle
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                        />
                                                        <ErrorMessage
                                                          name="enTitle"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>

                                                  <Row>
                                                    <Col className="col-6">
                                                      <FormGroup className="mb-3">
                                                        <Label for="positionTypeId">
                                                          {this.props.t(
                                                            "Position Type"
                                                          )}
                                                        </Label>
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                        <Select
                                                          className={`form-control ${
                                                            positionTypeError
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                          name="positionTypeId"
                                                          id="positionTypeId"
                                                          key="positionType_select"
                                                          options={
                                                            positionTypes
                                                          }
                                                          onChange={newValue =>
                                                            this.handleSelectChange(
                                                              "positionTypeId",
                                                              newValue.value,
                                                              values
                                                            )
                                                          }
                                                          defaultValue={positionTypes.find(
                                                            opt =>
                                                              opt.value ===
                                                              position?.positionTypeId
                                                          )}
                                                        />
                                                        {positionTypeError && (
                                                          <div className="invalid-feedback">
                                                            {this.props.t(
                                                              "Position Type is required"
                                                            )}
                                                          </div>
                                                        )}
                                                        <ErrorMessage
                                                          name="positionTypeId"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom02">
                                                          {t("Position Rank")}
                                                        </Label>
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                        <Field
                                                          name="positionRank"
                                                          placeholder={t(
                                                            "Position Rank"
                                                          )}
                                                          type="number"
                                                          className={
                                                            "form-control" +
                                                            (errors.positionRank &&
                                                            touched.positionRank
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                        />
                                                        <ErrorMessage
                                                          name="positionRank"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom03">
                                                          {t("Position Code")}
                                                        </Label>
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                        <Field
                                                          name="positionCode"
                                                          placeholder={t(
                                                            "Position Code"
                                                          )}
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            (errors.positionCode &&
                                                            touched.positionCode
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                        />
                                                        <ErrorMessage
                                                          name="positionCode"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                </div>
                                                {(isEdit || isShowJobTitle) && (
                                                  <Row>
                                                    <Row>
                                                      <Col sm="4"></Col>
                                                      {/*    {showAddButton && ( */}
                                                      <Col sm="8">
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
                                                                this.toggleModal
                                                              }
                                                            >
                                                              <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                            </IconButton>
                                                          </Tooltip>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                    <BootstrapTable
                                                      {...toolkitprops.baseProps}
                                                      {...paginationTableProps}
                                                      keyField="Id"
                                                      data={jobTitles}
                                                      defaultSorted={
                                                        defaultSorting
                                                      }
                                                      sectionLabs={
                                                        "table align-middle table-nowrap table-hover"
                                                      }
                                                      //bootstrap4 To make table headings into one format
                                                      bootstrap4
                                                      hover
                                                      columns={columns2}
                                                      cellEdit={cellEditFactory(
                                                        {
                                                          mode: "click",
                                                          blurToSave: true,
                                                        }
                                                      )}
                                                      noDataIndication={t(
                                                        "No Courses Offering"
                                                      )}
                                                    />
                                                  </Row>
                                                )}

                                                <Modal
                                                  isOpen={isModalOpen}
                                                  toggle={this.toggleModal}
                                                >
                                                  <ModalHeader
                                                    toggle={this.toggleModal}
                                                  >
                                                    {isEdit1
                                                      ? t("Edit Job Title")
                                                      : t("Add Job Title")}
                                                  </ModalHeader>
                                                  <ModalBody>
                                                    <Formik
                                                      enableReinitialize={true}
                                                      initialValues={{
                                                        ...(isEdit &&
                                                          position && {
                                                            Id: position.Id,
                                                          }),
                                                        arJobTitle:
                                                          (position &&
                                                            position.arJobTitle) ||
                                                          "",
                                                        enJobTitle:
                                                          (position &&
                                                            position.enJobTitle) ||
                                                          "",
                                                        corporateNodeId:
                                                          (position &&
                                                            position.corporateNodeId) ||
                                                          "",
                                                        jobTitleCode:
                                                          (position &&
                                                            position.jobTitleCode) ||
                                                          "",
                                                      }}
                                                      validationSchema={Yup.object().shape(
                                                        {
                                                          arTitle:
                                                            Yup.string().required(
                                                              "Please Enter Your Job Title in Arabic"
                                                            ),
                                                          enTitle:
                                                            Yup.string().required(
                                                              "Please Enter Your Job Title in English"
                                                            ),
                                                        }
                                                      )}
                                                      onSubmit={values => {}}
                                                    >
                                                      {({
                                                        errors,
                                                        status,
                                                        touched,
                                                        values,
                                                        handleChange,
                                                        handleBlur,
                                                      }) => (
                                                        <>
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
                                                                  this.handleAlertClose(
                                                                    "duplicateError"
                                                                  )
                                                                }
                                                              ></button>
                                                            </Alert>
                                                          )}
                                                          <Form className="needs-validation">
                                                            <div className="bordered">
                                                              <Row>
                                                                <Col md="6">
                                                                  <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom06">
                                                                      {t(
                                                                        "Job Title(ar)"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                    <Field
                                                                      name="arJobTitle"
                                                                      placeholder={t(
                                                                        "Job Title(ar)"
                                                                      )}
                                                                      type="text"
                                                                      className={
                                                                        "form-control" +
                                                                        (errors.arJobTitle &&
                                                                        touched.arJobTitle
                                                                          ? " is-invalid"
                                                                          : "")
                                                                      }
                                                                      autoComplete="Off"
                                                                    />
                                                                    <ErrorMessage
                                                                      name="arJobTitle"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                  <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom05">
                                                                      {t(
                                                                        "Job Title(en)"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                    <Field
                                                                      name="enJobTitle"
                                                                      placeholder={t(
                                                                        "Job Title(en)"
                                                                      )}
                                                                      type="text"
                                                                      className={
                                                                        "form-control" +
                                                                        (errors.enJobTitle &&
                                                                        touched.enJobTitle
                                                                          ? " is-invalid"
                                                                          : "")
                                                                      }
                                                                      autoComplete="Off"
                                                                    />
                                                                    <ErrorMessage
                                                                      name="enJobTitle"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </FormGroup>
                                                                </Col>
                                                              </Row>
                                                              <Row>
                                                                <Col md="6">
                                                                  <FormGroup className="mb-3">
                                                                    <Label for="corporateNode">
                                                                      {t(
                                                                        "Corporate Node"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                    <Field
                                                                      name="corporateNodeId"
                                                                      as="input"
                                                                      type="text"
                                                                      id="corporateNode"
                                                                      placeholder="Search..."
                                                                      className={
                                                                        "form-control" +
                                                                        ((errors.corporateNodeId &&
                                                                          touched.corporateNodeId) ||
                                                                        corporateNodeError
                                                                          ? " is-invalid"
                                                                          : "")
                                                                      }
                                                                      value={
                                                                        corporateNodesOpt.find(
                                                                          h =>
                                                                            h.key ===
                                                                            this
                                                                              .state
                                                                              .selectedCorporateKey
                                                                        )
                                                                          ?.value ||
                                                                        ""
                                                                      }
                                                                      onChange={e => {
                                                                        const newValue =
                                                                          e
                                                                            .target
                                                                            .value;

                                                                        const selectedCorporateNode =
                                                                          corporateNodesOpt.find(
                                                                            h =>
                                                                              h.value ===
                                                                              newValue
                                                                          );

                                                                        if (
                                                                          selectedCorporateNode
                                                                        ) {
                                                                          this.setState(
                                                                            {
                                                                              selectedCorporateKey:
                                                                                selectedCorporateNode.key,
                                                                              corporateNodeName:
                                                                                selectedCorporateNode.value,
                                                                            }
                                                                          );
                                                                        } else {
                                                                          this.setState(
                                                                            {
                                                                              selectedCorporateKey:
                                                                                null,
                                                                              corporateNodeName:
                                                                                newValue,
                                                                            }
                                                                          );
                                                                        }
                                                                      }}
                                                                      list="corporateNodesList"
                                                                      autoComplete="off"
                                                                    />

                                                                    <datalist id="corporateNodesList">
                                                                      {corporateNodesOpt.map(
                                                                        corporateNode => (
                                                                          <option
                                                                            key={`${corporateNode.key}-${corporateNode.strType}`}
                                                                            value={
                                                                              corporateNode.value
                                                                            }
                                                                          />
                                                                        )
                                                                      )}
                                                                    </datalist>
                                                                    {corporateNodeError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Corporate Node is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                  </FormGroup>
                                                                </Col>
                                                                <Col md="6">
                                                                  <FormGroup className="mb-3">
                                                                    <Label htmlFor="validationCustom07">
                                                                      {t(
                                                                        "Job Title Code"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                    <Field
                                                                      name="jobTitleCode"
                                                                      placeholder={t(
                                                                        "Job Title Code"
                                                                      )}
                                                                      type="text"
                                                                      className={
                                                                        "form-control" +
                                                                        (errors.jobTitleCode &&
                                                                        touched.jobTitleCode
                                                                          ? " is-invalid"
                                                                          : "")
                                                                      }
                                                                      autoComplete="Off"
                                                                    />
                                                                    <ErrorMessage
                                                                      name="jobTitleCode"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </FormGroup>
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                            <Row className="justify-content-center">
                                                              <Col
                                                                lg="3"
                                                                className="d-flex justify-content-center"
                                                              >
                                                                <Link
                                                                  className="btn btn-primary me-2"
                                                                  to="#"
                                                                  onClick={() => {
                                                                    this.handleSubmit(
                                                                      values
                                                                    );
                                                                  }}
                                                                >
                                                                  {t("Save")}
                                                                </Link>
                                                              </Col>
                                                            </Row>
                                                          </Form>
                                                        </>
                                                      )}
                                                    </Formik>
                                                  </ModalBody>
                                                </Modal>
                                                <Row className="justify-content-center">
                                                  <Col
                                                    lg="3"
                                                    className="d-flex justify-content-center"
                                                  >
                                                    <Link
                                                      to="#"
                                                      className="btn btn-primary me-2"
                                                      onClick={() => {
                                                        this.handleSave(values);
                                                      }}
                                                    >
                                                      {t("Save")}
                                                    </Link>
                                                  </Col>
                                                </Row>
                                              </Form>
                                            </>
                                          )}
                                        </Formik>
                                      </div>
                                    </div>
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

const mapStateToProps = ({ positions, menu_items, employees }) => ({
  positions: positions.positions,
  jobTitles: positions.jobTitles,
  positionTypes: positions.positionTypes,
  positionsOpt: positions.positionsOpt,
  lastAddedId: positions.lastAddedId,
  corporateNodesOpt: employees.corporateNodesOpt,
  deleted: positions.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetPositions: lng => dispatch(getPositions(lng)),
  onGetJobTitles: position => dispatch(getJobTitles(position)),
  onAddNewPosition: position => dispatch(addNewPosition(position)),
  onUpdatePosition: position => dispatch(updatePosition(position)),
  onDeletePosition: position => dispatch(deletePosition(position)),
  onGetPositionDeletedValue: () => dispatch(getPositionDeletedValue()),
  onAddNewJobTitle: jobTitle => dispatch(addNewJobTitle(jobTitle)),
  onUpdateJobTitle: jobTitle => dispatch(updateJobTitle(jobTitle)),
  onDeleteJobTitle: jobTitle => dispatch(deleteJobTitle(jobTitle)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(PositionsList)));
