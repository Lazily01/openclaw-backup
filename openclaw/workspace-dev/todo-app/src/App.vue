<script setup>
import { ref, watch, onMounted } from 'vue'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import { useTodoStorage } from './composables/useTodoStorage.js'

const { loadTodos, saveTodos } = useTodoStorage()

// 响应式待办列表
const todos = ref([])

// 初始化：从 localStorage 加载数据
onMounted(() => {
  todos.value = loadTodos()
})

// 自动持久化：监听 todos 变化并保存
watch(todos, (newTodos) => {
  saveTodos(newTodos)
}, { deep: true })

/**
 * 添加新任务
 * @param {string} content - 任务内容
 */
const addTodo = (content) => {
  if (!content.trim()) return
  
  todos.value.unshift({
    id: Date.now().toString(),
    content: content.trim(),
    completed: false,
    createdAt: Date.now()
  })
}

/**
 * 删除任务
 * @param {string} id - 任务ID
 */
const removeTodo = (id) => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
  }
}

/**
 * 切换任务完成状态
 * @param {string} id - 任务ID
 */
const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

/**
 * 更新任务内容
 * @param {string} id - 任务ID
 * @param {string} newContent - 新内容
 */
const updateTodo = (id, newContent) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo && newContent.trim()) {
    todo.content = newContent.trim()
  }
}

/**
 * 清除所有已完成的任务
 */
const clearCompleted = () => {
  todos.value = todos.value.filter(t => !t.completed)
}
</script>

<template>
  <div class="todo-container">
    <header class="todo-header">
      <h1>📝 待办清单</h1>
      <p class="subtitle">简洁高效，专注任务本身</p>
    </header>
    
    <TodoInput @add="addTodo" />
    
    <TodoList 
      :todos="todos"
      @toggle="toggleTodo"
      @remove="removeTodo"
      @update="updateTodo"
      @clear-completed="clearCompleted"
    />
  </div>
</template>

<style scoped>
.todo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.todo-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
</style>
