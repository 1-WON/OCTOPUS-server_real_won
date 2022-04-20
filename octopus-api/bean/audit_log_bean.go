package bean

import (
	"octopus-api/bean/constant"
)

type AuditLog struct {
	Id        int64                    `db:"id" json:"id"`
	Ip        string                   `db:"ip" json:"ip"`
	UserId    int                      `db:"user_id" json:"userId"`
	Email     string                   `db:"email" json:"email"`
	UserName  string                   `db:"user_name" json:"userName"`
	DeptName  string                   `db:"dept_name" json:"deptName"`
	MenuCode  constant.MENU_CODE       `db:"menu_code" json:"menuCode"`
	AuditType constant.AUDIT_LOG_EVENT `db:"audit_type" json:"auditType"`
	Comment   string                   `db:"comment" json:"comment"`
	CreatedAt string                   `db:"created_at" json:"createdAt"`
}

type GetAuditLogListRequest struct {
	BaseRequest
	StartDate string `db:"start_date" json:"startDate"`
	EndDate   string `db:"end_date" json:"endDate"`
}
type GetAuditLogListResponse struct {
	BaseResponse
	LogList []AuditLog `json:"logList"`
}

func (request *GetAuditLogListRequest) IsValidParameter() bool {
	if request.StartDate == "" || request.EndDate == "" {
		return false
	}
	return true
}
