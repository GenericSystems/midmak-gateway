// components/FileViewer.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchFile } from '../../store/_common/actions'; // adjust path
import { withTranslation } from "react-i18next";

class FileViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showViewer: true,
      fileId: props.fileId || null,
    };
    console.log(this.state)
    const { fileId, onFetchFile } = this.props;
    console.log(`fecthing file with ID: ${fileId}`, this.props);
  }

  componentDidMount() {
     console.log(this.state.currentYearObj, "gggg");
     const { dataUrl, mimeType } = this.props;
     console.log("Rendering content", dataUrl, mimeType);
     this.handleFetch();
  }


  handleFetch() {
    const { onFetchFile } = this.props;
    console.log("Calling with fileData", this.state.fileId, onFetchFile);
    onFetchFile(this.state.fileId);
  }



  componentDidUpdate(prevProps) {
    
      this.handleFetch(this.props.fileId);
    
  }

  renderContent() {
    const { dataUrl, mimeType } = this.props;
    console.log("Rendering content", dataUrl, mimeType);
    if (!dataUrl) this.handleFetch();

    if (mimeType.startsWith('image/')) {
      return <img src={dataUrl} alt="file" style={{ maxWidth: '100%' }} />;
    }

    if (mimeType === 'application/pdf') {
      return <iframe src={dataUrl} width="100%" height="600px" title="PDF Viewer" />;
    }

    return <p>Unsupported file type: {mimeType}</p>;
  }

  render() {
    const { loading, error, onClose } = this.props;
    console.log("Rendering FileViewer", this.props, this.state);
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <button onClick={onClose} style={styles.close}>×</button>
          {loading && <p>Loading file...</p>}
          {error && <p>Error: {error}</p>}
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    maxWidth: '90%',
    maxHeight: '90%',
    overflow: 'auto',
    position: 'relative',
  },
  close: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    fontSize: '1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

const mapStateToProps = (state) => ({
  loading: state.file.loading,
  error: state.file.error,
  dataUrl: state.file.dataUrl,
  mimeType: state.file.mimeType,
});


const mapDispatchToProps = dispatch => ({
  onFetchFile: fileId => dispatch(fetchFile(fileId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileViewer);
