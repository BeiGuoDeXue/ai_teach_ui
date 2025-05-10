// 简单的用户存储系统（在实际应用中，这应该是数据库）
interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
}

// 模拟数据库
const users: User[] = []

// 生成唯一ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 注册新用户
export const registerUser = (name: string, email: string, password: string): { success: boolean; message: string } => {
  // 检查邮箱是否已被注册
  if (users.some((user) => user.email === email)) {
    return { success: false, message: "该邮箱已被注册" }
  }

  // 创建新用户
  const newUser: User = {
    id: generateId(),
    name,
    email,
    password, // 注意：实际应用中应该对密码进行哈希处理
    createdAt: new Date(),
  }

  // 添加到"数据库"
  users.push(newUser)

  return { success: true, message: "注册成功！" }
}

// 用户登录
export const loginUser = (
  email: string,
  password: string,
): { success: boolean; message: string; user?: Omit<User, "password"> } => {
  // 查找用户
  const user = users.find((user) => user.email === email)

  // 用户不存在
  if (!user) {
    return { success: false, message: "用户不存在，请先注册" }
  }

  // 密码不匹配
  if (user.password !== password) {
    return { success: false, message: "密码错误，请重试" }
  }

  // 登录成功，返回用户信息（不包含密码）
  const { password: _, ...userWithoutPassword } = user
  return {
    success: true,
    message: "登录成功！",
    user: userWithoutPassword,
  }
}

// 获取所有用户（仅用于测试）
export const getAllUsers = (): Omit<User, "password">[] => {
  return users.map(({ password, ...user }) => user)
}
