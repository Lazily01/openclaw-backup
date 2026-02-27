<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'remove', 'update'])

const isEditing = ref(false)
const editContent = ref('')

/**
 * 切换完成状态
 */
const handleToggle = () => {
  emit('toggle', props.todo.id)
}

/**
 * 删除任务
 */
const handleRemove = () => {
  emit('remove', props.todo.id)
}

/**
 * 进入编辑模式
 */
const startEdit = () => {
  isEditing.value = true
  editContent.value = props.todo.content
  nextTick(() => {
    const input = document.querySelector('.edit-input')
    if (input) {
      input.focus()
      input.select()
    }
  })
}

/**
 * 保存编辑
 */
const saveEdit = () => {
  if (editContent.value.trim() && editContent.value !== props.todo.content) {
    emit('update', props.todo.id, editContent.value)
  }
  isEditing.value = false
}

/**
 * 取消编辑
 */
const cancelEdit = () => {
  isEditing.value = false
}

/**
 * 处理键盘事件
 * @param {KeyboardEvent} e
 */
const handleEditKeyup = (e) => {
  if (e.key === 'Enter') {
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div 
    class="todo-item" 
    :class="{ completed: todo.completed, editing: isEditing }"
  >
    <div class="todo-content">
      <!-- 复选框 -->
      <label class="checkbox-wrapper">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="handleToggle"
          class="checkbox"
        />
        <span class="checkbox-custom"></span>
      </label>
      
      <!-- 任务内容 -->
      <div 
        v-if="!isEditing"
        class="todo-text"
        @dblclick="startEdit"
      >
        {{ todo.content }}
      </div>
      
      <!-- 编辑输入框 -->
      <input
        v-else
        v-model="editContent"
        type="text"
        class="edit-input"
        @blur="saveEdit"
        @keyup="handleEditKeyup"
      />
    </div>
    
    <!-- 删除按钮 -->
    <button 
      v-if="!isEditing"
      class="delete-btn"
      @click="handleRemove"
      title="删除任务"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
}

.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.todo-item.completed {
  background: var(--bg-color);
}

.todo-item.completed .todo-text {
  color: var(--text-secondary);
  text-decoration: line-through;
}

.todo-content {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0.875rem;
}

/* 自定义复选框 */
.checkbox-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 22px;
  height: 22px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-wrapper:hover .checkbox-custom {
  border-color: var(--primary-color);
}

.checkbox:checked + .checkbox-custom {
  background: var(--success-color);
  border-color: var(--success-color);
}

.checkbox:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

/* 任务文本 */
.todo-text {
  flex: 1;
  font-size: 1rem;
  color: var(--text-primary);
  cursor: pointer;
  word-break: break-word;
}

/* 编辑输入框 */
.edit-input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid var(--primary-color);
  border-radius: 4px;
  outline: none;
}

/* 删除按钮 */
.delete-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s;
}

.todo-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: var(--danger-color);
  color: white;
}

/* 移动端：始终显示删除按钮 */
@media (max-width: 768px) {
  .delete-btn {
    opacity: 1;
  }
}
</style>
