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
  getRoles,
  addNewRole,
  updateRole,
  deleteRole,
  getRoleDeletedValue,
  getRolePermissions,
  addNewRolePermission,
  updateRolePermission,
  deleteRolePermission,
  getRolePermissionDeletedValue,
  addNewRoleUser,
} from "store/roles/actions";
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
const ROLE_STORAGE_KEY = "editableRole";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import { editableInputTypes } from "@testing-library/user-event/dist/utils";
class RolesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      isModalOpen: false,
      isModalRoleUserOpen: false,
      role: null,
      roleUser: null,
      cursor: null,
      selectedNode: null,
      nodeChildren: [],
      usersArray: [],
      selectedMulti: [],
      usersObj: "",
      showAddButton: false,
      showEditButton: false,
      showSearchButton: false,
      rolePermissions: this.props.rolePermissions,
      selectAllStatus: this.initializeSelectAllStatus(
        this.props.rolePermissions
      ),
    };
    this.toggle = this.toggle.bind(this);
    this.toggleRoleUserModal = this.toggleRoleUserModal.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
  }
  componentDidMount() {
    const {
      roles,
      userMngs,
      onGetRoles,
      deleted,
      menu_items,
      role_menuItems,
      onGetSideBar,
      onGetUserMngs,
      onGetRoleSideBar,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (roles && !roles.length) {
      onGetRoles();
      onGetUserMngs();
      onGetRoleSideBar();
      this.setState({ userMngs, role_menuItems });
    }
  }

  handleEditRole = roleData => {
    const { onGetSideBar, onGetRoleSideBar, menu_items, role_menuItems } =
      this.props;
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      role: roleData,
      selectedNode: null,
    });
  };

  handleEditRolesUsers = roleData => {
    this.setState({
      isModalRoleUserOpen: !this.state.isModalRoleUserOpen,
      roleUser: roleData,
      usersArray: roleData.roleUsers,
    });
  };

  toggle() {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  }

  toggleRoleUserModal() {
    this.setState(prevState => ({
      isModalRoleUserOpen: !prevState.isModalRoleUserOpen,
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
    const { onAddNewRole, roles } = this.props;

    const newRow = {
      arTitle: "-----",
      enTitle: "",
    };

    const emptyRowsExist = roles.some(role => role.arTitle.trim() === "-----");

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewRole(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteRole } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteRole(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleRoleDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateRole, roles } = this.props;

    const isDuplicate = roles.some(
      role =>
        role.Id !== rowId &&
        ((role.arTitle && role.arTitle.trim() === fieldValue.trim()) ||
          (role.enTitle && role.enTitle.trim() === fieldValue.trim()))
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateRole(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateRole(onUpdate);
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetRoleDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetRoleDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetRoleDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetRoleDeletedValue();
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

  onNodeClick(node) {
    const { onGetRolePermissions, menu_items } = this.props;
    const { role } = this.state;

    this.setState({
      selectedNode: node,
      editForm: true,
      addForm: false,
      editName: node.name,
      editStartDate: node.startDate,
      editEndDate: node.endDate,
      editCode: node.Code,
    });

    let obj = {};
    if (node != null && node.menuItemId == undefined) {
      obj = {
        roleId: role.Id,
        menuId: node.Id,
        itemId: null,
      };
    } else if (node != null && node.menuItemId != undefined) {
      obj = {
        roleId: role.Id,
        menuId: node.menuId,
        itemId: node.menuItemId,
      };
    }
    onGetRolePermissions(obj);
  }

  handleChangeCheckbox = (row, currentStatus, fieldName) => {
    const { onUpdateRolePermission, rolePermissions } = this.props;
    const { role, selectedNode } = this.state;
    const newStatus = currentStatus ? 1 : 0;

    let rIsFieldName =
      row.fieldName == null || row.fieldName == undefined ? 0 : row.fieldName;

    let obb = {
      Id: row.Id,
      roleId: role.Id,
      fieldName: fieldName,
      fieldValue: fieldName ? newStatus : rIsFieldName,
      menuId: row.menuId,
      menuItemId: row.menuItemId,
      itemId: row.itemId,
    };
    const filteredOb = Object.fromEntries(
      Object.entries(obb).filter(
        ([key, value]) => value !== undefined && value !== null
      )
    );

    const updatedRolePermissions = this.state.rolePermissions.map(role =>
      role.Id === row.Id ? { ...role, [fieldName]: newStatus ? 1 : 0 } : role
    );

    this.setState({
      rolePermissions: updatedRolePermissions,
      selectAllStatus: {
        ...this.state.selectAllStatus,
        [fieldName]: this.checkIfAllChecked(updatedRolePermissions, fieldName),
      },
    });

    onUpdateRolePermission(filteredOb);

    this.onNodeClick(selectedNode);
  };

  resetRolePermission = row => {
    const { onUpdateRolePermission } = this.props;
    const { role, selectedNode } = this.state;
    let obj = {
      Id: row.Id,
      roleId: role.Id,
      fieldName: "",
      fieldValue: 0,
      menuId: row.menuId,
      menuItemId: row.menuItemId,
      itemId: row.itemId,
    };

    const filteredOb = Object.fromEntries(
      Object.entries(obj).filter(
        ([key, value]) => value !== undefined && value !== null
      )
    );

    onUpdateRolePermission(filteredOb);
  };

  handleActiveToggle = (rowId, currentStatus) => {
    const { onUpdateRole } = this.props;
    onUpdateRole({ Id: rowId, active: currentStatus === 1 ? 0 : 1 });
  };

  handleValidationDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateRole } = this.props;
    const fromDate = new Date(fieldValue).toISOString().split("T")[0];
    const onUpdate = { Id: rowId, [fieldName]: fromDate };
    onUpdateRole(onUpdate);
  };

  handleMultiUsers = selectedMulti => {
    const { onAddNewRoleUser } = this.props;
    const { roleUser, decisionObj } = this.state;
    const selectedMultiWithRoleId = selectedMulti.map(item => ({
      ...item,
      value1: roleUser.Id,
    }));

    let newRoleDecisions = {
      multiArray: selectedMultiWithRoleId,
      roleId: roleUser.Id,
    };
    onAddNewRoleUser(newRoleDecisions);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { rolePermissions } = this.props;
    if (rolePermissions !== prevProps.rolePermissions) {
      this.setState({
        rolePermissions: this.props.rolePermissions,
        selectAllStatus: this.initializeSelectAllStatus(
          this.props.rolePermissions
        ),
      });
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

  initializeSelectAllStatus = rolePermissions => {
    //   const { rolePermissions } =this.props
    const fields = [
      "isRead",
      "isAdd",
      "isEdit",
      "isDelete",
      "isPrint",
      "isSearch",
    ];
    const status = {};
    fields.forEach(field => {
      status[field] = this.checkIfAllChecked(rolePermissions, field);
    });
    return status;
  };

  checkIfAllChecked = (rolePermissions, field) => {
    return rolePermissions.every(role => role[field] === 1);
  };

  render() {
    const {
      roles,
      t,
      deleted,
      menu_items,
      role_menuItems,
      rolePermissions,
      deletedDetail,
      userMngs,
    } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      isModalOpen,
      selectedNode,
      role,
      isModalRoleUserOpen,
      roleUser,
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

    const modifiedUsers = userMngs.map(user => ({
      value: user.Id,
      label: user.fullName,
    }));

    const rolesColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      { dataField: "label", text: t("Name"), editable: false },
      {
        dataField: "isRead",
        text: this.props.t("Read"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, event.target.checked, "isRead")
            }
            disabled={!showEditButton}
          />
        ),
        headerFormatter: (column, colIndex, { toggled }) => (
          <div>
            <div>{this.props.t("Read")}</div>
            <div>
              <Input
                type="checkbox"
                checked={selectAllStatus.isRead}
                onChange={event =>
                  handleToggleAllRead(event.target.checked, "isRead")
                }
                disabled={!showEditButton}
              />
            </div>
          </div>
        ),
      },
      {
        dataField: "isAdd",
        text: this.props.t("Add"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, event.target.checked, "isAdd")
            }
            disabled={!showEditButton}
          />
        ),
        headerFormatter: (column, colIndex, { toggled }) => (
          <div>
            <div>{this.props.t("Add")}</div>
            <div>
              <Input
                type="checkbox"
                checked={selectAllStatus.isAdd}
                onChange={event =>
                  handleToggleAllRead(event.target.checked, "isAdd")
                }
                disabled={!showEditButton}
              />
            </div>
          </div>
        ),
      },

      {
        dataField: "isEdit",
        text: this.props.t("Edit"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, event.target.checked, "isEdit")
            }
            disabled={!showEditButton}
          />
        ),
        headerFormatter: (column, colIndex, { toggled }) => (
          <div>
            <div>{this.props.t("Edit")}</div>
            <div>
              <Input
                type="checkbox"
                checked={selectAllStatus.isEdit}
                onChange={event =>
                  handleToggleAllRead(event.target.checked, "isEdit")
                }
                disabled={!showEditButton}
              />
            </div>
          </div>
        ),
      },
      {
        dataField: "isDelete",
        text: this.props.t("Delete"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, event.target.checked, "isDelete")
            }
            disabled={!showEditButton}
          />
        ),
        headerFormatter: (column, colIndex, { toggled }) => (
          <div>
            <div>{this.props.t("Delete")}</div>
            <div>
              <Input
                type="checkbox"
                checked={selectAllStatus.isDelete}
                onChange={event =>
                  handleToggleAllRead(event.target.checked, "isDelete")
                }
                disabled={!showEditButton}
              />
            </div>
          </div>
        ),
      },
      {
        dataField: "isPrint",
        text: this.props.t("Print"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, event.target.checked, "isPrint")
            }
            disabled={!showEditButton}
          />
        ),
        headerFormatter: (column, colIndex, { toggled }) => (
          <div>
            <div>{this.props.t("Print")}</div>
            <div>
              <Input
                type="checkbox"
                checked={selectAllStatus.isPrint}
                onChange={event =>
                  handleToggleAllRead(event.target.checked, "isPrint")
                }
                disabled={!showEditButton}
              />
            </div>
          </div>
        ),
      },
      {
        dataField: "isSearch",
        text: this.props.t("Search"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, event.target.checked, "isSearch")
            }
            disabled={!showEditButton}
          />
        ),
        headerFormatter: (column, colIndex, { toggled }) => (
          <div>
            <div>{this.props.t("Search")}</div>
            <div>
              <Input
                type="checkbox"
                checked={selectAllStatus.isSearch}
                onChange={event =>
                  handleToggleAllRead(event.target.checked, "isSearch")
                }
                disabled={!showEditButton}
              />
            </div>
          </div>
        ),
      },
      {
        dataField: "reset",
        text: "",
        isDummyField: true,
        editable: false,
        text: this.props.t("Reset"),
        formatter: (cellContent, rolePermission) => (
          <IconButton
            color="primary"
            onClick={() => resetRolePermissionsRender(rolePermission)}
            id="TooltipTop"
            disabled={!showEditButton}
          >
            <i className="bx bx-reset" />
          </IconButton>
        ),
      },
    ];

    const handleToggleAllRead = (currentStatus, fieldName) => {
      const { onUpdateRolePermission } = this.props;
      const { role, selectedNode } = this.state;
      const newStatus = currentStatus ? 1 : 0;

      let obj = {};
      if (selectedNode && selectedNode.menuId == undefined) {
        obj = {
          roleId: role.Id,
          fieldName: fieldName,
          fieldValue: fieldName ? newStatus : 0,
          menuId: selectedNode.Id,
          menuItemId: selectedNode.menuItemId,
        };
      } else if (selectedNode && selectedNode.menuId != undefined) {
        obj = {
          roleId: role.Id,
          fieldName: fieldName,
          fieldValue: fieldName ? newStatus : 0,
          menuId: selectedNode.menuId,
          menuItemId: selectedNode.menuItemId,
        };
      }
      const filteredOb = Object.fromEntries(
        Object.entries(obj).filter(
          ([key, value]) => value !== undefined && value !== null
        )
      );
      const updatedRolePermissions = this.state.rolePermissions.map(role => ({
        ...role,
        [fieldName]: newStatus ? 1 : 0,
      }));

      this.setState({
        rolePermissions: updatedRolePermissions,
        selectAllStatus: {
          ...this.state.selectAllStatus,
          [fieldName]: newStatus ? 1 : 0,
        },
      });

      onUpdateRolePermission(filteredOb);
    };

    const resetRolePermissionsRender = rolePermission => {
      this.resetRolePermission(rolePermission);
      this.onNodeClick(this.state.selectedNode);
    };

    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("Role(ar)"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "Role",
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "endDate",
        text: t("Valid Till"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="date"
            defaultValue={
              (row.endDate
                ? new Date(row.endDate).toISOString().split("T")[0]
                : "") || ""
            }
            onChange={newValue => {
              this.handleValidationDataChange(
                row.Id,
                "endDate",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "active",
        text: this.props.t("Active"),
        editable: false,
        formatter: (cellContent, role) => (
          <IconButton
            color="primary"
            onClick={() => this.handleActiveToggle(role.Id, role.active)}
            disabled={!showEditButton}
          >
            {role.active ? (
              <i
                className="bx bx-radio-circle-marked"
                style={{ color: "green" }}
              />
            ) : (
              <i className="bx bx-radio-circle" style={{ color: "red" }} />
            )}
          </IconButton>
        ),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        style: { width: "3rem" },
        formatter: (cellContent, role) => (
          <div className="d-flex" style={{ width: "fit-content" }}>
            {showDeleteButton && (
              <Tooltip title={this.props.t("Delete Role")} placement="top">
                <Link className="text-danger  ms-1" to="#">
                  <i
                    className="mdi mdi-delete font-size-20"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(role)}
                  ></i>
                </Link>
              </Tooltip>
            )}
            <Tooltip
              className=""
              title={this.props.t("Role Permission")}
              placement="top"
            >
              <Link className="ms-2" to="#">
                <i
                  className="mdi mdi-star-cog font-size-20"
                  id="edittooltip"
                  onClick={() => this.handleEditRole(role)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip
              className=""
              title={this.props.t("Roles' Users")}
              placement="top"
            >
              <Link className="ms-2" to="#">
                <i
                  className="mdi mdi-book-account-outline font-size-20"
                  id="edittooltip"
                  onClick={() => this.handleEditRolesUsers(role)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: roles.length,
      custom: true,
    };

    const treeStyle = {
      tree: {
        base: {
          listStyle: "none",
          backgroundColor: "#F8F8F8",
          margin: 0,
          padding: "5px",
          color: "gray",
          fontFamily: "Lucida Grande, Tahoma, Verdana, Arial, sans-serif",
          fontSize: "14px",
        },
        node: {
          link: {
            cursor: "pointer",
            listStyle: "none",
            height: "30px",
            lineHeight: "30px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid lightblue",
          },
          activeLink: {
            background: "#A3D2E7",
            arrow: {
              //fill: "white",
              display: "none",
            },
          },
          toggle: {
            base: {
              margin: "5px",
              display: "inline-block",
              marginLeft: "-5px",
              width: "24px",
              height: "24px",
            },
            wrapper: {
              top: "50%",
              left: "50%",
              // margin: "-7px 0 0 -7px",
              height: "14px",
            },
            height: 10,
            width: 10,
            arrow: {
              fill: "#0086BF",
              position: "left",
            },
          },
          header: {
            base: {
              display: "inline-block",
              verticalAlign: "top",
              color: "#333",
            },
            connector: {
              width: "2px",
              height: "12px",
              borderLeft: "solid 2px black",
              borderBottom: "solid 2px black",
              position: "absolute",
              top: "0px",
              left: "-21px",
            },
            title: {
              lineHeight: "24px",
              verticalAlign: "middle",
            },
          },
          subtree: {
            paddingRight: "30px",
            color: "green",
            wrapper: {
              display: "none !important",
            },
            toggle: {
              arrow: {
                display: "none !important",
              },
            },
          },
        },
      },
    };

    return (
      <React.Fragment>
        <Modal isOpen={isModalOpen} fullscreen>
          <ModalHeader
            toggle={this.toggle}
            tag="h4"
            className="horizontalTitles"
          ></ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="3">
                <Card>
                  <CardTitle id="course_header">
                    {t("System Components")}
                  </CardTitle>
                  <CardBody>
                    <Treebeard
                      style={treeStyle}
                      data={role_menuItems}
                      onToggle={(node, toggled) => {
                        this.onToggle(node, toggled);
                        this.onNodeClick(node);
                      }}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col lg="auto" className="p-0">
                <div className="collapse-course"></div>
              </Col>
              <Col>
                <div
                  className="TitleStyle"
                  // id="title"
                >
                  {t("Permissions")}
                  {" - "}
                  {role && role.arTitle}
                </div>
                <Card>
                  <CardBody>
                    {selectedNode != null && (
                      <BootstrapTable
                        keyField="Id"
                        data={rolePermissions}
                        columns={rolesColumns}
                        cellEdit={cellEditFactory({
                          mode: "click",
                          blurToSave: true,
                          afterSaveCell: (oldValue, newValue, row, column) => {
                            this.handleRoleDataChange(
                              row.Id,
                              column.dataField,
                              newValue
                            );
                          },
                        })}
                        noDataIndication={t("No Roles found")}
                        defaultSorted={defaultSorting}
                      />
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal isOpen={isModalRoleUserOpen}>
          <ModalHeader
            toggle={this.toggleRoleUserModal}
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
                  {roleUser && roleUser.arTitle}
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
            <Breadcrumbs title={t("Roles")} breadcrumbItem={t("Roles List")} />
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
                        data={roles}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={roles}
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
                                  data={roles}
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
                                      this.handleRoleDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={t("No Roles found")}
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

const mapStateToProps = ({ roles, menu_items, userMngs }) => ({
  roles: roles.roles,
  deleted: roles.deleted,
  menu_items: menu_items.menu_items,
  role_menuItems: menu_items.role_menuItems,
  rolePermissions: roles.rolePermissions,
  userMngs: userMngs.userMngs,
  deletedDetail: roles.deletedDetail,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetUserMngs: () => dispatch(getUserMngs()),
  onGetSideBar: () => dispatch(getSidebarContent()),
  onGetRoleSideBar: () => dispatch(getRoleSidebar()),
  onGetRoles: () => dispatch(getRoles()),
  onAddNewRole: role => dispatch(addNewRole(role)),
  onUpdateRole: role => dispatch(updateRole(role)),
  onDeleteRole: role => dispatch(deleteRole(role)),
  onGetRoleDeletedValue: () => dispatch(getRoleDeletedValue()),
  onGetRolePermissions: rolePermission =>
    dispatch(getRolePermissions(rolePermission)),
  onAddNewRolePermission: rolePermission =>
    dispatch(addNewRolePermission(rolePermission)),
  onUpdateRolePermission: rolePermission =>
    dispatch(updateRolePermission(rolePermission)),
  onDeleteRolePermission: rolePermission =>
    dispatch(deleteRolePermission(rolePermission)),
  onGetRolePermissionDeletedValue: () =>
    dispatch(getRolePermissionDeletedValue()),
  onAddNewRoleUser: roleUser => dispatch(addNewRoleUser(roleUser)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(RolesList));
