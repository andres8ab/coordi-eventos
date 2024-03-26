'use client'

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useCountries } from '../lib/getCountries'
import { icon } from 'leaflet'

const ICON = icon({
  iconUrl:
    'https://freepngimg.com/download/icon/map/66932-openstreetmap-map-google-icons-maps-computer-marker.png',
  iconSize: [40, 40],
})

export default function Map({ locationValue }: { locationValue: string }) {
  const { getCountriesByValue } = useCountries()
  const latLang = getCountriesByValue(locationValue)?.latLang
  return (
    <MapContainer
      scrollWheelZoom={false}
      className="h-[50vh] rounded-lg relative z-0"
      center={latLang ?? [52.505, -0.09]}
      zoom={8}
    >
      <TileLayer
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={latLang ?? [52.505, -0.09]} icon={ICON} />
    </MapContainer>
  )
}
