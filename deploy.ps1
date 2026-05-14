# ============================================
# VisiTrack - Quick Deploy Script
# Usage: .\deploy.ps1
# Usage with message: .\deploy.ps1 "your commit message"
# ============================================

param(
    [string]$CommitMessage = ""
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   VisiTrack - Deploy to Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if there are any changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ Nothing to commit. Your code is already up to date." -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

# Show changed files
Write-Host "📁 Changed files:" -ForegroundColor White
git status --short
Write-Host ""

# Get commit message if not provided
if ($CommitMessage -eq "") {
    $CommitMessage = Read-Host "💬 Enter commit message (or press Enter for auto message)"
    if ($CommitMessage -eq "") {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $CommitMessage = "update: $timestamp"
    }
}

# Stage all changes
Write-Host ""
Write-Host "📦 Staging all changes..." -ForegroundColor Blue
git add .

# Commit
Write-Host "✍️  Committing: '$CommitMessage'" -ForegroundColor Blue
git commit -m $CommitMessage

# Push to GitHub (this triggers Vercel auto-deploy)
Write-Host "🚀 Pushing to GitHub → Vercel will auto-deploy..." -ForegroundColor Green
git push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Done! Vercel is now deploying." -ForegroundColor Green
Write-Host "  🌐 Check: https://vercel.com/dashboard" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
