import React from 'react';
import Dropzone from 'react-dropzone';
import { BarLoader } from 'react-spinners';

const DropArea = (props) => {
  const notLoadingComponent = (
    <div>
      <img src="./medical-fee.png" alt="illustration" className="drag-illustration"></img>
      <p>Faites glisser un document médical ici</p>
      <p className="muted">ou placez-le dans le dossier Documents/FHIR</p>
    </div>
  );
  const loadingComponent = (
    <div>
      <BarLoader loading={true} color={'#4255dd'} sizeUnit={'%'} size={100} />{' '}
      <p>Upload en cours...</p>
      <p className="muted">Le document va être envoyé vers le serveur</p>
    </div>
  );
  return (
    <div className="right-panel">
      <Dropzone onDrop={(e) => props.handleNewFile(e)}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dragdrop">
            <input {...getInputProps()} />
            {!!props.isLoading ? loadingComponent : notLoadingComponent}
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default DropArea;
