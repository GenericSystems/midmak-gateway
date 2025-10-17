import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getCourseTypes,
  addNewCourseType,
  updateCourseType,
  deleteCourseType,
  getCourseTypeDeletedValue,
} from "store/coursetypes/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";

class CourseTypesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { courseTypes, onGetCourseTypes, user_menu, location } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    onGetCourseTypes();
    this.setState({ courseTypes });
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

  toggleDeleteModal = () => {
    this.setState(prev => ({ deleteModal: !prev.deleteModal }));
  };

  onClickDelete = row => {
    this.setState({ selectedRowId: row, deleteModal: true });
  };

  handleAddRow = () => {
    const { courseTypes, onAddNewCourseType } = this.props;
    const newRow = { arTitle: "-----" };

    const exists = courseTypes.some(item => item.arTitle.trim() === "-----");

    if (exists) {
      this.setState({ duplicateError: this.props.t("Fill in the empty row") });
    } else {
      this.setState({ duplicateError: null });
      onAddNewCourseType(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteCourseType } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId) {
      onDeleteCourseType(selectedRowId);
      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleCourseTypeChange = (rowId, fieldName, newValue) => {
    const { courseTypes, onUpdateCourseType } = this.props;

    const isDuplicate = courseTypes.some(
      type => type.Id !== rowId && type.arTitle.trim() === newValue.trim()
    );

    if (isDuplicate) {
      this.setState({ duplicateError: this.props.t("Value already exists") });
      onUpdateCourseType({ Id: rowId, [fieldName]: "-----" });
    } else {
      this.setState({ duplicateError: null });
      onUpdateCourseType({ Id: rowId, [fieldName]: newValue });
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetCourseTypeDeletedValue();
  };

  handleErrorClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetCourseTypeDeletedValue();
  };

  render() {
    const { courseTypes, deleted, t } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const { SearchBar } = Search;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: courseTypes.length,
      custom: true,
      page: 1,
    };

    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "serial",
        text: "#",
        formatter: (cell, row, rowIndex, extraData) => {
          const currentPage = extraData?.currentPage || 1;
          const sizePerPage = extraData?.sizePerPage || pageOptions.sizePerPage;
          return rowIndex + 1 + (currentPage - 1) * sizePerPage;
        },
        editable: false,
      },
      {
        dataField: "arTitle",
        text: t("Course Type (ar)"),
        sort: true,
      },
      {
        dataField: "enTitle",
        text: t("Course Type (en)"),
        sort: true,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Tooltip title={t("Delete")}>
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                onClick={() => this.onClickDelete(row)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];

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
          <Container fluid>
            <Breadcrumbs breadcrumbItem={t("Course Types")} />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    {duplicateError && (
                      <Alert color="danger" toggle={this.handleAlertClose}>
                        {duplicateError}
                      </Alert>
                    )}
                    {deleted === 0 && showAlert && (
                      <Alert color="danger" toggle={this.handleErrorClose}>
                        {t("Can't Delete")}
                      </Alert>
                    )}
                    {deleted === 1 && showAlert && (
                      <Alert color="success" toggle={this.handleSuccessClose}>
                        {t("Deleted Successfully")}
                      </Alert>
                    )}
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="Id"
                      columns={columns}
                      data={courseTypes}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          data={courseTypes}
                          columns={columns}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  {showSearchButton && (
                                    <SearchBar
                                      {...toolkitprops.searchProps}
                                      placeholder={t("Search...")}
                                    />
                                  )}
                                </Col>
                                <Col sm="8" className="text-sm-end">
                                  {showAddButton && (
                                    <Tooltip title={t("Add")}>
                                      <IconButton
                                        color="primary"
                                        onClick={this.handleAddRow}
                                      >
                                        <i className="mdi mdi-plus-circle blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Col>
                              </Row>
                              <BootstrapTable
                                keyField="Id"
                                {...toolkitprops.baseProps}
                                {...paginationTableProps}
                                columns={columns.map(col => ({
                                  ...col,
                                  formatter:
                                    col.dataField === "serial"
                                      ? (cell, row, rowIndex) =>
                                          rowIndex +
                                          1 +
                                          (paginationProps.page - 1) *
                                            paginationProps.sizePerPage
                                      : col.formatter,
                                }))}
                                data={courseTypes}
                                cellEdit={cellEditFactory({
                                  mode: "dbclick",
                                  blurToSave: true,
                                  afterSaveCell: (
                                    oldValue,
                                    newValue,
                                    row,
                                    column
                                  ) => {
                                    this.handleCourseTypeChange(
                                      row.Id,
                                      column.dataField,
                                      newValue
                                    );
                                  },
                                })}
                                noDataIndication={t("No Course Types found")}
                                defaultSorted={[
                                  { dataField: "Id", order: "desc" },
                                ]}
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
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ courseTypes, menu_items }) => ({
  courseTypes: courseTypes.courseTypes || [],
  deleted: courseTypes.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCourseTypes: () => dispatch(getCourseTypes()),
  onAddNewCourseType: data => dispatch(addNewCourseType(data)),
  onUpdateCourseType: data => dispatch(updateCourseType(data)),
  onDeleteCourseType: data => dispatch(deleteCourseType(data)),
  onGetCourseTypeDeletedValue: () => dispatch(getCourseTypeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withRouter(CourseTypesList)));
