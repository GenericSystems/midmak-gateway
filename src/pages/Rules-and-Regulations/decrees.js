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
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Nav,
  Input,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
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
  getDecrees,
  addNewDecree,
  updateDecree,
  deleteDecree,
  getDecreeDeletedValue,
  getDecreesRulesReasons,
  addNewDecreesRulesReason,
  updateDecreesRulesReason,
  deleteDecreesRulesReason,
  getDecreesRulesReasonDeletedValue,
  getDecreesRulesCanceledReasons,
  addNewDecreesRulesCanceledReason,
  updateDecreesRulesCanceledReason,
  deleteDecreesRulesCanceledReason,
  getDecreesRulesCanceledReasonDeletedValue,
  getDecreesRulesRoles,
  addNewDecreesRulesRole,
  updateDecreesRulesRole,
  deleteDecreesRulesRole,
  getDecreesRulesRoleDeletedValue,
} from "store/decrees/actions";
import { getRoles } from "store/roles/actions";
import Accordion from "react-bootstrap/Accordion";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import classnames from "classnames";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class DecreesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      isModalOpen: false,
      activeTab: "1",
      reasonArray: null,
      duplicateDecreeError: null,
      selectedMulti: [],
      decreeObj: "",
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
  }
  toggleTab(tab) {
    const { onGetDecreesRulesRoles } = this.props;
    const { reasonArray } = this.state;
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        duplicateDecreeError: null,
      });
    }
    if (tab === "3") {
      onGetDecreesRulesRoles({
        Id: reasonArray.Id,
        tablename: "Settings_DecisionsRulesAcceptRoles",
      });
    } else if (tab === "4") {
      onGetDecreesRulesRoles({
        Id: reasonArray.Id,
        tablename: "Settings_DecisionsRulesRefuseRoles",
      });
    }
  }
  toggleModal() {
    const { onGetDecrees } = this.props;
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
      duplicateError: null,
    }));
    onGetDecrees();
  }

  onClickReason = reason => {
    const { onGetDecreesRulesReasons, onGetDecreesRulesCanceledReasons } =
      this.props;
    this.setState({
      decreeObj: reason,
      activeTab: "1",
      reasonArray: reason,
      isModalOpen: !this.state.isModalOpen,
    });

    onGetDecreesRulesReasons(reason.Id);
    onGetDecreesRulesCanceledReasons(reason.Id);
  };
  componentDidMount() {
    const {
      decrees,
      onGetDecrees,
      deleted,
      decreeCategories,
      onGetRoles,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (decrees && !decrees.length) {
      onGetDecrees();
      onGetRoles();
      this.setState({ decrees });
      this.setState({ deleted });
      this.setState({ decreeCategories });
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
    const { onAddNewDecree, decrees } = this.props;

    const newRow = {
      arTitle: "-----",
      enTitle: "",
    };

    const emptyRowsExist = decrees.some(
      decree => decree.arTitle.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewDecree(newRow);
    }
  };
  handleAddDecreeRow = num => {
    const {
      onAddNewDecreesRulesCanceledReason,
      onAddNewDecreesRulesReason,
      decreeRulesCanceledReasons,
      decreeRulesReasons,
    } = this.props;
    const { reasonArray } = this.state;
    const newRow = {
      decisionsRulesId: reasonArray.Id,
      arTitle: "-----",
      enTitle: "",
    };

    const emptyRowsExist =
      num === 1
        ? decreeRulesReasons.some(decree => decree.arTitle.trim() === "-----")
        : num === 2
        ? decreeRulesCanceledReasons.some(
            decree => decree.arTitle.trim() === "-----"
          )
        : false;

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateDecreeError: errorMessage });
    } else {
      this.setState({ duplicateDecreeError: null });
      if (num === 1) {
        onAddNewDecreesRulesReason(newRow);
      } else if (num === 2) {
        onAddNewDecreesRulesCanceledReason(newRow);
      }
    }
  };
  handleDeleteRow = () => {
    const { onDeleteDecree } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteDecree(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  onClickDeleteDecree = decree => {
    const { onDeleteDecreesRulesReason, onDeleteDecreesRulesCanceledReason } =
      this.props;
    const { activeTab } = this.state;
    if (activeTab === "1") {
      onDeleteDecreesRulesReason({ Id: decree.Id });
    } else if (activeTab === "2") {
      onDeleteDecreesRulesCanceledReason({ Id: decree.Id });
    }
  };

  handleDecreeDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateDecree, decrees } = this.props;

    const isDuplicate = decrees.some(
      decree =>
        decree.Id !== rowId &&
        ((decree.arTitle && decree.arTitle.trim() === fieldValue.trim()) ||
          (decree.enTitle && decree.enTitle.trim() === fieldValue.trim()))
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateDecree(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateDecree(onUpdate);
    }
  };

  handleDecreeRulesDataChange = (rowId, fieldName, fieldValue, num) => {
    const {
      onUpdateDecreesRulesCanceledReason,
      onUpdateDecreesRulesReason,
      decreeRulesReasons,
      decreeRulesCanceledReasons,
    } = this.props;
    const isDuplicate =
      num === 1
        ? decreeRulesReasons.some(
            decree =>
              decree.Id !== rowId &&
              ((decree.arTitle &&
                decree.arTitle.trim() === fieldValue.trim()) ||
                (decree.enTitle && decree.enTitle.trim() === fieldValue.trim()))
          )
        : num === 2
        ? decreeRulesCanceledReasons.some(
            decree =>
              decree.Id !== rowId &&
              ((decree.arTitle &&
                decree.arTitle.trim() === fieldValue.trim()) ||
                (decree.enTitle && decree.enTitle.trim() === fieldValue.trim()))
          )
        : false;
    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateDecreeError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      if (num === 1) {
        onUpdateDecreesRulesReason(onUpdate);
      } else if (num === 2) {
        onUpdateDecreesRulesCanceledReason(onUpdate);
      }
    } else {
      this.setState({ duplicateDecreeError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      if (num === 1) {
        onUpdateDecreesRulesReason(onUpdate);
      } else if (num === 2) {
        onUpdateDecreesRulesCanceledReason(onUpdate);
      }
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };
  handleAlertCloseDecree = () => {
    this.setState({ duplicateDecreeError: null });
  };
  handleSuccessClose = () => {
    const { onGetDecreeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetDecreeDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetDecreeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetDecreeDeletedValue();
  };
  handleSelectChangeDetails = (rowId, fieldName, selectedValue) => {
    const { onUpdateDecree } = this.props;

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateDecree(onUpdate);
  };
  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateDecree } = this.props;
    const newStatus = row[fieldName] ? 0 : 1;
    let ob = {
      Id: row.Id,
      [fieldName]: newStatus,
    };

    onUpdateDecree(ob);
  };

  handleMulti = selectedMulti => {
    const { onAddNewDecreesRulesRole } = this.props;
    const { reasonArray, activeTab, decreeObj } = this.state;
    const selectedMultiWithId = selectedMulti.map(item => ({
      ...item,
      value1: reasonArray.Id,
    }));

    let newRoleDecrees = {
      multiArray: selectedMultiWithId,
      Id: decreeObj.Id,
    };

    if (activeTab === "3") {
      newRoleDecrees["tablename"] = "Settings_DecisionsRulesAcceptRoles";
      onAddNewDecreesRulesRole(newRoleDecrees);
      newRoleDecrees = {};
    } else if (activeTab === "4") {
      newRoleDecrees["tablename"] = "Settings_DecisionsRulesRefuseRoles";
      onAddNewDecreesRulesRole(newRoleDecrees);
      newRoleDecrees = {};
    }
  };
  render() {
    const {
      decrees,
      t,
      deleted,
      decreeCategories,
      decreeRulesCanceledReasons,
      decreeRulesReasons,
      roles,
      decreesRulesRoles,
    } = this.props;
    const {
      duplicateError,
      duplicateDecreeError,
      deleteModal,
      showAlert,
      decreeObj,
      reasonArray,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const { SearchBar } = Search;
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("Decree(ar)"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: t("Decree"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "isCalAvg",
        text: t("Calculate Average"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="isCalAvg"
            className={`form-check-input input-mini warning}`}
            id="isCalAvg"
            defaultChecked={cellContent == 1}
            onChange={event => this.handleChangeCheckbox(row, "isCalAvg")}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "decisionCategoryId",
        text: t("Category"),
        formatter: (cell, row) => (
          <Select
            key={`decisionCategoryId`}
            options={decreeCategories}
            onChange={newValue => {
              this.handleSelectChangeDetails(
                row.Id,
                "decisionCategoryId",
                newValue.value
              );
            }}
            value={decreeCategories.find(
              opt => opt.value == row.decisionCategoryId
            )}
            isDisabled={!showEditButton}
          />
        ),
        editable: false,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, decree) => (
          <div className="d-flex align-items-center">
            <Tooltip title={this.props.t("Decree Settings")} placement="top">
              <Link className="d-flex align-items-center" to="#">
                <i
                  className="dripicons-gear font-size-16 "
                  id="deletetooltip"
                  onClick={() => this.onClickReason(decree)}
                ></i>
              </Link>
            </Tooltip>
            {showDeleteButton && (
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(decree)}
                ></i>
              </Link>
            )}
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: decrees.length,
      custom: true,
    };
    const decreesColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("Decree(ar)"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: t("Decree"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, decree) => (
          <div>
            {showDeleteButton && (
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDeleteDecree(decree)}
                ></i>
              </Link>
            )}
          </div>
        ),
      },
    ];

    const rolesModified = roles.map(item => ({
      value: item.Id,
      label: item.arTitle,
    }));
    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.isModalOpen}
          toggle={this.toggleModal}
          size="lg"
        >
          <ModalHeader toggle={this.toggleModal} tag="h4">
            {reasonArray && reasonArray.arTitle}
          </ModalHeader>
          <ModalBody>
            <Nav pills className="navtab-bg nav-justified">
              <NavItem>
                <NavLink
                  to="#"
                  id="vertical-home-link-test"
                  className={classnames({
                    active: this.state.activeTab === "1",
                  })}
                  onClick={() => {
                    this.toggleTab("1");
                  }}
                >
                  {this.props.t("Decree Reasons")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="#"
                  id="vertical-home-link-test"
                  className={classnames({
                    active: this.state.activeTab === "2",
                  })}
                  onClick={() => {
                    this.toggleTab("2");
                  }}
                >
                  {this.props.t("Canceled Decree Reasons")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="#"
                  id="vertical-home-link-test"
                  className={classnames({
                    active: this.state.activeTab === "3",
                  })}
                  onClick={() => {
                    this.toggleTab("3");
                  }}
                >
                  {this.props.t("Allowed Roles for Approval")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="#"
                  id="vertical-home-link-test"
                  className={classnames({
                    active: this.state.activeTab === "4",
                  })}
                  onClick={() => {
                    this.toggleTab("4");
                  }}
                >
                  {this.props.t("Allowed Roles for Turning")}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="p-4" activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                {duplicateDecreeError && (
                  <Alert
                    color="danger"
                    className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                    role="alert"
                  >
                    {duplicateDecreeError}
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={this.handleAlertCloseDecree}
                    ></button>
                  </Alert>
                )}
                <BootstrapTable
                  keyField="Id"
                  data={decreeRulesReasons}
                  columns={decreesColumns}
                  cellEdit={cellEditFactory({
                    mode: "dbclick",
                    blurToSave: true,
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      this.handleDecreeRulesDataChange(
                        row.Id,
                        column.dataField,
                        newValue,
                        1
                      );
                    },
                  })}
                  noDataIndication={t("No Decrees found")}
                  defaultSorted={defaultSorting}
                />
                <Row>
                  <Col sm="12">
                    <div className="text-sm-end">
                      <Tooltip title={this.props.t("Add")} placement="top">
                        <IconButton
                          color="primary"
                          onClick={() => this.handleAddDecreeRow(1)}
                        >
                          <i className="mdi mdi-plus-circle blue-noti-icon" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                {duplicateDecreeError && (
                  <Alert
                    color="danger"
                    className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                    role="alert"
                  >
                    {duplicateDecreeError}
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={this.handleAlertCloseDecree}
                    ></button>
                  </Alert>
                )}
                <BootstrapTable
                  keyField="Id"
                  data={decreeRulesCanceledReasons}
                  columns={decreesColumns}
                  cellEdit={cellEditFactory({
                    mode: "dbclick",
                    blurToSave: true,
                    afterSaveCell: (oldValue, newValue, row, column) => {
                      this.handleDecreeRulesDataChange(
                        row.Id,
                        column.dataField,
                        newValue,
                        2
                      );
                    },
                  })}
                  noDataIndication={t("No Decrees found")}
                  defaultSorted={defaultSorting}
                />
                <Row>
                  <Col sm="12">
                    <div className="text-sm-end">
                      <Tooltip title={this.props.t("Add")} placement="top">
                        <IconButton
                          color="primary"
                          onClick={() => this.handleAddDecreeRow(2)}
                        >
                          <i className="mdi mdi-plus-circle blue-noti-icon" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Select
                  options={rolesModified}
                  defaultValue={decreeObj ? decreeObj.AcceptRoles : []}
                  onChange={this.handleMulti}
                  isMulti
                  // isDisabled={!showEditButton}
                />
              </TabPane>
              <TabPane tabId="4">
                <Select
                  options={rolesModified}
                  defaultValue={decreeObj ? decreeObj.RefuseRoles : []}
                  onChange={this.handleMulti}
                  isMulti
                  // isDisabled={!showEditButton}
                />
              </TabPane>
            </TabContent>
          </ModalBody>
        </Modal>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRowId: null })
          }
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs title={t("Decrees")} breadcrumbItem={t("Decrees")} />
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
                        data={decrees}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={decrees}
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
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={decrees}
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
                                      this.handleDecreeDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={t("No Decrees found")}
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

const mapStateToProps = ({ decrees, roles, menu_items }) => ({
  decrees: decrees.decrees,
  deleted: decrees.deleted,
  decreeCategories: decrees.decreeCategories,
  decreeRulesReasons: decrees.decreeRulesReasons,
  decreeRulesCanceledReasons: decrees.decreeRulesCanceledReasons,
  roles: roles.roles,
  decreesRulesRoles: decrees.decreesRulesRoles,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetDecrees: () => dispatch(getDecrees()),
  onGetRoles: () => dispatch(getRoles()),
  onAddNewDecree: decree => dispatch(addNewDecree(decree)),
  onUpdateDecree: decree => dispatch(updateDecree(decree)),
  onDeleteDecree: decree => dispatch(deleteDecree(decree)),
  onGetDecreeDeletedValue: () => dispatch(getDecreeDeletedValue()),
  onGetDecreesRulesReasons: decreeId =>
    dispatch(getDecreesRulesReasons(decreeId)),
  onAddNewDecreesRulesReason: decree =>
    dispatch(addNewDecreesRulesReason(decree)),
  onUpdateDecreesRulesReason: decree =>
    dispatch(updateDecreesRulesReason(decree)),
  onDeleteDecreesRulesReason: decree =>
    dispatch(deleteDecreesRulesReason(decree)),
  onGetDecreesRulesReasonDeletedValue: () =>
    dispatch(getDecreesRulesReasonDeletedValue()),
  onGetDecreesRulesCanceledReasons: decreeId =>
    dispatch(getDecreesRulesCanceledReasons(decreeId)),
  onAddNewDecreesRulesCanceledReason: decree =>
    dispatch(addNewDecreesRulesCanceledReason(decree)),
  onUpdateDecreesRulesCanceledReason: decree =>
    dispatch(updateDecreesRulesCanceledReason(decree)),
  onDeleteDecreesRulesCanceledReason: decree =>
    dispatch(deleteDecreesRulesCanceledReason(decree)),
  onGetDecreesRulesCanceledReasonDeletedValue: () =>
    dispatch(getDecreesRulesCanceledReasonDeletedValue()),
  onGetDecreesRulesRoles: decreeId => dispatch(getDecreesRulesRoles(decreeId)),
  onAddNewDecreesRulesRole: decree => dispatch(addNewDecreesRulesRole(decree)),
  onUpdateDecreesRulesRole: decree => dispatch(updateDecreesRulesRole(decree)),
  onDeleteDecreesRulesRole: decree => dispatch(deleteDecreesRulesRole(decree)),
  onGetDecreesRulesRoleDeletedValue: () =>
    dispatch(getDecreesRulesRoleDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(DecreesList));
