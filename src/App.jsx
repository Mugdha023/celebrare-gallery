
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import useFetchPhotos from './hooks/useFetchPhotos'

function getInitialFavourites() {
  try {
    const saved = localStorage.getItem('celebrare-favourites')
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const exists = state.some(
        (photo) => photo.id === action.photo.id
      )

      return exists
        ? state.filter((photo) => photo.id !== action.photo.id)
        : [...state, action.photo]
    }
    default:
      return state
  }
}

function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  )
}

function App() {
  const { photos, loading, error } = useFetchPhotos()
  const [searchTerm, setSearchTerm] = useState('')

  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    getInitialFavourites
  )

  useEffect(() => {
    try {
      localStorage.setItem(
        'celebrare-favourites',
        JSON.stringify(favourites)
      )
    } catch {
      // Keep the gallery usable if browser storage is unavailable.
    }
  }, [favourites])

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) return photos

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    )
  }, [photos, searchTerm])

  const toggleFavourite = (photo) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', photo })
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#28251f]">
      {/* Brand header */}
      <header className="border-b border-[#e9e2d9]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-10 lg:px-16">
          <a href="#gallery" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#762d3b] font-serif text-xl text-white">
              c
            </span>
            <span className="font-serif text-2xl tracking-tight">
              celebrare<span className="text-[#a34c59]">.</span>
            </span>
          </a>

          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#82786d] sm:text-xs">
            The photo journal
          </span>
        </div>
      </header>

      {/* Editorial hero */}
      <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-14 sm:px-10 sm:pb-16 sm:pt-20 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#a34c59]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a34c59] sm:text-xs">
                A collection of moments
              </p>
            </div>

            <h1 className="max-w-3xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Every frame
              <br />
              tells a <span className="italic text-[#a34c59]">story.</span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#797167] sm:text-base">
              A little corner of the internet to discover beautiful
              photographs, meet their creators, and keep the
              moments that stay with you.
            </p>
          </div>

          <div className="flex items-end gap-6 border-t border-[#e3d9ce] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="font-serif text-4xl">
                {photos.length.toString().padStart(2, '0')}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.17em] text-[#82786d]">
                Photographs
              </p>
            </div>
            <div className="h-12 w-px bg-[#e3d9ce]" />
            <div>
              <p className="font-serif text-4xl">
                {favourites.length.toString().padStart(2, '0')}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.17em] text-[#82786d]">
                Saved hearts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery and search */}
      <section
        id="gallery"
        className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-10 lg:px-16"
      >
        <div className="mb-7 flex flex-col gap-5 border-y border-[#e3d9ce] py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-2xl">The collection</p>
            <p className="mt-1 text-xs text-[#82786d]">
              Discover something worth remembering.
            </p>
          </div>

          <div className="w-full sm:max-w-sm">
            <label
              htmlFor="author-search"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.17em] text-[#82786d]"
            >
              Find a photographer
            </label>

            <div className="flex items-center gap-3 border-b border-[#cfc3b6] pb-3 transition-colors focus-within:border-[#a34c59]">
              <span className="text-[#a34c59]">
                <SearchIcon />
              </span>
              <input
                id="author-search"
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by author name..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa095]"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div
            className="flex min-h-64 flex-col items-center justify-center"
            role="status"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#e3d9ce] border-t-[#a34c59]" />
            <p className="mt-5 text-sm text-[#82786d]">
              Gathering beautiful moments...
            </p>
          </div>
        ) : error ? (
          <div
            className="border border-[#e3d9ce] bg-white px-6 py-14 text-center"
            role="alert"
          >
            <p className="font-serif text-2xl">A little pause.</p>
            <p className="mt-3 text-sm text-[#a34c59]">{error}</p>
            <p className="mt-2 text-sm text-[#82786d]">
              Check your connection and refresh the page.
            </p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="border border-dashed border-[#d8cbbf] px-6 py-16 text-center">
            <p className="font-serif text-2xl">No frames found.</p>
            <p className="mt-3 text-sm text-[#82786d]">
              Try another photographer's name.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
            {filteredPhotos.map((photo, index) => {
              const isFavourite = favourites.some(
                (item) => item.id === photo.id
              )

              return (
                <article key={photo.id} className="group min-w-0">
                  <div className="relative overflow-hidden bg-[#eee7df]">
                    <img
                      src={`https://picsum.photos/id/${photo.id}/400/500`}
                      alt={`Photograph by ${photo.author}`}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />

                    <button
                      type="button"
                      onClick={() => toggleFavourite(photo)}
                      aria-label={
                        isFavourite
                          ? `Remove photo by ${photo.author} from favourites`
                          : `Add photo by ${photo.author} to favourites`
                      }
                      aria-pressed={isFavourite}
                      className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a34c59] ${
                        isFavourite
                          ? 'bg-[#762d3b] text-white shadow-md'
                          : 'bg-[#faf8f5]/95 text-[#55483e] hover:bg-white'
                      }`}
                    >
                      <HeartIcon filled={isFavourite} />
                    </button>

                    <span className="absolute bottom-3 left-3 bg-[#faf8f5]/90 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#55483e]">
                      No. {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 border-b border-[#e3d9ce] py-4">
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a34c59]">
                        Photographer
                      </p>
                      <h2 className="mt-1 truncate font-serif text-lg">
                        {photo.author}
                      </h2>
                    </div>
                    <span
                      className={`mt-2 shrink-0 text-[10px] uppercase tracking-wider ${
                        isFavourite ? 'text-[#a34c59]' : 'text-[#a69a8d]'
                      }`}
                    >
                      {isFavourite ? 'Saved ♥' : 'Gallery'}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-[#e3d9ce]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <p className="font-serif text-lg">
            celebrare<span className="text-[#a34c59]">.</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#82786d]">
            Made for the love of photography
          </p>
        </div>
      </footer>
    </main>
  )
}

export default App
