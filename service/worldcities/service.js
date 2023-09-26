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

const getCitySearch = async (search, limit) => {
    let cities = await getService();
    //parse to object
    cities = JSON.parse(cities);
    //filter searched 
    const match = (col, search) =>{
        //compare without diacritics and use lower case
        const col_check = col.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
        const search_check = search.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
        return col_check.search(search_check);
    };
    cities = cities.filter(city=>   match(city.city, search) >-1|| 
                                    match(city.city_ascii, search) > -1|| 
                                    match(city.country, search) > -1 ||
                                    match(city.admin_name, search) > -1);
    //sort
    cities = cities.sort((first, second)=>{
        const first_sort = first.country.toLowerCase() +  first.city.toLowerCase() + first.admin_name.toLowerCase();
        const second_sort = second.country.toLowerCase() + second.city.toLowerCase() + second.admin_name.toLowerCase();
        //using localeCompare as collation method
        if (first_sort.localeCompare(second_sort)<0 )
            return -1;
        else if (first_sort.localeCompare(second_sort)>0 )
            return 1;
        else
            return 0;
    });
    //limit records if used
    if (limit>0)
        cities = cities.filter((city, index)=>index<=limit);
    return cities;
};
export{getCities, getCityRandom, getCitySearch};