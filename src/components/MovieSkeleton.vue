<template>
  <div class="skeleton-grid" aria-label="Loading anime movie collection">
    <article v-for="item in 6" :key="item" class="skeleton-card">
      <div class="skeleton-poster shimmer"></div>
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-label shimmer"></div>
        <div class="skeleton-line skeleton-title shimmer"></div>
        <div class="skeleton-line skeleton-title short shimmer"></div>
        <div class="skeleton-line skeleton-meta shimmer"></div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.skeleton-grid {
  width: min(1380px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 26px;
}

.skeleton-card {
  overflow: hidden;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255,255,255,0.52);
  box-shadow: 0 24px 66px rgba(90, 115, 160, 0.16);
  backdrop-filter: blur(18px) saturate(1.22);
}

.skeleton-poster {
  width: calc(100% - 34px);
  aspect-ratio: 2 / 3;
  margin: 17px auto 0;
  border-radius: 22px;
}

.skeleton-content { padding: 22px 22px 24px; }

.skeleton-line {
  height: 13px;
  margin-bottom: 14px;
  border-radius: 999px;
}

.skeleton-label { width: 36%; height: 10px; }
.skeleton-title { width: 88%; height: 22px; }
.skeleton-title.short { width: 58%; }
.skeleton-meta { width: 48%; height: 12px; margin-top: 22px; margin-bottom: 0; }

.shimmer {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255,143,183,0.22), rgba(115,199,255,0.24), rgba(166,148,255,0.18));
}

.shimmer::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.66) 48%, transparent 76%);
  transform: translateX(-100%);
  animation: shimmer 1.25s infinite;
}

@keyframes shimmer { to { transform: translateX(100%); } }

@media (max-width: 1000px) {
  .skeleton-grid { grid-template-columns: 1fr; }
}
</style>
