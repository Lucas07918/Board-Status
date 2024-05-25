import React from "react"
import { useBoardContext } from "../../context/BoardContext"
import './styles.css';

const Device: React.FC = () => {

    const { mode, tela, h3, awaitingNFC, boardNumber, handleButtonPress } = useBoardContext();

    return(
        <div id="content">
                {mode === null ? (
                    <>
                        <div id="screen-box">
                            <div id="screen">
                                <h3>{h3}</h3>
                                <h1>{tela}</h1>
                            </div>
                        </div>
                        <h2>Rocket BOARD STATUS</h2>
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
                        <h2>Rocket BOARD STATUS</h2>
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
    )
}

export default Device;