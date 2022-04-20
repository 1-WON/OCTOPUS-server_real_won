package controller

import (
	"octopus-api/bean"
	"octopus-api/bean/constant"
	"octopus-api/db"
	"octopus-api/model"
	"octopus-api/service/event"
	"octopus-api/util"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// Login 로그인
func Login(c *gin.Context) {
	req := new(bean.LoginRequest)
	res := new(bean.LoginResponse)
	res.Code = constant.SUCCESS

	auditLog := new(bean.AuditLog)
	auditLog.Ip = c.ClientIP()

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}
	auditLog.Email = req.Email

	u, err := model.SelectUserFromEmail(req.Email)
	if u == nil {
		auditLog.AuditType = constant.AUDIT_LOG_EVENT_LOGIN_FAIL
		event.SaveAuditLog() <- auditLog
		res.Code = constant.UNAUTHORIZED
		bean.ResponseJson(c, constant.UNAUTHORIZED, res)
		return
	}
	auditLog.UserId = u.Id

	if strings.Compare(req.Password, u.Password) != 0 {
		auditLog.AuditType = constant.AUDIT_LOG_EVENT_LOGIN_FAIL
		event.SaveAuditLog() <- auditLog
		res.Code = constant.UNAUTHORIZED
		bean.ResponseJson(c, constant.UNAUTHORIZED, res)
		return
	}

	pseudoRoles, err := model.SelectPseudoRolesFromUserId(u.Id)
	if err != nil {
		auditLog.AuditType = constant.AUDIT_LOG_EVENT_LOGIN_FAIL
		event.SaveAuditLog() <- auditLog
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}
	u.Password = ""
	u.RoleList = pseudoRoles
	u.AuthToken = util.Base64Encoding(util.GenerateUUID())

	auditLog.AuditType = constant.AUDIT_LOG_EVENT_LOGIN_SUCCESS
	event.SaveAuditLog() <- auditLog

	res.User = *u
	bean.ResponseJson(c, constant.SUCCESS, res)
}

// GetUserList 사용자 검색
func GetUserList(c *gin.Context) {
	req := new(bean.GetUserListRequest)
	res := bean.GetUserListResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		c.JSON(constant.INVALID_PARAMETER, res)
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}
	users, err := model.SelectUserList(req)
	if users == nil {
		res.UserList = []bean.User{}
		bean.ResponseJson(c, constant.SUCCESS, res)
		return
	}
	for index, user := range users {
		pseudoRoles, err := model.SelectPseudoRolesFromUserId(user.Id)
		if err != nil {
			res.Code = constant.SERVER_ERROR
			bean.ResponseJson(c, constant.SERVER_ERROR, res)
			return
		}
		user.RoleList = pseudoRoles
		users[index] = user
	}
	res.UserList = users

	bean.ResponseJson(c, constant.SUCCESS, res)
}

// 추가 및 수정
func RegisterUser(c *gin.Context) {
	req := new(bean.RegisterUserRequest)
	res := bean.RegisterUserResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		c.JSON(constant.INVALID_PARAMETER, res)
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	u := new(bean.User)
	u.Name = req.Name
	u.Email = req.Email
	u.Password = req.Password
	u.Status = req.Status
	u.DeptName = req.DeptName

	trx, _ := db.DB.Beginx()
	defer trx.Rollback()
	err = model.InsertUser(trx, u)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}
	if req.LoginPolicyId != 0 {
		userLoginPolicy := new(bean.UserLoginPolicy)
		userLoginPolicy.UserId = u.Id
		userLoginPolicy.LoginPolicyId = req.LoginPolicyId
		err = model.InsertUserLoginPolicy(trx, userLoginPolicy)
		if err != nil {
			res.Code = constant.SERVER_ERROR
			bean.ResponseJson(c, constant.SERVER_ERROR, res)
			return
		}
	}

	for _, roleId := range req.RoleIdList {
		err = model.InsertPseudoRole(trx, u.Id, roleId)
		if err != nil {
			res.Code = constant.SERVER_ERROR
			bean.ResponseJson(c, constant.SERVER_ERROR, res)
			return
		}
	}

	trx.Commit()
	bean.ResponseJson(c, constant.SUCCESS, res)
}

func UpdateUser(c *gin.Context) {
	req := new(bean.UpdateUserRequest)
	res := bean.UpdateUserResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		c.JSON(constant.INVALID_PARAMETER, res)
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	u := new(bean.User)
	u.Id = req.Id
	u.Name = req.Name
	u.Email = req.Email
	u.Status = req.Status
	u.DeptName = req.DeptName
	u.Password = req.Password

	trx, _ := db.DB.Beginx()
	err = model.UpdateUser(trx, u)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}
	if u.Password != "" {
		err = model.UpdatePassword(trx, u)
		err = model.UpdateUser(trx, u)
		if err != nil {
			res.Code = constant.SERVER_ERROR
			bean.ResponseJson(c, constant.SERVER_ERROR, res)
			return
		}
	}
	err = model.DeletePseudoRoleFromUserId(trx, u.Id)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}
	for _, roleId := range req.RoleIdList {
		err = model.InsertPseudoRole(trx, u.Id, roleId)
		if err != nil {
			res.Code = constant.SERVER_ERROR
			bean.ResponseJson(c, constant.SERVER_ERROR, res)
			return
		}
	}
	err = model.DeleteUserLoginPolicyFromUserId(trx, u.Id)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}
	if req.LoginPolicyId != 0 {
		userLoginPolicy := new(bean.UserLoginPolicy)
		userLoginPolicy.UserId = u.Id
		userLoginPolicy.LoginPolicyId = req.LoginPolicyId
		err = model.InsertUserLoginPolicy(trx, userLoginPolicy)
		if err != nil {
			res.Code = constant.SERVER_ERROR
			bean.ResponseJson(c, constant.SERVER_ERROR, res)
			return
		}
	}

	trx.Commit()
	bean.ResponseJson(c, constant.SUCCESS, res)
}

// 사용자 관리 Delete controller

func DeleteUser(c *gin.Context) {
	res := bean.DeleteUserResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	userId := c.Param("userId")
	if userId == "" {
		res.Code = constant.INVALID_PARAMETER
		c.JSON(constant.INVALID_PARAMETER, res)
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}
	iUserId, _ := strconv.Atoi(userId)

	trx, _ := db.DB.Beginx()
	defer trx.Rollback()
	err := model.DeleteUserFromId(trx, iUserId)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}
	err = model.DeletePseudoRoleFromUserId(trx, iUserId)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}

	trx.Commit()
	bean.ResponseJson(c, constant.SUCCESS, res)
}
