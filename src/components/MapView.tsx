import { useCallback } from "react"
import { YMaps, Map, Placemark, Polyline, Clusterer } from "@pbe/react-yandex-maps"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { X, Route, Navigation, MapPin, AlertCircle } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

import type { Place } from "../types/place"

interface MapViewProps {
  currentRoute: Place[]
  onRemoveFromRoute: (placeId: string) => void
  onClearRoute: () => void
  onNavigateToRoute: () => void
  userLocation: { latitude: number; longitude: number }
}

export function MapView({
  currentRoute,
  onRemoveFromRoute,
  onClearRoute,
  onNavigateToRoute,
  userLocation,
}: MapViewProps) {
  // Центр карты
  const center: [number, number] =
    currentRoute.length > 0
      ? [currentRoute[0].latitude, currentRoute[0].longitude]
      : [userLocation.latitude, userLocation.longitude]

  // Линия маршрута: сначала пользователь, затем все места
  const routeCoordinates: [number, number][] = [
    [userLocation.latitude, userLocation.longitude] as [number, number],
    ...currentRoute.map((p): [number, number] => [p.latitude, p.longitude])
  ]

  // Открытие Яндекс.Навигатора
  const openYandexNavigator = useCallback(() => {
    if (currentRoute.length === 0) return

    const allCoords = [
      `${userLocation.latitude},${userLocation.longitude}`,
      ...currentRoute.map(p => `${p.latitude},${p.longitude}`)
    ].join("~")

    const url = `https://yandex.ru/maps/?rtext=${allCoords}&rtt=mt`
    window.open(url, "_blank")
  }, [currentRoute, userLocation])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Карта */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Карта маршрута
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden">
              <YMaps query={{ lang: "ru_RU" }}>
                <Map
                  defaultState={{ center, zoom: 13 }}
                  width="100%"
                  height="100%"
                  modules={["geoObject.addon.balloon", "control.ZoomControl"]}
                >
                  {/* Маркер пользователя */}
                  <Placemark
                    geometry={[userLocation.latitude, userLocation.longitude]}
                    options={{ preset: "islands#blueCircleIcon" }}
                    properties={{ balloonContent: "Вы здесь" }}
                  />

                  {/* Маркеры маршрута */}
                  <Clusterer
                    options={{ preset: "islands#invertedRedClusterIcons" }}
                  >
                    {currentRoute.map((place, index) => (
                      <Placemark
                        key={place.id}
                        geometry={[place.latitude, place.longitude]}
                        options={{ preset: "islands#redDotIcon", balloonCloseButton: true }}
                      >
                        <div className="space-y-1 max-w-xs p-2">
                          <h3 className="font-bold">{index + 1}. {place.name}</h3>
                          <p className="text-sm">Адрес: {place.address}</p>
                          <p className="text-sm">Часы работы: {place.hours}</p>
                          <p className="text-sm">Категория: {place.category}</p>
                          <p className="text-sm">Рейтинг: {place.rating} ⭐</p>
                          <p className="text-sm">Цена: {place.priceLevel}</p>
                          <p className="text-sm">Расстояние: {place.distance}</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="ghost" onClick={() => onRemoveFromRoute(place.id)}>
                              <X className="w-4 h-4 mr-1" />
                              Убрать
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => alert(`Подробнее о месте: ${place.name}`)}>
                              Подробнее
                            </Button>
                          </div>
                        </div>
                      </Placemark>
                    ))}
                  </Clusterer>

                  {/* Линия маршрута */}
                  {routeCoordinates.length > 1 && (
                    <Polyline
                      geometry={routeCoordinates}
                      options={{
                        strokeColor: "#2563eb",
                        strokeWidth: 4,
                      }}
                    />
                  )}
                </Map>
              </YMaps>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Панель маршрута */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                Мой маршрут
              </div>
              {currentRoute.length > 0 && (
                <Badge variant="secondary">{currentRoute.length} мест</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentRoute.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Маршрут пуст</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={openYandexNavigator}>
                  <Navigation className="w-4 h-4 mr-2" />
                  Начать
                </Button>
                <Button variant="outline" onClick={onClearRoute}>
                  <X className="w-4 h-4 mr-2" />
                  Очистить
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {currentRoute.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Места в маршруте</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentRoute.map((place, index) => (
                <div
                  key={place.id}
                  className="flex items-center gap-3 p-2 border rounded-lg"
                >
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <ImageWithFallback
                    src={place.image}
                    alt={place.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{place.name}</p>
                    <p className="text-xs text-muted-foreground">{place.address}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveFromRoute(place.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
