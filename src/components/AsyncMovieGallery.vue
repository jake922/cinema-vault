<script setup>
import { computed, onMounted } from 'vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  shouldFail: {
    type: Boolean,
    default: false,
  },
  savedIds: {
    type: Array,
    default: () => [],
  },
  refreshSeed: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['save', 'remove', 'retry', 'load-error'])

const allMovies = [
  {
    id: 1,
    title: '你的名字',
    year: '2016',
    genre: '青春 / 奇幻',
    director: '新海诚',
    runtime: '107 分钟',
    cover: '/posters/your-name.jpg',
    description: '流星划过黄昏，两座城市之间交换身体的少年少女相互寻找彼此。',
  },
  {
    id: 2,
    title: '天气之子',
    year: '2019',
    genre: '奇幻 / 爱情',
    director: '新海诚',
    runtime: '112 分钟',
    cover: '/posters/weathering-with-you.jpg',
    description: '雨季的东京里，能让天空放晴的少女与少年共同面对命运。',
  },
  {
    id: 3,
    title: '铃芽之旅',
    year: '2022',
    genre: '冒险 / 治愈',
    director: '新海诚',
    runtime: '122 分钟',
    cover: '/posters/suzume.jpg',
    description: '少女穿越日本各地，关闭灾厄之门，也慢慢走向内心的告别。',
  },
  {
    id: 4,
    title: '千与千寻',
    year: '2001',
    genre: '奇幻 / 冒险',
    director: '宫崎骏',
    runtime: '125 分钟',
    cover: '/posters/spirited-away.jpg',
    description: '误入神灵世界的少女，在汤屋中找回勇气、名字与回家的路。',
  },
  {
    id: 5,
    title: '哈尔的移动城堡',
    year: '2004',
    genre: '奇幻 / 爱情',
    director: '宫崎骏',
    runtime: '119 分钟',
    cover: '/posters/howls-moving-castle.jpg',
    description: '魔法、战争与温柔相遇，移动城堡承载着关于爱的成长。',
  },
  {
    id: 6,
    title: '声之形',
    year: '2016',
    genre: '青春 / 治愈',
    director: '山田尚子',
    runtime: '129 分钟',
    cover: '/posters/a-silent-voice.jpg',
    description: '关于伤害、道歉和重新理解彼此的青春故事，细腻而温柔。',
  },
  {
    id: 7,
    title: '天空之城',
    year: '1986',
    genre: '奇幻 / 冒险',
    director: '宫崎骏',
    runtime: '124 分钟',
    cover: '/posters/castle-in-the-sky.jpg',
    description: '少女与少年追寻传说中的空中城堡，在云海与机械文明之间展开冒险。',
  },
  {
    id: 8,
    title: '龙猫',
    year: '1988',
    genre: '治愈 / 奇幻',
    director: '宫崎骏',
    runtime: '86 分钟',
    cover: '/posters/my-neighbor-totoro.jpg',
    description: '乡间夏日里，姐妹俩遇见森林中的神秘生灵，童年的想象被温柔点亮。',
  },
  {
    id: 9,
    title: '萤火之森',
    year: '2011',
    genre: '爱情 / 治愈',
    director: '大森贵弘',
    runtime: '45 分钟',
    cover: '/posters/hotaru-bi-no-mori-e.jpg',
    description: '少女与不能被触碰的少年在森林中相遇，一段短暂却难忘的夏日约定悄然展开。',
  },
  {
    id: 10,
    title: '言叶之庭',
    year: '2013',
    genre: '青春 / 爱情',
    director: '新海诚',
    runtime: '46 分钟',
    cover: '/posters/the-garden-of-words.jpg',
    description: '雨天的新宿御苑里，少年与年长女性偶然相遇，在沉默与雨声中彼此靠近。',
  },
  {
    id: 11,
    title: '夏日大作战',
    year: '2009',
    genre: '科幻 / 家庭',
    director: '细田守',
    runtime: '114 分钟',
    cover: '/posters/summer-wars.jpg',
    description: '虚拟世界的危机蔓延到现实，一场关于家族、勇气与连接的夏日战斗开始了。',
  },
  {
    id: 12,
    title: '穿越时空的少女',
    year: '2006',
    genre: '青春 / 科幻',
    director: '细田守',
    runtime: '98 分钟',
    cover: '/posters/the-girl-who-leapt-through-time.jpg',
    description: '拥有跳跃时间能力的少女，在一次次重来中逐渐理解选择与告别的重量。',
  },
]

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const currentMovies = computed(() => {
  const seed = props.refreshSeed + 1

  return [...allMovies]
    .map((movie, index) => ({
      ...movie,
      sortValue: seededRandom(seed * 100 + index * 17 + movie.id),
    }))
    .sort((a, b) => a.sortValue - b.sortValue)
    .slice(0, 6)
    .map((movie, index) => ({
      ...movie,
      number: String(index + 1).padStart(2, '0'),
    }))
})

await new Promise((resolve) => {
  window.setTimeout(resolve, 1200)
})

onMounted(() => {
  if (props.shouldFail) {
    emit('load-error')
  }
})
</script>

<template>
  <section v-if="shouldFail" class="load-error">
    <p class="error-index">THE SCREENING ROOM IS QUIET</p>
    <h3>今晚的片单暂时迷路了</h3>
    <p class="error-description">
      像一封没有送达的信，影片列表没有抵达放映室。点击重试，让它重新穿过云层。
    </p>

    <button type="button" @click="$emit('retry')">
      重新寻找
    </button>
  </section>

  <div v-else class="movie-grid">
    <MovieCard
      v-for="movie in currentMovies"
      :key="movie.id"
      :movie="movie"
      :saved="savedIds.includes(movie.id)"
      @save="$emit('save', $event)"
      @remove="$emit('remove', $event)"
    />
  </div>
</template>

<style scoped>
.movie-grid {
  width: min(1380px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 26px;
}

.load-error {
  width: min(1380px, 100%);
  min-height: 360px;
  margin: 0 auto;
  padding: 42px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  text-align: center;
  background: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.56);
  box-shadow: 0 24px 66px rgba(90, 115, 160, 0.16);
  backdrop-filter: blur(8px) saturate(1.2);
  -webkit-backdrop-filter: blur(8px) saturate(1.2);
}

.error-index {
  margin: 0 0 18px;
  color: #657293;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.22em;
}

.load-error h3 {
  margin: 0 0 16px;
  color: #17213f;
  font-size: clamp(34px, 4vw, 54px);
  font-weight: 850;
  letter-spacing: -0.05em;
}

.error-description {
  max-width: 540px;
  margin: 0 0 30px;
  color: #425170;
  font-size: 14px;
  line-height: 1.9;
}

@media (max-width: 1000px) {
  .movie-grid {
    grid-template-columns: 1fr;
  }

  .load-error {
    min-height: 320px;
  }
}
</style>