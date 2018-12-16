function haxiosMaker() {
    function makeRequest(config) {
        let {method, url, body} = config;
        return new Promise((resolve, reject) => {
            let x = new XMLHttpRequest();
            x.open(method, url);
            x.onreadystatechange = () => {
                if (x.readyState === 4) {
                    if (x.status < 399) {
                        let d = JSON.parse(x.responseText);
                        resolve({data: d});
                    } else {
                        let e = {
                            message: `Request failed with status: ${x.status}`,
                            responseHeaders: x.getAllResponseHeaders() 
                        };
                        reject(e);
                    }
                    
                }
            }
            
            if (typeof body !== 'undefined') {
                x.send(body);
            } else {
                x.send();
            }
        }); 
    }

    return {
        get: function(url) {
            let config = {url, method: 'GET'};
            return makeRequest(config);
        },
        post: function(url, body) {
            let config = {url, body, method: 'POST'};
            return makeRequest(config);
        }
    };
}

const haxios = haxiosMaker();
export default haxios;