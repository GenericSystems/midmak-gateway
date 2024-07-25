import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Alert,
} from "reactstrap";
import Select from "react-select";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { getFilteredDepartments } from "store/departments/actions";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import images from "assets/images";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getAcademicCertificates,
  addNewAcademicCertificate,
  updateAcademicCertificate,
  deleteAcademicCertificate,
  getAcademicCertificateDeletedValue,
} from "store/academicvertificates/actions";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class AcademicCertificates extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      errorMessages: {
        artitle: "",
        certificateNum: "",
        facultyId: "",
      },
      arTitleSaveError: false,
      academicNumberError: false,
      facultieIdError: false,
      academiccertificate: "",
      modal: false,
      deleteModal: false,
      selectedFaculty: null,
      selectedTrainerGrade: null,
      selectedDepartment: null,
      selectedBeginSemester: null,
      selectedEndSemester: null,
      selectedEducation: "",
      showAlert: null,
      minMaxValueError: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };

    this.handleAcademicCertificateClick =
      this.handleAcademicCertificateClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleAcademicCertificateClicks =
      this.handleAcademicCertificateClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const {
      academiccertificates,
      onGetAcademicCertificates,
      faculties,
      trainersGrades,
      yearSemesters,
      filteredDepartments,
      departments,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (academiccertificates && !academiccertificates.length) {
      onGetAcademicCertificates();
    }
    this.setState({ academiccertificates, deleted });
    this.setState({ faculties });
    this.setState({ yearSemesters });
    this.setState({ filteredDepartments });
    this.setState({ departments });
    this.setState({ trainersGrades });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleSelectChange = (fieldName, selectedValue) => {
    console.log("selected value",selectedValue)
    if (fieldName === "facultyId") {
      let selectFilterDeps = this.state;
      this.setState({
        selectedFaculty: selectedValue,
      });
      const { onGetFilteredDepartments } = this.props;

      onGetFilteredDepartments(selectedValue);
    } else if (fieldName == "departmentId") {
      this.setState({
        selectedDepartment: selectedValue,
      });
    } else if (fieldName == "yearSemesterBeginnigId") {
      this.setState({
        selectedBeginSemester: selectedValue,
      });
    } else if (fieldName == "yearSemesteEndId") {
      this.setState({
        selectedEndSemester: selectedValue,
      });
    }else if (fieldName == "trainerGradeId") {
      this.setState({
        selectedTrainerGrade: selectedValue,
      });
    }
  };

  handleRadioChange = value => {
    this.setState({ selectedEducation: value });
  };

  handleAcademicCertificateClicks = () => {
    this.setState({
      academiccertificate: "",
      isEdit: false,
      selectedEducation: "",
    });
    this.toggle();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { academiccertificates } = this.props;
    if (
      !isEmpty(academiccertificates) &&
      size(prevProps.academiccertificates) !== size(academiccertificates)
    ) {
      this.setState({ academiccertificates: {}, isEdit: false });
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

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = academiccertificate => {
    this.setState({ academiccertificate: academiccertificate });
    this.setState({ deleteModal: true });
  };

  handleDeleteAcademicCertificate = () => {
    const { onDeleteAcademicCertificate } = this.props;
    const { academiccertificate } = this.state;

    if (academiccertificate.Id !== undefined) {
      let onDelete = { Id: academiccertificate.Id };
      onDeleteAcademicCertificate(onDelete);
    }
    this.setState({ deleteModal: false, showAlert: true });
  };

  handleAcademicCertificateClick = arg => {
    const { academiccertificate } = this.state;

    this.setState({
      academiccertificate: arg,
      selectedFaculty: arg.facultyId,
      selectedTrainerGrade: arg.trainerGradeId,
      selectedEducation: arg.educationType,
      isEdit: true,
    });

    this.toggle();
  };
  handleSave = values => {
    
    const {
      isEdit,
      selectedDepartment,
      selectedFaculty,
      selectedTrainerGrade,
      selectedBeginSemester,
      selectedEndSemester,
      selectedEducation,
      academiccertificate,
    } = this.state;
    const {
      onAddNewAcademicCertificate,
      onUpdateAcademicCertificate,
      academiccertificates,
    } = this.props;

    values["educationType"] = selectedEducation;
    values["facultyId"] = selectedFaculty;
    values['trainerGradeId']= selectedTrainerGrade;
    values["departmentId"] = selectedDepartment;
    values["yearSemesterBeginnigId"] = selectedBeginSemester;
    values["yearSemesteEndId"] = selectedEndSemester;

    values.certificateNum = parseInt(values.certificateNum) || "";

    values.maxStudyPeriod = parseInt(values.maxStudyPeriod) || "";
    values.minStudyPeriod = parseInt(values.minStudyPeriod) || "";

    if (values.artitle === "") {
      this.setState({ arTitleSaveError: true });
    }
    if (values.certificateNum === "") {
      this.setState({ academicNumberError: true });
    } else {
      this.setState({ arTitleSaveError: false });
      this.setState({ academicNumberError: false });
    }

    if (
      values.artitle &&
      /^\d+$/.test(values.certificateNum) &&
      (!values.majorCode || /^\d+$/.test(values.majorCode)) &&
      selectedFaculty !== null
    ) {
      if (values.maxStudyPeriod < values.minStudyPeriod) {
        const errorMessage = this.props.t(
          "Maximum study period must be greater than minimum study period"
        );

        this.setState({ minMaxValueError: errorMessage });

        return;
      } else {
        this.setState({ minMaxValueError: null });
      }

      let sectionInfo = {};
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          sectionInfo[key] = values[key];
      });
      if (isEdit) {
        const isDuplicateCertificateNum = academiccertificates.some(
          cert =>
            cert.certificateNum === sectionInfo.certificateNum &&
            cert.Id !== sectionInfo.Id
        );
        const isDuplicateCertificateMajor = academiccertificates.some(
          cert =>
            sectionInfo.majorCode &&
            cert.majorCode === sectionInfo.majorCode &&
            cert.Id !== sectionInfo.Id
        );
        if (!isDuplicateCertificateNum && !isDuplicateCertificateMajor){
          onUpdateAcademicCertificate(sectionInfo);

        }
          else{
            console.log("isDuplicateCertificateNum",isDuplicateCertificateNum)
            console.log("isDuplicateMajorCode",isDuplicateCertificateMajor)
          }
      } else {
        const isDuplicateCertificateNum = academiccertificates.some(
          certificate =>
            certificate.Id &&
            !academiccertificate.Id &&
            certificate.certificateNum &&
            certificate.certificateNum === sectionInfo.certificateNum
        );
        const isDuplicateMajorCode = academiccertificates.some(
          certificate =>
            certificate.Id &&
            !academiccertificate.Id &&
            certificate.majorCode &&
            certificate.majorCode === sectionInfo.majorCode
        );
        if (!isDuplicateCertificateNum && !isDuplicateMajorCode) {
          onAddNewAcademicCertificate(sectionInfo);
        }
        else{
          console.log("isDuplicateCertificateNum",isDuplicateCertificateNum)
          console.log("isDuplicateMajorCode",isDuplicateMajorCode)
        }
      }
      this.setState({
        selectedAcademicCertificate: null,
        errorMessages: {},
      });
      this.toggle();
    } else {
      const errorMessages = {
        artitle: !values.artitle ? "Academic Certificate is required" : "",
        certificateNum: !values.certificateNum
          ? "Academic Number is required"
          : "",
        facultyId: selectedFaculty === null ? "Faculty is required" : "",
      };
      if (!values.artitle) {
        errorMessages.artitle = "Academic Certificate is required";
      }
      if (!values.certificateNum) {
        errorMessages.certificateNum = "Academic Number is required";
      }
      if (selectedFaculty === null) {
        errorMessages.facultyId = "Faculty is required";
      }
      if (values.majorCode !== null && !/^\d+$/.test(values.majorCode)) {
        errorMessages.majorCode = "Major Code must contain only numeric digits";
      }
      this.setState({
        errorMessages,
      });
    }
  };

  handleSuccessClose = () => {
    const { onGetAcademicCertificateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAcademicCertificateDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetAcademicCertificateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAcademicCertificateDeletedValue();
  };

  handleAlertClose = () => {
    this.setState({ minMaxValueError: null });
  };

  render() {
    //meta title
    document.title =
      "AcademicCertificate List | keyInHands - React Admin & Dashboard Template";

    // const { academiccertificates } = this.state
    const { SearchBar } = Search;

    const {
      academiccertificates,
      faculties,
      trainersGrades,
      yearSemesters,
      filteredDepartments,
      departments,
      deleted,
    } = this.props;

    const {
      isEdit,
      deleteModal,
      showAlert,
      arTitleSaveError,
      academicNumberError,
      facultieIdError,
      minMaxValueError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    console.log("in render major types",trainersGrades)

    const { onAddNewAcademicCertificate, onUpdateAcademicCertificate } =
      this.props;
    const academiccertificate = this.state.academiccertificate;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: academiccertificates.length, // replace later with size(academiccertificates),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "Id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    const academiccertificateListColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        formatter: (cellContent, academiccertificates) => (
          <>{academiccertificates.Id}</>
        ),
        sort: true,
      },
      {
        text: this.props.t("Academic Certificate(Ar)"),
        dataField: "AcadmicCertificatesArName",
        sort: true,
        formatter: (cellContent, academiccertificates) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {academiccertificates.AcadmicCertificatesArName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Academic Certificate(EN)"),
        dataField: "AcadmicCertificatesEnName",
        sort: true,
        formatter: (cellContent, academiccertificates) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {academiccertificates.AcadmicCertificatesEnName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Faculty"),
        dataField: "facultyNmae",
        sort: true,
        formatter: (cellContent, academiccertificates) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {academiccertificates.facultyName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Number of Hours"),
        dataField: "nbHours",
        sort: true,
        formatter: (cellContent, academiccertificates) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {academiccertificates.nbHours}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Maximum Study Period"),
        dataField: "maxStudyPeriod",
        sort: true,
        formatter: (cellContent, academiccertificates) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {academiccertificates.maxStudyPeriod}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },

      {
        text: this.props.t("Minimum Study Period"),
        dataField: "minStudyPeriod",
        sort: true,
        formatter: (cellContent, academiccertificates) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {academiccertificates.minStudyPeriod}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Average Period Study"),
        dataField: "avgPeriodStudy",
        sort: true,
        formatter: (cellContent, academiccertificates) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {academiccertificates.avgPeriodStudy}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Major Types"),
        dataField: "trainerGrade",
        sort: true,
        formatter: (cellContent, academiccertificates) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {academiccertificates.trainerGrade}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },

      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: this.props.t("Action"),
        formatter: (cellContent, academiccertificate) => (
          <div className="d-flex gap-3">
            {showEditButton && (
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() =>
                    this.handleAcademicCertificateClick(academiccertificate)
                  }
                ></i>
              </Link>
            )}
            {showDeleteButton && (
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(academiccertificate)}
                ></i>
              </Link>
            )}
          </div>
        ),
      },
    ];
    const yearSemestersModified = yearSemesters.map(item => ({
      value: item.key,
      label: item.value,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    const { t } = this.props;

    const alertMessage =
      deleted === 0
        ? t("Can't Delete (Delete data related to it)")
        : t("Deleted Successfully");
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteAcademicCertificate}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title={t("Academic Certificates")}
              breadcrumbItem={t("Academic Certificates List")}
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
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
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="Id"
                      columns={academiccertificateListColumns}
                      data={academiccertificates}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          columns={academiccertificateListColumns}
                          data={this.props.academiccertificates}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4"></Col>
                                {showAddButton && (
                                  <Col sm="8">
                                    <div className="text-sm-end">
                                      <Tooltip
                                        title={t("Create New")}
                                        placement="top"
                                      >
                                        <IconButton
                                          color="primary"
                                          onClick={
                                            this.handleAcademicCertificateClicks
                                          }
                                        >
                                          <i className="mdi mdi-plus-circle blue-noti-icon" />
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  </Col>
                                )}
                              </Row>
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      //selectRow={selectRow}

                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                      filterPosition="top"
                                    />

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? t("Edit AcademicCertificate")
                                          : t("Add AcademicCertificate")}
                                      </ModalHeader>

                                      <ModalBody>
                                        <div>
                                          {minMaxValueError && (
                                            <Alert
                                              color="danger"
                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                              role="alert"
                                            >
                                              {minMaxValueError}
                                              <button
                                                type="button"
                                                className="btn-close"
                                                aria-label="Close"
                                                onClick={this.handleAlertClose}
                                              ></button>
                                            </Alert>
                                          )}
                                        </div>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            Id: academiccertificate.Id,
                                            artitle:
                                              (academiccertificate &&
                                                academiccertificate.AcadmicCertificatesArName) ||
                                              "",
                                            entitle:
                                              (academiccertificate &&
                                                academiccertificate.AcadmicCertificatesEnName) ||
                                              "",
                                            certificateNum:
                                              (academiccertificate &&
                                                academiccertificate.certificateNum) ||
                                              "",
                                            facultyId:
                                              (academiccertificate &&
                                                academiccertificate.facultyId) ||
                                              "",
                                            departmentId:
                                              (academiccertificate &&
                                                academiccertificate.departmentId) ||
                                              "",
                                            majorCode:
                                              (academiccertificate &&
                                                academiccertificate.majorCode) ||
                                              "",
                                            nbHours:
                                              (academiccertificate &&
                                                academiccertificate.nbHours) ||
                                              "",
                                            minStudyPeriod:
                                              (academiccertificate &&
                                                academiccertificate.minStudyPeriod) ||
                                              "",
                                            avgPeriodStudy:
                                              (academiccertificate &&
                                                academiccertificate.avgPeriodStudy) ||
                                              "",
                                            maxStudyPeriod:
                                              (academiccertificate &&
                                                academiccertificate.maxStudyPeriod) ||
                                              "",
                                            yearSemesterBeginnigId:
                                              (academiccertificate &&
                                                academiccertificate.yearSemesterBeginnigId) ||
                                              "",
                                            yearSemesteEndId:
                                              (academiccertificate &&
                                                academiccertificate.yearSemesteEndId) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            artitle: Yup.string().required(
                                              t(
                                                "Academic Certificate is required"
                                              )
                                            ),
                                            certificateNum:
                                              Yup.string().required(
                                                t("Academic Number is required")
                                              ),
                                            facultyId: Yup.string().required(
                                              t("Faculty is required")
                                            ),
                                          })}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                          }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      {t(
                                                        "AcademicCertificate(ar)"
                                                      )}
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="artitle"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        ((errors.artitle &&
                                                          touched.artitle) ||
                                                        arTitleSaveError
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    {arTitleSaveError && (
                                                      <div className="invalid-feedback">
                                                        {t(
                                                          "Academic Certificate is required"
                                                        )}
                                                      </div>
                                                    )}
                                                    <ErrorMessage
                                                      name="artitle"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Row>
                                                      <Col>
                                                        <Label className="form-label">
                                                          {t(
                                                            "Academic Certificate"
                                                          )}
                                                        </Label>
                                                        <br />
                                                        <br />
                                                        <Field
                                                          name="entitle"
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            (errors.entitle &&
                                                            touched.entitle
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />

                                                        <ErrorMessage
                                                          name="entitle"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                      <Col>
                                                        <Label className="form-label">
                                                          {t("Academic Number")}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </Label>
                                                        <Field
                                                          name="certificateNum"
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            ((errors.certificateNum &&
                                                              touched.certificateNum) ||
                                                            academicNumberError
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />
                                                        {academicNumberError && (
                                                          <div className="invalid-feedback">
                                                            {t(
                                                              "Academic Number is required"
                                                            )}
                                                          </div>
                                                        )}
                                                        <ErrorMessage
                                                          name="certificateNum"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>

                                                  <div className=" d-flex">
                                                    <div className="mb-3 me-5">
                                                      <label className="form-label">
                                                        {t("Faculty")}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </label>
                                                      <Select
                                                        className="select-style"
                                                        name="facultyId"
                                                        key={`faculty_select`}
                                                        options={faculties}
                                                        onChange={newValue => {
                                                          this.handleSelectChange(
                                                            "facultyId",
                                                            newValue.value
                                                          );
                                                        }}
                                                        defaultValue={faculties.find(
                                                          opt =>
                                                            opt.value ===
                                                            academiccertificate.facultyId
                                                        )}
                                                      />
                                                      {facultieIdError && (
                                                        <div className="invalid-feedback">
                                                          {t(
                                                            "Faculty is required"
                                                          )}
                                                        </div>
                                                      )}
                                                      <ErrorMessage
                                                        name="facultyId"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>

                                                    <div className="dep">
                                                      <label className="form-label">
                                                        {t("Department")}
                                                      </label>
                                                      <Select
                                                        className="select-style"
                                                        name="departmentId"
                                                        key={`department_select`}
                                                        options={
                                                          filteredDepartments
                                                        }
                                                        onChange={newValue => {
                                                          this.handleSelectChange(
                                                            "departmentId",
                                                            newValue.value
                                                          );
                                                        }}
                                                        defaultValue={departments.find(
                                                          opt =>
                                                            opt.value ===
                                                            academiccertificate.departmentId
                                                        )}
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="d-flex">
                                                    <div className="mb-3 me-5">
                                                      <Label className="form-label">
                                                        {t("Major Code")}
                                                      </Label>
                                                      <div className="flex-grow-1">
                                                        <Field
                                                          name="majorCode"
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            (errors.majorCode &&
                                                            touched.majorCode
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          name="entitle"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    </div>
                                                    

                                                    <div className="mb-3 ">
                                                      <label className="form-label">
                                                        {t("Major Type")}
                                                      </label>
                                                      <Select
                                                        className="select-style"
                                                        name="trainerGradeId"
                                                        key={`trainerGrade_select`}
                                                        options={trainersGrades}
                                                        onChange={newValue => {
                                                          this.handleSelectChange(
                                                            "trainerGradeId",
                                                            newValue.value
                                                          );
                                                        }}
                                                        defaultValue={trainersGrades.find(
                                                          opt =>
                                                            opt.value ===
                                                            academiccertificate.trainerGradeId
                                                        )}
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="d-flex">
                                                    <div className="mb-3 me-5">
                                                      <Label className="form-label">
                                                        {t("Number of Hours")}
                                                      </Label>
                                                      <Field
                                                        name="nbHours"
                                                        type="text"
                                                        className={
                                                          "form-control" +
                                                          (errors.nbHours &&
                                                          touched.nbHours
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="nbHours"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>

                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        {t(
                                                          "Average Period of Study"
                                                        )}
                                                      </Label>
                                                      <Field
                                                        name="avgPeriodStudy"
                                                        type="text"
                                                        className={
                                                          "form-control" +
                                                          (errors.avgPeriodStudy &&
                                                          touched.avgPeriodStudy
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="avgPeriodStudy"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="d-flex">
                                                    <div className="mb-3 me-5">
                                                      <Label className="form-label">
                                                        {t(
                                                          "Minimum Study Period"
                                                        )}
                                                      </Label>
                                                      <Field
                                                        name="minStudyPeriod"
                                                        type="text"
                                                        className={
                                                          "form-control" +
                                                          (errors.minStudyPeriod &&
                                                          touched.minStudyPeriod
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="minStudyPeriod"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>

                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        {t(
                                                          "Maximum Study Period"
                                                        )}
                                                      </Label>
                                                      <Field
                                                        name="maxStudyPeriod"
                                                        type="text"
                                                        className={
                                                          "form-control" +
                                                          (errors.maxStudyPeriod &&
                                                          touched.maxStudyPeriod
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="maxStudyPeriod"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </div>

                                                  <Row>
                                                    <Col lg="6">
                                                      <label
                                                        htmlFor="exampleDataList"
                                                        className="form-label"
                                                      >
                                                        {t(
                                                          "Beginning of Semester"
                                                        )}
                                                      </label>
                                                    </Col>

                                                    <Col lg="6">
                                                      <label
                                                        htmlFor="exampleDataList"
                                                        className="form-label"
                                                      >
                                                        {t("To")}
                                                      </label>
                                                    </Col>
                                                  </Row>

                                                  <Row className="mb-3">
                                                    <Col sm="6">
                                                      {" "}
                                                      <Select
                                                        name="yearSemesters"
                                                        key={`select_fromSemester`}
                                                        options={
                                                          yearSemestersModified
                                                        }
                                                        onChange={newValue => {
                                                          this.handleSelectChange(
                                                            "yearSemesterBeginnigId",
                                                            newValue.value
                                                          );
                                                        }}
                                                        defaultValue={yearSemestersModified.find(
                                                          opt =>
                                                            opt.value ===
                                                            academiccertificate.yearSemesterBeginnigId
                                                        )}
                                                      />
                                                    </Col>

                                                    <Col sm="6">
                                                      <Select
                                                        name="yearSemesters"
                                                        key={`select_endSemester`}
                                                        options={
                                                          yearSemestersModified
                                                        }
                                                        onChange={newValue => {
                                                          this.handleSelectChange(
                                                            "yearSemesteEndId",
                                                            newValue.value
                                                          );
                                                        }}
                                                        defaultValue={yearSemestersModified.find(
                                                          opt =>
                                                            opt.value ===
                                                            academiccertificate.yearSemesteEndId
                                                        )}
                                                      />
                                                    </Col>
                                                  </Row>

                                                {/*   <div className="row">
                                                    <div className=" mb-3 me-3">
                                                      <label
                                                        htmlFor="exampleDataList"
                                                        className="form-label me-3"
                                                      >
                                                        {t("Education Type")}
                                                      </label>
                                                      <div
                                                        className="btn-group"
                                                        role="group"
                                                      >
                                                        <input
                                                          type="radio"
                                                          className="btn-check"
                                                          name="btnradio"
                                                          id="btnradio4"
                                                          autoComplete="off"
                                                          value="Distance Learning"
                                                          onChange={() =>
                                                            this.handleRadioChange(
                                                              "Distance Learning"
                                                            )
                                                          }
                                                          checked={
                                                            this.state
                                                              .selectedEducation ===
                                                            "Distance Learning"
                                                          }
                                                        />
                                                        <label
                                                          className="btn btn-outline-primary"
                                                          htmlFor="btnradio4"
                                                        >
                                                          {t(
                                                            "Distance Learning"
                                                          )}
                                                        </label>

                                                        <input
                                                          type="radio"
                                                          className="btn-check"
                                                          name="btnradio"
                                                          id="btnradio5"
                                                          autoComplete="off"
                                                          value="Compact"
                                                          onChange={() =>
                                                            this.handleRadioChange(
                                                              "Compact"
                                                            )
                                                          }
                                                          checked={
                                                            this.state
                                                              .selectedEducation ===
                                                            "Compact"
                                                          }
                                                        />
                                                        <label
                                                          className="btn btn-outline-primary"
                                                          htmlFor="btnradio5"
                                                        >
                                                          {t("Compact")}
                                                        </label>

                                                        <input
                                                          type="radio"
                                                          className="btn-check"
                                                          name="btnradio"
                                                          id="btnradio6"
                                                          autoComplete="off"
                                                          value="At University"
                                                          onChange={() =>
                                                            this.handleRadioChange(
                                                              "At University"
                                                            )
                                                          }
                                                          checked={
                                                            this.state
                                                              .selectedEducation ===
                                                            "At University"
                                                          }
                                                        />
                                                        <label
                                                          className="btn btn-outline-primary"
                                                          htmlFor="btnradio6"
                                                        >
                                                          {t("At University")}
                                                        </label>
                                                      </div>
                                                    </div>
                                                  </div> */}
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
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

/*
const mapStateToProps = ({ state }) => ({
  academiccertificates: state.academiccertificates,
});
*/

const mapStateToProps = ({
  academiccertificates,
  generalManagements,
  mobAppFacultyAccs,
  departments,
  menu_items,
  trainersGrades
}) => ({
  academiccertificates: academiccertificates.academiccertificates,
  deleted: academiccertificates.deleted,
  faculties: mobAppFacultyAccs.faculties,
  yearSemesters: generalManagements.yearSemesters,
  filteredDepartments: departments.filteredDepartments,
  departments: departments.departments,
  trainersGrades: trainersGrades.trainersGrades,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetAcademicCertificates: () => dispatch(getAcademicCertificates()),
  onAddNewAcademicCertificate: academiccertificate =>
    dispatch(addNewAcademicCertificate(academiccertificate)),
  onUpdateAcademicCertificate: academiccertificate =>
    dispatch(updateAcademicCertificate(academiccertificate)),
  onDeleteAcademicCertificate: academiccertificate =>
    dispatch(deleteAcademicCertificate(academiccertificate)),
  onGetFilteredDepartments: facultyId =>
    dispatch(getFilteredDepartments(facultyId)),
  onGetAcademicCertificateDeletedValue: () =>
    dispatch(getAcademicCertificateDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(AcademicCertificates)));
