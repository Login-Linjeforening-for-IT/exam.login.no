import type { JSX } from "react";
export default function ListHeader({userCount}: {userCount: number}): JSX.Element {

    if (userCount < 2) return (
        <div className="flex bg-[#111] h-[50px] mb-2 rounded-xl px-2">
            <p className="ml-2 grid place-items-center mr-2 w-[80px]">Place</p>
            <p className="mt-auto mb-auto mr-2 w-full pl-10">User</p>
            <p className="mt-auto mb-auto mr-2 w-full pl-10">Time</p>
            <p className="mt-auto mb-auto w-[60px]">Score</p>
        </div>
    ) 
    
    return (
        <div className="grid md:grid-cols-2 md:col-span-2">
            <HeaderItem className="hidden md:grid mr-2" />
            <HeaderItem className="md:ml-2" />
        </div>
    )
}

function HeaderItem({className}: {className: string}) {
    return (
        <div className={`grid bg-darker mb-2 pt-2 pb-2 grid-cols-4 place-items-center rounded-xl ${className} font-semibold`}>
            <h1>Place</h1>
            <h1>User</h1>
            <h1>Time</h1>
            <h1>Score</h1>
        </div>
    )
}