<script setup>
import { ref } from 'vue'

defineProps({
  movie: {
    type: Object,
    required: true,
  },
  saved: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['save', 'remove'])
const cardEl = ref(null)

const handleCardMove = (event) => {
  const card = cardEl.value
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateY = ((x - centerX) / centerX) * 7
  const rotateX = -((y - centerY) / centerY) * 7

  card.style.setProperty('--rotate-x', `${rotateX.toFixed(2)}deg`)
  card.style.setProperty('--rotate-y', `${rotateY.toFixed(2)}deg`)
  card.style.setProperty('--spot-x', `${x}px`)
  card.style.setProperty('--spot-y', `${y}px`)
  card.style.setProperty('--card-lift', '-10px')
}

const resetCard = () => {
  const card = cardEl.value
  if (!card) return

  card.style.setProperty('--rotate-x', '0deg')
  card.style.setProperty('--rotate-y', '0deg')
  card.style.setProperty('--spot-x', '50%')
  card.style.setProperty('--spot-y', '18%')
  card.style.setProperty('--card-lift', '0px')
}
</script>

<template>
  <article
    ref="cardEl"
    class="movie-card"
    @pointermove="handleCardMove"
    @pointerleave="resetCard"
  >
    <div class="poster-frame">
      <img class="poster-image" :src="movie.cover" :alt="`${movie.title} 电影封面`" />
      <span class="poster-number">{{ movie.number }}</span>
      <span class="poster-year">{{ movie.year }}</span>
    </div>

    <div class="movie-content">
      <p class="movie-genre">{{ movie.genre }}</p>
      <h3>{{ movie.title }}</h3>

      <div class="movie-meta">
        <span>{{ movie.director }}</span>
        <span>{{ movie.runtime }}</span>
      </div>

      <p class="movie-description">
        {{ movie.description }}
      </p>

      <div class="movie-actions">
        <button
          class="save-button"
          :class="{ saved }"
          type="button"
          :disabled="saved"
          @click="emit('save', movie)"
        >
          {{ saved ? '已收藏' : '收入手札' }}
        </button>

        <button type="button" @click="emit('remove', movie)">
          移除
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.movie-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.26), rgba(255, 255, 255, 0.08)),
    radial-gradient(circle at 14% 10%, rgba(255, 126, 181, 0.12), transparent 32%),
    radial-gradient(circle at 86% 12%, rgba(105, 197, 255, 0.14), transparent 34%);
  border: 1px solid rgba(255, 255, 255, 0.34);
  box-shadow:
    0 26px 70px rgba(10, 20, 48, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(18px) saturate(1.12);
  -webkit-backdrop-filter: blur(18px) saturate(1.12);
  transform:
    perspective(1000px)
    translateY(var(--card-lift, 0px))
    rotateX(var(--rotate-x, 0deg))
    rotateY(var(--rotate-y, 0deg));
  transform-style: preserve-3d;
  transition:
    transform 0.18s ease,
    box-shadow 0.26s ease,
    border-color 0.26s ease,
    background 0.26s ease;
  will-change: transform;
}

.movie-card::before {
  position: absolute;
  inset: 0;
  z-index: 2;
  content: '';
  pointer-events: none;
  opacity: 0;
  background:
    radial-gradient(
      circle at var(--spot-x, 50%) var(--spot-y, 18%),
      rgba(255, 255, 255, 0.42),
      rgba(127, 204, 255, 0.2) 18%,
      transparent 42%
    );
  mix-blend-mode: screen;
  transition: opacity 0.25s ease;
}

.movie-card:hover {
  border-color: rgba(255, 255, 255, 0.62);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.12)),
    radial-gradient(circle at 14% 10%, rgba(255, 126, 181, 0.18), transparent 32%),
    radial-gradient(circle at 86% 12%, rgba(105, 197, 255, 0.2), transparent 34%);
  box-shadow:
    0 38px 88px rgba(10, 20, 48, 0.3),
    0 0 52px rgba(108, 191, 255, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);
}

.movie-card:hover::before {
  opacity: 1;
}

.poster-frame {
  position: relative;
  z-index: 1;
  width: calc(100% - 34px);
  aspect-ratio: 2 / 3;
  margin: 17px auto 0;
  overflow: hidden;
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(255, 143, 183, 0.35), rgba(115, 199, 255, 0.35)),
    rgba(255, 255, 255, 0.4);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.54),
    0 18px 45px rgba(9, 20, 46, 0.22);
  transform: translateZ(38px);
}

.poster-frame::after {
  position: absolute;
  inset: 0;
  content: '';
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.1), transparent 34%, rgba(13, 21, 45, 0.32)),
    radial-gradient(circle at 22% 18%, rgba(255,255,255,0.26), transparent 24%);
}

.poster-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  transition: transform 0.35s ease;
}

.movie-card:hover .poster-image {
  transform: scale(1.055);
}

.poster-number,
.poster-year {
  position: absolute;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  color: #fff;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.08em;
  border-radius: 999px;
  background: rgba(19, 31, 58, 0.48);
  border: 1px solid rgba(255,255,255,0.32);
  backdrop-filter: blur(12px);
}

.poster-number {
  top: 14px;
  left: 14px;
}

.poster-year {
  right: 14px;
  bottom: 14px;
}

.movie-content {
  position: relative;
  z-index: 3;
  padding: 22px 22px 24px;
  transform: translateZ(22px);
}

.movie-genre {
  margin: 0 0 10px;
  color: #7683a3;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.movie-content h3 {
  margin: 0 0 14px;
  color: #f7f9ff;
  font-size: 25px;
  font-weight: 850;
  line-height: 1.15;
  letter-spacing: -0.03em;
  text-shadow: 0 10px 24px rgba(7, 14, 32, 0.42);
}

.movie-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.movie-meta span {
  padding: 7px 10px;
  color: #e6edff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.24);
}

.movie-description {
  min-height: 70px;
  margin: 0;
  color: rgba(238, 244, 255, 0.84);
  font-size: 14px;
  line-height: 1.75;
}

.movie-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.movie-actions button {
  flex: 1;
  height: 42px;
  cursor: pointer;
  color: #edf4ff;
  font-size: 13px;
  font-weight: 800;
  border: 1px solid rgba(255,255,255,0.26);
  border-radius: 14px;
  background: rgba(255,255,255,0.13);
  backdrop-filter: blur(10px);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.movie-actions button:hover:not(:disabled) {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.24);
}

.movie-actions .save-button {
  color: #fff;
  border-color: rgba(255,255,255,0.36);
  background: linear-gradient(135deg, #ff77aa, #70bfff 55%, #9c8cff);
  box-shadow: 0 14px 32px rgba(91, 169, 255, 0.24);
}

.movie-actions .save-button.saved {
  cursor: not-allowed;
  color: rgba(237, 244, 255, 0.62);
  border-color: rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.12);
  box-shadow: none;
}

@media (hover: none) {
  .movie-card {
    transform: none !important;
  }
}
</style>
