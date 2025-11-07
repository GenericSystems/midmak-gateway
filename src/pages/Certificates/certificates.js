import React, { Component } from "react";
import JsBarcode from "jsbarcode";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Alert,
  Modal,
  Label,
  Button,
  ModalHeader,
  ModalBody,
  Input,
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
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  getCertificates,
  addNewCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificateDeletedValue,
  getFilteredCoursesCertificates,
} from "store/certificates/actions";
import { getUserTypesOpt } from "store/user-types/actions";

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
import QRCode from "qrcode";

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
      sectorsArray: [],
      QRModal: false,
      qr: "",
      sidebarOpen: true,
      selectedUserType: "",
      filteredCoursesModified: [],
      selectedGrantDate: new Date().toISOString().split("T")[0],
    };
  }

  /*  initializeState() {
    const {selectedUserType} = this.state
    console.log("selectedUserType in initail state", selectedUserType)
    this.setState({selectedUserType :selectedUserType})
  } */

  componentDidMount() {
    const {
      certificates,
      certificateTypes,
      deleted,
      user_menu,
      userTypesOpt,
      sectors,
      years,
      filteredCertificateGrades,
      filteredMembers,
      onGetUsers,
      traineesOpt,
      filteredCourses,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (certificates && !certificates.length) {
      onGetUsers();
    }
    this.setState({
      certificates,
      certificateTypes,
      deleted,
      userTypesOpt,
      sectors,
      filteredCertificateGrades,
      filteredMembers,
      years,
      traineesOpt,
      filteredCourses,
    });

    const currentDate = new Date();

    const formattedDate = currentDate.toISOString().slice(0, 10);

    this.setState({
      grantDate: formattedDate,
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
    /*     const {selectedUserType} = this.state
    if (
      (selectedUserType &&
        selectedUserType !==
          prevProps.selectedUserType) 
    ) {
      this.initializeState();
    } */
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

  onClickDelete = row => {
    this.setState({ selectedRowId: row.Id, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      certificate: "",
      isEdit: false,
    });
    this.toggle();
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null, emptyError: null });
  };

  handleDeleteRow = () => {
    const { onDeleteCertificate } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteCertificate({ Id: selectedRowId });

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
    if (fieldName === "trainerId") {
      console.log("selected value2222222222222222", selectedValue);

      this.setState({
        selectedMember: selectedValue,
      });
    } else if (fieldName == "userTypeId") {
      console.log("selected value", selectedValue);

      const { onGetCertificates } = this.props;
      onGetCertificates({ userTypeId: selectedValue });
      this.setState({
        selectedUserType: selectedValue,
      });
    } else if (fieldName == "trainerGradeId") {
      this.setState({
        selectedMemberGrade: selectedValue,
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
  };

  handleSave = values => {
    const {
      isEdit,
      selectedUserType,
      selectedMember,
      selectedCertificateType,
      selectedMemberGrade,
      selectedSector,
      selectedYear,
      certificate,
      sectorsArray,
    } = this.state;
    const { onAddNewCertificate, onUpdateCertificate, certificates } =
      this.props;
    console.log("values", values);

    values["yearId"] = selectedYear;
    values["trainerId"] = selectedMember;
    values["userTypeId"] = selectedUserType;
    values["certificateTypeId"] = selectedCertificateType;
    values["trainerGradeId"] = selectedMemberGrade;
    values["sector"] = sectorsArray;

    console.log("selectedUserType0", selectedUserType);

    if (values.academicCode === "") {
      this.setState({ academicCodeError: true });
    } else {
      this.setState({ academicCodeError: false });
    }

    if (
      values.academicCode &&
      selectedUserType !== null &&
      selectedMember !== null &&
      selectedYear !== null &&
      selectedCertificateType !== null &&
      selectedMemberGrade !== null &&
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
        onUpdateCertificate(sectionInfo);
      } else {
        onAddNewCertificate(sectionInfo);
      }
      this.setState({
        selectedAcademicCertificate: null,
        errorMessages: {},
      });
      this.toggle();
    } else {
      let emptyError = "";
      console.log("selectedUserType", selectedUserType);
      if (selectedUserType === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedMember === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedMemberGrade === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedYear === undefined) {
        emptyError = "Fill the empty select";
      }
      if (sectorsArray.length == 0) {
        emptyError = "Fill the empty select";
      }
      if (selectedCertificateType === undefined) {
        emptyError = "Fill the empty select";
      }
      this.setState({ emptyError: emptyError });
    }
  };

  // handleCertificateClick = arg => {
  //   const { certificate } = this.state;
  //   console.log("arg", arg);

  //   this.setState({
  //     certificate: arg,
  //     selectedUserType: arg.userTypeId,
  //     selectedMember: arg.trainerId,
  //     selectedCertificateType: arg.certificateTypeId,
  //     selectedMemberGrade: arg.trainerGradeId,
  //     sectorsArray: arg.sector,
  //     selectedYear: arg.yearId,
  //     isEdit: true,
  //   });

  //   this.toggle();
  // };

  // handleGenerateQR = certificate => {
  //   console.log("certificate in QR", certificate);
  //   this.setState({ QRModal: true, certificate });
  //   QRCode.toDataURL(
  //     certificate.certificateNum,
  //     {
  //       width: 200,
  //       margin: 2,
  //       color: {
  //         dark: "#000",
  //         light: "#EEEEEEFF",
  //       },
  //     },
  //     (err, url) => {
  //       if (err) return console.error(err);
  //       console.log(url);
  //       this.setState({ qr: url, QRModal: true });
  //     }
  //   );
  // };

  handleGenerateBarcode = certificate => {
    const canvas = document.createElement("canvas");
    this.setState({ QRModal: true, certificate });
    JsBarcode(canvas, certificate.certificateNum, {
      format: "CODE128",
      displayValue: true,
      width: 2,
      height: 80,
      margin: 10,
    });

    const barcodeURL = canvas.toDataURL("image/png");
    this.setState({ qr: barcodeURL, QRModal: true });
  };

  onCloseQRModal = () => {
    this.setState({ QRModal: false });
  };

  toggleSidebar = () => {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  handelGenerateReport = repData => {
    console.log(repData);
  };

  handleSelect = (fieldName, selectedValue, values) => {
    console.log("selectedValueselectedValueselectedValue", selectedValue);
    if (fieldName == "courseId") {
      this.setState({
        selectedCourse: selectedValue.value,
      });
    }
  };

  render() {
    const { SearchBar } = Search;
    const {
      certificates,
      user_menu,
      deleted,
      userTypesOpt,
      years,
      sectors,
      certificateTypes,
      filteredCertificateGrades,
      filteredMembers,
      t,
      traineesOpt,
      filteredCourses,
      onGetFilteredCoursesCertificates,
    } = this.props;
    const {
      modal,
      certificate,
      isEdit,
      academicCodeError,
      sectorsArray,
      QRModal,
      qr,
      sidebarOpen,
      selectedUserType,
      duplicateError,
      errorMessage,
      emptyError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      selectedGrantDate,
      showSearchButton,
    } = this.state;

    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";

    console.log("filteredMembers", filteredMembers);

    const filteredCoursesModified =
      filteredCourses &&
      filteredCourses.map(item => ({
        label: `${item.code} - ${item.CourseName}`,
        value: item.courseId,
      }));

    const formattedGrantDate =
      certificate && certificate.grantDate
        ? new Date(certificate.grantDate).toISOString().split("T")[0]
        : selectedGrantDate;

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "trainerName",
        text: this.props.t("Member"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "academicCode",
        text: this.props.t("Academic Code"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },

      {
        dataField: "certificateType",
        text: this.props.t("Certificate Type"),
        sort: true,

        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "userType",
        text: this.props.t("Member Type"),
        sort: true,

        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },

      {
        dataField: "trainerGrade",
        text: this.props.t("Member Grade"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "sectorName",
        text: this.props.t("Sector"),
        sort: true,
        editable: false,
        // formatter: (cellContent, row) => {
        //   if (row.sector && Array.isArray(row.sector)) {
        //     return row.sector.map(item => item.label).join(", ");
        //   }
        //   return "";
        // },
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "certificateYear",
        text: this.props.t("Year"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "certificateNum",
        text: this.props.t("Certificate Number"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },

      {
        dataField: "delete",
        text: "",
        //   hidden: !showDeleteButton,
        isDummyField: true,
        editable: false, // Set the "Action" column to not editable
        formatter: (cellContent, certificate) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleCertificateClick(certificate)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("QR")} placement="top">
              <Link className="text-primary" to="#">
                <i
                  className="mdi mdi-barcode-scan font-size-18"
                  id="qrcodetooltip"
                  onClick={() => this.handleGenerateBarcode(certificate)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Report")} placement="top">
              <Link className="text-primary" to="#">
                <i
                  className="bx bx-bx bxs-report"
                  id="report"
                  onClick={() => this.handelGenerateReport(certificate)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(certificate)}
                ></i>
              </Link>
            </Tooltip>
          </div>
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
            <Breadcrumbs breadcrumbItem={this.props.t("Certificates")} />

            <Row>
              <Col>
                <Card>
                  <CardBody className="card-style">
                    {sidebarOpen && (
                      <Col lg="2">
                        <Card>
                          <CardTitle id="course_header">
                            {t("Select Member Type")}
                          </CardTitle>
                          <CardBody>
                            <div className="mb-3">
                              <Row>
                                <Col lg="4">
                                  <Label className="form-label user-style">
                                    {t("Member Type")}
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg="6">
                                  <Select
                                    className="select-style "
                                    name="userTypeId"
                                    key="courseType_select"
                                    options={userTypesOpt}
                                    onChange={newValue =>
                                      this.handleSelectChange(
                                        "userTypeId",
                                        newValue.value
                                      )
                                    }
                                    value={userTypesOpt.find(
                                      opt => opt.label === selectedUserType
                                    )}
                                  />
                                </Col>
                              </Row>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    )}

                    <Col lg="auto" className="p-0">
                      <div className="collapse-course">
                        <i
                          onClick={this.toggleSidebar}
                          className="bx bx-menu"
                        ></i>
                      </div>
                    </Col>

                    <Col lg={sidebarOpen ? "" : "11"}>
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
                                          {selectedUserType && (
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
                                          )}
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
                                        filter={filterFactory()}
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
                                        <ModalHeader
                                          toggle={this.toggle}
                                          tag="h4"
                                        >
                                          {!!isEdit
                                            ? t("Edit Certificate")
                                            : t("Add Certificate")}
                                        </ModalHeader>

                                        <ModalBody>
                                          <Formik
                                            enableReinitialize={true}
                                            initialValues={{
                                              ...(isEdit && {
                                                Id: certificate.Id,
                                              }),
                                              academicCode:
                                                (certificate &&
                                                  certificate.academicCode) ||
                                                "01",
                                              userTypeId:
                                                (certificate &&
                                                  certificate.userTypeId) ||
                                                "",
                                              yearId:
                                                (certificate &&
                                                  certificate.yearId) ||
                                                "",
                                              trainerGradeId:
                                                (certificate &&
                                                  certificate.trainerGradeId) ||
                                                "",
                                              trainerId:
                                                (certificate &&
                                                  certificate.trainerId) ||
                                                "",
                                              courseId:
                                                (certificate &&
                                                  certificate.courseId) ||
                                                "",
                                              grantDate:
                                                (certificate &&
                                                  certificate.grantDate) ||
                                                selectedGrantDate,
                                              sector:
                                                (certificate &&
                                                  certificate.sector) ||
                                                "",
                                            }}
                                            validationSchema={Yup.object().shape(
                                              {
                                                academicCode:
                                                  Yup.string().required(
                                                    t(
                                                      "Academic Code is required"
                                                    )
                                                  ),
                                                sector: Yup.string().required(
                                                  t("Faculty is required")
                                                ),
                                              }
                                            )}
                                          >
                                            {({
                                              errors,
                                              status,
                                              touched,
                                              values,
                                              handleChange,
                                              handleBlur,
                                            }) => (
                                              <Form>
                                                <Row>
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
                                                  <Col>
                                                    <Row className="mb-3">
                                                      <Col
                                                        lg="3"
                                                        className="col-padding"
                                                      >
                                                        <Label>
                                                          <strong>
                                                            {t("Name")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </Label>
                                                      </Col>
                                                      <Col lg="6">
                                                        <Select
                                                          name="trainerId"
                                                          key={`select_fromSemester`}
                                                          options={
                                                            filteredMembers
                                                          }
                                                          onChange={newValue => {
                                                            this.handleSelectChange(
                                                              "trainerId",
                                                              newValue.value
                                                            );
                                                            console.log(
                                                              "newValuenewValuenewValue",
                                                              newValue
                                                            );
                                                            if (newValue) {
                                                              onGetFilteredCoursesCertificates(
                                                                newValue.value
                                                              );
                                                            }
                                                          }}
                                                          defaultValue={filteredMembers.find(
                                                            opt =>
                                                              opt.value ===
                                                              certificate.trainerId
                                                          )}
                                                        />
                                                      </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                      <Col
                                                        lg="3"
                                                        className="col-padding"
                                                      >
                                                        <Label>
                                                          <strong>
                                                            {t(
                                                              "Certificate Type"
                                                            )}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </Label>
                                                      </Col>
                                                      <Col lg="6">
                                                        <Select
                                                          name="certificateTypeId"
                                                          key={`select_fromSemester`}
                                                          options={
                                                            certificateTypes
                                                          }
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
                                                    </Row>

                                                    <div className="mb-3">
                                                      {selectedUserType ===
                                                        2 && (
                                                        <Row>
                                                          <Col
                                                            lg="3"
                                                            className="col-padding"
                                                          >
                                                            <Label>
                                                              <strong>
                                                                {t("Courses")}
                                                              </strong>
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-6">
                                                            <Select
                                                              name="courseId"
                                                              options={
                                                                filteredCoursesModified
                                                              }
                                                              key={`select_course`}
                                                              onChange={newValue => {
                                                                this.handleSelect(
                                                                  "courseId",
                                                                  newValue
                                                                );
                                                              }}
                                                              value={filteredCoursesModified.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  certificate?.courseId
                                                              )}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      )}
                                                    </div>
                                                    <div className="mb-3">
                                                      {selectedUserType ===
                                                        2 && (
                                                        <Row>
                                                          <Col lg="3">
                                                            <Label for="grantDate">
                                                              <strong>
                                                                {this.props.t(
                                                                  "Grant Date"
                                                                )}
                                                              </strong>
                                                            </Label>
                                                          </Col>
                                                          {isEdit && (
                                                            <Col lg="6">
                                                              <Input
                                                                type="text"
                                                                name="grantDate"
                                                                id="reg-date"
                                                                className={
                                                                  "form-control"
                                                                }
                                                                value={
                                                                  formattedGrantDate
                                                                }
                                                                readOnly
                                                              />
                                                            </Col>
                                                          )}
                                                          {!isEdit && (
                                                            <Col lg="6">
                                                              <Input
                                                                type="text"
                                                                name="grantDate"
                                                                id="reg-date"
                                                                className={
                                                                  "form-control"
                                                                }
                                                                defaultValue={
                                                                  selectedGrantDate
                                                                }
                                                                readOnly
                                                              />
                                                            </Col>
                                                          )}
                                                        </Row>
                                                      )}
                                                    </div>

                                                    <Row>
                                                      <Col lg="6">
                                                        <label
                                                          htmlFor="exampleDataList"
                                                          className="form-label"
                                                        >
                                                          <strong>
                                                            {t("Academic Code")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>

                                                      <Col lg="6">
                                                        <label
                                                          htmlFor="exampleDataList"
                                                          className="form-label"
                                                        >
                                                          <strong>
                                                            {t("Grade")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                      <Col sm="6">
                                                        {" "}
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

                                                      <Col sm="6">
                                                        <Select
                                                          name="trainerGradeId"
                                                          key={`select_endSemester`}
                                                          options={
                                                            filteredCertificateGrades
                                                          }
                                                          onChange={newValue => {
                                                            this.handleSelectChange(
                                                              "trainerGradeId",
                                                              newValue.value
                                                            );
                                                          }}
                                                          defaultValue={filteredCertificateGrades.find(
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
                                                          <strong>
                                                            {t("Sector")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>

                                                      <Col lg="6">
                                                        <label
                                                          htmlFor="exampleDataList"
                                                          className="form-label"
                                                        >
                                                          <strong>
                                                            {t("Year")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
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
                                                          isMulti={true}
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
                                                          this.handleSave(
                                                            values
                                                          );
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
                                      {/* <Modal isOpen={QRModal} centered={true}>
                                        <ModalHeader
                                          toggle={this.onCloseQRModal}
                                          tag="h4"
                                        >
                                          <div className="text-center">
                                            {this.props.t("QR Code")}
                                          </div>
                                        </ModalHeader>
                                        <ModalBody className="py-3 px-5">
                                          <Row>
                                            <Col lg={12}>
                                              <div className="text-center">
                                                <h4 className="text-primary">
                                                  {certificate.trainerName}
                                                </h4>
                                                <h6 className="text-primary">
                                                  {certificate.certificateNum}
                                                </h6>

                                                {qr && (
                                                  <img src={qr} alt="QR Code" />
                                                )}
                                              </div>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col>
                                              <div className="text-center mt-3">
                                                {qr && (
                                                  <Button
                                                    color="success"
                                                    size="lg"
                                                    className="me-2"
                                                    onClick={() => {
                                                      const link =
                                                        document.createElement(
                                                          "a"
                                                        );
                                                      link.href = qr;
                                                      link.download = `${
                                                        certificate.trainerName +
                                                        certificate.certificateNum
                                                      }.png`;
                                                      link.click();
                                                    }}
                                                  >
                                                    {this.props.t("Download")}
                                                  </Button>
                                                )}
                                              </div>
                                            </Col>
                                          </Row>
                                        </ModalBody>
                                      </Modal> */}
                                      <Modal isOpen={QRModal} centered={true}>
                                        <ModalHeader
                                          toggle={this.onCloseQRModal}
                                          tag="h4"
                                        >
                                          <div className="text-center">
                                            {this.props.t("Barcode")}
                                          </div>
                                        </ModalHeader>
                                        <ModalBody className="py-3 px-5">
                                          <Row>
                                            <Col lg={12}>
                                              <div className="text-center">
                                                <h4 className="text-primary">
                                                  {certificate.trainerName}
                                                </h4>
                                                <h6 className="text-primary">
                                                  {certificate.certificateNum}
                                                </h6>
                                                {qr && (
                                                  <img
                                                    src={qr}
                                                    alt={`${certificate.trainerName} ${certificate.certificateNum}`}
                                                  />
                                                )}
                                              </div>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col>
                                              <div className="text-center mt-3">
                                                {qr && (
                                                  <Button
                                                    color="success"
                                                    size="lg"
                                                    className="me-2"
                                                    onClick={() => {
                                                      const link =
                                                        document.createElement(
                                                          "a"
                                                        );
                                                      link.href = qr;
                                                      link.download = `${certificate.trainerName}_${certificate.certificateNum}.png`;
                                                      link.click();
                                                    }}
                                                  >
                                                    {this.props.t("Download")}
                                                  </Button>
                                                )}
                                              </div>
                                            </Col>
                                          </Row>
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
  certificateGrades,
  trainingMembers,
  trainees,
}) => ({
  certificates: certificates.certificates,
  filteredCourses: certificates.filteredCoursesTrainees,
  certificateTypes: certificateTypes.certificateTypes,
  userTypesOpt: userTypes.userTypesOpt,
  sectors: sectors.sectors,
  filteredMembers: trainingMembers.filteredMembers,
  filteredCertificateGrades: certificateGrades.filteredCertificateGrades,
  years: years.years,
  deleted: certificates.deleted,
  traineesOpt: trainees.traineesOpt,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCertificates: certificate => dispatch(getCertificates(certificate)),
  onGetFilteredCoursesCertificates: traineeId =>
    dispatch(getFilteredCoursesCertificates(traineeId)),
  onGetUsers: () => dispatch(getUserTypesOpt()),
  onAddNewCertificate: certificate => dispatch(addNewCertificate(certificate)),
  onUpdateCertificate: certificate => dispatch(updateCertificate(certificate)),
  onDeleteCertificate: certificate => dispatch(deleteCertificate(certificate)),
  onGetCertificateDeletedValue: () => dispatch(getCertificateDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(Certificates)));
