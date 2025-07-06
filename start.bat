@echo off
echo 正在启动 VuePress 开发服务器...
echo.
echo 请确保已安装 Node.js 和 Yarn
echo.
echo 如果遇到问题，请检查：
echo 1. Node.js 是否已安装 (node --version)
echo 2. Yarn 是否已安装 (yarn --version)
echo 3. 依赖是否已安装 (yarn install)
echo.
echo 启动中...
yarn docs:dev
pause 