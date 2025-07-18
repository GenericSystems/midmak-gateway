import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";

import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import DeleteModal from "components/Common/DeleteModal";
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getGradeTypes,
  addNewGradeType,
  updateGradeType,
  deleteGradeType,
  getGradeTypeDeletedValue,
} from "store/grade-types/actions";

import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";

class GradeTypesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: null,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }

  componentDidMount() {
    const { onGetGradeTypes, user_menu } = this.props;
    onGetGradeTypes();
    const pathname = this.props.location.pathname;
    this.updatePermissions(user_menu, pathname);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updatePermissions(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }

  updatePermissions = (menu, pathname) => {
    this.setState({
      showAddButton: checkIsAddForPage(menu, pathname),
      showDeleteButton: checkIsDeleteForPage(menu, pathname),
      showEditButton: checkIsEditForPage(menu, pathname),
      showSearchButton: checkIsSearchForPage(menu, pathname),
    });
  };

  handleAddRow = () => {
    const { gradeTypes, onAddNewGradeType, t } = this.props;
    const emptyExists = gradeTypes.some(gt => gt.arTitle === "-----");

    if (emptyExists) {
      this.setState({ duplicateError: t("Fill in the empty row") });
    } else {
      this.setState({ duplicateError: null });
      onAddNewGradeType({ arTitle: "-----" });
    }
  };

  handleDeleteRow = () => {
    const { selectedRowId } = this.state;
    const { onDeleteGradeType } = this.props;
    if (selectedRowId) {
      onDeleteGradeType(selectedRowId);
      this.setState({
        deleteModal: false,
        selectedRowId: null,
        showAlert: true,
      });
    }
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleDataChange = (rowId, fieldName, value) => {
    const { gradeTypes, onUpdateGradeType, t } = this.props;

    const isDuplicate = gradeTypes.some(
      gt =>
        gt.Id !== rowId &&
        ((gt.arTitle && gt.arTitle.trim()) === value.trim() ||
          (gt.enTitle && gt.enTitle.trim()) === value.trim())
    );

    if (isDuplicate) {
      this.setState({ duplicateError: t("Value already exists") });
      onUpdateGradeType({ Id: rowId, [fieldName]: "-----" });
    } else {
      this.setState({ duplicateError: null });
      onUpdateGradeType({ Id: rowId, [fieldName]: value });
    }
  };

  render() {
    const { t, gradeTypes, deleted } = this.props;
    const {
      deleteModal,
      duplicateError,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const columns = [
      { dataField: "Id", text: "ID", hidden: true },
      {
        dataField: "arTitle",
        text: t("Grade Type (ar)"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: t("Grade Type"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "delete",
        isDummyField: true,
        text: "",
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, gradeTypes) => (
          <Tooltip title={t("Delete")}>
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                onClick={() => this.onClickDelete(gradeTypes)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: gradeTypes.length,
      custom: true,
    };

    const { SearchBar } = Search;

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
            <Breadcrumbs breadcrumbItem={t("Grade Types List")} />

            {duplicateError && (
              <Alert
                color="danger"
                toggle={() => this.setState({ duplicateError: null })}
              >
                {duplicateError}
              </Alert>
            )}

            {showAlert && (
              <Alert
                color={deleted == 1 ? "success" : "danger"}
                toggle={() => {
                  this.setState({ showAlert: null });
                  this.props.onGetGradeTypeDeletedValue();
                }}
              >
                {deleted == 1 ? t("Deleted Successfully") : t("Can't Delete")}
              </Alert>
            )}

            <Card>
              <CardBody>
                <PaginationProvider
                  pagination={paginationFactory(pageOptions)}
                  keyField="Id"
                  columns={columns}
                  data={gradeTypes}
                >
                  {({ paginationProps, paginationTableProps }) => (
                    <ToolkitProvider
                      keyField="Id"
                      data={gradeTypes}
                      columns={columns}
                      search
                    >
                      {toolkitProps => (
                        <React.Fragment>
                          <Row className="mb-2">
                            <Col sm="4">
                              {showSearchButton && (
                                <div className="search-box ms-2">
                                  <SearchBar
                                    {...toolkitProps.searchProps}
                                    placeholder={t("Search...")}
                                  />
                                </div>
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
                            {...toolkitProps.baseProps}
                            {...paginationTableProps}
                            data={gradeTypes}
                            columns={columns}
                            cellEdit={cellEditFactory({
                              mode: "click",
                              blurToSave: true,
                              afterSaveCell: (
                                oldValue,
                                newValue,
                                row,
                                column
                              ) =>
                                this.handleDataChange(
                                  row.Id,
                                  column.dataField,
                                  newValue
                                ),
                            })}
                            defaultSorted={[{ dataField: "Id", order: "desc" }]}
                            noDataIndication={t("No Grade Types found")}
                          />

                          <div className="d-flex justify-content-end mt-2">
                            <PaginationListStandalone {...paginationProps} />
                          </div>
                        </React.Fragment>
                      )}
                    </ToolkitProvider>
                  )}
                </PaginationProvider>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ gradeTypes, menu_items }) => ({
  gradeTypes: gradeTypes.gradeTypes,
  deleted: gradeTypes.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetGradeTypes: () => dispatch(getGradeTypes()),
  onAddNewGradeType: data => dispatch(addNewGradeType(data)),
  onUpdateGradeType: data => dispatch(updateGradeType(data)),
  onDeleteGradeType: data => dispatch(deleteGradeType(data)),
  onGetGradeTypeDeletedValue: () => dispatch(getGradeTypeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GradeTypesList));
