import React from 'react';

const modalStyle = {
    width: '100%', 
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0, 
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
};
const modalInner = {
    width: '80%',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    margin: 'auto'
};

const buttonContainer = {
    textAlign: 'right'
};

const modalContent = {
    backgroundColor: '#fff',
    padding: '1em'
};

export default function Modal({isActive, children, closeSelf}) {

    
        if (isActive) {
            return (
                <div style={modalStyle} onClick={closeSelf}>
                    <div style={modalInner}>
                        <div style={buttonContainer}>
                            <button onClick={closeSelf}>X</button>
                        </div>
                        <div style={modalContent}>
                            {children}
                        </div>
                    </div>
                </div>
            );
        }
        return null;

}