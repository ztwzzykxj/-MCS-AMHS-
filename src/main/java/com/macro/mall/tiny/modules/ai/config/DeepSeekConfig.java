package com.macro.mall.tiny.modules.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * DeepSeek AI 配置
 */
@Data
@Component
@ConfigurationProperties(prefix = "deepseek")
public class DeepSeekConfig {
    
    /**
     * API 密钥
     */
    private String apiKey;
    
    /**
     * API 地址
     */
    private String baseUrl = "https://api.deepseek.com";
    
    /**
     * 模型名称
     */
    private String model = "deepseek-chat";
    
    /**
     * 最大令牌数
     */
    private Integer maxTokens = 1000;
    
    /**
     * 温度参数（创造性）
     */
    private Double temperature = 0.7;
}
