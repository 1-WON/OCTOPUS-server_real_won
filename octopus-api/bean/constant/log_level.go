package constant

type LOG_LEVEL int

const (
	LOG_LEVEL_ERROR LOG_LEVEL = 1 + iota
	LOG_LEVEL_INFO
	LOG_LEVEL_DEBUG
)
