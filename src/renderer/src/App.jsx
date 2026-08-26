import { useEffect, useState } from 'react'
import Home from './components/Home'
import CardList from './components/CardList'
import Gallery from './components/Gallery'

// pageState: home | list | carousel

function App() {
  const [pageState, setPageState] = useState('home')
  const [cards, setCards] = useState([])
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [contentError, setContentError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        if (!window.api?.getContent) {
          throw new Error('Content API is not available')
        }
        const result = await window.api.getContent()
        if (cancelled) return
        if (!result.ok) {
          setContentError(result.error || 'Failed to load content')
          setCards([])
        } else {
          setContentError(null)
          setCards(result.cards || [])
        }
      } catch (err) {
        if (!cancelled) {
          setContentError(err?.message || 'Failed to load content')
          setCards([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handlePageState = (state) => {
    setPageState(state)
  }

  const openCard = (cardId) => {
    setSelectedCardId(cardId)
    setPageState('carousel')
  }

  const selectedCard = cards.find((c) => c.cardId === selectedCardId) || null

  if (loading) {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center bg-[url('../assets/images/bg.png')] bg-cover bg-center text-xl text-white">
        Loading legacy wall content…
      </div>
    )
  }

  if (contentError) {
    return (
      <div className="flex h-[100vh] w-full flex-col items-center justify-center gap-4 bg-[url('../assets/images/bg.png')] bg-cover bg-center px-10 text-center text-white">
        <p className="text-2xl font-semibold text-[#FFCA1B]">Could not load content</p>
        <p className="max-w-2xl whitespace-pre-wrap text-base text-white/90">{contentError}</p>
      </div>
    )
  }

  return (
    <div className="flex h-[100vh] w-[100%] items-center justify-center border border-black bg-[url('../assets/images/bg.png')] bg-cover bg-center">
      {pageState === 'home' && <Home handlePageState={handlePageState} />}
      {pageState === 'list' && (
        <CardList cards={cards} onOpenCard={openCard} handlePageState={handlePageState} />
      )}
      {pageState === 'carousel' && (
        <Gallery card={selectedCard} handlePageState={handlePageState} />
      )}
    </div>
  )
}

export default App
