const Field = ({ userInput, setDiceRoll, handleRoll}) => {

    return (
        <section id="field" onSubmit={handleRoll}>
            <form>
                <label>
                    <input value={userInput} onChange={(event) => setDiceRoll(event.target.value)} id="roll-input" />
                </label>
                <button id="submit-roll">&gt;</button>
            </form>
        </section>
    )
}

export default Field;