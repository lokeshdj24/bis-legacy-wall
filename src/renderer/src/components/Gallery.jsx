import React, { useEffect, useMemo, useState } from 'react'
import homeIcon from '../assets/images/home.png'
import borderLarge from '../assets/images/borderLarge.png'
import leftArrowIcon from '../assets/images/leftArrow.png'
import rightArrowIcon from '../assets/images/rightArrow.png'
import divider from '../assets/images/divider.png'

const BUTTON_GRADIENT =
  'bg-gradient-to-t from-[#E29715] from-0% to-[#FFFBB2] to-100% text-[#3A1825]'

const Gallery = ({ card, handlePageState }) => {
  const yearGroups = useMemo(() => card?.yearGroups || [], [card])
  const [yearIndex, setYearIndex] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    setYearIndex(0)
    setSlideIndex(0)
  }, [card?.cardId])

  if (!card || yearGroups.length === 0) {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-10 text-white">
        <p className="text-2xl text-[#FFCA1B]">No slides found for this card</p>
        <button
          type="button"
          onClick={() => handlePageState?.('list')}
          className={`${BUTTON_GRADIENT} rounded-lg px-5 py-2.5 font-semibold`}
        >
          Back to cards
        </button>
      </div>
    )
  }

  const safeYearIndex = Math.min(yearIndex, yearGroups.length - 1)
  const activeYear = yearGroups[safeYearIndex]
  const slides = activeYear.slides
  const safeSlideIndex = Math.min(slideIndex, Math.max(slides.length - 1, 0))
  const slide = slides[safeSlideIndex]

  const selectYear = (index) => {
    setYearIndex(index)
    setSlideIndex(0)
  }

  const goPrev = () => {
    setSlideIndex((i) => (i === 0 ? slides.length - 1 : i - 1))
  }

  const goNext = () => {
    setSlideIndex((i) => (i === slides.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 px-10">
      <article className="flex h-[44rem] w-[92%] max-w-[92%] overflow-hidden rounded-2xl border-2 border-[#FFCA1B] bg-[#0B1B3A]/80 p-12">
        <div className="relative h-full w-[65%] shrink-0 overflow-hidden rounded-xl bg-[#061225]">
          <img
            src={slide.image}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
          />
          <img
            src={slide.image}
            alt={slide.title}
            className="relative z-10 h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-1 flex-col justify-start gap-5 px-10">
          <p className="text-lg font-semibold uppercase tracking-[0.2em] text-[#FFCA1B]">
            {slide.eyebrow}
          </p>
          <h2 className="max-w-xl text-4xl font-bold leading-tight text-white">{slide.title}</h2>
          <img src={divider} alt="divider" />
          <p className="max-w-xl text-lg leading-relaxed text-white/90">{slide.description}</p>
        </div>
      </article>

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Previous image"
          onClick={goPrev}
          disabled={slides.length <= 1}
          className={`${BUTTON_GRADIENT} flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-2xl font-bold disabled:cursor-default disabled:opacity-50`}
        >
          <img src={leftArrowIcon} alt="leftArrowIcon" />
        </button>

        <div className="flex items-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={`${activeYear.year}-${index}`}
              type="button"
              aria-label={`Image ${index + 1} of ${slides.length}`}
              onClick={() => setSlideIndex(index)}
              className={`cursor-pointer rounded-full transition-all ${
                index === safeSlideIndex
                  ? 'h-2.5 w-10 bg-white'
                  : 'h-2.5 w-2.5 bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next image"
          onClick={goNext}
          disabled={slides.length <= 1}
          className={`${BUTTON_GRADIENT} flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-2xl font-bold disabled:cursor-default disabled:opacity-50`}
        >
          <img src={rightArrowIcon} alt="rightArrowIcon" />
        </button>
      </div>

      <div className="mt-2 flex flex-col items-center gap-4">
        <img src={borderLarge} alt="borderLarge" />
        <div className="flex flex-wrap items-center justify-center gap-6">
          {yearGroups.map((group, index) => {
            const isActive = index === safeYearIndex
            return (
              <button
                key={group.year}
                type="button"
                onClick={() => selectYear(index)}
                className={`cursor-pointer rounded-lg px-13 py-2 text-lg font-semibold transition-all ${
                  isActive ? BUTTON_GRADIENT : 'bg-transparent text-white hover:text-[#FFCA1B]'
                }`}
              >
                {group.year}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => handlePageState?.('home')}
        className={`${BUTTON_GRADIENT} absolute bottom-8 right-10 flex cursor-pointer items-center gap-2 rounded-lg px-6 py-2.5 font-semibold`}
      >
        <span aria-hidden="true">
          <img src={homeIcon} alt="homeIcon" />
        </span>
        Home
      </button>
    </div>
  )
}

export default Gallery
