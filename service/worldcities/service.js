/*
    Database content:
        {
            "city":         [city with diacritics],
            "city_ascii":   [city_ascii],
            "lat":          [latitude],
            "lng":          [longitude],					
            "country":      [country],			
            "iso2":         [countrycode 2 letters],
            "iso3":         [countrycode 3 letters],
            "admin_name":   [admin name],
            "capital":      [admin, minor, primary, ''],
            "population":   [count],
            "id":           [id]
		} 
*/
const getService = async () => {
    const fs = await import('node:fs');
    const fileBuffer = await fs.promises.readFile(process.cwd() + '/service/worldcities/worldcities.json', 'utf8')
    .catch(error=>{throw error;});
    return fileBuffer.toString();
};
const getCities = async (country) => {
    const  cities = await getService();
    return JSON.parse(cities).filter((item) => item.iso2 == country);
};
const getCityRandom = async () => {
    let cities = await getService();
    cities = JSON.parse(cities);
    return cities[Math.floor(Math.random() * cities.length - 1)];
};

export{getCities, getCityRandom};