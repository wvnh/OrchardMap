<template>
  <div class="orchard-grid">
    <div class="orchard-grid__header">
      <h3>Tree Grid - {{ rows }}x{{ cols }}</h3>
      <div class="orchard-grid__legend">
        <div class="orchard-grid__legend-item">
          <span class="orchard-grid__legend-icon" style="background-color: #2ecc71"></span>
          <span>Healthy</span>
        </div>
        <div class="orchard-grid__legend-item">
          <span class="orchard-grid__legend-icon" style="background-color: #f39c12"></span>
          <span>Needs Care</span>
        </div>
        <div class="orchard-grid__legend-item">
          <span class="orchard-grid__legend-icon" style="background-color: #e74c3c"></span>
          <span>Sick</span>
        </div>
        <div class="orchard-grid__legend-item">
          <span class="orchard-grid__legend-icon" style="background-color: #ecf0f1"></span>
          <span>Empty</span>
        </div>
      </div>
    </div>

    <div 
      class="orchard-grid__container"
      :style="gridStyle"
    >
      <div
        v-for="(row, rowIdx) in grid"
        :key="`row-${rowIdx}`"
        class="orchard-grid__row"
      >
        <div
          v-for="(tree, colIdx) in row"
          :key="`cell-${rowIdx}-${colIdx}`"
          class="orchard-grid__cell"
          :class="getCellClass(tree)"
          @click="handleCellClick(tree, rowIdx + 1, colIdx + 1)"
        >
          <div v-if="tree" class="orchard-grid__tree">
            <div class="orchard-grid__tree-icon">{{ getTreeIcon(tree) }}</div>
            <div class="orchard-grid__tree-info">
              <span class="orchard-grid__tree-position">{{ rowIdx + 1 }},{{ colIdx + 1 }}</span>
            </div>
          </div>
          <div v-else class="orchard-grid__empty">
            <span class="orchard-grid__empty-icon">➕</span>
            <span class="orchard-grid__empty-position">{{ rowIdx + 1 }},{{ colIdx + 1 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!grid || grid.length === 0" class="orchard-grid__empty-state">
      <p>No trees in this orchard yet.</p>
      <button 
        v-if="canAddTree"
        @click="$emit('add-tree')"
        class="orchard-grid__add-first-btn"
      >
        🌱 Add First Tree
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  grid: {
    type: Array,
    required: true
  },
  rows: {
    type: Number,
    required: true
  },
  cols: {
    type: Number,
    required: true
  },
  canAddTree: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['tree-click', 'empty-cell-click', 'add-tree'])

const gridStyle = computed(() => {
  const colWidth = props.cols > 10 ? '60px' : '80px'
  return {
    gridTemplateColumns: `repeat(${props.cols}, ${colWidth})`,
    maxWidth: '100%',
    overflowX: 'auto'
  }
})

const getCellClass = (tree) => {
  if (!tree) return 'orchard-grid__cell--empty'
  
  const classes = ['orchard-grid__cell--occupied']
  
  // Health status classes
  if (tree.health_status === 'healthy') {
    classes.push('orchard-grid__cell--healthy')
  } else if (tree.health_status === 'less_healthy') {
    classes.push('orchard-grid__cell--needs-care')
  } else if (tree.health_status === 'sick' || tree.health_status === 'quarantine') {
    classes.push('orchard-grid__cell--sick')
  }
  
  return classes.join(' ')
}

const getTreeIcon = (tree) => {
  if (!tree) return ''
  
  // Different icons based on condition and bloom status
  if (tree.bloom_status === 'blooming') return '🌸'
  if (tree.bloom_status === 'fruiting') return '🍎'
  if (tree.bloom_status === 'ripe') return '🍏'
  if (tree.condition === 'planted') return '🌱'
  if (tree.condition === 'productive') return '🌳'
  
  return '🌲'
}

const handleCellClick = (tree, row, col) => {
  if (tree) {
    emit('tree-click', tree)
  } else if (props.canAddTree) {
    emit('empty-cell-click', { row, col })
  }
}
</script>

<style scoped>
.orchard-grid {
  width: 100%;
}

.orchard-grid__header {
  margin-bottom: 1rem;
}

.orchard-grid__header h3 {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
}

.orchard-grid__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.orchard-grid__legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.orchard-grid__legend-icon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid #ddd;
}

.orchard-grid__container {
  display: grid;
  gap: 4px;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow-x: auto;
  width: 100%;
}

.orchard-grid__row {
  display: contents;
}

.orchard-grid__cell {
  aspect-ratio: 1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 60px;
  min-height: 60px;
}

.orchard-grid__cell:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.orchard-grid__cell--empty {
  background-color: #ecf0f1;
  border: 2px dashed #bdc3c7;
}

.orchard-grid__cell--occupied {
  background-color: white;
  border: 2px solid #ddd;
}

.orchard-grid__cell--healthy {
  border-color: #2ecc71;
  background-color: #e8f8f5;
}

.orchard-grid__cell--needs-care {
  border-color: #f39c12;
  background-color: #fef5e7;
}

.orchard-grid__cell--sick {
  border-color: #e74c3c;
  background-color: #fadbd8;
}

.orchard-grid__tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.orchard-grid__tree-icon {
  font-size: 2rem;
}

.orchard-grid__tree-info {
  font-size: 0.7rem;
  color: #666;
}

.orchard-grid__tree-position {
  font-weight: 600;
}

.orchard-grid__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: #95a5a6;
}

.orchard-grid__empty-icon {
  font-size: 1.5rem;
  opacity: 0.5;
}

.orchard-grid__empty-position {
  font-size: 0.7rem;
}

.orchard-grid__empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #95a5a6;
}

.orchard-grid__add-first-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.orchard-grid__add-first-btn:hover {
  background-color: #27ae60;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .orchard-grid__container {
    padding: 0.5rem;
  }

  .orchard-grid__cell {
    min-width: 50px;
    min-height: 50px;
  }

  .orchard-grid__tree-icon {
    font-size: 1.5rem;
  }

  .orchard-grid__legend {
    font-size: 0.75rem;
    gap: 0.5rem;
  }
}

/* Touch-friendly for mobile field work */
@media (max-width: 640px) and (hover: none) {
  .orchard-grid__cell {
    min-width: 60px;
    min-height: 60px;
  }
  
  .orchard-grid__cell:active {
    transform: scale(1.1);
  }
}
</style>
