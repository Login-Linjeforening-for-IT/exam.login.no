'use client'

import { getCourse, updateCourse } from "@/utils/fetch"
import Link from "next/link"
import Script from "next/script"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

type AddCardProps = {
    courseID: string
    card: Card
    setCard: Dispatch<SetStateAction<Card>>
    addCard: () => void
    alternativeIndex: number
    setAlternativeIndex: Dispatch<SetStateAction<number>>
}

type AlternativeProps = {
    card: Card
    setCard: Dispatch<SetStateAction<Card>>
    alternativeIndex: number
    setAlternativeIndex: Dispatch<SetStateAction<number>>
}

type AcceptedProps = {
    accepted: Card[]
    setAccepted: Dispatch<SetStateAction<Card[]>>
    handleAcceptedIndexClick: (index: number) => void
}

type RejectedProps = {
    selected: 'cards' | 'text'
    rejected: Card[]
    handleRejectedIndexClick: (index: number) => void
}

type EditCardsProps = {
    editing: Editing
    textareaRefs: React.MutableRefObject<(HTMLTextAreaElement | null)[]>
    handleQuestionChange: (event: React.ChangeEvent<HTMLTextAreaElement>, cardIndex: number) => void
    handleThemeChange: (event: React.ChangeEvent<HTMLInputElement>, cardIndex: number) => void
    setCorrectAnswer: (index: number, cardIndex: number) => void
    handleAlternativeChange: (event: React.ChangeEvent<HTMLTextAreaElement>, cardIndex: number, alternativeIndex: number) => void
    handleAction: (action: 'accept' | 'reject', cardIndex: number) => void
}

type HeaderProps = {
    selected: 'cards' | 'text',
    setSelected: Dispatch<SetStateAction<'cards' | 'text'>>
    clearCard: () => void
    editing: Editing
    setEditing: Dispatch<SetStateAction<Editing>>
    text: string
    setText: Dispatch<SetStateAction<string>>
}

export default function Edit({ params }: { params: { item: string[] } }) {
    const [selected, setSelected] = useState<'cards' | 'text'>('cards')
    const [rejected, setRejected] = useState<Card[]>([])
    const [editing, setEditing] = useState<Editing>({ cards: [], texts: [] })
    const [editingIndex, setEditingIndex] = useState(-1)
    const [accepted, setAccepted] = useState<Card[]>([])
    const [text, setText] = useState(editing.texts.join('\n\n'))
    const editingSpan = selected === 'cards' ? 'col-span-2' : 'col-span-3'
    const [alternativeIndex, setAlternativeIndex] = useState(0)
    const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([])
    const emptyCard: Card = { question: "", alternatives: [""], correct: 0 }
    const [card, setCard] = useState<Card>(emptyCard)

    const item = params.item[0].toUpperCase()

    useEffect(() => {
        (async () => {
            const newCourse = await getCourse(item, 'client')

            if (newCourse) {
                if (!editing.cards.length && typeof newCourse === 'object') {
                    if (!accepted.length) {
                        setAccepted(newCourse.cards)
                    }

                    if (!text.length) {
                        setText(newCourse.textUnreviewed.join('\n\n'))
                    }
    
                    setEditing({
                        texts: newCourse.textUnreviewed,
                        cards: newCourse.unreviewed,
                    } as Editing)
                }
            }
        })()
    }, [item])

    useEffect(() => {
        editing.cards.forEach((card, cardIndex) => {
            card.alternatives.forEach((_, index) => {
                const ref = textareaRefs.current[cardIndex * card.alternatives.length + index]
                if (ref) {
                    autoResizeTextarea(ref)
                }
            })
        })
    }, [editing.cards, selected])
    
    function handleSubmit() {
        updateCourse({courseID: item, accepted, editing})
    }

    function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(event.target.value)
        setEditing({...editing, texts: event.target.value.split('\n\n')})
    }

    function addCard() {
        if (!card.question) {
            return
        }


        if (editingIndex !== -1) {
            const tempAccepted = [...accepted]
            tempAccepted[editingIndex] = card
            tempAccepted[editingIndex].alternatives = card.alternatives.filter((alternative) => alternative.length)
            setAccepted(tempAccepted)
            setCard(emptyCard)
            setEditingIndex(-1)
            return
        } 

        setAccepted([...accepted, {
            ...card,
            alternatives: card.alternatives.filter((alternative) => alternative.length)
        }])
        setCard(emptyCard)
        setAlternativeIndex(0)
    }

    function handleAcceptedIndexClick(index: number) {
        if (selected === 'text') {
            setCard(accepted[index])
            setAlternativeIndex(accepted[index].alternatives.length - 1)
            setEditingIndex(index)
        } else {
            const tempCards = [...accepted]
            const card = tempCards.splice(index, 1)[0]
            setEditing({...editing, cards: [...editing.cards, card]})
            setAccepted(tempCards)
        }
    }

    function handleRejectedIndexClick(index: number) {
        const tempCards = [...rejected]
        const card = tempCards.splice(index, 1)[0]
        setEditing({...editing, cards: [...editing.cards, card]})
        setRejected(tempCards)
    }

    function handleQuestionChange(event: React.ChangeEvent<HTMLTextAreaElement>, cardIndex: number) {
        const tempCards = [...editing.cards]
        tempCards[cardIndex] = {...tempCards[cardIndex], question: event.target.value}
        setEditing({...editing, cards: tempCards})
        autoResizeTextarea(event.target)
    }

    function handleThemeChange(event: React.ChangeEvent<HTMLInputElement>, cardIndex: number) {
        const tempCards = [...editing.cards]
        tempCards[cardIndex] = {...tempCards[cardIndex], theme: event.target.value}
        setEditing({...editing, cards: tempCards})
    }

    function handleAlternativeChange(event: React.ChangeEvent<HTMLTextAreaElement>, cardIndex: number, alternativeIndex: number) {
        const tempCards = [...editing.cards]
        const tempAlternatives = [...tempCards[cardIndex].alternatives]
        tempAlternatives[alternativeIndex] = event.target.value
        tempCards[cardIndex] = {...tempCards[cardIndex], alternatives: tempAlternatives}
        setEditing({...editing, cards: tempCards})
        autoResizeTextarea(event.target)
    }

    function autoResizeTextarea(textarea: HTMLTextAreaElement) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    function setCorrectAnswer(index: number, cardIndex: number) {
        const tempCards = [...editing.cards]
        tempCards[cardIndex] = {...tempCards[cardIndex], correct: index}
        setEditing({...editing, cards: tempCards})
    }

    function handleAction(action: 'accept' | 'reject', cardIndex: number) {
        const tempCards = [...editing.cards]
        const card = tempCards.splice(cardIndex, 1)[0]
        if (action === 'accept') {
            setAccepted([...accepted, card])
        } else {
            setRejected([...rejected, card])
        }
        setEditing({...editing, cards: tempCards})
    }

    function clearCard() {
        setCard(emptyCard)
        setAlternativeIndex(0)
        setEditingIndex(-1)
    }
 
    return (
        <div className="w-full h-full rounded-xl gap-4 grid grid-rows-12">
            <div className="w-full h-full grid grid-cols-4 gap-8 row-span-11">
                <Rejected selected={selected} rejected={rejected} handleRejectedIndexClick={handleRejectedIndexClick} />
                <div className={`w-full h-full bg-dark ${editingSpan} rounded-xl flex flex-col`}>
                    <Header
                        selected={selected} 
                        setSelected={setSelected} 
                        clearCard={clearCard} 
                        editing={editing}
                        setEditing={setEditing}
                        text={text}
                        setText={setText}
                    />
                    <div className="w-full h-[68vh] px-4 pb-4">
                        {selected === 'cards' ? (
                            <EditCards
                                editing={editing}
                                textareaRefs={textareaRefs}
                                handleQuestionChange={handleQuestionChange}
                                handleThemeChange={handleThemeChange}
                                setCorrectAnswer={setCorrectAnswer}
                                handleAlternativeChange={handleAlternativeChange}
                                handleAction={handleAction}
                            />
                        ) : (
                            <div className="w-full h-full grid grid-cols-2 gap-4">
                                <textarea
                                    value={text}
                                    onChange={handleTextChange}
                                    className="w-full h-full overflow-auto noscroll bg-light rounded-xl p-2"
                                    style={{ overflow: 'hidden', resize: 'none', whiteSpace: 'pre-wrap' }}
                                />
                                <AddCard
                                    courseID={item}
                                    card={card}
                                    setCard={setCard}
                                    addCard={addCard}
                                    alternativeIndex={alternativeIndex}
                                    setAlternativeIndex={setAlternativeIndex}
                                />
                            </div>
                        )}
                        </div>
                </div>
                <Accepted 
                    accepted={accepted} 
                    setAccepted={setAccepted}
                    handleAcceptedIndexClick={handleAcceptedIndexClick}
                />
            </div>
            <div className="w-full h-full grid place-items-center">
                <Link
                    href={`/`}
                    onClick={handleSubmit}
                    className="h-full rounded-xl bg-dark px-8 text-xl grid place-items-center"
                >
                    Publish changes
                </Link>
            </div>
        </div>
    )
}

function AddCard({courseID, card, setCard, addCard, alternativeIndex, setAlternativeIndex} : AddCardProps) {
    function updateQuestion (question: string) {
        setCard({...card, question})
    }

    function updateTheme (theme: string) {
        setCard({...card, theme})
    }

    function handleAlternativeClick(index: number) {
        setAlternativeIndex(index)
    }

    function removeAlternative(index: number) {
        const tempAlternatives = [...card.alternatives]
        tempAlternatives.splice(index, 1)
        setCard({...card, alternatives: tempAlternatives})
        setAlternativeIndex(alternativeIndex - 1 > 0 ? alternativeIndex - 1 : 0)
    }

    return (
        <div className="w-full h-full overflow-auto noscroll p-1">
            <h1 className="flex items-center justify-start text-lg h-[4vh]">Theme</h1>
            <input
                className="bg-light p-1 pl-2 w-full rounded-xl h-[4vh]"
                value={card.theme}
                type="text"
                placeholder="Question theme"
                onChange={(event) => updateTheme(event.target.value)}
            />
            <h1 className="flex items-center justify-start text-lg col-span-1 h-[4vh]">Question</h1>
            <textarea
                value={card.question} 
                onChange={(event) => updateQuestion(event.target.value)}
                placeholder={`Add question about ${courseID}...`}
                className="w-full bg-light h-[4vh] rounded-xl px-2 min-h-[20vh]"
            />
            <h1 className="flex items-center justify-start text-lg col-span-1 h-[4vh]">Alternatives</h1>
            <div className="w-full">
                {card.alternatives.map((alternative, index) => {
                    if (index == card.alternatives.length - 1 && !alternative) {
                        return
                    }

                    return (
                        <div key={index} className="grid grid-cols-12">
                            <h1 className="col-span-1">{index + 1}</h1>
                            <button
                                onClick={() => handleAlternativeClick(index)} 
                                key={alternative} 
                                className="text-left col-span-10 flex flex-rows space-x-2"
                            >
                                <h1>{alternative}</h1><h1 className="text-superlight grid place-items-center">{`${card.correct === index ? '(correct)' : '(wrong)'}`}</h1>
                            </button>
                            <button onClick={() => removeAlternative(index)}>❌</button>
                        </div>
                    )    
                })}
            </div>
            <Alternative
                card={card}
                setCard={setCard}
                alternativeIndex={alternativeIndex}
                setAlternativeIndex={setAlternativeIndex}
            />
            <button 
                className="w-full h-[4vh] text-lg place-self-center bg-orange-500 rounded-xl mt-2"
                onClick={addCard}
            >Add card</button>
        </div>
    )
}

function Alternative({card, setCard, alternativeIndex, setAlternativeIndex}: AlternativeProps) {
    // Updates the alternative in the course object
    function handleInput(input: string) {
        const tempAlternatives = [...card.alternatives]
        tempAlternatives[alternativeIndex] = input
        setCard({...card, alternatives: tempAlternatives})
    }

    // Adds a new alternative to the current card
    function handleAddAlternative() {
        // Aborts if the current alternative is empty
        if (!card.alternatives[alternativeIndex]) {
            return
        }

        card.alternatives.push("")
        setAlternativeIndex(alternativeIndex + 1)
    }

    // Sets the selected alternative to be the correct one for the card
    function handleSetCorrectAlternative() {
        setCard({...card, correct: alternativeIndex})
    }

    return (
        <div className="w-full mt-2">
            <div className="grid grid-cols-12 mb-2">
                <h1 className="flex items-center justify-start text-lg col-span-1 h-[4vh]">{alternativeIndex + 1}:</h1>
                <div className="w-full col-span-11 flex flex-cols-auto">
                    <textarea
                        value={card.alternatives[alternativeIndex]} 
                        onChange={(event) => handleInput(event.target.value)} 
                        placeholder={`Alternative ${alternativeIndex + 1}`}
                        className="min-h-[5vh] w-full bg-light h-[4vh] rounded-xl px-2 mr-4"
                    />
                    <button
                        value={Number(card.correct === alternativeIndex)}
                        className="h-full col-span-1 text-4xl col-span-1"
                        onClick={handleSetCorrectAlternative}
                    >
                        ✅
                    </button>
                </div>
            </div>
            <button 
                className="w-full h-[4vh] bg-orange-500 rounded-lg text-xl"
                onClick={handleAddAlternative}
            >Add alternative</button>
        </div>
    )
}

function Accepted({accepted, setAccepted, handleAcceptedIndexClick}: AcceptedProps) {
    function handleRemove(index: number) {
        const tempAccepted = [...accepted]
        tempAccepted.splice(index, 1)
        setAccepted(tempAccepted)
    }

    return (
        <div className="w-full h-full bg-dark rounded-xl p-4 overflow-auto">
            <div className="grid grid-cols-12">
                <h1 className="text-xl mb-4 grid grid-row col-span-11">Accepted</h1>
                <h1 className="text-gray-500">({accepted.length})</h1>
            </div>
            <div>
                {accepted.map((card: Card, index: number) => (
                    <div key={index} className="grid grid-cols-12 gap-2">
                        <button
                            key={card.question}
                            onClick={() => handleAcceptedIndexClick(index)} 
                            className="w-full bg-light rounded-xl p-2 flex flex-rows space-x-2 mb-2 col-span-11 text-left"
                        >
                            <div className="grid grid-cols-12 w-full">
                                <h1 className="w-full col-span-11">{card.question.slice(0, 60)}{card.question.length > 60 && '...'}</h1>
                                <h1 className="text-gray-500 text-right w-full">{card.alternatives.length}</h1>
                            </div>
                        </button>
                        <button onClick={() => handleRemove(index)}>❌</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Rejected({selected, rejected, handleRejectedIndexClick}: RejectedProps) {
    if (selected === 'cards') {
        return (
            <div className="w-full h-full bg-dark rounded-xl p-4 overflow-auto">
                <div className="grid grid-cols-12">
                    <h1 className="text-xl mb-4 grid grid-row col-span-11">Rejected</h1>
                    <h1 className="text-gray-500">({rejected.length})</h1>
                </div>
                <div>
                    {rejected.map((card: Card, index: number) => (
                        <button
                            key={card.question}
                            onClick={() => handleRejectedIndexClick(index)} 
                            className="w-full bg-light rounded-xl p-2 flex flex-rows space-x-2 mb-2"
                        >
                            <h1>{card.question.slice(0, 40)}...</h1>
                            <h1 className="text-gray-500">{card.alternatives.length}</h1>
                        </button>
                    ))}
                </div>
            </div>
        )
    }
}

function EditCards({editing, textareaRefs, handleQuestionChange, handleThemeChange, setCorrectAnswer, handleAlternativeChange, handleAction}: EditCardsProps) {
    return (
        <div className="w-full h-full overflow-auto noscroll">
            {editing.cards.map((card, cardIndex) => (
                <div key={cardIndex} className="w-full">
                    <h1 className="mb-2">Theme</h1>
                    <input
                        className="bg-extralight p-2 w-full rounded-xl"
                        value={card.theme}
                        type="text"
                        placeholder="Question theme"
                        onChange={(event) => handleThemeChange(event, cardIndex)}
                        style={{ overflow: 'hidden', resize: 'none', whiteSpace: 'pre-wrap'}}
                    />
                    <h1 className="mb-2">Question</h1>
                    <textarea
                        ref={(el) => { textareaRefs.current[cardIndex] = el }}
                        className="bg-extralight p-2 w-full rounded-xl"
                        value={card.question}
                        onChange={(event) => handleQuestionChange(event, cardIndex)}
                        style={{ overflow: 'hidden', resize: 'none', whiteSpace: 'pre-wrap'}}
                    />
                    <h1 className="mb-2">Alternatives</h1>
                    <div className="bg-normal rounded-xl">
                        {card.alternatives.map((alternative, index) => (
                            <div key={index} className="p-2 grid grid-col w-full">
                                <button className="text-left" onClick={() => setCorrectAnswer(index, cardIndex)}>
                                    {index + 1}{card.correct === index ? "✅" : "❌"}. 
                                </button>
                                <textarea
                                    key={index}
                                    ref={(el) => { textareaRefs.current[cardIndex * card.alternatives.length + index] = el }}
                                    className="bg-light p-2 w-full rounded-xl"
                                    value={alternative}
                                    onChange={(event) => handleAlternativeChange(event, cardIndex, index)}
                                    style={{ overflow: 'hidden', resize: 'none' }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="w-full grid grid-cols-4 gap-8 h-[4vh] mt-5 mb-5">
                        <div/>
                            <button 
                                className="bg-orange-500 w-full rounded-xl" 
                                onClick={() => handleAction('reject', cardIndex)}
                            >
                                Reject
                            </button>
                            <button 
                                className="bg-orange-500 w-full rounded-xl" 
                                onClick={() => handleAction('accept', cardIndex)}
                            >
                                Accept
                            </button>
                        <div/>
                    </div>
                </div>    
            ))}
        </div>
    )
}

function Header({ selected, setSelected, clearCard, editing, setEditing, text, setText }: HeaderProps) {
    const isText = selected === 'text'
    const fileInputRef = useRef<HTMLInputElement | null>(null)
  
    async function upload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (file) {
            try {
                const fileReader = new FileReader()

                fileReader.onload = async (event) => {
                    const arrayBuffer = event.target?.result

                    if (arrayBuffer) {
                        const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer)
                        // @ts-expect-error
                        // Expecting error here since pdfjsLib is not defined but imported at runtime
                        const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
                        const pdf = await loadingTask.promise
                        let pdfText = ''
                        
                        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                            const page = await pdf.getPage(pageNum)
                            const textContent = await page.getTextContent()
                            const pageText = textContent.items.map((item: any) => item.str).join('\n')
                            pdfText += pageText
                        }

                        setEditing({...editing, texts: [...text, pdfText]})
                        setText([...text, '\n\n', pdfText].join(''))

                        if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                        }
                    }
                }
    
                fileReader.onerror = (error) => {
                    console.error('Error reading file:', error)
                }
    
                fileReader.readAsArrayBuffer(file)
            } catch (error) {
                console.error('Error loading PDF:', error)
            }
        }
    }
  
    return (
      <div className="w-full p-4 flex flex-rows justify-between">
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js" />
            <h1 className="text-xl">Editing {selected}</h1>
            <div className="space-x-2">
                {isText && (
                    <>
                    <input
                        type="file"
                        accept=".pdf"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={upload}
                    />
                    <button
                        className="bg-light rounded-lg p-1 px-2"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Upload exam
                    </button>
                    </>
                )}
                {isText && (
                    <button className="bg-light rounded-lg p-1 px-2" onClick={clearCard}>
                    Clear
                    </button>
                )}
                <button className="bg-light rounded-lg p-1 px-2" onClick={() => setSelected('cards')}>
                    Cards
                </button>
                <button className="bg-light rounded-lg p-1 px-2" onClick={() => setSelected('text')}>
                    Text
                </button>
            </div>
      </div>
    )
  }
