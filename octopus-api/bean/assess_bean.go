package bean

import "time"

type Assess struct {
	Id           int64     `db:"id"`
	WorkId       int64     `db:"work_id"`
	ReviewerId   int       `db:"reviewer_id"`
	PreReview    string    `db:"pre_review"`
	PreResult    int       `db:"pre_result"`
	PseudoReview string    `db:"pseudo_review"`
	PseudoResult int       `db:"pseudo_result"`
	CreatedAt    time.Time `db:"created_at"`
	UpdatedAt    time.Time `db:"updated_at"`
}
