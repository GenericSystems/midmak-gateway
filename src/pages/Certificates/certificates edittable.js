import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Card, CardBody, Col, Container, Row, Button, Modal, ModalHeader, ModalBody, Label } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import Breadcrumbs from "components/Common/Breadcrumb";

import { getCertificates, addNewCertificate, updateCertificate, deleteCertificate } from "store/certificates/actions";

import { isEmpty, size, map } from "lodash";

const CERTIFICATE_STORAGE_KEY = "editableCertificate";

class CertificatesList1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certificates: [],
      certificate: "",
    };
  }

  componentDidMount() {
    const { certificates, onGetCertificates } = this.props;
    if (certificates && !certificates.length) {
      onGetCertificates();
    }
    this.setState({ certificates });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { certificates } = this.props;
  }

  handleAddRow = () => {
    const newId = -Math.max(...this.state.certificates.map((certificate) => certificate.Id), 0) + 1;
    const newRow = {
      arcertificate: "",
      encertificate: "",
    };
    const { onAddNewCertificate } = this.props;
    onAddNewCertificate(newRow);
  };

  handleDeleteRow = (rowId) => {
    const { onDeleteCertificate } = this.props;
    let obDelete = { Id: rowId };
    onDeleteCertificate(obDelete);
  };

  handleCertificateDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateCertificate } = this.props;
    let obUpdate = { Id: rowId, [fieldName]: fieldValue };
    onUpdateCertificate(obUpdate);
  };

  render() {
    const { certificates } = this.props;
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      { dataField: "artitle", text: this.props.t("Certificate(ar)") },
      { dataField: "entitle", text:"Certificate"},
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, certificate) => (
          <IconButton color="secondary" onClick={() => this.handleDeleteRow(certificate.Id)}>
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        ),
      },
    ];

    const addButtonStyle = {
      backgroundColor: "#75dfd1",
      color: "#ffffff",
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs title={this.props.t("Certificates")} breadcrumbItem={this.props.t("Certificates List")} />

            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <IconButton style={addButtonStyle} onClick={this.handleAddRow}>
                        <AddIcon />
                      </IconButton>
                      <br />
                      <br />
                      <BootstrapTable
                        keyField="Id"
                        data={certificates}
                        columns={columns}
                        cellEdit={cellEditFactory({
                          mode: "click",
                          blurToSave: true,
                          afterSaveCell: (oldValue, newValue, row, column) => {
                            this.handleCertificateDataChange(row.Id, column.dataField, newValue);
                          },
                        })}
                        noDataIndication={this.props.t("No Certificates found")}
                      />
                    </div>
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

const mapStateToProps = ({ config }) => ({
  certificates: config.certificates,
});


const mapDispatchToProps = (dispatch) => ({
  onGetCertificates: () => dispatch(getCertificates()),
  onAddNewCertificate: (certificate) => dispatch(addNewCertificate(certificate)),
  onUpdateCertificate: (certificate) => dispatch(updateCertificate(certificate)),
  onDeleteCertificate: (certificate) => dispatch(deleteCertificate(certificate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CertificatesList1));
