package com.macro.mall.tiny.modules.ai.service.impl;

import cn.hutool.core.util.StrUtil;
import com.macro.mall.tiny.modules.ai.config.DeepSeekConfig;
import com.macro.mall.tiny.modules.ai.service.AiChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * DeepSeek AI 对话服务实现
 */
@Service
public class DeepSeekChatServiceImpl implements AiChatService {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(DeepSeekChatServiceImpl.class);
    
    @Autowired
    private DeepSeekConfig deepSeekConfig;
    
    @Override
    public String streamChat(Long userId, String message, List<ChatMessage> history) {
        // 构建消息列表
        List<Message> messages = new ArrayList<>();
        
        // 系统提示词 - MCS-AMHS 设备日志助手
        messages.add(new Message("system", 
            "你是村田机械 MCS-AMHS 系统的智能助手，负责帮助用户：\n" +
            "1. 检索车间设备运行日志\n" +
            "2. 查询设备状态和报警信息\n" +
            "3. 分析仓储库存数据\n" +
            "4. 回答系统使用相关问题\n" +
            "请用简洁专业的语气回答。"
        ));
        
        // 添加历史记录
        if (history != null) {
            for (ChatMessage chatMsg : history) {
                messages.add(new Message(chatMsg.getRole(), chatMsg.getContent()));
            }
        }
        
        // 添加当前消息
        messages.add(new Message("user", message));
        
        return buildSseStream(messages);
    }
    
    /**
     * 构建 SSE 流
     */
    private String buildSseStream(List<Message> messages) {
        StringBuilder response = new StringBuilder();
        response.append("event: message\n");
        response.append("data: 正在连接 DeepSeek AI...\n\n");
        
        try {
            // 调用 DeepSeek API
            URL url = URI.create(deepSeekConfig.getBaseUrl() + "/chat/completions").toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Authorization", "Bearer " + deepSeekConfig.getApiKey());
            conn.setDoOutput(true);
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(30000);
            
            // 构建请求体
            StringBuilder jsonBody = new StringBuilder();
            jsonBody.append("{");
            jsonBody.append("\"model\":\"").append(deepSeekConfig.getModel()).append("\",");
            jsonBody.append("\"messages\":[");
            for (int i = 0; i < messages.size(); i++) {
                Message msg = messages.get(i);
                jsonBody.append("{");
                jsonBody.append("\"role\":\"").append(msg.role).append("\",");
                jsonBody.append("\"content\":\"").append(escapeJson(msg.content)).append("\"");
                jsonBody.append("}");
                if (i < messages.size() - 1) jsonBody.append(",");
            }
            jsonBody.append("],");
            jsonBody.append("\"stream\":true");
            jsonBody.append("}");
            
            // 发送请求
            conn.getOutputStream().write(jsonBody.toString().getBytes(StandardCharsets.UTF_8));
            conn.getOutputStream().flush();
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                // 读取流式响应
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    StringBuffer fullContent = new StringBuffer();
                    
                    while ((line = reader.readLine()) != null) {
                        if (line.startsWith("data: ")) {
                            String data = line.substring(6);
                            if ("[DONE]".equals(data)) {
                                break;
                            }
                            
                            // 解析 SSE 格式的 JSON
                            String content = extractContentFromSSE(data);
                            if (StrUtil.isNotEmpty(content)) {
                                fullContent.append(content);
                                // 发送 SSE 事件
                                response.append("event: message\n");
                                response.append("data: ").append(escapeSSE(content)).append("\n\n");
                            }
                        }
                    }
                    
                    // 保存完整回复到历史（如果需要）
                    Message lastMsg = messages.get(messages.size() - 1);
                    LOGGER.info("AI 助手回复完成，用户消息: {}, 回复长度: {}", 
                        lastMsg.content, fullContent.length());
                }
            } else {
                // API 调用失败
                String errorMsg = "AI 服务调用失败: HTTP " + responseCode;
                LOGGER.error(errorMsg);
                response.append("event: error\n");
                response.append("data: ").append(escapeSSE(errorMsg)).append("\n\n");
            }
            
            conn.disconnect();
            
        } catch (Exception e) {
            LOGGER.error("AI 对话异常: {}", e.getMessage(), e);
            response.append("event: error\n");
            response.append("data: ").append(escapeSSE("抱歉，AI 服务暂时不可用: " + e.getMessage())).append("\n\n");
        }
        
        // 结束信号
        response.append("event: done\n");
        response.append("data: \n\n");
        
        return response.toString();
    }
    
    /**
     * 从 SSE 数据中提取内容
     */
    private String extractContentFromSSE(String data) {
        try {
            // 简单解析 {"choices":[{"delta":{"content":"xxx"}}]}
            int contentIndex = data.indexOf("\"content\":\"");
            if (contentIndex > 0) {
                int start = contentIndex + 11;
                int end = data.indexOf("\"", start);
                if (end > start) {
                    return data.substring(start, end);
                }
            }
        } catch (Exception e) {
            LOGGER.debug("解析 SSE 数据失败: {}", data);
        }
        return "";
    }
    
    /**
     * 转义 JSON 字符串
     */
    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
    
    /**
     * 转义 SSE 数据
     */
    private String escapeSSE(String text) {
        if (text == null) return "";
        return text.replace("\n", "\\n")
                   .replace("\r", "\\r");
    }
    
    /**
     * 内部消息类
     */
    private static class Message {
        public String role;
        public String content;
        
        Message(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }
}
