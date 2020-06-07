export const ROUTE = {
    signin: 'signin',
    signout: 'signout',
    register: 'register',
    home: ''
};

export const PARTICLESOPTIONS = {
    particles: {
        number: {
            value: 80,
            desnity: {
                enable: true,
                value_area: 800
            }
        }
    }
}

export const INITIALSTATE = {
    input: '',
    imageUrl: '',
    box: {},
    route: ROUTE.signin,
    isSignedIn: false,
    user: {
        id: '',
        email: '',
        name: '',
        entries: 0,
        joined: '',
    }
}