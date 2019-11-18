import React, { useState, useEffect } from 'react';
import '../App.css';
import { GridLoader } from 'react-spinners';
import DropArea from './DropArea';
import ErrorMessage from './ErrorMessage';
import FileList from './FileList';
import Header from './Header';
import initializeWatcher from '../watcher';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [binaryCount, setBinaryCount] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    initializeWatcher(handleNewFile);
    updateBinaryCount();
    setHasLoaded(true);
  }, []);

  const uploadFiles = async (newFiles) => {
    setIsUploading(true);
    const file = newFiles[0];
    try {
      await fetch('https://fhirtest.uhn.ca/baseDstu3/Binary', {
        method: 'POST',
        body: file
      });
      setError('');
      setFiles((prevFiles) => prevFiles.concat(file));
      updateBinaryCount();
    } catch (err) {
      setError(`Une erreur s'est produite : ${err}`);
    }
    setIsUploading(false);
  };

  const setErrorMessage = (error) => {
    setError(error);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  const updateBinaryCount = async () => {
    const response = await fetch(
      'https://fhirtest.uhn.ca/baseDstu3/Binary/_history?_pretty=true&summary=count',
      {
        method: 'POST'
      }
    );
    const data = await response.json();
    setBinaryCount(data.total);
  };

  const handleNewFile = (file) => {
    if (file.length > 1) {
      setErrorMessage("Vous ne pouvez sélectionner qu'un seul document à la fois");
    } else if (file[0].size > 2000000) {
      setErrorMessage(
        'Le document est trop volumineux. Veuillez télécharger un fichier de moins de 2Mo.'
      );
    } else if (file[0].type !== 'application/pdf') {
      setErrorMessage(
        'Seuls les fichiers PDF sont pris en charge. Veuillez télécharger un fichier .pdf'
      );
    } else {
      uploadFiles(file);
    }
  };

  return !hasLoaded ? (
    <div className="loading-screen">
      <GridLoader loading={true} color={'#425ddd'} className="loading-animation" />
    </div>
  ) : (
    <div className="App">
      <Header binaryCount={binaryCount} />
      <div className="content">
        <FileList files={files} />
        <DropArea handleNewFile={handleNewFile} isLoading={isUploading} />
      </div>
      <div className="notifications">
        <ErrorMessage error={error} />
      </div>
    </div>
  );
};

export default Dashboard;
