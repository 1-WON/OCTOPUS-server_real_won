package config

import (
	"fmt"
	"os"

	"gopkg.in/ini.v1"
)

var section *ini.Section

func init() {
	serviceHome := os.Getenv("OCTOPUS_HOME")
	if serviceHome == "" {
		serviceHome = ".."
	}
	serviceMode := os.Getenv("SERVICE_MODE")
	if serviceMode == "" {
		serviceMode = "dev"
	}

	//f, err := ini.Load("C:/Users/chong/Desktop/octopus-server-developer/octopus-api/release/config/octopus.ini")
	f, err := ini.Load(serviceHome + "/config/octopus.ini")
	if err != nil {
		panic(err)
	}
	section = f.Section(serviceMode)
	keys := section.Keys()
	for _, key := range keys {
		fmt.Println(key.Name() + "=" + key.Value())
	}
}

func GetString(k string) string {
	return GetStringDefault(k, "")
}

func GetStringDefault(k, d string) string {
	return section.Key(k).MustString(d)
}

func GetInt(k string) int {
	return GetIntDefault(k, 0)
}

func GetIntDefault(k string, d int) int {
	return section.Key(k).MustInt(d)
}

func GetBool(k string) bool {
	return GetBoolDefault(k, false)
}

func GetBoolDefault(k string, d bool) bool {
	return section.Key(k).MustBool(d)
}
