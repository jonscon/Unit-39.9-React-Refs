/** Card: Renders the value and suit of a card. */
function Card({ value, suit }) {
    return (
        <div>{value} of {suit}</div>
    )
}

export default Card;