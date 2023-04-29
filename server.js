const {serverStart} = await import(`file://${process.cwd()}/server/server.service.js`);
serverStart();