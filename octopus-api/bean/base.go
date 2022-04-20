package bean

import (
	"fmt"
	"octopus-api/util/log"

	"github.com/gin-gonic/gin"
)

type IBaseRequest interface {
	IsValidParameter() bool
}

type BaseRequest struct {
}

type BaseResponse struct {
	Code    int         `db:"code" json:"code"`
	Message string      `db:"message" json:"message"`
	Data    interface{} `db:"data" json:"data,omitempty"`
}

func BindJson(c *gin.Context, req IBaseRequest) error {
	err := c.BindJSON(req)
	if err != nil {
		fmt.Println("BindJSON()" + err.Error())
		fmt.Println(fmt.Sprintf("[%s] %#v", c.FullPath(), req))
		return err
	}
	//json데이터를 받아오고나서 Binding 해주는 역할을 하는구문  주는데이터랑
	//받아야하는 데이터의 형태 등이 맞는지 확인하는 것임.
	// 결과적으로 내 insert가 안됬던 이유는 id값에 number 안붙여서 안맞은거랑, 에초에 id는 안넣었어야하는 이유가있음

	log.DEBUG() <- fmt.Sprintf("[%s] %#v", c.FullPath(), req)

	fmt.Println(fmt.Sprintf("[%s] %#v", c.FullPath(), req))

	// if !req.IsValidParameter() {
	// 	// fmt.Println("invalid parameter()")
	// 	return errors.New("invalid parameter")
	// }
	// 위에 3줄 무슨 역할을 하는지 알아내야하고 하면서 왜 안되는지도 알아야함

	return nil
}

func ResponseJson(c *gin.Context, status int, res interface{}) {
	log.DEBUG() <- fmt.Sprintf("%#v", res)
	c.JSON(status, res)
}
