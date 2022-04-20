package controller

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"octopus-api/bean"
	"octopus-api/util/log"
	"octopus-api/util/mail"
)

func SendPseudoFileInfo(c *gin.Context) {
	title := "가명정보 파일 정보"
	qr := c.Query("qr")
	if qr == "" {
		log.ERROR() <- "Empty qr code !!"
		c.String(http.StatusOK, "전송 데이터가 유효하지 않습니다")
		return
	}
	decodedString, _ := base64.StdEncoding.DecodeString(qr)
	jsonString := string(decodedString)
	request := new(bean.SendPseudoFileInfoRequest)
	err := json.Unmarshal([]byte(jsonString), request)
	if err != nil {
		log.ERROR() <- "Invalid json String !!"
		c.String(http.StatusOK, "전송 데이터가 유효하지 않습니다")
		return
	}
	to := request.Email
	if request.FileName != "" {
		title = fmt.Sprintf("%s(%s)", title, request.FileName)
	}
	msg := fmt.Sprintf("압축 비밀번호 : %s\n무결성 정보 : %s", request.ZipPassword, request.FileHash)

	go mail.SendMail(to, title, msg)

	c.String(http.StatusOK, fmt.Sprintf("가명정보 파일 정보를 [%s] 로 발송 했습니다.", to))
}
