param(
  [Parameter(Mandatory = $true)]
  [string]$Milestone,

  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
)

$ErrorActionPreference = 'Stop'

$safeMilestone = $Milestone.ToLowerInvariant() -replace '[^a-z0-9._-]', '-'
$outDir = Join-Path $RepoRoot 'docs\retrospectives'
$outPath = Join-Path $outDir "$safeMilestone-skillopt-readiness.md"
$templatePath = Join-Path $PSScriptRoot 'template.md'

if (-not (Test-Path -LiteralPath $templatePath)) {
  throw "Template not found: $templatePath"
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

$diffStat = Invoke-GitText -Arguments @('diff', '--stat')
if (-not $diffStat) { $diffStat = '<no unstaged diff stat>' }

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
Generated scaffold. Fill the analysis sections before closeout.

Current git status:
$status

Current unstaged diff stat:
$diffStat

Current unstaged changed files:
$changedFiles
-->

"@

Set-Content -LiteralPath $outPath -Value ($preface + $content) -Encoding utf8
Write-Output $outPath
