import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Select from "react-select";
import {
  Card,
  CardBody,
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
  CardTitle,
} from "reactstrap";
import * as moment from "moment";

import BootstrapTable from "react-bootstrap-table-next";
import DeleteModal from "components/Common/DeleteModal";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getAbsencePercents,
  addNewAbsencePercent,
  updateAbsencePercent,
  deleteAbsencePercent,
  getAbsencePercentDeletedValue,
} from "store/absencePercents/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsEditForPage,
  checkIsDeleteForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import absencePercents from "store/absencePercents/reducer";
class AbsencePercentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCourseId: null,
      courseCode: "",
      courseCredit: "",
      absencePercents: [],
      rows: [],
      absencePercent: "",
      showAlert: null,
      showAddButton: false,
      showEditButton: false,
      showSearchButton: false,
      deleteModal: false,
      showDeleteButton: false,
      deleteModal: false,
      modal: false,
      isEdit: false,
    };
    this.state = {
      duplicateError: null,
      selectedRowId: null,
    };
  }

  componentDidMount() {
    const {
      absencePercents,
      onGetAbsencePercents,

      user_menu,
      coursesOffering,

      deleted,
    } = this.props;

    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);

    onGetAbsencePercents();

    this.setState({
      absencePercents,
      coursesOffering,

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

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };
  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
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
  handleAddRow = () => {
    // const { onAddNewAbsencePercent, absencePercents } = this.props;
    // console.log("absencePercents", absencePercents);

    // const newRow = {
    //   courseId: 0,
    // };
    // console.log("neww roww", newRow);

    // const hasEmptyRow = absencePercents.some(row => row.courseId === null);

    // if (hasEmptyRow) {
    //   const errorMessage = this.props.t("Fill in the empty row first");
    //   this.setState({ duplicateError: errorMessage });
    // } else {
    //   this.setState({ duplicateError: null });
    //   console.log("11111111111");
    //   onAddNewAbsencePercent(newRow);
    // }
    this.toggle();
  };
  onClickDelete = rowId => {
    console.log("roeIDDDDD", rowId);
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };
  handleDeleteRow = () => {
    const { onDeleteAbsencePercent } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteAbsencePercent(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleEditAbsencePercent = absencePercent => {
    console.log("Editing Absence Percents:", absencePercent);

    this.setState({
      absencePercent: absencePercent,
      selectedCourseId: absencePercent.courseId,
      courseCode: absencePercent.courseCode,
      courseCredit: absencePercent.courseCredit,
      warningPercent: absencePercent.warningPercent,
      toDate: absencePercent.toDate,
      isEdit: true,
    });

    this.toggle();
  };

  handleSave = values => {
    console.log("valueessssss", values);
    const { selectedCourseId, courseCode, courseCredit, isEdit } = this.state;

    const { onAddNewAbsencePercent, onUpdateAbsencePercent } = this.props;

    values["courseId"] = selectedCourseId;
    // values["courseCode"] = courseCode;
    //values["courseCredit"]=courseCredit;

    console.log("Valuessssssssssss", values);

    let absencePercentInfo = {};

    // if (
    //   values.courseId &&
    //   values.courseCode &&
    //   values.warningPercent &&
    //   values.toDate
    // ) {

    Object.keys(values).forEach(function (key) {
      if (
        values[key] !== undefined &&
        (values[key].length > 0 || values[key] !== "")
      ) {
        absencePercentInfo[key] = values[key];
      }
    });

    if (isEdit) {
      console.log("3333333333333333333", absencePercentInfo);

      onUpdateAbsencePercent(absencePercentInfo);
    } else {
      console.log("222222222222222222", absencePercentInfo);

      onAddNewAbsencePercent(absencePercentInfo);
    }

    this.setState({
      errorMessages: {},
    });
    // } else {
    //   console.log("11111111111111", absencePercentInfo);
    //   this.setState({ emptyError: "Please fill in the required fields" });
    // // }
    this.toggle();
  };

  handleSuccessClose = () => {
    const { onGetAbsencePercentDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAbsencePercentDeletedValue();
  };
  handleErrorClose = () => {
    const { onGetAbsencePercentDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAbsencePercentDeletedValue();
  };
  handleSelectChange = (fieldName, selectedValue, values) => {
    console.log("selectedValueselectedValue", selectedValue);
    if (fieldName === "courseId") {
      this.setState({
        selectedCourseId: selectedValue.value,
        courseId: selectedValue.value,
        courseCode: selectedValue.Code,
        courseCredit: selectedValue.totalTrainingHours,
        absencePercent: values,
      });
    }
  };

  handleSelect = (rowId, fieldName, selectedValue) => {
    console.log("selectedValueselectedValue", selectedValue);
    const { onUpdateAbsencePercent } = this.props;
    let onUpdate;
    if (fieldName === "courseId") {
      onUpdate = {
        Id: rowId,
        courseId: selectedValue.value,
        courseCode: selectedValue.Code || "",
        courseCredit: selectedValue.totalTrainingHours || "",
      };
      // console.log("onUpdate",onUpdate)
    }
    onUpdateAbsencePercent(onUpdate);
  };

  handleabsencePercentDataChange = (rowId, fieldName, fieldValue) => {
    console.log("called");
    const { onUpdateAbsencePercent } = this.props;

    let onUpdate = {
      Id: rowId,
      [fieldName]: fieldValue,
    };
    console.log("onUpdate", onUpdate);
    onUpdateAbsencePercent(onUpdate);
  };

  // handleabsencePercentDataChange = (rowId, fieldName, fieldValue) => {
  //   const { absencePercents, onUpdateAbsencePercent } = this.props;

  //   const isDuplicate = absencePercents.some(absencePercent => {
  //     return (
  //       absencePercent.Id !== rowId &&
  //       absencePercent.arTitle.trim() === fieldValue.trim()
  //     );
  //   });

  //   if (isDuplicate) {
  //     const errorMessage = this.props.t("Value already exists");
  //     this.setState({ duplicateError: errorMessage });
  //     let onUpdate = { Id: rowId, [fieldName]: "-----" };
  //     onUpdateAbsencePercent(onUpdate);
  //   } else {
  //     this.setState({ duplicateError: null });
  //     let onUpdate = { Id: rowId, [fieldName]: fieldValue };
  //     onUpdateAbsencePercent(onUpdate);
  //   }
  // };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, newValue) {
    const { onUpdateAbsencePercent } = this.props;
    const onUpdate = { Id: rowId, [fieldName]: newValue };
    onUpdateAbsencePercent(onUpdate);
  }
  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  handleAddRow = () => {
    this.setState({
      absencePercent: "",
      isEdit: false,
    });
    this.toggle();
  };

  render() {
    const { absencePercents, t, deleted, coursesOffering } = this.props;
    const {
      duplicateError,
      showAlert,
      showAddButton,
      deleteModal,
      modal,
      showDeleteButton,
      isEdit,
      showEditButton,
      showSearchButton,
      absencePercent,
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
      { dataField: "Id", text: this.props.t("ID"), hidden: true },

      {
        dataField: "courseId",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
        // formatter: (cell, row) => {
        //   const course = coursesOffering.find(
        //     opt => opt.value === row.courseId
        //   );
        //   return course ? course.label : "";
        // },
      },

      {
        dataField: "courseCode",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
      },

      {
        dataField: "courseCredit",
        text: this.props.t("Course Credit"),
        sort: true,
        editable: false,
      },

      {
        dataField: "warningPercent",
        text: this.props.t("Issue Warning Percent"),
        sort: true,
        editable: false,
      },

      {
        dataField: "dismissPercent",
        text: this.props.t("Issue Dismiss Percent"),
        sort: true,
        editable: false,
      },

      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, absencePercent) => (
          <div className="d-flex gap-3">
            {/* Edit action */}
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  onClick={() => this.handleEditAbsencePercent(absencePercent)}
                ></i>
              </Link>
            </Tooltip>

            {/* Delete action */}
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  onClick={() => this.onClickDelete(absencePercent)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: absencePercents.length,
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
              breadcrumbItem={this.props.t("Define Allowed Absence Percent")}
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
                        data={absencePercents}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={absencePercents}
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
                                  data={absencePercents}
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
                                      this.handleabsencePercentDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Absence Percents found"
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
          </div>
        </div>
        <Modal
          isOpen={modal} // your modal state
          toggle={this.toggle} // your toggle function
          // gradeVersion={this.state.selectedGradeVersion} // now tied to clicked row
          // gradeVersionId={
          //   this.state.selectedGradeVersionId
          // } // FK
          size="lg"
        >
          <ModalHeader toggle={this.toggle} tag="h4">
            {!!isEdit ? t("Edit Absence Percent") : t("Add Absence Percent")}
          </ModalHeader>

          <ModalBody>
            <Formik
              enableReinitialize={true}
              initialValues={{
                ...(isEdit && {
                  Id: absencePercent.Id,
                }),
                courseId:
                  (absencePercent && absencePercent.courseId) ||
                  selectedCourseId,

                warningPercent:
                  (absencePercent && absencePercent.warningPercent) || "",
                dismissPercent:
                  (absencePercent && absencePercent.dismissPercent) || "",

                //courseCode:(absencePercent && absencePercent.courseCode) || "",
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
                  <Card>
                    <CardTitle id="course_header">
                      {t("Add Absence Percent")}
                    </CardTitle>
                    <CardBody>
                      <div className="mb-5">
                        <Col lg="6">
                          <Row>
                            <Col>
                              <Label for="courseId">
                                {this.props.t("Course Name")}
                              </Label>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Select
                                className={`form-control`}
                                name="courseId"
                                id="courseId"
                                key="_course_select_"
                                options={coursesOffering}
                                onChange={newValue =>
                                  this.handleSelectChange(
                                    "courseId",
                                    newValue,
                                    values
                                  )
                                }
                                defaultValue={coursesOffering.find(
                                  opt => opt.value === absencePercent?.courseId
                                )}
                              />
                            </Col>
                          </Row>
                        </Col>

                        <Row>
                          <Col lg="6">
                            <Row>
                              <Col>
                                <Label for="courseCode">
                                  {this.props.t("Course Code")}
                                </Label>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Field
                                  type="text"
                                  name="courseCode"
                                  id="courseCode"
                                  value={
                                    this.state.courseCode ||
                                    absencePercent.courseCode ||
                                    ""
                                  }
                                  readOnly
                                  className="form-control"
                                />
                              </Col>
                            </Row>
                          </Col>

                          <Col lg="6">
                            <Row>
                              <Label for="courseCredit">
                                {this.props.t("Course Credit")}
                              </Label>
                            </Row>
                            <Row>
                              <Col>
                                <Field
                                  type="text"
                                  name="courseCredit"
                                  id="courseCredit"
                                  value={
                                    this.state.courseCredit ||
                                    absencePercent.courseCredit ||
                                    ""
                                  }
                                  readOnly
                                  className="form-control"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg="6">
                            <Row>
                              <Col>
                                <Label for="warningPercent">
                                  {this.props.t("Issue Warning Percent")}
                                </Label>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Field
                                  type="text"
                                  name="warningPercent"
                                  id="warningPercent"
                                  className="form-control"
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col lg="6">
                            <Row>
                              <Col>
                                <Label for="dismissPercent">
                                  {this.props.t("Issue Dismiss Percent")}
                                </Label>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <Field
                                  type="text"
                                  name="dismissPercent"
                                  id="dismissPercent"
                                  className="form-control"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                  <Row>
                    <Col>
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-primary me-2"
                          onClick={() => {
                            this.handleSave(values);
                          }}
                        >
                          {t("Save")}
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ absencePercents, menu_items, classScheduling }) => ({
  absencePercents: absencePercents.absencePercents,

  deleted: absencePercents.deleted,

  coursesOffering: classScheduling.coursesOffering,

  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetAbsencePercents: () => dispatch(getAbsencePercents()),
  onAddNewAbsencePercent: absencePercent =>
    dispatch(addNewAbsencePercent(absencePercent)),
  onUpdateAbsencePercent: absencePercent =>
    dispatch(updateAbsencePercent(absencePercent)),
  onDeleteAbsencePercent: absencePercent =>
    dispatch(deleteAbsencePercent(absencePercent)),
  onGetAbsencePercentDeletedValue: () =>
    dispatch(getAbsencePercentDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AbsencePercentsList));
