import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function App() {
  const [defaultPlaybackRate, setDefaultPlaybackRate] = useState('1')

  useEffect(() => {
    const fetchDefaultPlaybackRate = async () => {
      const savedDefaultPlaybackRate = await storage.getItem<string>('sync:defaultPlaybackRate') || '1'
      setDefaultPlaybackRate(savedDefaultPlaybackRate)
    }
    fetchDefaultPlaybackRate()
  }, [])

  const handleSave = (rate: string) => {
    setDefaultPlaybackRate(rate)
    storage.setItem('sync:defaultPlaybackRate', rate)
    storage.setItem('local:data-playback-rate-change-from-popup', 'true')
  }

  const playbackRates = ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2']

  return (
    <div className="w-96 p-4">
      <label htmlFor="playbackRate" className="mb-2 block text-lg font-medium text-gray-700">Default Playback Rate:</label>
      <div id="playbackRate" className="grid grid-cols-4 gap-2">
        {playbackRates.map(rate => (
          <Button
            key={rate}
            onClick={() => handleSave(rate)}
            className={cn(
              'bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white',
              defaultPlaybackRate === rate && 'bg-blue-600 text-white',
            )}
          >
            {rate}
            x
          </Button>
        ))}
      </div>
    </div>
  )
}

export default App
