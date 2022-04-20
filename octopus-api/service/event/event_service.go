package event

import (
	"fmt"
	"octopus-api/bean"
	"octopus-api/model"
	"octopus-api/util/log"
)

func SaveAuditLog() chan<- *bean.AuditLog {
	c := make(chan *bean.AuditLog)
	go func() {
		defer close(c)
		auditLog := <-c
		err := model.InsertAuditLog(auditLog)
		if err != nil {
			log.ERROR() <- fmt.Sprintf("%#v", auditLog)
		}
	}()
	return c
}
