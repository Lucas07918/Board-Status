import React from "react";
import { useBoardContext } from "../../context/BoardContext"
import './styles.css';

// Componente que exibe a lista de lousas e suas disponibilidades
const AvailabilityList: React.FC = () => {
    const { boards } = useBoardContext();

    return(
        <div id="avaiabilityList">
            <h3>Banco de Dados</h3>
            <ul>
                {boards.map((board) => (
                    <li key={board.id}>
                        <h3>{`Lousa ${board.boardNumber}: ${board.boardAvailability}`}</h3>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AvailabilityList;