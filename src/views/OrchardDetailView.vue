<template>
  <div class="orchard-detail-view">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading orchard details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>❌ Error loading orchard: {{ error }}</p>
      <button @click="loadOrchardData" class="btn btn--secondary">
        🔄 Retry
      </button>
      <button @click="goBack" class="btn btn--secondary">
        ← Back to List
      </button>
    </div>

    <!-- Orchard Content -->
    <div v-else-if="orchard" class="orchard-content">
      <!-- Header -->
      <div class="orchard-header">
        <button @click="goBack" class="back-btn">
          ← Back
        </button>
        <div class="orchard-header__main">
          <div class="orchard-header__title-row">
            <h1 class="orchard-title">{{ orchard.name }}</h1>
            <PermissionBadge :orchard="orchard" />
          </div>
          <div class="orchard-meta">
            <span class="orchard-meta__item">
              📍 {{ orchard.location_name || 'Location not specified' }}
            </span>
            <span class="orchard-meta__item">
              {{ orchard.is_public ? '🌍 Public' : '🔒 Private' }}
            </span>
          </div>
        </div>
        <div v-if="canEdit" class="orchard-actions">
          <button @click="showEditModal = true" class="btn btn--secondary">
            ✏️ Edit
          </button>
        </div>
      </div>

      <!-- Description -->
      <div v-if="orchard.description" class="orchard-description">
        <p>{{ orchard.description }}</p>
      </div>

      <!-- GPS Coordinates -->
      <div class="orchard-info-card">
        <h3>📍 Location Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Latitude:</span>
            <span class="info-value">{{ orchard.latitude }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Longitude:</span>
            <span class="info-value">{{ orchard.longitude }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Owner:</span>
            <span class="info-value">
              {{ orchard.owner ? `${orchard.owner.first_name} ${orchard.owner.last_name}` : 'Unknown' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Trees Section -->
      <div class="trees-section">
        <div class="trees-section__header">
          <h2>🌳 Trees ({{ trees.length }})</h2>
          <button
            v-if="canAddTrees(orchard)"
            @click="showAddTreeModal = true"
            class="btn btn--primary"
          >
            ➕ Add Tree
          </button>
        </div>

        <!-- Tree Filters -->
        <div v-if="trees.length > 0" class="tree-filters">
          <input
            v-model="treeSearchQuery"
            type="text"
            placeholder="Search trees by species..."
            class="search-input"
          />
          <select v-model="conditionFilter" class="filter-select">
            <option value="">All Conditions</option>
            <option value="planted">Planted</option>
            <option value="not_productive">Not Productive</option>
            <option value="productive">Productive</option>
            <option value="dormant">Dormant</option>
          </select>
          <select v-model="healthFilter" class="filter-select">
            <option value="">All Health Status</option>
            <option value="healthy">Healthy</option>
            <option value="less_healthy">Less Healthy</option>
            <option value="sick">Sick</option>
            <option value="quarantine">Quarantine</option>
          </select>
        </div>

        <!-- Tree Grid -->
        <OrchardGrid
          v-if="treeGridData"
          :grid="treeGridData.grid"
          :rows="treeGridData.rows"
          :cols="treeGridData.cols"
          :can-add-tree="canAddTrees(orchard)"
          @tree-click="handleTreeClick"
          @empty-cell-click="handleEmptyCellClick"
          @add-tree="showAddTreeModal = true"
        />

        <!-- Empty State -->
        <div v-else class="empty-trees-state">
          <div class="empty-state__icon">🌱</div>
          <p>No trees in this orchard yet.</p>
          <button
            v-if="canAddTrees(orchard)"
            @click="showAddTreeModal = true"
            class="btn btn--primary"
          >
            🌱 Add First Tree
          </button>
        </div>
      </div>
    </div>

    <!-- Tree Detail Modal -->
    <TreeDetailModal
      :show="showTreeModal"
      :tree="selectedTree"
      :can-edit="canEdit"
      :can-delete="canEdit"
      @close="closeTreeModal"
      @edit="handleEditTree"
      @delete="handleDeleteTree"
    />

    <!-- Orchard Edit Modal -->
    <OrchardFormModal
      v-if="showEditModal"
      :show="showEditModal"
      :orchard="orchard"
      @close="showEditModal = false"
      @save="handleUpdateOrchard"
    />

    <!-- Tree Form Modal -->
    <TreeFormModal
      v-if="showAddTreeModal || showEditTreeModal"
      :show="showAddTreeModal || showEditTreeModal"
      :tree="editingTree"
      :orchard-id="orchardId"
      :suggested-position="suggestedPosition"
      @close="closeTreeFormModals"
      @save="handleSaveTree"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrchards } from '@/composables/useOrchards.js'
import { useTrees } from '@/composables/useTrees.js'
import PermissionBadge from '@/components/common/PermissionBadge.vue'
import OrchardGrid from '@/components/orchard/OrchardGrid.vue'
import TreeDetailModal from '@/components/tree/TreeDetailModal.vue'
import OrchardFormModal from '@/components/orchard/OrchardFormModal.vue'
import TreeFormModal from '@/components/tree/TreeFormModal.vue'

const route = useRoute()
const router = useRouter()

const orchardId = computed(() => route.params.id)

const {
  loading: orchardLoading,
  error: orchardError,
  fetchOrchardById,
  updateOrchard,
  canEditOrchard,
  canAddTrees
} = useOrchards()

const {
  trees,
  loading: treesLoading,
  error: treesError,
  fetchTreesByOrchard,
  createTree,
  updateTree,
  removeTree,
  getTreeGrid,
  searchBySpecies,
  filterByCondition,
  filterByHealth
} = useTrees()

const orchard = ref(null)
const loading = computed(() => orchardLoading.value || treesLoading.value)
const error = computed(() => orchardError.value || treesError.value)

const canEdit = computed(() => orchard.value ? canEditOrchard(orchard.value) : false)

const treeSearchQuery = ref('')
const conditionFilter = ref('')
const healthFilter = ref('')

const showTreeModal = ref(false)
const showEditModal = ref(false)
const showAddTreeModal = ref(false)
const showEditTreeModal = ref(false)
const selectedTree = ref(null)
const editingTree = ref(null)
const suggestedPosition = ref(null)

onMounted(async () => {
  await loadOrchardData()
})

const loadOrchardData = async () => {
  orchard.value = await fetchOrchardById(orchardId.value)
  if (orchard.value) {
    await fetchTreesByOrchard(orchardId.value)
  }
}

const filteredTrees = computed(() => {
  let filtered = trees.value

  // Apply search filter
  if (treeSearchQuery.value) {
    filtered = searchBySpecies(treeSearchQuery.value)
  }

  // Apply condition filter
  if (conditionFilter.value) {
    filtered = filterByCondition(conditionFilter.value)
  }

  // Apply health filter
  if (healthFilter.value) {
    filtered = filterByHealth(healthFilter.value)
  }

  return filtered
})

const treeGridData = computed(() => {
  if (filteredTrees.value.length === 0) return null
  return getTreeGrid(filteredTrees.value)
})

const goBack = () => {
  router.push({ name: 'orchard-list' })
}

const handleTreeClick = (tree) => {
  selectedTree.value = tree
  showTreeModal.value = true
}

const handleEmptyCellClick = ({ row, col }) => {
  suggestedPosition.value = { row, col }
  showAddTreeModal.value = true
}

const closeTreeModal = () => {
  showTreeModal.value = false
  selectedTree.value = null
}

const handleEditTree = (tree) => {
  editingTree.value = tree
  showTreeModal.value = false
  showEditTreeModal.value = true
}

const handleDeleteTree = async (tree) => {
  try {
    await removeTree(tree.id)
    alert('Tree removed successfully!')
    showTreeModal.value = false
  } catch (err) {
    alert(`Failed to remove tree: ${err.message}`)
  }
}

const closeTreeFormModals = () => {
  showAddTreeModal.value = false
  showEditTreeModal.value = false
  editingTree.value = null
  suggestedPosition.value = null
}

const handleSaveTree = async (treeData) => {
  try {
    if (editingTree.value) {
      await updateTree(editingTree.value.id, treeData)
      alert('Tree updated successfully!')
    } else {
      await createTree(treeData)
      alert('Tree added successfully!')
    }
    closeTreeFormModals()
  } catch (err) {
    alert(`Failed to save tree: ${err.message}`)
  }
}

const handleUpdateOrchard = async (orchardData) => {
  try {
    await updateOrchard(orchardId.value, orchardData)
    alert('Orchard updated successfully!')
    showEditModal.value = false
    await loadOrchardData()
  } catch (err) {
    alert(`Failed to update orchard: ${err.message}`)
  }
}
</script>

<style scoped>
.orchard-detail-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #ecf0f1;
  border-top-color: #3498db;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state p {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.error-state .btn {
  margin: 0.5rem;
}

.back-btn {
  background: none;
  border: none;
  color: #3498db;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #2980b9;
}

.orchard-header {
  margin-bottom: 2rem;
}

.orchard-header__main {
  margin-bottom: 1rem;
}

.orchard-header__title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.orchard-title {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
}

.orchard-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  color: #666;
}

.orchard-meta__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.orchard-actions {
  display: flex;
  gap: 0.75rem;
}

.orchard-description {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #3498db;
}

.orchard-description p {
  margin: 0;
  line-height: 1.6;
  color: #555;
}

.orchard-info-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.orchard-info-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: #7f8c8d;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #2c3e50;
}

.trees-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.trees-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.trees-section__header h2 {
  margin: 0;
  color: #2c3e50;
}

.tree-filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.filter-select {
  min-width: 150px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3498db;
}

.empty-trees-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #95a5a6;
}

.empty-state__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn--primary {
  background-color: #2ecc71;
  color: white;
}

.btn--primary:hover {
  background-color: #27ae60;
}

.btn--secondary {
  background-color: #3498db;
  color: white;
}

.btn--secondary:hover {
  background-color: #2980b9;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .orchard-detail-view {
    padding: 1rem;
  }

  .orchard-title {
    font-size: 1.5rem;
  }

  .orchard-header__title-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .orchard-actions {
    width: 100%;
  }

  .orchard-actions .btn {
    flex: 1;
  }

  .trees-section__header {
    flex-direction: column;
    align-items: stretch;
  }

  .tree-filters {
    flex-direction: column;
  }

  .search-input,
  .filter-select {
    width: 100%;
  }
}
</style>
