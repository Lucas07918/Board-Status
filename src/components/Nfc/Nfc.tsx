import React from "react";
import { useBoardContext } from "../../context/BoardContext";
import './styles.css';

const Nfc: React.FC = () => {
    const { handleNfcPressed } = useBoardContext();
    return(
        <div id="adesivoNFC-box">
            <div className="adesivoNFC" onClick={handleNfcPressed}>NFC</div>
        </div>
    )
}

export default Nfc;