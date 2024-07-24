import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
//import Charts
import TempStudentsChart from "./TempStudentsChart";
import {
  getGenerateSIDs,
  addNewGenerateSID,
  updateGenerateSID,
  deleteGenerateSID,
  fetchTempStudents,
} from "store/generate-SIDs/actions";
import { updateSemester } from "store/semesters/actions";
import { updateAcademicCertificate } from "store/academicvertificates/actions";

import { updateFaculty } from "store/mob-app-faculty-accs/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
//import Charts
import {
  checkIsAddForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class GenerateSIDsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      selectedRowData: null,
      isModalOpen: false,
      backdropCriteria: "",
      showAddButton: false,
      showSearchButton: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }
  componentDidMount() {
    const {
      generateSIDs,
      onGetGenerateSIDs,
      onfetchTempStd,
      faculties,
      academiccertificates,
      years,
      semesters,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (generateSIDs && !generateSIDs.length) {
      onGetGenerateSIDs();
      onfetchTempStd();
      this.setState({ generateSIDs });
      this.setState({ faculties });
      this.setState({ years });
      this.setState({ semesters });
      this.setState({ academiccertificates });
    }
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
    const { onAddNewGenerateSID, generateSIDs } = this.props;

    const newRow = {
      criteria: "-----",
    };

    const emptyRowsExist = generateSIDs.some(
      generateSID => generateSID.criteria.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewGenerateSID(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteGenerateSID } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteGenerateSID(selectedRowId);

      this.setState({ selectedRowId: null, deleteModal: false });
    }
  };

  handleGenerateSIDDataChange = (rowId, fieldName, fieldValue, oldValue) => {
    const { onUpdateGenerateSID, generateSIDs } = this.props;

    if (fieldName === "criteriaOrder") {
      const parsedValue = parseInt(fieldValue, 10);

      if (!isNaN(parsedValue)) {
        const duplicateGenerateSID = generateSIDs.find(
          generateSID =>
            generateSID.Id !== rowId &&
            generateSID.criteriaOrder === parsedValue
        );

        if (duplicateGenerateSID) {
          let onUpdate1 = { Id: rowId, [fieldName]: parsedValue };
          onUpdateGenerateSID(onUpdate1);
          let onUpdate2 = {
            Id: duplicateGenerateSID.Id,
            [fieldName]: oldValue,
          };
          onUpdateGenerateSID(onUpdate2);
          this.setState({ duplicateError: null });
        } else {
          let onUpdate = { Id: rowId, [fieldName]: parsedValue };
          onUpdateGenerateSID(onUpdate);
          this.setState({ duplicateError: null });
        }
      } else {
        let onUpdate = { Id: rowId, [fieldName]: oldValue };
        onUpdateGenerateSID(onUpdate);
        const errorMessage = this.props.t("Invalid Integer");
        this.setState({ duplicateError: errorMessage });
      }
    } else if (fieldName === "cellsNum") {
      const parsedValue = parseInt(fieldValue, 10);

      if (!isNaN(parsedValue)) {
        let onUpdate = { Id: rowId, [fieldName]: parsedValue };
        onUpdateGenerateSID(onUpdate);
        this.setState({ duplicateError: null });
      } else {
        let onUpdate = { Id: rowId, [fieldName]: oldValue };
        onUpdateGenerateSID(onUpdate);
        const errorMessage = this.props.t("Invalid Integer");
        this.setState({ duplicateError: errorMessage });
      }
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleActiveToggle = (rowId, currentStatus) => {
    const { onUpdateGenerateSID } = this.props;
    onUpdateGenerateSID({ Id: rowId, isActive: currentStatus === 1 ? 0 : 1 });
  };
  toggleModal() {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
      duplicateError: null,
    }));
  }
  handleEditCriteria = criteriaData => {
    this.setState({
      backdropCriteria: criteriaData,
      isModalOpen: !this.state.isModalOpen,
    });
  };
  handleSemesterDataChange = (oldValue, rowId, fieldName, fieldValue) => {
    const { onUpdateSemester, semesters } = this.props;

    if (fieldName === "semesterCode" && !/^\d+$/.test(fieldValue)) {
      const errorMessage = this.props.t("You Can Only Insert Numbers");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: oldValue };
      onUpdateSemester(onUpdate);
    } else {
      const isDuplicate = semesters.some(
        semester =>
          semester.Id !== rowId &&
          semester.semesterCode &&
          semester.semesterCode.trim() === fieldValue.trim()
      );

      if (isDuplicate) {
        const errorMessage = this.props.t("Value already exists");
        this.setState({ duplicateError: errorMessage });
        let onUpdate = { Id: rowId, [fieldName]: oldValue };
        onUpdateSemester(onUpdate);
      } else {
        this.setState({ duplicateError: null });
        let onUpdate = { Id: rowId, [fieldName]: fieldValue };
        onUpdateSemester(onUpdate);
      }
    }
  };
  handleFacultyDataChange = (oldValue, rowId, fieldName, fieldValue) => {
    const { onUpdateFaculty, faculties } = this.props;

    if (fieldName === "facultyCode" && !/^\d+$/.test(fieldValue)) {
      const errorMessage = "Please put a number";

      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, facultyCode: oldValue };
      onUpdateFaculty(onUpdate);
    } else {
      const isDuplicate = faculties.some(
        faculty =>
          faculty.Id !== rowId &&
          faculty.facultyCode &&
          faculty.facultyCode.trim() === fieldValue.trim()
      );

      if (isDuplicate) {
        const errorMessage = this.props.t("Value already exists");
        this.setState({ duplicateError: errorMessage });
        let onUpdate = { Id: rowId, facultyCode: oldValue };
        onUpdateFaculty(onUpdate);
      } else {
        this.setState({ duplicateError: null });
        let onUpdate = { Id: rowId, facultyCode: fieldValue };
        onUpdateFaculty(onUpdate);
      }
    }
  };

  handleAcademicCertificateDataChange = (
    oldValue,
    rowId,
    fieldName,
    fieldValue
  ) => {
    const { onUpdateAcademicCertificate, academiccertificates } = this.props;

    if (fieldName === "majorCode" && !/^\d+$/.test(fieldValue)) {
      const errorMessage = "Please put a number";
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, majorCode: oldValue };
      onUpdateAcademicCertificate(onUpdate);
    } else {
      const isDuplicate = academiccertificates.some(
        certificate =>
          certificate.Id !== rowId &&
          certificate.majorCode &&
          certificate.majorCode.trim() === fieldValue.trim()
      );

      if (isDuplicate) {
        const errorMessage = this.props.t("Value already exists");
        this.setState({ duplicateError: errorMessage });
        let onUpdate = { Id: rowId, majorCode: oldValue };
        onUpdateAcademicCertificate(onUpdate);
      } else {
        this.setState({ duplicateError: null });
        let onUpdate = { Id: rowId, majorCode: fieldValue };
        onUpdateAcademicCertificate(onUpdate);
      }
    }
  };
  render() {
    const {
      generateSIDs,
      t,
      faculties,
      years,
      semesters,
      academiccertificates,
    } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAddButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    console.log("generateSIDs",generateSIDs)

    const { SearchBar } = Search;
    const defaultSorting = [
      {
        dataField: "criteriaOrder",
        order: "asc",
      },
    ];
    const columns = [
      {
        dataField: "Id",
        text: t("ID"),
        hidden: true,
      },
      {
        dataField: "criteriaOrder",
        text: t("Criteria Order"),
        sort: true,
        formatter: (cellContent, generateSID) => {
          return generateSID.criteriaOrder === 2147483647 ? (
            ""
          ) : (
            <span className="criteria-order-text">{cellContent}</span>
          );
        },
        editable:
          ((cell, row) => row.criteriaOrder !== 2147483647) && showEditButton,
        classes: "criteria-order-cell",
      },
      { dataField: "criteria", text: t("Criteria"), editable: showEditButton },
      { dataField: "criteriaKey", text: t("Criteria Key"), editable: false },
      {
        dataField: "cellsNum",
        text: t("Number Of Cells"),
        editable: showEditButton,
      },

      {
        dataField: "isActive",
        text: this.props.t("Active"),
        editable: false,
        formatter: (cellContent, generateSID) => {
          if (generateSID.criteriaOrder > 10) {
            return null;
          }
          return (
            <IconButton
              color="primary"
              onClick={() =>
                this.handleActiveToggle(generateSID.Id, generateSID.isActive)
              }
              disabled={!showEditButton}
            >
              {generateSID.isActive ? (
                <i className="bx bx-radio-circle-marked" style={{ color: "green" }} />
              ) : (
                <i
                  className="bx bx-radio-circle"
                  style={{ color: "red" }}
                />
              )}
            </IconButton>
          );
        },
      },
      {
        dataField: "backdrop",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, SID) => (
          <Link to="#">
            <i
              className="bx bx-info-circle font-size-20"
              onClick={() => this.handleEditCriteria(SID.criteriaKey)}
              style={{ display: SID.criteria === "رقم التسلسل" ? "none" : "block" }}
            ></i>
          </Link>
        ),
      },
    ];

    const facultyColumns = [
      { dataField: "facultyNum", text: t("Faculty Number"), editable: false },
      { dataField: "arTitle", text: t("Faculty Name"), editable: false },
      { dataField: "facultyCode", text: t("Faculty Code") },
    ];

    const certificateColumns = [
      {
        dataField: "AcadmicCertificatesArName",
        text: t("Certificate Name"),
        editable: false,
      },
      { dataField: "facultyName", text: t("Faculty Name"), editable: false },
      { dataField: "majorCode", text: t("Major Code") },
    ];

    const yearsColumns = [
      { dataField: "Id", text: t("Year Id"), editable: false },
      { dataField: "arTitle", text: t("Year"), editable: false },
    ];
    const semestersColumns = [
      { dataField: "semesterNum", text: t("Semester Number"), editable: false },
      { dataField: "arTitle", text: t("Semester"), editable: false },
      { dataField: "semesterCode", text: t("Semester Code") },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: generateSIDs.length,
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
              title={t("GenerateSIDs")}
              breadcrumbItem={t("GenerateSIDs List")}
            />

            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <React.Fragment>
                        <Row>
                          <Col sm="4">
                            <div className="search-box ms-2 mb-2 d-inline-block">
                              {showSearchButton && (
                                <div className="position-relative">
                                 {/*  <SearchBar {...toolkitprops.searchProps} /> */}
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col sm="8">
                            {showAddButton && (
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
                     //     {...toolkitprops.baseProps}
                      //    {...paginationTableProps}
                          data={generateSIDs}
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
                              this.handleGenerateSIDDataChange(
                                row.Id,
                                column.dataField,
                                newValue,
                                oldValue
                              );
                            },
                          })}
                          noDataIndication={t("No GenerateSIDs found")}
                          defaultSorted={defaultSorting}
                        />
                      </React.Fragment>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        <Modal
          className="SID-Modal"
          isOpen={this.state.isModalOpen}
          toggle={this.toggleModal}
        >
          <ModalHeader toggle={this.toggleModal}>
            {this.state.backdropCriteria === "Faculty" && (
              <div className="TitleStyleSID">{"رموز الكليات"}</div>
            )}

            {this.state.backdropCriteria === "Year" && (
              <div className="TitleStyleSID">{"رموز عام التسجيل"}</div>
            )}

            {this.state.backdropCriteria === "Semester" && (
              <div className="TitleStyleSID">{"رموز فصل التسجيل"}</div>
            )}
            {this.state.backdropCriteria === "الحرم الجامعي" && (
              <div className="TitleStyleSID">{"رموز الحرم الجامعي"}</div>
            )}
            {this.state.backdropCriteria === "Certificate" && (
              <div className="TitleStyleSID">{"رمز الشهادة"}</div>
            )}
          </ModalHeader>
          <ModalBody className="SID-ModalBody">
            {this.state.backdropCriteria === "Faculty" && (
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
                <BootstrapTable
                  keyField="facultyNum"
                  data={faculties}
                  columns={facultyColumns}
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true,
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      this.handleFacultyDataChange(
                        oldValue,
                        row.Id,
                        column.dataField,
                        newValue
                      );
                    },
                  })}
                  noDataIndication={t("No Faculties found")}
                />
              </div>
            )}
            {this.state.backdropCriteria === "Semester" && (
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

                <BootstrapTable
                  keyField="Id"
                  data={semesters}
                  columns={semestersColumns}
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true,
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      this.handleSemesterDataChange(
                        oldValue,
                        row.Id,
                        column.dataField,
                        newValue
                      );
                    },
                  })}
                  noDataIndication={t("No Semesters found")}
                />
              </div>
            )}
            {this.state.backdropCriteria === "Certificate" && (
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
                <BootstrapTable
                  keyField="Id"
                  data={academiccertificates}
                  columns={certificateColumns}
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true,
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      this.handleAcademicCertificateDataChange(
                        oldValue,
                        row.Id,
                        column.dataField,
                        newValue
                      );
                    },
                  })}
                  noDataIndication={t("No Certifactes found")}
                />
              </div>
            )}

            {this.state.backdropCriteria === "Year" && (
              <BootstrapTable
                keyField="Id"
                data={years}
                columns={yearsColumns}
                noDataIndication={t("No Years found")}
              />
            )}
            {this.state.backdropCriteria === "الحرم الجامعي" && (
              <>
                <TempStudentsChart />
              </>
            )}
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  generateSIDs,
  mobAppFacultyAccs,
  years,
  semesters,
  academiccertificates,
  menu_items,
}) => ({
  generateSIDs: generateSIDs.generateSIDs,
  faculties: mobAppFacultyAccs.faculties,
  years: years.years,
  semesters: semesters.semesters,
  academiccertificates: academiccertificates.academiccertificates,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onfetchTempStd: () => dispatch(fetchTempStudents()),
  onGetGenerateSIDs: () => dispatch(getGenerateSIDs()),
  onAddNewGenerateSID: generateSID => dispatch(addNewGenerateSID(generateSID)),
  onUpdateGenerateSID: generateSID => dispatch(updateGenerateSID(generateSID)),
  onDeleteGenerateSID: generateSID => dispatch(deleteGenerateSID(generateSID)),
  onUpdateSemester: semester => dispatch(updateSemester(semester)),
  onUpdateFaculty: faculty => dispatch(updateFaculty(faculty)),
  onUpdateAcademicCertificate: academicCertificate =>
    dispatch(updateAcademicCertificate(academicCertificate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GenerateSIDsList));
