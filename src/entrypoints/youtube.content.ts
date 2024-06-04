export default defineContentScript({
  matches: ['*://www.youtube.com/watch*'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      onMount: async () => {
        const appliedVideos = new WeakSet<HTMLVideoElement>()

        const applyPlaybackRate = async () => {
          const video = document.querySelector('video')
          const channel = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string')?.textContent || 'default'

          if (video) {
            // Restore playback rate
            const savedPlaybackRate = await storage.getItem<string>(`sync:playbackRate-${channel}`)
            const defaultPlaybackRate = await storage.getItem<string>('sync:defaultPlaybackRate') || '1'

            // Temporarily remove onratechange event listener
            const originalOnRateChange = video.onratechange
            video.onratechange = null

            video.playbackRate = savedPlaybackRate
              ? Number.parseFloat(savedPlaybackRate)
              : Number.parseFloat(defaultPlaybackRate)

            // Restore the onratechange event listener only once
            if (!appliedVideos.has(video)) {
              video.addEventListener('ratechange', () => {
                storage.setItem(`sync:playbackRate-${channel}`, video.playbackRate.toString())
              })
              appliedVideos.add(video)
            }

            // Restore original onratechange if it was not already set by us
            video.onratechange = originalOnRateChange
          }
        }

        setInterval(applyPlaybackRate, 1000)
      },
    })

    ui.mount()
  },
})
