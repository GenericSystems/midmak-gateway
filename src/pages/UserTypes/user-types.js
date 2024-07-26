import React, { Component } from "react";
import { Row, Col, Card, Alert, CardBody, Input,CardTitle, Label, Form, FormGroup } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Select from "react-select";
import {
  getUserTypes,
  addNewUserType,
  updateUserType,
  deleteUserType,
  getUserTypeDeletedValue,
} from "store/user-types/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
const USER_TYPE_STORAGE_KEY = "editableUserType";
import Tooltip from "@mui/material/Tooltip";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
import { selectFilter } from "react-bootstrap-table2-filter";
class UserTypesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicateError: null,
      selectedLevel: {},
      userTypes: props.userTypes || [],
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }
  componentDidMount() {
    const { userTypes, onGetUserTypes, requirementlevels, deleted, user_menu } =
      this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (userTypes && !userTypes.length) {
      onGetUserTypes();
      this.setState({ userTypes });
      this.setState({ requirementlevels, deleted });
    }
  }

  componentDidUpdate(prevProps) {
    const { userTypes } = this.props;

    // Check if the preReqTypes prop has been updated
    if (userTypes !== prevProps.userTypes) {
      this.setState({ userTypes });
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

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
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
    const { onAddNewUserType, userTypes } = this.props;
    const {selectedFacultyId} =this.state

    const newRow = {
      arTitle: "-----",
    };
    const emptyRowsExist = userTypes.some(
      userType => userType.arTitle.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewUserType(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteUserType } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteUserType(selectedRowId);

      this.setState({ deleteModal: false, showAlert: true });
    }
  };
  handleUserTypeDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateUserType, userTypes } = this.props;
    const { selectedLevel } = this.state;

    this.setState({
      selectedLevel: {
        ...selectedLevel,
        [rowId]: fieldValue,
      },
    });

    const isDuplicate = userTypes.some(
      userType =>
        userType.Id !== rowId &&
        ((userType.arTitle && userType.arTitle.trim()) === fieldValue.trim() ||
          (userType.enTitle && userType.enTitle.trim()) === fieldValue.trim())
    );
    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateUserType(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateUserType(onUpdate);
    }
  };

  handleChangeCheckbox = (rowId, currentStatus, fieldName) => {
    const { onUpdateUserType } = this.props;
    const newStatus = currentStatus ? 1 : 0;
    let ob = {};
    ob["Id"] = rowId;
    ob[fieldName] = newStatus;
    onUpdateUserType(ob);
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetUserTypeDeletedValue } = this.props;
    this.setState({ showAlert: null });
   // onGetUserTypeDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetUserTypeDeletedValue } = this.props;
    this.setState({ showAlert: null });
   // onGetUserTypeDeletedValue();
  };


  render() {
    const { userTypes, deleted, t } = this.props;
    const {
      selectedLevel,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const { SearchBar } = Search;

    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
    const { duplicateError, deleteModal } = this.state;
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const requirementlevels = [
      { label: "University", value: "University" },
      { label: "Faculty", value: "Faculty" },
      { label: "Certificate", value: "Certificate" },
    ];
    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("User Type(ar)"),
        sort: true,
        // editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "User Type",
        sort: true,
        // editable: showEditButton,
      },
     
      {
        dataField: "code",
        text: t("Code"),
        sort: true,
        // editable: showEditButton,
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
      //  hidden: !showDeleteButton,
        formatter: (cellContent, userType) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(userType)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: userTypes.length,
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
              breadcrumbItem={t("UserTypes List")}
            />

            <Row>
              <Col>
                <Card>
                  <CardBody>
                    {
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
                    }
                               <Card>
                       
                      </Card>
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={userTypes}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={userTypes}
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
                                          />
                                        </div>
                              
                                    </div>
                              
                                  </Col>
                                 <Col sm="4">
                                
                        </Col> 
                                  <Col sm="4">
                               {/*      {showAddButton && ( */}
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
                                  data={userTypes}
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
                                      if (column.dataField != "required") {
                                        this.handleUserTypeDataChange(
                                          row.Id,
                                          column.dataField,
                                          newValue
                                        );
                                      }
                                    },
                                  })}
                                  noDataIndication={t(
                                    "No Requirement Types found"
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

const mapStateToProps = ({ userTypes, menu_items }) => ({
  userTypes: userTypes.userTypes,
  deleted: userTypes.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetUserTypes: userType => dispatch(getUserTypes(userType)),
  onAddNewUserType: userType => dispatch(addNewUserType(userType)),
  onUpdateUserType: userType => dispatch(updateUserType(userType)),
  onDeleteUserType: userType => dispatch(deleteUserType(userType)),
 // onGetUserTypeDeletedValue: () => dispatch(getUserTypeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(UserTypesList));
