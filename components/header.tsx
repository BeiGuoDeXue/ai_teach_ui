"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser, loginUser } from "@/lib/auth"

export default function Header() {
  const pathname = usePathname()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [authSuccess, setAuthSuccess] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    // 简单验证
    if (!loginEmail || !loginPassword) {
      setAuthError("请填写所有必填字段")
      return
    }

    // 使用身份验证服务
    const result = loginUser(loginEmail, loginPassword)

    if (result.success) {
      setAuthSuccess(result.message)
      setCurrentUser(result.user || null)
      setIsLoggedIn(true)

      setTimeout(() => {
        setIsLoginOpen(false)
        setAuthSuccess("")
        // 重置表单
        setLoginEmail("")
        setLoginPassword("")
      }, 1500)
    } else {
      setAuthError(result.message)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    // 简单验证
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setAuthError("请填写所有必填字段")
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      setAuthError("两次输入的密码不一致")
      return
    }

    // 使用注册服务
    const result = registerUser(registerName, registerEmail, registerPassword)

    if (result.success) {
      setAuthSuccess(result.message)
      setTimeout(() => {
        setIsRegisterOpen(false)
        setAuthSuccess("")
        // 重置表单
        setRegisterName("")
        setRegisterEmail("")
        setRegisterPassword("")
        setRegisterConfirmPassword("")
        // 自动打开登录对话框
        setTimeout(() => setIsLoginOpen(true), 500)
      }, 1500)
    } else {
      setAuthError(result.message)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  const navItems = [
    { href: "/", label: "首页" },
    { href: "/courses", label: "课程" },
    { href: "/ai-experience", label: "AI体验" },
    { href: "/ai-code-assistant", label: "AI代码助手" },
    { href: "/tools", label: "工具" },
    { href: "/datasets", label: "数据集" },
    { href: "/readings", label: "读本" },
    { href: "/activities", label: "活动" },
  ]

  return (
    <header className="border-b sticky top-0 z-50 bg-white">
      <div className="bg-gray-900 text-white py-1">
        <div className="container mx-auto px-4 flex justify-end text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1 text-blue-400" />
              <span>400-1014-137</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1 text-blue-400" />
              <span>support@veeknexus.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E5%85%AC%E5%8F%B8%E6%A0%87%E9%A2%98-VMjnw7th193vuQnDCNLxHBOA3TCKLh.png"
              alt="Veek Nexus"
              width={240}
              height={70}
              className="h-14 w-auto"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-gray-700 hover:text-amber-600 px-4 py-2 ${pathname.startsWith(item.href) ? "text-amber-600 font-medium" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎，{currentUser?.name}</span>
              <Button className="rounded-full px-6 bg-amber-600 hover:bg-amber-700" onClick={handleLogout}>
                退出
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-full px-6 border-amber-600 text-amber-600 hover:bg-amber-50"
                onClick={() => setIsRegisterOpen(true)}
              >
                注册
              </Button>
              <Button
                className="rounded-full px-6 bg-amber-600 hover:bg-amber-700"
                onClick={() => setIsLoginOpen(true)}
              >
                登录
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 登录对话框 */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">用户登录</DialogTitle>
            <DialogDescription className="text-center">登录您的账户以访问所有功能</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            {authError && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{authError}</div>}
            {authSuccess && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{authSuccess}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">电子邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入您的电子邮箱"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入您的密码"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <a href="#" className="text-amber-600 hover:text-amber-500">
                  忘记密码?
                </a>
              </div>
              <div className="text-sm">
                还没有账号?{" "}
                <button
                  type="button"
                  className="text-amber-600 hover:text-amber-500"
                  onClick={() => {
                    setIsLoginOpen(false)
                    setAuthError("")
                    setAuthSuccess("")
                    setTimeout(() => setIsRegisterOpen(true), 100)
                  }}
                >
                  立即注册
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
              登录
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 注册对话框 */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">用户注册</DialogTitle>
            <DialogDescription className="text-center">创建一个新账户以访问所有功能</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4 py-4">
            {authError && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{authError}</div>}
            {authSuccess && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{authSuccess}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                placeholder="请输入您的姓名"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">电子邮箱</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="请输入您的电子邮箱"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">密码</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="请设置您的密码"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">确认密码</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="请再次输入密码"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-sm text-right">
              已有账号?{" "}
              <button
                type="button"
                className="text-amber-600 hover:text-amber-500"
                onClick={() => {
                  setIsRegisterOpen(false)
                  setAuthError("")
                  setAuthSuccess("")
                  setTimeout(() => setIsLoginOpen(true), 100)
                }}
              >
                立即登录
              </button>
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
              注册
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}
