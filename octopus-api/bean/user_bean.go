package bean

import "time"

//이걸 담아서 뿌려주는건맞는데ㅐ
type User struct {
	Id              int          `db:"id" json:"userId"`
	Email           string       `db:"email" json:"email"`
	Name            string       `db:"name" json:"userName"`
	CompanyName     string       `db:"company_name" json:"companyName"`
	Password        string       `db:"password" json:"password"`
	DeptName        string       `db:"dept_name" json:"deptName"`
	Phone           string       `db:"phone" json:"phone"`
	Status          int          `db:"status" json:"status"`
	AuthToken       string       `json:"authToken"`
	RoleList        []PseudoRole `json:"roleList"`
	RoleIdList      []int        `json:"roleIdList"`
	LoginPolicyId   int          `db:"login_policy_id" json:"loginPolicyId"`
	LoginPolicyName string       `db:"login_policy_name" json:"loginPolicyName"`
	CreatedAt       time.Time    `db:"created_at" json:"createdAt"`
}
type PseudoRole struct {
	RoleId   int    `json:"roleId" db:"type"`
	RoleName string `json:"roleName" db:"name"`
}

type LoginRequest struct {
	BaseRequest
	Email    string `json:"email"`
	Password string `json:"password"`
}
type LoginResponse struct {
	BaseResponse
	User
}

func (request *LoginRequest) IsValidParameter() bool {
	if request.Email == "" || request.Password == "" {
		return false
	}
	return true
}

type GetUserListRequest struct {
	BaseRequest
	CompanyName string `json:"companyName"`
	DeptName    string `json:"deptName"`
	UserName    string `db:"userName" json:"userName"`
	Phone       string `json:"phone"`
	Email       string `json:"email"`
	Role        int    `db:"roleId" json:"role"`
}
type GetUserListResponse struct {
	BaseResponse
	UserList []User `json:"userList"`
}

func (request *GetUserListRequest) IsValidParameter() bool {
	return true
}

type RegisterUserRequest struct {
	BaseRequest
	User
}
type RegisterUserResponse struct {
	BaseResponse
}

func (request *RegisterUserRequest) IsValidParameter() bool {
	if request.Email == "" || request.Name == "" || request.DeptName == "" || request.Password == "" {
		return false
	}
	if len(request.RoleIdList) == 0 {
		return false
	}
	return true
}

type DeleteUserRequest struct {
	BaseRequest
	UserId int `db:"user_id" json:"userId"`
}
type DeleteUserResponse struct {
	BaseResponse
}

func (request *DeleteUserRequest) IsValidParameter() bool {
	if request.UserId == 0 {
		return false
	}
	return true
}

type UpdateUserRequest struct {
	BaseRequest
	User
}
type UpdateUserResponse struct {
	BaseResponse
}

func (request *UpdateUserRequest) IsValidParameter() bool {
	if request.Email == "" || request.Name == "" || request.DeptName == "" {
		return false
	}
	if len(request.RoleIdList) == 0 {
		return false
	}
	return true
}
