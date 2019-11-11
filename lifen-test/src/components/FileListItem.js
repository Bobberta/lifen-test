import React from 'react';

const FileListItem = (props) => {
  const { size, name } = props.file;
  const fileSize = Number(size / 1000).toFixed(1);
  return (
    <div className="file-list-item">
      <p className="file-list-item-name">{name}</p>
      <p>{`${fileSize}Ko`}</p>
    </div>
  );
};

export default FileListItem;
