import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import { Row, Col, Card, CardBody, Alert, Input, CardTitle } from "reactstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Select from "react-select";

// Editable
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

import { getCurrentSemester } from "store/semesters/actions";

import {
  getRegReqDocuments,
  addNewRegReqDocument,
  updateRegReqDocument,
  deleteRegReqDocument,
  getRegReqDocumentDeletedValue,
  copyRegReqDoc,
} from "store/reg-req-documents/actions";
import DeleteModal from "components/Common/DeleteModal";
import { isEmpty, size, map } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

//import documents from "store/documents-types/reducer";
import { ConsoleLineIcon } from "@icons/material";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class RegReqDocumentsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDocument: null,
      regReqDocuments: props.regReqDocuments || [],
      checkboxEditable: false,
      duplicateError: null,
      deleteModal: false,
      selectedRowId: null,
      showAlert: null,
      defaultYear: null,
      isCurrentYear: true,
      selectedYear: 0,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      sidebarOpen: true,
      checkedId: 1,
    };
  }

  componentDidMount() {
    const {
      regReqDocuments,
      user_menu,
      onGetRegReqDocuments,
      documents,
      deleted,
      currentSemester,
      years,
      certificateTypes,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    const defaultYear = years.find(
      year => year.value === currentSemester.cuYearId
    );
    if (regReqDocuments && !regReqDocuments.length) {
      let ob = { yearId: currentSemester.cuYearId, certificateLevelId: 1 };
      onGetRegReqDocuments(ob);

      this.setState({ regReqDocuments, deleted });
      this.setState({ documents, currentSemester, years, certificateTypes });
    }

    this.setState({ defaultYear: defaultYear, isCurrentYear: true });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { years, currentSemester } = this.state;
    if (years && years.length && currentSemester) {
      const defaultYear = years.find(
        year => year.value === currentSemester.cuYearId
      );
      if (defaultYear) {
        this.setState({ defaultYear });
      }
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

  handleUpload = (id, event) => {
    event.preventDefault();
    const fileContent = "This is a sample file for upload.";
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const tempAnchor = document.createElement("a");
    tempAnchor.href = url;
    tempAnchor.setAttribute("upload", `upload_${id}.txt`);
    tempAnchor.click();
    window.URL.revokeObjectURL(url);
    tempAnchor.remove();
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
    const { onAddNewRegReqDocument, regReqDocuments, currentSemester } =
      this.props;
      const { checkedId } = this.state

    const emptyLevelExists = regReqDocuments.some(
      row => row.documentTypeId === 0
    );

    if (emptyLevelExists) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
      return;
    } else {
      const newRow = {
        yearId: currentSemester.cuYearId,
        certificateLevelId: checkedId
      };

      this.setState({ duplicateError: null });
      onAddNewRegReqDocument(newRow);
    }
  };

  handleCopyRegReqDoc = () => {
    const { onCopyRegReqDoc } = this.props;
    onCopyRegReqDoc();
  };

  handleDeleteRow = () => {
    const { onDeleteRegReqDocument } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteRegReqDocument(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleRegReqDocumentDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateRegReqDocument } = this.props;
    const { checkedId } = this.state
    let onUpdate = { Id: rowId, [fieldName]: fieldValue, certificateLevelId: checkedId  };
    onUpdateRegReqDocument(onUpdate);
  };

  handleSelectDocument = (rowId, fieldName, selectedValue) => {
    const { onUpdateRegReqDocument } = this.props;
    const { regReqDocuments } = this.state;

    const isValueExists = regReqDocuments.some(
      row => row.documentTypeId === selectedValue
    );

    if (isValueExists) {
      console.error("Value already exists in the table.");
      return;
    }

    this.setState({
      selectedDocument: selectedValue,
    });

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateRegReqDocument(onUpdate);
  };

  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateRegReqDocument } = this.props;
    const newStatus = row[fieldName] ? 0 : 1;
    let ob = {
      Id: row.Id,
      [fieldName]: newStatus,
    };

    if (row.documentTypeId !== 0) {
      onUpdateRegReqDocument(ob);
    }
  };

  toggleCheckboxEditMode = () => {
    this.setState(prevState => ({
      checkboxEditable: !prevState.checkboxEditable,
    }));
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetRegReqDocumentDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetRegReqDocumentDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetRegReqDocumentDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetRegReqDocumentDeletedValue();
  };

  handleSelectYear = (fieldName, selectedValue) => {
    const { currentSemester, years, onGetRegReqDocuments } = this.props;
    const { checkedId }= this.state
    console.log("in select year checkedId ",checkedId)
    const currentYear = years.find(
      year => year.value === currentSemester.cuYearId || ""
    );

    if (selectedValue.value === currentSemester.cuYearId) {
      this.setState({ isCurrentYear: true });
    } else {
      this.setState({ isCurrentYear: false });
    }
    if (fieldName === "YearId") {
      this.setState({
        selectedYear: selectedValue.value,
        defaultYear: selectedValue,
      });
    }

    let ob = { yearId: selectedValue.value , certificateLevelId: checkedId };

    if (ob) {
      onGetRegReqDocuments(ob);
    }
  };

  toggleSidebar = () => {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  }

  handleCheckboxClick(clickedCheckboxId, fieldName) {
    const checkboxIds = ["btncheck1"];
    checkboxIds.forEach(checkboxId => {
      if (checkboxId === clickedCheckboxId) {
        document.getElementById(checkboxId).checked = true;
      } else {
        document.getElementById(checkboxId).checked = false;
      }
    });

    if (fieldName == "numOfAppStd") {
      this.setState({
        showApplicantStd: true,
      });
    }
  }

  handleShowColumn = (fieldName, Id) => {
    const { onGetRegReqDocuments, currentSemester } = this.props;
    const { selectedYear , defaultYear } = this.state;
    console.log("select selectedYear", selectedYear);
    console.log("select defaultYear", defaultYear);
    let obj ;
    if (defaultYear){
      console.log("yes");
      obj = { yearId: defaultYear.value, certificateLevelId: Id };
    }
else{
  console.log("no", defaultYear);
  obj = { yearId: currentSemester.cuYearId, certificateLevelId: Id };

}   
 onGetRegReqDocuments(obj);

    this.setState({ checkedId: Id });
  };

  render() {
    //meta title
    document.title =
      "Registration Required Documents | keyInHands - React Admin & Dashboard Template";
    const {
      selectedDocument,
      duplicateError,
      deleteModal,
      showAlert,
      defaultYear,
      sidebarOpen,
      checkedId,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;
    const {
      regReqDocuments,
      documents,
      t,
      deleted,
      years,
      currentSemester,
      certificateTypes,
    } = this.props;
    console.log("currentSemester",currentSemester);
    console.log("years",years);
    console.log("defaultYear",defaultYear);

    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const columns = [
      {
        key: "Id",
        dataField: "Id",
        hidden: true,
        text: this.props.t("#"),
      },
      {
        dataField: "documentTypeId",
        text: this.props.t("Document Name"),
        editable: false,
        sort: true,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={documents.filter(
              option =>
                !regReqDocuments.some(
                  row => row.documentTypeId === option.value
                )
            )}
            onChange={newValue => {
              this.handleSelectDocument(
                row.Id,
                "documentTypeId",
                newValue.value
              );
            }}
            defaultValue={documents.find(
              opt => opt.value == row.documentTypeId
            )}
            isDisabled={!showEditButton}
          />
        ),
      },
      {
        key: "req-num",
        dataField: "requiredNumber",
        text: this.props.t("Required Number"),
        sort: true,
        editable: showEditButton,
      },
      {
        key: "prevent-admission",
        dataField: "preventAdmission",
        text: this.props.t("Prevent Admission"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowAdmission"
            className={`form-check-input input-mini warning}`}
            id="admissionButton"
            disabled={row.documentTypeId === 0 || !showEditButton}
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, "preventAdmission")
            }
          />
        ),
      },

      {
        key: "prevent-regis",
        dataField: "preventRegistration",
        text: this.props.t("Prevent Registration"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            disabled={row.documentTypeId === 0 || !showEditButton}
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, "preventRegistration")
            }
          />
        ),
      },

      {
        key: "prevent-grad",
        dataField: "preventGraduation",
        text: this.props.t("Prevent Graduation"),
        sort: true,
        editable: false,

        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowGraduation"
            className={`form-check-input input-mini warning}`}
            id="graduationButton"
            disabled={row.documentTypeId === 0 || !showEditButton} // Disable the checkbox if documentTypeId is 0
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(
                row,

                "preventGraduation"
              )
            }
          />
        ),
      },

      {
        key: "req-attestation",
        dataField: "requireAttestation",
        text: this.props.t("Require Attestation"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="RequireAttestation"
            className={`form-check-input input-mini warning}`}
            id="attestationButton"
            disabled={row.documentTypeId === 0 || !showEditButton} // Disable the checkbox if documentTypeId is 0
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, "requireAttestation")
            }
          />
        ),
      },

      {
        dataField: "delete",
        text: "",
        hidden: !showDeleteButton,
        isDummyField: true,
        editable: false,
        formatter: (cellContent, regReqdocument) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(regReqdocument)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: regReqDocuments.length,
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
              title={this.props.t("Documents")}
              breadcrumbItem={this.props.t("Registration Required Documents")}
            />

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

            <Card>
              <CardBody>
                <Row>
                  {sidebarOpen && (
                    <div style={{ width: sidebarOpen ? "14%" : "0" }}>
                      <Card>
                        <CardTitle id="warning_rules_header">
                          {t("Certificate Levels")}
                        </CardTitle>
                        <CardBody>
                          {certificateTypes.map((certificate, index) => (
                            <div className="mb-1" key={certificate.Id}>
                              <Row>
                                <Col>
                                  <input
                                    type="checkbox"
                                    className="btn-check"
                                    id={`btncheck${certificate.Id}`}
                                    autoComplete="off"
                                    checked={checkedId === certificate.Id}
                                    onChange={() =>
                                      this.handleShowColumn(
                                        `checked${certificate.Id}`,
                                        certificate.Id
                                      )
                                    }
                                  />
                                  <label
                                    className="btn btn-outline-primary big-width-check"
                                    htmlFor={`btncheck${certificate.Id}`}
                                  >
                                    {this.props.t(
                                      certificate.arcertificateType
                                    )}
                                  </label>
                                </Col>
                              </Row>
                            </div>
                          ))}
                        </CardBody>
                      </Card>
                    </div>
                  )}

                  <Col lg="auto" className="p-0">
                    <div className="collapse-course">
                      <i
                        onClick={this.toggleSidebar}
                        className="bx bx-menu"
                      ></i>
                    </div>
                  </Col>

                  <Col lg={sidebarOpen ? "" : ""}>
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={regReqDocuments}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={regReqDocuments}
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
                                  <Col
                                    sm="4"
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <div
                                      style={{
                                        width: "100px",
                                        marginLeft: "5px",
                                      }}
                                    >
                                      <Select
                                        className="select-style"
                                        name="YearId"
                                        key={`year_select`}
                                        options={years.sort(
                                          (a, b) => b.value - a.value
                                        )}
                                        onChange={newValue => {
                                          this.handleSelectYear(
                                            "YearId",
                                            newValue
                                          );
                                        }}
                                        value={
                                          defaultYear
                                            ? defaultYear
                                            : years.find(
                                                year =>
                                                  year.value ===
                                                  currentSemester.cuYearId
                                              )
                                        }
                                        placeholder="Select Year"
                                      />
                                    </div>
                                  </Col>

                                  <Col sm="4">
                                    <div className="text-sm-end">
                                      <Tooltip
                                        title={this.props.t("Copy")}
                                        onClick={this.handleCopyRegReqDoc}
                                        placement="top"
                                      >
                                        <IconButton color="primary">
                                          <i className="mdi mdi-content-copy blue-noti-icon" />
                                        </IconButton>
                                      </Tooltip>
                                      {showAddButton && (
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
                                      )}
                                    </div>
                                  </Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={regReqDocuments}
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
                                      if (
                                        column.dataField != "documentTypeId"
                                      ) {
                                        this.handleRegReqDocumentDataChange(
                                          row.Id,
                                          column.dataField,
                                          newValue
                                        );
                                      }
                                    },
                                  })}
                                  noDataIndication={t(
                                    "No Registration Documents found"
                                  )}
                                  defaultSorted={defaultSorting}
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
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  regReqDocuments,
  documents,
  semesters,
  menu_items,
  years,
  certificateTypes,
}) => ({
  regReqDocuments: regReqDocuments.regReqDocuments,
  deleted: regReqDocuments.deleted,
  documents: documents.documents,
  currentSemester: semesters.currentSemester,
  years: years.years,
  user_menu: menu_items.user_menu || [],
  certificateTypes: certificateTypes.certificateTypes,
});

const mapDispatchToProps = dispatch => ({
  onGetRegReqDocuments: regReqDocs => dispatch(getRegReqDocuments(regReqDocs)),
  onCopyRegReqDoc: () => dispatch(copyRegReqDoc()),
  onAddNewRegReqDocument: regReqDocument =>
    dispatch(addNewRegReqDocument(regReqDocument)),
  onUpdateRegReqDocument: regReqDocument =>
    dispatch(updateRegReqDocument(regReqDocument)),
  onDeleteRegReqDocument: regReqDocument =>
    dispatch(deleteRegReqDocument(regReqDocument)),
  onGetRegReqDocumentDeletedValue: () =>
    dispatch(getRegReqDocumentDeletedValue()),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(RegReqDocumentsTable)));
