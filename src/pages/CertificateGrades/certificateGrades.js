import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, Alert, CardTitle, Label } from "reactstrap";
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
  getCertificateGrades,
  addNewCertificateGrade,
  updateCertificateGrade,
  deleteCertificateGrade,
  getCertificateGradeDeletedValue,
} from "store/certificateGrades/actions";
import { getUserTypesOpt } from "store/user-types/actions";

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
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class CertificateGradesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certificateGrades: [],
      grade: "",
      selectedCertLevel: null,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      sidebarOpen: true,
      selectedUser: "",
    };
  }

  componentDidMount = () => {
    const { certificateGrades, onGetUsers, deleted, user_menu, userTypesOpt } =
      this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (
      (certificateGrades && !certificateGrades.length) ||
      certificateGrades == undefined
    ) {
      console.log("in did mount", certificateGrades);
      onGetUsers();
    }
    this.setState({ certificateGrades, deleted, userTypesOpt });
    console.log("in did mount 2222", certificateGrades);
  };

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
    const { certificateGrades, onAddNewCertificateGrade } = this.props;
    const { selectedUser } = this.state;
    const newRow = {
      userTypeId: selectedUser,
      arTitle: "---",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = certificateGrades.some(
      grade => grade.arTitle.trim() === "---"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewCertificateGrade(newRow);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleDeleteRow = () => {
    const { onDeleteCertificateGrade } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteCertificateGrade(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleCertificateGradeDataChange = (rowId, fieldName, fieldValue) => {
    const { certificate, onUpdateCertificateGrade } = this.props;
    const isDuplicate = certificateGrades.some(
      grade => grade.Id !== rowId && grade.arTitle.trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateCertificateGrade(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      console.log("on update", onUpdate);
      onUpdateCertificateGrade(onUpdate);
    }
  };

  handleSuccessClose = () => {
    const { onGetCertificateGradeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCertificateGradeDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetCertificateGradeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCertificateGradeDeletedValue();
  };

  toggleSidebar = () => {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  handleSelectUser = (fieldName, selectedValue) => {
    const { onGetCertificateGrades } = this.props;
    console.log("selectedValue", selectedValue);
    this.setState({ selectedUser: selectedValue });
    onGetCertificateGrades({ userTypeId: selectedValue });
  };

  render() {
    const { SearchBar } = Search;
    const { certificateGrades, deleted, t, userTypesOpt } = this.props;
    const alertMessage =
      deleted == 0 ? t("Can't Delete") : t("Deleted Successfully");
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      sidebarOpen,
      selectedUser,
    } = this.state;

    console.log("selectedUser", selectedUser);

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },

      {
        dataField: "arTitle",
        text: this.props.t("CertificateGrades(ar)"),
        sort: true,
        // editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "CertificateGrades",
        sort: true,
        // editable: showEditButton,
      },
      {
        dataField: "code",
        text: this.props.t("Code"),
        sort: true,
        // editable: showEditButton,
      },

      {
        dataField: "delete",
        text: "",
        //  hidden: !showDeleteButton,
        isDummyField: true,
        editable: false,
        formatter: (cellContent, grade) => (
          <Tooltip title={this.props.t("Delete")} placement="top">
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(grade)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: certificateGrades ? certificateGrades.length : 0,
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
            <Breadcrumbs breadcrumbItem={this.props.t("CertificateGrades")} />

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
                                    className="select-style"
                                    name="userTypeId"
                                    key="courseType_select"
                                    options={userTypesOpt}
                                    onChange={newValue =>
                                      this.handleSelectUser(
                                        "userTypeId",
                                        newValue.value
                                      )
                                    }
                                    value={userTypesOpt.find(
                                      opt => opt.label === selectedUser
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
                              data={certificateGrades ? certificateGrades : []}
                            >
                              {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                  keyField="Id"
                                  data={
                                    certificateGrades ? certificateGrades : []
                                  }
                                  columns={columns}
                                  search
                                >
                                  {toolkitprops => (
                                    <React.Fragment>
                                      <Row>
                                        <Col sm="4">
                                          <div className="search-box ms-2 mb-2 d-inline-block">
                                            {/*  {showSearchButton && ( */}
                                            <div className="position-relative">
                                              <SearchBar
                                                {...toolkitprops.searchProps}
                                                placeholder={t("Search...")}
                                              />
                                            </div>
                                          </div>
                                        </Col>
                                        <Col sm="8">
                                          {selectedUser && (
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
                                        data={
                                          certificateGrades
                                            ? certificateGrades
                                            : []
                                        }
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
                                            this.handleCertificateGradeDataChange(
                                              row.Id,
                                              column.dataField,
                                              newValue
                                            );
                                          },
                                        })}
                                        noDataIndication={this.props.t(
                                          "No CertificateGradeType Types found"
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

const mapStateToProps = ({ certificateGrades, userTypes, menu_items }) => ({
  certificateGrades: certificateGrades.certificateGrades,
  deleted: certificateGrades.deleted,
  userTypesOpt: userTypes.userTypesOpt,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetUsers: () => dispatch(getUserTypesOpt()),
  onGetCertificateGrades: grade => dispatch(getCertificateGrades(grade)),
  onAddNewCertificateGrade: grade => dispatch(addNewCertificateGrade(grade)),
  onUpdateCertificateGrade: grade => dispatch(updateCertificateGrade(grade)),
  onDeleteCertificateGrade: grade => dispatch(deleteCertificateGrade(grade)),
  onGetCertificateGradeDeletedValue: () =>
    dispatch(getCertificateGradeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(CertificateGradesList)));
