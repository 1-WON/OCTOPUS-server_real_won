package model

import (
    "github.com/jmoiron/sqlx"
    "octopus-api/bean"
    "octopus-api/db"
    "octopus-api/util/log"
)

func SelectCommonPolicyList(policyType int) ([]bean.CommonPolicy, error) {
    var policyList []bean.CommonPolicy
    err := db.DB.Select(&policyList, `
						SELECT
							id,
						    key,
						    value,
						    created_at,
						    type
						FROM
							common_policy
						WHERE
							type = $1`, policyType)
    if err != nil {
        log.ERROR() <- err.Error()
        return nil, err
    }
    return policyList, nil
}

func InsertCommonPolicy(trx *sqlx.Tx, key, value string, policyType int) error {
    _, err := trx.NamedExec(
        `
			INSERT INTO common_policy 
			(
				key,
			 	value,
			    type
			)
			values 
			(
			 	:key,
			 	:value,
			    :type 
			)`, map[string]interface{}{
            "key":   key,
            "value": value,
            "type":  policyType,
        })
    if err != nil {
        log.ERROR() <- err.Error()
        return err
    }
    return nil
}

func DeleteCommonPolicyFromType(trx *sqlx.Tx, policyType int) error {
    _, err := trx.NamedExec(`
                DELETE FROM common_policy
                WHERE
                    type = :policyType`,
        map[string]interface{}{"policyType": policyType})
    if err != nil {
        log.ERROR() <- err.Error()
        return err
    }
    return nil
}
