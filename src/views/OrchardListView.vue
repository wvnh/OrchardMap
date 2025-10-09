<template>
  <div class="orchard-list-view">
    <!-- Header -->
    <div class="view-header">
      <h1 class="view-title">🌳 My Orchards</h1>
      <button
        v-if="canCreateOrchard"
        @click="showCreateModal = true"
        class="btn btn--primary"
      >
        ➕ New Orchard
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search orchards by name or location..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>

      <div class="filters">
        <button
          @click="visibilityFilter = null"
          class="filter-btn"
          :class="{ 'filter-btn--active': visibilityFilter === null }"
        >
          All
        </button>
        <button
          @click="visibilityFilter = true"
          class="filter-btn"
          :class="{ 'filter-btn--active': visibilityFilter === true }"
        >
          🌍 Public
        </button>
        <button
          @click="visibilityFilter = false"
          class="filter-btn"
          :class="{ 'filter-btn--active': visibilityFilter === false }"
        >
          🔒 Private
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading orchards...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>❌ Error loading orchards: {{ error }}</p>
      <button @click="loadOrchards" class="btn btn--secondary">
        🔄 Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="displayedOrchards.length === 0" class="empty-state">
      <div class="empty-state__icon">🌱</div>
      <h2>No orchards found</h2>
      <p v-if="searchQuery">
        No orchards match your search criteria.
      </p>
      <p v-else-if="!user">
        Please log in to see your orchards or view public orchards.
      </p>
      <p v-else>
        Get started by creating your first orchard!
      </p>
      <button
        v-if="canCreateOrchard"
        @click="showCreateModal = true"
        class="btn btn--primary"
      >
        ➕ Create Your First Orchard
      </button>
    </div>

    <!-- Orchards Grid -->
    <div v-else class="orchards-grid">
      <OrchardCard
        v-for="orchard in displayedOrchards"
        :key="orchard.id"
        :orchard="orchard"
        :tree-count="getTreeCount(orchard.id)"
        :can-edit="canEditOrchard(orchard)"
        :can-delete="canDeleteOrchard(orchard)"
        :show-owner="userRole === 'admin'"
        @click="viewOrchardDetail(orchard.id)"
        @edit="handleEditOrchard(orchard)"
        @delete="handleDeleteOrchard(orchard)"
      />
    </div>

    <!-- Create/Edit Orchard Modal -->
    <OrchardFormModal
      v-if="showCreateModal || showEditModal"
      :show="showCreateModal || showEditModal"
      :orchard="editingOrchard"
      @close="closeModals"
      @save="handleSaveOrchard"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import { useOrchards } from '../../composables/useOrchards.js'
import OrchardCard from '../../components/orchard/OrchardCard.vue'
import OrchardFormModal from '../../components/orchard/OrchardFormModal.vue'

const router = useRouter()
const { user, userRole } = useAuth()
const {
  orchards,
  loading,
  error,
  fetchOrchards,
  createOrchard,
  updateOrchard,
  deleteOrchard,
  canEditOrchard,
  canDeleteOrchard,
  searchOrchards,
  filterByVisibility
} = useOrchards()

const searchQuery = ref('')
const visibilityFilter = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingOrchard = ref(null)
const treeCounts = ref({})

const canCreateOrchard = computed(() => {
  if (!user.value) return false
  return ['admin', 'orchard_manager'].includes(userRole.value)
})

// Load orchards on mount
onMounted(async () => {
  await loadOrchards()
})

const loadOrchards = async () => {
  await fetchOrchards()
  // In a real app, you would also fetch tree counts for each orchard
  // For now, we'll set them to 0
  orchards.value.forEach(orchard => {
    treeCounts.value[orchard.id] = 0
  })
}

const getTreeCount = (orchardId) => {
  return treeCounts.value[orchardId] || 0
}

const displayedOrchards = computed(() => {
  let filtered = orchards.value

  // Apply search filter
  if (searchQuery.value) {
    filtered = searchOrchards.value(searchQuery.value)
  }

  // Apply visibility filter
  if (visibilityFilter.value !== null) {
    filtered = filterByVisibility.value(visibilityFilter.value)
  }

  return filtered
})

const viewOrchardDetail = (orchardId) => {
  router.push({ name: 'orchard-detail', params: { id: orchardId } })
}

const handleEditOrchard = (orchard) => {
  editingOrchard.value = orchard
  showEditModal.value = true
}

const handleDeleteOrchard = async (orchard) => {
  if (!confirm(`Are you sure you want to delete "${orchard.name}"? This action cannot be undone.`)) {
    return
  }

  try {
    await deleteOrchard(orchard.id)
    alert('Orchard deleted successfully!')
  } catch (err) {
    alert(`Failed to delete orchard: ${err.message}`)
  }
}

const handleSaveOrchard = async (orchardData) => {
  try {
    if (editingOrchard.value) {
      await updateOrchard(editingOrchard.value.id, orchardData)
      alert('Orchard updated successfully!')
    } else {
      await createOrchard(orchardData)
      alert('Orchard created successfully!')
    }
    closeModals()
  } catch (err) {
    alert(`Failed to save orchard: ${err.message}`)
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingOrchard.value = null
}
</script>

<style scoped>
.orchard-list-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.view-title {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
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

.search-bar {
  margin-bottom: 2rem;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #95a5a6;
  pointer-events: none;
}

.filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background-color: #ecf0f1;
  color: #2c3e50;
  border: 2px solid transparent;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background-color: #d5dbdb;
}

.filter-btn--active {
  background-color: #3498db;
  color: white;
  border-color: #2980b9;
}

.orchards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.loading-state,
.error-state,
.empty-state {
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

.empty-state__icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-state h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.error-state p {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .orchard-list-view {
    padding: 1rem;
  }

  .view-header {
    flex-direction: column;
    align-items: stretch;
  }

  .view-title {
    font-size: 1.5rem;
  }

  .btn {
    width: 100%;
  }

  .orchards-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
