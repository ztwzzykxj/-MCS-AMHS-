package com.macro.mall.tiny.modules.ai.controller;

import com.macro.mall.tiny.common.api.CommonResult;
import com.macro.mall.tiny.modules.ai.service.AiChatService;
import com.macro.mall.tiny.modules.ums.model.UmsAdmin;
import com.macro.mall.tiny.modules.ums.service.UmsAdminService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * AI 智能助手控制器
 * 支持 SSE 流式响应
 */
@Api(tags = "AiAssistantController")
@Tag(name = "AiAssistantController", description = "AI 智能助手")
@RestController
@RequestMapping("/ai")
public class AiAssistantController {
    
    @Autowired
    private AiChatService aiChatService;
    
    @Autowired
    private UmsAdminService adminService;
    
    /**
     * SSE 超时时间：5分钟
     */
    private static final long SSE_TIMEOUT = 5 * 60 * 1000L;
    
    /**
     * 用户会话缓存
     */
    private final Map<Long, List<AiChatService.ChatMessage>> sessionCache = new ConcurrentHashMap<>();
    
    @ApiOperation("AI 对话（SSE 流式响应）")
    @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter chat(@RequestParam String message) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        
        // 获取当前用户
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            try {
                emitter.send(SseEmitter.event()
                    .name("error")
                    .data("用户未登录"));
                emitter.complete();
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
            return emitter;
        }
        
        String username = auth.getName();
        UmsAdmin admin = adminService.getAdminByUsername(username);
        Long userId = admin != null ? admin.getId() : 0L;
        
        // 获取对话历史
        List<AiChatService.ChatMessage> history = sessionCache.computeIfAbsent(
            userId, k -> new ArrayList<>()
        );
        
        // 添加用户消息到历史
        history.add(new AiChatService.ChatMessage("user", message));
        
        // 异步处理 AI 对话
        new Thread(() -> {
            try {
                String sseData = aiChatService.streamChat(userId, message, history);
                
                // 解析 SSE 数据并发送
                String[] lines = sseData.split("\n");
                for (String line : lines) {
                    if (line.startsWith("event: ")) {
                        String eventName = line.substring(7).trim();
                        emitter.send(SseEmitter.event()
                            .name(eventName)
                            .data(""));
                    } else if (line.startsWith("data: ")) {
                        String data = line.substring(6);
                        emitter.send(SseEmitter.event()
                            .data(data));
                    }
                }
                
                // 将 AI 回复添加到历史
                // 注意：这里简化处理，实际应该从 SSE 流中收集完整回复
                history.add(new AiChatService.ChatMessage("assistant", "[AI 回复已生成]"));
                
                emitter.complete();
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }).start();
        
        // 超时处理
        emitter.onTimeout(() -> {
            LOGGER.warn("AI 对话超时，用户: {}", username);
        });
        
        emitter.onCompletion(() -> {
            LOGGER.info("AI 对话完成，用户: {}", username);
        });
        
        return emitter;
    }
    
    @ApiOperation("AI 对话（同步方式）")
    @PostMapping("/chat/sync")
    public CommonResult<String> chatSync(@RequestParam String message) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return CommonResult.unauthorized(null);
        }
        
        String username = auth.getName();
        UmsAdmin admin = adminService.getAdminByUsername(username);
        Long userId = admin != null ? admin.getId() : 0L;
        
        // 同步调用（简单实现，不保留历史）
        String response = aiChatService.streamChat(userId, message, null);
        
        // 提取纯文本内容（简化处理）
        String content = extractTextFromSSE(response);
        
        return CommonResult.success(content);
    }
    
    @ApiOperation("清除对话历史")
    @PostMapping("/chat/clear")
    public CommonResult<Void> clearHistory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return CommonResult.unauthorized(null);
        }
        
        String username = auth.getName();
        UmsAdmin admin = adminService.getAdminByUsername(username);
        if (admin != null) {
            sessionCache.remove(admin.getId());
        }
        
        return CommonResult.success(null);
    }
    
    @ApiOperation("获取系统说明")
    @GetMapping("/info")
    public CommonResult<Object> getAiInfo() {
        return CommonResult.success(java.util.Map.of(
            "name", "MCS-AMHS 智能助手",
            "version", "1.0.0",
            "description", "村田机械 MCS-AMHS 系统 AI 助手，支持设备日志检索、状态查询、库存分析等功能",
            "capabilities", java.util.List.of(
                "车间设备运行日志检索",
                "设备状态和报警信息查询",
                "仓储库存数据分析",
                "系统使用问题解答"
            )
        ));
    }
    
    /**
     * 从 SSE 响应中提取纯文本
     */
    private String extractTextFromSSE(String sseData) {
        if (sseData == null) return "";
        
        StringBuilder result = new StringBuilder();
        String[] lines = sseData.split("\n");
        
        for (String line : lines) {
            if (line.startsWith("data: ") && !line.contains("event:")) {
                String data = line.substring(6).trim();
                if (!data.isEmpty() && !"null".equals(data)) {
                    result.append(data);
                }
            }
        }
        
        return result.toString().trim();
    }
    
    // 添加 logger
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(AiAssistantController.class);
}
