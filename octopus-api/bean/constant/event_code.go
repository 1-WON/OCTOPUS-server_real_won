package constant

type AUDIT_LOG_EVENT int

const (
	AUDIT_LOG_EVENT_LOGIN_SUCCESS AUDIT_LOG_EVENT = 1 + iota
	AUDIT_LOG_EVENT_LOGIN_FAIL
	AUDIT_LOG_EVENT_C_SUCCESS
	AUDIT_LOG_EVENT_C_FAIL
	AUDIT_LOG_EVENT_R_SUCCESS
	AUDIT_LOG_EVENT_R_FAIL
	AUDIT_LOG_EVENT_U_SUCCESS
	AUDIT_LOG_EVENT_U_FAIL
	AUDIT_LOG_EVENT_D_SUCCESS
	AUDIT_LOG_EVENT_D_FAIL
)

type SYSTEM_LOG_EVENT int
