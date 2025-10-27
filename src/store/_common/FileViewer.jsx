import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFile } from './actions';

function FileViewer({ fileId }) {
  const dispatch = useDispatch();
  const { dataUrl, mimeType, loading, error } = useSelector(state => state.file);

  useEffect(() => {
    dispatch(fetchFile(fileId));
  }, [dispatch, fileId]);

  if (loading) return <p>Loading file...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!dataUrl) return null;

  if (mimeType.startsWith('image/')) {
    return <img src={dataUrl} alt="Fetched file" style={{ maxWidth: '100%' }} />;
  }

  if (mimeType === 'application/pdf') {
    return <iframe src={dataUrl} width="100%" height="600px" title="PDF Viewer" />;
  }

  return <p>Unsupported file type: {mimeType}</p>;
}

export default FileViewer;