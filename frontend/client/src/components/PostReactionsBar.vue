<template>
  <div class="post-reactions-bar">
    <!-- Top Summary Counts -->
    <div class="reactions-summary" v-if="reactionsCount > 0 || commentsCount > 0">
      <div class="reactions-icons-count" v-if="reactionsCount > 0">
        <span class="mini-reaction-badge like"><i class="fa fa-thumbs-up"></i></span>
        <span class="mini-reaction-badge love"><i class="fa fa-heart"></i></span>
        <span class="mini-reaction-badge clap"><i class="fa fa-hand-paper-o"></i></span>
        <span class="reactions-total">{{ reactionsCount }}</span>
      </div>
      <div class="comments-count" v-if="commentsCount > 0" @click="$emit('toggle-comments')">
        {{ commentsCount }} {{ commentsCount === 1 ? 'comentário' : 'comentários' }}
      </div>
    </div>

    <!-- Actions Buttons -->
    <div class="reactions-actions">
      <!-- Main React Button with Hover Popup -->
      <div class="react-btn-container" @mouseleave="showEmojiPicker = false">
        <button
          type="button"
          class="action-btn react-btn"
          :class="{ active: !!userReaction }"
          @click="handleMainReactionClick"
          @mouseenter="showEmojiPicker = true"
        >
          <i :class="getReactionIcon(userReaction)"></i>
          <span>{{ getReactionLabel(userReaction) }}</span>
        </button>

        <!-- Hover Popup Picker -->
        <transition name="pop">
          <div class="emoji-picker-popup" v-if="showEmojiPicker">
            <button
              v-for="r in REACTION_TYPES"
              :key="r.type"
              type="button"
              class="emoji-item"
              :title="r.label"
              @click="selectReaction(r.type)"
            >
              <span class="emoji-symbol">{{ r.emoji }}</span>
            </button>
          </div>
        </transition>
      </div>

      <!-- Comment Toggle Button -->
      <button type="button" class="action-btn" @click="$emit('toggle-comments')">
        <i class="fa fa-commenting-o"></i>
        <span>Comentar</span>
      </button>

      <!-- Share Button -->
      <button type="button" class="action-btn" @click="handleShare">
        <i class="fa fa-share"></i>
        <span>Compartilhar</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  reactionsCount: number;
  commentsCount: number;
  userReaction?: string | null;
}>();

const emit = defineEmits<{
  (e: 'react', type: string): void;
  (e: 'toggle-comments'): void;
}>();

const showEmojiPicker = ref(false);

const REACTION_TYPES = [
  { type: 'LIKE', label: 'Curtir', emoji: '👍', icon: 'fa fa-thumbs-up' },
  { type: 'CELEBRATE', label: 'Parabéns', emoji: '👏', icon: 'fa fa-hand-paper-o' },
  { type: 'SUPPORT', label: 'Apoiar', emoji: '🤝', icon: 'fa fa-users' },
  { type: 'LOVE', label: 'Amei', emoji: '❤️', icon: 'fa fa-heart' },
  { type: 'INSIGHTFUL', label: 'Genial', emoji: '💡', icon: 'fa fa-lightbulb-o' },
  { type: 'FUNNY', label: 'Engraçado', emoji: '😄', icon: 'fa fa-smile-o' }
];

function selectReaction(type: string) {
  emit('react', type);
  showEmojiPicker.value = false;
}

function handleMainReactionClick() {
  if (props.userReaction) {
    emit('react', props.userReaction); // Desativa
  } else {
    emit('react', 'LIKE');
  }
}

function getReactionLabel(type?: string | null) {
  if (!type) return 'Curtir';
  const found = REACTION_TYPES.find((r) => r.type === type);
  return found ? found.label : 'Curtir';
}

function getReactionIcon(type?: string | null) {
  if (!type) return 'fa fa-thumbs-o-up';
  const found = REACTION_TYPES.find((r) => r.type === type);
  return found ? found.icon : 'fa fa-thumbs-up';
}

function handleShare() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado para a área de transferência!');
  }
}
</script>

<style scoped>
.post-reactions-bar {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
  margin-top: 12px;
}

.reactions-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 8px 4px;
  font-size: 13px;
  color: #64748b;
}

.reactions-icons-count {
  display: flex;
  align-items: center;
  gap: 3px;
}

.mini-reaction-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #fff;
  margin-right: -4px;
}

.mini-reaction-badge.like {
  background: #0284c7;
}

.mini-reaction-badge.love {
  background: #ef4444;
}

.mini-reaction-badge.clap {
  background: #10b981;
}

.reactions-total {
  margin-left: 8px;
  font-weight: 600;
  color: #475569;
}

.comments-count {
  cursor: pointer;
  transition: color 0.2s ease;
}

.comments-count:hover {
  color: #0284c7;
  text-decoration: underline;
}

.reactions-actions {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #f8fafc;
  padding-top: 6px;
}

.react-btn-container {
  position: relative;
  flex: 1;
}

.action-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.action-btn.active {
  color: #0284c7;
}

.emoji-picker-popup {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 30px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  z-index: 50;
  margin-bottom: 8px;
}

.emoji-item {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  padding: 2px 4px;
  transition: transform 0.15s ease;
  line-height: 1;
}

.emoji-item:hover {
  transform: scale(1.35) translateY(-4px);
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}
</style>
