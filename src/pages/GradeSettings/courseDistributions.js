import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Alert,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
} from "reactstrap";
import Select from "react-select";

import { Formik, Field, Form, ErrorMessage } from "formik";

import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import DeleteModal from "components/Common/DeleteModal";
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getCourseDistributionDeletedValue,
  getCourseDistributions,
  addNewCourseDistribution,
  updateCourseDistribution,
  deleteCourseDistribution,
  copyCourseDistributions,
} from "store/courses-distribution/actions";

import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";

class CourseDistributionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: null,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      openModal: false,
      courseName: "",
      selectedDistribution: "",
      distMethod: "",
      editRowId: "",
      selectedDistributionError: false,
      emptyError: "",
      openCopyModal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { onGetCourseDistributions, user_menu } = this.props;
    onGetCourseDistributions();
    const pathname = this.props.location.pathname;
    this.updatePermissions(user_menu, pathname);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updatePermissions(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }

  updatePermissions = (menu, pathname) => {
    this.setState({
      showAddButton: checkIsAddForPage(menu, pathname),
      showDeleteButton: checkIsDeleteForPage(menu, pathname),
      showEditButton: checkIsEditForPage(menu, pathname),
      showSearchButton: checkIsSearchForPage(menu, pathname),
    });
  };

  handleAddRow = () => {
    const { courseDistributions, onAddNewCourseDistribution, t } = this.props;
    const emptyExists = courseDistributions.some(gt => gt.arTitle === "-----");

    if (emptyExists) {
      this.setState({ duplicateError: t("Fill in the empty row") });
    } else {
      this.setState({ duplicateError: null });
      onAddNewCourseDistribution({ arTitle: "-----" });
    }
  };

  handleDeleteRow = () => {
    const { selectedRowId } = this.state;
    if (selectedRowId) {
      this.props.onDeleteCourseDistribution(selectedRowId);
      this.setState({
        deleteModal: false,
        selectedRowId: null,
        showAlert: true,
      });
    }
  };

  handelEditData = arg => {
    console.log(arg);
    const grademethodopt = arg;

    this.setState({
      editRowId: arg.Id,
      courseName: arg.courseName,
      distMethod: arg,
      selectedDistribution: arg.distributingMethodId,
    });
    this.toggle();
  };

  toggle() {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
    }));
  }

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "distributingId") {
      const selected = this.props.distributingCoursesMethods.find(
        distId => distId.value === selectedValue
      );

      this.setState({
        selectedDistribution: selected ? selected.key : null,
        distMethod: values,
      });
    }
  };

  handleSubmit = values => {
    const { editRowId } = this.state;

    const { onUpdateCourseDistribution } = this.props;

    if (values["distributingId"] === null || values["distributingId"] === "") {
      this.setState({ selectedDistributionError: true });
      this.setState({ emptyError: this.props.t("Fill in the empty row") });

      return;
    }

    let distributionInfo = {
      Id: editRowId,
      distributingMethodId: values["distributingId"],
    };
    console.log("distributionInfo", distributionInfo);
    onUpdateCourseDistribution(distributionInfo);

    this.toggle();
  };

  copyDistCoursOpenModal = () => {
    this.setState({ openCopyModal: true });
  };

  copyDistCours = () => {
    // this.setState({ openCopyModal: false });
    const { onCopyCourseDistributions } = this.props;
    onCopyCourseDistributions();
  };

  render() {
    const { t, courseDistributions, deleted, distributingCoursesMethods } =
      this.props;
    const {
      deleteModal,
      duplicateError,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      distMethod,
      selectedDistribution,
      selectedDistributionError,
      emptyError,
      openCopyModal,
    } = this.state;

    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "courseName",
        text: this.props.t("Course Name (ar)"),
        editable: false,
        sort: true,
      },
      {
        dataField: "Code",
        text: this.props.t("Course Code"),
        editable: false,
        sort: true,
      },

      {
        dataField: "program",
        text: this.props.t("Training Program"),
        sort: true,
        editable: false,
      },
      {
        dataField: "methodOfferingName",
        text: this.props.t("Method Of Offering"),
        sort: true,
        editable: false,
      },

      {
        dataField: "distributingMethod",
        text: this.props.t("Distribution types(Ar)"),
        editable: false,
        sort: true,
      },

      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "",
        formatter: (cellContent, distributingCoursesMethod) => (
          <div className="d-flex gap-3">
            {showEditButton && (
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handelEditData(distributingCoursesMethod)}
                ></i>
              </Link>
            )}
          </div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: courseDistributions.length,
      custom: true,
    };

    const { SearchBar } = Search;

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <Modal isOpen={openCopyModal} centered={true}>
          <ModalBody className="py-3 px-5">
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <i
                    className="mdi mdi-alert-circle-outline"
                    style={{ fontSize: "9em", color: "orange" }}
                  />
                  <h2>{this.props.t("Are you sure?")}</h2>
                  <h4>{this.props.t("You won't be able to revert this")}!</h4>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-success btn-lg me-2"
                    onClick={this.copyDistCours}
                  >
                    {this.props.t("Yes, copy it!")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-lg me-2"
                    onClick={() => this.setState({ openCopyModal: false })}
                  >
                    {this.props.t("Cancel")}
                  </button>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.openModal} className={this.props.className}>
          <ModalHeader toggle={this.toggle} tag="h4">
            {this.state.courseName}
          </ModalHeader>
          <ModalBody>
            {selectedDistributionError && (
              <Alert
                color="danger"
                toggle={() =>
                  this.setState({ selectedDistributionError: null })
                }
              >
                {emptyError}
              </Alert>
            )}

            <Formik
              enableReinitialize={true}
              initialValues={{
                distributingId:
                  distMethod?.distributingId || selectedDistribution,
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
                  <div className="mb-3">
                    <Row>
                      <Col className="col-4">
                        <Label for="distributingId">
                          {this.props.t("Distribution type")}
                        </Label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col className="col-8">
                        <Col className="col-8">
                          <input
                            className={`form-control ${this.state.inputClass}`}
                            list="distributing"
                            name="distributingId"
                            id="distributingId"
                            placeholder="Type to search..."
                            autoComplete="off"
                            onChange={e =>
                              this.handleSelect(
                                e.target.name,
                                e.target.value,
                                values
                              )
                            }
                            value={
                              (
                                distributingCoursesMethods.find(
                                  distributingCoursesMethod =>
                                    distributingCoursesMethod.key ===
                                    selectedDistribution
                                ) || { value: "" }
                              ).value
                            }
                          />
                          <datalist id="distributing">
                            {distributingCoursesMethods.map(
                              distributingCoursesMethod => (
                                <option
                                  key={distributingCoursesMethod.key}
                                  value={distributingCoursesMethod.value}
                                />
                              )
                            )}
                          </datalist>

                          <ErrorMessage
                            name="distributingId"
                            component="div"
                            className="invalid-feedback"
                          />
                        </Col>
                      </Col>
                    </Row>
                  </div>

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

        <div className="page-content">
          <Container fluid>
            <Breadcrumbs breadcrumbItem={t("Course Distribution List")} />

            {duplicateError && (
              <Alert
                color="danger"
                toggle={() => this.setState({ duplicateError: null })}
              >
                {duplicateError}
              </Alert>
            )}

            {showAlert && (
              <Alert
                color={deleted == 1 ? "success" : "danger"}
                toggle={() => {
                  this.setState({ showAlert: null });
                  this.props.onGetCourseDistributionDeletedValue();
                }}
              >
                {deleted == 1 ? t("Deleted Successfully") : t("Can't Delete")}
              </Alert>
            )}

            <Card>
              <CardBody>
                <PaginationProvider
                  pagination={paginationFactory(pageOptions)}
                  keyField="Id"
                  columns={columns}
                  data={courseDistributions}
                >
                  {({ paginationProps, paginationTableProps }) => (
                    <ToolkitProvider
                      keyField="Id"
                      data={courseDistributions}
                      columns={columns}
                      search
                    >
                      {toolkitProps => (
                        <React.Fragment>
                          <Row className="mb-2">
                            <Col sm="4">
                              {showSearchButton && (
                                <div className="search-box ms-2">
                                  <SearchBar
                                    {...toolkitProps.searchProps}
                                    placeholder={t("Search...")}
                                  />
                                </div>
                              )}
                            </Col>
                            <Col sm="8" className="text-sm-end">
                              <Tooltip
                                title={this.props.t("Copy")}
                                placement="top"
                              >
                                <IconButton
                                  color="primary"
                                  onClick={this.copyDistCoursOpenModal}
                                >
                                  <i className="mdi mdi-content-copy blue-noti-icon" />
                                </IconButton>
                              </Tooltip>
                            </Col>
                          </Row>

                          <BootstrapTable
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                            defaultSorted={[{ dataField: "Id", order: "desc" }]}
                            noDataIndication={t("No distribution found")}
                          />

                          <div className="d-flex justify-content-end mt-2">
                            <PaginationListStandalone {...paginationProps} />
                          </div>
                        </React.Fragment>
                      )}
                    </ToolkitProvider>
                  )}
                </PaginationProvider>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  courseDistributions,
  menu_items,
  distributingCoursesMethods,
}) => ({
  courseDistributions: courseDistributions.courseDistributions,
  deleted: courseDistributions.deleted,
  distributingCoursesMethods:
    distributingCoursesMethods.distributingCoursesMethods,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCourseDistributions: () => dispatch(getCourseDistributions()),
  onAddNewCourseDistribution: data => dispatch(addNewCourseDistribution(data)),
  onUpdateCourseDistribution: data => dispatch(updateCourseDistribution(data)),
  onDeleteCourseDistribution: data => dispatch(deleteCourseDistribution(data)),
  onGetCourseDistributionDeletedValue: () =>
    dispatch(getCourseDistributionDeletedValue()),
  onCopyCourseDistributions: () => dispatch(copyCourseDistributions()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CourseDistributionsList));
