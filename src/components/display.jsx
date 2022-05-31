import Tray from "./tray";
import Field from "./field";
import { useState } from "react";

const Display = () => {
    const [userInput, setDiceRoll] = useState(""); 
    const [rollResult, updateDisplay] = useState({userInput:""});

    const rollStandardDice = (diceRoll) => {

        const numberOfDice = diceRoll.match(/^\d+/i);
        const diceSide = diceRoll.match(/\d+$/i);
        const operations = [];

        while (numberOfDice[0] > 0) {
            let roll = (1 + Math.floor(Math.random() * diceSide[0]));
            operations.push(roll);
            numberOfDice[0]--;
        }

        return operations;
    }

    const computeDiceRolls = (input) => {
        let inputArray = input.split(" ");

        inputArray.forEach((singleRoll, index) => {
            if(/\d+D\d+/ig.test(singleRoll)) {
                inputArray[index] = rollStandardDice(singleRoll);
            }
        })
        
        const formattedArray = inputArray.map((nestedArray) => {
            let sum = 0;
            let equation = [];
            if(Array.isArray(nestedArray)) {

                nestedArray.forEach((roll) => {
                    sum += parseInt(roll);
                    equation.push(roll);
                })
    
                if(nestedArray.length > 1) {
                    return `${equation.join(" + ")} = ${sum}`;
                } else {
                    return `${sum}`;
                }
            } else {
                return nestedArray;
            }
        })

        let outputArray = [];
        formattedArray.forEach((element, index) => {
            const mathsObject = {
                "+": function(previousRoll, currentRoll) {
                    return parseInt(previousRoll) + parseInt(currentRoll);
                },
                "-": function(previousRoll, currentRoll) {
                    return parseInt(previousRoll) - parseInt(currentRoll);
                }
            };

            if(index > 1) {
                const operatorRegex = /^[+|-]$/;
                if(operatorRegex.test(formattedArray[index - 1])) {
                    const operator = formattedArray[index - 1].match(operatorRegex);
                    const sumRegex = /\d+$/;
                    const previousSum = outputArray[outputArray.length - 1].match(sumRegex);
                    const currentSum = formattedArray[index].match(sumRegex);
                    const newSum = mathsObject[operator[0]](previousSum[0], currentSum[0]);
                    outputArray[outputArray.length - 1] = outputArray[outputArray.length - 1].replace(sumRegex, newSum);
                    if(/^\d+$/.test(formattedArray[index])) {
                        outputArray[outputArray.length - 1] = `${formattedArray[index]} + ${outputArray[outputArray.length - 1]}`
                    } else {
                        const additionString = formattedArray[index].replace(/=\s\d+$/, "");
                        outputArray[outputArray.length - 1] = `${additionString} +${outputArray[outputArray.length - 1]}`
                    }
                } else {
                    outputArray.push(element);
                }
            } else if(!/^[+|-]$/.test(formattedArray[index])) {
                outputArray.push(element);
            }
        })

        return outputArray.join(", ");
    };

    const handleRoll = (event) => {
        event.preventDefault();
        updateDisplay((rollResult) => {
            const newObj = {};
            setDiceRoll((userInput) => {
                const regex = /\d+D\d+/ig;
                if(regex.test(userInput)) {
                    let diceSound = new Audio('dice.mp3');
                    diceSound.play();
                    newObj.userInput = computeDiceRolls(userInput);
                }
                return "";
            })
            return newObj;
        })
    };

    return (
        <main id="display">
            <button id="instructions-button">
            </button>
            <section id="instructions-box">
                <h4>How to use Impossible Dice</h4>
                <p>blah blah blah</p>
            </section>
            <Tray rollResult={rollResult} updateDisplay={updateDisplay}/>
            <Field userInput={userInput} setDiceRoll={setDiceRoll} handleRoll={handleRoll}/>
        </main>
    )
}

export default Display;