import { useEffect, useState } from "react"
import "./styles.css"

import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../config/firestore";

interface Board {
    id: string;
    boardAvailability: string;
    boardNumber: number;
}

type Mode = 'pegar' | 'devolver' | null;
type Button = 'A'|'B'|'C'|'D';



export function Home(){

    // const [buttonPressed, setButtonPressed] = useState<Button | null>(null);
    const [boardNumber, setBoardNumber] = useState(1);
    const [mode, setMode] = useState<Mode>(null);
    // const [available, setAvailable] = useState(true);
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
        } catch (error) {
            console.error("Error fetching boards:", error);
        }
    }
    
    useEffect(() => {
        const fecthBoardCount = async() => {
            const querySnapshot = await getDocs(collection(db, "boards"));
            setMaxBoards(querySnapshot.size)
        };

        fecthBoardCount();
        getBoards();
    }, []);
    

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

    const handleButtonPress = (button: Button) => {
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
            if (data.boardAvailability === 'disponivel') {
                setBoardAv('indisponivel');
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
            if (data.boardAvailability === 'indisponivel') {
                setBoardAv('disponivel');
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
        <div id="container">
            <div id="adesivoNFC-box">
                <div className="adesivoNFC" onClick={handleNfcPressed}>NFC</div>
            </div>
            <div id="content">
                {mode === null ? (
                    <>
                        <div id="screen-box">
                            <div id="screen">
                                <h3>{h3}</h3>
                                <h1>{tela}</h1>
                            </div>
                        </div>
                        <h2>Nintendo GAME BOY</h2>
                        <div id="buttons">
                            <div id="upside-buttons">
                                <div className="buttonB-box">
                                    <div className="upside-button" onClick={() => handleButtonPress('B')}>B</div>
                                </div>
                                <div className="buttonA-box">
                                    <div className="upside-button" onClick={() => handleButtonPress('A')}>A</div>
                                </div>
                            </div>
                            <div id="downside-buttons">
                                <div className="buttonC-box">
                                    <div className="downside-button" onClick={() => handleButtonPress('C')}></div>
                                    <p>C</p>
                                </div>
                                <div className="buttonD-box">
                                    <div className="downside-button" onClick={() => handleButtonPress('D')}></div>
                                    <p>D</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div id="screen-box">
                            <div id="screen">
                                <h3>{h3}</h3>
                                <h1>{tela}</h1>
                                { awaitingNFC === false ? (
                                    <h1>Lousa: {boardNumber}</h1>
                                ) : (
                                    <h1></h1>
                                )}
                            </div>
                        </div>
                        <h2>Nintendo GAME BOY</h2>
                        <div id="buttons">
                            <div id="upside-buttons">
                                <div className="buttonB-box">
                                    <div className="upside-button" onClick={() => handleButtonPress('B')}>B</div>
                                </div>
                                <div className="buttonA-box">
                                    <div className="upside-button" onClick={() => handleButtonPress('A')}>A</div>
                                </div>
                            </div>
                            <div id="downside-buttons">
                                <div className="buttonC-box">
                                    <div className="downside-button" onClick={() => handleButtonPress('C')}></div>
                                    <p>C</p>
                                </div>
                                <div className="buttonD-box">
                                    <div className="downside-button" onClick={() => handleButtonPress('D')}></div>
                                    <p>D</p>
                                </div>
                            </div>
                        </div>
                    </>
                )} 
            </div>
            <div id="avaiabilityList">
                <h3>Banco de dados</h3>
                <ul>
                    {boards.map((board) => (
                        <li key={board.id}>
                            <h3>
                            {`Lousa ${board.boardNumber}: ${board.boardAvailability}`}
                            </h3>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}