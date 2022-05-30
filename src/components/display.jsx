import Tray from "./tray";
import Field from "./field";
import { useState } from "react";

const Display = () => {
    const [userInput, setDiceRoll] = useState(""); 
    const [rollResult, updateDisplay] = useState({userInput:""});

    const rollStandardDice = (input) => {
        const regex = /\d+D\d+/ig;
        if(regex.test(input)) {
            const diceRoll = input.match(regex);
            const resultArray = [];

            for(let i = 0; i < diceRoll.length; i++) {
                const numberOfDice = diceRoll[i].match(/^\d+/i);
                const diceSide = diceRoll[i].match(/\d+$/i);
                resultArray.push((1 + Math.floor(Math.random() * diceSide[0])) * numberOfDice[0]);
                console.log(resultArray)
            }

            return resultArray.join(", ");
        }
    };

    const handleRoll = (event) => {
        event.preventDefault();
        updateDisplay((rollResult) => {
            const newObj = {...rollResult};
            setDiceRoll((userInput) => {
                const regex = /\d+D\d+/ig;
                if(regex.test(userInput)) {
                    newObj.userInput = "You rolled "
                    newObj.userInput += rollStandardDice(userInput);
                }
                return "";
            })
            return newObj;
        })
    };

    return (
        <main id="display">
            <Tray rollResult={rollResult}/>
            <Field userInput={userInput} setDiceRoll={setDiceRoll} handleRoll={handleRoll}/>
        </main>
    )
}

export default Display;