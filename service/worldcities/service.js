const getService = async (country,callBack) => {
    import('node:fs').then((fs) =>{
        fs.readFile(process.cwd() + '/service/worldcities/worldcities.json', 'utf8', (error, fileBuffer) => {
            if (error)
                callBack(error,null);
            else{
                callBack(null,JSON.parse(fileBuffer.toString()).filter((item) => item.iso2 == country));
            }
        });
    });
};
export{getService};