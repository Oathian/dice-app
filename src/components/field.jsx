const Field = ({ userInput, setDiceRoll, handleRoll}) => {

    return (
        <section id="field" onSubmit={handleRoll}>
            <form>
                <input autoComplete="off" value={userInput} onChange={(event) => setDiceRoll(event.target.value)} id="roll-input" />
                <button id="submit-roll">&gt;</button>
            </form>
        </section>
    )
}

export default Field;