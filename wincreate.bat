@echo off
mkdir $0
echo "<!doctype html>
<html>
  <head>
    <title>$0</title>
    <script src='tsinject.js'></script>
  </head>
  <body>
    <script>
      // your tsinject code here!
    </script>
  </body>
</html>">"./$0/index.html"
cd $0
git clone https://github.com/munchkinhalfling/tsinject.git
rm wincreate.bat
rm demo.html
