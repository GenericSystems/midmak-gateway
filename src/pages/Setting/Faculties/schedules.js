import React, { Component } from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
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
  Input,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Breadcrumbs from "components/Common/Breadcrumb";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import {
  getSchedules,
  addNewSchedule,
  updateSchedule,
  deleteSchedule,
} from "store/schedules/actions";

import Editable from "react-bootstrap-editable";
import { isEmpty, size, map } from "lodash";
import { checkIsEditForPage } from "../../../utils/menuUtils";
const SCHEDULE_STORAGE_KEY = "editableSchedule";

class Schedules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: [],
      schedule: "",
      theoreticalStdNum: "hiii",
      showEditButton: false,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount(e) {
    const { schedules, onGetSchedules, user_menu } = this.props;
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (schedules && !schedules.length) {
      onGetSchedules();
    }
    this.setState();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
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

  handleScheduleDataChange = (fieldName, fieldValue) => {
    const { onUpdateSchedule } = this.props;
    let onUpdate = { Id: 1, [fieldName]: fieldValue };
    onUpdateSchedule(onUpdate);
  };

  render() {
    const { schedules, user_menu } = this.props;
    const { SearchBar } = Search;
    const { showEditButton } = this.state;

    /** Confirm button */
    const confirmElement = (
      <button
        type="submit"
        className="btn btn-success editable-submit btn-sm me-1"
      >
        <i className="mdi mdi-check"></i>
      </button>
    );

    /** Cancel button */
    const cancelElement = (
      <button type="button" className="btn btn-danger editable-cancel btn-sm">
        <i className="mdi mdi-close"></i>
      </button>
    );

    return (
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={this.props.t("Schedules")}
              breadcrumbItem={this.props.t("Schedules")}
            />

            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Row>
                        <Col>
                          <Label>Id</Label>
                        </Col>
                        <Col className="col-md-4">
                          <Label>
                            {this.props.t("The Number of Theoretical Students")}
                          </Label>
                        </Col>
                        <Col className="col-md-4">
                          <Editable
                            name="theoreticalStdNum"
                            ajax={null}
                            alwaysEditing={false}
                            className={null}
                            disabled={!showEditButton}
                            id="theoreticalStdNum"
                            isValueClickable={false}
                            mode="inline"
                            onSubmit={newValue => {
                              this.handleScheduleDataChange(
                                "theoreticalStdNum",
                                newValue
                              );
                            }}
                            onValidated={null}
                            placement="top"
                            renderConfirmElement={confirmElement}
                            renderCancelElement={cancelElement}
                            showText
                            type="textfield"
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="mb-3">
                      <Row>
                        <Col>
                          <Label>1</Label>
                        </Col>
                        <Col className="col-md-4">
                          <Label>
                            {this.props.t("The Number of Practical Students")}
                          </Label>
                        </Col>
                        <Col className="col-md-4">
                          <Editable
                            name="practicalStdNum"
                            ajax={null}
                            alwaysEditing={false}
                            className={null}
                            disabled={!showEditButton}
                            id="practicalStdNum"
                            isValueClickable={false}
                            mode="inline"
                            onSubmit={newValue => {
                              this.handleScheduleDataChange(
                                "practicalStdNum",
                                newValue
                              );
                            }}
                            onValidated={null}
                            placement="top"
                            renderConfirmElement={confirmElement}
                            renderCancelElement={cancelElement}
                            showText
                            type="textfield"
                          />
                        </Col>
                      </Row>
                    </div>
                    <div className="mb-3">
                      <Row>
                        <Col>
                          <Label>Id</Label>
                        </Col>
                        <Col className="col-md-4">
                          <Label>
                            {this.props.t("The Number of Clinical Students")}
                          </Label>
                        </Col>
                        <Col className="col-md-4">
                          <Editable
                            name="clinicalStdNum"
                            ajax={null}
                            alwaysEditing={false}
                            className={null}
                            disabled={!showEditButton}
                            id="clinicalStdNum"
                            isValueClickable={false}
                            mode="inline"
                            onSubmit={newValue => {
                              this.handleScheduleDataChange(
                                "clinicalStdNum",
                                newValue
                              );
                            }}
                            onValidated={null}
                            placement="top"
                            renderConfirmElement={confirmElement}
                            renderCancelElement={cancelElement}
                            showText
                            type="textfield"
                          />
                        </Col>
                      </Row>
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

const mapStateToProps = ({ schedules, menu_items }) => ({
  schedules: schedules.schedules,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetSchedules: () => dispatch(getSchedules()),
  onAddNewSchedule: schedule => dispatch(addNewSchedule(schedule)),
  onUpdateSchedule: schedule => dispatch(updateSchedule(schedule)),
  onDeleteSchedule: schedule => dispatch(deleteSchedule(schedule)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Schedules));
