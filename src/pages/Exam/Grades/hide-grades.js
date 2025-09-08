import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Select from "react-select";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Alert,
  Input,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getHiddenGrades,
  addNewHiddenGrade,
  updateHiddenGrade,
} from "store/hide-grade/actions";
//store/hide-grade/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class HiddenGradesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenGrades: [],
      hiddenGrade: "",
      showAlert: null,
      showAddButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.state = {
      duplicateError: null,
      selectedRowId: null,
    };
  }

  componentDidMount() {
    const { hiddenGrades, onGetHiddenGrades, user_menu,coursesOffering } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);

    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (hiddenGrade && !hiddenGrades.length) {
    //   onGethiddenGrades();
    // }
    onGetHiddenGrades();

    this.setState({ hiddenGrades ,coursesOffering});
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

  handleAddRow = () => {
    const { onAddNewHiddenGrade, hiddenGrades } = this.props;
    console.log("hiddenGrades", hiddenGrades);

    const newRow = {
      arTitle: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = hiddenGrades.some(
      hiddenGrades => hiddenGrades.arTitle.trim() === "-----"
      // ||
      // hiddenGrade.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewHiddenGrade(newRow);
    }
  };

  handlehiddenGradeDataChange = (rowId, fieldName, fieldValue) => {
    const { hiddenGrades, onUpdateHiddenGrade } = this.props;

    const isDuplicate = hiddenGrades.some(hiddenGrade => {
      return (
        hiddenGrade.Id !== rowId &&
        hiddenGrade.arTitle.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateHiddenGrade(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateHiddenGrade(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, newValue) {
    const { onUpdateHiddenGrade } = this.props;
    const onUpdate = { Id: rowId, [fieldName]: newValue };
    onUpdateHiddenGrade(onUpdate);
  }

  render() {
    const { hiddenGrades, t, deleted ,coursesOffering} = this.props;
    const {
      duplicateError,

      showAlert,
      showAddButton,

      showEditButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const columns = [
      { dataField: "Id", text: "ID", hidden: true },
      {
        dataField: "courseNameId",
        text: this.props.t("Course Name"),
       formatter: (cell, row) => (
          <Select
            key={`hidden_grade_${row.Id}`}
            options={coursesOffering}
            onChange={newValue => {
              this.handleSelect(row.Id, "courseNameId", newValue.value);
            }}
            value={coursesOffering.find(opt => opt.value == row.dataField)}

          />
        ),
        editable: false,
      },
      {
        dataField: "courseCode",
        text: this.props.t("Course Code"),
        sort: true,
       
    
      },
        {
        dataField: "fromDate",
        text: this.props.t("fom Date"),
        sort: true,
        formatter: cell => {
          if (!cell) return "";
          const date = new Date(cell);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`; // 2025-08-11
        },

        editable: true,
        editorRenderer: (
          editorProps,
          value,
          row,
          column,
          rowIndex,
          columnIndex
        ) => {
          return (
            <input
              type="date"
              {...editorProps}
              value={value || ""}
              onChange={e => editorProps.onUpdate(e.target.value)}
              className="form-control"
            />
          );
        },
      },

     {
        dataField: "toDate",
        text: this.props.t("toDate"),
        sort: true,
        formatter: cell => {
          if (!cell) return "";
          const date = new Date(cell);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`; // 2025-08-11
        },

        editable: true,
        editorRenderer: (
          editorProps,
          value,
          row,
          column,
          rowIndex,
          columnIndex
        ) => {
          return (
            <input
              type="date"
              {...editorProps}
              value={value || ""}
              onChange={e => editorProps.onUpdate(e.target.value)}
              className="form-control"
            />
          );
        },
      },
       {
        dataField: "hideReasonId",
        text: this.props.t("Hide Reason"),
       formatter: (cell, row) => (
          <Select
            key={`hidden_grade_${row.Id}`}
            options={hidereasons}
            onChange={newValue => {
              this.handleSelect(row.Id, "hideReasonId", newValue.value);
            }}
            value={hidereasons.find(opt => opt.value == row.dataField)}

          />
        ),
        editable: false,
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: hiddenGrades?.length || 0, // avoids crash if undefined
      custom: true,
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={this.props.t("hiddenGrades")} />
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
                    </div>
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={hiddenGrades}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={hiddenGrades}
                            columns={columns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                      {/*   {showSearchButton && ( */}
                                      <div className="position-relative">
                                        <SearchBar
                                          {...toolkitprops.searchProps}
                                          placeholder={t("Search...")}
                                        />
                                      </div>
                                    </div>
                                  </Col>
                                  {/*    {showAddButton && ( */}
                                  <Col sm="8">
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
                                  data={hiddenGrades || []}
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
                                      this.handlehiddenGradeDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No hiddenGrades found"
                                  )}
                                  defaultSorted={defaultSorting}
                                  filter={filterFactory()}
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

const mapStateToProps = ({ hiddenGrades, menu_items ,classScheduling}) => ({
  hiddenGrades: hiddenGrades.hiddenGrades,
  coursesOffering:classScheduling.coursesOffering,

  

  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetHiddenGrades: () => dispatch(getHiddenGrades()),
  onAddNewHiddenGrade: hiddenGrade => dispatch(addNewHiddenGrade(hiddenGrade)),
  onUpdateHiddenGrade: hiddenGrade => dispatch(updateHiddenGrade(hiddenGrade)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(HiddenGradesList));
