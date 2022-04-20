package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"octopus-api/bean"
	"octopus-api/bean/constant"
	"strings"
)

const TOKEN_TYPE = "Bearer"

func TokenAuthorized(c *gin.Context) {
	response := new(bean.BaseResponse)
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		response.Code = constant.UNAUTHORIZED
		c.AbortWithStatusJSON(http.StatusOK, response)
		return
	}

	authKeys := strings.Split(authHeader, " ")
	if strings.Compare(authKeys[0], TOKEN_TYPE) != 0 {
		response.Code = constant.UNAUTHORIZED
		c.AbortWithStatusJSON(http.StatusOK, response)
		return
	}
	if authKeys[1] == "" {
		response.Code = constant.UNAUTHORIZED
		c.AbortWithStatusJSON(http.StatusOK, response)
		return
	}

	c.Next()
}
