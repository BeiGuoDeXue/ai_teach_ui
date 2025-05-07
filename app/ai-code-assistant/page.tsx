"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Save, Upload, RefreshCw, AlertCircle, Download, Trash2, Copy, Share2, HelpCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CodeAssistant() {
  const blocklyDiv = useRef<HTMLDivElement>(null)
  const outputDiv = useRef<HTMLDivElement>(null)
  const [blocklyLoaded, setBlocklyLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [activeTab, setActiveTab] = useState("blocks")
  const [isRunning, setIsRunning] = useState(false)
  const blocklyInstanceRef = useRef<any>(null)
  const [loadingStatus, setLoadingStatus] = useState({
    core: false,
    blocks: false,
    javascript: false,
    locale: false,
  })
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null)
  const maxRetries = useRef(30) // 增加最大重试次数
  const currentRetry = useRef(0)
  const generatorRegistered = useRef(false)
  const [selectedExample, setSelectedExample] = useState("default")
  const [showHelp, setShowHelp] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // 设置isClient为true，表示现在是在客户端渲染
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return // 确保只在客户端执行

    // 动态加载Blockly库
    const loadBlockly = async () => {
      try {
        // 清除任何先前的错误
        setLoadingError(null)

        // 检查Blockly是否已加载
        if (typeof window !== "undefined" && window.Blockly) {
          console.log("Blockly already loaded, initializing...")
          initBlockly()
          setBlocklyLoaded(true)
          return
        }

        console.log("Loading Blockly scripts...")

        // 创建一个Promise来处理脚本加载
        const loadScript = (src: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = src
            script.async = true
            script.onload = () => resolve()
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
            document.body.appendChild(script)
          })
        }

        // 按顺序加载脚本
        try {
          await loadScript("https://unpkg.com/blockly/blockly_compressed.js")
          console.log("Loaded blockly_compressed.js")
          setLoadingStatus((prev) => ({ ...prev, core: true }))

          await loadScript("https://unpkg.com/blockly/blocks_compressed.js")
          console.log("Loaded blocks_compressed.js")
          setLoadingStatus((prev) => ({ ...prev, blocks: true }))

          await loadScript("https://unpkg.com/blockly/javascript_compressed.js")
          console.log("Loaded javascript_compressed.js")
          setLoadingStatus((prev) => ({ ...prev, javascript: true }))

          await loadScript("https://unpkg.com/blockly/msg/zh-hans.js")
          console.log("Loaded zh-hans.js")
          setLoadingStatus((prev) => ({ ...prev, locale: true }))

          // 确保所有脚本都已加载
          if (typeof window !== "undefined" && window.Blockly) {
            console.log("All scripts loaded, initializing Blockly...")
            // 给Blockly一点时间完全初始化
            setTimeout(() => {
              initBlockly()
              setBlocklyLoaded(true)
            }, 5000) // 增加延迟时间，确保完全加载
          } else {
            throw new Error("Blockly failed to load properly")
          }
        } catch (error) {
          console.error("Error loading scripts:", error)
          setLoadingError(`加载脚本时出错: ${error instanceof Error ? error.message : String(error)}`)
        }
      } catch (error) {
        console.error("Error in loadBlockly:", error)
        setLoadingError(error instanceof Error ? error.message : "加载Blockly库时出错")
        setBlocklyLoaded(false)
      }
    }

    // 页面加载后延迟一点时间再加载Blockly，确保DOM已完全渲染
    const timer = setTimeout(() => {
      loadBlockly()
    }, 1000)

    return () => {
      // 清理函数
      clearTimeout(timer)
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
      if (blocklyInstanceRef.current && typeof window !== "undefined" && window.Blockly) {
        try {
          blocklyInstanceRef.current.dispose()
        } catch (e) {
          console.error("Error disposing Blockly workspace:", e)
        }
      }
    }
  }, [isClient])

  const initBlockly = () => {
    if (!isClient) return // 确保只在客户端执行

    if (!blocklyDiv.current || typeof window === "undefined" || !window.Blockly) {
      console.error("Cannot initialize Blockly: missing dependencies")
      setLoadingError("初始化Blockly失败：缺少必要的依赖项。请刷新页面重试。")
      return
    }

    try {
      console.log("Defining custom blocks...")
      // 定义自定义块
      defineCustomBlocks()

      console.log("Injecting Blockly workspace...")
      // 初始化Blockly工作区
      const workspace = window.Blockly.inject(blocklyDiv.current, {
        toolbox: getToolboxConfig(),
        grid: {
          spacing: 20,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        },
        trashcan: true,
        theme: {
          componentStyles: {
            workspaceBackgroundColour: "#f5f5f5",
            toolboxBackgroundColour: "#f0f0f0",
            toolboxForegroundColour: "#333",
            flyoutBackgroundColour: "#f9f9f9",
            flyoutForegroundColour: "#333",
            flyoutOpacity: 0.9,
            scrollbarColour: "#ccc",
            scrollbarOpacity: 0.8,
          },
        },
      })

      blocklyInstanceRef.current = workspace

      // 尝试注册生成器
      tryRegisterGenerators()

      // 添加更改监听器以更新代码预览
      workspace.addChangeListener(() => {
        try {
          // 确保JavaScript生成器已注册
          if (!generatorRegistered.current) {
            tryRegisterGenerators()
          }

          const generatedCode = window.Blockly.JavaScript.workspaceToCode(workspace)
          setCode(generatedCode)
        } catch (e) {
          console.error("Error generating code:", e)
          setOutput((prev) => prev + `生成代码时出错: ${e}\n`)
        }
      })

      // 尝试加载示例项目，使用重试机制
      tryLoadExampleProject(workspace)

      console.log("Blockly initialization complete")
    } catch (error) {
      console.error("Error initializing Blockly:", error)
      setLoadingError("初始化Blockly编辑器时出错: " + (error instanceof Error ? error.message : String(error)))
      setBlocklyLoaded(false)
    }
  }

  // 尝试注册生成器
  const tryRegisterGenerators = () => {
    if (!isClient) return false // 确保只在客户端执行

    if (typeof window === "undefined" || !window.Blockly || !window.Blockly.JavaScript) {
      console.warn("Blockly.JavaScript not available yet, will retry...")
      return false
    }

    try {
      console.log("Registering JavaScript generators...")

      // 注册延迟块生成器 - 使用标准函数语法而不是箭头函数
      window.Blockly.JavaScript["delay"] = (block) => {
        const value_time =
          window.Blockly.JavaScript.valueToCode(block, "TIME", window.Blockly.JavaScript.ORDER_ATOMIC) || "1000"
        return `await new Promise(function(resolve) { setTimeout(resolve, ${value_time}); });\n`
      }

      // 注册AI文本生成块生成器
      window.Blockly.JavaScript["ai_text_generation"] = (block) => {
        const value_text =
          window.Blockly.JavaScript.valueToCode(block, "TEXT", window.Blockly.JavaScript.ORDER_ATOMIC) || "''"
        const code = `await generateText(${value_text})`
        return [code, window.Blockly.JavaScript.ORDER_AWAIT]
      }

      // 注册AI图像生成块生成器
      window.Blockly.JavaScript["ai_image_generation"] = (block) => {
        const value_prompt =
          window.Blockly.JavaScript.valueToCode(block, "PROMPT", window.Blockly.JavaScript.ORDER_ATOMIC) || "''"
        const code = `await generateImage(${value_prompt})`
        return [code, window.Blockly.JavaScript.ORDER_AWAIT]
      }

      // 注册AI语音生成块生成器
      window.Blockly.JavaScript["ai_speech_generation"] = (block) => {
        const value_text =
          window.Blockly.JavaScript.valueToCode(block, "TEXT", window.Blockly.JavaScript.ORDER_ATOMIC) || "''"
        const code = `await generateSpeech(${value_text})`
        return [code, window.Blockly.JavaScript.ORDER_AWAIT]
      }

      // 注册AI翻译块生成器
      window.Blockly.JavaScript["ai_translation"] = (block) => {
        const value_text =
          window.Blockly.JavaScript.valueToCode(block, "TEXT", window.Blockly.JavaScript.ORDER_ATOMIC) || "''"
        const value_lang = block.getFieldValue("LANG")
        const code = `await translateText(${value_text}, "${value_lang}")`
        return [code, window.Blockly.JavaScript.ORDER_AWAIT]
      }

      // 注册AI情感分析块生成器
      window.Blockly.JavaScript["ai_sentiment_analysis"] = (block) => {
        const value_text =
          window.Blockly.JavaScript.valueToCode(block, "TEXT", window.Blockly.JavaScript.ORDER_ATOMIC) || "''"
        const code = `await analyzeSentiment(${value_text})`
        return [code, window.Blockly.JavaScript.ORDER_AWAIT]
      }

      // 注册警告框块生成器
      window.Blockly.JavaScript["alert"] = (block) => {
        const value_text =
          window.Blockly.JavaScript.valueToCode(block, "TEXT", window.Blockly.JavaScript.ORDER_ATOMIC) || "''"
        return `alert(${value_text});\n`
      }

      // 注册文本打印块生成器
      window.Blockly.JavaScript["text_print"] = (block) => {
        const value_text =
          window.Blockly.JavaScript.valueToCode(block, "TEXT", window.Blockly.JavaScript.ORDER_ATOMIC) || "''"
        return `console.log(${value_text});\n`
      }

      // 注册HTTP请求块生成器
      window.Blockly.JavaScript["http_request"] = (block) => {
        const value_url =
          window.Blockly.JavaScript.valueToCode(block, "URL", window.Blockly.JavaScript.ORDER_ATOMIC) ||
          "'https://example.com'"
        const method = block.getFieldValue("METHOD")
        const code = `await fetchData(${value_url}, "${method}")`
        return [code, window.Blockly.JavaScript.ORDER_AWAIT]
      }

      // 注册JSON解析块生成器
      window.Blockly.JavaScript["json_parse"] = (block) => {
        const value_text =
          window.Blockly.JavaScript.valueToCode(block, "TEXT", window.Blockly.JavaScript.ORDER_ATOMIC) || "'{}'"
        const code = `JSON.parse(${value_text})`
        return [code, window.Blockly.JavaScript.ORDER_FUNCTION_CALL]
      }

      // 注册JSON字符串化块生成器
      window.Blockly.JavaScript["json_stringify"] = (block) => {
        const value_obj =
          window.Blockly.JavaScript.valueToCode(block, "OBJECT", window.Blockly.JavaScript.ORDER_ATOMIC) || "{}"
        const code = `JSON.stringify(${value_obj})`
        return [code, window.Blockly.JavaScript.ORDER_FUNCTION_CALL]
      }

      console.log("JavaScript generators registered successfully")
      generatorRegistered.current = true
      return true
    } catch (error) {
      console.error("Error registering JavaScript generators:", error)
      return false
    }
  }

  const tryLoadExampleProject = (workspace: any) => {
    if (!isClient) return // 确保只在客户端执行

    // 清除任何现有的重试计时器
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
    }

    // 检查是否已达到最大重试次数
    if (currentRetry.current >= maxRetries.current) {
      console.warn("达到最大重试次数，无法加载示例项目")
      // 创建一个简单的默认块，而不是加载完整的示例项目
      createDefaultBlock(workspace)
      return
    }

    // 检查Blockly.Xml是否已完全加载
    if (
      typeof window === "undefined" ||
      !window.Blockly ||
      !window.Blockly.Xml ||
      !window.Blockly.Xml.textToDom ||
      typeof window.Blockly.Xml.textToDom !== "function" ||
      !window.Blockly.Xml.domToWorkspace
    ) {
      console.log(`等待Blockly.Xml加载完成，重试 ${currentRetry.current + 1}/${maxRetries.current}...`)
      currentRetry.current += 1

      // 设置重试计时器，增加延迟时间
      retryTimerRef.current = setTimeout(() => {
        tryLoadExampleProject(workspace)
      }, 3000) // 增加延迟时间
      return
    }

    // Blockly.Xml已加载，尝试加载示例项目
    try {
      loadExampleProject(workspace, "default")
    } catch (e) {
      console.error("加载示例项目失败:", e)
      // 如果加载示例项目失败，创建一个简单的默认块
      createDefaultBlock(workspace)
    }
  }

  const createDefaultBlock = (workspace: any) => {
    if (!isClient) return // 确保只在客户端执行

    try {
      if (typeof window === "undefined" || !window.Blockly) return

      // 创建一个简单的打印块
      const block = workspace.newBlock("text_print")
      block.initSvg()
      block.render()
      block.moveBy(50, 50)

      // 创建一个文本块并连接到打印块
      const textBlock = workspace.newBlock("text")
      textBlock.initSvg()
      textBlock.render()
      textBlock.setFieldValue("欢迎使用AI代码助手!", "TEXT")

      // 连接文本块到打印块
      const connection = block.getInput("TEXT").connection
      connection.connect(textBlock.outputConnection)

      console.log("创建了默认块")
    } catch (e) {
      console.error("创建默认块失败:", e)
    }
  }

  const loadExampleProject = (workspace: any, exampleType: string) => {
    if (!isClient) return // 确保只在客户端执行

    if (!workspace || typeof window === "undefined" || !window.Blockly || !window.Blockly.Xml) {
      console.error("Cannot load example project: Blockly.Xml not available")
      return
    }

    try {
      console.log("Loading example project, Blockly.Xml status:", !!window.Blockly.Xml)

      // 检查Blockly.Xml是否已完全加载
      if (!window.Blockly.Xml.textToDom || typeof window.Blockly.Xml.textToDom !== "function") {
        console.error("Blockly.Xml.textToDom is not a function yet")
        throw new Error("Blockly.Xml.textToDom is not available")
      }

      // 清空工作区
      workspace.clear()

      let exampleXml = ""

      // 根据选择的示例类型加载不同的XML
      switch (exampleType) {
        case "ai_text":
          exampleXml = `
            <xml xmlns="https://developers.google.com/blockly/xml">
              <block type="variables_set" x="50" y="50">
                <field name="VAR">result</field>
                <value name="VALUE">
                  <block type="ai_text_generation">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">写一首关于春天的诗</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="variables_get">
                        <field name="VAR">result</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </xml>
          `
          break
        case "ai_image":
          exampleXml = `
            <xml xmlns="https://developers.google.com/blockly/xml">
              <block type="variables_set" x="50" y="50">
                <field name="VAR">imageUrl</field>
                <value name="VALUE">
                  <block type="ai_image_generation">
                    <value name="PROMPT">
                      <block type="text">
                        <field name="TEXT">一只可爱的猫咪在草地上玩耍</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="variables_get">
                        <field name="VAR">imageUrl</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </xml>
          `
          break
        case "ai_translation":
          exampleXml = `
            <xml xmlns="https://developers.google.com/blockly/xml">
              <block type="variables_set" x="50" y="50">
                <field name="VAR">text</field>
                <value name="VALUE">
                  <block type="text">
                    <field name="TEXT">你好，世界！</field>
                  </block>
                </value>
                <next>
                  <block type="variables_set">
                    <field name="VAR">translated</field>
                    <value name="VALUE">
                      <block type="ai_translation">
                        <field name="LANG">en</field>
                        <value name="TEXT">
                          <block type="variables_get">
                            <field name="VAR">text</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="text_print">
                        <value name="TEXT">
                          <block type="variables_get">
                            <field name="VAR">translated</field>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </xml>
          `
          break
        case "http_request":
          exampleXml = `
            <xml xmlns="https://developers.google.com/blockly/xml">
              <block type="variables_set" x="50" y="50">
                <field name="VAR">response</field>
                <value name="VALUE">
                  <block type="http_request">
                    <field name="METHOD">GET</field>
                    <value name="URL">
                      <block type="text">
                        <field name="TEXT">https://jsonplaceholder.typicode.com/todos/1</field>
                      </block>
                    </value>
                  </block>
                </value>
                <next>
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="variables_get">
                        <field name="VAR">response</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </xml>
          `
          break
        default:
          // 默认示例
          exampleXml = `
            <xml xmlns="https://developers.google.com/blockly/xml">
              <block type="controls_if" x="50" y="50">
                <mutation else="1"></mutation>
                <value name="IF0">
                  <block type="logic_compare">
                    <field name="OP">EQ</field>
                    <value name="A">
                      <block type="math_number">
                        <field name="NUM">1</field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="math_number">
                        <field name="NUM">1</field>
                      </block>
                    </value>
                  </block>
                </value>
                <statement name="DO0">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">条件为真!</field>
                      </block>
                    </value>
                  </block>
                </statement>
                <statement name="ELSE">
                  <block type="text_print">
                    <value name="TEXT">
                      <block type="text">
                        <field name="TEXT">条件为假!</field>
                      </block>
                    </value>
                  </block>
                </statement>
              </block>
            </xml>
          `
      }

      const xml = window.Blockly.Xml.textToDom(exampleXml)
      window.Blockly.Xml.domToWorkspace(xml, workspace)
      console.log(`Example project "${exampleType}" loaded successfully`)
    } catch (e) {
      console.error("加载示例项目失败:", e)
      throw e
    }
  }

  const defineCustomBlocks = () => {
    if (!isClient) return // 确保只在客户端执行

    if (typeof window === "undefined" || !window.Blockly) return

    try {
      // 确保JavaScript对象已初始化
      if (!window.Blockly.JavaScript) {
        console.error("Blockly.JavaScript is not defined")
        return
      }

      // 定义AI相关自定义块
      window.Blockly.Blocks["ai_text_generation"] = {
        init: function () {
          this.appendValueInput("TEXT").setCheck("String").appendField("生成文本，提示词")
          this.setOutput(true, "String")
          this.setColour(160)
          this.setTooltip("使用AI生成文本")
          this.setHelpUrl("")
        },
      }

      window.Blockly.Blocks["ai_image_generation"] = {
        init: function () {
          this.appendValueInput("PROMPT").setCheck("String").appendField("生成图像，描述")
          this.setOutput(true, "String")
          this.setColour(160)
          this.setTooltip("使用AI生成图像")
          this.setHelpUrl("")
        },
      }

      // 添加AI语音生成块
      window.Blockly.Blocks["ai_speech_generation"] = {
        init: function () {
          this.appendValueInput("TEXT").setCheck("String").appendField("生成语音，文本")
          this.setOutput(true, "String")
          this.setColour(160)
          this.setTooltip("使用AI将文本转换为语音")
          this.setHelpUrl("")
        },
      }

      // 添加AI翻译块
      window.Blockly.Blocks["ai_translation"] = {
        init: function () {
          this.appendValueInput("TEXT").setCheck("String").appendField("翻译文本")
          this.appendDummyInput()
            .appendField("目标语言")
            .appendField(
              new window.Blockly.FieldDropdown([
                ["英语", "en"],
                ["中文", "zh"],
                ["日语", "ja"],
                ["韩语", "ko"],
                ["法语", "fr"],
                ["德语", "de"],
                ["西班牙语", "es"],
                ["俄语", "ru"],
              ]),
              "LANG",
            )
          this.setOutput(true, "String")
          this.setColour(160)
          this.setTooltip("将文本翻译成指定语言")
          this.setHelpUrl("")
        },
      }

      // 添加AI情感分析块
      window.Blockly.Blocks["ai_sentiment_analysis"] = {
        init: function () {
          this.appendValueInput("TEXT").setCheck("String").appendField("分析情感，文本")
          this.setOutput(true, "String")
          this.setColour(160)
          this.setTooltip("分析文本的情感倾向")
          this.setHelpUrl("")
        },
      }

      // 添加文本打印块
      window.Blockly.Blocks["text_print"] = {
        init: function () {
          this.appendValueInput("TEXT").setCheck(null).appendField("打印")
          this.setPreviousStatement(true, null)
          this.setNextStatement(true, null)
          this.setColour(160)
          this.setTooltip("打印文本到输出窗口")
          this.setHelpUrl("")
        },
      }

      // 添加延迟块
      window.Blockly.Blocks["delay"] = {
        init: function () {
          this.appendValueInput("TIME").setCheck("Number").appendField("延迟")
          this.appendDummyInput().appendField("毫秒")
          this.setPreviousStatement(true, null)
          this.setNextStatement(true, null)
          this.setColour(120)
          this.setTooltip("延迟执行指定的毫秒数")
          this.setHelpUrl("")
        },
      }

      // 添加警告框块
      window.Blockly.Blocks["alert"] = {
        init: function () {
          this.appendValueInput("TEXT").setCheck(null).appendField("显示警告框")
          this.setPreviousStatement(true, null)
          this.setNextStatement(true, null)
          this.setColour(160)
          this.setTooltip("显示一个警告框")
          this.setHelpUrl("")
        },
      }

      // 添加HTTP请求块
      window.Blockly.Blocks["http_request"] = {
        init: function () {
          this.appendValueInput("URL").setCheck("String").appendField("发送HTTP请求，URL")
          this.appendDummyInput()
            .appendField("方法")
            .appendField(
              new window.Blockly.FieldDropdown([
                ["GET", "GET"],
                ["POST", "POST"],
                ["PUT", "PUT"],
                ["DELETE", "DELETE"],
              ]),
              "METHOD",
            )
          this.setOutput(true, null)
          this.setColour(230)
          this.setTooltip("发送HTTP请求并获取响应")
          this.setHelpUrl("")
        },
      }

      // 添加JSON解析块
      window.Blockly.Blocks["json_parse"] = {
        init: function () {
          this.appendValueInput("TEXT").setCheck("String").appendField("解析JSON")
          this.setOutput(true, null)
          this.setColour(230)
          this.setTooltip("将JSON字符串解析为对象")
          this.setHelpUrl("")
        },
      }

      // 添加JSON字符串化块
      window.Blockly.Blocks["json_stringify"] = {
        init: function () {
          this.appendValueInput("OBJECT").setCheck(null).appendField("转换为JSON字符串")
          this.setOutput(true, "String")
          this.setColour(230)
          this.setTooltip("将对象转换为JSON字符串")
          this.setHelpUrl("")
        },
      }

      console.log("Custom blocks defined successfully")
    } catch (error) {
      console.error("Error defining custom blocks:", error)
    }
  }

  const getToolboxConfig = () => {
    return {
      kind: "categoryToolbox",
      contents: [
        {
          kind: "category",
          name: "逻辑",
          colour: "#5C81A6",
          contents: [
            { kind: "block", type: "controls_if" },
            { kind: "block", type: "logic_compare" },
            { kind: "block", type: "logic_operation" },
            { kind: "block", type: "logic_negate" },
            { kind: "block", type: "logic_boolean" },
          ],
        },
        {
          kind: "category",
          name: "循环",
          colour: "#5CA65C",
          contents: [
            { kind: "block", type: "controls_repeat_ext" },
            { kind: "block", type: "controls_whileUntil" },
            { kind: "block", type: "controls_for" },
            { kind: "block", type: "controls_forEach" },
          ],
        },
        {
          kind: "category",
          name: "数学",
          colour: "#5C68A6",
          contents: [
            { kind: "block", type: "math_number" },
            { kind: "block", type: "math_arithmetic" },
            { kind: "block", type: "math_single" },
            { kind: "block", type: "math_round" },
          ],
        },
        {
          kind: "category",
          name: "文本",
          colour: "#A65C81",
          contents: [
            { kind: "block", type: "text" },
            { kind: "block", type: "text_join" },
            { kind: "block", type: "text_append" },
            { kind: "block", type: "text_length" },
          ],
        },
        {
          kind: "category",
          name: "变量",
          colour: "#A6745C",
          custom: "VARIABLE",
        },
        {
          kind: "category",
          name: "函数",
          colour: "#745CA6",
          custom: "PROCEDURE",
        },
        {
          kind: "category",
          name: "AI功能",
          colour: "#A6A65C",
          contents: [
            { kind: "block", type: "ai_text_generation" },
            { kind: "block", type: "ai_image_generation" },
            { kind: "block", type: "ai_speech_generation" },
            { kind: "block", type: "ai_translation" },
            { kind: "block", type: "ai_sentiment_analysis" },
          ],
        },
        {
          kind: "category",
          name: "网络",
          colour: "#5CA6A6",
          contents: [
            { kind: "block", type: "http_request" },
            { kind: "block", type: "json_parse" },
            { kind: "block", type: "json_stringify" },
          ],
        },
        {
          kind: "category",
          name: "输出",
          colour: "#5CA6A6",
          contents: [
            { kind: "block", type: "text_print" },
            { kind: "block", type: "alert" },
          ],
        },
        {
          kind: "category",
          name: "控制",
          colour: "#A65C5C",
          contents: [{ kind: "block", type: "delay" }],
        },
      ],
    }
  }

  const handleRunCode = async () => {
    if (!code) return

    setIsRunning(true)
    setOutput("")
    setActiveTab("output")

    try {
      // 创建一个安全的执行环境
      const originalConsoleLog = console.log
      const logs: string[] = []

      // 重写console.log以捕获输出
      console.log = (...args) => {
        const output = args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg)).join(" ")
        logs.push(output)
        setOutput((prev) => prev + output + "\n")
        originalConsoleLog(...args)
      }

      // 添加模拟的AI函数
      const generateText = async (prompt: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const response = `AI生成的文本 (基于提示: ${prompt})`
        console.log(`生成文本: ${response}`)
        return response
      }

      const generateImage = async (prompt: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const imageUrl = `https://example.com/generated-image.jpg?prompt=${encodeURIComponent(prompt)}`
        console.log(`生成图像: ${imageUrl} (基于描述: ${prompt})`)
        return imageUrl
      }

      const generateSpeech = async (text: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        const audioUrl = `https://example.com/generated-speech.mp3?text=${encodeURIComponent(text)}`
        console.log(`生成语音: ${audioUrl} (基于文本: ${text})`)
        return audioUrl
      }

      const translateText = async (text: string, targetLang: string) => {
        await new Promise((resolve) => setTimeout(resolve, 800))
        const languages: Record<string, string> = {
          en: "英语",
          zh: "中文",
          ja: "日语",
          ko: "韩语",
          fr: "法语",
          de: "德语",
          es: "西班牙语",
          ru: "俄语",
        }
        const langName = languages[targetLang] || targetLang
        const translated = `[翻译成${langName}] ${text}`
        console.log(`翻译结果: ${translated}`)
        return translated
      }

      const analyzeSentiment = async (text: string) => {
        await new Promise((resolve) => setTimeout(resolve, 700))
        const sentiments = ["积极", "中性", "消极"]
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)]
        const score = (Math.random() * 100).toFixed(2)
        const result = `情感分析结果: ${sentiment} (置信度: ${score}%)`
        console.log(result)
        return result
      }

      const fetchData = async (url: string, method: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log(`发送${method}请求到: ${url}`)
        return `{"success": true, "data": {"id": ${Math.floor(Math.random() * 1000)}, "message": "模拟HTTP响应"}}`
      }

      // 执行代码
      const asyncFunction = new Function(
        "generateText",
        "generateImage",
        "generateSpeech",
        "translateText",
        "analyzeSentiment",
        "fetchData",
        `
        return (async () => {
          try {
            ${code}
          } catch (error) {
            console.log("执行错误: " + error.message);
          }
        })()
      `,
      )

      await asyncFunction(generateText, generateImage, generateSpeech, translateText, analyzeSentiment, fetchData)

      // 恢复原始console.log
      console.log = originalConsoleLog
    } catch (error) {
      console.error("Error executing code:", error)
      setOutput((prev) => prev + `执行代码时出错: ${error}\n`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSaveProject = () => {
    if (!isClient) return // 确保只在客户端执行

    if (!blocklyInstanceRef.current || typeof window === "undefined" || !window.Blockly || !window.Blockly.Xml) return

    try {
      const xml = window.Blockly.Xml.workspaceToDom(blocklyInstanceRef.current)
      const xmlText = window.Blockly.Xml.domToText(xml)

      // 创建一个Blob对象
      const blob = new Blob([xmlText], { type: "application/xml" })

      // 创建一个下载链接
      const a = document.createElement("a")
      a.download = "blockly-project.xml"
      a.href = URL.createObjectURL(blob)
      a.click()

      // 清理
      URL.revokeObjectURL(a.href)
    } catch (error) {
      console.error("Error saving project:", error)
      alert("保存项目时出错")
    }
  }

  const handleLoadProject = () => {
    if (!isClient) return // 确保只在客户端执行

    if (typeof window === "undefined" || !window.Blockly || !window.Blockly.Xml) return

    // 创建一个隐藏的文件输入元素
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = ".xml"

    fileInput.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const xmlText = e.target?.result as string
          const xml = window.Blockly.Xml.textToDom(xmlText)

          if (blocklyInstanceRef.current) {
            blocklyInstanceRef.current.clear()
            window.Blockly.Xml.domToWorkspace(xml, blocklyInstanceRef.current)
          }
        } catch (error) {
          console.error("Error loading project:", error)
          alert("加载项目时出错")
        }
      }

      reader.readAsText(file)
    }

    fileInput.click()
  }

  const handleReloadBlockly = () => {
    setBlocklyLoaded(false)
    setLoadingError(null)
    setOutput("")
    setCode("")
    generatorRegistered.current = false

    // 清除现有的Blockly实例
    if (blocklyInstanceRef.current) {
      try {
        blocklyInstanceRef.current.dispose()
      } catch (e) {
        console.error("Error disposing Blockly workspace:", e)
      }
    }

    // 重置重试计数器
    currentRetry.current = 0

    // 重新加载页面
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  const handleExampleChange = (value: string) => {
    setSelectedExample(value)
    if (blocklyInstanceRef.current && typeof window !== "undefined" && window.Blockly && window.Blockly.Xml) {
      try {
        loadExampleProject(blocklyInstanceRef.current, value)
      } catch (e) {
        console.error("加载示例项目失败:", e)
      }
    }
  }

  const handleCopyCode = () => {
    if (!isClient) return // 确保只在客户端执行

    navigator.clipboard.writeText(code).then(
      () => {
        alert("代码已复制到剪贴板")
      },
      (err) => {
        console.error("复制代码失败:", err)
        alert("复制代码失败")
      },
    )
  }

  const handleClearWorkspace = () => {
    if (!isClient) return // 确保只在客户端执行

    if (blocklyInstanceRef.current) {
      if (confirm("确定要清空工作区吗？此操作不可撤销。")) {
        blocklyInstanceRef.current.clear()
      }
    }
  }

  const handleExportCode = () => {
    if (!isClient) return // 确保只在客户端执行

    if (!code) return

    // 创建一个Blob对象
    const blob = new Blob([code], { type: "text/javascript" })

    // 创建一个下载链接
    const a = document.createElement("a")
    a.download = "ai-code-assistant.js"
    a.href = URL.createObjectURL(blob)
    a.click()

    // 清理
    URL.revokeObjectURL(a.href)
  }

  const toggleHelp = () => {
    setShowHelp(!showHelp)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <Card className="border-2 border-amber-100">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-amber-800">AI 代码助手</CardTitle>
                <CardDescription>使用积木式编程，轻松创建AI应用</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={toggleHelp}>
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>查看帮助</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {loadingError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>加载错误</AlertTitle>
                  <AlertDescription>
                    {loadingError}
                    <Button variant="outline" size="sm" className="ml-2" onClick={handleReloadBlockly}>
                      重新加载
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {showHelp && (
                <Alert>
                  <AlertTitle>使用帮助</AlertTitle>
                  <AlertDescription className="text-sm">
                    <p className="mb-2">1. 从左侧工具箱中拖拽积木到工作区创建程序</p>
                    <p className="mb-2">2. 使用示例项目下拉菜单加载预设的示例</p>
                    <p className="mb-2">3. 点击"运行"按钮执行您的代码，结果将显示在"运行结果"标签页</p>
                    <p className="mb-2">4. 使用"保存项目"和"加载项目"按钮保存和恢复您的工作</p>
                    <p className="mb-2">5. AI功能类别中包含文本生成、图像生成等AI积木</p>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between flex-wrap gap-2">
                <div className="flex space-x-2 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">示例项目:</span>
                    <Select value={selectedExample} onValueChange={handleExampleChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择示例项目" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">基础条件判断</SelectItem>
                        <SelectItem value="ai_text">AI文本生成</SelectItem>
                        <SelectItem value="ai_image">AI图像生成</SelectItem>
                        <SelectItem value="ai_translation">AI文本翻译</SelectItem>
                        <SelectItem value="http_request">HTTP请求示例</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLoadProject} disabled={!blocklyLoaded}>
                    <Upload className="h-4 w-4 mr-1" /> 加载项目
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSaveProject} disabled={!blocklyLoaded}>
                    <Save className="h-4 w-4 mr-1" /> 保存项目
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearWorkspace} disabled={!blocklyLoaded}>
                    <Trash2 className="h-4 w-4 mr-1" /> 清空工作区
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopyCode} disabled={!code}>
                    <Copy className="h-4 w-4 mr-1" /> 复制代码
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportCode} disabled={!code}>
                    <Download className="h-4 w-4 mr-1" /> 导出代码
                  </Button>
                  <Button onClick={handleRunCode} disabled={isRunning || !blocklyLoaded || !code}>
                    {isRunning ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> 运行中...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" /> 运行
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="blocks" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="blocks">积木编辑</TabsTrigger>
                  <TabsTrigger value="code">代码预览</TabsTrigger>
                  <TabsTrigger value="output">运行结果</TabsTrigger>
                </TabsList>
                <TabsContent value="blocks" className="border rounded-md p-0">
                  <div ref={blocklyDiv} style={{ height: "600px", width: "100%" }} className="bg-white">
                    {!blocklyLoaded && !loadingError && (
                      <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center">
                          <RefreshCw className="h-8 w-8 animate-spin text-amber-500 mb-2" />
                          <p>加载积木编辑器中...</p>
                          <div className="mt-4 text-xs text-gray-500">
                            <p>
                              已加载:{" "}
                              {Object.entries(loadingStatus)
                                .filter(([_, loaded]) => loaded)
                                .map(([name]) => name)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="code" className="border rounded-md p-4">
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto h-[600px] text-sm">
                    <code>{code || "// 您的代码将显示在这里"}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="output" className="border rounded-md p-4">
                  <div
                    ref={outputDiv}
                    className="bg-black text-green-400 p-4 rounded-md overflow-auto h-[600px] text-sm font-mono"
                  >
                    {output || "// 运行结果将显示在这里"}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t p-4">
            <div className="text-sm text-gray-500 w-full flex justify-between items-center">
              <p>提示：使用左侧工具箱中的积木拖拽到工作区创建程序，点击"运行"按钮执行您的代码。</p>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Share2 className="h-4 w-4 mr-1" /> 分享
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    Blockly: any
  }
}
