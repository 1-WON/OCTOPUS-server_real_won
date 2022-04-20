package mail

import (
	"encoding/base64"
	"fmt"
	"net/smtp"
	"octopus-api/util/log"
)

const SMTP_SERVER = "smtp.gmail.com"
const SMTP_PORT = "587"
const SEND_MAIL string = "octopus.zzang@gmail.com"
const SEND_MAIL_PASSWORD = "octopus2021"
const SEND_MAIL_TEMPLATE = "Subject: %s\r\nContent-Transfer-Encoding: base64\r\n%s"

func SendMail(to []string, title string, msg string) {
	auth := smtp.PlainAuth("", SEND_MAIL, SEND_MAIL_PASSWORD, SMTP_SERVER)
	msg = fmt.Sprintf(SEND_MAIL_TEMPLATE, title, base64.StdEncoding.EncodeToString([]byte(msg)))

	err := smtp.SendMail(fmt.Sprintf("%s:%s", SMTP_SERVER, SMTP_PORT), auth, SEND_MAIL, to, []byte(msg))
	if err != nil {
		log.ERROR() <- err.Error()
	}
}
