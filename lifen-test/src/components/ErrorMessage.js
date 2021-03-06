import React from 'react';

const ErrorMessage = (props) => (
    <div>
        {props.error && 
            <div className="error" id="error">
                <p>{props.error}</p>
            </div>
        }
    </div> 
)

export default ErrorMessage;