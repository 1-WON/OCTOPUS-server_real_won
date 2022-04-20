package bean

import "time"

type CommonPolicy struct {
    Id        int       `db:"id" json:"id"`
    Key       string    `db:"key" json:"key"`
    Value     string    `db:"value" json:"value"`
    CreatedAt time.Time `db:"created_at" json:"createdAt"`
    Type      int       `db:"type" json:"type"`
}

type GetCommonPolicyListRequest struct {
    BaseRequest
    Type int `db:"type" json:"type"`
}

type GetCommonPolicyListResponse struct {
    BaseResponse
    PolicyList []CommonPolicy `json:"policyList"`
}

func (request *GetCommonPolicyListRequest) IsValidParameter() bool {
    if request.Type == 0 {
        return false
    }
    return true
}

type PutCommonPolicyRequest struct {
    IsPasswordUse            string `json:"isPasswordUse"`
    PasswordValidPeriod      string `json:"passwordValidPeriod"`
    IsPasswordValidPeriodUse string `json:"isPasswordValidPeriodUse"`
    PasswordExpireAlarm      string `json:"passwordExpireAlarm"`
    IsPasswordExpireAlarmUse string `json:"isPasswordExpireAlarmUse"`
    IsPasswordRuleUse        string `json:"isPasswordRuleUse"`
    PasswordLen              string `json:"passwordLen"`
    PasswordSeq              string `json:"passwordSeq"`
    PasswordIdentity         string `json:"passwordIdentity"`
    IsPasswordSeqProhibition string `json:"isPasswordSeqProhibition"`
    OldPasswordUseCount      string `json:"oldPasswordUseCount"`
    IsOldPasswordProhibition string `json:"isOldPasswordProhibition"`
    PolicyType               int    `json:"policyType"`
}

func (request *PutCommonPolicyRequest) IsValidParameter() bool {
    return true
}
