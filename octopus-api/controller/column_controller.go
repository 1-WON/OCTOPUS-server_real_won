package controller

import (
	"fmt"
	"octopus-api/bean"
	"octopus-api/bean/constant"
	"octopus-api/db"
	"octopus-api/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

// select 구분
func GetStdColumnList(c *gin.Context) {
	req := new(bean.GetStdColumnListRequest)
	res := bean.GetStdColumnListResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	columnList, err := model.SelectStdColumnList(req)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}

	res.ColumnList = columnList

	bean.ResponseJson(c, constant.SUCCESS, res)
}

func DeleteStdColumnPolicy(c *gin.Context) {
	req := new(bean.DeleteLoginPolicyRequest)
	res := bean.BaseResponse{Code: constant.SUCCESS}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}
}

// 표준컬럼정의 delete controller

func Deletestdcolumn(c *gin.Context) {
	res := bean.DeleteStdColumnResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	coulmnnId := c.Param("coulmnnId")
	// userId := c.Param("userId")
	if coulmnnId == "" {
		res.Code = constant.INVALID_PARAMETER
		c.JSON(constant.INVALID_PARAMETER, res)
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}
	stdcoulmnnId, _ := strconv.Atoi(coulmnnId)
	// iUserId, _ := strconv.Atoi(userId)

	trx, _ := db.DB.Beginx()
	defer trx.Rollback()
	err := model.DeleteStdcolumnFromId(trx, stdcoulmnnId)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}
	trx.Commit()

	bean.ResponseJson(c, constant.SUCCESS, res)
}

//추가 및 수정

func RegisterStdcolumn(c *gin.Context) {
	req := new(bean.RegisterStdColumnRequest)
	res := bean.RegisterStdColumnResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}
	//못찾았던 부분이 아래 bean.BindJson이쪽이다 여기서 발생한 에러
	//INVALID_PARAMETER 값 위에 마우스 커서 올리면 400번에러인것을 확인할수있는데  앞으로 이렇게 찾아갈수있도록 한다
	// BindJson 타고들어가면 추가 설명 적혀있음
	err := bean.BindJson(c, req)
	if err != nil {
		fmt.Println(err.Error())
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}
	// 위 BindJson을 제외하고 아래부분은 정상적으로 동작했음 ( ID 빠진거랑 / domainame 추가하는것만 하면댐 )
	u := new(bean.StdColumn)
	u.ColumnId = req.ColumnId
	u.ColumnName = req.ColumnName
	u.Attribute = req.Attribute
	u.DataType = req.DataType
	u.DataValueType = req.DataValueType
	u.StandardEngName = req.StandardEngName
	u.StandardKorName = req.StandardKorName
	u.DomainId = req.DomainId
	u.DomainName = req.DomainName
	u.Pseudonymization = req.Pseudonymization
	u.Pseudo_template = req.Pseudo_template
	u.Singularity = req.Singularity
	u.Singularity_template = req.Singularity_template
	// 여기부터 다시

	trx, _ := db.DB.Beginx()
	defer trx.Rollback()
	err = model.InsertStdcolumn(trx, u)
	fmt.Println(u.ColumnId)
	if err != nil {
		fmt.Println(err.Error())
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}

	trx.Commit()
	bean.ResponseJson(c, constant.SUCCESS, res)
}

func UpdateStdcolumn(c *gin.Context) {
	req := new(bean.UpdateStdColumnRequest)
	res := bean.UpdateStdColumnResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}
	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		c.JSON(constant.INVALID_PARAMETER, res)
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
		fmt.Println("바인딩 성공")
	}
	u := new(bean.StdColumn)
	//id값 대조 하지말자,, <id값이 pk가 될수가 없음
	// u.ColumnId = req.ColumnId
	u.ColumnName = req.ColumnName
	u.Attribute = req.Attribute
	u.DataType = req.DataType
	u.DataValueType = req.DataValueType
	u.StandardEngName = req.StandardEngName
	u.StandardKorName = req.StandardKorName
	u.DomainId = req.DomainId

	trx, _ := db.DB.Beginx()
	err = model.UpdateStdcolumn(trx, req)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		fmt.Println("controller.update 실행은 햇으나 실패")
		return

	}

	fmt.Println("controll update성공 ")
	trx.Commit()
	bean.ResponseJson(c, constant.SUCCESS, res)
}

func PutStdcolum(c *gin.Context) {
	req := new(bean.UpdateStdColumnRequest)
	res := bean.UpdateStdColumnResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	trx, _ := db.DB.Beginx()
	defer trx.Rollback()

	if req.ColumnId == 0 {
		err = model.Insertstd(trx, req)

		fmt.Println(" 컨트롤.insert 실행")
	} else {
		err = model.PutStdcolum(trx, req)

		fmt.Println(" 컨트롤.update실행")
	}
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		fmt.Println(err.Error())
		fmt.Println("서버 500번 에러..")
		return
	}

	trx.Commit()
	bean.ResponseJson(c, constant.SUCCESS, res)
}
