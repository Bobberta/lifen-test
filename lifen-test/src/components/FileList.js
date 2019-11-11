import React from 'react';
import FileListItem from './FileListItem';

const FileList = (props) => {
  const files = props.files || [];
  return (
    <div className="left-panel">
      <h3>Documents téléchargés</h3>
      {files.length === 0 ? (
        <div>Vous n'avez pas encore téléchargé de fichier.</div>
      ) : (
        files.map((file, index) => <FileListItem key={index} file={file} />)
      )}
    </div>
  );
};

export default FileList;
