import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Award, 
  MapPin, 
  MessageSquare, 
  Trophy,
  Target,
  Zap,
  Star,
  Coffee,
  Lock,
  Heart
} from 'lucide-react'

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

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  isUnlocked: boolean
  progress: number
  maxProgress: number
  category: string
  reward?: string
}

interface AchievementsProps {
  userStats: UserStats
}

export function Achievements({ userStats }: AchievementsProps) {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Первооткрыватель',
      description: 'Посетите 5 новых мест',
      icon: MapPin,
      isUnlocked: userStats.visitedPlaces >= 5,
      progress: userStats.visitedPlaces,
      maxProgress: 5,
      category: 'Исследование',
      reward: '+50 очков опыта'
    },
    {
      id: '2',
      title: 'Путешественник',
      description: 'Пройдите 50 км по городу',
      icon: Target,
      isUnlocked: userStats.distanceWalked >= 50,
      progress: userStats.distanceWalked,
      maxProgress: 50,
      category: 'Активность',
      reward: 'Специальный бейдж'
    },
    {
      id: '3',
      title: 'Гурман',
      description: 'Посетите 10 кафе и ресторанов',
      icon: Coffee,
      isUnlocked: userStats.restaurantsVisited >= 10,
      progress: userStats.restaurantsVisited,
      maxProgress: 10,
      category: 'Специализация',
      reward: 'Скидки в ресторанах'
    },
    {
      id: '4',
      title: 'Исследователь',
      description: 'Посетите места разных категорий (кафе, парки, театры и т.д.)',
      icon: Trophy,
      isUnlocked: userStats.categoriesExplored >= 5,
      progress: userStats.categoriesExplored,
      maxProgress: 5,
      category: 'Исследование',
      reward: 'Эксклюзивные маршруты'
    },
    {
      id: '5',
      title: 'Социальный',
      description: 'Добавьте 15 мест в избранное',
      icon: Heart,
      isUnlocked: userStats.favoritePlaces >= 15,
      progress: userStats.favoritePlaces,
      maxProgress: 15,
      category: 'Социальное',
      reward: 'Персональные рекомендации'
    },
    {
      id: '6',
      title: 'Активист',
      description: 'Используйте приложение 30 дней подряд',
      icon: Zap,
      isUnlocked: userStats.daysActive >= 30,
      progress: userStats.daysActive,
      maxProgress: 30,
      category: 'Активность',
      reward: 'Премиум функции'
    },
    {
      id: '7',
      title: 'Коллекционер',
      description: 'Оставьте комментарии ко всем коллекциям',
      icon: MessageSquare,
      isUnlocked: userStats.collectionComments >= 10,
      progress: userStats.collectionComments,
      maxProgress: 10,
      category: 'Коллекции',
      reward: 'Специальный титул'
    }
  ]

  const unlockedCount = achievements.filter(a => a.isUnlocked).length
  const totalPoints = unlockedCount * 100

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="text-center space-y-4">
        <div>
          <h2>Достижения</h2>
          <p className="text-muted-foreground">Ваш прогресс в исследовании города</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{unlockedCount}</div>
              <div className="text-sm text-muted-foreground">Получено</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{achievements.length - unlockedCount}</div>
              <div className="text-sm text-muted-foreground">В процессе</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Очков</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Прогресс</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Общий прогресс */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Общий прогресс
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Достижения получено: {unlockedCount} из {achievements.length}</span>
              <span>{Math.round((unlockedCount / achievements.length) * 100)}%</span>
            </div>
            <Progress value={(unlockedCount / achievements.length) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Список достижений */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon
          const progressPercent = Math.min((achievement.progress / achievement.maxProgress) * 100, 100)
          
          return (
            <Card 
              key={achievement.id} 
              className={`transition-all ${
                achievement.isUnlocked 
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border-yellow-200 dark:border-yellow-800' 
                  : 'opacity-75'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`rounded-full p-2 ${
                    achievement.isUnlocked 
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.isUnlocked ? (
                      <Icon className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${
                        achievement.isUnlocked ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                      </h3>
                      {achievement.isUnlocked && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          Получено
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {achievement.progress} / {achievement.maxProgress}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(progressPercent)}%
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-1" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {achievement.category}
                      </Badge>
                      {achievement.reward && (
                        <span className="text-xs text-muted-foreground">
                          {achievement.reward}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Ближайшие цели */}
      <Card>
        <CardHeader>
          <CardTitle>Ближайшие цели</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements
              .filter(a => !a.isUnlocked && a.progress > 0)
              .sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress))
              .slice(0, 3)
              .map((achievement) => {
                const Icon = achievement.icon
                const progressPercent = (achievement.progress / achievement.maxProgress) * 100
                
                return (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 border rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{achievement.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-1" />
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}