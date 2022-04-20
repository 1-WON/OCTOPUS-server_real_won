package bean

import "octopus-api/bean/constant"

type PutPreRequest struct {
	BaseRequest
	WorkId              int64                `db:"work_id" json:"workId"`
	WorkName            string               `db:"work_name" json:"workName"`
	UseStartDate        string               `db:"use_start_date" json:"useStartDate"`
	UseEndDate          string               `db:"use_end_date" json:"useEndDate"`
	HandlerId           int                  `db:"handler_id" json:"handlerId"`
	PseudoPicId         int                  `db:"pseudo_pic_id" json:"pseudoPicId"`
	CombinePicId        int                  `db:"combine_pic_id" json:"combinePicId"`
	ReviewerIdList      []int                `db:"reviewer_id_list" json:"reviewerIdList"`
	PostManagePicId     int                  `db:"post_manage_pic_id" json:"postManagePicId"`
	TypeOfUse           int                  `db:"type_of_use" json:"typeOfUse"`
	ExternalInstitution string               `db:"external_institution" json:"externalInstitution"`
	ExternalDept        string               `db:"external_dept" json:"externalDept"`
	ExternalPosition    string               `db:"external_position" json:"externalPosition"`
	ExternalUserName    string               `db:"external_user_name" json:"externalUserName"`
	ExternalPhone       string               `db:"external_phone" json:"externalPhone"`
	ExternalEmail       string               `db:"external_email" json:"externalEmail"`
	PurposeOfUse        int                  `db:"purpose_of_use" json:"purposeOfUse"`
	PurposeOfUseDetail  string               `db:"purpose_of_use_detail" json:"purposeOfUseDetail"`
	ProcessingEnv       string               `db:"processing_env" json:"processingEnv"`
	RecipientEnv        string               `db:"recipient_env" json:"recipientEnv"`
	RecipientLevel      string               `db:"recipient_level" json:"recipientLevel"`
	IsTempSave          int                  `json:"isTempSave"`
	Status              constant.WORK_STATUS `db:"status"`
	CurrentWorker       int                  `db:"current_worker"`
}
type PutPreResponse struct {
	BaseResponse
	WorkId int64                `json:"workId"`
	Status constant.WORK_STATUS `json:"status"`
}

func (request *PutPreRequest) IsValidParameter() bool {
	return true
}

type GetWorkListRequest struct {
	BaseRequest
	CreatedStartDate    string `db:"created_start_date" json:"createdStartDate"`
	CreatedEndDate      string `db:"created_end_date" json:"createdEndDate"`
	CurrentWorkerName   string `db:"current_worker_name" json:"currentWorkerName"`
	WorkStartDate       string `db:"work_start_date" json:"workStartDate"`
	WorkEndDate         string `db:"work_end_date" json:"workEndDate"`
	WorkName            string `db:"work_name" json:"workName"`
	WorkStatus          int    `db:"work_status" json:"workStatus"`
	TypeOfUse           int    `db:"type_of_use" json:"typeOfUse"`
	PurposeOfUse        int    `db:"purpose_of_use" json:"purposeOfUse"`
	UseStartDate        string `db:"use_start_date" json:"useStartDate"`
	UseEndDate          string `db:"use_end_date" json:"useEndDate"`
	RecipientName       string `db:"recipient_name" json:"recipientName"`
	IsAdditionInfo      int    `db:"is_addition_info" json:"isAdditionInfo"`
	PostManageStartDate string `db:"post_manage_start_date" json:"postManageStartDate"`
	PostManageEndDate   string `db:"post_manage_end_date" json:"postManageEndDate"`
	PostManageResult    int    `db:"post_manage_result" json:"postManageResult"`
	HandlerId           int    `db:"handler_id" json:"handlerId"`
	RelationId          int    `db:"relation_id" json:"relationId"`
	Page                int    `db:"page" json:"page"`
	CountPerPage        int    `db:"count_per_page" json:"countPerPage"`
}
type GetWorkListResponse struct {
	BaseResponse
	TotalCount int    `json:"totalCount"`
	WorkList   []Work `json:"workList"`
}
type Work struct {
	WorkId            int    `db:"work_id" json:"workId"`
	WorkName          string `db:"work_name" json:"workName"`
	WorkStatus        int    `db:"work_status" json:"workStatus"`
	WorkStartDate     string `db:"work_start_date" json:"workStartDate"`
	WorkEndDate       string `db:"work_end_date" json:"workEndDate"`
	TypeOfUse         int    `db:"type_of_use" json:"typeOfUse"`
	PurposeOfUse      int    `db:"purpose_of_use" json:"purposeOfUse"`
	IsAdditionInfo    int    `db:"is_addition_info" json:"isAdditionInfo"`
	CurrentWorkerName string `db:"current_worker_name" json:"currentWorkerName"`
	ProductCount      int    `db:"product_count" json:"productCount"`
}

func (request *GetWorkListRequest) IsValidParameter() bool {
	if request.CreatedStartDate == "" || request.CreatedEndDate == "" {
		return false
	}
	return true
}
