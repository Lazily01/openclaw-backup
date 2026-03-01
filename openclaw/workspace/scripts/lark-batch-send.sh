#!/bin/bash
# 飞书批量发送消息脚本
# 使用方法: ./lark-batch-send.sh "消息内容"

APP_ID="cli_a9063ab493789cc4"
APP_SECRET="${LARK_APP_SECRET:-}"  # 从环境变量读取，或直接填入

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查 APP_SECRET
if [ -z "$APP_SECRET" ]; then
    log_error "请设置环境变量 LARK_APP_SECRET 或直接在脚本中填写 APP_SECRET"
    exit 1
fi

# 第一步：获取 tenant_access_token
get_token() {
    log_info "获取 access_token..."
    local response=$(curl -s -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
        -H "Content-Type: application/json" \
        -d "{\"app_id\": \"$APP_ID\", \"app_secret\": \"$APP_SECRET\"}")
    
    local token=$(echo "$response" | jq -r '.tenant_access_token')
    local expire=$(echo "$response" | jq -r '.expire')
    
    if [ "$token" = "null" ] || [ -z "$token" ]; then
        log_error "获取 token 失败: $response"
        exit 1
    fi
    
    log_info "Token 获取成功，有效期 ${expire} 秒"
    echo "$token"
}

# 第二步：获取应用的通讯录权限范围
get_contacts_range() {
    local token=$1
    log_info "查询应用的通讯录权限范围..."
    
    local response=$(curl -s -X GET \
        "https://open.feishu.cn/open-apis/application/v6/applications/$APP_ID/contacts_range_configuration?user_id_type=open_id" \
        -H "Authorization: Bearer $token")
    
    echo "$response"
}

# 第三步：获取用户列表（从根部门开始）
get_users() {
    local token=$1
    log_info "获取用户列表..."
    
    local response=$(curl -s -X GET \
        "https://open.feishu.cn/open-apis/contact/v3/users?department_id=0&page_size=50&user_id_type=open_id" \
        -H "Authorization: Bearer $token")
    
    echo "$response"
}

# 第四步：批量发送消息
batch_send() {
    local token=$1
    local message=$2
    shift 2
    local open_ids=("$@")
    
    log_info "准备发送消息给 ${#open_ids[@]} 个用户..."
    
    # 构建 open_ids JSON 数组
    local ids_json=$(printf '%s\n' "${open_ids[@]}" | jq -R . | jq -s .)
    
    local response=$(curl -s -X POST "https://open.feishu.cn/open-apis/im/v1/batch_messages" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "{
            \"open_ids\": $ids_json,
            \"msg_type\": \"text\",
            \"content\": {\"text\": \"$message\"}
        }")
    
    echo "$response"
}

# 主函数
main() {
    local message=${1:-"测试消息"}
    
    log_info "===== 飞书群发消息工具 ====="
    log_info "App ID: $APP_ID"
    
    # 获取 token
    local token=$(get_token)
    
    # 查看权限范围
    echo ""
    log_info "===== 通讯录权限范围 ====="
    local range=$(get_contacts_range "$token")
    echo "$range" | jq '.' 2>/dev/null || echo "$range"
    
    # 获取用户列表
    echo ""
    log_info "===== 用户列表 ====="
    local users=$(get_users "$token")
    echo "$users" | jq '.data.users[] | {name: .name, open_id: .open_id, department_ids: .department_ids}' 2>/dev/null || echo "$users"
    
    # 提取 open_ids
    local open_ids=($(echo "$users" | jq -r '.data.users[].open_id' 2>/dev/null))
    
    if [ ${#open_ids[@]} -eq 0 ]; then
        log_warn "没有获取到用户，可能原因："
        log_warn "1. 应用没有通讯录权限（需要申请 contact:user.base:readonly）"
        log_warn "2. 权限范围配置为空"
        log_warn "3. 企业中没有其他用户"
        return
    fi
    
    echo ""
    log_info "找到 ${#open_ids[@]} 个用户"
    log_info "如需发送消息，运行: $0 --send \"消息内容\""
    
    # 如果带了 --send 参数，执行发送
    if [ "$2" = "--send" ] && [ -n "$3" ]; then
        batch_send "$token" "$3" "${open_ids[@]}"
    fi
}

main "$@"
