export function auditTypeFormatter(auditType) {
  switch (auditType) {
    case 1:
      return "로그인(성공)"
    case 2:
      return "로그인(실패)"
    case 3:
      return "등록(성공)"
    case 4:
      return "등록(실패)"
    case 5:
      return "보기(성공)"
    case 6:
      return "보기(실패)"
    case 7:
      return "수정(성공)"
    case 8:
      return "수정(실패)"
    case 9:
      return "삭제(성공)"
    case 10:
      return "삭제(실패)"
    default:
      return "-"
  }
}