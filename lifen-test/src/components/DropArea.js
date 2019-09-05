import React from 'react';
import Dropzone from 'react-dropzone';

const DropArea = (props) => (
    <Dropzone onDrop={e => props.handleNewFile(e)}>
        {({getRootProps, getInputProps}) => (
            <section>
                <div {...getRootProps()} className="dragdrop">
                    <input {...getInputProps()} />
                    <img src="./medical-fee.png" className="drag-illustration"></img>
                    <p>Faites glisser un document médical ici</p>
                    <p className="muted">ou placez-le dans le dossier Documents/FHIR</p>
                </div>
            </section>
        )}
    </Dropzone>
);

export default DropArea;