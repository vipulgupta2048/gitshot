Output demo/compare-demo.gif

Set FontSize 22
Set Width 1200
Set Height 600
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 80ms

Type "# Upload multiple images for a visual diff"
Enter
Sleep 600ms

Type "npx gitshot before.png after.png"
Enter
Sleep 5s

Sleep 500ms

Type "# Create an issue with a screenshot"
Enter
Sleep 600ms

Type 'npx gitshot bug.png | gh issue create --title "UI Bug" --body-file -'
Enter
Sleep 4s

Sleep 2s
