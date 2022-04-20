package controller

import (
	"github.com/gin-gonic/gin"
	"octopus-api/bean"
	"octopus-api/bean/constant"
	"octopus-api/db"
	"octopus-api/model"
)

func GetLoginPolicyList(c *gin.Context) {
	req := new(bean.GetLoginPolicyListRequest)
	res := bean.GetLoginPolicyListResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	policyList, err := model.SelectLoginPolicyList()
	if err != nil {
		res.PolicyList = []bean.LoginPolicy{}
	} else {
		res.PolicyList = policyList
	}
	bean.ResponseJson(c, constant.SUCCESS, res)
}

func PutLoginPolicy(c *gin.Context) {
	req := new(bean.PutLoginPolicyRequest)
	res := bean.BaseResponse{Code: constant.SUCCESS}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	trx, _ := db.DB.Beginx()
	defer trx.Rollback()

	if req.Id == 0 {
		err = model.InsertLoginPolicy(trx, req)
	} else {
		err = model.UpdateLoginPolicy(trx, req)
	}
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}

	trx.Commit()
	bean.ResponseJson(c, constant.SUCCESS, res)
}







func DeleteLoginPolicy(c *gin.Context) {
	req := new(bean.DeleteLoginPolicyRequest)
	res := bean.BaseResponse{Code: constant.SUCCESS}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	trx, _ := db.DB.Beginx()
	defer trx.Rollback()

	err = model.DeleteLoginPolicyFromId(trx, req.Id)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	trx.Commit()
	bean.ResponseJson(c, constant.SUCCESS, res)
}
