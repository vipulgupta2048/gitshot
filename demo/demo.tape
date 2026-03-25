Output demo/gitshot-demo.gif

Set FontSize 22
Set Width 1200
Set Height 600
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 50ms
Set Shell fish

Require node

Hide
Type "set -gx PATH /Users/vipulgupta2048/gitshot/node_modules/.bin $PATH"
Enter
Type "function gitshot; node /Users/vipulgupta2048/gitshot/dist/index.js $argv; end"
Enter
Type "cd /Users/vipulgupta2048/gitshot"
Enter
Sleep 1s
Type "clear"
Enter
Sleep 500ms
Show

Type "npx gitshot"
Enter
Sleep 3s

Type ""
Enter
Sleep 300ms

Type "npx gitshot rick.gif"
Enter
Sleep 10s

Type ""
Enter
Sleep 300ms

Type "npx gitshot rick.gif --issue 1 -m 'Rickrolling'"
Enter
Sleep 10s

Sleep 2s
