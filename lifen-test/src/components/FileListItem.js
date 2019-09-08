import React from 'react';


const FileListItem = (props) => (
    <div className="file-list-item">
        <p className="file-list-item-name">{props.file.name}</p>
        <p>{`${Number(props.file.size / 1000).toFixed(1)}Ko`}</p>
    </div>
);

export default FileListItem;