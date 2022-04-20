package controller

import (
    "github.com/gin-gonic/gin"
    "octopus-api/bean"
    "octopus-api/bean/constant"
    "octopus-api/db"
    "octopus-api/model"
    "reflect"
    "strings"
)

func GetCommonPolicyList(c *gin.Context) {
    req := new(bean.GetCommonPolicyListRequest)
    res := bean.GetCommonPolicyListResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

    err := bean.BindJson(c, req)
    if err != nil {
        res.Code = constant.INVALID_PARAMETER
        bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
        return
    }

    policyList, err := model.SelectCommonPolicyList(req.Type)
    if err != nil {
        res.PolicyList = []bean.CommonPolicy{}
    } else {
        res.PolicyList = policyList
    }
    bean.ResponseJson(c, constant.SUCCESS, res)
}

func PutCommonPolicy(c *gin.Context) {
    req := new(bean.PutCommonPolicyRequest)
    res := bean.BaseResponse{Code: constant.SUCCESS}

    err := bean.BindJson(c, req)
    if err != nil {
        res.Code = constant.INVALID_PARAMETER
        bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
        return
    }

    trx, _ := db.DB.Beginx()
    defer trx.Rollback()

    err = model.DeleteCommonPolicyFromType(trx, req.PolicyType)
    if err != nil {
        res.Code = constant.SERVER_ERROR
        bean.ResponseJson(c, constant.SERVER_ERROR, res)
        return
    }
    e := reflect.ValueOf(req).Elem()
    fieldNum := e.NumField()
    for i := 0; i < fieldNum; i++ {
        key := e.Type().Field(i).Tag.Get("json")
        if strings.Compare(key, "policyType") == 0 {
            continue
        }
        value := e.Field(i)
        err = model.InsertCommonPolicy(trx, key, value.String(), req.PolicyType)
        if err != nil {
            res.Code = constant.SERVER_ERROR
            bean.ResponseJson(c, constant.SERVER_ERROR, res)
            return
        }
    }

    trx.Commit()
    bean.ResponseJson(c, constant.SUCCESS, res)
}
