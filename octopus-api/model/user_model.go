package model

import (
	"database/sql"
	"fmt"
	"octopus-api/bean"
	"octopus-api/db"
	"octopus-api/util/log"

	"github.com/jmoiron/sqlx"
)

func SelectUserFromEmail(email string) (user *bean.User, err error) {
	user = new(bean.User)
	err = db.DB.Get(user,
		`SELECT
					id,
					email,
		    		name,
       				company_name,
		    		dept_name,
       				phone,
		    		status,
		    		created_at,
       				password
				FROM
					"user" 
				WHERE
					email=$1`, email)
	if err != nil {
		log.ERROR() <- err.Error()
		return nil, err
	}

	return user, nil
}

func SelectUserList(param *bean.GetUserListRequest) ([]bean.User, error) {
	selectQuery := `SELECT
					U.id,
					U.email,
		    		U.name,
       				COALESCE(U.company_name, '') as company_name,
		    		U.dept_name,
       				COALESCE(U.phone, '') as phone,
		    		U.status,
		    		U.created_at,
       				COALESCE(ULP.login_policy_id,0) as login_policy_id,
       				COALESCE(LP.name,'') as login_policy_name
       			FROM
					"user" U
					LEFT JOIN user_login_policy ULP ON U.id = ULP.user_id
					LEFT JOIN login_policy LP ON ULP.login_policy_id = LP.id`
	whereQuery := `WHERE 1=1`
	if param.Role != 0 {
		selectQuery = fmt.Sprintf("%s INNER JOIN user_pseudo_role UPR ON U.id = UPR.user_id", selectQuery)
		whereQuery = fmt.Sprintf("%s AND UPR.pseudo_role_id = :roleId", whereQuery)
	}
	if param.UserName != "" {
		param.UserName = fmt.Sprintf("%s%s%s", "%", param.UserName, "%")
		whereQuery = fmt.Sprintf("%s AND U.name like :userName", whereQuery)
	}
	selectQuery = fmt.Sprintf("%s %s", selectQuery, whereQuery)
	query, args, _ := db.DB.BindNamed(selectQuery, param)
	var users []bean.User
	err := db.DB.Select(&users, query, args...)
	if err != nil {
		log.ERROR() <- err.Error()
		return nil, err
	}

	return users, nil
}

func SelectPseudoRolesFromUserId(userId int) ([]bean.PseudoRole, error) {
	var pseudoRoles []bean.PseudoRole
	err := db.DB.Select(&pseudoRoles,
		`SELECT 
			PR.type,
       		PR.name
		FROM
			pseudo_role PR 
			INNER JOIN user_pseudo_role UPR ON PR.id = UPR.pseudo_role_id
		WHERE
			UPR.user_id = $1`, userId)
	if err != nil && err != sql.ErrNoRows {
		log.ERROR() <- err.Error()
		return nil, err
	}

	return pseudoRoles, nil
}

func InsertUser(trx *sqlx.Tx, user *bean.User) error {
	var lastInsertId int64
	stmt, err := trx.PrepareNamed(
		`
			INSERT INTO "user"
			(
			 name,
			 email,
			 status,
			 password,
			 dept_name
			)
			VALUES 
			(
			 :name,
			 :email,
			 :status,
			 :password,
			 :dept_name
			) RETURNING id`)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	err = stmt.Get(&lastInsertId, user)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	user.Id = int(lastInsertId)
	return nil
}

func InsertPseudoRole(trx *sqlx.Tx, userId int, roleId int) error {
	_, err := trx.NamedExec(
		`
			INSERT INTO user_pseudo_role 
			(
				user_id,
			 	pseudo_role_id
			)
			values 
			(
			 	:user_id,
			 	:pseudo_role_id
			)`, map[string]interface{}{
			"user_id":        userId,
			"pseudo_role_id": roleId,
		})
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

func UpdateUser(trx *sqlx.Tx, user *bean.User) error {
	_, err := trx.NamedExec(
		`UPDATE "user" 
				SET 
					name = :name,
			 		email = :email,
			 		status = :status,
			 		dept_name = :dept_name
				WHERE
					id = :id`, user)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

func UpdatePassword(trx *sqlx.Tx, user *bean.User) error {
	_, err := trx.NamedExec(
		`UPDATE "user" 
				SET 
					password = :password
				WHERE
					id = :id`, user)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

func DeletePseudoRoleFromUserId(trx *sqlx.Tx, userId int) error {
	_, err := trx.NamedExec(
		`
			DELETE FROM user_pseudo_role
			WHERE
			      user_id = :user_id`,
		map[string]interface{}{
			"user_id": userId})
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

func DeleteUserFromId(trx *sqlx.Tx, userId int) error {
	_, err := trx.NamedExec(
		`
			DELETE FROM "user"
			WHERE
			      id = :user_id`,
		map[string]interface{}{
			"user_id": userId})
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}
