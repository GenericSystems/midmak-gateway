import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import {
  Table,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import { getFile } from "store/files/actions";

class RecentFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewFileModal: false,
      recentfile: [
        {
          id: 1,
          icon: "mdi mdi-file-document font-size-16 align-middle text-primary me-2",
          file: "index.html",
          date: "12-10-2020, 09:45",
          size: "09",
          showView: false,
        },
        {
          id: 2,
          icon: "mdi mdi-folder-zip font-size-16 align-middle text-warning me-2",
          file: "Project-A.zip",
          date: "11-10-2020, 17:05",
          size: "115",
          showView: false,
        },
        {
          id: 3,
          icon: "mdi mdi-image font-size-16 align-middle text-muted me-2",
          file: "keaton-alan-untitled-design-2.jpg",
          date: "11-10-2020, 13:26",
          size: "86",
          showView: false,
        },
        {
          id: 4,
          icon: "mdi mdi-text-box font-size-16 align-middle text-muted me-2",
          file: "update list.txt",
          date: "10-10-2020, 11:32",
          size: "08",
          showView: false,
        },
        {
          id: 5,
          icon: "mdi mdi-folder font-size-16 align-middle text-warning me-2",
          file: "Project B",
          date: "10-10-2020, 10:51",
          size: "72",
          showView: false,
        },
        {
          id: 6,
          icon: "mdi mdi-text-box font-size-16 align-middle text-muted me-2",
          file: "Changes list.txt",
          date: "09-10-2020, 17:05",
          size: "07",
          showView: false,
        },
        {
          id: 7,
          icon: "mdi mdi-image font-size-16 align-middle text-success me-2",
          file: "Img-2.png",
          date: "09-10-2020, 15:12",
          size: "31",
          showView: false,
        },
        {
          id: 8,
          icon: "mdi mdi-folder font-size-16 align-middle text-warning me-2",
          file: "Project C",
          date: "09-10-2020, 10:11",
          size: "20",
          showView: false,
        },
        {
          id: 9,
          icon: "bx bxs-file font-size-16 align-middle text-primary me-2",
          file: "starter-page.html",
          date: "08-10-2020, 03:22",
          size: "11",
          showView: false,
        },
      ],
    },
      this.toggle = this.toggle.bind(this);
  }
  
  componentDidMount() {
    const { file, onGetFile } = this.props;
    if (file && !file.length) {
      //  onGetFile();
    }
    this.setState({ file });
  }
  toggle() {
    this.setState(prevState => ({
      viewFileModal: !prevState.viewFileModal,
    }));
  }
  openFile = (event, fileName) => {
    const { onGetFile } = this.props;
    onGetFile(fileName);

    const updatedRecentFiles = this.state.recentfile.map(file =>
      file.file === fileName
        ? { ...file, showView: true }
        : { ...file, showView: false }
    );

    this.setState({ recentfile: updatedRecentFiles });
    event.preventDefault();
  };
  isSupportedFile = (url) => {
    if (!url) {
        return false;
    }
    const extension = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
    const supportedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "xlsx", "docx"];
    return supportedExtensions.includes(extension);
};
isOfficeDocument = (url) => {
  if (!url) {
      return false;
  }
  const extension = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
  const officeExtensions = ["xlsx", "docx"];
  return officeExtensions.includes(extension);
};
  render() {
    const { file } = this.props;

    const originalFileUrl = file && file[0] && file[0].url + "/" + file[0].fileName;  
    const isSupported = this.isSupportedFile(originalFileUrl);
    const fileUrl = isSupported && this.isOfficeDocument(originalFileUrl) ? 
    `https://view.officeapps.live.com/op/embed.aspx?src=${originalFileUrl}` : 
    originalFileUrl;
    this.props.takingUrl(fileUrl)
    //right under is a url for a word doc and an excel doc so you try it out big man
    // https://myrbs.business.rutgers.edu/sites/default/files/uploads/ugnb-students/resume-template.docx 
    // https://irp.cdn-website.com/7303afc2/files/uploaded/AUSTAGMP%20RESUME%20TEMPLATE-6b3b492f.xlsx
    

    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.viewFileModal}
          className={this.props.className}
          size="lg"
          
        >
          <ModalHeader toggle={this.toggle} tag="h4"></ModalHeader>
          <ModalBody className="preview-file-modal">
            {isSupported ? (
              this.isOfficeDocument(originalFileUrl) ? (
                <iframe src={fileUrl}></iframe>
              ) : (
                <img src={fileUrl} alt="Preview" />
              )
            ) : (
              <iframe src={fileUrl}></iframe>
            )}
          </ModalBody>
        </Modal>
        <div className="mt-4">
          <div className="d-flex flex-wrap">
            <h5 className="font-size-16 me-3">Recent Files</h5>

            <div className="ms-auto">
              <Link to="#" className="fw-medium text-reset">
                View All
              </Link>
            </div>
          </div>
          <hr className="mt-2" />

          <div className="table-responsive">
            <Table className="table align-middle table-nowrap table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Date modified</th>
                  <th scope="col" colSpan="2">
                    Size
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.recentfile.map((recentfile, key) => (
                  <tr key={key}>
                    <td>
                      <Link
                        to="#"
                        className="text-dark fw-medium"
                        onClick={e => this.openFile(e, recentfile.file)}
                      >
                        <i className={recentfile.icon}></i> {recentfile.file}
                      </Link>
                    </td>
                    <td>{recentfile.date}</td>
                    <td>{recentfile.size} KB</td>

                    <td>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="white"
                          className="font-size-16 text-muted dropdown-toggle"
                          tag="a"
                        >
                          <i className="mdi mdi-dots-horizontal"></i>
                        </DropdownToggle>

                        <DropdownMenu
                          direction="right"
                          className="dropdown-menu-end"
                        >
                          <Link
                            className="dropdown-item"
                            to="#"
                            onClick={e => this.openFile(e, recentfile.file)}
                          >
                            Open
                          </Link>
                          <Link className="dropdown-item" to="#">
                            Edit
                          </Link>
                          <Link className="dropdown-item" to="#">
                            Rename
                          </Link>
                          <div className="dropdown-divider"></div>
                          <Link className="dropdown-item" to="#">
                            Remove
                          </Link>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>

                    <td>
                      {file &&
                        file[0] &&
                        file[0].url != "" &&
                        recentfile.showView && (
                          <div>
                            <i
                              className="dripicons-preview"
                              onClick={this.toggle}
                            ></i>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

RecentFile.propTypes = {
  file: PropTypes.array,
  className: PropTypes.any,
  onGetFile: PropTypes.func,
};

const mapStateToProps = ({ file }) => ({
  file: file.file,
});

const mapDispatchToProps = dispatch => ({
  onGetFile: file => dispatch(getFile(file)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RecentFile));
