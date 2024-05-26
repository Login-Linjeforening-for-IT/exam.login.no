'use client'

import { getCourses } from "@/utils/fetch"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Edit() {
    const [courses, setCourses] = useState<CourseAsList[]>([])
    const [error, setError] = useState('')
    const [displayCourseSelector, setDisplayCourseSelector] = useState(false)

    useEffect(() => {
        (async() => {
            const newCourses = await getCourses('client')

            if (typeof newCourses === 'string') {
                setError(newCourses)
            } else {   
                setCourses(newCourses)
            }
        })()
    }, [])

    function handleReview() {
        setDisplayCourseSelector(true)
    }

    function CourseSelector() {
        return (
            <div className="w-full h-full absolute left-0 top-0 grid place-items-center bg-black bg-opacity-90" onClick={() => setDisplayCourseSelector(false)}>
                <div className="w-[35vw] h-[45vh] bg-dark rounded-xl p-8 overflow-auto">
                    <h1 className="text-2xl text-center font-semibold mb-8">Edit course</h1>
                    <div className="w-full grid">
                        {courses.map((course) => (
                            <Link
                                href={`/edit/${course.id}`}
                                key={course.id}
                                className="text-xl bg-light w-full mb-2 rounded-md p-2"
                            >
                                {course.id}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (typeof courses === 'string') {
        return <h1 className="w-full h-full grid place-items-center">{courses}</h1>
    }

    return (
        <div>
            {displayCourseSelector && <CourseSelector />}
            <button onClick={handleReview} className="text-2xl rounded-md">🔁</button>
            {error && <h1 className="w-full h-full grid place-items-center">{error}</h1>}
        </div>
    )
}