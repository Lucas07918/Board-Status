import React, { createContext, useEffect, useState, ReactNode, useContext } from "react"

import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firestore";

interface Board {
    id: string;
    boardAvailability: string;
    boardNumber: number;
}

type Mode = 'pegar' | 'devolver' | null;

interface BoardContextProps{
    boardNumber: number;
    setBoardNumber: React.Dispatch<React.SetStateAction<number>>;
    mode: Mode;
    setMode: React.Dispatch<React.SetStateAction<Mode>>;
    tela: string;
    setTela: React.Dispatch<React.SetStateAction<string>>;
    h3: string;
    setH3: React.Dispatch<React.SetStateAction<string>>;
    awaitingNFC: boolean;
    setAwaitingNFC: React.Dispatch<React.SetStateAction<boolean>>;
    boards: Board[]
    getBoards: () => void;
    checkBoardAvailability: (number: number) => void;
    handleReturnBoard: (number: number) => void;
    maxBoards: number;
    handleNfcPressed: () => void;
    handleButtonPress: (button: string) => void;
}

const BoardContext = createContext<BoardContextProps | undefined>(undefined);

export const BoardProvider = ({ children }: {children: ReactNode }) => {
    const [boardNumber, setBoardNumber] = useState(1);
    const [mode, setMode] = useState<Mode>(null);
    const [tela, setTela] = useState('Aperte A ou B');
    const [h3, setH3] = useState('');
    const [awaitingNFC, setAwaitingNFC] = useState(false)
    const [boards, setBoards] = useState<Board[]>([])
    const [boardAv, setBoardAv] = useState('')
    const [maxBoards, setMaxBoards] = useState(0)

    async function getBoards() {
        try {
            console.log("Fetching boards...");
            const querySnapshot = await getDocs(collection(db, "boards"));
            const data: Board[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
              })) as Board[];
              setBoards(data)
              setMaxBoards(data.length)
        } catch (error) {
            console.error("Error fetching boards:", error);
        }
    }
    
    useEffect(() => {
        getBoards();
    }, [boards]);
    

    const handleNfcPressed = async() => {
        setTela('')
        if (awaitingNFC) {
            if (mode === 'pegar') {
                const boardDocref = doc(db, 'boards', `board${boardNumber}`);
                await updateDoc(boardDocref, {
                    boardAvailability: boardAv
                })
                setH3(`Utilizando lousa n°${boardNumber}`)
                setTimeout(() => {
                    setH3('')
                    setTela('Aperte A ou B')
                }, 1000);
                reset()
            } else if (mode === 'devolver') {
                const boardDocref = doc(db, 'boards', `board${boardNumber}`);
                await updateDoc(boardDocref, {
                    boardAvailability: boardAv
                })
                setH3(`Devolvendo lousa n°${boardNumber}`)
                setTimeout(() => {
                    setH3('')
                    setTela('Aperte A ou B')
                }, 1000);
                reset()
            }
        }
    }

    const handleButtonPress = (button: string) => {
        if (mode === null) {
            if (button === 'A') {
                setTela('Utilizar lousa')
                setTimeout(() => {
                    setTela('')
                    setMode('pegar');
                }, 1000)
            } else if (button === 'B') {
                setTela('Devolver lousa')
                setTimeout(() => {
                    setTela('')
                    setMode('devolver');
                }, 1000)
            }
        } else {
            if (button === 'A') {
                setBoardNumber(prevNumber => Math.min(prevNumber + 1, maxBoards));
            } else if (button === 'B') {
                setBoardNumber(prevNumber => Math.max(prevNumber - 1, 1));
            } else if (button === 'C') {
                setAwaitingNFC(true)
                if(mode === 'pegar'){
                    checkBoardAvailability(boardNumber)
                        setTimeout(() => {
                            setTela('Clique no NFC')
                        }, 180);
                } else {
                    handleReturnBoard(boardNumber)
                        console.log("pedindo pra clicar no nfc...")
                        setTimeout(() => {
                            setTela('Clique no NFC')
                        }, 180);
                }
            } else if (button === 'D') {
                setTela('Cancelando')
                    setTimeout(() => {
                        setTela('Aperte A ou B')
                    }, 1000);
                reset();
            }
        }
    };
    

    const reset = () => {
        setMode(null);
        setBoardNumber(1);
        setAwaitingNFC(false)
    }

    const checkBoardAvailability = async (number: number) => {
        const boardDocRef = doc(db, "boards", `board${number}`);
        const boardDoc = await getDoc(boardDocRef);

        if (boardDoc.exists()) {
            const data = boardDoc.data();
            if (data?.boardAvailability === 'disponível') {
                setBoardAv('indisponível');
                setAwaitingNFC(true);
            } else {
                setTela('Lousa indisponível')
                setTimeout(() => {
                    setTela('Aperte A ou B')
                }, 1000)
                reset()
            }
        }
    }

    const handleReturnBoard = async (number: number) => {
        const boardDocRef = doc(db, "boards", `board${number}`);
        const boardDoc = await getDoc(boardDocRef);

        if (boardDoc.exists()) {
            const data = boardDoc.data();
            if (data?.boardAvailability === 'indisponível') {
                setBoardAv('disponível');
                setAwaitingNFC(true);
            } else {
                setTela('Esta lousa não estava sendo usada')
                setTimeout(() => {
                    setTela('Aperte A ou B')
                }, 1000)
                reset()
            }
        }
    }

    return(
        <BoardContext.Provider
            value={{
                boardNumber,
                setBoardNumber,
                mode,
                setMode,
                tela,
                setTela,
                h3,
                setH3,
                awaitingNFC,
                setAwaitingNFC,
                boards,
                getBoards,
                checkBoardAvailability,
                handleReturnBoard,
                maxBoards,
                handleNfcPressed,
                handleButtonPress,
            }}
        >
            {children}
        </BoardContext.Provider>
    )
}

export const useBoardContext = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error("useBoardContext must be used within a BoardProvider");
    }
    return context;
}