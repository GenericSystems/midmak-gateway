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
  Spinner,
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
import Accordion from "react-bootstrap/Accordion";

import {
  getCoursesCatalogs,
  addNewCoursesCatalog,
  updateCoursesCatalog,
  deleteCoursesCatalog,
  getCoursesCatalogDeletedValue,
  getCoursesCatalogsDatalist,
  getCourseCatalogePrerequisites,
  addNewCourseCatalogePrerequisite,
  updateCourseCatalogePrerequisite,
  deleteCourseCatalogePrerequisite,
  getCourseCatalogePrerequisitesDeletedValue,
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
      errorMessage: null,
      successMessage: null,
      values: "",
      prerequisiteCoursesArray: [],
      duplicateErrorPrerequisite: "",
      lastUsedId: 1,

      selectedTrainingSector: "",
      selectedTrainingProgram: "",
      selectedTrainingType: "",
      selectedTrainingFormat: "",
      arCoursenameError: false,
      enCoursenameError: false,
      trainingProgramError: false,
      courseCodeError: false,
      courseTypeError: false,
      traningSectorError: false,
      filtredPreReqCourses: [],
      selectedCoursId: 0,
      isShowPreReq: false,
    };
    this.toggle = this.toggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const {
      sectors,
      trainingFormats,
      certificateTypes,
      courseTypes,
      coursesCatalogs,
      deleted,
      user_menu,
      onGetCoursesCatalogs,
      isLoading,
      prereqs,
      preReqCourses,
      onGetPreReqCoursesDatalist,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    onGetCoursesCatalogs();
    onGetPreReqCoursesDatalist();

    this.setState({
      coursesCatalogs,
      sectors,
      trainingFormats,
      certificateTypes,
      courseTypes,
      isLoading,
      deleted,
      prereqs,
      preReqCourses,
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
    const {
      onAddNewCourseCatalogePrerequisite,
      lastAddedId,
      coursesCatalogsPrReq,
    } = this.props;

    const { isAdd, selectedCoursId } = this.state;

    const emptyRowExists = coursesCatalogsPrReq.some(
      prereq => !prereq.prerequiseCourseId
    );
    console.log("emptyRowExists", emptyRowExists);

    if (emptyRowExists) {
      this.setState({
        duplicateErrorPrerequisite: this.props.t("Fill in the empty row"),
      });
      return;
    }

    const newPrerequisite = {
      courseId: isAdd ? lastAddedId : selectedCoursId,
    };

    onAddNewCourseCatalogePrerequisite(newPrerequisite);

    this.setState({ duplicateErrorPrerequisite: null });
  };

  handlePrerequisiteChange = (id, fieldName, value) => {
    const updatedItem = {
      Id: id,
      [fieldName]: value,
    };

    this.props.onUpdateCourseCatalogePrerequisite(updatedItem);
  };

  handleSelectChangeDetails = (id, fieldName, value) => {
    const updatedItem = {
      Id: id,
      [fieldName]: value,
    };

    this.props.onUpdateCourseCatalogePrerequisite(updatedItem);
  };

  handleSubmit = values => {
    const { onAddNewCoursesCatalog, onUpdateCoursesCatalog } = this.props;
    console.log("values", values);

    const {
      selectedTrainingSector,
      selectedTrainingProgram,
      selectedTrainingType,
      selectedTrainingFormat,
      isEdit,
      isAdd,
      prerequisiteCoursesArray,
    } = this.state;

    let arCoursenameError = false;
    let enCoursenameError = false;
    let courseCodeError = false;
    let traningSectorError = false;
    let trainingProgramError = false;
    let courseTypeError = false;
    let isSelectError = false;

    values["arTitle"] = values["arTitle"] || "";
    values["enTitle"] = values["enTitle"] || "";
    values["sectorId"] = selectedTrainingSector;
    values["programId"] = selectedTrainingProgram;
    values["Code"] = values["Code"] || "";
    values["courseTypeId"] = selectedTrainingType;
    values["totalTrainingHours"] = values["totalTrainingHours"] || "";
    values["trainingModule"] = values["trainingModule"] || "";
    values["trainingFormatId"] = selectedTrainingFormat;
    values["descriptionAr"] = values["descriptionAr"] || "";
    values["descriptionEn"] = values["descriptionEn"] || "";

    if (values.arTitle === "") {
      arCoursenameError = true;
    }

    if (values.enTitle === "") {
      enCoursenameError = true;
    }

    if (!selectedTrainingSector) {
      traningSectorError = true;
    }

    if (values.Code === "") {
      courseCodeError = true;
    }

    if (!selectedTrainingProgram) {
      trainingProgramError = true;
    }

    if (!selectedTrainingType) {
      courseTypeError = true;
    }

    if (
      !selectedTrainingSector ||
      !selectedTrainingFormat ||
      !selectedTrainingProgram ||
      !selectedTrainingType
    ) {
      isSelectError = true;
    }

    if (
      arCoursenameError ||
      enCoursenameError ||
      traningSectorError ||
      courseCodeError ||
      trainingProgramError ||
      courseTypeError ||
      isSelectError
    ) {
      this.setState({
        arCoursenameError,
        enCoursenameError,
        traningSectorError,
        courseCodeError,
        trainingProgramError,
        courseTypeError,
        emptyError: "Please fill all required fields",
      });
      return;
    }

    let courseCatalogInfo = {};

    // courseCatalogInfo["prerequisiteCourses"] = prerequisiteCoursesArray;

    Object.keys(values).forEach(key => {
      if (values[key] !== undefined && values[key] !== "") {
        courseCatalogInfo[key] = values[key];
      }
    });
    if (isEdit) {
      console.log("Updating courseCatalogInfo:", courseCatalogInfo);
      onUpdateCoursesCatalog(courseCatalogInfo);
      this.toggle();
    } else if (isAdd) {
      console.log("Adding new contract:", courseCatalogInfo);
      onAddNewCoursesCatalog(courseCatalogInfo);
      this.setState({ isShowPreReq: true });
    }

    this.setState({
      errorMessages: {},
      arCoursenameError: false,
      enCoursenameError: false,
      emptyError: "",
    });

    //this.toggle();
  };

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "sectorId") {
      this.setState({
        selectedTrainingSector: selectedValue,
        courseCataloge: values,
      });
    }
    if (fieldName == "programId") {
      this.setState({
        selectedTrainingProgram: selectedValue,
        courseCataloge: values,
      });
    }

    if (fieldName == "courseTypeId") {
      this.setState({
        selectedTrainingType: selectedValue,
        courseCataloge: values,
      });
    }
    if (fieldName == "trainingFormatId") {
      this.setState({
        selectedTrainingFormat: selectedValue,
        courseCataloge: values,
      });
    }
  };

  handleAlertClose = () => {
    this.setState({ emptyError: null });
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
    const { preReqCourses, onGetCourseCatalogePrerequisites } = this.props;

    const filteredPreReqCourses = preReqCourses.filter(
      course => course.key != arg.Id
    );

    this.setState({
      courseCataloge: arg,
      isEdit: true,
      filtredPreReqCourses: filteredPreReqCourses,
      selectedCoursId: arg.Id,
      selectedTrainingFormat: arg.trainingFormatId,
      selectedTrainingSector: arg.sectorId,
      selectedTrainingProgram: arg.programId,
      selectedTrainingType: arg.courseTypeId,
    });
    onGetCourseCatalogePrerequisites(arg.Id);

    this.toggle();
  };

  deletePrerequisite = row => {
    this.props.onDeleteCourseCatalogePrerequisite({ Id: row.Id });
  };

  handleAlertClosePrerequisite = () => {
    this.setState({ duplicateErrorPrerequisite: null });
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
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

  render() {
    const courseCataloge = this.state.courseCataloge;
    const {
      coursesCatalogs,
      t,
      deleted,
      sectors,
      certificateTypes,
      courseTypes,
      trainingFormats,
      isLoading,
      prereqs,
      preReqCourses,
      coursesCatalogsPrReq,
    } = this.props;
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
      selectedTrainingSector,
      selectedTrainingFormat,
      selectedTrainingProgram,
      selectedTrainingType,
      traningSectorError,
      courseCodeError,
      courseTypeError,
      trainingProgramError,
      filtredPreReqCourses,
      isShowPreReq,
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

    const trainingSectorOptions = sectors;

    const trainingProgramOptions = certificateTypes;
    const courseTypeOptions = courseTypes;
    const trainingFormatOptions = trainingFormats;

    const prereqCoursesOptions = isEdit ? filtredPreReqCourses : preReqCourses;

    console.log("prereqCoursesOptions", prereqCoursesOptions);

    const registerConditions = prereqs;

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
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
        dataField: "Code",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "sectorName",
        text: this.props.t("Sector"),
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
        dataField: "trainingModule",
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
        dataField: "totalTrainingHours",
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
                  onClick={() => this.onClickDelete(courseCataloge)}
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
        dataField: "prerequiseCourseId",
        text: t("Prerequisite Course Name"),
        sort: true,
        editable: false,
        formatter: (cell, row) => (
          <div>
            <input
              list={`prereq-courses-${row.Id}`}
              value={
                prereqCoursesOptions.find(c => c.key === row.prerequiseCourseId)
                  ?.value || ""
              }
              onChange={e => {
                const selectedValue = e.target.value;
                const matchedCourse = prereqCoursesOptions.find(
                  c => c.value === selectedValue
                );
                const courseId = matchedCourse?.key || "";
                this.handleSelectChangeDetails(
                  row.Id,
                  "prerequiseCourseId",
                  courseId
                );
              }}
              className="form-control"
            />
            <datalist id={`prereq-courses-${row.Id}`}>
              {prereqCoursesOptions.map(course => (
                <option key={course.key} value={course.value}>
                  {course.value}
                </option>
              ))}
            </datalist>
          </div>
        ),
      },

      {
        dataField: "prerequiseConditiontId",
        text: t("Register Condition"),
        formatter: (cell, row) => (
          <Select
            key={`register_condition_${row.Id}`}
            options={registerConditions}
            onChange={newValue => {
              this.handleSelectChangeDetails(
                row.Id,
                "prerequiseConditiontId",
                newValue.value
              );
            }}
            value={registerConditions.find(
              opt => opt.value == row.prerequiseConditiontId
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
                    {isLoading ? (
                      <div className="d-flex justify-content-center align-items-center m-13">
                        <Spinner color="info" className="my-4" />
                      </div>
                    ) : (
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
                                        ? t("Edit Course Catalog Data")
                                        : t("Add Course Catalog Data")}
                                    </ModalHeader>
                                    <ModalBody>
                                      <Formik
                                        enableReinitialize={true}
                                        initialValues={{
                                          ...(isEdit &&
                                            courseCataloge && {
                                              Id: courseCataloge.Id,
                                            }),

                                          arTitle:
                                            courseCataloge?.arTitle || "",
                                          enTitle:
                                            courseCataloge?.enTitle || "",
                                          sectorId:
                                            courseCataloge?.sectorId ||
                                            selectedTrainingSector,
                                          programId:
                                            courseCataloge?.programId ||
                                            selectedTrainingProgram,
                                          Code: courseCataloge?.Code || "",
                                          courseTypeId:
                                            courseCataloge?.courseTypeId ||
                                            selectedTrainingType,
                                          totalTrainingHours:
                                            courseCataloge?.totalTrainingHours ||
                                            "",
                                          trainingModule:
                                            courseCataloge?.trainingModule ||
                                            "",
                                          trainingFormatId:
                                            courseCataloge?.trainingFormatId ||
                                            selectedTrainingFormat,
                                          descriptionAr:
                                            courseCataloge?.descriptionAr || "",
                                          descriptionEn:
                                            courseCataloge?.descriptionEn || "",
                                          //file: null,
                                        }}
                                        validationSchema={Yup.object().shape({
                                          arTitle: Yup.string().required(
                                            t("Course Name (ar) is required")
                                          ),
                                          enTitle: Yup.string().required(
                                            t("Course Name (en) is required")
                                          ),
                                          sectorId: Yup.string().required(
                                            t("Training Sector is required")
                                          ),
                                          programId: Yup.string().required(
                                            t("Training Program is required")
                                          ),
                                          Code: Yup.string().required(
                                            t("Course Code is required")
                                          ),
                                          courseTypeId: Yup.string().required(
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
                                          trainingFormatId:
                                            Yup.string().required(
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
                                            <Card id="employee-card mt-8">
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
                                                                        <Label for="arTitle">
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
                                                                          name="arTitle"
                                                                          id="arTitle"
                                                                          className={
                                                                            "form-control" +
                                                                            ((errors.arTitle &&
                                                                              touched.arTitle) ||
                                                                            arCoursenameError
                                                                              ? " is-invalid"
                                                                              : "")
                                                                          }
                                                                        />
                                                                        <ErrorMessage
                                                                          name="arTitle"
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
                                                                        <Label for="enTitle">
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
                                                                          name="enTitle"
                                                                          id="enTitle"
                                                                          className={
                                                                            "form-control" +
                                                                            ((errors.enTitle &&
                                                                              touched.enTitle) ||
                                                                            enCoursenameError
                                                                              ? " is-invalid"
                                                                              : "")
                                                                          }
                                                                        />
                                                                        <ErrorMessage
                                                                          name="enTitle"
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
                                                                        <Label for="sectorId">
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
                                                                          name="sectorId"
                                                                          options={
                                                                            trainingSectorOptions
                                                                          }
                                                                          className={
                                                                            "form-control" +
                                                                            (errors.sectorId &&
                                                                            touched.sectorId
                                                                              ? " is-invalid"
                                                                              : "")
                                                                          }
                                                                          onChange={newValue =>
                                                                            this.handleSelect(
                                                                              "sectorId",
                                                                              newValue.value,
                                                                              values
                                                                            )
                                                                          }
                                                                          defaultValue={trainingSectorOptions.find(
                                                                            opt =>
                                                                              opt.value ===
                                                                              courseCataloge?.sectorId
                                                                          )}
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>

                                                                  {/* Training Program - SELECT */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="programId">
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
                                                                          name="programId"
                                                                          options={
                                                                            trainingProgramOptions
                                                                          }
                                                                          className="form-control"
                                                                          onChange={newValue =>
                                                                            this.handleSelect(
                                                                              "programId",
                                                                              newValue.value,
                                                                              values
                                                                            )
                                                                          }
                                                                          defaultValue={trainingProgramOptions.find(
                                                                            opt =>
                                                                              opt.value ===
                                                                              courseCataloge?.programId
                                                                          )}
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>

                                                                  {/* Course Code */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="Code">
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
                                                                          name="Code"
                                                                          id="Code"
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
                                                                        <Label for="courseTypeId">
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
                                                                          name="courseTypeId"
                                                                          options={
                                                                            courseTypeOptions
                                                                          }
                                                                          className="form-control"
                                                                          onChange={newValue =>
                                                                            this.handleSelect(
                                                                              "courseTypeId",
                                                                              newValue.value,
                                                                              values
                                                                            )
                                                                          }
                                                                          defaultValue={courseTypeOptions.find(
                                                                            opt =>
                                                                              opt.value ===
                                                                              courseCataloge?.courseTypeId
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
                                                                            "Training Modules"
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
                                                                        <Label for="trainingFormatId">
                                                                          {this.props.t(
                                                                            "Training Format"
                                                                          )}
                                                                        </Label>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Select
                                                                          name="trainingFormatId"
                                                                          options={
                                                                            trainingFormatOptions
                                                                          }
                                                                          className="form-control"
                                                                          onChange={newValue =>
                                                                            this.handleSelect(
                                                                              "trainingFormatId",
                                                                              newValue.value,
                                                                              values
                                                                            )
                                                                          }
                                                                          defaultValue={trainingFormatOptions.find(
                                                                            opt =>
                                                                              opt.value ===
                                                                              courseCataloge?.trainingFormatId
                                                                          )}
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                </Col>
                                                              </Row>
                                                              <Col lg="12 mt-6">
                                                                <div>
                                                                  <Col lg="12">
                                                                    <Card>
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

                                                                          <Col lg="12">
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
                                                                          </Col>
                                                                        </Row>
                                                                      </CardBody>
                                                                    </Card>
                                                                  </Col>
                                                                </div>
                                                                {(isEdit ||
                                                                  isShowPreReq) && (
                                                                  <Row>
                                                                    <Col lg="12 mt-6">
                                                                      <div>
                                                                        <Col lg="12">
                                                                          <Card>
                                                                            <CardTitle id="card_header">
                                                                              {t(
                                                                                "Courses Prerequisites"
                                                                              )}
                                                                            </CardTitle>

                                                                            <CardBody className="courseCatalogprereq">
                                                                              <Row className="mt-10">
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
                                                                                    coursesCatalogsPrReq
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
                                                                )}
                                                                <Row>
                                                                  <Col>
                                                                    <div className="text-center">
                                                                      <Link
                                                                        to="#"
                                                                        className="btn btn-primary me-2"
                                                                        onClick={() => {
                                                                          this.handleSubmit(
                                                                            values
                                                                          );
                                                                        }}
                                                                      >
                                                                        {t(
                                                                          "Save"
                                                                        )}
                                                                      </Link>
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </Col>
                                                            </Row>
                                                          </CardBody>
                                                        </Card>
                                                      </Col>
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
                                </React.Fragment>
                              )}
                            </ToolkitProvider>
                          )}
                        </PaginationProvider>
                      </div>
                    )}
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
  trainingFormats,
  sectors,
  coursesCatalogs,
  menu_items,
  certificateTypes,
  courseTypes,
  isLoading,
  prereqs,
  preReqCourses,
  lastAddedId,
}) => ({
  coursesCatalogs: coursesCatalogs.coursesCatalogs,
  deleted: coursesCatalogs.deleted,
  user_menu: menu_items.user_menu || [],
  sectors: sectors.sectors,
  certificateTypes: certificateTypes.certificateTypes,
  trainingFormats: trainingFormats.trainingFormats,
  courseTypes: courseTypes.courseTypes,
  isLoading: coursesCatalogs.isLoading,
  prereqs: prereqs.prereqs,
  preReqCourses: coursesCatalogs.preReqCourses,
  coursesCatalogsPrReq: coursesCatalogs.coursesCatalogsPrReq,
  lastAddedId: coursesCatalogs.lastAddedId,
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
  onGetPreReqCoursesDatalist: () => dispatch(getCoursesCatalogsDatalist()),

  //prereqqq
  onGetCourseCatalogePrerequisites: prerequisite =>
    dispatch(getCourseCatalogePrerequisites(prerequisite)),
  onAddNewCourseCatalogePrerequisite: prerequisite =>
    dispatch(addNewCourseCatalogePrerequisite(prerequisite)),
  onUpdateCourseCatalogePrerequisite: prerequisite =>
    dispatch(updateCourseCatalogePrerequisite(prerequisite)),
  onDeleteCourseCatalogePrerequisite: prerequisite =>
    dispatch(deleteCourseCatalogePrerequisite(prerequisite)),
  onGetCourseCatalogePrerequisitesDeletedValue: () =>
    dispatch(getCourseCatalogePrerequisitesDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(CourseCatalogeList)));
