<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content" :class="{ 'modal-content--large': tree }">
      <div class="modal-header">
        <h2>{{ tree ? 'Tree Details' : 'Loading...' }}</h2>
        <button @click="handleClose" class="modal-close" aria-label="Close">×</button>
      </div>

      <div v-if="tree" class="modal-body">
        <!-- Tree Position -->
        <section class="modal-section">
          <h3 class="modal-section__title">📍 Position</h3>
          <div class="modal-info-grid">
            <div class="modal-info-item">
              <span class="modal-info-label">Row:</span>
              <span class="modal-info-value">{{ tree.row_number }}</span>
            </div>
            <div class="modal-info-item">
              <span class="modal-info-label">Column:</span>
              <span class="modal-info-value">{{ tree.column_number }}</span>
            </div>
            <div v-if="tree.latitude && tree.longitude" class="modal-info-item modal-info-item--full">
              <span class="modal-info-label">GPS:</span>
              <span class="modal-info-value">{{ tree.latitude }}, {{ tree.longitude }}</span>
            </div>
          </div>
        </section>

        <!-- Species Information -->
        <section v-if="tree.tree_species" class="modal-section">
          <h3 class="modal-section__title">🌳 Species Information</h3>
          <div class="species-card">
            <h4 class="species-card__title">{{ tree.tree_species.variety_name }}</h4>
            <div class="species-card__type">{{ tree.tree_species.fruit_type || 'Unknown type' }}</div>
            
            <div v-if="tree.tree_species.synonyms && tree.tree_species.synonyms.length" class="species-card__synonyms">
              <strong>Also known as:</strong> {{ tree.tree_species.synonyms.join(', ') }}
            </div>

            <div class="modal-info-grid">
              <div v-if="tree.tree_species.origin_country" class="modal-info-item">
                <span class="modal-info-label">Origin:</span>
                <span class="modal-info-value">{{ tree.tree_species.origin_country }}</span>
              </div>
              <div v-if="tree.tree_species.bloom_period" class="modal-info-item">
                <span class="modal-info-label">Bloom Period:</span>
                <span class="modal-info-value">{{ formatEnum(tree.tree_species.bloom_period) }}</span>
              </div>
              <div v-if="tree.tree_species.productivity_period" class="modal-info-item">
                <span class="modal-info-label">Productivity:</span>
                <span class="modal-info-value">{{ formatEnum(tree.tree_species.productivity_period) }}</span>
              </div>
              <div v-if="tree.tree_species.fruit_size" class="modal-info-item">
                <span class="modal-info-label">Fruit Size:</span>
                <span class="modal-info-value">{{ formatEnum(tree.tree_species.fruit_size) }}</span>
              </div>
            </div>

            <div v-if="tree.tree_species.taste_profile" class="species-card__taste">
              <strong>Taste Profile:</strong> {{ tree.tree_species.taste_profile }}
            </div>
          </div>
        </section>

        <!-- Tree Status -->
        <section class="modal-section">
          <h3 class="modal-section__title">📊 Status</h3>
          <div class="status-grid">
            <div class="status-item" :class="`status-item--${tree.condition}`">
              <span class="status-label">Condition</span>
              <span class="status-value">{{ formatEnum(tree.condition) }}</span>
            </div>
            <div class="status-item" :class="`status-item--${tree.health_status}`">
              <span class="status-label">Health</span>
              <span class="status-value">{{ formatEnum(tree.health_status) }}</span>
            </div>
            <div class="status-item" :class="`status-item--${tree.bloom_status}`">
              <span class="status-label">Bloom</span>
              <span class="status-value">{{ formatEnum(tree.bloom_status) }}</span>
            </div>
            <div class="status-item" :class="`status-item--${tree.maintenance_status}`">
              <span class="status-label">Maintenance</span>
              <span class="status-value">{{ formatEnum(tree.maintenance_status) }}</span>
            </div>
          </div>
        </section>

        <!-- Planting Information -->
        <section class="modal-section">
          <h3 class="modal-section__title">🗓️ Dates</h3>
          <div class="modal-info-grid">
            <div v-if="tree.planted_date" class="modal-info-item">
              <span class="modal-info-label">Planted:</span>
              <span class="modal-info-value">{{ formatDate(tree.planted_date) }}</span>
            </div>
            <div v-if="tree.removed_date" class="modal-info-item">
              <span class="modal-info-label">Removed:</span>
              <span class="modal-info-value">{{ formatDate(tree.removed_date) }}</span>
            </div>
            <div class="modal-info-item">
              <span class="modal-info-label">Created:</span>
              <span class="modal-info-value">{{ formatDate(tree.created_at) }}</span>
            </div>
            <div class="modal-info-item">
              <span class="modal-info-label">Updated:</span>
              <span class="modal-info-value">{{ formatDate(tree.updated_at) }}</span>
            </div>
          </div>
        </section>

        <!-- Notes -->
        <section v-if="tree.notes" class="modal-section">
          <h3 class="modal-section__title">📝 Notes</h3>
          <p class="tree-notes">{{ tree.notes }}</p>
        </section>

        <!-- Actions -->
        <div v-if="canEdit || canDelete" class="modal-actions">
          <button
            v-if="canEdit"
            @click="handleEdit"
            class="modal-btn modal-btn--edit"
          >
            ✏️ Edit Tree
          </button>
          <button
            v-if="canDelete"
            @click="handleDelete"
            class="modal-btn modal-btn--delete"
          >
            🗑️ Remove Tree
          </button>
        </div>
      </div>

      <div v-else class="modal-loading">
        <div class="spinner"></div>
        <p>Loading tree details...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  tree: {
    type: Object,
    default: null
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  canDelete: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'edit', 'delete'])

const handleClose = () => {
  emit('close')
}

const handleEdit = () => {
  emit('edit', props.tree)
}

const handleDelete = () => {
  if (confirm('Are you sure you want to remove this tree? This action cannot be undone.')) {
    emit('delete', props.tree)
  }
}

const formatEnum = (value) => {
  if (!value) return 'N/A'
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-content--large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #95a5a6;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem;
}

.modal-section {
  margin-bottom: 2rem;
}

.modal-section:last-child {
  margin-bottom: 0;
}

.modal-section__title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #34495e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.modal-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-info-item--full {
  grid-column: 1 / -1;
}

.modal-info-label {
  font-size: 0.875rem;
  color: #7f8c8d;
  font-weight: 500;
}

.modal-info-value {
  font-size: 1rem;
  color: #2c3e50;
}

.species-card {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #2ecc71;
}

.species-card__title {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.species-card__type {
  color: #7f8c8d;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.species-card__synonyms,
.species-card__taste {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  border-left: 4px solid #95a5a6;
}

.status-item--healthy,
.status-item--productive {
  border-left-color: #2ecc71;
  background-color: #e8f8f5;
}

.status-item--less_healthy,
.status-item--not_productive {
  border-left-color: #f39c12;
  background-color: #fef5e7;
}

.status-item--sick,
.status-item--quarantine {
  border-left-color: #e74c3c;
  background-color: #fadbd8;
}

.status-label {
  font-size: 0.75rem;
  color: #7f8c8d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.status-value {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.tree-notes {
  background-color: #fffbea;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #f39c12;
  margin: 0;
  line-height: 1.6;
  color: #555;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.modal-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-btn--edit {
  background-color: #3498db;
  color: white;
}

.modal-btn--edit:hover {
  background-color: #2980b9;
}

.modal-btn--delete {
  background-color: #e74c3c;
  color: white;
}

.modal-btn--delete:hover {
  background-color: #c0392b;
}

.modal-loading {
  padding: 3rem;
  text-align: center;
  color: #95a5a6;
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

/* Mobile responsive */
@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-info-grid,
  .status-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
