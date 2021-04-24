const baseURL = "/api";

async function isAuthenticated() {
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err; 
    }
}

async function getMapData(coord) {
    let url = "/map";
    const response = await fetch(baseURL + url + `?lat=${coord.lat}&lng=${coord.lng}`);
    const mapJson = await response.json();
    if (response.ok) {
        return mapJson;
    } else {
        let err = { status: response.status, errObj: mapJson };
        throw err;  // An object with the error coming from the server
    }
}


async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userSignup(username, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then(() => {
                    resolve();
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

async function getBicycles() {
    let url = "/bicycles";
    const response = await fetch(baseURL + url);
    const bicyclesJson = await response.json();
    if (response.ok) {
        return bicyclesJson;
    } else {
        let err = { status: response.status, errObj: bicyclesJson };
        throw err;  // An object with the error coming from the server
    }
}



const API = { isAuthenticated, userLogin, userLogout, getBicycles, getMapData, userSignup };
export default API;