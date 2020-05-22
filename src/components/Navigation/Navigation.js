import React from 'react';
import { ROUTE } from '../../constants'


const Navigation = ({ onRouteChange, isSignedIn }) => {
    if (isSignedIn) {
        return (<nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <p onClick={() => onRouteChange(ROUTE.signout)} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
        </nav>
        )
    }
    else {
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p onClick={() => onRouteChange(ROUTE.signin)} className='f3 link dim black underline pa3 pointer'>Sign In</p>
                <p onClick={() => onRouteChange(ROUTE.register)} className='f3 link dim black underline pa3 pointer'>Register</p>
            </nav>
        )
    }
}

export default Navigation;