import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as moment from "moment";
import Select from "react-select";
import {
  Card,
  CardBody,
  CardHeader,
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
  getJustifyTraineesAbsence,
  addNewJustifyTraineeAbsence,
  updateJustifyTraineeAbsence,
  deleteJustifyTraineeAbsence,
  getJustifyTraineeAbsenceDeletedValue,
} from "store/justifyTraineeAbsence/actions";
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
import justifyTraineesAbsence from "store/justifyTraineeAbsence/reducer";
class JustifyTraineesAbsenceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      justifyTraineesAbsence: [],
      justifyTraineeAbsence: {},
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      isEdit: false,
      traineesOpt: [],
      absencesJustifications: [],
      selectedTraineeKey: "",
      defaultTraineeName: "",
      modal: false,
      modal1: false,
      traineeModal: false,
      selectedTrainee: null,
      selectedReasonId: null,
      selectedJustifiedId: null,
    };
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      fullNameError: false,
      TraineeNumError: false,
      lectureError: false,
      lectureDateError: false,
      absenceTypeError: false,
      reasonError: false,
      courseNameError: false,
    };
  }

  componentDidMount() {
    this.setState({ modal: true });
    const {
      justifyTraineesAbsence,
      onGetJustifyTraineesAbsence,
      traineesOpt,
      absencesJustifications,
      deleted,
      user_menu,
      trainees,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (justifyTraineeAbsence && !justifyTraineesAbsence.length) {
    //   onGetJustifyTraineesAbsence();
    // }
    onGetJustifyTraineesAbsence();

    this.setState({
      justifyTraineesAbsence,
      absencesJustifications,
      trainees,
      traineesOpt,
    });
    this.setState({ deleted });
  }

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
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    const { onAddNewJustifyTraineeAbsence, justifyTraineesAbsence } =
      this.props;

    const newRow = {
      arTitle: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = justifyTraineesAbsence.some(
      justifyTraineesAbsence =>
        justifyTraineesAbsence.arTitle.trim() === "-----"
      // ||
      // justifyTraineeAbsence.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      console.log("11111111111111111");
      onAddNewJustifyTraineeAbsence(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteJustifyTraineeAbsence } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteJustifyTraineeAbsence(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  toggleTrainee = () => {
    this.setState({ traineeModal: !this.state.traineeModal });
  };
  toggle1 = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1,
    }));
  };

  handleJustifyTraineeAbsenceDataChange = (rowId, fieldName, fieldValue) => {
    const { justifyTraineesAbsence, onUpdateJustifyTraineeAbsence } =
      this.props;

    const isDuplicate = justifyTraineesAbsence.some(justifyTraineeAbsence => {
      return (
        justifyTraineeAbsence.Id !== rowId &&
        justifyTraineeAbsence.arTitle.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateJustifyTraineeAbsence(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateJustifyTraineeAbsence(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, newValue) {
    const { onUpdateJustifyTraineeAbsence } = this.props;
    const onUpdate = { Id: rowId, [fieldName]: newValue };
    onUpdateJustifyTraineeAbsence(onUpdate);
  }

  handleSuccessClose = () => {
    const { onGetJustifyTraineeAbsenceDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetJustifyTraineeAbsenceDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetJustifyTraineeAbsenceDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetJustifyTraineeAbsenceDeletedValue();
  };

  handleEditTrainee = arg => {
    console.log("arg", arg);
    this.setState({
      justifyTraineeAbsence: arg,
      isEdit: true,
    });

    this.toggle1();
  };

  handleTraineeSelectByName = name => {
    const selected = this.props.justifyTraineesAbsence.find(
      t => t.fullName === name
    );

    if (selected) {
      this.setState({
        selectedTrainee: selected,
        traineeModal: true,
        searchText: selected.fullName,
      });
    } else {
      this.setState({
        selectedTrainee: null,
        searchText: name,
      });
    }
  };

  handleToggleChange = (field, value) => {
    this.setState({ [field]: value });
  };

  handleSave = values => {
    console.log("values", values);

    const { onAddNewJustifyTraineeAbsence, onUpdateJustifyTraineeAbsence } =
      this.props;
    const { selectedReasonId, selectedJustifiedId } = this.state;

    values["reasonId"] = selectedReasonId;
    values["justifiedId"] = selectedJustifiedId;
    if (
      values.fullName === "" ||
      values.TraineeNum === "" ||
      values.courseName === "" ||
      values.absenceType === "" ||
      values.lecture === "" ||
      values.lectureDate === "" ||
      (values.reasonId === "" && selectedReasonId === "")
    ) {
      this.setState({ fullNameError: true, saveError: true });

      this.setState({ TraineeNumError: true, saveError: true });

      this.setState({ courseNameError: true, saveError: true });

      this.setState({ absenceTypeError: true, saveError: true });

      this.setState({ lectureError: true, saveError: true });

      this.setState({ lectureDateError: true, saveError: true });

      this.setState({ reasonIdError: true, saveError: true });

      const emptyError = this.props.t("Fill the Required Fields to Save");

      this.setState({ emptyError: emptyError });
    } else {
      this.setState({ fullNameError: false, saveError: false });
      this.setState({ TraineeNumError: false, saveError: false });
      this.setState({ courseNameError: false, saveError: false });
      this.setState({ absenceTypeError: false, saveError: false });
      this.setState({ lectureError: false, saveError: false });
      this.setState({ lectureDateError: false, saveError: false });
      this.setState({ reasonIdError: false, saveError: false });

      let justifyTraineeInfo = {};

      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          values[key] !== null &&
          (values[key].length > 0 || values[key] != "")
        )
          justifyTraineeInfo[key] = values[key];
      });
      justifyTraineeInfo["reasonId"] = selectedReasonId;
      justifyTraineeInfo["justifiedId"] = selectedJustifiedId;
      console.log("justifyTraineeInfo", justifyTraineeInfo);

      this.setState({
        errorMessages: {},
      });

      // onUpdateSectionLabDetail(justifyTraineeInfo);

      const saveMessage = "Saved successfully ";
      this.setState({
        successMessage: saveMessage,
      });

      this.toggle1();
    }
  };

  handleSelectChange = (fieldName, selectedValue, values) => {
    const { absencesJustifications } = this.props;

    if (fieldName == "reasonId") {
      const name = absencesJustifications.find(
        justify => justify.value === selectedValue
      );

      this.setState({
        selectedReasonId: selectedValue,
        reasonId: name.label,
        justifyTraineeAbsence: values,
      });
    }
  };

  render() {
    const {
      justifyTraineesAbsence,
      traineesOpt,
      absencesJustifications,
      trainees,
      t,
      deleted,
    } = this.props;
    const {
      emptyError,
      modal,
      isEdit,
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      justifyTraineeAbsence,
      traineeModal,
      modal1,
      selectedTraineeKey,
      defaultTraineeName,
      selectedTrainee,
      selectedJustifiedId,
      selectedReasonId,
      fullNameError,
      TraineeNumError,
      courseNameError,
      lectureDateError,
      lectureError,
      absenceTypeError,
      reasonError,
    } = this.state;
    const traineesArray = Object.values(traineesOpt);
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
        dataField: "serial",
        text: "#",
        formatter: (cell, row, rowIndex) => rowIndex + 1,
      },
      {
        dataField: "arTitle",
        text: this.props.t("Week"),
        sort: true,
        //  editable: showEditButton,
      },

      {
        dataField: "enTitle",
        text: this.props.t("Lecture"),
        sort: true,
        //  editable: showEditButton,
      },

      {
        dataField: "code",
        text: this.props.t("Lecture Date"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "weight",
        text: this.props.t("Start Time"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "endTime",
        text: this.props.t("End Time"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "absenceTypeId",
        text: this.props.t("Absence Type"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "reason",
        text: this.props.t("Reason"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "justified",
        text: this.props.t("Justified"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "justifyDocument",
        text: this.props.t("Justify Document"),
        sort: true,
        //  editable: showEditButton,
      },

      {
        dataField: "Update",
        text: t("Update"),
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, justifyTraineeAbsence) => (
          <div className="d-flex justify-content-center gap-3">
            <Tooltip title={this.props.t("Update")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditTrainee(justifyTraineeAbsence)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: justifyTraineesAbsence.length,
      custom: true,
    };
    return (
      <React.Fragment>
        <div>
          <Formik
            enableReinitialize={true}
            initialValues={{
              traineeId: justifyTraineeAbsence?.traineeId || defaultTraineeName,
            }}
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
                <Modal
                  isOpen={this.state.modal}
                  className={this.props.className}
                  size="lg"
                  centered
                >
                  <ModalHeader toggle={this.toggle} tag="h4">
                    {t("Confirm")}
                  </ModalHeader>

                  <ModalBody>
                    <Row>
                      <Col className="col-4 mb-3">
                        <Label for="inst">{t("Trainee Name")}</Label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col className="col-8">
                        <Field
                          name="traineeId"
                          as="input"
                          type="text"
                          placeholder="Search..."
                          className={
                            "form-control" +
                            (errors.traineeId && touched.traineeId
                              ? " is-invalid"
                              : "")
                          }
                          // value={
                          //   traineesArray.find(
                          //     trainee =>
                          //       trainee.key ===
                          //       this.state.selectedTraineeKey
                          //   )?.value || ""
                          // }
                          // onChange={e => {
                          //   const newValue = e.target.value;
                          //   const selectedTrainee =
                          //     traineesArray.find(
                          //       trainee => trainee.value === newValue
                          //     );

                          //   if (selectedTrainee) {
                          //     this.setState({
                          //       selectedTraineeKey:
                          //         selectedTrainee.key,
                          //       defaultTraineeName:
                          //         selectedTrainee.value,
                          //       traineeModal: true,
                          //     });
                          //   } else {
                          //     this.setState({
                          //       selectedTraineeKey: null,
                          //       defaultTraineeName: newValue,
                          //     });
                          //   }
                          // }}
                          value={this.state.searchText ?? ""}
                          onChange={e =>
                            this.handleTraineeSelectByName(e.target.value)
                          }
                          list="traineeIdList"
                          autoComplete="off"
                        />

                        <datalist id="traineeIdList">
                          {traineesArray.map(employee => (
                            <option key={employee.key} value={employee.value} />
                          ))}
                        </datalist>
                      </Col>
                    </Row>
                  </ModalBody>
                </Modal>
                <Modal
                  isOpen={traineeModal}
                  toggle={this.toggleTrainee}
                  centered
                  fullscreen
                >
                  <ModalHeader toggle={this.toggleTrainee}>
                    {selectedTrainee
                      ? `${selectedTrainee.fullName} [${selectedTrainee.TraineeNum}]`
                      : ""}
                  </ModalHeader>
                  <ModalBody>
                    {this.state.selectedTrainee && (
                      <Card>
                        <Card className=" bordered mt-2">
                          <CardHeader className="card-header">
                            {" "}
                            {selectedTrainee
                              ? `${selectedTrainee.fullName} [${selectedTrainee.TraineeNum}]`
                              : ""}{" "}
                          </CardHeader>
                          <CardBody className="cardBody">
                            <Row>
                              <Col className="col-2">
                                <Label for="traineeStatus">
                                  {this.props.t("Trainee Status")}
                                  {""}
                                </Label>
                              </Col>
                              <Col className="col-4">
                                <Label for="traineeStatus">
                                  {selectedTrainee.traineeStatus}
                                </Label>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        <Card className="bordered mt-2">
                          <CardBody className="cardBody">
                            <div>
                              <BootstrapTable
                                keyField="Id"
                                data={justifyTraineesAbsence}
                                columns={columns}
                                cellEdit={cellEditFactory({
                                  mode: "dbclick",
                                  blurToSave: true,
                                  // afterSaveCell: (
                                  //   oldValue,
                                  //   newValue,
                                  //   row,
                                  //   column
                                  // ) => {
                                  //   this.handleParentsDataChange(
                                  //     row.Id,
                                  //     column.dataField,
                                  //     newValue
                                  //   );
                                  // },
                                })}
                                noDataIndication={t("No Relatives Found")}
                                defaultSorted={defaultSorting}
                              />
                            </div>
                            <Modal
                              isOpen={this.state.modal1}
                              className={this.props.className}
                              size="lg"
                              centered
                            >
                              <ModalHeader toggle={this.toggle1} tag="h4">
                                {t("Update Trainee Absent Justify")} -{" "}
                                {selectedTrainee?.fullName || ""}
                              </ModalHeader>

                              <ModalBody>
                                <Formik
                                  enableReinitialize={true}
                                  initialValues={{
                                    ...(isEdit && {
                                      Id: justifyTraineeAbsence.Id,
                                    }),
                                    fullName:
                                      (justifyTraineeAbsence &&
                                        justifyTraineeAbsence.fullName) ||
                                      "",
                                    TraineeNum:
                                      (justifyTraineeAbsence &&
                                        justifyTraineeAbsence.TraineeNum) ||
                                      "",
                                    courseName:
                                      (justifyTraineeAbsence &&
                                        justifyTraineeAbsence.courseName) ||
                                      "",
                                    week:
                                      (justifyTraineeAbsence &&
                                        justifyTraineeAbsence.week) ||
                                      "",
                                    lecture:
                                      (justifyTraineeAbsence &&
                                        justifyTraineeAbsence.lecture) ||
                                      "",

                                    lectureType:
                                      (justifyTraineeAbsence &&
                                        justifyTraineeAbsence.lectureType) ||
                                      "",
                                    absenceType:
                                      (justifyTraineeAbsence &&
                                        justifyTraineeAbsence.absenceType) ||
                                      "",
                                    lectureDate:
                                      justifyTraineeAbsence?.lectureDate
                                        ? moment
                                            .utc(
                                              justifyTraineeAbsence.lectureDate
                                            )
                                            .local()
                                            .format("YYYY-MM-DD")
                                        : "",
                                    reasonId:
                                      (justifyTraineeAbsence &&
                                        justifyTraineeAbsence.ReasonId) ||
                                      selectedReasonId,
                                    justifiedId:
                                      (justifyTraineeAbsence &&
                                        justifyTraineeAbsence.justifiedId) ||
                                      selectedJustifiedId,
                                    file: null,
                                  }}
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
                                          <Row>
                                            <Col lg="12">
                                              <Row>
                                                <Row className="mb-2">
                                                  <Col className="col-2">
                                                    <Label for="fullName">
                                                      {this.props.t(
                                                        "Trainee Name"
                                                      )}
                                                    </Label>
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </Col>
                                                  <Col className="col-4">
                                                    <Field
                                                      type="text"
                                                      name="fullName"
                                                      id="fullName"
                                                      readOnly
                                                      className={
                                                        "form-control" +
                                                        ((errors.fullName &&
                                                          touched.fullName) ||
                                                        fullNameError
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />

                                                    {fullNameError && (
                                                      <div className="invalid-feedback">
                                                        {this.props.t(
                                                          "Trainee Name is required"
                                                        )}
                                                      </div>
                                                    )}
                                                    <ErrorMessage
                                                      name="fullName"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>

                                                  <Col className="col-2">
                                                    <Label for="TraineeNum">
                                                      {this.props.t(
                                                        "Trainee Num"
                                                      )}
                                                    </Label>
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </Col>
                                                  <Col className="col-4">
                                                    <Field
                                                      type="text"
                                                      name="TraineeNum"
                                                      id="TraineeNum"
                                                      className={
                                                        "form-control" +
                                                        ((errors.TraineeNum &&
                                                          touched.TraineeNum) ||
                                                        TraineeNumError
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    {TraineeNumError && (
                                                      <div className="invalid-feedback">
                                                        {this.props.t(
                                                          "Trainee Num is required"
                                                        )}
                                                      </div>
                                                    )}
                                                    <ErrorMessage
                                                      name="TraineeNum"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>
                                              </Row>
                                              <Row className="mb-2">
                                                <Col className="col-2">
                                                  <Label for="courseName">
                                                    {this.props.t(
                                                      "Course Name"
                                                    )}
                                                  </Label>
                                                  <span className="text-danger">
                                                    *
                                                  </span>
                                                </Col>
                                                <Col className="col-4">
                                                  <Field
                                                    type="text"
                                                    name="courseName"
                                                    id="courseName"
                                                    className={
                                                      "form-control" +
                                                      ((errors.courseName &&
                                                        touched.courseName) ||
                                                      courseNameError
                                                        ? " is-invalid"
                                                        : "")
                                                    }
                                                    readOnly
                                                  />

                                                  {courseNameError && (
                                                    <div className="invalid-feedback">
                                                      {this.props.t(
                                                        "Course Name is required"
                                                      )}
                                                    </div>
                                                  )}
                                                  <ErrorMessage
                                                    name="courseName"
                                                    component="div"
                                                    className="invalid-feedback"
                                                  />
                                                </Col>
                                                <Col className="col-2">
                                                  <Label for="absenceType">
                                                    {this.props.t(
                                                      "Absence Type"
                                                    )}
                                                  </Label>
                                                  <span className="text-danger">
                                                    *
                                                  </span>
                                                </Col>
                                                <Col className="col-4">
                                                  <Field
                                                    type="text"
                                                    name="absenceType"
                                                    id="absenceType"
                                                    className={
                                                      "form-control" +
                                                      ((errors.absenceType &&
                                                        touched.absenceType) ||
                                                      absenceTypeError
                                                        ? " is-invalid"
                                                        : "")
                                                    }
                                                  />

                                                  {absenceTypeError && (
                                                    <div className="invalid-feedback">
                                                      {this.props.t(
                                                        "Absence Type is required"
                                                      )}
                                                    </div>
                                                  )}
                                                  <ErrorMessage
                                                    name="absenceType"
                                                    component="div"
                                                    className="invalid-feedback"
                                                  />
                                                </Col>
                                              </Row>
                                              <Row className="mb-2">
                                                <Col className="col-2">
                                                  <Label for="week">
                                                    {this.props.t("Week")}
                                                  </Label>
                                                  <span className="text-danger">
                                                    *
                                                  </span>
                                                </Col>
                                                <Col className="col-4">
                                                  <Field
                                                    type="text"
                                                    name="week"
                                                    id="week"
                                                    className={"form-control"}
                                                  />
                                                </Col>
                                                <Col className="col-2">
                                                  <Label for="lecture">
                                                    {this.props.t("Lecture")}
                                                  </Label>
                                                  <span className="text-danger">
                                                    *
                                                  </span>
                                                </Col>
                                                <Col className="col-4">
                                                  <Field
                                                    type="text"
                                                    name="lecture"
                                                    id="lecture"
                                                    className={
                                                      "form-control" +
                                                      ((errors.lecture &&
                                                        touched.lecture) ||
                                                      lectureError
                                                        ? " is-invalid"
                                                        : "")
                                                    }
                                                  />

                                                  {lectureError && (
                                                    <div className="invalid-feedback">
                                                      {this.props.t(
                                                        "Lecture is required"
                                                      )}
                                                    </div>
                                                  )}
                                                  <ErrorMessage
                                                    name="lecture"
                                                    component="div"
                                                    className="invalid-feedback"
                                                  />
                                                </Col>
                                              </Row>
                                              <Row className="mb-2">
                                                <Col className="col-2">
                                                  <Label for="lectureType">
                                                    {this.props.t(
                                                      "Lecture Type"
                                                    )}
                                                  </Label>
                                                </Col>
                                                <Col className="col-4">
                                                  <Field
                                                    type="text"
                                                    name="lectureType"
                                                    id="lectureType"
                                                    className={"form-control"}
                                                  />
                                                </Col>
                                                <Col className="col-2">
                                                  <Label for="lectureDate">
                                                    {this.props.t(
                                                      "Lecture Date"
                                                    )}
                                                  </Label>
                                                  <span className="text-danger">
                                                    *
                                                  </span>
                                                </Col>
                                                <Col className="col-4">
                                                  <Field
                                                    name="lectureDate"
                                                    className={`form-control ${
                                                      lectureDateError
                                                        ? "is-invalid"
                                                        : ""
                                                    }`}
                                                    type="date"
                                                    value={
                                                      values.lectureDate
                                                        ? new Date(
                                                            values.lectureDate
                                                          )
                                                            .toISOString()
                                                            .split("T")[0]
                                                        : ""
                                                    }
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    id="lectureDate-date-input"
                                                  />
                                                  {lectureDateError && (
                                                    <div className="invalid-feedback">
                                                      {this.props.t(
                                                        "Lecture Date is required"
                                                      )}
                                                    </div>
                                                  )}
                                                </Col>
                                              </Row>
                                              <Row className="mb-2">
                                                <Col className="col-2">
                                                  <Label for="reasonId">
                                                    {this.props.t("Reason")}
                                                  </Label>
                                                  <span className="text-danger">
                                                    *
                                                  </span>
                                                </Col>
                                                <Col className="col-4">
                                                  <Select
                                                    className={`form-control ${
                                                      reasonError
                                                        ? "is-invalid"
                                                        : ""
                                                    }`}
                                                    name="reasonId"
                                                    id="reasonId"
                                                    key="reason_select"
                                                    options={
                                                      absencesJustifications
                                                    }
                                                    onChange={newValue =>
                                                      this.handleSelectChange(
                                                        "reasonId",
                                                        newValue.value,
                                                        values
                                                      )
                                                    }
                                                    defaultValue={absencesJustifications.find(
                                                      opt =>
                                                        opt.value ===
                                                        justifyTraineeAbsence?.reasonId
                                                    )}
                                                  />
                                                </Col>
                                                {reasonError && (
                                                  <div className="invalid-feedback">
                                                    {this.props.t(
                                                      "Reason is required"
                                                    )}
                                                  </div>
                                                )}
                                                <ErrorMessage
                                                  name="reasonId"
                                                  component="div"
                                                  className="invalid-feedback"
                                                />
                                                <Col className="col-2">
                                                  <Label for="justifiedId">
                                                    {this.props.t("Justified")}
                                                  </Label>
                                                </Col>
                                                <Col className="col-4">
                                                  <div className={"btn-group"}>
                                                    <button
                                                      type="button"
                                                      className={`btn ${
                                                        selectedJustifiedId ===
                                                        1
                                                          ? "btn-primary"
                                                          : "btn-outline-secondary"
                                                      }`}
                                                      onClick={() =>
                                                        this.handleToggleChange(
                                                          "selectedJustifiedId",
                                                          1
                                                        )
                                                      }
                                                    >
                                                      {this.props.t("Yes")}
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className={`btn ${
                                                        selectedJustifiedId ===
                                                        0
                                                          ? "btn-primary"
                                                          : "btn-outline-secondary"
                                                      }`}
                                                      onClick={() =>
                                                        this.handleToggleChange(
                                                          "selectedJustifiedId",
                                                          0
                                                        )
                                                      }
                                                    >
                                                      {this.props.t("No")}
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <div
                                                  className="upload-box"
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
                                                        "Click to upload"
                                                      )}
                                                    </p>
                                                  </div>

                                                  <input
                                                    id="fileInput"
                                                    name="file"
                                                    type="file"
                                                    className="d-none"
                                                    onChange={
                                                      this.handleFileChange
                                                    }
                                                  />
                                                  {this.state.filePreview &&
                                                    (typeof this.state
                                                      .filePreview ===
                                                      "string" &&
                                                    this.state.filePreview.startsWith(
                                                      "data:"
                                                    ) ? (
                                                      <img
                                                        src={
                                                          this.state.filePreview
                                                        }
                                                        alt="Preview"
                                                        style={{
                                                          width: 100,
                                                        }}
                                                      />
                                                    ) : (
                                                      this.state.filePreview
                                                    ))}
                                                </div>
                                              </Row>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col>
                                              <div className="text-center">
                                                <Link
                                                  to="#"
                                                  className="btn btn-primary me-2"
                                                  onClick={() => {
                                                    this.handleSave(values);
                                                  }}
                                                >
                                                  {t("Save")}
                                                </Link>
                                              </div>
                                            </Col>
                                          </Row>
                                        </CardBody>
                                      </Card>
                                    </Form>
                                  )}
                                </Formik>
                              </ModalBody>
                            </Modal>
                          </CardBody>
                        </Card>
                      </Card>
                    )}
                  </ModalBody>
                </Modal>
              </Form>
            )}
          </Formik>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  justifyTraineesAbsence,
  absencesJustifications,
  menu_items,
  trainees,
}) => ({
  justifyTraineesAbsence: justifyTraineesAbsence.justifyTraineesAbsence,
  absencesJustifications: absencesJustifications.absencesJustifications,
  traineesOpt: trainees.traineesOpt,
  trainees: trainees.trainees,
  deleted: justifyTraineesAbsence.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetJustifyTraineesAbsence: () => dispatch(getJustifyTraineesAbsence()),
  onAddNewJustifyTraineeAbsence: justifyTraineeAbsence =>
    dispatch(addNewJustifyTraineeAbsence(justifyTraineeAbsence)),
  onUpdateJustifyTraineeAbsence: justifyTraineeAbsence =>
    dispatch(updateJustifyTraineeAbsence(justifyTraineeAbsence)),
  onDeleteJustifyTraineeAbsence: justifyTraineeAbsence =>
    dispatch(deleteJustifyTraineeAbsence(justifyTraineeAbsence)),
  onGetJustifyTraineeAbsenceDeletedValue: () =>
    dispatch(getJustifyTraineeAbsenceDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(JustifyTraineesAbsenceList));
