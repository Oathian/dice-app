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
        if(numberOfDice === null) {
            return; 
        }
        while (numberOfDice[0] > 0) {
            let roll = (1 + Math.floor(Math.random() * diceSide[0]));
            operations.push(roll);
            numberOfDice[0]--;
        }
        let diceSound = new Audio('dice.mp3');
        diceSound.play();
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
                    return `(${equation.join(" + ")}) = ${sum}`;
                } else {
                    return `(${sum})`;
                }
            } else {
                return nestedArray;
            }
        })


        console.log(formattedArray)

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
                    const sumRegex = /\-*\d+$/;
                    console.log(">>>>", outputArray[outputArray.length - 1])
                    let previousSum;
                    if(sumRegex.test(outputArray[outputArray.length - 1])) {
                        previousSum = outputArray[outputArray.length - 1].match(sumRegex);
                    }else{
                        const outputArrayFormat = outputArray[outputArray.length - 1].match(/\d+\)/)
                        previousSum = outputArrayFormat[0].match(/\d+/);
                    }
                    console.log(previousSum[0], "<<<")
                    let currentSum;
                    if(sumRegex.test(formattedArray[index])) {
                        currentSum = formattedArray[index].match(sumRegex);
                    }else{
                        const outputArrayFormat = formattedArray[index].match(/\d+\)/)
                        currentSum = outputArrayFormat[0].match(/\d+/);
                    }
                    const newSum = mathsObject[operator[0]](previousSum[0], currentSum[0]);
                    console.log(previousSum[0], operator[0],currentSum[0], newSum)
                    if(sumRegex.test(outputArray[outputArray.length - 1])) {
                        outputArray[outputArray.length - 1] = outputArray[outputArray.length - 1].replace(sumRegex, newSum);
                    }else{
                        outputArray[outputArray.length - 1] += ` = ${newSum}`
                    }
                    
                    if(/^\d+$/.test(formattedArray[index])) {
                        
                        if(operator[0] === "-") {
                            outputArray[outputArray.length - 1] = `-${formattedArray[index]} + ${outputArray[outputArray.length - 1]}`
                        }else{
                            outputArray[outputArray.length - 1] = `${formattedArray[index]} + ${outputArray[outputArray.length - 1]}`
                        }
                    } else {
                        const additionString = formattedArray[index].replace(/\s=\s\d+$/, "");
                        if(operator[0] === "-") {
                            outputArray[outputArray.length - 1] = `-${additionString} + ${outputArray[outputArray.length - 1]}`
                        }else{
                            outputArray[outputArray.length - 1] = `${additionString} + ${outputArray[outputArray.length - 1]}`
                        }
                    }
                }
            } else if(!/^[+|-]$/.test(formattedArray[index])) {
            
                outputArray.push(`${element}`);
            }
        })

        const removedDubeOperators = outputArray.join(", ");
        return removedDubeOperators.replace(/\+\s-/g, "-");
    };

    const handleRoll = (event) => {
        event.preventDefault();
        updateDisplay((rollResult) => {
            const newObj = {};
            setDiceRoll((userInput) => {
                const regex = /\d+D\d+/ig;
                if(regex.test(userInput)) {
                    newObj.userInput = computeDiceRolls(userInput);
                    if(newObj.userInput === "undefined") {
                        newObj.userInput = "";
                    }
                }
                return "";
            })
            return newObj;
        })
    };

    return (
        <main id="display">
            <button id="instructions-button">
                <img draggable="false" id="question-mark" src="question-mark.svg" alt="question mark"></img>
            </button>
            <section id="instructions-box">
                <h4>How to use Impossible Dice</h4>
                <p>Rolls should be submitted in the format nDx where x is the number of sides of that dice and n is the number of that dice you wish to roll. Leave a space between seperate sets of dice rolls e.g nDx mDy. To perform addition or subraction add the operator between the dice rolls you wish to evalulate.</p>
            </section>
            <Tray rollResult={rollResult} updateDisplay={updateDisplay}/>
            <Field userInput={userInput} setDiceRoll={setDiceRoll} handleRoll={handleRoll}/>
        </main>
    )
}

export default Display;