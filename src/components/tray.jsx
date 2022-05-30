const Tray = ({ rollResult }) => {
    return (
        <section id="tray">
            <p>{rollResult.userInput === ""?rollResult.userInput:""}</p>
            <p id="output">{rollResult.userInput}</p>
        </section>
    )
}

export default Tray;