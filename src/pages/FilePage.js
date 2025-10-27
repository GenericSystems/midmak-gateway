// pages/FilePage.js
import React, { Component } from 'react';
import FileViewer from '../components/FileView/FileViewer';

class FilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showViewer: true,
      fileId: props.fileId || null,
    };
  }

  openViewer = (fileId) => {
    console.log("Opening viewer for fileId:", this.state);
    this.setState({ fileId: fileId, showViewer: true });
  };

  closeViewer = () => {
    this.setState({ showViewer: false });
  };

  render() {
    const { showViewer, selectedFileId } = this.state;

    return (
      <div style={{ padding: '2rem' }}>
        <h2>{this.fileId}</h2>
        <button onClick={() => this.openViewer(this.fileId)}>View {this.fileId}</button>
        <button onClick={() => this.openViewer('manual.pdf')} style={{ marginLeft: '1rem' }}>
          View manual.pdf
        </button>

        {showViewer && (
          <FileViewer fileId={this.state.fileId} onClose={this.closeViewer} />
        )}
      </div>
    );
  }
}

export default FilePage;
