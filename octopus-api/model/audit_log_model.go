package model

import (
	"octopus-api/bean"
	"octopus-api/db"
	"octopus-api/util/log"
)

func InsertAuditLog(auditLog *bean.AuditLog) error {
	_, err := db.DB.NamedExec(
		`
			INSERT INTO audit_log
			(
			 	ip,
			 	user_id,
			 	menu_code,
			 	audit_type,
			 	comment,
			 	email
			)
			VALUES 
			(
			 	:ip,
			 	:user_id,
			 	:menu_code,
			 	:audit_type,
			 	:comment,
			 	:email
			)`, auditLog)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

func SelectAuditLostList(request *bean.GetAuditLogListRequest) ([]bean.AuditLog, error) {
	var l []bean.AuditLog
	query := `
		SELECT
			AL.id,
			AL.ip,
			AL.user_id,
			AL.menu_code,
			AL.audit_type,
			TO_CHAR(AL.created_at,'YYYY-MM-DD HH24::MI') as created_at,
			AL.comment,
			AL.email,
		    COALESCE(U.name,'-') as user_name,
		    COALESCE(U.dept_name,'-') as dept_name   
		FROM
			audit_log AL
			LEFT JOIN "user" U ON AL.user_id = U.id
		WHERE
			AL.created_at 
			    BETWEEN TO_TIMESTAMP(:start_date,'YYYY-MM-DD') 
			    AND TO_TIMESTAMP(:end_date,'YYYY-MM-DD') + INTERVAL'1'DAY
		ORDER BY id DESC`
	query, args, err := db.DB.BindNamed(query, request)
	err = db.DB.Select(&l, query, args...)
	if err != nil {
		log.ERROR() <- err.Error()
		return nil, err
	}

	return l, nil
}
