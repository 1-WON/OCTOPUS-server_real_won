package controller

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"octopus-api/bean"
	"octopus-api/bean/constant"
	"octopus-api/db"
	"octopus-api/model"
	"octopus-api/util/log"
)

func GetPreConsultList(c *gin.Context) {
	req := new(bean.GetPreConsultListRequest)
	res := bean.GetPreConsultListResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		c.JSON(constant.INVALID_PARAMETER, res)
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	preConsultList, err := model.SelectPreConsultList()
	if err != nil || preConsultList == nil {
		res.PreConsultList = []bean.PreConsult{}
		bean.ResponseJson(c, constant.SUCCESS, res)
		return
	}

	res.PreConsultList = preConsultList
	bean.ResponseJson(c, constant.SUCCESS, res)
}

func GetPreConsultColumnList(c *gin.Context) {
	req := new(bean.GetPreConsultColumnListRequest)
	res := bean.GetPreConsultColumnListResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		c.JSON(constant.INVALID_PARAMETER, res)
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	preConsultColumnList, err := model.SelectPreConsultColumnList(req)
	if err != nil || preConsultColumnList == nil {
		res.ColumnList = []bean.PreConsultColumn{}
		bean.ResponseJson(c, constant.SUCCESS, res)
		return
	}

	res.ColumnList = preConsultColumnList
	bean.ResponseJson(c, constant.SUCCESS, res)
}

func PutPreConsult(c *gin.Context) {
	qr := c.Query("qr")
	if qr == "" {
		log.ERROR() <- "Empty qr code !!"
		c.String(http.StatusOK, "전송 데이터가 유효하지 않습니다")
		return
	}
	fmt.Println(qr)
	decodedString, _ := base64.StdEncoding.DecodeString(qr)
	jsonString := string(decodedString)
	fmt.Println(jsonString)

	var dataMap map[string]interface{}
	err := json.Unmarshal([]byte(jsonString), &dataMap)
	if err != nil {
		log.ERROR() <- "Invalid json String !!"
		c.String(http.StatusOK, "전송 데이터가 유효하지 않습니다")
		return
	}
	preConsult := new(bean.PreConsult)
	u := dataMap["user"].(map[string]interface{})
	preConsult.RequesterName = u["name"].(string)
	preConsult.RequesterEmail = u["email"].(string)
	preConsult.RequesterDept = u["소속"].(string)

	trx, _ := db.DB.Beginx()
	defer trx.Rollback()
	err = model.InsertPreConsult(trx, preConsult)
	if err != nil {
		c.String(http.StatusOK, "사전 컨설팅 요청 접수에 실패 했습니다")
		return
	}
	o := dataMap["octopus"].(map[string]interface{})
	d := o["data"].([]interface{})
	for _, data := range d {
		preConsultColumn := new(bean.PreConsultColumn)
		preConsultColumn.PreConsultId = preConsult.Id
		preConsultColumn.ColumnName = data.(map[string]interface{})["c"].(string)
		preConsultColumn.PseudoPurpose = data.(map[string]interface{})["r"].(string)
		preConsultColumn.Sample = data.(map[string]interface{})["s"].(string)

		err = model.InsertPreConsultColumn(trx, preConsultColumn)
		if err != nil {
			c.String(http.StatusOK, "사전 컨설팅 요청 접수에 실패 했습니다")
			return
		}
	}

	trx.Commit()
	c.String(http.StatusOK, "사전 컨설팅 요청이 접수 되었습니다")
}
