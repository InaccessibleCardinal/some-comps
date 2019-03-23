import React from 'react';
import Modal from './Modal';

export default class AppWithModal extends React.Component {

    state = {showModal: true};

    closeModal = (e) => {
        console.log('e.target.id: ', e.target)
        if (e.target.id !== 'my-modal') {
            this.setState({showModal: false});
        }
        return false;
    }

    openModal = () => {
        this.setState({showModal: true});
    }

    render() {
        return (
            <div>
                <button onClick={this.openModal}>Show Modal</button>
                <Modal 
                    isActive={this.state.showModal} 
                    closeSelf={this.closeModal}
                    contentContainerId={'my-modal'}
                >
                    <Text />
                </Modal>
            </div>
        );

    }
}

function Text(props) {
    return (
        <div>
            <h1>Testing</h1>
            <p>Some paragraph text in the modal.</p>
        </div>
    );
}