import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, Modal, ModalBody, Row } from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";
import csvImage from "../../../src/assets/images/csv.png";


class FileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.props.show} toggle={this.props.onCloseClick} centered={true}>
          <ModalBody className="py-3 px-5">
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <i
                    className="mdi mdi-alert-circle-outline"
                    style={{ fontSize: "9em", color: "orange" }}
                  />
                  <h2>{this.props.t("Please Note")}</h2>
                  <img src={csvImage} alt="CSV Format Note" style={{ width: "80%", maxWidth: "400px" }} />

                 
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-center mt-3">
                  <label
                    htmlFor="file-input"
                    className="btn btn-success btn-lg me-2"
                    style={{ cursor: "pointer" }}
                  >
                    {this.props.t("Choose CSV file")}
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={this.props.onChooseFile}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-lg me-2"
                    onClick={this.props.onCloseClick}
                  >
                    {this.props.t("Cancel")}
                  </button>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

FileModal.propTypes = {
  onCloseClick: PropTypes.func,
  onChooseFile: PropTypes.func,
  show: PropTypes.any,
};

export default withTranslation()(FileModal);
