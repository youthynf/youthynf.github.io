@echo off
echo 检查开发环境...
echo.

echo 检查 Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Node.js 已安装
    node --version
) else (
    echo [✗] Node.js 未安装，请访问 https://nodejs.org/ 下载安装
)

echo.
echo 检查 Yarn...
yarn --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Yarn 已安装
    yarn --version
) else (
    echo [✗] Yarn 未安装，请运行: npm install -g yarn
)

echo.
echo 检查项目依赖...
if exist "node_modules" (
    echo [✓] 项目依赖已安装
) else (
    echo [✗] 项目依赖未安装，请运行: yarn install
)

echo.
echo 检查完成！
pause 