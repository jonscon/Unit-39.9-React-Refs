import { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card.jsx";

const API_URL = 'https://deckofcardsapi.com/api/deck'

/** Deck: uses Deck API, allows user to draw one card at a time. */
function Deck() {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(function loadDeckFromAPI() {
        async function createDeck() {
            const deckResult = await axios.get(
                `${API_URL}/new/shuffle/?deck_count=1`
            );
            setDeck(deckResult.data.deck_id);
        }
        createDeck();
    }, [])
    

    async function drawCard() {
        try {
            const cardResult = await axios.get(
                `${API_URL}/${deck}/draw/?count=1`
            );

            if (cardResult.data.remaining === 0) throw new Error("No cards remaining!");

            const card = cardResult.data.cards[0];
            setCards(d => [
                ...d,
                {
                    id: card.code,
                    suit: card.suit,
                    value: card.value
                }
            ])
        } catch(err) {
            alert(err);
        }
    }

    /** Shuffle cards */
    async function startShuffling() {
        setIsShuffling(true);
        try {
            await axios.get(`${API_URL}/${deck}/shuffle`);
            setCards([]);
        } catch(err) {
            alert(err);
        } finally {
            setIsShuffling(false);
        }
    }

    /** Render draw button (disabled if shuffling) */
    function renderDrawButtonIfOk() {
        if (!deck) return null;

        return (
            <button
                className="Deck-button"
                onClick={drawCard}
                disabled={isShuffling}>
                Draw a Card!
            </button>
        )
    }

    /** Render shuffle button (disabled if shuffling) */
    function renderShuffleButtonIfOk() {
        if (!deck) return null;

        return (
            <button
                className="Deck-button"
                onClick={startShuffling}
                disabled={isShuffling}>
                Shuffle the Deck!
            </button>
        );
    }

    return (
        <div className="Deck">
            {renderDrawButtonIfOk()}
            {renderShuffleButtonIfOk()}

            <div className="Deck-cardlist">{cards.map(c => (
                <Card key={c.id} value={c.value} suit={c.suit}/>
            ))}</div>
        </div>
    )
}

export default Deck;