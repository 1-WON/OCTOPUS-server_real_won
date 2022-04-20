package db

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"octopus-api/util/config"
	"octopus-api/util/log"
	"time"
)

var DB *sqlx.DB

func init() {
	dbDriver := config.GetString("db.driver")
	dbHost := config.GetString("db.host")
	dbPort := config.GetInt("db.port")
	dbUser := config.GetString("db.user")
	dbPass := config.GetString("db.pass")
	dbName := config.GetString("db.name")

	dbConn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPass, dbName)

	var err error
	DB, err = sqlx.Open(dbDriver, dbConn)
	if err != nil {
		log.ERROR() <- err.Error()
		panic(err.Error())
	}

	go func() {
		for {
			select {
			case <-time.After(time.Second * 1):
				err = DB.Ping()
				if err != nil {
					log.ERROR() <- err.Error()
				}
			}
		}
	}()
}
