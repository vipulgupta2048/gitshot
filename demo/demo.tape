Output demo/gitshot-demo.gif

Set FontSize 22
Set Width 1200
Set Height 600
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 80ms

Type "# Upload rick.gif and comment on a PR"
Enter
Sleep 800ms

Type "npx gitshot rick.gif --pr 42"
Enter
Sleep 500ms

# Wait for real output
Sleep 4s

Type ""
Sleep 500ms

Type "# Upload and comment on an issue"
Enter
Sleep 600ms

Type "npx gitshot rick.gif --issue 10 -m 'Never gonna give you up'"
Enter
Sleep 4s

Sleep 2s
