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
      fetch(
        'https://fhirtest.uhn.ca/baseDstu3/Binary',
        { method: 'POST', body: file }
      ).then((response) => {
        if(response.ok) {
        this.setState((prevState) => ({ 
          files: prevState.files.concat(file),
          latestFileName: file[file.length - 1].name,
          error: ''
        }));
        } else {
          this.setState(() => ({ 
            error: 'Une erreur s\'est produite. Veuillez réessayer dans quelques instants.',
            latestFileName: undefined
          }));
        }
      }).catch((error) => {
        this.setState(() => ({ 
          error: `Une erreur s'est produite. ${error}`,
          latestFileName: undefined
        }));
      });
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
          {this.state.latestFileName && <p className="success"><strong>{this.state.latestFileName}</strong> a été téléchargé.</p>}
          {this.state.error && <p className="error">{this.state.error}</p>}
        </div>
      </div>   
    ) 
  }
};

export default App;
