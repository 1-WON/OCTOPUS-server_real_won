package model

import (
	"octopus-api/bean"
	"octopus-api/bean/constant"
	"octopus-api/db"
	"octopus-api/util/log"

	"github.com/jmoiron/sqlx"
)

func InsertPre(trx *sqlx.Tx, request *bean.PutPreRequest) error {
	var lastInsertId int64
	stmt, err := trx.PrepareNamed(`
					INSERT INTO work
 					(   
						name,
						handler_id,
						pseudo_pic_id,
						combine_pic_id,
						post_manage_pic_id,
						type_of_use,
						purpose_of_use,
						purpose_of_use_detail,
						processing_env,
						recipient_env,
						recipient_level,
						status,
						use_start_date,
						use_end_date,
						current_worker,
						external_institution,
						external_dept,
						external_position,
						external_user_name,
						external_phone,
						external_email
					 )
 					VALUES
 					(
						:work_name,
						:handler_id,
						:pseudo_pic_id,
						:combine_pic_id,
						:post_manage_pic_id,
						:type_of_use,
						:purpose_of_use,
						:purpose_of_use_detail,
						:processing_env,
						:recipient_env,
						:recipient_level,
						:status,
						:use_start_date,
						:use_end_date,
						:current_worker,
						:external_institution,
						:external_dept,
						:external_position,
						:external_user_name,
						:external_phone,
						:external_email
					 ) RETURNING id`)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	err = stmt.Get(&lastInsertId, request)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	request.WorkId = lastInsertId

	return nil
}

func UpdatePre(trx *sqlx.Tx, request *bean.PutPreRequest) (int64, error) {
	var affectedRows int64 = 0
	r, err := trx.NamedExec(`
			UPDATE work
			SET
				name = :work_name,                  
				handler_id = :handler_id,           
				pseudo_pic_id = :pseudo_pic_id,
				combine_pic_id = :combine_pic_id,
				post_manage_pic_id = :post_manage_pic_id,
				type_of_use = :type_of_use,
				purpose_of_use = :purpose_of_use,
				purpose_of_use_detail = :purpose_of_use_detail,
				processing_env = :processing_env,
				recipient_env = :recipient_env,
				recipient_level = :recipient_level,
				status = :status,
				use_start_date = :use_start_date,
				use_end_date = :use_end_date,
				current_worker = :current_worker,
				external_institution = :external_institution,
				external_dept = :external_dept,
				external_position = :external_position,
				external_user_name = :external_user_name,
				external_phone = :external_phone,
				external_email = :external_email
			WHERE
				id = :work_id`, request)
	if err != nil {
		log.ERROR() <- err.Error()
		return affectedRows, err
	}
	affectedRows, _ = r.RowsAffected()
	return affectedRows, nil
}

func UpdateWorkStatus(trx *sqlx.Tx, workId int64, status constant.WORK_STATUS) {

}

func SelectWorkList(request *bean.GetWorkListRequest) ([]bean.Work, error) {
	var workList []bean.Work
	query := `
		SELECT
 			w.id as work_id,
 			w.name as work_name,
 			w.status as work_status,
 			w.use_start_date as work_start_date,
 			w.use_end_date as work_end_date,
 			w.type_of_use,
 			w.purpose_of_use,
 			u.name as current_worker_name,
 			1 as is_addition_info,
 			1 as product_count
		FROM
			"work" w 
			INNER JOIN "user" u ON w.current_worker = u.id
		WHERE
			w.created_at 
				BETWEEN TO_TIMESTAMP(:created_start_date,'YYYY-MM-DD') 
				AND TO_TIMESTAMP(:created_end_date,'YYYY-MM-DD') + INTERVAL'1'DAY`

	query, args, _ := db.DB.BindNamed(query, request)
	err := db.DB.Select(&workList, query, args...)
	if err != nil {
		log.ERROR() <- err.Error()
		return nil, err
	}
	return workList, nil
}
