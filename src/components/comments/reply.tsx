import { deleteComment, postComment } from "@/utils/comments"
import getItem from "@/utils/localStorage"
import { Dispatch, SetStateAction, useState } from "react"
import Editor, { Markdown } from "../editor/editor"
import Link from "next/link"
import ThumbsUp from "../svg/thumbsup"
import ThumbsDown from "../svg/thumbsdown"
import Trash from "../svg/trash"
import voteColor from "./voteColor"

type ReplyProps = {
    courseID: string
    cardID: number
    comment: CardComment
    comments: CardComment[]
    setComments: Dispatch<SetStateAction<CardComment[]>>
}

type RepliesProps = {
    replies: CardComment[]
    vote: ({commentID, vote}: ClientVote) => void
    comment: CardComment
    comments: CardComment[]
    setComments: Dispatch<SetStateAction<CardComment[]>>
}

type ReplyComponentProps = {
    reply: CardComment 
    vote: ({commentID, vote}: ClientVote) => void
    comment: CardComment
    comments: CardComment[]
    setComments: Dispatch<SetStateAction<CardComment[]>>
}

export default function Reply({
    courseID, 
    cardID, 
    comment, 
    comments, 
    setComments
}: ReplyProps) {
    const user = getItem('user') as User
    const [reply, setReply] = useState("")

    function send() {
        if (!reply.length) {
            return
        }

        postComment({
            courseID,
            cardID,
            content: reply,
            parent: comment.id
        })

        const temp = [...comments]
        const index = temp.indexOf(comment)
        temp[index] = {
            ...comment,
            replies: comment.replies ? [...comment.replies, {
                id: comment.replies.length,
                courseID,
                cardID,
                username: "You",
                content: reply,
                time: new Date().toISOString(),
                rating: 0,
                votes: []
            }] : [{
                id: 0,
                courseID,
                cardID,
                username: "You",
                content: reply,
                time: new Date().toISOString(),
                rating: 0,
                votes: []
            }]
        }
        setComments(temp)

        setReply('')
    }

    return (
        <div className="grid grid-cols-12">
            <div className="col-span-1" />
            <Editor
                className="w-full bg-light p-2 rounded-xl min-h-[7.5vh] max-h-[60vh] col-span-11 overflow-auto noscroll mt-2 p-2"
                placeholder="Write a comment..."
                courseID=""
                value={reply.split('\n')} 
                customSaveLogic={true} 
                hideSaveButton={true}
                save={() => {}}
                onChange={setReply}
            />
            <div className="col-span-10"/>
            <button 
                className="col-span-2 justify-end bg-light rounded-xl mt-2 h-[5vh]" 
                onClick={send}
            >
                Add comment
            </button>
        </div>
    )
}

export function Replies({
    replies, 
    vote, 
    comment, 
    comments, 
    setComments
}: RepliesProps) {
    return (
        <div className="grid grid-cols-12 mt-2">
            <div className="col-span-1" />
            <div className="col-span-11">
                {replies.map((reply) => <ReplyComponent 
                    key={reply.id}
                    reply={reply} 
                    vote={vote} 
                    comment={comment} 
                    comments={comments} 
                    setComments={setComments} 
                />)}
            </div>
        </div>
    )
}

function ReplyComponent({
    reply, 
    vote, 
    comment, 
    comments, 
    setComments
}: ReplyComponentProps) {
    const [clientVote, setClientVote] = useState<1 | 0 | -1>(0)
    const user = getItem('user') as User | string | undefined
    const username = typeof user === 'string' ? user : user ? user.username.split('@')[0] : ''
    const reply_author = reply.username.split('@')[0]
    const author = reply_author === username ? 'You' : reply_author
    const reply_user = reply.username.split('@')[0]

    function handleDelete() {
        deleteComment({commentID: reply.id, courseID: comment.courseID})

        const temp = [...comments]
        const index = temp.indexOf(comment)
        temp[index] = {
            ...comment,
            replies: comment.replies?.filter(inner => inner.id !== reply.id)
        }
        setComments(temp)
    }

    function handleVote({current}: {commentID: number, current: boolean}) {
        if (clientVote === 1 && current || clientVote === -1 && !current) {
            setClientVote(0)
        } else {
            setClientVote(current ? 1 : -1)
        }

        vote({commentID: reply.id, vote: current, isReply: true})
    }

    return (
        <div>
            <div className="bg-normal rounded-xl p-2 mb-1">
                <div className="w-full grid grid-cols-2 text-almostbright">
                    <Link 
                        href={`/profile/${reply_user}`} 
                        className="text-lg text-almostbright underline"
                    >
                        {author}
                    </Link>
                    <h1 className="text-right pr-2">
                        {new Date(reply.time).toLocaleString()}
                    </h1>
                </div>
                <Markdown
                    displayEditor={false} 
                    handleDisplayEditor={() => {}} 
                    markdown={reply.content} 
                />
            </div>
            <div className="w-full flex flex-rows space-x-2 mb-2">
                <h1 className="text-almostbright">{reply.rating > 0 ? '+' : ''}{reply.rating + clientVote}</h1>
                <button 
                    className="w-[1.3vw]" 
                    onClick={() => handleVote({commentID: reply.id, current: true})}
                >
                    <ThumbsUp 
                        fill={voteColor('up', reply.votes, username, clientVote)} 
                        className="w-full h-full pt-[0.2vh]"
                    />
                </button>
                <button 
                    className="w-[1.3vw]" 
                    onClick={() => handleVote({commentID: reply.id, current: false})}
                >
                    <ThumbsDown 
                        fill={voteColor('down', reply.votes, username, clientVote)} 
                        className="w-full h-full pt-[0.2vh]" 
                    />
                </button>
                {username === reply_user && <button 
                    className="text-almostbright underline w-[1.3vw]" 
                    onClick={handleDelete}
                >
                    <Trash fill="fill-almostbright hover:fill-red-500" className="w-full h-full pt-[0.2vh]" /> 
                </button>}
            </div>
        </div>
    )
}
