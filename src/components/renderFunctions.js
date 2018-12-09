import React from 'react';

export function MemberInfo({member, renderAddress}) {
    let {name, memberNumber, address} = member;
    function renderAddressExists() {
        return typeof renderAddress === 'function';
    }
    return (
        <div className="title">
            <p>Name: {name}</p>
            <p>Member #: {memberNumber}</p>
            {renderAddressExists() && renderAddress(address)}
        </div>
    );
}

export function renderAddress(address) {
    return Object.keys(address).map((k) => {
        return (
            <p key={k}>
                {k + ': ' + address[k]}
            </p>
        );
    });
}

export const member = {
    name: 'Dave Jones',
    memberNumber: '12345678',
    address: {
        street: '123 elm st.',
        city: 'long beach',
        state: 'ca',
        zipCode: 90211
    }
}