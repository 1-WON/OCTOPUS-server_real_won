package bean

type SendPseudoFileInfoRequest struct {
	BaseRequest
	Email       []string `json:"email"`
	ZipPassword string   `json:"zipPassword"`
	FileName    string   `json:"fileName"`
	FileHash    string   `json:"fileHash"`
}
