package log

import (
	"fmt"
	rotatelogs "github.com/lestrrat-go/file-rotatelogs"
	"log"
	"octopus-api/bean/constant"
	"octopus-api/util/config"
	"os"
	"path/filepath"
	"runtime"
	"time"
)

var logLevel constant.LOG_LEVEL

func init() {
	serviceHome := os.Getenv("OCTOPUS_HOME")
	if serviceHome == "" {
		serviceHome = ".."
	}
	logPath := fmt.Sprintf("%s/log/%s", serviceHome, "octopus_%Y%m%d.log")
	rl, _ := rotatelogs.New(
		logPath,
		rotatelogs.WithMaxAge(time.Hour*24*30),
	)
	log.SetOutput(rl)

	logLevel = constant.LOG_LEVEL(config.GetIntDefault("log.level", 2))
}

func ERROR() chan<- string {
	c := make(chan string)
	_, file, line, ok := runtime.Caller(1)
	if !ok {
		file = "???"
		line = 0
	}
	go func() {
		defer close(c)
		msg := <-c
		if logLevel < constant.LOG_LEVEL_ERROR {
			return
		}
		file = parseFilePath(file)
		log.Println(fmt.Sprintf("[ERROR] %s:%d %s", file, line, msg))
	}()

	return c
}

func INFO() chan<- string {
	c := make(chan string)
	_, file, line, ok := runtime.Caller(1)
	if !ok {
		file = "???"
		line = 0
	}
	go func() {
		defer close(c)
		msg := <-c
		if logLevel < constant.LOG_LEVEL_INFO {
			return
		}
		file = parseFilePath(file)
		log.Println(fmt.Sprintf("[INFO] %s:%d %s", file, line, msg))
	}()

	return c
}

func DEBUG() chan<- string {
	c := make(chan string)
	_, file, line, ok := runtime.Caller(1)
	if !ok {
		file = "???"
		line = 0
	}
	go func() {
		defer close(c)
		msg := <-c
		if logLevel < constant.LOG_LEVEL_DEBUG {
			return
		}
		file = parseFilePath(file)
		log.Println(fmt.Sprintf("[DEBUG] %s:%d %s", file, line, msg))
	}()

	return c
}

func parseFilePath(fPath string) (fileName string) {
	_, fileName = filepath.Split(fPath)

	return
}
