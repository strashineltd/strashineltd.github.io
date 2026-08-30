import type { CoreVolume, LearningStep } from "../types.ts";

export const prepareDeviceVolume: CoreVolume = {
  id: "prepare-device",
  title: "准备环境",
  outcome: "准备好你的工作环境",
  estimatedMinutes: 8,
  stepIds: [
    "prepare.choose-build",
    "prepare.install",
    "prepare.first-launch",
  ],
};

export const prepareDeviceSteps: LearningStep[] = [
  {
    id: "prepare.choose-build",
    contentVersion: 1,
    volumeId: "prepare-device",
    outcome: "确认你的安装版本",
    estimatedMinutes: 2,
    sections: [
      {
        id: "choose-release",
        title: "从正式发布页选择安装包",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "先确认设备的操作系统与处理器架构，再从 Stellara Work 的 GitHub Releases 正式发布页下载 v0.9.2。安装包名称中的架构必须与当前设备一致。",
            ],
          },
          {
            type: "fields",
            audience: { platforms: ["windows-x64"] },
            items: [
              {
                label: "Windows x64 安装包",
                value: "Stellara Work-Setup-0.9.2-x64.exe",
                detail: "这是 Windows x64 的 NSIS 安装程序。",
              },
            ],
          },
          {
            type: "fields",
            audience: { platforms: ["macos-arm64"] },
            items: [
              {
                label: "Apple 芯片安装包",
                value: "Stellara Work-0.9.2-arm64.dmg",
                detail: "适用于 Apple Silicon，也就是 M 系列芯片的 Mac。",
              },
            ],
          },
          {
            type: "fields",
            audience: { platforms: ["macos-x64"] },
            items: [
              {
                label: "Intel 安装包",
                value: "Stellara Work-0.9.2-x64.dmg",
                detail: "适用于 Intel 处理器的 Mac。",
              },
            ],
          },
        ],
      },
    ],
    searchTerms: ["下载", "安装包", "版本", "架构", "x64", "arm64"],
  },
  {
    id: "prepare.install",
    contentVersion: 1,
    volumeId: "prepare-device",
    outcome: "完成安装并处理系统安全提示",
    estimatedMinutes: 4,
    sections: [
      {
        id: "install-application",
        title: "安装应用",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "v0.9.2 的公开安装包尚未签名，因此系统可能在首次安装或打开时要求额外确认。只对刚从正式发布页下载且名称、版本和架构都正确的文件继续操作。",
            ],
          },
          {
            type: "steps",
            audience: { platforms: ["windows-x64"] },
            items: [
              {
                title: "运行 NSIS 安装程序",
                detail: "打开下载的 .exe，按向导选择安装目录并完成安装。",
              },
              {
                title: "处理 Windows SmartScreen",
                detail: "若出现拦截提示，先再次核对文件来源，再选择“更多信息”与“仍要运行”。",
              },
              {
                title: "找到应用入口",
                detail: "安装完成后，从开始菜单或桌面快捷方式打开 Stellara Work。",
              },
            ],
          },
          {
            type: "steps",
            audience: { platforms: ["macos-arm64", "macos-x64"] },
            items: [
              {
                title: "打开 DMG",
                detail: "挂载下载的 .dmg，并将 Stellara Work 拖入“应用程序”。",
              },
              {
                title: "处理 Gatekeeper",
                detail: "若系统阻止首次打开，请在“应用程序”中右键 Stellara Work，选择“打开”，确认后继续。",
              },
              {
                title: "从应用程序启动",
                detail: "确认应用窗口出现后再推出安装映像。",
              },
            ],
          },
        ],
      },
    ],
    searchTerms: ["NSIS", "DMG", "SmartScreen", "Gatekeeper", "未签名"],
  },
  {
    id: "prepare.first-launch",
    contentVersion: 1,
    volumeId: "prepare-device",
    outcome: "完成首次启动",
    estimatedMinutes: 2,
    sections: [
      {
        id: "first-launch",
        title: "认识首次启动流程",
        blocks: [
          {
            type: "prose",
            paragraphs: [
              "首次启动会进入一个简短的三段式引导。它先说明本地工作方式，再让你选择模型，最后在应用内完成连接信息；每一段都可以跳过，并可稍后从设置重新配置。",
            ],
          },
          {
            type: "steps",
            items: [
              {
                title: "欢迎页",
                detail: "确认 Stellara Work 会在本地工作区执行任务，选择“开始配置”。",
              },
              {
                title: "选择模型",
                detail: "先选择准备使用的模型预设；之后仍可在设置中更换。",
              },
              {
                title: "连接信息",
                detail: "Base URL、模型名与凭证只在 Stellara Work 应用内填写和测试，网页不参与连接。",
              },
            ],
          },
        ],
      },
    ],
    searchTerms: ["首次启动", "引导", "欢迎页", "选择模型", "跳过"],
  },
];
