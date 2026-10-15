package com.macro.mall.tiny.modules.ai.service;

import java.util.List;

/**
 * AI 对话服务接口
 */
public interface AiChatService {
    
    /**
     * 流式对话
     * @param userId 用户ID
     * @param message 用户消息
     * @param history 对话历史
     * @return SSE 事件流
     */
    String streamChat(Long userId, String message, List<ChatMessage> history);
    
    /**
     * 聊天消息
     */
    class ChatMessage {
        private String role;      // user / assistant
        private String content;   // 消息内容
        
        public ChatMessage() {}
        
        public ChatMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
