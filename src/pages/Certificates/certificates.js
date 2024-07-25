import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Modal,
  Label,
  Button,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  getCertificates,
  addNewCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificateDeletedValue,
} from "store/certificates/actions";
import * as Yup from "yup";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { isEmpty, size, map } from "lodash";
import { Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
const CERTIFICATE_STORAGE_KEY = "editableCertificate";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";

class Certificates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certificates: [],
      certificate: "",
      selectedCertLevel: null,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      modal: false,
      academicCodeError: false,
      isEdit: false,
      sectorsArray: []
    };
  }

  componentDidMount() {
    const {
      certificates,
      certificateTypes,
      onGetCertificates,
      deleted,
      user_menu,
      userTypes,
      sectors,
      years,
      trainersGrades,
      trainers
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (certificates && !certificates.length) {
      onGetCertificates();
    }
    this.setState({
      certificates,
      certificateTypes,
      deleted,
      userTypes,
      sectors,
      trainersGrades,
      trainers,
      years,
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

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    /* const { certificates, onAddNewCertificate } = this.props;
    const newRow = {
      academicCode: "-----",
    };
  
    // Check if the same value already exists in the table
    const emptyRowsExist = certificates.some(certificate => {
      const arTitle = certificate.arTitle || "";
      return arTitle.trim() === "-----";
    });
  
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewCertificate(newRow);
    } */

    this.setState({
      certificate: "",
      isEdit: false,
    });
    this.toggle();
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleDeleteRow = () => {
    const { onDeleteCertificate } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteCertificate(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleCertificateDataChange = (rowId, fieldName, fieldValue) => {
    const { certificates, onUpdateCertificate } = this.props;
    const isDuplicate = certificates.some(
      certificate =>
        certificate.Id !== rowId &&
        certificate.arTitle.trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateCertificate(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateCertificate(onUpdate);
    }
  };

  handleSelectCertificateType = (rowId, fieldName, selectedValue) => {
    this.setState({
      selectedCertLevel: selectedValue,
    });
    const { onUpdateCertificate } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateCertificate(onUpdate);
  };

  handleSuccessClose = () => {
    const { onGetCertificateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCertificateDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetCertificateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCertificateDeletedValue();
  };

  /*   handleSelectChange = (rowId, fieldName, selectedValue) => {
    const { onUpdateCertificate } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateCertificate(onUpdate);
  }; */

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  handleSelectChange = (fieldName, selectedValue) => {
    console.log("selected value", selectedValue);
    if (fieldName === "trainerId") {
      this.setState({
        selectedTrainer: selectedValue,
      });
    } else if (fieldName == "userTypeId") {
      this.setState({
        selectedUserType: selectedValue,
      });
    } else if (fieldName == "trainerGradeId") {
      this.setState({
        selectedTrainerGrade: selectedValue,
      });
    } else if (fieldName == "certificateTypeId") {
      this.setState({
        selectedCertificateType: selectedValue,
      });
    } else if (fieldName == "yearId") {
      this.setState({
        selectedYear: selectedValue,
      });
    }
  };

  handleMulti = (fieldName, selectedMulti) => {
    if (fieldName === "sector") {
      this.setState({ sectorsArray: selectedMulti });
    }
  }

  handleSave = values => {
    const {
      isEdit,
      selectedUserType,
      selectedTrainer,
      selectedCertificateType,
      selectedTrainerGrade,
      selectedSector,
      selectedYear,
      certificate,
      sectorsArray
    } = this.state;
    const {
      onAddNewCertificate,
      onUpdateCertificate,
      certificates,
    } = this.props;

    values["yearId"] = selectedYear;
    values["trainerId"] = selectedTrainer;
    values["userTypeId"] = selectedUserType;
    values["certificateTypeId"] = selectedCertificateType;
    values["trainerGradeId"] = selectedTrainerGrade;
    values["sector"] = sectorsArray;

    if (values.academicCode === "") {
      this.setState({ academicCodeError: true });
    } else {
      this.setState({ academicCodeError: false });
    }

    if (
      values.academicCode &&
      selectedUserType !== null &&
      selectedTrainer !== null &&
      selectedYear !== null &&
      selectedCertificateType !== null &&
      selectedTrainerGrade !== null &&
      sectorsArray.length !== 0
    ) {
      let sectionInfo = {};
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          sectionInfo[key] = values[key];
      });
      if (isEdit) {
        const isDuplicateCertificateCode = certificates.some(
          cert =>
            cert.academicCode === sectionInfo.academicCode &&
            cert.Id !== sectionInfo.Id
        );

        if (!isDuplicateCertificateCode) {
          onUpdateCertificate(sectionInfo);
        }
      } else {
        const isDuplicateCertificateCode = certificates.some(
          certificate =>
            certificate.Id &&
            !certificate.Id &&
            certificate.academicCode &&
            certificate.academicCode === sectionInfo.academicCode
        );

        if (!isDuplicateCertificateCode) {
          onAddNewCertificate(sectionInfo);
        } else {
          console.log("isDuplicateCertificateCode");
        }
      }
      this.setState({
        selectedAcademicCertificate: null,
        errorMessages: {},
      });
      this.toggle();
    } else {
      const errorMessages = {
        academicCode: !values.academicCode ? "Academic Code is required" : "",
      };
      if (selectedUserType === null) {
        errorMessages.userTypeId = "user type is required";
      }
      if (selectedTrainer === null) {
        errorMessages.trainerId = "trainer is required";
      }
      if (selectedTrainerGrade === null) {
        errorMessages.trainerGradeId = "trainer grade is required";
      }
      if (selectedYear === null) {
        errorMessages.yearId = "year is required";
      }
      if (sectorsArray.length == 0) {
        errorMessages.sector = "sector is required";
      }
      if (selectedCertificateType === null) {
        errorMessages.certificateTypeId = "Certificate Type is required";
      }

      this.setState({
        errorMessages,
      });
    }
  };

  handleCertificateClick = arg => {
    const { certificate } = this.state;
    console.log("arg",arg)

    this.setState({
      certificate: arg,
      selectedUserType :arg.userTypeId,
      selectedTrainer :arg.trainerId,
      selectedCertificateType :arg.certificateTypeId,
      selectedTrainerGrade :arg.trainerGradeId,
      sectorsArray: arg.sector,
      selectedYear:arg.yearId,
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;
    const {
      certificates,
      user_menu,
      deleted,
      userTypes,
      years,
      sectors,
      certificateTypes,
      trainersGrades,
      trainers,
      t,
    } = this.props;
    const { modal, certificate, isEdit, academicCodeError ,sectorsArray} = this.state;
    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
   // console.log("certificate", certificate);

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "academicCode",
        text: this.props.t("Academic Code"),
        sort: true,
      },
      {
        dataField: "certificateType",
        text: this.props.t("Certificate Type"),
        sort: true,

        editable: false,
      },
      {
        dataField: "userType",
        text: this.props.t("User Type"),
        sort: true,

        editable: false,
      },
      {
        dataField: "trainer",
        text: this.props.t("Trainer"),
        sort: true,
        editable: false,
      },
      {
        dataField: "trainerGrade",
        text: this.props.t("Trainer Grade"),
        sort: true,
        editable: false,
      },
      {
        dataField: "sector",
        text: this.props.t("Sector"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => {
          if (row.sector && Array.isArray(row.sector)) {
            return row.sector.map((item) => item.label).join(", ");
          }
          return "";
        },
      },
      {
        dataField: "certificateYear",
        text: this.props.t("Year"),
        sort: true,
        editable: false,
      },
      {
        dataField: "certificateNum",
        text: this.props.t("Certificate Number"),
        sort: true,
        editable: false,
      },

      {
        dataField: "delete",
        text: "",
        //   hidden: !showDeleteButton,
        isDummyField: true,
        editable: false, // Set the "Action" column to not editable
        formatter: (cellContent, certificate) => (
        <div className="d-flex gap-3"> 
          <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() =>
                    this.handleCertificateClick(certificate)
                  }
                ></i>
              </Link>
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(certificate)}
            ></i>
          </Link></div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: certificates.length,
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
              title={`${this.props.t("Settings")} / ${this.props.t(
                "University Admission"
              )}`}
              breadcrumbItem={this.props.t("Certificates")}
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
                        data={certificates}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={certificates}
                            columns={columns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                      {showSearchButton && (
                                        <div className="position-relative">
                                          <SearchBar
                                            {...toolkitprops.searchProps}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  <Col sm="8">
                                    {/*  {showAddButton && ( */}
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
                                    {/* )} */}
                                  </Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={certificates}
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
                                      this.handleCertificateDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Certificate Types found"
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
                                  className={this.props.className}
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit
                                      ? t("Edit Certificate")
                                      : t("Add Certificate")}
                                  </ModalHeader>

                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit && { Id: certificate.Id }),
                                        academicCode:
                                          (certificate &&
                                            certificate.academicCode) ||
                                          "",
                                        userTypeId:
                                          (certificate &&
                                            certificate.userTypeId) ||
                                          "",
                                        yearId:
                                          (certificate && certificate.yearId) ||
                                          "",
                                        trainerGradeId:
                                          (certificate &&
                                            certificate.trainerGradeId) ||
                                          "",
                                        trainerId:
                                          (certificate &&
                                            certificate.trainerId) ||
                                          "",
                                        sector:
                                          (certificate &&
                                            certificate.sector) ||
                                          "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        academicCode: Yup.string().required(
                                          t("Academic Code is required")
                                        ),
                                        sector: Yup.string().required(
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
                                            <Col>
                                              <Row>
                                                <Col lg="6">
                                                  <Label>
                                                    {t("Academic Code")}
                                                   
                                                  </Label>
                                                </Col>
                                                <Col lg="6">
                                                  <Field
                                                    name="academicCode"
                                                    type="text"
                                                    className={
                                                      "form-control" +
                                                      ((errors.academicCode &&
                                                        touched.academicCode) ||
                                                      academicCodeError
                                                        ? " is-invalid"
                                                        : "")
                                                    }
                                                  />
                                                  {academicCodeError && (
                                                    <div className="invalid-feedback">
                                                      {t(
                                                        "Academic Code is required"
                                                      )}
                                                    </div>
                                                  )}
                                                  <ErrorMessage
                                                    name="academicCode"
                                                    component="div"
                                                    className="invalid-feedback"
                                                  />
                                                </Col>
                                              </Row>

                                              <Row>
                                                <Col lg="6">
                                                  <label
                                                    htmlFor="exampleDataList"
                                                    className="form-label"
                                                  >
                                                    {t("Certificate Type")}
                                                  </label>
                                                </Col>

                                                <Col lg="6">
                                                  <label
                                                    htmlFor="exampleDataList"
                                                    className="form-label"
                                                  >
                                                    {t("User Type")}
                                                  </label>
                                                </Col>
                                              </Row>

                                              <Row className="mb-3">
                                                <Col sm="6">
                                                  {" "}
                                                  <Select
                                                    name="certificateTypeId"
                                                    key={`select_fromSemester`}
                                                    options={certificateTypes}
                                                    onChange={newValue => {
                                                      this.handleSelectChange(
                                                        "certificateTypeId",
                                                        newValue.value
                                                      );
                                                    }}
                                                    defaultValue={certificateTypes.find(
                                                      opt =>
                                                        opt.value ===
                                                        certificate.certificateTypeId
                                                    )}
                                                  />
                                                </Col>

                                                <Col sm="6">
                                                  <Select
                                                    name="userTypeId"
                                                    key={`select_endSemester`}
                                                    options={userTypes}
                                                    onChange={newValue => {
                                                      this.handleSelectChange(
                                                        "userTypeId",
                                                        newValue.value
                                                      );
                                                    }}
                                                    defaultValue={userTypes.find(
                                                      opt =>
                                                        opt.value ===
                                                        certificate.userTypeId
                                                    )}
                                                  />
                                                </Col>
                                              </Row>

                                              <Row>
                                                <Col lg="6">
                                                  <label
                                                    htmlFor="exampleDataList"
                                                    className="form-label"
                                                  >
                                                    {t("Trainer")}
                                                  </label>
                                                </Col>

                                                <Col lg="6">
                                                  <label
                                                    htmlFor="exampleDataList"
                                                    className="form-label"
                                                  >
                                                    {t("Trainer Grade")}
                                                  </label>
                                                </Col>
                                              </Row>

                                              <Row className="mb-3">
                                                <Col sm="6">
                                                  {" "}
                                                  <Select
                                                    name="trainerId"
                                                    key={`select_fromSemester`}
                                                    options={trainers}
                                                    onChange={newValue => {
                                                      this.handleSelectChange(
                                                        "trainerId",
                                                        newValue.value
                                                      );
                                                    }}
                                                    defaultValue={trainers.find(
                                                      opt =>
                                                        opt.value ===
                                                        certificate.trainerId
                                                    )}
                                                  />
                                                </Col>

                                                <Col sm="6">
                                                  <Select
                                                    name="trainerGradeId"
                                                    key={`select_endSemester`}
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
                                                        certificate.trainerGradeId
                                                    )}
                                                  />
                                                </Col>
                                              </Row>

                                              <Row>
                                                <Col lg="6">
                                                  <label
                                                    htmlFor="exampleDataList"
                                                    className="form-label"
                                                  >
                                                    {t("Sector")}
                                                  </label>
                                                </Col>

                                                <Col lg="6">
                                                  <label
                                                    htmlFor="exampleDataList"
                                                    className="form-label"
                                                  >
                                                    {t("Year")}
                                                  </label>
                                                </Col>
                                              </Row>

                                              <Row className="mb-3">
                                                <Col sm="6">
                                                  {" "}
                                                  <Select
                                                    name="sector"
                                                    key={`select_fromSemester`}
                                                    options={sectors}
                                                    onChange={selectedOption =>
                                                      this.handleMulti(
                                                        "sector",
                                                        selectedOption
                                                      )
                                                    }
                                                   value={sectorsArray}
                                                    isMulti={
                                                      true
                                                    }
                                                  />
                                                </Col>

                                                <Col sm="6">
                                                  <Select
                                                    name="yearId"
                                                    key={`select_endSemester`}
                                                    options={years}
                                                    onChange={newValue => {
                                                      this.handleSelectChange(
                                                        "yearId",
                                                        newValue.value
                                                      );
                                                    }}
                                                    defaultValue={years.find(
                                                      opt =>
                                                        opt.value ===
                                                        certificate.yearId
                                                    )}
                                                  />
                                                </Col>
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

const mapStateToProps = ({
  certificates,
  menu_items,
  years,
  userTypes,
  certificateTypes,
  sectors,
  trainersGrades,
  trainers
}) => ({
  certificates: certificates.certificates,
  certificateTypes: certificateTypes.certificateTypes,
  userTypes: userTypes.userTypes,
  sectors: sectors.sectors,
  trainers: trainers.trainers,
  trainersGrades: trainersGrades.trainersGrades,
  years: years.years,
  deleted: certificates.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCertificates: () => dispatch(getCertificates()),
  onAddNewCertificate: certificate => dispatch(addNewCertificate(certificate)),
  onUpdateCertificate: certificate => dispatch(updateCertificate(certificate)),
  onDeleteCertificate: certificate => dispatch(deleteCertificate(certificate)),
  onGetCertificateDeletedValue: () => dispatch(getCertificateDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(Certificates)));
