package model

import (
	"fmt"
	"octopus-api/bean"
	"octopus-api/db"
	"octopus-api/util/log"

	"github.com/jmoiron/sqlx"
)

func SelectStdColumnList(request *bean.GetStdColumnListRequest) ([]bean.StdColumn, error) {
	var columnList []bean.StdColumn
	query := `
		SELECT
 			sc.id,
 			sc.name,
 			sc.attribute,
 			sc.data_type,			
 			sc.data_value_type,
		    sc.standard_eng_name,
		    sc.standard_kor_name,   
 			sc.domain_id,
			sc.domain_name,
			sc.pseudonymization,
			sc.pseudo_template,
			sc.singularity,
			sc.singularity_template
		FROM
			standard_column sc`

	if request.ColumnName != "" {
		query = fmt.Sprintf("%s %s", query, "WHERE sc.name = :column_name")
	}
	query, args, _ := db.DB.BindNamed(query, request)
	err := db.DB.Select(&columnList, query, args...)
	if err != nil {
		log.ERROR() <- err.Error()
		return nil, err
	}
	return columnList, nil
}

func InsertStdcolumn(trx *sqlx.Tx, standard_column *bean.StdColumn) error {
	var lastInsertId int64
	stmt, err := trx.PrepareNamed(
		`
			INSERT INTO "standard_column"
			(	 
				name,
				attribute,
				data_type, 
				data_value_type, 
				domain_id, 
				standard_eng_name, 
				standard_kor_name,
				domain_name,
				pseudonymization,
				pseudo_template,
				singularity,
				singularity_template
			)
			VALUES 
			( 
				:name,
				:attribute,
				:data_type, 
				:data_value_type, 
				:domain_id, 
				:standard_eng_name, 
				:standard_kor_name,
				:domain_name,
				:pseudonymization,
				:pseudo_template,
				:singularity,
				:singularity_template
			)RETURNING id`)
	if err != nil {
		log.ERROR() <- err.Error()

		return err
	}
	err = stmt.Get(&lastInsertId, standard_column)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	standard_column.ColumnId = int(lastInsertId)
	fmt.Println("InsertStdcolumn.instrt 실행")
	return nil
}

func DeleteStdcolumnFromId(trx *sqlx.Tx, coulmnnId int) error {
	_, err := trx.NamedExec(
		`
			DELETE FROM "standard_column"
			WHERE
			id = :coulmnn_Id`,
		map[string]interface{}{
			"coulmnn_Id": coulmnnId})
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	return nil
}

//  pustdcolum / updateStdcolum 같은 구문인데     *bean.UpdateStdColumnRequest   <- 위 Request에서 값들을 받아서 넣어야 설공함 / Stdcolum으로 호출해서 불러오면 update가 안되는것을 확인
//  호출하는 request와 sql문 데이터 이름  확인했어야함.
func UpdateStdcolumn(trx *sqlx.Tx, standard_column *bean.UpdateStdColumnRequest) error {
	_, err := trx.NamedExec(
		`UPDATE "standard_column"
		SET
		name = :name,
		attribute = :attribute,
		data_type = :data_type,
		data_value_type = :data_value_type,
		domain_id = :domain_id,
		standard_eng_name = :standard_eng_name,
		standard_kor_name = :standard_kor_name,
		pseudonymization  = :pseudonymization,
		pseudo_template   = :pseudo_template,
		singularity       = :singularity,
		singularity_template = :singularity_template
		WHERE
			id = :id`, standard_column)
	if err != nil {
		log.ERROR() <- err.Error()
		fmt.Println("sql update 실패 ")
		fmt.Println(err.Error())
		return err
	}
	fmt.Println("model.updateStdclimn 정상수행 ")
	return nil

}

func PutStdcolum(trx *sqlx.Tx, standard_column *bean.UpdateStdColumnRequest) error {
	_, err := trx.NamedExec(
		`UPDATE "standard_column" 
		SET 			
		name = :name,
		attribute = :attribute,
		data_type = :data_type,
		data_value_type = :data_value_type,
		domain_id = :domain_id,
		standard_eng_name = :standard_eng_name,
		standard_kor_name = :standard_kor_name,
		domain_name = :domain_name,
		pseudonymization = :pseudonymization,
		pseudo_template  = :pseudo_template,
		singularity      = :singularity,
		singularity_template = :singularity_template
		WHERE
			id = :id`, standard_column)
	if err != nil {
		log.ERROR() <- err.Error()

		fmt.Println(err.Error())
		return err
	}
	fmt.Println("모델.업데이트 성공")
	return nil
}

func Insertstd(trx *sqlx.Tx, standard_column *bean.UpdateStdColumnRequest) error {
	_, err := trx.NamedExec(
		`
		INSERT INTO standard_column
		(
			name,
			attribute,
			data_type,
			data_value_type,
			domain_id,
			standard_eng_name,
			standard_kor_name,
			domain_name,
			pseudonymization,
			pseudo_template,
			singularity,
			singularity_template
		)
		VALUES
		(
			:name,
			:attribute,
			:data_type,
			:data_value_type,
			:domain_id,
			:standard_eng_name,
			:standard_kor_name,
			:domain_name,
			:pseudonymization,
			:pseudo_template,
			:singularity,
			:singularity_template
			)`, standard_column)
	if err != nil {
		log.ERROR() <- err.Error()
		return err
	}
	fmt.Println("Insertstd.instrt 실행")
	return nil
}
