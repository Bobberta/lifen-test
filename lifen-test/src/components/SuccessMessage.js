import React from 'react';

const SuccessMessage = (props) => (
    <div>
        {props.latestFileName &&
            <div className="success">
                <p><strong>{props.latestFileName}</strong> a été téléchargé. </p>
            </div>
        }
    </div>
)

export default SuccessMessage;