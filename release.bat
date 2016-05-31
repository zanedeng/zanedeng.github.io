@mode con cols=50 lines=20
@title 一键发布工具 
@color 0a
@echo off

echo 正在搜索SVN工具，请耐心等待...
echo.
set filename=TortoiseSVN\bin\TortoiseProc.exe
SET programFiles=Program Files
SET programFiles_x86=Program Files (x86)
for %%a in (C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
  if exist "%%a:\%programFiles%\%filename%" (
      SET SVN="%%a:\%programFiles%\%filename%"
      GOTO RELEASE
  )
  if exist "%%a:\%programFiles_x86%\%filename%" (
      SET SVN="%%a:\%programFiles_x86%\%filename%"
      GOTO RELEASE
  )
)
PAUSE
:RELEASE
REM SVN 自动更新工具
SET DIR1=./
%SVN%/command:update /path:"%DIR1%" /closeonend:2
echo 正在发布，请耐心等待...
echo.

REM 拷贝 dist 目录下的合并文件到发布的 libs 目录
set src_js=".\dist\*.js"
set dst_table=".\www\libs"
echo F|XCOPY /y %src_table%  %dst_table%

REM 加密代码
node build/encryption.js

REM 自动调出SVN提交窗口
%SVN%/command:commit /path:"%DIR1%" /closeonend:2