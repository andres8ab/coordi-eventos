import countries from 'world-countries'

const countiesFormatted = countries.map((item) => ({
  value: item.cca2,
  label: item.name.common,
  flag: item.flag,
  latLang: item.latlng,
  region: item.region,
}))

export const useCountries = () => {
  const getAllCountries = () => countiesFormatted

  const getCountriesByValue = (value: string) => {
    return countiesFormatted.find((item) => item.value === value)
  }
  return {
    getAllCountries,
    getCountriesByValue,
  }
}
