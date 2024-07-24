import React, { Component } from "react";
import { Row, Col, Card, Alert, CardBody, Input, Button } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Select from "react-select";
import Tooltip from "@mui/material/Tooltip";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import {
  getCurrSemMans,
  addNewCurrSemMan,
  updateCurrSemMan,
  deleteCurrSemMan,
} from "store/current-sem-man/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
const LECTURE_PERIOD_STORAGE_KEY = "editableCurrSemMan";
import { Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import { checkIsEditForPage } from "../../../utils/menuUtils";
class CurrSemMansList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSemester: "",
      inputFocused: false,
      showButtons: false,
      showEditButton: false,
    };
  }
  componentDidMount() {
    const { currSemMans, onGetCurrSemMans, user_menu } = this.props;
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (currSemMans && !currSemMans.length) {
      onGetCurrSemMans();
      this.setState({ currSemMans });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currSemMans !== this.props.currSemMans) {
      this.initializeState();
    }
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updateShowEditButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  initializeState() {
    const { currSemMans, yearSemesters } = this.props;

    if (currSemMans && currSemMans.length > 0) {
      const { cuYearSemesterId } = currSemMans[0];
      const matchingYear = yearSemesters.find(
        year => year.key === cuYearSemesterId
      ).value;

      this.setState({
        currentSemester: matchingYear,
        showButtons: false,
      });
    }
  }
  handleInputChange = event => {
    this.setState({ currentSemester: event.target.value });
  };
  handleClearInput = () => {
    this.setState({ currentSemester: "" });
  };

  handleInputBlur = () => {
    setTimeout(() => {
      const { showButtons } = this.state;

      this.setState({ showButtons: false });
    }, 200);
  };

  handleInputFocus = () => {
    const { showButtons } = this.state;

    this.setState({ showButtons: true });
  };

  handleSuccess = () => {
    const { currentSemester } = this.state;
    const { onUpdateCurrSemMan, yearSemesters } = this.props;
    const matchingYearString = yearSemesters.find(
      year => year.value === currentSemester
    );
    let obj = {
      Id: 1,
      cuYearSemesterId: matchingYearString.key,
      cuYearId: matchingYearString.yearId,
    };
    onUpdateCurrSemMan(obj);
  };

  render() {
    const { t, yearSemesters } = this.props;
    const { showButtons, currentSemester, showEditButton } = this.state;

    return (
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={t("Current Semester")}
              breadcrumbItem={t("Current Semester List")}
            />

            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <div className="form-group mb-3 row align-items-center">
                      <label
                        htmlFor="currentSemester"
                        className="col-md-2 col-form-label"
                      >
                        {t("Current Semester")}:
                      </label>
                      <div className="col-md-4">
                        {/* Input field */}
                        <div className="input-group">
                          <Input
                            type="text"
                            id="currentSemester"
                            list="datalistOptions9"
                            className="form-control"
                            value={currentSemester}
                            onChange={event => this.handleInputChange(event)}
                            onFocus={this.handleInputFocus}
                            onBlur={this.handleInputBlur}
                            autoComplete="off"
                            disabled={!showEditButton}
                          />
                          <datalist id="datalistOptions9">
                            {yearSemesters.map(yearsem => (
                              <option key={yearsem.key} value={yearsem.value} />
                            ))}
                          </datalist>
                          {showButtons && (
                            <div className="input-group-append d-flex align-items-center">
                              <Button
                                color="success"
                                size="sm"
                                id="sucBut"
                                onClick={this.handleSuccess}
                              >
                                &#10004; {/* Checkmark */}
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={this.handleClearInput}
                              >
                                &#10006; {/* X mark */}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
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

const mapStateToProps = ({
  currSemMans,
  mobAppFacultyAccs,
  generalManagements,
  menu_items,
}) => ({
  currSemMans: currSemMans.currSemMans,
  faculties: mobAppFacultyAccs.faculties,
  yearSemesters: generalManagements.yearSemesters,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCurrSemMans: () => dispatch(getCurrSemMans()),
  onAddNewCurrSemMan: currSemMan => dispatch(addNewCurrSemMan(currSemMan)),
  onUpdateCurrSemMan: currSemMan => dispatch(updateCurrSemMan(currSemMan)),
  onDeleteCurrSemMan: currSemMan => dispatch(deleteCurrSemMan(currSemMan)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CurrSemMansList));
