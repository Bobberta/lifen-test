import React from 'react';
import '../App.css'; 
import fs from 'fs';
import electron from 'electron';
import chokidar from 'chokidar';
import DropArea from './DropArea';
import ErrorMessage from './ErrorMessage';
import FileList from './FileList';


class Dashboard extends React.Component {
  state = {
    files: [],
    latestFileName: undefined,
    error: '',
    binaryCount: undefined
  };
  componentDidMount() {
    // Create /FHIR directory if it doesn't exist
    const fhirDirPath = `${(electron.app || electron.remote.app).getPath('documents')}/FHIR`;
    const checkForDirectory = (path) => {
      try {
        fs.mkdirSync(path, { recursive: true })
      } catch (error) {
        if (error.code !== 'EEXIST') throw error
      }
    };
    try {
      checkForDirectory(fhirDirPath)
    } catch (error) {
      console.log(error) 
    };
    // Initialize file watcher
    const watcher = chokidar.watch(`${fhirDirPath}/*.pdf`, {
      ignoreInitial: true,
      persistent: true
    });
    watcher
      .on('add', (path) => {
        fs.readFile(path,  (err, data) => {
          const fileName = path.replace(`${fhirDirPath}/`, '');
          const file = [new File([data], fileName, {type: "application/pdf"})];
          this.handleNewFile(file);
        })
      });
    // Display count of files on the server
    this.setBinaryCount();
  };

  uploadFile = (file) => {
    fetch(
      'https://fhirtest.uhn.ca/baseDstu3/Binary',
      { method: 'POST', body: file }
    ).then((response) => {
        console.log(response);
        this.setState((prevState) => ({ 
          files: prevState.files.concat(file),
          latestFileName: file[file.length - 1].name,
          error: ''
        }));

        this.setBinaryCount();
      }
    ).catch((error) => {
      this.setState(() => ({ 
        error: `Une erreur s'est produite : ${error}`,
        latestFileName: undefined
      }));
    });
  };

  setErrorMessage = (error) => {
    this.setState(() => ({ 
      latestFileName: '',
      error: error
    }));
    setTimeout(() => {
      this.setState(() => ({
        error: undefined
      }));
    }, 5000);
  };

  setBinaryCount = () => {
    fetch(
      'http://hapi.fhir.org/baseR4/Binary/_history?_pretty=true&summary=count',
      { method: 'POST' }
    ).then((response) => {
      return response.json()
    }).then((data) => {
      this.setState(() => ({ binaryCount: data.entry.length}));
      console.log(data);
    })
  };

  handleNewFile = (file) => {
    this.setState(() => ({
      latestFileName: undefined,
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
        <div className="header">
          <div className="title">
            <img src="./white-logo.png" alt="logo" className="logo"></img>
            <h1><strong>Lifen Document Uploader</strong></h1>
          </div> 
          {this.state.binaryCount && <p className="file-count">Files on the server: {this.state.binaryCount}</p>}

        </div>
        <div className="content">
          <div className="left-panel">
            <FileList 
              files={this.state.files}
              binaryCount={this.state.binaryCount}
            />
          </div>
          <div className="right-panel">
            <DropArea 
            handleNewFile={this.handleNewFile}
            />
          </div>
          <div className="notifications">
            <ErrorMessage error={this.state.error}/>
          </div>
        </div> 
      </div>   
    ) 
  }
};

export default Dashboard;