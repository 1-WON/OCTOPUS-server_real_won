package bean

type PreConsult struct {
    Id             int    `db:"id" json:"id"`
    RequesterName  string `db:"requester_name" json:"requesterName"`
    RequesterEmail string `db:"requester_email" json:"requesterEmail"`
    RequesterDept  string `db:"requester_dept" json:"requesterDept"`
    CreatedAt      string `db:"created_at" json:"createdAt"`
}

type PreConsultColumn struct {
    Id              int    `db:"id" json:"id"`
    PreConsultId    int    `db:"pre_consult_id" json:"preConsultId"`
    Domain          string `db:"domain" json:"domain"`
    ColumnName      string `db:"column_name" json:"columnName"`
    StandardEngName string `db:"standard_eng_name" json:"standardEngName"`
    StandardKorName string `db:"standard_kor_name" json:"standardKorName"`
    Attribute       string `db:"attribute" json:"attribute"`
    DataType        string `db:"data_type" json:"dataType"`
    DataValueType   string `db:"data_value_type" json:"dataValueType"`
    PseudoPurpose   string `db:"pseudo_purpose" json:"pseudoPurpose"`
    PseudoLevel     string `db:"pseudo_level" json:"pseudoLevel"`
    SpecialData     string `db:"special_data" json:"specialData"`
    Sample          string `db:"sample" json:"sample"`
    Etc             string `db:"etc" json:"etc"`
}

type GetPreConsultListRequest struct {
    BaseRequest
}
type GetPreConsultListResponse struct {
    BaseResponse
    PreConsultList []PreConsult `json:"preConsultList"`
}

func (request *GetPreConsultListRequest) IsValidParameter() bool {
    return true
}

type GetPreConsultColumnListRequest struct {
    BaseRequest
    PreConsultId int `db:"pre_consult_id" json:"preConsultId"`
}
type GetPreConsultColumnListResponse struct {
    BaseResponse
    ColumnList []PreConsultColumn `json:"columnList"`
}

func (request *GetPreConsultColumnListRequest) IsValidParameter() bool {
    if request.PreConsultId == 0 {
        return false
    }
    return true
}
