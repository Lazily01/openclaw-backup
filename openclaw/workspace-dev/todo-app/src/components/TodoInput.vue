<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const inputText = ref('')

/**
 * 提交新任务
 */
const submitTodo = () => {
  if (inputText.value.trim()) {
    emit('add', inputText.value)
    inputText.value = ''
  }
}

/**
 * 处理键盘事件
 * @param {KeyboardEvent} e
 */
const handleKeyup = (e) => {
  if (e.key === 'Enter') {
    submitTodo()
  }
}
</script>

<template>
  <div class="todo-input">
    <input
      v-model="inputText"
      type="text"
      placeholder="添加新任务，按回车确认..."
      class="input-field"
      @keyup="handleKeyup"
    />
    <button 
      class="add-btn"
      @click="submitTodo"
      :disabled="!inputText.trim()"
    >
      添加
    </button>
  </div>
</template>

<style scoped>
.todo-input {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.input-field {
  flex: 1;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: white;
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field::placeholder {
  color: var(--text-secondary);
}

.add-btn {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: var(--primary-color);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.add-btn:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.add-btn:active:not(:disabled) {
  transform: translateY(0);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .todo-input {
    flex-direction: column;
  }
  
  .add-btn {
    width: 100%;
  }
}
</style>
