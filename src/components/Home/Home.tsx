// import React from "react"
import './styles.css';
import { BoardProvider } from "../../context/BoardContext";
import Nfc from "../Nfc/Nfc";
import Device from '../Device/Device';
import AvailabilityList from '../AvailabilityList/AvailabilityList';


export function Home(){

    return(
        <BoardProvider>
            <div id="container">
                <Nfc />
                <Device />
                <AvailabilityList />
            </div>
        </BoardProvider>
    )
}