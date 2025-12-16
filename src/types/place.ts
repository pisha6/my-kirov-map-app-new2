export type PriceLevel = "budget" | "medium" | "premium"

export interface Place {
  id: string
  name: string
  category: string
  address: string
  hours: string
  rating: number
  priceLevel: PriceLevel
  distance: string
  image: string
  latitude: number
  longitude: number
  userComment?: string
  isVisited?: boolean
  isFavorite?: boolean
}
