const https = await import('node:https');
const http = await import('node:http');
const url_request_get = async (protocol, url, authorization) =>{
    return new Promise ((resolve)=>{
        //implement CLIENT_ID and CLIENT_SECRET so microservice can only be called from server
        //and not directly from apps
        //all requests with authorization header
        // response can be HTML, PDF or JSON, let the app decide what to do with the response
        const options = {
            path: url,
            headers : {
                'Authorization': authorization
            }
        }
        if (protocol=='https')
            https.get(url, options, res =>{
                let responseBody = ''
                res.setEncoding('UTF8');
                res.on('data', (chunk) =>{
                    responseBody += chunk;
                })
                res.on('end', ()=>{
                    resolve (responseBody);
                });
            })
        else
            http.get(url, options, res =>{
                let responseBody = ''
                res.setEncoding('UTF8');
                res.on('data', (chunk) =>{
                    responseBody += chunk;
                })
                res.on('end', ()=>{
                    resolve (responseBody);
                });
            })
    })
}
const url_request_method = async (protocol, url, method, authorization, body) =>{
    return new Promise ((resolve)=>{
        //implement CLIENT_ID and CLIENT_SECRET so microservice can only be called from server
        //and not directly from apps
        //all requests with authorization header
        //POST, PUT, PATCH and DELETE always should use JSON in body
        //response should be JSON, return unparsed
        const options = {
            method: method,
            headers : {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(body),
                            'Authorization': authorization
                    }
        };
        let request;
        if (protocol=='https')
            request = https.request(url, options, res =>{
                let responseBody = '';
                res.setEncoding('UTF8');
                res.on('data', (chunk) =>{
                    responseBody += chunk;
                })
                res.on('end', ()=>{
                    resolve (responseBody);
                });
            })
        else
            request = http.request(url, options, res =>{
                let responseBody = '';
                res.setEncoding('UTF8');
                const body = []
                res.on('data', (chunk) =>{
                    responseBody += chunk;
                })
                res.on('end', ()=>{
                    resolve (responseBody);
                });
            })
        request.write(JSON.stringify(body));
        request.end();
    })
}
export {url_request_get, url_request_method};