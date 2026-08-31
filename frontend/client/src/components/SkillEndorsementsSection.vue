<template>
  <div class="skills-endorsements-card">
    <div class="card-header-bar">
      <h3><i class="fa fa-certificate"></i> Competências e Endossos</h3>
    </div>

    <div class="card-body">
      <div class="skills-grid">
        <div
          v-for="skill in endorsementsStore.skills"
          :key="skill.id"
          class="skill-item-box"
          :class="{ 'endorsed-by-me': skill.isEndorsedByMe }"
        >
          <div class="skill-main-info">
            <h4 class="skill-name">{{ skill.name }}</h4>
            <span class="endorsements-count">
              <i class="fa fa-thumbs-up"></i> {{ skill.endorsementsCount }} endossos
            </span>
          </div>

          <button
            v-if="!isOwnProfile"
            type="button"
            class="btn-endorse"
            :class="{ 'active': skill.isEndorsedByMe }"
            @click="handleToggleEndorse(skill.id)"
          >
            <i class="fa" :class="skill.isEndorsedByMe ? 'fa-check' : 'fa-plus'"></i>
            {{ skill.isEndorsedByMe ? 'Endossado' : 'Endossar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useEndorsementsStore from '../stores/endorsements';

defineProps<{
  userId: string | number;
  isOwnProfile: boolean;
}>();

const endorsementsStore = useEndorsementsStore();

function handleToggleEndorse(skillId: string | number) {
  endorsementsStore.toggleEndorseSkill(skillId);
}
</script>

<style scoped>
.skills-endorsements-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.card-header-bar {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.card-header-bar h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header-bar h3 i {
  color: #0284c7;
}

.card-body {
  padding: 20px 24px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.skill-item-box {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.2s ease;
}

.skill-item-box.endorsed-by-me {
  background: #f0fdf4;
  border-color: #86efac;
}

.skill-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.endorsements-count {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.btn-endorse {
  align-self: flex-start;
  background: #ffffff;
  border: 1px solid #0284c7;
  color: #0284c7;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-endorse:hover {
  background: #f0f9ff;
}

.btn-endorse.active {
  background: #22c55e;
  border-color: #22c55e;
  color: #ffffff;
}
</style>
