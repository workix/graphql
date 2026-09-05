<template>
  <div class="skills-endorsements-card">
    <div class="card-header-bar d-flex justify-content-between align-items-center">
      <h3><i class="fa fa-certificate"></i> Competências e Endossos</h3>
      <button
        v-if="isOwnProfile"
        type="button"
        class="btn btn-sm btn-outline-primary"
        @click="showAddSkill = !showAddSkill"
      >
        <i class="fa" :class="showAddSkill ? 'fa-minus' : 'fa-plus'"></i>
        {{ showAddSkill ? 'Fechar' : 'Adicionar Competência' }}
      </button>
    </div>

    <div class="card-body">
      <!-- Add Skill Form (Only for own profile) -->
      <div v-if="isOwnProfile && showAddSkill" class="add-skill-box">
        <form @submit.prevent="handleAddSkill" class="d-flex gap-2">
          <input
            v-model="newSkillName"
            type="text"
            class="form-control form-control-sm"
            placeholder="Ex: Vue.js, TypeScript, PostgreSQL, Docker..."
            required
          />
          <button type="submit" class="btn btn-success btn-sm" :disabled="!newSkillName.trim()">
            <i class="fa fa-plus"></i> Adicionar
          </button>
        </form>
      </div>

      <!-- Skills Grid (Real Data) -->
      <div v-if="endorsementsStore.skills.length > 0" class="skills-grid">
        <div
          v-for="skill in endorsementsStore.skills"
          :key="skill.id"
          class="skill-item-box"
          :class="{ 'endorsed-by-me': skill.isEndorsedByMe }"
        >
          <div class="skill-main-info">
            <h4 class="skill-name">{{ skill.name }}</h4>
            <span class="endorsements-count">
              <i class="fa fa-thumbs-up"></i>
              {{ skill.endorsementsCount }} {{ skill.endorsementsCount === 1 ? 'endosso' : 'endossos' }}
            </span>
          </div>

          <div class="skill-actions d-flex align-items-center justify-content-between mt-2">
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
            <button
              v-if="isOwnProfile"
              type="button"
              class="btn btn-link btn-xs text-danger p-0"
              title="Remover competência"
              @click="handleRemoveSkill(skill.id)"
            >
              <i class="fa fa-trash-o"></i> Remover
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-skills">
        <p v-if="isOwnProfile">
          Nenhuma competência cadastrada ainda. Adicione suas principais habilidades e tecnologias para receber endossos de conexões e recrutadores!
        </p>
        <p v-else>
          Nenhuma competência cadastrada por este profissional ainda.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import useEndorsementsStore from '../stores/endorsements';

const props = defineProps<{
  userId: string | number;
  isOwnProfile: boolean;
}>();

const endorsementsStore = useEndorsementsStore();
const showAddSkill = ref(false);
const newSkillName = ref('');

onMounted(() => {
  if (props.userId) {
    endorsementsStore.fetchSkills(props.userId);
  }
});

watch(() => props.userId, (newId) => {
  if (newId) {
    endorsementsStore.fetchSkills(newId);
  }
});

async function handleAddSkill() {
  if (!newSkillName.value.trim()) return;
  await endorsementsStore.addSkill(props.userId, newSkillName.value.trim());
  newSkillName.value = '';
  showAddSkill.value = false;
}

async function handleRemoveSkill(skillId: string | number) {
  await endorsementsStore.removeSkill(props.userId, skillId);
}

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

.add-skill-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
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
  gap: 8px;
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

.empty-skills {
  text-align: center;
  color: #64748b;
  padding: 20px 0;
  font-size: 13px;
}
</style>
