package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"octopus-api/bean"
	"octopus-api/bean/constant"
	"octopus-api/db"
	"octopus-api/model"
	"octopus-api/util/log"
)

// PutPre 사전 준비 등록
func PutPre(c *gin.Context) {
	req := new(bean.PutPreRequest)
	res := bean.PutPreResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	//임시저장 여부 check
	if req.IsTempSave == 1 {
		req.Status = constant.WORK_STATUS_PRE
	} else {
		req.Status = constant.WORK_STATUS_PSEUDO_TARGET
	}

	trx, _ := db.DB.Beginx()
	defer trx.Rollback()
	if req.WorkId == 0 {
		//사전준비 insert
		err = model.InsertPre(trx, req)
		if err != nil {
			res.Code = constant.SERVER_ERROR
			bean.ResponseJson(c, constant.SERVER_ERROR, res)
			return
		}
	} else {
		//사전준비 업데이트
		affectedRows, err := model.UpdatePre(trx, req)
		if err != nil || affectedRows == 0 {
			res.Code = constant.SERVER_ERROR
			bean.ResponseJson(c, constant.SERVER_ERROR, res)
			if affectedRows == 0 {
				log.ERROR() <- fmt.Sprintf("no exist update data : %d", req.WorkId)
			}
			return
		}
	}



	//적정성 검토자 저장
	err = model.DeleteAccessFromWorkId(trx, req.WorkId)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}
	assess := new(bean.Assess)
	assess.WorkId = req.WorkId
	reviewerIdList := req.ReviewerIdList
	for _, reviewerId := range reviewerIdList {
		assess.ReviewerId = reviewerId
		err = model.InsertAccess(trx, assess)
		if err != nil {
			res.Code = constant.SERVER_ERROR
			bean.ResponseJson(c, constant.SERVER_ERROR, res)
			return
		}
	}

	res.WorkId = req.WorkId
	res.Status = req.Status

	trx.Commit()

	bean.ResponseJson(c, constant.SUCCESS, res)
}



// GetWorkList 작업검색
func GetWorkList(c *gin.Context) {
	req := new(bean.GetWorkListRequest)
	res := bean.GetWorkListResponse{BaseResponse: bean.BaseResponse{Code: constant.SUCCESS}}

	err := bean.BindJson(c, req)
	if err != nil {
		res.Code = constant.INVALID_PARAMETER
		bean.ResponseJson(c, constant.INVALID_PARAMETER, res)
		return
	}

	works, err := model.SelectWorkList(req)
	if err != nil {
		res.Code = constant.SERVER_ERROR
		bean.ResponseJson(c, constant.SERVER_ERROR, res)
		return
	}

	res.TotalCount = len(works)
	res.WorkList = works
	bean.ResponseJson(c, constant.SUCCESS, res)
}
