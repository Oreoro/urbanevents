export const currencies = {
    "Pakistani Rupee": "PKR",
   
}

export const currenciesMap = Object.entries(currencies).map(([k, v]) => {
    //todo - return long currency name
    return {
        value: v,
        label: k,
    }
});