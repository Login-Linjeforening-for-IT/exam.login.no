'use client'

import { BROWSER_API } from "@parent/constants"
import getItem, { removeItem } from "./localStorage"

// Function to logout the user
export async function sendLogout(): Promise<Boolean | string> {
    try {
        // Removes user items from localstorage if the user wants to log out
        removeItem('token')
        removeItem('name')
        removeItem('id')
        removeItem('groups')
        removeItem('redirect')
        removeItem('email')
        window.location.reload()

        window.location.href = '/login'
        return "Logged out successfully."
    } catch (error) {
        return `Failed to log out: ${error}`
    }
}

// Checks if the user has a user object and is therefore likely to be logged in
// Note that this only checks what icons to display, and it will still be
// properly checked if the user clicks this icon or navigates to a page that
// requires login
export default function isLoggedIn() {
    if (typeof localStorage === 'undefined') {
        return false
    }

    const user: User | undefined = getItem('user') as User | undefined

    if (!user) {
        return false
    }

    return user.username.split('@')[0]
}

// Redirects the user to the page they were trying to access after successful login or register
export function getRedirect(alternative?: string): void {
    const redirect = localStorage.getItem('redirect')

    if (redirect) {
        window.location.href = redirect
        localStorage.removeItem('redirect')
    }

    if (alternative) {
        window.location.href = alternative
    }
}

// Function to register the user
export async function sendRegister(user: RegisterUser): Promise<true | string> {
    try {
        const response = await fetch(`${BROWSER_API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        return true
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}
