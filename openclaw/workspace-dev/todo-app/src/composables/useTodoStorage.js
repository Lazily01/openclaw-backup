/**
 * localStorage 封装组合式函数
 * 提供待办数据的读取和持久化功能
 */

const STORAGE_KEY = 'todo-app-data'

export function useTodoStorage() {
  /**
   * 从 localStorage 读取待办列表
   * @returns {Array} 待办列表
   */
  const loadTodos = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('读取 localStorage 失败:', error)
      return []
    }
  }

  /**
   * 保存待办列表到 localStorage
   * @param {Array} todos - 待办列表
   */
  const saveTodos = (todos) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      console.error('保存到 localStorage 失败:', error)
    }
  }

  return {
    loadTodos,
    saveTodos
  }
}
