package model

import (
	"octopus-api/bean"
	"octopus-api/db"
	"octopus-api/util/log"

	"github.com/jmoiron/sqlx"
)

func SelectLoginPolicyList() ([]bean.LoginPolicy, error) {
	var policyList []bean.LoginPolicy
	err := db.DB.Select(&policyList, `
						SELECT
							id,
						    name,
						    concurrent_user,
						    session_timeout,
						    ip_range,
						    ip_range_2,
						    login_fail_count,
						    created_at   
						FROM
							login_policy`)
	if err != nil {
		log.ERROR() <- err.Error()
		return nil, err
	}
	return policyList, nil
}

func InsertLoginPolicy(trx *sqlx.Tx, loginPolicy *bean.PutLoginPolicyRequest) error {
	_, err := trx.NamedExec(
		`
			INSERT INTO login_policy 
			(
				name,
				concurrent_user,
				session_timeout,
				ip_range,
				ip_range_2,
				login_fail_count
			)
			values 
			(
			 	:name,
				:concurrent_user,
				:session_timeout,
				:ip_range,
				:ip_range_2,
				:login_fail_count
			)`, loginPolicy)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

func InsertUserLoginPolicy(trx *sqlx.Tx, userLoginPolicy *bean.UserLoginPolicy) error {
	_, err := trx.NamedExec(
		`
			INSERT INTO user_login_policy 
			(
				user_id,
				login_policy_id
			)
			values 
			(
			 	:user_id,
				:login_policy_id				
			)`, userLoginPolicy)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

func UpdateLoginPolicy(trx *sqlx.Tx, loginPolicy *bean.PutLoginPolicyRequest) error {
	_, err := trx.NamedExec(
		`
			UPDATE login_policy
			SET    
				name = :name,
				concurrent_user = :concurrent_user,
				session_timeout = :session_timeout,
				ip_range = :ip_range,
				ip_range_2 = :ip_range_2,
				login_fail_count = :login_fail_count
			WHERE 
				id = :id`, loginPolicy)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

func DeleteLoginPolicyFromId(trx *sqlx.Tx, policyId int) error {
	_, err := trx.Exec(`
                DELETE FROM login_policy
                WHERE
                    id = $1`, policyId)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

func DeleteUserLoginPolicyFromUserId(trx *sqlx.Tx, userId int) error {
	_, err := trx.Exec(`
                DELETE FROM user_login_policy
                WHERE
                    user_id = $1`, userId)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}
