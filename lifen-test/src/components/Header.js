import React from 'react';

const Header = (props) => (
    <div className="header">
          <div className="title">
            <img src="./white-logo.png" alt="logo" className="logo"></img>
            <h1><strong>Lifen Document Uploader</strong></h1>
          </div> 
          {props.binaryCount && 
             <p className="file-count">{props.binaryCount} fichiers sur le serveur</p>
          }
    </div>
)

export default Header;