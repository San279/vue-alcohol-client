export default class api {
    constructor() {
        this.baseUrl = "http://localhost:6777/mock/api";
    }

    async get(endpoint, data, params = {}) {
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        const token = localStorage.getItem("token");
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token' : token
            },
            body: JSON.stringify(data),

        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(`${response.status} ${response.statusText}: ${err.message || 'API Error'}`); }); // improved error handling
                }
                return response.json();
            });
    }

    async post(endpoint, data, params = {}) {
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        const token = localStorage.getItem("token");
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token' : token
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(`${response.status} ${response.statusText}: ${err.message || 'API Error'}`); }); // improved error handling
                }
                return response.json();
            });
    }


    async put(endpoint, data, params = {}) {  // Example PUT method
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        const token = localStorage.getItem("token");
        return fetch(url, {
            
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token' : token
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(`${response.status} ${response.statusText}: ${err.message || 'API Error'}`); }); // improved error handling
                }
                return response.json();
            });
    }

    async delete(endpoint, data, params = {}) { // Example DELETE method
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        const token = localStorage.getItem("token");
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token' : token
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(`${response.status} ${response.statusText}: ${err.message || 'API Error'}`); }); // improved error handling
                }
                return response.json();
            });
    }
}
