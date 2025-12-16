import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Clock, Users, Heart, Star, MapPin, Coffee, MessageSquare, Check, X, ChevronDown, ChevronUp, Navigation, Plus, Target } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

import type { Place } from "../types/place"


interface Collection {
  id: string
  title: string
  description: string
  count: number
  image: string
  category: string
  icon: React.ComponentType<any>
  userComment?: string
  placeIds?: string[]
}

interface CollectionsProps {
  onCollectionSelect: (collection: Collection) => void
  collectionComments: { [key: string]: string }
  onAddComment: (collectionId: string, comment: string) => void
  places: Place[]
  onNavigateToPlace: (place: Place) => void
  onAddToRoute: (place: Place) => void
  onToggleFavorite: (placeId: string) => void
  currentRoute: Place[]
}

export function Collections({ 
  onCollectionSelect, 
  collectionComments, 
  onAddComment,
  places,
  onNavigateToPlace,
  onAddToRoute,
  onToggleFavorite,
  currentRoute
}: CollectionsProps) {
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null)

  const collections: Collection[] = [
    {
      id: '1',
      title: 'Работают ночью',
      description: 'Места, которые открыты допоздна для ночных прогулок',
      count: 24,
      image: 'https://images.unsplash.com/photo-1541296481353-b1eb3a4e0309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGxpZmUlMjBlbnRlcnRhaW5tZW50fGVufDF8fHx8MTc1OTg2Mzc1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Развлечения',
      icon: Clock,
      userComment: collectionComments['1'],
      placeIds: ['9', '35', '11', '19', '49', '50', '52', '103', '108', '39', '40', '17']
    },
    {
      id: '2',
      title: 'Семейные места',
      description: 'Идеальные локации для отдыха с детьми',
      count: 18,
      image: 'https://images.unsplash.com/photo-1717180436987-089b88a2d782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBhY3Rpdml0aWVzJTIwY2hpbGRyZW58ZW58MXx8fHwxNzU5ODYzNzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Семья',
      icon: Users,
      userComment: collectionComments['2'],
      placeIds: ['5', '1', '10', '15', '23', '105', '79', '104', '38', '61', '118']
    },
    {
      id: '3',
      title: 'Романтические места',
      description: 'Уютные места для свиданий и романтических встреч',
      count: 15,
      image: 'https://images.unsplash.com/photo-1620455970942-5fca5840d5ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGRhdGUlMjBjb3VwbGV8ZW58MXx8fHwxNzU5NzczNzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Романтика',
      icon: Heart,
      userComment: collectionComments['3'],
      placeIds: ['4', '3', '20', '34', '37', '10', '63', '64', '52', '73']
    },
    {
      id: '4',
      title: 'Топ по рейтингу',
      description: 'Самые высоко оцененные места в городе',
      count: 12,
      image: 'https://images.unsplash.com/photo-1722739541715-1d59cde9cca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc1OTc1OTQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Премиум',
      icon: Star,
      userComment: collectionComments['4'],
      placeIds: ['3', '20', '62', '4', '37', '7', '58', '10', '109', '41', '44', '106']
    },
    {
      id: '5',
      title: 'В центре города',
      description: 'Популярные места в центральной части города',
      count: 31,
      image: 'https://images.unsplash.com/photo-1682660634231-3b73b999cfda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBnYWxsZXJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5ODYzNzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Локация',
      icon: MapPin,
      userComment: collectionComments['5'],
      placeIds: ['1', '2', '3', '4', '8', '11', '13', '14', '18', '19', '20', '25', '27', '29', '31', '33', '34', '38', '41', '42', '45', '51', '63', '70', '73', '85', '86', '87', '94', '95', '97', '98', '99', '100', '101', '107', '111', '113', '115', '117', '120']
    },
    {
      id: '6',
      title: 'Уютные кофейни',
      description: 'Атмосферные места для работы и отдыха за чашкой кофе',
      count: 22,
      image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY29mZmVlJTIwc2hvcHxlbnwxfHx8fDE3NTk4NjM3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Кафе',
      icon: Coffee,
      userComment: collectionComments['6'],
      placeIds: ['2', '8', '14', '18', '24', '25', '27', '28', '29', '30', '101']
    },
    {
      id: '7',
      title: 'Культурная программа',
      description: 'Музеи, театры и выставки',
      count: 20,
      image: 'https://images.unsplash.com/photo-1682660634231-3b73b999cfda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBnYWxsZXJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5ODYzNzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Культура',
      icon: Star,
      userComment: collectionComments['7'],
      placeIds: ['3', '7', '13', '17', '20', '38', '39', '40', '41', '42', '43', '44', '45', '106', '113', '62', '66']
    },
    {
      id: '8',
      title: 'Активный отдых',
      description: 'Спорт, фитнес и активности на свежем воздухе',
      count: 15,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwYWN0aXZpdGllc3xlbnwxfHx8fDE3NTk4NjM3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Спорт',
      icon: Target,
      userComment: collectionComments['8'],
      placeIds: ['53', '54', '55', '56', '57', '58', '109', '110', '112', '114', '120']
    },
    {
      id: '9',
      title: 'Шоппинг',
      description: 'Торговые центры и магазины',
      count: 12,
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGx8ZW58MXx8fHwxNzU5ODYzNzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Шоппинг',
      icon: MapPin,
      userComment: collectionComments['9'],
      placeIds: ['6', '12', '46', '47', '48', '85', '86', '87', '116', '118', '119']
    },
    {
      id: '10',
      title: 'Гастрономический тур',
      description: 'Лучшие рестораны и кафе города',
      count: 25,
      image: 'https://images.unsplash.com/photo-1722739541715-1d59cde9cca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc1OTc1OTQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Еда',
      icon: Coffee,
      userComment: collectionComments['10'],
      placeIds: ['2', '4', '8', '9', '14', '16', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '81', '82', '83', '84', '101', '102']
    }
  ]

  const handleSaveComment = (collectionId: string) => {
    onAddComment(collectionId, commentText)
    setShowCommentForm(null)
    setCommentText('')
  }

  const handleCancelComment = () => {
    setShowCommentForm(null)
    setCommentText('')
  }

  const handleEditComment = (collectionId: string, currentComment: string) => {
    setShowCommentForm(collectionId)
    setCommentText(currentComment)
  }

  const handleToggleCollection = (collectionId: string) => {
    setExpandedCollection(expandedCollection === collectionId ? null : collectionId)
  }

  const getCollectionPlaces = (collection: Collection): Place[] => {
    if (!collection.placeIds) return []
    return places.filter(place => collection.placeIds?.includes(place.id))
  }

  // Подсчет уникальных мест во всех коллекциях
  const getTotalUniquePlaces = () => {
    const allPlaceIds = new Set<string>()
    collections.forEach(collection => {
      collection.placeIds?.forEach(id => allPlaceIds.add(id))
    })
    return allPlaceIds.size
  }

  const getPriceLevelLabel = (level: string) => {
    switch (level) {
      case 'budget': return 'Бюджетно'
      case 'medium': return 'Средний'
      case 'premium': return 'Премиум'
      default: return level
    }
  }

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case 'budget': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Готовые коллекции</h2>
        <p className="text-muted-foreground">Подборки интересных мест на любой вкус</p>
      </div>

      <div className="space-y-6">
        {collections.map((collection) => {
          const Icon = collection.icon
          const isEditingComment = showCommentForm === collection.id
          const isExpanded = expandedCollection === collection.id
          const collectionPlaces = getCollectionPlaces(collection)
          
          return (
            <Card 
              key={collection.id} 
              className="overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Заголовок коллекции */}
              <div 
                className="relative cursor-pointer group"
                onClick={() => !isEditingComment && handleToggleCollection(collection.id)}
              >
                <div className="flex items-center gap-4 p-4">
                  <ImageWithFallback
                    src={collection.image}
                    alt={collection.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {collection.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          <Icon className="w-3 h-3 mr-1" />
                          {collection.category}
                        </Badge>
                        <Badge variant="default" className="text-xs">
                          {collectionPlaces.length} мест
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-0">
                {/* Комментарий пользователя */}
                {collection.userComment && !isEditingComment && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{collection.userComment}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => handleEditComment(collection.id, collection.userComment || '')}
                        >
                          Редактировать
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Форма комментария */}
                {isEditingComment && (
                  <div className="mb-4 space-y-2">
                    <Textarea
                      placeholder="Добавьте свой комментарий к коллекции..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveComment(collection.id)}>
                        <Check className="w-4 h-4 mr-1" />
                        Сохранить
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelComment}>
                        <X className="w-4 h-4 mr-1" />
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}

                {/* Кнопка добавления комментария */}
                {!collection.userComment && !isEditingComment && !isExpanded && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation()
                      setShowCommentForm(collection.id)
                    }}

                    className="w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Добавить комментарий
                  </Button>
                )}

                {/* Развернутый список мест */}
                {isExpanded && (
                  <div className="space-y-4 mt-4 pt-4 border-t">
                    <h4 className="font-medium">Места в коллекции</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {collectionPlaces.map((place) => {
                        const isInRoute = currentRoute.some(p => p.id === place.id)
                        
                        return (
                        <Card key={place.id} className="overflow-hidden flex flex-col h-full">
                          <div className="relative">
                            <ImageWithFallback
                              src={place.image}
                              alt={place.name}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <Badge className={getPriceLevelColor(place.priceLevel) + ' text-xs'}>
                                {getPriceLevelLabel(place.priceLevel)}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`absolute top-2 right-2 h-7 w-7 p-0 ${
                                place.isFavorite 
                                  ? 'text-red-500 hover:text-red-600 bg-white/80' 
                                  : 'text-gray-600 hover:text-red-500 bg-white/80'
                              }`}
                              onClick={() => onToggleFavorite(place.id)}
                            >
                              <Heart className={`w-3 h-3 ${place.isFavorite ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                          
                          <CardContent className="p-3 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-medium text-sm leading-tight">{place.name}</h5>
                              <div className="flex items-center gap-1 ml-2">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{place.rating}</span>
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2 flex-1">{place.address}</p>
                            
                            <div className="flex gap-2 mt-auto">
                              <Button
                                size="sm"
                                onClick={() => onNavigateToPlace(place)}
                                className="flex-1 h-8 text-xs"
                              >
                                <Navigation className="w-3 h-3 mr-1" />
                                Маршрут
                              </Button>
                              
                              <Button
                                size="sm"
                                variant={isInRoute ? 'secondary' : 'outline'}
                                onClick={() => onAddToRoute(place)}
                                disabled={isInRoute}
                                className="flex-1 h-8 text-xs"
                              >
                                {isInRoute ? (
                                  <>
                                    <Check className="w-3 h-3 mr-1" />
                                    В маршруте
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3 mr-1" />
                                    В маршрут
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )})}
                    </div>
                    
                    {!collection.userComment && !isEditingComment && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                          setShowCommentForm(collection.id)
                        }}

                        className="w-full"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Добавить комментарий к коллекции
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Статистика коллекций */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{collections.length}</div>
            <div className="text-sm text-muted-foreground">Коллекций</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{getTotalUniquePlaces()}</div>
            <div className="text-sm text-muted-foreground">Всего мест</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}