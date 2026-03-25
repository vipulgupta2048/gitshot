Output demo/gitshot-demo.gif

Set FontSize 22
Set Width 1200
Set Height 600
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 80ms

Type "# Upload a screenshot to a GitHub issue"
Enter
Sleep 800ms

Type "npx gitshot bug-screenshot.png --backend catbox"
Enter
Sleep 500ms

# Wait for real output
Sleep 4s

Type ""
Sleep 500ms

Type "# Pipe it into a PR comment"
Enter
Sleep 600ms

Type "npx gitshot fix-preview.png | gh pr comment 42 --body-file -"
Enter
Sleep 4s

Sleep 2s
