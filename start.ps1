Write-Host "正在启动 VuePress 开发服务器..." -ForegroundColor Green
Write-Host ""
Write-Host "请确保已安装 Node.js 和 Yarn" -ForegroundColor Yellow
Write-Host ""
Write-Host "如果遇到问题，请检查：" -ForegroundColor Yellow
Write-Host "1. Node.js 是否已安装 (node --version)" -ForegroundColor Cyan
Write-Host "2. Yarn 是否已安装 (yarn --version)" -ForegroundColor Cyan
Write-Host "3. 依赖是否已安装 (yarn install)" -ForegroundColor Cyan
Write-Host ""
Write-Host "启动中..." -ForegroundColor Green

try {
    yarn docs:dev
} catch {
    Write-Host "启动失败，请检查环境配置" -ForegroundColor Red
    Write-Host "错误信息: $_" -ForegroundColor Red
}

Read-Host "按任意键退出" 