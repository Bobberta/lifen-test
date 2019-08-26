import React from 'react';
import Dropzone from 'react-dropzone';
import { addDocument } from '../actions/documents';
import store from '../configureStore';
import { connect } from 'react-redux';



export class DropArea extends React.Component {
    handleOnDrop = (document) => {
        store.dispatch(addDocument(document));
        console.log(this.props.documents);
    };
    render(){
        return(
            <Dropzone onDrop={this.handleOnDrop}>
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Glissez/déposez un fichier ici</p>
                    </div>
                )}
            </Dropzone>
         );
    }     
};

const mapStateToProps = (state) => {
    return {
        documents: state.documents
    };
}

export default connect(mapStateToProps)(DropArea);
