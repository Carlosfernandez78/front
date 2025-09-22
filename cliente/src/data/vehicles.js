// Imagen remota alternativa más permisiva
// Nota: mantenemos el asset local por si se prefiere volver
// import suv2022Url from '../assets/suv-2022.svg'

export const vehicles = [
  {
    id: 'sedan-2023',
    name: 'Sedán Compacto 2023',
    features: ['Automático', '5 puertas', 'A/C'],
    pricePerDay: 28500,
    image:
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'suv-2022',
    name: 'SUV Familiar 2022',
    features: ['Manual', '7 asientos', 'Baúl amplio'],
    pricePerDay: 39500,
    image: '/images/suv-2022.jpg',
  },
  {
    id: 'pickup-2024',
    name: 'Pickup 4x4 2024',
    features: ['4x4', 'Caja amplia', 'Diésel'],
    pricePerDay: 45500,
    image:
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200&auto=format&fit=crop',
  },
]

export function getVehicleById(id) {
  return vehicles.find((v) => v.id === id)
}


