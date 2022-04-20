package constant

type WORK_STATUS int

const WORK_STATUS_PRE WORK_STATUS = 10 //사전준비

const WORK_STATUS_PSEUDO WORK_STATUS = 20        //가명처리
const WORK_STATUS_PSEUDO_TARGET WORK_STATUS = 21 //대상선정
const WORK_STATUS_PSEUDO_RISK WORK_STATUS = 22   //위험성 검토
const WORK_STATUS_PSEUDO_LEVEL WORK_STATUS = 23  //가명처리 수준 정의
const WORK_STATUS_PSEUDO_EXEC WORK_STATUS = 24   //가명처리

const WORK_STATUS_ASSESS WORK_STATUS = 30 //적정성 검토

const WORK_STATUS_POST_MGMT WORK_STATUS = 40 //사후관리

const WORK_STATUS_COMPLETE WORK_STATUS = 100 //완료
