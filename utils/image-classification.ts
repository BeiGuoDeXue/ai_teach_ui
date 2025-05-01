// ImageNet类别名称的中英文映射
export const chineseClassMap: { [key: string]: string } = {
  background: "背景",
  airplane: "飞机",
  bicycle: "自行车",
  bird: "鸟",
  boat: "船",
  bottle: "瓶子",
  bus: "公共汽车",
  car: "汽车",
  cat: "猫",
  chair: "椅子",
  cow: "奶牛",
  "dining table": "餐桌",
  dog: "狗",
  horse: "马",
  motorcycle: "摩托车",
  person: "人",
  "potted plant": "盆栽植物",
  sheep: "羊",
  sofa: "沙发",
  train: "火车",
  tv: "电视",
  // 添加更多常见类别的中文映射
  "cell phone": "手机",
  computer: "电脑",
  keyboard: "键盘",
  mouse: "鼠标",
  remote: "遥控器",
  laptop: "笔记本电脑",
  book: "书",
  clock: "时钟",
  vase: "花瓶",
  scissors: "剪刀",
  "teddy bear": "泰迪熊",
  "hair drier": "吹风机",
  toothbrush: "牙刷",
  apple: "苹果",
  banana: "香蕉",
  orange: "橙子",
  broccoli: "西兰花",
  carrot: "胡萝卜",
  "hot dog": "热狗",
  pizza: "披萨",
  donut: "甜甜圈",
  cake: "蛋糕",
  bed: "床",
  toilet: "马桶",
  microwave: "微波炉",
  oven: "烤箱",
  toaster: "烤面包机",
  sink: "水槽",
  refrigerator: "冰箱",
  umbrella: "雨伞",
  handbag: "手提包",
  tie: "领带",
  suitcase: "行李箱",
  frisbee: "飞盘",
  skis: "滑雪板",
  snowboard: "单板滑雪",
  "sports ball": "运动球",
  kite: "风筝",
  "baseball bat": "棒球棒",
  "baseball glove": "棒球手套",
  skateboard: "滑板",
  surfboard: "冲浪板",
  "tennis racket": "网球拍",
  "wine glass": "酒杯",
  cup: "杯子",
  fork: "叉子",
  knife: "刀",
  spoon: "勺子",
  bowl: "碗",
  backpack: "背包",
  // 添加常见服装类别
  kimono: "和服",
  dress: "连衣裙",
  suit: "西装",
  shirt: "衬衫",
  jacket: "夹克",
  coat: "外套",
  hat: "帽子",
  shoe: "鞋子",
  sandal: "凉鞋",
  boot: "靴子",
  tie: "领带",
  sunglasses: "太阳镜",
  handbag: "手提包",
  suitcase: "行李箱",
}

/**
 * 预处理图像以进行分类
 * @param imageElement - 图像元素或URL
 * @param targetSize - 目标尺寸（默认224x224用于MobileNet）
 * @returns 图像张量
 */
export async function preprocessImage(imageElement: HTMLImageElement | string, targetSize = 224) {
  // 动态导入TensorFlow.js
  const tf = await import("@tensorflow/tfjs")

  // 创建一个临时canvas用于处理图像\
  const tempCanvas = document.createElement("canvas")
  tempCanvas.width = targetSize
  tempCanvas.height = targetSize

  const ctx = tempCanvas.getContext("2d")
  if (!ctx) {
    throw new Error("无法创建canvas上下文")
  }

  // 如果传入的是URL字符串，先加载图像
  let imgElement: HTMLImageElement
  if (typeof imageElement === "string") {
    imgElement = new Image()
    imgElement.crossOrigin = "anonymous"
    await new Promise((resolve, reject) => {
      imgElement.onload = resolve
      imgElement.onerror = reject
      imgElement.src = imageElement
    })
  } else {
    imgElement = imageElement
  }

  // 将图像绘制到canvas上，调整大小
  ctx.drawImage(imgElement, 0, 0, targetSize, targetSize)

  // 获取图像数据
  const imageData = ctx.getImageData(0, 0, targetSize, targetSize)

  // 创建张量
  const tensor = tf.browser.fromPixels(imageData)

  // 预处理张量：归一化到[-1, 1]范围
  const normalized = tensor.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1))

  // 添加batch维度
  const batched = normalized.expandDims(0)

  return { tensor, normalized, batched }
}

/**
 * 获取分类结果的中文名称
 * @param englishName - 英文类别名称
 * @returns 中文类别名称
 */
export function getChineseClassName(englishName: string): string {
  // 直接查找完全匹配
  if (englishName in chineseClassMap) {
    return `${chineseClassMap[englishName]} (${englishName})`
  }

  // 尝试部分匹配
  for (const [engKey, chineseName] of Object.entries(chineseClassMap)) {
    if (englishName.includes(engKey)) {
      return `${chineseName} (${englishName})`
    }
  }

  // 没有匹配返回原始名称
  return englishName
}
