import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
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
  getCoursesCatalogs,
  addNewCoursesCatalog,
  updateCoursesCatalog,
  deleteCoursesCatalog,
  getCoursesCatalogDeletedValue,
} from "store/CourseCataloge/actions";

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
} from "../../utils/menuUtils";
class CourseCatalogeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coursesCatalogs: [],
      courseCataloge: "",
      selectConId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      trainingSectorOptions: [],
      trainingProgramOptions: [],
      trainingModuleOptions: [],
      trainingTypeOptions: [],
    };
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      modal2: false,
      isEdit: false,
      isOpen: false,
      isAdd: false,
      selectedWorkClassification: "",
      selectedJobTitle: "",
      selectedCostCenter: "",
      selectedJobRank: "",
      errorMessage: null,
      successMessage: null,
      values: "",
      prerequisiteCoursesArray: [],
      duplicateErrorPrerequisite: "",
      lastUsedId: 1,

      selectedTrainingSector: "",
      selectedTrainingProgram: "",
      selectedTrainingModule: "",
      selectedTrainingType: "",
      selectedTrainingFormat: "",
      arCoursenameError: false,
      enCoursenameError: false,
      trainingProgramError: false,
      courseCodeError: false,
      courseTypeError: false,
    };
    this.toggle = this.toggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const { coursesCatalogs, deleted, user_menu  , onGetCoursesCatalogs} = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

   // onGetCoursesCatalogs();

    this.setState({
      coursesCatalogs,
      deleted,
    });
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

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      emptyError: "",
      arCoursenameError: false,
      enCoursenameError: false,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      courseCataloge: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleDeleteRow = () => {
    const { onDeleteCoursesCatalog } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteCoursesCatalog(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleAddRowPrerequisite = () => {
    const { prerequisiteCoursesArray, lastUsedId } = this.state;

    const emptyRowsExist = prerequisiteCoursesArray.some(
      prereq => prereq.prerequisiteCourseName.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorPrerequisite: errorMessage });
    } else {
      const newPrerequisite = {
        Id: lastUsedId,
        prerequisiteCourseName: "",
        registerCondition: null,
      };

      this.setState({
        prerequisiteCoursesArray: [
          ...prerequisiteCoursesArray,
          newPrerequisite,
        ],
        lastUsedId: lastUsedId + 1,
        duplicateErrorPrerequisite: null,
      });
    }
  };

  handlePrerequisiteChange = (id, fieldName, value) => {
    this.setState(prevState => {
      const updateprerequisiteCourses = prevState.relativesArray.map(prereq => {
        if (prereq.Id === id) {
          return {
            ...prereq,
            [fieldName]: newValue,
          };
        }
        return prereq;
      });

      return {
        prerequisiteCoursesArray: updateprerequisiteCourses,
      };
    });
  };

  handleSelectChangeDetails = (rowId, fieldName, selectedValue) => {
    this.setState(prevState => {
      const updateprerequisiteCourses = prevState.prerequisiteCoursesArray.map(
        prereq => {
          if (relative.Id === rowId) {
            return {
              ...prereq,
              [fieldName]: selectedValue,
            };
          }
          return relative;
        }
      );

      return {
        relativesArray: updateprerequisiteCourses,
      };
    });
  };

  handleSubmit = values => {
    console.log("values", values);
    const {
      selectedTrainingSector,
      selectedTrainingProgram,
      selectedTrainingType,
      selectedTrainingFormat,
      isEdit,
      isAdd,
      prerequisiteCoursesArray,
      arCoursenameError,
      enCoursenameError,
      emptyError,
    } = this.state;

    let isSelectError = false;

    // Trim and sanitize inputs
    values["courseNameAr"] = values["courseNameAr"]?.trim() || "";
    values["courseNameEn"] = values["courseNameEn"]?.trim() || "";
    values["trainingSector"] = selectedTrainingSector;
    values["trainingProgram"] = selectedTrainingProgram;
    values["courseCode"] = values["courseCode"]?.trim() || "";
    values["courseType"] = selectedTrainingType;
    values["totalTrainingHours"] = values["totalTrainingHours"] || "";
    values["trainingModule"] = values["trainingModule"]?.trim() || "";
    values["trainingFormat"] = selectedTrainingFormat;
    values["descriptionAr"] = values["descriptionAr"] || "";
    values["descriptionEn"] = values["descriptionEn"] || "";

    // Basic validations for required fields
    if (values.courseNameAr === "") {
      this.setState({ arCoursenameError: true });
    }

    if (values.courseNameEn === "") {
      this.setState({ enCoursenameError: true });
    }

    if (
      !selectedTrainingSector ||
      !selectedTrainingFormat ||
      !selectedTrainingProgram ||
      !selectedTrainingType
    ) {
      isSelectError = true;
    }

    if (arCoursenameError || enCoursenameError || isSelectError) {
      this.setState({ emptyError: "Please fill all required fields" });
      return false;
    }

    let courseCatalogInfo = {};

    courseCatalogInfo["prerequisiteCourses"] = prerequisiteCoursesArray;

    Object.keys(values).forEach(key => {
      if (values[key] !== undefined && values[key] !== "") {
        courseCatalogInfo[key] = values[key];
      }
    });

    if (isEdit) {
      console.log("Updating contract:", courseCatalogInfo);
      // onUpdateCoursesCatalog(courseCatalogInfo);
    } else if (isAdd) {
      console.log("Adding new contract:", courseCatalogInfo);
      // onAddNewCoursesCatalog(courseCatalogInfo);
    }

    this.setState({ errorMessages: {} });
    this.setState({
      arCoursenameError: false,
      enCoursenameError: false,
      emptyError: "",
    });

    this.toggle();
  };

  handleSelect = (fieldName, selectedValue) => {
    if (fieldName == "trainingSector") {
      this.setState({
        selectedTrainingSector: selectedValue,
      });
    }
    if (fieldName == "trainingProgram") {
      this.setState({
        selectedTrainingProgram: selectedValue,
      });
    }

    if (fieldName == "courseType") {
      this.setState({
        selectedTrainingType: selectedValue,
      });
    }
    if (fieldName == "trainingFormat") {
      this.setState({
        selectedTrainingFormat: selectedValue,
      });
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetCoursesCatalogDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCoursesCatalogDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetCoursesCatalogDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCoursesCatalogDeletedValue();
  };

  handleEditCourse = arg => {
    console.log("arg", arg);

    this.toggle();
  };

  deletePrerequisite = prerequisite => {
    this.setState(prevState => {
      const updatedPrerequisites = prevState.prerequisiteCoursesArray.filter(
        item => item.Id !== prerequisite.Id
      );

      return {
        prerequisiteCoursesArray: updatedPrerequisites,
      };
    });
  };

  handleAlertClosePrerequisite = () => {
    this.setState({ duplicateErrorPrerequisite: null });
  };

  render() {
    const courseCataloge = this.state.courseCataloge;
    const { coursesCatalogs, t, deleted } = this.props;
    const {
      duplicateError,
      deleteModal,
      modal,
      modal2,
      isEdit,
      isOpen,
      isAdd,
      emptyError,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      errorMessage,
      duplicateErrorPrerequisite,
      arCoursenameError,
      enCoursenameError,
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

    const trainingSectorOptions = [
      { value: "it", label: "Information Technology" },
      { value: "finance", label: "Finance" },
      { value: "hr", label: "Human Resources" },
    ];
    const trainingProgramOptions = [
      { value: "program1", label: "Program 1" },
      { value: "program2", label: "Program 2" },
    ];
    const courseTypeOptions = [
      { value: "online", label: "Online" },
      { value: "in-person", label: "In-Person" },
    ];
    const trainingFormatOptions = [
      { value: "workshop", label: "Workshop" },
      { value: "seminar", label: "Seminar" },
    ];
    const registerConditions = [
      { value: "mandatory", label: t("Mandatory") },
      { value: "optional", label: t("Optional") },
      { value: "recommended", label: t("Recommended") },
    ];

    const columns = [
      { dataField: "id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: this.props.t("Course Name (ar)"),
        sort: true,
        editable: false,
      },
      {
        dataField: "enTitle",
        text: this.props.t("Course Name (en)"),
        sort: true,
        editable: false,
      },
      {
        dataField: "courseCode",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "sector",
        text: this.props.t("Training Sector"),
        sort: true,
        editable: false,
      },
      {
        dataField: "program",
        text: this.props.t("Training Program"),
        sort: true,
        editable: false,
      },
      {
        dataField: "modules",
        text: this.props.t("Training Modules"),
        sort: true,
        editable: false,
      },
      {
        dataField: "courseType",
        text: this.props.t("Course Type"),
        sort: true,
        editable: false,
      },
      {
        dataField: "trainingFormat",
        text: this.props.t("Training Format"),
        sort: true,
        editable: false,
      },
      {
        dataField: "totalHours",
        text: this.props.t("Total Training Hours"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, courseCataloge) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  onClick={() => this.handleEditCourse(courseCataloge)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  onClick={() => this.handleDeleteCourse(courseCataloge)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];

    const PrerequisiteColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },

      {
        dataField: "prerequisiteCourseName",
        text: t("Prerequisite Course Name"),
        sort: true,
      },

      {
        dataField: "registerCondition",
        text: t("Register Condition"),
        formatter: (cell, row) => (
          <Select
            key={`register_condition_${row.Id}`}
            options={registerConditions}
            onChange={newValue => {
              this.handleSelectChangeDetails(
                row.Id,
                "registerCondition",
                newValue.value
              );
            }}
            value={registerConditions.find(
              opt => opt.value == row.registerCondition
            )}
          />
        ),
        editable: false,
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.deletePrerequisite(row)}
            ></i>
          </Link>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: coursesCatalogs.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("Course Cataloge")} />
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
                        data={coursesCatalogs}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={coursesCatalogs}
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
                                  data={coursesCatalogs}
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
                                    "No Course Cataloge Found"
                                  )}
                                  defaultSorted={defaultSorting}
                                />
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                                <Modal
                                  isOpen={modal}
                                  toggle={this.toggle}
                                  className={"modal-fullscreen"}
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit
                                      ? t("Edit Contract Data")
                                      : t("Add Contract Data")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          courseCataloge && {
                                            Id: courseCataloge.Id,
                                          }),

                                        courseNameAr:
                                          courseCataloge?.courseNameAr || "",
                                        courseNameEn:
                                          courseCataloge?.courseNameEn || "",
                                        trainingSector:
                                          courseCataloge?.trainingSector || "",
                                        trainingProgram:
                                          courseCataloge?.trainingProgram || "",
                                        courseCode:
                                          courseCataloge?.courseCode || "",
                                        courseType:
                                          courseCataloge?.courseType || "",
                                        totalTrainingHours:
                                          courseCataloge?.totalTrainingHours ||
                                          "",
                                        trainingModule:
                                          courseCataloge?.trainingModule || "",
                                        trainingFormat:
                                          courseCataloge?.trainingFormat || "",
                                        descriptionAr:
                                          courseCataloge?.descriptionAr || "",
                                        descriptionEn:
                                          courseCataloge?.descriptionEn || "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        courseNameAr: Yup.string().required(
                                          t("Course Name (ar) is required")
                                        ),
                                        courseNameEn: Yup.string().required(
                                          t("Course Name (en) is required")
                                        ),
                                        trainingSector: Yup.string().required(
                                          t("Training Sector is required")
                                        ),
                                        trainingProgram: Yup.string().required(
                                          t("Training Program is required")
                                        ),
                                        courseCode: Yup.string().required(
                                          t("Course Code is required")
                                        ),
                                        courseType: Yup.string().required(
                                          t("Course Type is required")
                                        ),
                                        totalTrainingHours: Yup.number()
                                          .typeError(
                                            t(
                                              "Total Training Hours must be a number"
                                            )
                                          )
                                          .required(
                                            t(
                                              "Total Training Hours is required"
                                            )
                                          ),
                                        trainingModule: Yup.string().required(
                                          t("Training Module is required")
                                        ),
                                        trainingFormat: Yup.string().required(
                                          t("Training Format is required")
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
                                              {t("Course Basic Information")}
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
                                                    onClick={
                                                      this.handleAlertClose
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}
                                              <Row>
                                                <Col lg="12">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "Basic Information"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody className="cardBody">
                                                          <Row>
                                                            <Row>
                                                              <Col lg="6">
                                                                {/* Course Name (AR) */}
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="courseNameAr">
                                                                        {this.props.t(
                                                                          "Course Name (ar)"
                                                                        )}
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        type="text"
                                                                        name="courseNameAr"
                                                                        id="courseNameAr"
                                                                        className={
                                                                          "form-control" +
                                                                          ((errors.courseNameAr &&
                                                                            touched.courseNameAr) ||
                                                                          arCoursenameError
                                                                            ? " is-invalid"
                                                                            : "")
                                                                        }
                                                                      />
                                                                      <ErrorMessage
                                                                        name="courseNameAr"
                                                                        component="div"
                                                                        className="invalid-feedback"
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                {/* Course Name (EN) */}
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="courseNameEn">
                                                                        {this.props.t(
                                                                          "Course Name (en)"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        type="text"
                                                                        name="courseNameEn"
                                                                        id="courseNameEn"
                                                                        className={
                                                                          "form-control" +
                                                                          ((errors.courseNameEn &&
                                                                            touched.courseNameEn) ||
                                                                          enCoursenameError
                                                                            ? " is-invalid"
                                                                            : "")
                                                                        }
                                                                      />
                                                                      <ErrorMessage
                                                                        name="courseNameEn"
                                                                        component="div"
                                                                        className="invalid-feedback"
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                {/* Training Sector - SELECT */}
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="trainingSector">
                                                                        {this.props.t(
                                                                          "Training Sector"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Select
                                                                        name="trainingSector"
                                                                        options={
                                                                          trainingSectorOptions
                                                                        }
                                                                        className={
                                                                          "form-control" +
                                                                          (errors.trainingSector &&
                                                                          touched.trainingSector
                                                                            ? " is-invalid"
                                                                            : "")
                                                                        }
                                                                        onChange={newValue =>
                                                                          this.handleSelect(
                                                                            "trainingSector",
                                                                            newValue.value
                                                                          )
                                                                        }
                                                                        defaultValue={trainingSectorOptions.find(
                                                                          opt =>
                                                                            opt.value ===
                                                                            courseCataloge?.trainingSector
                                                                        )}
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                {/* Training Program - SELECT */}
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="trainingProgram">
                                                                        {this.props.t(
                                                                          "Training Program"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Select
                                                                        name="trainingProgram"
                                                                        options={
                                                                          trainingProgramOptions
                                                                        }
                                                                        className="form-control"
                                                                        onChange={newValue =>
                                                                          this.handleSelect(
                                                                            "trainingProgram",
                                                                            newValue.value
                                                                          )
                                                                        }
                                                                        defaultValue={trainingProgramOptions.find(
                                                                          opt =>
                                                                            opt.value ===
                                                                            courseCataloge?.trainingProgram
                                                                        )}
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                {/* Course Code */}
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="courseCode">
                                                                        {this.props.t(
                                                                          "Course Code"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        type="text"
                                                                        name="courseCode"
                                                                        id="courseCode"
                                                                        className="form-control"
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                              </Col>

                                                              <Col lg="6">
                                                                {/* Course Type - SELECT */}
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="courseType">
                                                                        {this.props.t(
                                                                          "Course Type"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Select
                                                                        name="courseType"
                                                                        options={
                                                                          courseTypeOptions
                                                                        }
                                                                        className="form-control"
                                                                        onChange={newValue =>
                                                                          this.handleSelect(
                                                                            "courseType",
                                                                            newValue.value
                                                                          )
                                                                        }
                                                                        defaultValue={courseTypeOptions.find(
                                                                          opt =>
                                                                            opt.value ===
                                                                            courseCataloge?.courseType
                                                                        )}
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                {/* Total Training Hours */}
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="totalTrainingHours">
                                                                        {this.props.t(
                                                                          "Total Training Hours"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        type="number"
                                                                        name="totalTrainingHours"
                                                                        id="totalTrainingHours"
                                                                        className="form-control"
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                {/* Training Module */}
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="trainingModule">
                                                                        {this.props.t(
                                                                          "Training Module"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        type="text"
                                                                        name="trainingModule"
                                                                        id="trainingModule"
                                                                        className="form-control"
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                {/* Training Format - SELECT */}
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="trainingFormat">
                                                                        {this.props.t(
                                                                          "Training Format"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Select
                                                                        name="trainingFormat"
                                                                        options={
                                                                          trainingFormatOptions
                                                                        }
                                                                        className="form-control"
                                                                        onChange={newValue =>
                                                                          this.handleSelect(
                                                                            "trainingFormat",
                                                                            newValue.value
                                                                          )
                                                                        }
                                                                        defaultValue={trainingFormatOptions.find(
                                                                          opt =>
                                                                            opt.value ===
                                                                            courseCataloge?.trainingFormat
                                                                        )}
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg="12">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "Couese Prerequisites"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody>
                                                          <Row>
                                                            {duplicateErrorPrerequisite && (
                                                              <Alert
                                                                color="danger"
                                                                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                role="alert"
                                                              >
                                                                {
                                                                  duplicateErrorPrerequisite
                                                                }
                                                                <button
                                                                  type="button"
                                                                  className="btn-close"
                                                                  aria-label="Close"
                                                                  onClick={
                                                                    this
                                                                      .handleAlertClosePrerequisite
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
                                                                          .handleAddRowPrerequisite
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
                                                              data={
                                                                this.state
                                                                  .prerequisiteCoursesArray
                                                              }
                                                              columns={
                                                                PrerequisiteColumns
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
                                                                      this.handlePrerequisiteChange(
                                                                        row.Id,
                                                                        column.dataField,
                                                                        newValue
                                                                      );
                                                                    },
                                                                }
                                                              )}
                                                              noDataIndication={this.props.t(
                                                                "No Prerequisite Courses Found"
                                                              )}
                                                              defaultSorted={
                                                                defaultSorting
                                                              }
                                                            />
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </CardBody>
                                          </Card>
                                          <Col lg="12">
                                            <div className="bordered">
                                              <Col lg="12">
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Description")}
                                                  </CardTitle>
                                                  <CardBody>
                                                    <Row>
                                                      <Col lg="12">
                                                        <div className="mb-3">
                                                          <Label for="descriptionar">
                                                            {this.props.t(
                                                              "Description (ar)"
                                                            )}
                                                          </Label>
                                                          <Field
                                                            as="textarea"
                                                            name="descriptionAr"
                                                            id="descriptionar"
                                                            className="form-control"
                                                          />
                                                        </div>
                                                      </Col>
                                                      <Col lg="12">
                                                        <div className="mb-3">
                                                          <Label for="descriptionen">
                                                            {this.props.t(
                                                              "Description (en)"
                                                            )}
                                                          </Label>
                                                          <Field
                                                            as="textarea"
                                                            name="descriptionEn"
                                                            id="descriptionen"
                                                            className="form-control"
                                                          />
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                              </Col>
                                            </div>
                                          </Col>
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

const mapStateToProps = ({ coursesCatalogs, menu_items }) => ({
  coursesCatalogs: coursesCatalogs.coursesCatalogs,
  deleted: coursesCatalogs.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCoursesCatalogs: () => dispatch(getCoursesCatalogs()),
  onAddNewCoursesCatalog: courseCataloge =>
    dispatch(addNewCoursesCatalog(courseCataloge)),
  onUpdateCoursesCatalog: courseCataloge =>
    dispatch(updateCoursesCatalog(courseCataloge)),
  onDeleteCoursesCatalog: courseCataloge =>
    dispatch(deleteCoursesCatalog(courseCataloge)),
  onGetCoursesCatalogDeletedValue: () =>
    dispatch(getCoursesCatalogDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(CourseCatalogeList)));
