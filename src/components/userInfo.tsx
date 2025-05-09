'use client'

import { getCourse } from "@/utils/fetch"
import getItem from "@utils/localStorage"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function UserInfo() {
    const [user, setUser] = useState<User>({ 
        name: 'Loading...', 
        username: "Loading...", 
        time: 0
    } as User)
    const [edit, setEdit] = useState('')
    const path = usePathname()
    const timeAsHumanReadable = user.time !== 0 
        ? `${Math.floor(user.time / 60000)}min ${Math.floor(user.time / 1000 % 60)}s` 
        : ''

    const [left, setLeft] = useState('')
    const [middle, setMiddle] = useState('')
    const [right, setRight] = useState('')

    useEffect(() => {
        const newUser: User | undefined = getItem('user') as User | undefined
        const pathnames = path.split('/')
        let course = pathnames[1] === 'course' || 'edit' ? pathnames[2] : path.split('/')[-1]
        
        if (newUser && newUser != user) {
            setUser(newUser)
            setLeft(newUser.username)
        }

        if (path.includes('edit') && (middle !== edit || !middle.length)) {
            setEdit(`Editing ${path.split('/')[2]}`)
            setMiddle(`Editing ${path.split('/')[2]}`);

            (async() => {
                const courseByID = await getCourse(course, 'client')
                if (typeof courseByID === 'object') {
                    setRight(`${courseByID.cards.length} cards`)
                }
            })()
        } else if (!path.includes('edit') && ((
            left != user.username 
            || user.username === 'Loading...')
            || middle != course
            || right != timeAsHumanReadable
        )) {            
            if (course) {
                setMiddle(course.toUpperCase())
            } else {
                setMiddle('exam.login.no')
            }
            
            setRight(timeAsHumanReadable)
        }
    }, [edit, left, middle, right, timeAsHumanReadable, path])

    return (
        <div className='grid grid-cols-1 sm:grid-cols-3 w-full rounded-xl items-center'>
            <h1 className='hidden md:grid place-items-center text-xl text-almostbright'>{left}</h1>
            <h1 className='hidden sm:grid absolute left-1/2 transform -translate-x-1/2 items-center h-[4vh]'>{middle}</h1>
            {/* ghost div since middle is absolute to act as the middle grid column */}
            <div/>
            <h1 className='hidden lg:grid place-items-center text-xl text-almostbright'>{right}</h1>
        </div>
    )
}
