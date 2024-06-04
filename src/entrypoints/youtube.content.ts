export default defineContentScript({
  matches: ['*://www.youtube.com/watch*'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      onMount: async () => {
        const applyPlaybackRate = async () => {
          const video = document.querySelector('video')
          if (video) {
            const channel = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string')?.textContent || 'default'

            const savedPlaybackRate = await storage.getItem<string>(`sync:playbackRate-${channel}`)
            if (savedPlaybackRate) {
              video.playbackRate = Number.parseFloat(savedPlaybackRate)
            }
            else {
              const defaultPlaybackRate = await storage.getItem<string>('sync:defaultPlaybackRate') || '1'
              video.playbackRate = Number.parseFloat(defaultPlaybackRate)
            }

            video.addEventListener('ratechange', () => {
              storage.setItem(`sync:playbackRate-${channel}`, video.playbackRate.toString())
            })
          }
        }

        setInterval(applyPlaybackRate, 1000)
      },
    })

    ui.mount()
  },
})
