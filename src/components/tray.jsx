const Tray = ({ rollResult, updateDisplay }) => {

    const clearOutput = () => {
        updateDisplay((rollResult) => {
            let emptyObj = {...rollResult};
            emptyObj.userInput = "";
            return emptyObj;
        })
    }

    return (
        <section id="tray">
            <>
                {/\d+/i.test(rollResult.userInput)?<h3 id="you-rolled">You rolled</h3>:""}
            </>
            <>
                <p id="output">{rollResult.userInput}</p>
            </>
            <>
                <button onClick={() => clearOutput()} id="tray-bin">Bin</button>
            </>
        </section>
    )
}

export default Tray;