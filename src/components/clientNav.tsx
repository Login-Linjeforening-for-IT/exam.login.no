'use client'

import { sendLogout } from "@utils/user"
import isLoggedIn from "@utils/user"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// Displays the login icon or the profile icon depending on the login status
export function RightIcon() {
    const [size, setSize] = useState(40)
    const [href, setHref] = useState('/login')
    const [icon, setIcon] = useState("/images/login.svg")
    const loggedIn = isLoggedIn()

    useEffect(() => {
        if (loggedIn) {
            setSize(35)
            setHref(`/profile/${loggedIn}`)
            setIcon("/images/profile.svg")
        } else {
            setSize(40)
            setHref('/login')
            setIcon("/images/login.svg")
        }
    }, [loggedIn])

    return (
        <Link href={href} className='grid place-items-center'>
            <Image src={icon} alt="logo" height={size} width={size} />
        </Link>
    )
}

// Displays the register icon or the logout icon depending on the login status
export function MiddleIcon() {
    const [size, setSize] = useState(45)
    const [href, setHref] = useState('/register')
    const [icon, setIcon] = useState("/images/join.svg")
    const loggedIn = isLoggedIn()

    useEffect(() => {
        if (loggedIn) {
            setSize(35)
            setHref('/')
            setIcon("/images/logout.svg")
        } else {
            setSize(45)
            setHref('/register')
            setIcon("/images/join.svg")
        }
    }, [loggedIn])

    function handleClick() {
        if (loggedIn) {
            sendLogout()
        }
    }

    return (
        <Link href={href} className='grid place-items-center' onClick={handleClick}>
            <Image src={icon} alt="logo" height={size} width={size} />
        </Link>
    )
}

// Displays the scoreboard icon
export function LeftIcon() {
    const size = 35
    const href = "/scoreboard"
    const icon = "/images/scoreboard.svg"

    return (
        <Link href={href} className='grid place-items-center'>
            <Image src={icon} alt="logo" height={size} width={size} />
        </Link>
    )
}
