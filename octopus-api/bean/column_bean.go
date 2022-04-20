package bean

import (
	"fmt"
	"time"
)

type StdColumn struct {
	ColumnId             int       `db:"id" json:"coulmnnId"`
	ColumnName           string    `db:"name" json:"columnName"`
	Attribute            int       `db:"attribute" json:"attribute"`
	DataType             int       `db:"data_type" json:"dataType"`
	DataValueType        int       `db:"data_value_type" json:"dataValueType"`
	regulation           string    `db:"regulation" json:"regulation"`
	StandardEngName      string    `db:"standard_eng_name" json:"standardEngName"`
	StandardKorName      string    `db:"standard_kor_name" json:"standardKorName"`
	DomainId             int       `db:"domain_id" json:"domainId"`
	created_at           time.Time `db:"created_at" json:"createdAt"`
	updated_at           time.Time `db:"updated_at" json:"updateAt"`
	DomainName           string    `db:"domain_name" json:"domainName"`
	Pseudonymization     int       `db:"pseudonymization" json:"Pseudonymization"`
	Pseudo_template      string    `db:"pseudo_template" json:"Pseudo_template"`
	Singularity          int       `db:"singularity" json:"Singularity"`
	Singularity_template string    `db:"singularity_template" json:"Singularity_template"`

	//rolelist
	// StdRoleList   []string `json:"stdroleList"`
	// StdRoleIdList []int    `json:"stdroleIdList"`
}

// type stdPseudoRole struct {a
// 	stdRoleId   int    `json:"stdRoleId" db:"type"`
// 	stdRoleName string `json:"roleName" db:"name"`
// }

type GetStdColumnListRequest struct {
	// 이 구문 update할때 put 하는 컬럼 이름들을 말함 내가 update 페이지에 있는 값들
	BaseRequest
	ColumnId             int    `db:"id" json:"coulmnnId"`
	ColumnName           string `json:"columnName"`
	Attribute            int    `json:"attribute"`
	DataType             int    `json:"dataType"`
	DataValueType        int    `json:"dataValueType"`
	StandardEngName      string `json:"standardEngName"`
	StandardKorName      string `json:"standardKorName"`
	DomainId             int    `json:"domainId"`
	DomainName           string `json:"domainName"`
	Pseudonymization     int    `json:"Pseudonymization"`
	Pseudo_template      string `json:"Pseudo_template"`
	Singularity          int    `json:"Singularity"`
	Singularity_template string `json:"Singularity_template"`
}

type GetStdColumnListResponse struct {
	BaseResponse
	// page에서 호출할때 columnList로 호출하게되면 = coulmnlist[] 호출할때 불러올수있는 이름을 알수있게된다.
	ColumnList []StdColumn `json:"columnList"`
}

func (request *GetStdColumnListRequest) IsValidParameter() bool {
	fmt.Println("여기인가요.")
	return true
}

type RegisterStdColumnRequest struct {
	BaseRequest
	StdColumn
}
type RegisterStdColumnResponse struct {
	BaseResponse
}

func (request *RegisterStdColumnRequest) IsValidParameter() bool {
	// if request.ColumnName == "" || request.StandardEngName == "" || request.StandardKorName == "" {
	// 	return false
	// }

	// if len(request.StdRoleList) == 0 {
	// 	return false
	// }
	return true
}

// Update 구문

type UpdateStdColumnRequest struct {
	BaseRequest
	StdColumn
	// ColumnId        int    `db:"id" json:"coulmnnId"`
	// ColumnName      string `json:"columnName"`
	// Attribute       int    `json:"attribute"`
	// DataType        int    `json:"dataType"`
	// DataValueType   int    `json:"dataValueType"`
	// StandardEngName string `json:"standardEngName"`
	// StandardKorName string `json:"standardKorName"`
	// DomainId        int    `json:"domainId"`
}
type UpdateStdColumnResponse struct {
	BaseResponse
}

func (request *UpdateStdColumnRequest) IsValidParameter() bool {
	if request.ColumnName == "" || request.StandardEngName == "" || request.StandardKorName == "" {
		return false
	}
	// if len(request.StdRoleIdList) == 0 {
	// 	return false
	// }
	return true
}

// Delete 구분
type DeleteStdColumnRequest struct {
	BaseRequest
	ColumnId int `db:"coulmnn_Id" json:"coulmnnId"`
}
type DeleteStdColumnResponse struct {
	BaseResponse
}

func (request *DeleteStdColumnRequest) IsValidParameter() bool {
	if request.ColumnId == 0 {
		return false
	}
	return true
}
