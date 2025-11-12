import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { Treebeard } from "react-treebeard";
import {
  getLecturePermissions,
  addNewLecturePermission,
  updateLecturePermission,
  deleteLecturePermission,
  getLecturePermissionDeletedValue,
  //   getLecturePermissionPermissions,
  //   addNewLecturePermissionPermission,
  //   updateLecturePermissionPermission,
  //   deleteLecturePermissionPermission,
  //   getLecturePermissionPermissionDeletedValue,
  addNewLecturePermissionUser,
} from "store/changeLecturePermissions/actions";
import {
  getSidebarContent,
  getRoleSidebar,
} from "store/sidebarcontent/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import { getUserMngs } from "store/user-mngs/actions";

import Select from "react-select";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import { editableInputTypes } from "@testing-library/user-event/dist/utils";
class ChangeLecturePermissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lecturePermissions: [],
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      isModalOpen: false,
      isModalUserOpen: false,
      lecturePermission: "",
      lecturePermissionUser: null,
      cursor: null,
      selectedNode: null,
      nodeChildren: [],
      usersArray: [],
      selectedMulti: [],
      usersObj: "",
      showAddButton: false,
      showEditButton: false,
      showSearchButton: false,
      //   lecturePermissionPermissions: this.props.lecturePermissionPermissions,
      //   selectAllStatus: this.initializeSelectAllStatus(
      //     this.props.lecturePermissionPermissions
      //   ),
    };
    this.toggle = this.toggle.bind(this);
    this.toggleUserModal = this.toggleUserModal.bind(this);
    this.onToggle = this.onToggle.bind(this);
    //  this.onNodeClick = this.onNodeClick.bind(this);
  }
  componentDidMount() {
    const {
      lecturePermissions,
      userMngs,
      onGetLecturePermissions,
      deleted,
      menu_items,
      role_menuItems,
      onGetSideBar,
      onGetUserMngs,
      onGetLecturePermissionSideBar,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (lecturePermissions && !lecturePermissions.length) {
      onGetLecturePermissions();
      onGetUserMngs();
      onGetLecturePermissionSideBar();
      this.setState({ userMngs, role_menuItems });
    }
  }

  handleEditLecturePermission = lecturePermissionData => {
    const {
      onGetSideBar,
      onGetLecturePermissionSideBar,
      menu_items,
      role_menuItems,
    } = this.props;
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      lecturePermission: lecturePermissionData,
      selectedNode: null,
    });
  };

  handleEditLecturePermissionsUsers = lecturePermissionData => {
    this.setState({
      isModalUserOpen: !this.state.isModalUserOpen,
      lecturePermissionUser: lecturePermissionData,
      usersArray: lecturePermissionData.lecturePermissionUsers,
    });
  };

  toggle() {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  }

  toggleUserModal() {
    this.setState(prevState => ({
      isModalUserOpen: !prevState.isModalUserOpen,
    }));
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
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    const { onAddNewLecturePermission, lecturePermissions } = this.props;

    const newRow = {
      arTitle: "-----",
      enTitle: "",
    };

    const emptyRowsExist = lecturePermissions.some(
      lecturePermission => lecturePermission.arTitle.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewLecturePermission(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteLecturePermission } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteLecturePermission(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleLecturePermissionDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateLecturePermission, lecturePermissions } = this.props;

    const isDuplicate = lecturePermissions.some(
      lecturePermission =>
        lecturePermission.Id !== rowId &&
        ((lecturePermission.arTitle &&
          lecturePermission.arTitle.trim() === fieldValue.trim()) ||
          (lecturePermission.enTitle &&
            lecturePermission.enTitle.trim() === fieldValue.trim()))
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateLecturePermission(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateLecturePermission(onUpdate);
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetLecturePermissionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetLecturePermissionDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetLecturePermissionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetLecturePermissionDeletedValue();
  };

  onToggle(node, toggled) {
    const { cursor } = this.state;
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }

    this.setState({
      cursor: node,
      addForm: false,
    });
  }

  findMenuItemById = (menuItems, targetId) => {
    for (const menuItem of menuItems) {
      if (menuItem.menuItemId === targetId) {
        return menuItem;
      } else if (menuItem.children && menuItem.children.length > 0) {
        const foundInChildren = this.findMenuItemById(
          menuItem.children,
          targetId
        );
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
    return null;
  };

  //   onNodeClick(node) {
  //     const { onGetLecturePermissionPermissions, menu_items } = this.props;
  //     const { lecturePermission } = this.state;

  //     this.setState({
  //       selectedNode: node,
  //       editForm: true,
  //       addForm: false,
  //       editName: node.name,
  //       editStartDate: node.startDate,
  //       editEndDate: node.endDate,
  //       editCode: node.Code,
  //     });

  //     let obj = {};
  //     if (node != null && node.menuItemId == undefined) {
  //       obj = {
  //         lecturePermissionId: lecturePermission.Id,
  //         menuId: node.Id,
  //         itemId: null,
  //       };
  //     } else if (node != null && node.menuItemId != undefined) {
  //       obj = {
  //         lecturePermissionId: lecturePermission.Id,
  //         menuId: node.menuId,
  //         itemId: node.menuItemId,
  //       };
  //     }
  //     onGetLecturePermissionPermissions(obj);
  //   }

  //   handleChangeCheckbox = (row, currentStatus, fieldName) => {
  //     const { onUpdateLecturePermissionPermission, lecturePermissionPermissions } = this.props;
  //     const { lecturePermission, selectedNode } = this.state;
  //     const newStatus = currentStatus ? 1 : 0;

  //     let rIsFieldName =
  //       row.fieldName == null || row.fieldName == undefined ? 0 : row.fieldName;

  //     let obb = {
  //       Id: row.Id,
  //       lecturePermissionId: lecturePermission.Id,
  //       fieldName: fieldName,
  //       fieldValue: fieldName ? newStatus : rIsFieldName,
  //       menuId: row.menuId,
  //       menuItemId: row.menuItemId,
  //       itemId: row.itemId,
  //     };
  //     const filteredOb = Object.fromEntries(
  //       Object.entries(obb).filter(
  //         ([key, value]) => value !== undefined && value !== null
  //       )
  //     );

  //     const updatedLecturePermissionPermissions = this.state.lecturePermissionPermissions.map(lecturePermission =>
  //       lecturePermission.Id === row.Id ? { ...lecturePermission, [fieldName]: newStatus ? 1 : 0 } : lecturePermission
  //     );

  //     this.setState({
  //       lecturePermissionPermissions: updatedLecturePermissionPermissions,
  //       selectAllStatus: {
  //         ...this.state.selectAllStatus,
  //         [fieldName]: this.checkIfAllChecked(updatedLecturePermissionPermissions, fieldName),
  //       },
  //     });

  //     onUpdateLecturePermissionPermission(filteredOb);

  //     this.onNodeClick(selectedNode);
  //   };

  handleActiveToggle = (rowId, currentStatus) => {
    const { onUpdateLecturePermission } = this.props;
    onUpdateLecturePermission({
      Id: rowId,
      active: currentStatus === 1 ? 0 : 1,
    });
  };

  handleValidationDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateLecturePermission } = this.props;
    const fromDate = new Date(fieldValue).toISOString().split("T")[0];
    const onUpdate = { Id: rowId, [fieldName]: fromDate };
    onUpdateLecturePermission(onUpdate);
  };

  handleMultiUsers = selectedMulti => {
    const { onAddNewLecturePermissionUser } = this.props;
    const { lecturePermissionUser, decisionObj } = this.state;
    const selectedMultiWithLecturePermissionId = selectedMulti.map(item => ({
      ...item,
      value1: lecturePermissionUser.Id,
    }));

    let newLecturePermissionDecisions = {
      multiArray: selectedMultiWithLecturePermissionId,
      lecturePermissionId: lecturePermissionUser.Id,
    };
    onAddNewLecturePermissionUser(newLecturePermissionDecisions);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    // const { lecturePermissionPermissions } = this.props;
    // if (lecturePermissionPermissions !== prevProps.lecturePermissionPermissions) {
    //   this.setState({
    //     lecturePermissionPermissions: this.props.lecturePermissionPermissions,
    //     selectAllStatus: this.initializeSelectAllStatus(
    //       this.props.lecturePermissionPermissions
    //     ),
    //   });
    // }
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

  //   initializeSelectAllStatus = lecturePermissionPermissions => {
  //     //   const { lecturePermissionPermissions } =this.props
  //     const fields = [
  //       "isRead",
  //       "isAdd",
  //       "isEdit",
  //       "isDelete",
  //       "isPrint",
  //       "isSearch",
  //     ];
  //     const status = {};
  //     fields.forEach(field => {
  //       status[field] = this.checkIfAllChecked(lecturePermissionPermissions, field);
  //     });
  //     return status;
  //   };

  //   checkIfAllChecked = (lecturePermissionPermissions, field) => {
  //     return lecturePermissionPermissions.every(lecturePermission => lecturePermission[field] === 1);
  //   };

  render() {
    const {
      lecturePermissions,
      t,
      deleted,
      menu_items,
      role_menuItems,
      //   lecturePermissionPermissions,
      deletedDetail,
      userMngs,
    } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      isModalOpen,
      selectedNode,
      lecturePermission,
      isModalUserOpen,
      lecturePermissionUser,
      nodeChildren,
      usersArray,
      selectAllStatus,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");
    const alertMessageDetail =
      deletedDetail == 0
        ? "Can't Delete (Delete data related to it)"
        : "Deleted Successfully";

    const { SearchBar } = Search;
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    console.log(
      "eeeeeeeeeeeeeeeeeeeeeeeeeeeempty",
      lecturePermissions,
      userMngs
    );
    const modifiedUsers = userMngs.map(user => ({
      value: user.Id,
      label: user.fullName,
    }));

    // const handleToggleAllRead = (currentStatus, fieldName) => {
    //   const { onUpdateLecturePermissionPermission } = this.props;
    //   const { lecturePermission, selectedNode } = this.state;
    //   const newStatus = currentStatus ? 1 : 0;

    //   let obj = {};
    //   if (selectedNode && selectedNode.menuId == undefined) {
    //     obj = {
    //       lecturePermissionId: lecturePermission.Id,
    //       fieldName: fieldName,
    //       fieldValue: fieldName ? newStatus : 0,
    //       menuId: selectedNode.Id,
    //       menuItemId: selectedNode.menuItemId,
    //     };
    //   } else if (selectedNode && selectedNode.menuId != undefined) {
    //     obj = {
    //       lecturePermissionId: lecturePermission.Id,
    //       fieldName: fieldName,
    //       fieldValue: fieldName ? newStatus : 0,
    //       menuId: selectedNode.menuId,
    //       menuItemId: selectedNode.menuItemId,
    //     };
    //   }
    //   const filteredOb = Object.fromEntries(
    //     Object.entries(obj).filter(
    //       ([key, value]) => value !== undefined && value !== null
    //     )
    //   );
    //   const updatedLecturePermissionPermissions = this.state.lecturePermissionPermissions.map(lecturePermission => ({
    //     ...lecturePermission,
    //     [fieldName]: newStatus ? 1 : 0,
    //   }));

    //   this.setState({
    //     lecturePermissionPermissions: updatedLecturePermissionPermissions,
    //     selectAllStatus: {
    //       ...this.state.selectAllStatus,
    //       [fieldName]: newStatus ? 1 : 0,
    //     },
    //   });

    //   onUpdateLecturePermissionPermission(filteredOb);
    // };

    // const resetLecturePermissionPermissionsRender = lecturePermissionPermission => {
    //   this.resetLecturePermissionPermission(lecturePermissionPermission);
    //   this.onNodeClick(this.state.selectedNode);
    // };

    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("Input"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "viewRolw",
        text: "View Rolw",
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "editRolw",
        text: "Edit Rolw",
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "edit",
        text: "",
        isDummyField: true,
        editable: false,
        style: { width: "3rem" },
        formatter: (cellContent, lecturePermission) => (
          <div className="d-flex" style={{ width: "fit-content" }}>
            <Tooltip
              className=""
              title={this.props.t("LecturePermissions' Users")}
              placement="top"
            >
              <Link className="ms-2" to="#">
                <i
                  className="mdi mdi-book-account-outline font-size-20"
                  id="edittooltip"
                  onClick={() =>
                    this.handleEditLecturePermissionsUsers(lecturePermission)
                  }
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: lecturePermissions.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <Modal isOpen={isModalUserOpen}>
          <ModalHeader
            toggle={this.toggleUserModal}
            tag="h4"
            className="horizontalTitles"
          ></ModalHeader>
          <ModalBody>
            <br />
            <Row>
              <Col>
                <div className="TitleStyle">
                  {t("Permissions")}
                  {" - "}
                  {lecturePermissionUser && lecturePermissionUser.arTitle}
                </div>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Card>
                  <Row>
                    <Select
                      options={modifiedUsers}
                      defaultValue={
                        usersArray && usersArray.length > 0 ? usersArray : []
                      }
                      onChange={this.handleMultiUsers}
                      isMulti
                      isDisabled={!showEditButton}
                    />
                  </Row>
                </Card>
              </Col>
            </Row>
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
            <Breadcrumbs
              title={t("LecturePermissions")}
              breadcrumbItem={t("LecturePermissions List")}
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
                          lecturePermission="alert"
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
                          lecturePermission="alert"
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
                          lecturePermission="alert"
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
                        data={lecturePermissions}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={lecturePermissions}
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
                                  data={lecturePermissions}
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
                                      this.handleLecturePermissionDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={t(
                                    "No LecturePermissions found"
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

const mapStateToProps = ({ lecturePermissions, menu_items, userMngs }) => ({
  lecturePermissions: lecturePermissions.lecturePermissions,
  deleted: lecturePermissions.deleted,
  menu_items: menu_items.menu_items,
  // role_menuItems: menu_items.role_menuItems,
  //lecturePermissionPermissions: lecturePermissions.lecturePermissionPermissions,
  userMngs: userMngs.userMngs,
  deletedDetail: lecturePermissions.deletedDetail,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetUserMngs: () => dispatch(getUserMngs()),
  onGetSideBar: () => dispatch(getSidebarContent()),
  onGetLecturePermissionSideBar: () => dispatch(getRoleSidebar()),
  onGetLecturePermissions: () => dispatch(getLecturePermissions()),
  onAddNewLecturePermission: lecturePermission =>
    dispatch(addNewLecturePermission(lecturePermission)),
  onUpdateLecturePermission: lecturePermission =>
    dispatch(updateLecturePermission(lecturePermission)),
  onDeleteLecturePermission: lecturePermission =>
    dispatch(deleteLecturePermission(lecturePermission)),
  onGetLecturePermissionDeletedValue: () =>
    dispatch(getLecturePermissionDeletedValue()),
  //   onGetLecturePermissionPermissions: lecturePermissionPermission =>
  //     dispatch(getLecturePermissionPermissions(lecturePermissionPermission)),
  //   onAddNewLecturePermissionPermission: lecturePermissionPermission =>
  //     dispatch(addNewLecturePermissionPermission(lecturePermissionPermission)),
  //   onUpdateLecturePermissionPermission: lecturePermissionPermission =>
  //     dispatch(updateLecturePermissionPermission(lecturePermissionPermission)),
  //   onDeleteLecturePermissionPermission: lecturePermissionPermission =>
  //     dispatch(deleteLecturePermissionPermission(lecturePermissionPermission)),
  //   onGetLecturePermissionPermissionDeletedValue: () =>
  //     dispatch(getLecturePermissionPermissionDeletedValue()),
  onAddNewLecturePermissionUser: lecturePermissionUser =>
    dispatch(addNewLecturePermissionUser(lecturePermissionUser)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ChangeLecturePermissions));
