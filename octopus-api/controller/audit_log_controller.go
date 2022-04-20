package controller

import (
	"github.com/gin-gonic/gin"
	"octopus-api/bean"
	"octopus-api/bean/constant"
	"octopus-api/model"
)

func GetAuditLogList(c *gin.Context) {
	req := new(bean.GetAuditLogListRequest)
	res := bean.GetAuditLogListResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	auditLogList, err := model.SelectAuditLostList(req)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}

	res.LogList = auditLogList
	bean.ResponseJson(c, constant.SUCCESS, res)
}
