import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, Alert } from "reactstrap";
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
import {
  getCertificates,
  addNewCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificateDeletedValue,
} from "store/certificates/actions";

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
      trainersGrades
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (certificates && !certificates.length) {
      onGetCertificates();
    }
    this.setState({ certificates, certificateTypes, deleted , userTypes, sectors,
      trainersGrades, years
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
    const { certificates, onAddNewCertificate } = this.props;
    const newRow = {
      arTitle: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = certificates.some(
      certificate => certificate.arTitle.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewCertificate(newRow);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };
  /*
  handleDeleteRow = rowId => {
    const { onDeleteCertificate } = this.props;
    let obDelete = { Id: rowId };
    onDeleteCertificate(obDelete);
  };
*/

  handleDeleteRow = () => {
    const { onDeleteCertificate } = this.props;
    const { selectedRowId } = this.state;
console.log("selectedRowId",selectedRowId)
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

  render() {
    const { SearchBar } = Search;
    const { certificates, user_menu, deleted , userTypes, years, sectors,certificateTypes,trainersGrades} = this.props;
    const { selectedCertLevel } = this.state;
    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
    console.log("years",years)
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

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
       // editable: showEditButton,
      },
      {
        dataField: "userTypeId",
        text: "User Type",
        sort: true,
      //  editable: showEditButton,
      },
      {
        dataField: "trainerGradeId",
        text: this.props.t("Trainer Grade"),
        sort: true,
       // editable: showEditButton,
      },
      {
        dataField: "sectorId",
        text: this.props.t("Sector"),
        sort: true,
       // editable: showEditButton,
      },
      
      {
        dataField: "yearId",
        text: this.props.t("Year"),
        sort: true,
       // editable: showEditButton,
      },
      {
        dataField: "certificateNum",
        text: this.props.t("Certificate Number"),
        sort: true,
       // editable: showEditButton,
      },

      {
        dataField: "delete",
        text: "",
     //   hidden: !showDeleteButton,
        isDummyField: true,
        editable: false, // Set the "Action" column to not editable
        formatter: (cellContent, certificate) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(certificate)}
            ></i>
          </Link>
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

const mapStateToProps = ({ certificates, menu_items, years, userTypes,certificateTypes, sectors,trainersGrades }) => ({
  certificates: certificates.certificates,
  certificateTypes: certificateTypes.certificateTypes,
  userTypes: userTypes.userTypes,
  sectors: sectors.sectors,
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
