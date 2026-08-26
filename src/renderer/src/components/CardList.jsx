import React from 'react'
import Card from './card/Card'
import borderLarge from '../assets/images/borderLarge.png'

const CardList = ({ cards = [], onOpenCard, handlePageState }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-20">
      <div className="flex flex-col flex-wrap items-center justify-center gap-2">
        <p className="mb-5 text-center text-5xl text-white">Select the Card you want to explore</p>
        <img src={borderLarge} alt="borderLarge" />
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-10">
        {cards.map((card) => (
          <Card
            key={card.cardId}
            onClick={() => onOpenCard?.(card.cardId)}
            image={card.image}
            title={card.title}
            years={card.era}
          />
        ))}
      </div>
    </div>
  )
}

export default CardList
