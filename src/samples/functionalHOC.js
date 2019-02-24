import React from 'react';

export default function withClass(props, WrappedComponent) {

    return () => {
        return (
            <div>
                <h1>Other stuff...</h1>
                <WrappedComponent {...props} />
            </div>
        );
    }

}

export function classyWithExtra(props) {

    return function (WrappedComponent) {

        return class extends React.Component {
            render() {
                return (
                    <div>
                        <p>Classy stuff...</p>
                        <WrappedComponent {...props} />
                    </div>
                );
            }
        }

    }
    
}