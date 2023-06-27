const service = await import('./service.js');
const fs = await import('node:fs');
const https = await import('node:https');
const {MICROSERVICE} = await import(`file://${process.cwd()}/service/service.service.js`);

const startserver = () =>{
	let options;
	fs.readFile(process.cwd() + MICROSERVICE.filter(row=>row.SERVICE=='BATCH')[0].HTTPS_KEY, 'utf8', (error, fileBuffer) => {
		const env_key = fileBuffer.toString();
		fs.readFile(process.cwd() + MICROSERVICE.filter(row=>row.SERVICE=='BATCH')[0].HTTPS_CERT, 'utf8', (error, fileBuffer) => {
			const env_cert = fileBuffer.toString();
			options = {
				key: env_key,
				cert: env_cert
			};
			https.createServer(options, (req, res) => {
				req.query = {};
				req.params = {};
				res.setHeader('Access-Control-Allow-Methods', 'GET');
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Content-Type',  'application/json; charset=utf-8');
				
			}).listen(MICROSERVICE.filter(row=>row.SERVICE=='BATCH')[0].PORT, ()=>{
				console.log(`MICROSERVICE BATCH PORT ${MICROSERVICE.filter(row=>row.SERVICE=='BATCH')[0].PORT} `);
			});
			service.start_jobs();
			process.on('uncaughtException', (err) =>{
				console.log(err);
			});
		});
	});
};
startserver();
export {startserver};