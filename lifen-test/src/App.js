import React from 'react';
import './App.css';
import Dropzone from 'react-dropzone';

class App extends React.Component {
  state = {
    files: [],
    latestFileName: undefined,
    error: '',
    binaryCount: undefined
  };
  uploadFile = (file) => {
    fetch(
      'https://fhirtest.uhn.ca/baseDstu3/Binary',
      { method: 'POST', body: file }
    ).then(() => {
        this.setState((prevState) => ({ 
          files: prevState.files.concat(file),
          latestFileName: file[file.length - 1].name,
          error: ''
        }));
        this.setBinaryCount();
      }
    ).catch((error) => {
      this.setState(() => ({ 
        error: `Une erreur s'est produite. ${error}`,
        latestFileName: undefined
      }));
    });
  };
  setErrorMessage = (error) => {
    this.setState(() => ({ 
      latestFileName: '',
      error: error
    }));
  };
  setBinaryCount = () => {
    fetch(
      'http://hapi.fhir.org/baseR4/Binary/_history?_pretty=true&summary=count',
      { method: 'POST' }
    ).then((response) => {
      return response.json()
    }).then((data) => {
      this.setState(() => ({
        binaryCount: data.entry.length
      }));
    })
  };
  handleNewFile = (file) => {
    this.setState(() => ({
      latestFileName: undefined,
      binaryCount: undefined
    }));
    if (file.length === 1 && file[0].size < 2000000 && file[0].type === "application/pdf") {
      this.uploadFile(file);
    } else if (file.length > 1) {
      this.setErrorMessage('Vous ne pouvez sélectionner qu\'un seul document à la fois')
    } else if (file[0].size > 2000000) {
      this.setErrorMessage('Le document est trop volumineux. Veuillez télécharger un fichier de moins de 2Mo.')
    } else if (file[0].type !== "application/pdf") {
      this.setErrorMessage('Seuls les fichiers PDF sont pris en charge. Veuillez télécharger un fichier .pdf')
    };
  };
  render() {
      return (
      <div className="App">
        <h1><strong>Lifen Document Uploader</strong></h1>
        <Dropzone onDrop={e => this.handleNewFile(e)}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()} className="dragdrop">
                <input {...getInputProps()} />
                <p>Faites glisser un document médical ici</p>
              </div>
            </section>
          )}
        </Dropzone>
        <div>
          {this.state.latestFileName && <p className="success"><strong>{this.state.latestFileName}</strong> a été téléchargé. {this.state.binaryCount && <span><br/>Il y a actuellement {this.state.binaryCount} documents sur le serveur.</span>}</p>}
          {this.state.error && <p className="error">{this.state.error}</p>}
        </div>
      </div>   
    ) 
  }
};

export default App;