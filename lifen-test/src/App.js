import React from 'react';
import './App.css';
import Dropzone from 'react-dropzone';

class App extends React.Component {
  state = {
    files: [],
    latestFileName: undefined,
    error: ''
  };
  handleOnDrop = (file) => {

    if (file.length === 1) {
      this.setState((prevState) => ({ 
        files: prevState.files.concat(file),
        latestFileName: file[file.length - 1].name,
        error: ''
      }));
    } else {
      this.setState(() => ({ 
        latestFileName: '',
        error: 'Vous ne pouvez sélectionner qu\'un seul document à la fois'
      }));
    };
  };
  render() {
      return (
      <div className="App">
        <h1><strong>Lifen Document Uploader</strong></h1>
        <Dropzone onDrop={e => this.handleOnDrop(e)} multiple={false}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()} className="dragdrop">
                <input {...getInputProps()} />
                <p>Faire glisser un document médical</p>
              </div>
            </section>
          )}
        </Dropzone>
        <div>
          {this.state.latestFileName && <p class="success"><strong>{this.state.latestFileName}</strong> a été téléchargé.</p>}
          {this.state.error && <p class="error">{this.state.error}</p>}
        </div>
      </div>   
    ) 
  }
};

export default App;
