<script setup>
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()

const typeMeta = {
  success: {
    icon: '✓',
    label: '成功',
  },
  warning: {
    icon: '!',
    label: '警告',
  },
  error: {
    icon: '×',
    label: '错误',
  },
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-viewport" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast" tag="div" class="toast-stack">
        <article
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          role="alert"
        >
          <div class="toast-icon">
            {{ typeMeta[toast.type]?.icon || 'i' }}
          </div>

          <div class="toast-content">
            <div class="toast-head">
              <span class="toast-label">
                {{ typeMeta[toast.type]?.label || '提示' }}
              </span>
              <span class="toast-title">
                {{ toast.title }}
              </span>
            </div>

            <p class="toast-message">
              {{ toast.message }}
            </p>
          </div>

          <button
            class="toast-close"
            type="button"
            aria-label="关闭通知"
            @click="removeToast(toast.id)"
          >
            ×
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-viewport {
  position: fixed;
  top: 28px;
  right: 28px;
  z-index: 9999;
  width: min(430px, calc(100vw - 40px));
  pointer-events: none;
}

.toast-stack {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.toast {
  --toast-main: #66d19e;
  --toast-soft: rgba(102, 209, 158, 0.2);
  --toast-bg: rgba(236, 255, 246, 0.86);
  --toast-text: #163f2c;

  position: relative;
  display: grid;
  grid-template-columns: 46px 1fr 32px;
  align-items: start;
  gap: 14px;
  padding: 17px 16px 17px 18px;
  overflow: hidden;
  color: var(--toast-text);
  border: 1px solid color-mix(in srgb, var(--toast-main) 56%, white);
  border-left: 6px solid var(--toast-main);
  border-radius: 22px;
  background:
    linear-gradient(135deg, var(--toast-bg), rgba(255, 255, 255, 0.72)),
    radial-gradient(circle at 92% 18%, var(--toast-soft), transparent 36%);
  box-shadow:
    0 18px 44px rgba(20, 31, 60, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.34) inset;
  backdrop-filter: blur(18px);
  pointer-events: auto;
}

.toast--success {
  --toast-main: #30c67c;
  --toast-soft: rgba(48, 198, 124, 0.24);
  --toast-bg: rgba(235, 255, 245, 0.88);
  --toast-text: #0f5132;
}

.toast--warning {
  --toast-main: #f6b73c;
  --toast-soft: rgba(246, 183, 60, 0.28);
  --toast-bg: rgba(255, 249, 231, 0.9);
  --toast-text: #684300;
}

.toast--error {
  --toast-main: #ff5d73;
  --toast-soft: rgba(255, 93, 115, 0.25);
  --toast-bg: rgba(255, 238, 242, 0.9);
  --toast-text: #842029;
}

.toast-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #fff;
  font-size: 21px;
  font-weight: 950;
  border-radius: 50%;
  background: var(--toast-main);
  box-shadow:
    0 0 0 6px var(--toast-soft),
    0 12px 26px color-mix(in srgb, var(--toast-main) 42%, transparent);
}

.toast-content {
  min-width: 0;
}

.toast-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
}

.toast-label {
  padding: 3px 8px;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  border-radius: 999px;
  background: var(--toast-main);
}

.toast-title {
  color: var(--toast-text);
  font-size: 14px;
  font-weight: 950;
  letter-spacing: 0.04em;
}

.toast-message {
  margin: 0;
  color: color-mix(in srgb, var(--toast-text) 82%, #41506f);
  font-size: 13px;
  line-height: 1.55;
}

.toast-close {
  width: 30px;
  height: 30px;
  padding: 0;
  display: grid;
  place-items: center;
  color: var(--toast-text);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 50%;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.toast-close:hover {
  transform: scale(1.08) rotate(8deg);
  background: rgba(255, 255, 255, 0.82);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(34px) scale(0.88) rotate(3deg);
}

@media (max-width: 640px) {
  .toast-viewport {
    top: 18px;
    right: 18px;
    width: calc(100vw - 36px);
  }
}
</style>