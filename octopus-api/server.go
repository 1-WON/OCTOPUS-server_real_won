package main

import (
	"fmt"
	"octopus-api/controller"
	"octopus-api/service/middleware"
	"octopus-api/util/config"
	"octopus-api/util/log"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	serviceHome := os.Getenv("OCTOPUS_HOME")
	if serviceHome == "" {
		serviceHome = "../"

	}

	g := gin.New()
	g.Use(gin.Logger())

	//CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowCredentials = true
	corsConfig.AllowHeaders = []string{"Authorization", "Content-Type", "Origin"}
	g.Use(cors.New(corsConfig))

	//html
	g.LoadHTMLGlob(filepath.Join(serviceHome, "public/*.html"))
	g.LoadHTMLGlob(filepath.Join(serviceHome, "public/index.html"))
	g.Static("/static", filepath.Join(serviceHome, "public/static"))
	g.Static("/assets", filepath.Join(serviceHome, "public/assets"))
	g.GET("/", controller.Index)

	// 로그인
	g.POST("/v1/login", controller.Login)

	octopus := g.Group("/v1")
	octopus.Use(middleware.TokenAuthorized)
	{

		//여기서 어느 테이블에서 post( 데이터를 받아오기 ) 하고있는지를 알수있는곳이다

		octopus.POST("/user", controller.RegisterUser)
		octopus.PUT("/user", controller.UpdateUser)
		octopus.DELETE("/user/:userId", controller.DeleteUser)
		octopus.POST("/user/list", controller.GetUserList)

		octopus.POST("/pre", controller.PutPre)
		octopus.POST("/work/list", controller.GetWorkList)

		//앞으로 설계해야할 URI리스트

		// 가명처리 작업
		// octopus.POST("/v1/pseudo", controller.)
		// octopus.POST("/v1/pseudo", controller.)
		// octopus.POST("/v1/pseudo", controller.)

		//대상신청 작업
		// octopus.POST("/v1/cbkey", controller.)
		// octopus.POST("/v1/cbkey", controller.)
		// octopus.POST("/v1/cbkey", controller.)

		// octopus.POST("/cbkey/list", controller.)
		// octopus.POST("/cbkey/list", controller.)
		// octopus.POST("/cbkey_consult/", controller.GetCbkeyConsultList)
		// octopus.POST("/cbkey_consult/list", controller.GetCbkeyConsultList)

		//가명정보생성 탬플

		octopus.POST("/std/column", controller.RegisterStdcolumn)
		octopus.PUT("/std/column", controller.PutStdcolum)
		octopus.DELETE("/std/column/:coulmnnId", controller.Deletestdcolumn)
		octopus.POST("/std/column/list", controller.GetStdColumnList)

		octopus.POST("/pre_consult/list", controller.GetPreConsultList)
		octopus.POST("/pre_consult/column/list", controller.GetPreConsultColumnList)

		octopus.POST("/auditlog/list", controller.GetAuditLogList)

		octopus.POST("/common_policy/list", controller.GetCommonPolicyList)
		octopus.POST("/common_policy", controller.PutCommonPolicy)

		octopus.POST("/login_policy/list", controller.GetLoginPolicyList)
		octopus.POST("/login_policy", controller.PutLoginPolicy)
		octopus.DELETE("/login_policy", controller.DeleteLoginPolicy)

	}

	// 사전 컨설팅 qr 데이터
	g.GET("/pre_consult", controller.PutPreConsult)
	// 가명 파일 정보 전송(압축패스워드,무결성 정보)
	g.GET("/pseudo/file", controller.SendPseudoFileInfo)

	port := fmt.Sprintf("%s%s", ":", config.GetString("server.port"))

	log.INFO() <- "Start octopus server!!"
	err := g.Run(port)
	if err != nil {
		fmt.Println(err.Error())
	}
}
