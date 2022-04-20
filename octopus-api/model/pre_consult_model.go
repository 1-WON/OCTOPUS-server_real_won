package model

import (
	"github.com/jmoiron/sqlx"
	"octopus-api/bean"
	"octopus-api/db"
	"octopus-api/util/log"
)

func SelectPreConsultList() ([]bean.PreConsult, error) {
	var preConsultList []bean.PreConsult

	query := `
		SELECT
			id,
			requester_name,
			requester_email,
			requester_dept,
			to_char(created_at,'YYYY-MM-DD HH24:MI') as created_at
		FROM
			pre_consult`
	err := db.DB.Select(&preConsultList, query)
	if err != nil {
		log.ERROR() <- err.Error()
		return nil, err
	}

	return preConsultList, nil
}

func InsertPreConsult(trx *sqlx.Tx, preConsult *bean.PreConsult) error {
	var lastInsertId int64
	stmt, err := trx.PrepareNamed(
		`
			INSERT INTO "pre_consult"
			(
			 requester_name,
			 requester_email,
			 requester_dept
			)
			VALUES 
			(
			 :requester_name,
			 :requester_email,
			 :requester_dept
			) RETURNING id`)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	err = stmt.Get(&lastInsertId, preConsult)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	preConsult.Id = int(lastInsertId)
	return nil
}

func SelectPreConsultColumnList(request *bean.GetPreConsultColumnListRequest) ([]bean.PreConsultColumn, error) {
	var preConsultColumnList []bean.PreConsultColumn

	query := `
		SELECT
            id,
            pre_consult_id,
            domain,
            column_name,
            standard_eng_name,
            standard_kor_name,
            attribute,
            data_type,
            data_value_type,
            pseudo_purpose,
            pseudo_level,
            special_data,
            sample,
            etc
		FROM
			pre_consult_column
		WHERE
            pre_consult_id = $1`
	err := db.DB.Select(&preConsultColumnList, query, request.PreConsultId)
	if err != nil {
		log.ERROR() <- err.Error()
		return nil, err
	}

	return preConsultColumnList, nil
}

func InsertPreConsultColumn(trx *sqlx.Tx, preConsultColumn *bean.PreConsultColumn) error {
	_, err := trx.NamedExec(
		`
			INSERT INTO "pre_consult_column"
			(
			 	pre_consult_id,
            	domain,
            	column_name,
            	standard_eng_name,
            	standard_kor_name,
            	attribute,
            	data_type,
            	data_value_type,
            	pseudo_purpose,
            	pseudo_level,
            	special_data,
            	sample,
            	etc
			)
			VALUES 
			(
			 	:pre_consult_id,
            	:domain,
            	:column_name,
            	:standard_eng_name,
            	:standard_kor_name,
            	:attribute,
            	:data_type,
            	:data_value_type,
            	:pseudo_purpose,
            	:pseudo_level,
            	:special_data,
            	:sample,
            	:etc
			)`, preConsultColumn)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}
