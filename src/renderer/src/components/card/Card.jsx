import React from 'react'

const Card = ({
  image = '',
  title = 'Card Title',
  years = '1946 - 1950',
  onClick
}) => {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.(e)
      }}
      className="relative h-60 w-[30rem] cursor-pointer overflow-hidden rounded-2xl border-2 border-[#E8C547]"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundColor: '#0B1B3A',
        backgroundSize: 'cover',
        backgroundPosition: 'left center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent from-35% via-[#0B1B3A]/90 via-55% to-[#0B1B3A] to-70%" />

      <div className="relative z-10 flex h-full w-full items-center justify-end pr-10">
        <div className="flex w-56 flex-col items-center text-center uppercase">
          <h2 className="text-2xl font-bold tracking-wide text-white">{title}</h2>
          <p className="mt-3 font-semibold text-lg tracking-wider text-[#E8C547]">{years}</p>
        </div>
      </div>
    </article>
  )
}

export default Card
