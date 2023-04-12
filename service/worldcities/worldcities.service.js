const getService = (callBack) => {
    import('node:fs').then((fs) =>{
        fs.readFile(process.cwd() + '/service/worldcities/worldcities.json', 'utf8', (error, fileBuffer) => {
            if (error)
                callBack(error,null);
            else
                callBack(null,fileBuffer.toString());
        });
    })
}
export{getService};