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
class UnarchiveCourseReq extends Component {
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
      languageState: "",
    };
    this.toggle = this.toggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const {
      i18n,

      coursesCatalogs,
      deleted,
      user_menu,
      onGetCoursesCatalogs,
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

  handleSelect = (fieldName, selectedValue, values) => {};

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
    this.setState({
      courseCataloge: arg,
      isEdit: true,
      selectedCoursId: arg.Id,
      selectedTrainingFormat: arg.trainingFormatId,
      selectedTrainingSector: arg.sectorId,
      selectedTrainingProgram: arg.programId,
      selectedTrainingType: arg.courseTypeId,
    });

    this.toggle();
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

      selectedTrainingSector,
      selectedTrainingFormat,
      selectedTrainingProgram,
      selectedTrainingType,

      languageState,
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
      { dataField: "Id", text: this.props.t("ID"), hidden: true },

      {
        dataField: "applyingUser",
        text: this.props.t("Applying Student"),
        sort: true,
        editable: false,
      },

      {
        dataField: "startDate",
        text: this.props.t("start Date"),
        sort: true,
        editable: false,
      },
      {
        dataField: "endDate",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,
      },

      {
        dataField: "courseName",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "code",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "studentNumber",
        text: this.props.t("Student Number"),
        sort: true,
        editable: false,
      },
      {
        dataField: "studentName",
        text: this.props.t("Student Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "studentId",
        text: this.props.t("Student ID"),
        sort: true,
        editable: false,
      },
      {
        dataField: "canceledGrade",
        text: this.props.t("Canceled Grade"),
        sort: true,
        editable: false,
      },
      {
        dataField: "applyingDate",
        text: this.props.t("Applying Date"),
        sort: true,
        editable: false,
      },
      {
        dataField: "applyingUser",
        text: this.props.t("Applying User"),
        sort: true,
        editable: false,
      },
      {
        dataField: "requestStatus",
        text: this.props.t("Request Status"),
        sort: true,
        editable: false,
      },
      {
        dataField: "startDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
      },
      {
        dataField: "endDate",
        text: this.props.t("End Date"),
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
            <Breadcrumbs breadcrumbItem={this.props.t("Course Catalog")} />
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

                                        arTitle: courseCataloge?.arTitle || "",
                                        enTitle: courseCataloge?.enTitle || "",
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
                                          courseCataloge?.trainingModule || "",
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
                                                              
                                                              
                                                              </Col>

                                                              <Col lg="6"></Col>
                                                            </Row>
                                                            <Col lg="12 mt-6">
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
  onGetCoursesCatalogs: lng => dispatch(getCoursesCatalogs(lng)),
  onAddNewCoursesCatalog: courseCataloge =>
    dispatch(addNewCoursesCatalog(courseCataloge)),
  onUpdateCoursesCatalog: courseCataloge =>
    dispatch(updateCoursesCatalog(courseCataloge)),
  onDeleteCoursesCatalog: courseCataloge =>
    dispatch(deleteCoursesCatalog(courseCataloge)),
  onGetCoursesCatalogDeletedValue: () =>
    dispatch(getCoursesCatalogDeletedValue()),
  onGetPreReqCoursesDatalist: () => dispatch(getCoursesCatalogsDatalist()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(UnarchiveCourseReq)));
