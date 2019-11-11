import React, { useState, useEffect } from "react";
import "../App.css";
import fs from "fs";
import electron from "electron";
import chokidar from "chokidar";
import DropArea from "./DropArea";
import ErrorMessage from "./ErrorMessage";
import FileList from "./FileList";
import Header from "./Header";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [binaryCount, setBinaryCount] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fhirDirPath = `${(electron.app || electron.remote.app).getPath(
      "documents"
    )}/FHIR`;
    const checkForDirectory = path => {
      try {
        fs.mkdirSync(path, { recursive: true });
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
    };
    try {
      checkForDirectory(fhirDirPath);
    } catch (error) {
      console.log(error);
    }
    const watcher = chokidar.watch(`${fhirDirPath}/*.pdf`, {
      ignoreInitial: true,
      persistent: true
    });
    watcher.on("add", path => {
      fs.readFile(path, (err, data) => {
        console.log(data);
        const fileName = path.replace(`${fhirDirPath}/`, "");
        const file = [new File([data], fileName, { type: "application/pdf" })];
        handleNewFile(file);
      });
    });
    updateBinaryCount();
  }, []);

  const uploadFiles = async newFiles => {
    setIsLoading(true);
    const file = newFiles[0];
    try {
      await fetch("https://fhirtest.uhn.ca/baseDstu3/Binary", {
        method: "POST",
        body: file
      });
    } catch (err) {
      setError(`Une erreur s'est produite : ${err}`);
    }
    setIsLoading(false);
    setError("");
    setFiles(prevFiles => prevFiles.concat(file));
    updateBinaryCount();
  };

  const setErrorMessage = error => {
    setError(error);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  const updateBinaryCount = async () => {
    const response = await fetch(
      "https://fhirtest.uhn.ca/baseDstu3/Binary/_history?_pretty=true&summary=count",
      {
        method: "POST"
      }
    );
    const data = await response.json();
    setBinaryCount(data.total);
  };

  const handleNewFile = file => {
    if (
      file.length === 1 &&
      file[0].size < 2000000 &&
      file[0].type === "application/pdf"
    ) {
      uploadFiles(file);
    } else if (file.length > 1) {
      setErrorMessage(
        "Vous ne pouvez sélectionner qu'un seul document à la fois"
      );
    } else if (file[0].size > 2000000) {
      setErrorMessage(
        "Le document est trop volumineux. Veuillez télécharger un fichier de moins de 2Mo."
      );
    } else if (file[0].type !== "application/pdf") {
      setErrorMessage(
        "Seuls les fichiers PDF sont pris en charge. Veuillez télécharger un fichier .pdf"
      );
    }
  };

  return (
    <div className="App">
      <Header binaryCount={binaryCount} />
      <div className="content">
        <FileList files={files} />
        <DropArea handleNewFile={handleNewFile} />
      </div>
      <div className="notifications">
        {isLoading && "ça charge..."}
        <ErrorMessage error={error} />
      </div>
    </div>
  );
};

export default Dashboard;
