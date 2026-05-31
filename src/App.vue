<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import MovieSkeleton from './components/MovieSkeleton.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useToast } from './composables/useToast'

const backgroundVideoSrc = '/videos/background.mp4'

const bgVideo = ref(null)
const musicOn = ref(false)
const activePage = ref('home')
const cursorX = ref(typeof window === 'undefined' ? 0 : window.innerWidth / 2)
const cursorY = ref(typeof window === 'undefined' ? 0 : window.innerHeight / 2)
const trailParticles = ref([])

let trailParticleId = 0
let lastTrailTime = 0

const particles = Array.from({ length: 44 }, (_, index) => ({
  id: index,
  x: Math.round((index * 23) % 100),
  y: Math.round((index * 41) % 100),
  size: 2 + (index % 4),
  duration: 12 + (index % 8),
  delay: -1 * (index % 9),
  opacity: 0.36 + (index % 5) * 0.08,
}))

const AsyncMovieGallery = defineAsyncComponent({
  loader: () =>
    new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(import('./components/AsyncMovieGallery.vue'))
      }, 450)
    }),
  suspensible: true,
})

const { success, warning, error } = useToast()

const galleryKey = ref(0)
const isGalleryReady = ref(false)
const galleryMode = ref('success')
const refreshSeed = ref(0)
const savedMovies = ref([])

const savedMovieIds = computed(() => savedMovies.value.map((movie) => movie.id))

const pageStyle = computed(() => ({
  '--cursor-x': `${cursorX.value}px`,
  '--cursor-y': `${cursorY.value}px`,
}))

const totalMovieCount = 12
const displayMovieCount = 6

const galleryStatus = computed(() => {
  if (!isGalleryReady.value) return '片单整理中...'
  return galleryMode.value === 'error'
    ? '片单暂时迷路'
    : `${String(totalMovieCount).padStart(2, '0')} 部馆藏影片`
})

const createMouseTrail = (x, y) => {
  const now = typeof performance === 'undefined' ? Date.now() : performance.now()

  // 限流：避免鼠标移动时生成过多 DOM 节点导致卡顿
  if (now - lastTrailTime < 22) return
  lastTrailTime = now

  const burst = Array.from({ length: 3 }, (_, index) => {
    const angle = Math.random() * Math.PI * 2
    const distance = 24 + Math.random() * 52

    return {
      id: trailParticleId++,
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance - 18,
      size: 5 + Math.random() * 8,
      delay: index * 0.025,
      hue: Math.random() > 0.5 ? 198 : 322,
    }
  })

  trailParticles.value = [...trailParticles.value, ...burst].slice(-96)

  window.setTimeout(() => {
    const expiredIds = new Set(burst.map((particle) => particle.id))
    trailParticles.value = trailParticles.value.filter((particle) => !expiredIds.has(particle.id))
  }, 980)
}

const switchPage = (page) => {
  activePage.value = page
}

const handleAmbientMove = (event) => {
  cursorX.value = event.clientX
  cursorY.value = event.clientY
  createMouseTrail(event.clientX, event.clientY)
}

const audioRef = ref(null)
const isMusicPlaying = ref(false)

const toggleMusic = async () => {
  const audio = audioRef.value
  if (!audio) return

  try {
    if (isMusicPlaying.value) {
      audio.pause()
      isMusicPlaying.value = false
      showToast('晚风音乐已暂停', 'warning')
    } else {
      await audio.play()
      isMusicPlaying.value = true
      showToast('晚风音乐已开启', 'success')
    }
  } catch (error) {
    showToast('浏览器阻止了自动播放，请再次点击开启音乐', 'error')
  }
}

const reloadCollection = () => {
  galleryMode.value = 'success'
  isGalleryReady.value = false
  refreshSeed.value += 1
  galleryKey.value += 1
  success('晚风重新拂过放映室，新的六部作品正在出现。', '换一阵晚风')
}

const simulateError = () => {
  galleryMode.value = 'error'
  isGalleryReady.value = false
  galleryKey.value += 1
  warning('片单暂时迷路了，稍后可以重新寻找。', '加载异常')
}

const retryCollection = () => {
  galleryMode.value = 'success'
  isGalleryReady.value = false
  refreshSeed.value += 1
  galleryKey.value += 1
  success('正在重新寻找放映室。', '重新请求')
}

const handleLoadError = () => {
  error('影片数据加载失败，请点击重试。', '抵达失败')
}

const handleSaved = (movie) => {
  if (savedMovieIds.value.includes(movie.id)) {
    warning(`${movie.title} 已经在收藏夹里了。`, '重复收藏')
    return
  }

  savedMovies.value = [...savedMovies.value, movie]
  success(`${movie.title} 已被收入星映手札。`, '收藏成功')
}

const handleRemoved = (movie) => {
  if (!savedMovieIds.value.includes(movie.id)) {
    warning(`${movie.title} 当前不在收藏夹中。`, '无需移除')
    return
  }

  savedMovies.value = savedMovies.value.filter((item) => item.id !== movie.id)
  warning(`${movie.title} 已从星映手札中移除。`, '已移除')
}
</script>

<template>
  <main class="page" :style="pageStyle" @pointermove="handleAmbientMove">
   <video
  class="background-video"
  src="/videos/background.mp4"
  autoplay
  muted
  loop
  playsinline
  preload="metadata"
></video>

<audio
  ref="audioRef"
  src="/audio/bgm.mp3"
  loop
  preload="auto"
></audio>

    <div class="video-overlay" aria-hidden="true"></div>

    <div class="ambient-light" aria-hidden="true"></div>
    <div class="particle-layer" aria-hidden="true">
      <span
        v-for="particle in particles"
        :key="particle.id"
        :style="{
          '--x': `${particle.x}%`,
          '--y': `${particle.y}%`,
          '--size': `${particle.size}px`,
          '--duration': `${particle.duration}s`,
          '--delay': `${particle.delay}s`,
          '--opacity': particle.opacity,
        }"
      ></span>
    </div>

    <div class="cursor-particle-layer" aria-hidden="true">
      <span
        v-for="particle in trailParticles"
        :key="particle.id"
        class="cursor-particle"
        :style="{
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          '--dx': `${particle.dx}px`,
          '--dy': `${particle.dy}px`,
          '--size': `${particle.size}px`,
          '--delay': `${particle.delay}s`,
          '--hue': particle.hue,
        }"
      ></span>
    </div>

    <header class="navbar panel">
      <button class="brand-button" type="button" @click="switchPage('home')">
        <span class="brand-mark"></span>
        <span>
          <span class="brand-name">星映手札</span>
          <span class="brand-subtitle">Hoshikage Notes</span>
        </span>
      </button>

      <nav class="site-nav" aria-label="主导航">
        <button type="button" :class="{ active: activePage === 'home' }" @click="switchPage('home')">
          首页
        </button>

        <button
          type="button"
          :class="{ active: activePage === 'favorites' }"
          @click="switchPage('favorites')"
        >
          收藏
          <span v-if="savedMovies.length" class="nav-count">{{ savedMovies.length }}</span>
        </button>

        <button type="button" :class="{ active: activePage === 'about' }" @click="switchPage('about')">
          关于
        </button>

        <button class="music-button" @click="toggleMusic">
  {{ isMusicPlaying ? '暂停音乐' : '开启音乐' }}
</button>
      </nav>
    </header>

    <template v-if="activePage === 'home'">
      <section class="collection-hero">
        <div class="hero-copy">
          <p class="section-index">SUMMER · SKY · MEMORY</p>
          <h1>
            <span class="hero-title-main">星映手札</span>
            <span class="hero-title-sub">在晚风里收藏光影</span>
          </h1>
          <p class="hero-lead">
            把那些关于天空、夏天、列车与重逢的故事，收进一场安静的放映。
            当画面亮起，记忆也会像星光一样慢慢浮现。
          </p>
        </div>

        <div class="hero-tools panel">
          <p>
            这里是一间留给动漫电影的轻盈放映室。你可以浏览片单，收藏喜欢的作品，
            也可以让背景音乐跟随画面一起响起。
          </p>

          <div class="tool-actions">
            <button class="primary-button" type="button" @click="reloadCollection">
              换一阵晚风
            </button>

            <button type="button" @click="switchPage('favorites')">
              查看收藏
            </button>
          </div>
        </div>
      </section>

      <section class="gallery-section panel">
        <div class="gallery-heading">
          <div>
            <p class="section-index">FEATURED ANIME MOVIES</p>
            <h2>今日放映</h2>
          </div>

          <div class="gallery-stats">
            <p>{{ galleryStatus }}</p>
            <p>{{ String(displayMovieCount).padStart(2, '0') }} 正在放映</p>
            <p>{{ String(savedMovies.length).padStart(2, '0') }} 已收藏</p>
          </div>
        </div>

        <Suspense
          :key="galleryKey"
          timeout="0"
          @pending="isGalleryReady = false"
          @resolve="isGalleryReady = true"
        >
          <AsyncMovieGallery
            :should-fail="galleryMode === 'error'"
            :saved-ids="savedMovieIds"
            :refresh-seed="refreshSeed"
            @save="handleSaved"
            @remove="handleRemoved"
            @retry="retryCollection"
            @load-error="handleLoadError"
          />

          <template #fallback>
            <MovieSkeleton />
          </template>
        </Suspense>
      </section>
    </template>

    <template v-else-if="activePage === 'favorites'">
      <section class="page-section panel">
        <div class="page-heading">
          <p class="section-index">MY FAVORITES</p>
          <h1>我的收藏</h1>
          <p>
            被你收藏的作品会暂时停留在这里，像一本只属于自己的放映手札。
          </p>
        </div>

        <div v-if="savedMovies.length" class="favorite-list">
          <article v-for="movie in savedMovies" :key="movie.id" class="favorite-item">
            <img :src="movie.cover" :alt="`${movie.title} 封面`" />

            <div class="favorite-info">
              <p>{{ movie.genre }} · {{ movie.year }}</p>
              <h3>{{ movie.title }}</h3>
              <span>{{ movie.director }} / {{ movie.runtime }}</span>
              <p class="favorite-description">{{ movie.description }}</p>
            </div>

            <button type="button" @click="handleRemoved(movie)">
              移除收藏
            </button>
          </article>
        </div>

        <div v-else class="empty-state">
          <h2>收藏夹还是空的</h2>
          <p>回到首页，遇见喜欢的作品后点击收藏，它就会出现在这里。</p>
          <button class="primary-button" type="button" @click="switchPage('home')">
            回到首页
          </button>
        </div>
      </section>
    </template>

    <template v-else>
      <section class="page-section panel about-page">
        <div class="page-heading">
          <p class="section-index">ABOUT THIS SITE</p>
          <h1>关于星映手札</h1>
          <p>
            这是一个以天空、晚风和动漫电影为主题的轻量放映页面。
            首页保留作品展示与收藏体验，技术说明则统一收纳在这里。
          </p>
        </div>

        <div class="about-grid">
          <article>
            <h2>视觉设计</h2>
            <p>
              页面使用透明玻璃面板、柔和渐变、背景视频和封面式卡片，
              营造清爽、唯美、带有青春感的动漫放映氛围。
            </p>
          </article>

          <article>
            <h2>交互体验</h2>
            <p>
              用户可以收藏影片、查看收藏列表、移除收藏，也可以通过按钮控制背景视频中的音乐。
            </p>
          </article>

          <article>
            <h2>实现说明</h2>
            <p>
              全局通知使用 Teleport 挂载到 body；影片区域使用 Suspense
              配合异步组件加载；等待期间显示骨架屏；通知支持成功、警告和错误状态。
            </p>
          </article>

          <article>
            <h2>加载演示</h2>
            <p>
              这里保留一个异常加载入口，用于展示错误通知、重试流程和异步加载状态。
            </p>
            <button type="button" @click="simulateError">
              体验一次迷路
            </button>
          </article>
        </div>
      </section>
    </template>

    <ToastContainer />
  </main>
</template>

