interface Window {
  webkitSpeechRecognition: any
  Blockly: {
    inject: (container: HTMLElement, options: any) => any
    Xml?: {
      textToDom?: (text: string) => Document
      domToWorkspace?: (dom: Document, workspace: any) => void
      workspaceToDom?: (workspace: any) => Document
      domToText?: (dom: Document) => string
    }
    JavaScript?: {
      workspaceToCode: (workspace: any) => string
      valueToCode: (block: any, name: string, order: number) => string
      ORDER_ATOMIC: number
      ORDER_NONE: number
      ORDER_AWAIT: number
    }
    Blocks: Record<string, any>
  }
}
