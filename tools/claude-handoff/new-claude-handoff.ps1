param(
  [Parameter(Mandatory = $true)]
  [string]$Milestone,

  [string]$RepoRoot
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
} else {
  $RepoRoot = (Resolve-Path $RepoRoot).Path
}

$safeMilestone = $Milestone.ToLowerInvariant() -replace '[^a-z0-9._-]', '-'
$outDir = Join-Path $RepoRoot 'docs\milestones'
$outPath = Join-Path $outDir "$safeMilestone-claude-architecture-handoff.md"
$templatePath = Join-Path $outDir 'templates\claude-architecture-handoff.md'

if (-not (Test-Path -LiteralPath $templatePath)) {
  throw "Template not found: $templatePath"
}

if (Test-Path -LiteralPath $outPath) {
  Write-Output $outPath
  exit 0
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Invoke-GitText {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  $previous = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $output = & git -c core.autocrlf=false -C $RepoRoot @Arguments 2>$null
    return ($output -join "`n")
  } finally {
    $ErrorActionPreference = $previous
  }
}

$branch = Invoke-GitText -Arguments @('branch', '--show-current')
if (-not $branch) { $branch = '<unknown>' }

$status = Invoke-GitText -Arguments @('status', '--short')
if (-not $status) { $status = '<clean>' }

$changedFiles = Invoke-GitText -Arguments @('diff', '--name-only')
if (-not $changedFiles) { $changedFiles = '<no unstaged changed files>' }

$template = Get-Content -LiteralPath $templatePath -Raw
$date = Get-Date -Format 'yyyy-MM-dd'

$content = $template `
  -replace '<Milestone>', $Milestone `
  -replace '<YYYY-MM-DD>', $date `
  -replace '<branch>', $branch

$preface = @"
<!--
Generated scaffold. Replace placeholders with concise repository evidence.

Git status at creation:
$status

Unstaged changed files at creation:
$changedFiles
-->

"@

Set-Content -LiteralPath $outPath -Value ($preface + $content) -Encoding utf8
Write-Output $outPath
