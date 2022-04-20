package bean

import "time"

type LoginPolicy struct {
	Id             int       `db:"id" json:"id"`
	Name           string    `db:"name" json:"name"`
	ConcurrentUser int       `db:"concurrent_user" json:"concurrentUser"`
	SessionTimeout int       `db:"session_timeout" json:"sessionTimeout"`
	IpRange        string    `db:"ip_range" json:"ipRange"`
	IpRange2       string    `db:"ip_range_2" json:"ipRange2"`
	LoginFailCount int       `db:"login_fail_count" json:"loginFailCount"`
	CreatedAt      time.Time `db:"created_at" json:"createdAt"`
}

type UserLoginPolicy struct {
	UserId        int       `db:"user_id" json:"userId"`
	LoginPolicyId int       `db:"login_policy_id" json:"loginPolicyId"`
	CreatedAt     time.Time `db:"created_at" json:"createdAt"`
}

type GetLoginPolicyListRequest struct {
	BaseRequest
}
type GetLoginPolicyListResponse struct {
	BaseResponse
	PolicyList []LoginPolicy `json:"policyList"`
}

func (request *GetLoginPolicyListRequest) IsValidParameter() bool {
	return true
}

type PutLoginPolicyRequest struct {
	BaseRequest
	LoginPolicy
}
type PutLoginPolicyResponse struct {
	BaseResponse
}

func (request *PutLoginPolicyRequest) IsValidParameter() bool {
	return true
}

type DeleteLoginPolicyRequest struct {
	BaseRequest
	Id int `json:"id"`
}
type DeleteLoginPolicyResponse struct {
	BaseResponse
}

func (request *DeleteLoginPolicyRequest) IsValidParameter() bool {
	if request.Id == 0 {
		return false
	}
	return true
}
