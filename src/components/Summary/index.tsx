import EntradasImg from '../../assets/Entradas.svg';
import SaídasImg from '../../assets/Saídas.svg';
import TotalImg from '../../assets/Total.svg';

import { Container } from "./styles";

export function Summary() {
    return(
        <Container>
            <div>
                <header>
                    <p>Entradas</p>
                    <img src={EntradasImg} alt="Entradas" />
                </header>
                <strong>R$1000,00</strong>
            </div>
            <div>
                <header>
                    <p>Saídas</p>
                    <img src={SaídasImg} alt="Saídas" />
                </header>
                <strong>- R$500,00</strong>
            </div>
            <div className='highlight-background'>
                <header>
                    <p>Total</p>
                    <img src={TotalImg} alt="Total" />
                </header>
                <strong>R$1500,00</strong>
            </div>
        </Container>
    )
}