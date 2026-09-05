import type { PlatformOption, ProviderOption } from "./types.ts";

export const platformOptions: PlatformOption[] = [
  {
    id: "windows-x64",
    label: "Windows x64",
    shortLabel: "Windows x64",
  },
  {
    id: "macos-arm64",
    label: "macOS · Apple 芯片",
    shortLabel: "Apple 芯片",
  },
  {
    id: "macos-x64",
    label: "macOS · Intel",
    shortLabel: "Intel",
  },
];

export const providerOptions: ProviderOption[] = [
  {
    id: "deepseek",
    label: "DeepSeek",
    presetLabels: ["DeepSeek-V4-Pro", "DeepSeek-V4-Flash"],
    baseUrl: "https://api.deepseek.com",
    wireApi: "responses",
  },
  {
    id: "qwen",
    label: "Qwen",
    presetLabels: ["Qwen3.8-Max"],
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    wireApi: "responses",
  },
  {
    id: "glm",
    label: "GLM",
    presetLabels: ["GLM-5.3", "GLM-5.2"],
    baseUrl: "https://open.bigmodel.cn/api/v1",
    wireApi: "responses",
  },
  {
    id: "kimi",
    label: "Kimi",
    presetLabels: ["Kimi-K3"],
    baseUrl: "https://api.moonshot.cn",
    wireApi: "responses",
  },
  {
    id: "minimax",
    label: "MiniMax",
    presetLabels: ["MiniMax-M3"],
    baseUrl: "https://api.minimax.io/v1",
    wireApi: "responses",
  },
  {
    id: "custom-responses",
    label: "自定义 · Responses API",
    presetLabels: ["自定义模型"],
    baseUrl: null,
    wireApi: "responses",
  },
  {
    id: "custom-anthropic",
    label: "自定义 · Anthropic Messages",
    presetLabels: ["自定义模型"],
    baseUrl: null,
    wireApi: "anthropic",
  },
];
