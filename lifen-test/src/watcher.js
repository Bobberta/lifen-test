import fs from 'fs';
import electron from 'electron';
import chokidar from 'chokidar';

const initializeWatcher = (cb) => {
  const fhirDirPath = `${(electron.app || electron.remote.app).getPath('documents')}/FHIR`;
  const checkForDirectory = (path) => {
    try {
      fs.mkdirSync(path, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
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
  watcher.on('add', (path) => {
    fs.readFile(path, (err, data) => {
      const fileName = path.replace(`${fhirDirPath}/`, '');
      const file = [new File([data], fileName, { type: 'application/pdf' })];
      cb(file);
    });
  });
};

export default initializeWatcher;
