
@REM Linux 64bit binary compile
@REM SET GOOS=linux& SET GOARCH=amd64& go build -o ./release/bin/octopus-server-test.exe server.go
@REM or
@REM SET GOOS=linux& SET GOARCH=arm64& go build -o ./release/bin/octopus-server-test.exe server.go

@REM Linux 32bit binary compile
 SET GOOS=linux& SET GOARCH=386& go build -o ./release/bin/octopus-server-test32.exe server.go