'use client'

import CourseListClient from "./root/coursesClient"

export default function Menu() {
    return (
        <div className="hidden menu absolute grid grid-rows-9 left-0 top-0 h-full w-full bg-normal">
            <div />
            <div className="row-span-8">
                <CourseListClient />
            </div>
        </div>
    )
}

export function Burger() {
    function handleClick() {
        const menu = document.querySelector('.menu')

        if (menu) {
            menu.classList.toggle('hidden')
        }
    }

    return (
        <div className='lg:hidden grid place-self-center p-[0.2rem] w-[1.8rem] h-[1.8rem] relative' onClick={handleClick}>
            <div className='bg-white rounded-xl h-[3px] self-center' />
            <div className='bg-white rounded-xl h-[3px] self-center' />
            <div className='bg-white rounded-xl h-[3px] self-center' />
        </div>
    )
}