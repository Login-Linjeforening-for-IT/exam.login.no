type CourseProps = {
    course: Course
    margin: boolean
}

type Course = {
    id: string
    flashcards: FlashCard[]
    unreviewed: FlashCardUnreviewed[]
}

type FlashCard = {
    question: string
    alternatives: string[]
    correct: number
}

type FlashCardUnreviewed = {
    question: string
    alternatives: string[] | undefined
    correct: number | undefined
}

type FlashCardAsText = {
    input: string
}

type User = {
    id: number
    name: string
}

type UserPage = {
    id: number
    username: string
    password: string
    position: number
    name: string
    score: number
    time: number
    solved: UserSolved[]
}

type UserSolved = {
    id: string
    flashcards: number[]
}

type RegisterUser = {
    username: string
    password: string
    firstName: string
    lastName: string
}

type LoginUser = {
    username: string
    password: string
}

type LoginResponse = {
    id: number
    name: string
    token: string
}