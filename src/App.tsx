import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { SearchFilters } from './components/SearchFilters'
import { PlaceCard } from './components/PlaceCard'
import { Collections } from './components/Collections'
import { MapView } from './components/MapView'
import { Achievements } from './components/Achievements'
import { toast } from 'sonner'

import type { Place } from "./types/place"
import { PLACES } from './data/places'

interface UserStats {
  visitedPlaces: number
  distanceWalked: number
  favoritePlaces: number
  collectionComments: number
  daysActive: number
  completedCollections: number
  categoriesExplored: number
  restaurantsVisited: number
}

export default function App() {
  // ------------------------
  // Инициализация состояний
  // ------------------------
  const [places, setPlaces] = useState<Place[]>(() => {
    const stored = localStorage.getItem("places")
    return stored ? JSON.parse(stored) : PLACES
  })

  const [currentRoute, setCurrentRoute] = useState<Place[]>(() => {
    const stored = localStorage.getItem("currentRoute")
    return stored ? JSON.parse(stored) : []
  })

  const [currentTab, setCurrentTab] = useState("explore")
  const [selectedFilters, setSelectedFilters] = useState<any>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [collectionComments, setCollectionComments] = useState<{ [key: string]: string }>({})
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Локация пользователя (центр Кирова по умолчанию)
  const userLocation = {
    latitude: 58.6035,
    longitude: 49.6680
  }

  // ------------------------
  // Сохраняем в localStorage при изменениях
  // ------------------------
  useEffect(() => {
    localStorage.setItem("places", JSON.stringify(places))
  }, [places])

  useEffect(() => {
    localStorage.setItem("currentRoute", JSON.stringify(currentRoute))
  }, [currentRoute])

  // ------------------------
  // Расчет статистики пользователя
  // ------------------------
  const getInitialStats = (): UserStats => {
    const visitedCount = places.filter(p => p.isVisited).length
    const favoriteCount = places.filter(p => p.isFavorite).length
    
    const visitedCategories = new Set<string>()
    let totalDistance = 0
    let restaurantsCount = 0
    
    places.forEach(p => {
      if (p.isVisited) {
        visitedCategories.add(p.category)
        const distanceValue = parseFloat(p.distance.replace(/[^\d.]/g, ''))
        if (!isNaN(distanceValue)) {
          totalDistance += distanceValue
        }
        if (p.category === 'Ресторан' || p.category === 'Кафе') {
          restaurantsCount++
        }
      }
    })
    
    return {
      visitedPlaces: visitedCount,
      distanceWalked: totalDistance,
      favoritePlaces: favoriteCount,
      collectionComments: 0,
      daysActive: 7,
      completedCollections: 0,
      categoriesExplored: visitedCategories.size,
      restaurantsVisited: restaurantsCount,
    }
  }

  const [userStats, setUserStats] = useState<UserStats>(getInitialStats())

  // ------------------------
  // Расчет расстояния между координатами
  // ------------------------
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000 // радиус Земли в метрах
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

   const parseDistance = (distanceStr: string) => {
    const match = distanceStr.match(/(\d+(?:\.\d+)?)\s*(м|км)/)
    if (!match) return 0
    const value = parseFloat(match[1])
    return match[2] === 'км' ? value * 1000 : value
  }

  // ------------------------
  // Фильтрация мест
  // ------------------------
  const getFilteredPlaces = () => {
    return places.filter((place) => {
      if (showFavoritesOnly && !place.isFavorite) return false

      if (searchQuery && !place.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

      if (selectedFilters.radius?.length > 0) {
        const placeDistance = parseDistance(place.distance)
        const radiusInMeters = selectedFilters.radius.map((r: string) => {
          if (r === '500m') return 500
          if (r === '1km') return 1000
          if (r === '5km') return 5000
          return 0
        })
        const matchesRadius = radiusInMeters.some((radius: number) => placeDistance <= radius)
        if (!matchesRadius) return false
      }

      if (selectedFilters.categories?.length > 0) {
        const categoryMap: { [key: string]: string } = {
          cafe: "Кафе",
          restaurant: "Ресторан",
          park: "Парк",
          museum: "Музей",
          theater: "Театр",
          shopping: "Торговый центр",
          bar: "Бар",
        }
        const placeCategoryKey = Object.keys(categoryMap).find(key => categoryMap[key] === place.category)
        if (!placeCategoryKey || !selectedFilters.categories.includes(placeCategoryKey)) return false
      }

      if (selectedFilters.tags?.length > 0) {
        if (!selectedFilters.tags.includes(place.priceLevel)) return false
      }

      return true
    })
  }

  // ------------------------
  // Обработчики действий
  // ------------------------
  const handleFiltersChange = (filters: any) => setSelectedFilters(filters)
  const handleSearch = (query: string) => { setSearchQuery(query); setCurrentTab("explore") }

  const handleNavigateToPlace = (place: Place) => {
    if (!currentRoute.find(p => p.id === place.id)) setCurrentRoute([...currentRoute, place])
    setCurrentTab("map")
    toast(`Прокладываю маршрут до "${place.name}"`)
  }

  const handleAddToRoute = (place: Place) => {
    if (!currentRoute.find(p => p.id === place.id)) {
      setCurrentRoute([...currentRoute, place])
      toast(`"${place.name}" добавлено в маршрут`)
    } else {
      toast(`"${place.name}" уже в маршруте`)
    }
  }

  const handleRemoveFromRoute = (placeId: string) => {
    setCurrentRoute(currentRoute.filter(p => p.id !== placeId))
    toast("Место удалено из маршрута")
  }

  const handleClearRoute = () => { setCurrentRoute([]); toast("Маршрут очищен") }

  const handleNavigateToRoute = () => {
    if (currentRoute.length > 0) {
      toast(`Начинаю навигацию по маршруту из ${currentRoute.length} мест`)
    }
  }

  const handleToggleFavorite = (placeId: string) => {
    setPlaces(places.map(place =>
      place.id === placeId ? { ...place, isFavorite: !place.isFavorite } : place
    ))
    const place = places.find(p => p.id === placeId)
    if (place) {
      const wasAdded = !place.isFavorite
      setUserStats(prev => ({ ...prev, favoritePlaces: prev.favoritePlaces + (wasAdded ? 1 : -1) }))
      toast(wasAdded ? "Добавлено в избранное" : "Удалено из избранного")
    }
  }

  const handleMarkVisited = (placeId: string) => {
    setPlaces(places.map(place =>
      place.id === placeId ? { ...place, isVisited: true } : place
    ))
    const place = places.find(p => p.id === placeId)
    if (place && !place.isVisited) {
      setUserStats(prev => ({
        ...prev,
        visitedPlaces: prev.visitedPlaces + 1,
        categoriesExplored: new Set([...places.filter(p => p.isVisited || p.id === placeId).map(p => p.category)]).size,
        restaurantsVisited: prev.restaurantsVisited + ((place.category === 'Ресторан' || place.category === 'Кафе') ? 1 : 0),
        distanceWalked: prev.distanceWalked + parseDistance(place.distance),
      }))
      toast(`"${place.name}" отмечено как посещенное`)
    }
  }

  const handleAddCollectionComment = (collectionId: string, comment: string) => {
    const isNewComment = !collectionComments[collectionId]
    setCollectionComments(prev => ({ ...prev, [collectionId]: comment }))
    if (isNewComment) setUserStats(prev => ({ ...prev, collectionComments: prev.collectionComments + 1 }))
    toast("Комментарий к коллекции сохранен")
  }

  const handleCollectionSelect = (collection: any) => {
    toast(`Открываю коллекцию "${collection.title}"`)
    setCurrentTab("explore")
  }

  // ------------------------
  // Рендер контента
  // ------------------------
 const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 const renderExplore = () => {
  const filteredPlaces = getFilteredPlaces();

  if (isMobile) {
    // На телефоне фильтры идут после header
    return (
      <div className="space-y-6">
        <SearchFilters
          onFiltersChange={handleFiltersChange}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={setShowFavoritesOnly}
          forceOpen={!isMobile} 
        />
        <div>
          <h2>Найдено мест: {filteredPlaces.length}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onNavigate={handleNavigateToPlace}
                onAddToRoute={handleAddToRoute}
                onToggleFavorite={handleToggleFavorite}
                onMarkVisited={handleMarkVisited}
                isInRoute={currentRoute.some((p) => p.id === place.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    // На ноуте фильтры слева, всегда открыты, фиксированная ширина
    return (
      <div className="flex gap-6">
        {/* Левая колонка под фильтры */}
        <div className="w-64 flex-shrink-0">
          <SearchFilters
            onFiltersChange={handleFiltersChange}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={setShowFavoritesOnly}
            forceOpen // фильтр всегда открыт на ПК
          />
        </div>

        {/* Основная колонка с карточками */}
        <div className="flex-1">
          <h2>Найдено мест: {filteredPlaces.length}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onNavigate={handleNavigateToPlace}
                onAddToRoute={handleAddToRoute}
                onToggleFavorite={handleToggleFavorite}
                onMarkVisited={handleMarkVisited}
                isInRoute={currentRoute.some((p) => p.id === place.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
};


const renderContent = () => {
  switch (currentTab) {
    case "explore": return renderExplore()
    case "collections":
      return (
        <Collections
          onCollectionSelect={(collection) => {
            toast(`Открываю коллекцию "${collection.title}"`)
            setCurrentTab("explore")
          }}
          collectionComments={collectionComments}
          onAddComment={(collectionId, comment) => {
            const isNewComment = !collectionComments[collectionId]
            setCollectionComments(prev => ({ ...prev, [collectionId]: comment }))
            if (isNewComment) setUserStats(prev => ({ ...prev, collectionComments: prev.collectionComments + 1 }))
            toast("Комментарий к коллекции сохранен")
          }}
          places={places}
          onNavigateToPlace={handleNavigateToPlace}
          onAddToRoute={handleAddToRoute}
          onToggleFavorite={handleToggleFavorite}
          currentRoute={currentRoute}
        />
      )
    case "map":
      return (
        <MapView
          currentRoute={currentRoute}
          userLocation={userLocation}
          onRemoveFromRoute={handleRemoveFromRoute}
          onClearRoute={handleClearRoute}
          onNavigateToRoute={handleNavigateToRoute}
        />
      )
    case "achievements":
      return <Achievements userStats={userStats} />
    default: return null
  }
}


  // ------------------------
  // Количество разблокированных достижений
  // ------------------------
  const calculateUnlockedAchievements = () => {
    let count = 0
    if (userStats.visitedPlaces >= 5) count++
    if (userStats.distanceWalked >= 50) count++
    if (userStats.restaurantsVisited >= 10) count++
    if (userStats.categoriesExplored >= 5) count++
    if (userStats.favoritePlaces >= 15) count++
    if (userStats.daysActive >= 30) count++
    if (userStats.collectionComments >= 10) count++
    return count
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onSearch={handleSearch}
        userStats={{
          visitedPlaces: userStats.visitedPlaces,
          achievements: calculateUnlockedAchievements(),
        }}
      />

      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  )
}
