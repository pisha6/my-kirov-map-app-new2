import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Collapsible, CollapsibleContent } from './ui/collapsible'
import { X, ChevronDown, Heart } from 'lucide-react'

interface Filters {
  radius: string[]
  tags: string[]
  categories: string[]
}

interface SearchFiltersProps {
  onFiltersChange: (filters: Filters) => void
  showFavoritesOnly?: boolean
  onToggleFavorites?: (value: boolean) => void
  forceOpen?: boolean // на ПК всегда открыто
}

export function SearchFilters({ onFiltersChange, showFavoritesOnly = false, onToggleFavorites, forceOpen = false }: SearchFiltersProps) {
  const [radius, setRadius] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(true)

  // на ПК всегда открыто
  useEffect(() => {
    if (forceOpen) setIsOpen(true)
  }, [forceOpen])

  const radiusOptions = [
    { id: '500m', label: '500 м' },
    { id: '1km', label: '1 км' },
    { id: '5km', label: '5 км' }
  ]

  const tagOptions = [
    { id: 'budget', label: 'Бюджетно' },
    { id: 'medium', label: 'Средний' },
    { id: 'premium', label: 'Премиум' }
  ]

  const categoryOptions = [
    { id: 'cafe', label: 'Кафе' },
    { id: 'restaurant', label: 'Рестораны' },
    { id: 'park', label: 'Парки' },
    { id: 'museum', label: 'Музеи' },
    { id: 'theater', label: 'Театры' },
    { id: 'shopping', label: 'Торговые центры' },
    { id: 'bar', label: 'Бары' }
  ]

  const handleCheckboxChange = (
    value: string,
    checked: boolean,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState(prev => {
      const newState = checked 
        ? [...prev, value]
        : prev.filter(item => item !== value)
      
      // обновляем фильтры сразу
      onFiltersChange({
        radius: setState === setRadius ? newState : radius,
        tags: setState === setTags ? newState : tags,
        categories: setState === setCategories ? newState : categories,
      })

      return newState
    })
  }

  const clearAllFilters = () => {
    setRadius([])
    setTags([])
    setCategories([])
    onFiltersChange({ radius: [], tags: [], categories: [] })
  }

  const hasActiveFilters = radius.length > 0 || tags.length > 0 || categories.length > 0

  // активные фильтры для отображения
  const activeBadges = [
    ...radius.map(r => radiusOptions.find(o => o.id === r)?.label).filter(Boolean),
    ...tags.map(t => tagOptions.find(o => o.id === t)?.label).filter(Boolean),
    ...categories.map(c => categoryOptions.find(o => o.id === c)?.label).filter(Boolean)
  ]

  return (
    <Card>
     <CardHeader className="pb-3">
  {/* Верхний блок фильтров кликабельный */}
  <div
    className="flex flex-col gap-1 cursor-pointer select-none"
    onClick={() => !forceOpen && setIsOpen(prev => !prev)}
  >
    <div className="flex items-center justify-between">
      <CardTitle>Фильтры</CardTitle>
      <div className="flex items-center gap-2">
        {/* Кнопка Очистить */}
        <div className="h-8 flex items-center">
          {hasActiveFilters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); clearAllFilters() }} // останавливаем всплытие
              className="text-muted-foreground h-8"
            >
              <X className="w-4 h-4 mr-1" />
              Очистить
            </Button>
          ) : (
            // резервируем место на ПК
            forceOpen && <div className="w-20" />
          )}
        </div>

        {/* Кнопка стрелка */}
        {!forceOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); setIsOpen(prev => !prev) }} // останавливаем всплытие
            className="h-8 w-8 p-0"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        )}
      </div>
    </div>

    {/* При закрытой панели показываем выбранные фильтры только на мобилке */}
    {!isOpen && !forceOpen && activeBadges.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-1">
        {activeBadges.map((label, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {label}
          </Badge>
        ))}
      </div>
    )}
  </div>
</CardHeader>


      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Радиус */}
            <div>
              <label className="text-sm font-medium mb-3 block">Радиус</label>
              <div className="space-y-2">
                {radiusOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={radius.includes(option.id)}
                      onCheckedChange={(checked: boolean | "indeterminate") => 
                        handleCheckboxChange(option.id, !!checked, setRadius)
                      }
                    />
                    <label htmlFor={option.id} className="text-sm cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Метки */}
            <div>
              <label className="text-sm font-medium mb-3 block">Метки</label>
              <div className="space-y-2">
                {tagOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={tags.includes(option.id)}
                      onCheckedChange={(checked: boolean | "indeterminate") => 
                        handleCheckboxChange(option.id, !!checked, setTags)
                      }
                    />
                    <label htmlFor={option.id} className="text-sm cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Категории */}
            <div>
              <label className="text-sm font-medium mb-3 block">Категории</label>
              <div className="space-y-2">
                {categoryOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={categories.includes(option.id)}
                      onCheckedChange={(checked: boolean | "indeterminate") => 
                        handleCheckboxChange(option.id, !!checked, setCategories)
                      }
                    />
                    <label htmlFor={option.id} className="text-sm cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Активные фильтры внутри панели */}
            {hasActiveFilters && (
              <div>
                <label className="text-sm font-medium mb-2 block">Активные фильтры</label>
                <div className="flex flex-wrap gap-2">
                  {radius.map(r => (
                    <Badge key={r} variant="secondary" className="text-xs">
                      {radiusOptions.find(o => o.id === r)?.label}
                    </Badge>
                  ))}
                  {tags.map(t => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {tagOptions.find(o => o.id === t)?.label}
                    </Badge>
                  ))}
                  {categories.map(c => (
                    <Badge key={c} variant="secondary" className="text-xs">
                      {categoryOptions.find(o => o.id === c)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопка "Показать только избранное" */}
            {onToggleFavorites && (
              <Button 
                variant={showFavoritesOnly ? "default" : "outline"}
                onClick={() => onToggleFavorites(!showFavoritesOnly)} 
                className="w-full"
              >
                <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                {showFavoritesOnly ? 'Показать все' : 'Только избранное'}
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
