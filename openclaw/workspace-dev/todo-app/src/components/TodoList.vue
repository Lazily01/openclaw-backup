<script setup>
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'

const props = defineProps({
  todos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle', 'remove', 'update', 'clearCompleted'])

// 筛选状态
const filter = ref('all') // all, active, completed

// 筛选后的待办列表
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return props.todos.filter(t => !t.completed)
    case 'completed':
      return props.todos.filter(t => t.completed)
    default:
      return props.todos
  }
})

// 统计信息
const totalCount = computed(() => props.todos.length)
const completedCount = computed(() => props.todos.filter(t => t.completed).length)
const activeCount = computed(() => totalCount.value - completedCount.value)

/**
 * 切换筛选条件
 * @param {string} newFilter - 新的筛选条件
 */
const setFilter = (newFilter) => {
  filter.value = newFilter
}

/**
 * 转发事件
 */
const handleToggle = (id) => emit('toggle', id)
const handleRemove = (id) => emit('remove', id)
const handleUpdate = (id, content) => emit('update', id, content)
const handleClearCompleted = () => emit('clearCompleted')

import { ref } from 'vue'
</script>

<template>
  <div class="todo-list-container">
    <!-- 筛选按钮组 -->
    <div class="filter-bar" v-if="todos.length > 0">
      <div class="filter-buttons">
        <button 
          class="filter-btn"
          :class="{ active: filter === 'all' }"
          @click="setFilter('all')"
        >
          全部 ({{ totalCount }})
        </button>
        <button 
          class="filter-btn"
          :class="{ active: filter === 'active' }"
          @click="setFilter('active')"
        >
          未完成 ({{ activeCount }})
        </button>
        <button 
          class="filter-btn"
          :class="{ active: filter === 'completed' }"
          @click="setFilter('completed')"
        >
          已完成 ({{ completedCount }})
        </button>
      </div>
      
      <button 
        v-if="completedCount > 0"
        class="clear-btn"
        @click="handleClearCompleted"
      >
        清除已完成
      </button>
    </div>
    
    <!-- 待办列表 -->
    <div class="todo-list" v-if="filteredTodos.length > 0">
      <TransitionGroup name="list">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @toggle="handleToggle"
          @remove="handleRemove"
          @update="handleUpdate"
        />
      </TransitionGroup>
    </div>
    
    <!-- 空状态 -->
    <div class="empty-state" v-else>
      <div class="empty-icon">📝</div>
      <p class="empty-text">
        {{ filter === 'all' ? '还没有任务，添加一个吧！' : 
           filter === 'active' ? '没有未完成的任务' : '没有已完成的任务' }}
      </p>
    </div>
    
    <!-- 底部统计 -->
    <div class="stats-bar" v-if="todos.length > 0">
      <span class="stats-text">
        共 {{ totalCount }} 项任务，已完成 {{ completedCount }} 项
      </span>
    </div>
  </div>
</template>

<style scoped>
.todo-list-container {
  min-height: 300px;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.clear-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--danger-color);
  background: transparent;
  border: 1px solid var(--danger-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: var(--danger-color);
  color: white;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-text {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* 底部统计 */
.stats-bar {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.stats-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .filter-bar {
    justify-content: center;
  }
  
  .filter-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-btn {
    flex: 1;
    padding: 0.5rem 0.5rem;
  }
  
  .clear-btn {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
