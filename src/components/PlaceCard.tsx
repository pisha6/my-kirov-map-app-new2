import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { MapPin, Clock, Star, Heart, Navigation, Plus, Check, CheckCircle2 } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import type { Place } from "../types/place"

interface PlaceCardProps {
  place: Place
  onNavigate: (place: Place) => void
  onAddToRoute: (place: Place) => void
  onToggleFavorite: (placeId: string) => void
  onMarkVisited?: (placeId: string) => void
  isInRoute?: boolean
}

export function PlaceCard({ place, onNavigate, onAddToRoute, onToggleFavorite, onMarkVisited, isInRoute = false }: PlaceCardProps) {

  const getPriceLevelLabel = (level: string) => {
    switch(level) {
      case 'budget': return 'Бюджетно'
      case 'medium': return 'Средний'
      case 'premium': return 'Премиум'
      default: return level
    }
  }

  const getPriceLevelColor = (level: string) => {
    switch(level) {
      case 'budget': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow w-full md:w-auto">
      <div className="relative">
        <ImageWithFallback
          src={place.image}
          alt={place.name}
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge className={getPriceLevelColor(place.priceLevel)}>{getPriceLevelLabel(place.priceLevel)}</Badge>
          {place.isVisited && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Посещено
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 ${place.isFavorite ? 'text-red-500 hover:text-red-600 bg-white/80' : 'text-gray-600 hover:text-red-500 bg-white/80'}`}
          onClick={() => onToggleFavorite(place.id)}
        >
          <Heart className={`w-5 h-5 ${place.isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2 flex-wrap">
          <h3 className="font-semibold text-base sm:text-lg md:text-xl leading-tight">{place.name}</h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{place.rating}</span>
          </div>
        </div>

        <Badge variant="outline" className="mb-3 text-xs sm:text-sm">{place.category}</Badge>

        <div className="space-y-2 mb-4 text-sm sm:text-base">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{place.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{place.hours}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="w-4 h-4 text-primary" />
              <span>{place.distance}</span>
            </div>
          </div>
        </div>

         <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onNavigate(place)}
              className="flex-1"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Маршрут
            </Button>
            
            <Button
              size="sm"
              variant={isInRoute ? 'secondary' : 'outline'}
              onClick={() => onAddToRoute(place)}
              disabled={isInRoute}
              className="flex-1"
            >
              {isInRoute ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  В маршруте
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  В маршрут
                </>
              )}
            </Button>
          </div>

           {onMarkVisited && !place.isVisited && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMarkVisited(place.id)}
              className="w-full"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Посетил
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
