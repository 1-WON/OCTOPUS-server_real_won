package model

import (
	"github.com/jmoiron/sqlx"
	"octopus-api/bean"
	"octopus-api/util/log"
)

func InsertAccess(trx *sqlx.Tx, assess *bean.Assess) error {
	_, err := trx.NamedExec(`
					INSERT INTO assess_review
 					(   
						work_id,
						reviewer_id,
						pre_review,
						pre_result,
						pseudo_review,
						pseudo_result
					 )
 					VALUES
 					(
						:work_id,
						:reviewer_id,
						:pre_review,
						:pre_result,
						:pseudo_review,
						:pseudo_result
					 )`, assess)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}

	return nil
}

func DeleteAccessFromWorkId(trx *sqlx.Tx, workId int64) error {
	_, err := trx.NamedExec(`
					DELETE FROM assess_review
					WHERE
					      work_id = :workId`, map[string]interface{}{"workId": workId})
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}

	return nil
}
