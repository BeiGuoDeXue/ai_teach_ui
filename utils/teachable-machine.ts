import * as tf from "@tensorflow/tfjs"

// 定义训练参数
const TRAINING_EPOCHS = 50
const LEARNING_RATE = 0.001
const BATCH_SIZE = 16

// 定义分类器类
export class TeachableMachineClassifier {
  private model: tf.LayersModel | null = null
  private labels: string[] = []
  private isModelReady = false
  private normalizationConstant = 255.0
  private inputShape = [224, 224, 3] // 输入图像尺寸

  constructor() {
    this.isModelReady = false
  }

  // 初始化模型 - 不再尝试加载外部MobileNet模型
  async initialize(): Promise<void> {
    try {
      console.log("初始化TensorFlow.js...")

      // 确保TensorFlow.js已准备就绪
      await tf.ready()
      console.log("TensorFlow.js已准备就绪")

      // 标记为已准备好
      this.isModelReady = true
      console.log("分类器初始化完成")
    } catch (error) {
      console.error("初始化分类器时出错:", error)
      throw new Error(`初始化分类器失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // 检查模型是否已准备好
  isReady(): boolean {
    return this.isModelReady
  }

  // 预处理图像
  private preprocessImage(image: HTMLImageElement | HTMLCanvasElement): tf.Tensor {
    return tf.tidy(() => {
      // 读取图像数据
      let tensor = tf.browser.fromPixels(image)

      // 调整大小为224x224
      tensor = tf.image.resizeBilinear(tensor, [this.inputShape[0], this.inputShape[1]])

      // 归一化像素值到[0,1]
      return tensor.toFloat().div(this.normalizationConstant)
    })
  }

  // 创建一个简单的CNN模型
  private createModel(numClasses: number): tf.LayersModel {
    const model = tf.sequential()

    // 第一个卷积层
    model.add(
      tf.layers.conv2d({
        inputShape: this.inputShape,
        kernelSize: 3,
        filters: 16,
        strides: 1,
        activation: "relu",
        kernelInitializer: "varianceScaling",
      }),
    )
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))

    // 第二个卷积层
    model.add(
      tf.layers.conv2d({
        kernelSize: 3,
        filters: 32,
        strides: 1,
        activation: "relu",
        kernelInitializer: "varianceScaling",
      }),
    )
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))

    // 第三个卷积层
    model.add(
      tf.layers.conv2d({
        kernelSize: 3,
        filters: 64,
        strides: 1,
        activation: "relu",
        kernelInitializer: "varianceScaling",
      }),
    )
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))

    // 展平层
    model.add(tf.layers.flatten())

    // 全连接层
    model.add(
      tf.layers.dense({
        units: 128,
        activation: "relu",
        kernelInitializer: "varianceScaling",
        kernelRegularizer: tf.regularizers.l2({ l2: 0.001 }),
      }),
    )
    model.add(tf.layers.dropout({ rate: 0.5 }))

    // 输出层
    model.add(
      tf.layers.dense({
        units: numClasses,
        activation: "softmax",
        kernelInitializer: "varianceScaling",
      }),
    )

    return model
  }

  // 训练模型
  async train(
    samples: { image: HTMLImageElement | HTMLCanvasElement; label: string }[],
    progressCallback?: (epoch: number, loss: number) => void,
  ): Promise<void> {
    if (!this.isModelReady) {
      throw new Error("分类器尚未初始化")
    }

    try {
      // 获取唯一的标签
      this.labels = Array.from(new Set(samples.map((s) => s.label)))
      console.log("分类标签:", this.labels)

      if (this.labels.length < 2) {
        throw new Error("至少需要两个不同的分类标签")
      }

      // 创建模型
      this.model = this.createModel(this.labels.length)

      // 编译模型
      this.model.compile({
        optimizer: tf.train.adam(LEARNING_RATE),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      })

      // 准备训练数据
      const imagesTensor: tf.Tensor[] = []
      const labelsTensor: number[] = []

      console.log("准备训练数据...")

      // 处理每个样本
      for (const sample of samples) {
        try {
          // 预处理图像
          const imageTensor = this.preprocessImage(sample.image)
          imagesTensor.push(imageTensor)

          // 获取标签索引
          const labelIndex = this.labels.indexOf(sample.label)
          labelsTensor.push(labelIndex)
        } catch (err) {
          console.warn("处理样本时出错:", err)
          // 继续处理其他样本
        }
      }

      if (imagesTensor.length === 0) {
        throw new Error("没有有效的训练样本")
      }

      // 将图像张量堆叠成一个批次
      const xs = tf.stack(imagesTensor)

      // 创建one-hot编码的标签
      const ys = tf.oneHot(tf.tensor1d(labelsTensor, "int32"), this.labels.length)

      console.log(`开始训练模型，共 ${imagesTensor.length} 个样本...`)

      // 训练模型
      await this.model.fit(xs, ys, {
        epochs: TRAINING_EPOCHS,
        batchSize: Math.min(BATCH_SIZE, imagesTensor.length),
        shuffle: true,
        validationSplit: 0.1,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            if (progressCallback && logs) {
              progressCallback(epoch, logs.loss as number)
            }
          },
        },
      })

      console.log("模型训练完成")

      // 清理临时张量
      xs.dispose()
      ys.dispose()
    } catch (error) {
      console.error("训练模型时出错:", error)
      throw new Error(`训练模型失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // 预测图像分类
  async predict(image: HTMLImageElement | HTMLCanvasElement): Promise<{ className: string; probability: number }[]> {
    if (!this.model || !this.isModelReady) {
      throw new Error("模型尚未训练")
    }

    try {
      return tf.tidy(() => {
        // 预处理图像
        const imageTensor = this.preprocessImage(image)
        // 扩展维度以匹配模型输入 [1, 224, 224, 3]
        const batchedImage = imageTensor.expandDims(0)

        // 进行预测
        const predictions = this.model!.predict(batchedImage) as tf.Tensor
        const probabilities = predictions.dataSync()

        // 格式化结果
        const result = Array.from(probabilities)
          .map((probability, index) => ({
            className: this.labels[index],
            probability: probability,
          }))
          .sort((a, b) => b.probability - a.probability)

        return result
      })
    } catch (error) {
      console.error("预测时出错:", error)
      throw new Error(`预测失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // 保存模型
  async saveModel(): Promise<tf.io.SaveResult> {
    if (!this.model) {
      throw new Error("没有训练好的模型可保存")
    }
    return await this.model.save("downloads://teachable-machine-model")
  }

  // 加载模型
  async loadModel(modelUrl: string): Promise<void> {
    try {
      this.model = await tf.loadLayersModel(modelUrl)
      console.log("模型加载成功")
    } catch (error) {
      console.error("加载模型时出错:", error)
      throw new Error("无法加载模型")
    }
  }

  // 释放资源
  dispose(): void {
    if (this.model) {
      this.model.dispose()
      this.model = null
    }
    this.isModelReady = false
    console.log("模型资源已释放")
  }
}

// 创建图像元素并加载图像
export function createImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(new Error("加载图像失败"))
    img.src = src
  })
}

// 从Canvas获取图像数据
export function getImageFromCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  // 创建一个新的canvas，大小为224x224
  const targetCanvas = document.createElement("canvas")
  targetCanvas.width = 224
  targetCanvas.height = 224

  // 将原始canvas的内容绘制到新canvas上
  const ctx = targetCanvas.getContext("2d")
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 224, 224)
  }

  return targetCanvas
}
