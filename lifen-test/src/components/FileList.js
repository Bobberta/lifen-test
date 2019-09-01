import React from 'react';
import FileListItem from './FileListItem';

const FileList = (props) => (
  <div>
        <h3>Documents téléchargés</h3>
        {props.binaryCount && <p>Il y a actuellement {props.binaryCount} documents sur le serveur.</p>}
        {props.files.length === 0 && 
            <div className="file-list-item">
                Vous n'avez pas encore téléchargé de fichier.
            </div>
        }  
        {props.files.map((file, index) => (
            <FileListItem 
                key={index}
                file={file}/>
        ))}
  </div>
);

export default FileList;