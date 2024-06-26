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
              video.setAttribute('data-playback-rate-change', 'true')
              video.playbackRate = Number.parseFloat(savedPlaybackRate)
              setTimeout(() => {
                video.removeAttribute('data-playback-rate-change')
              }, 3000)
            }
            else {
              const defaultPlaybackRate = await storage.getItem<string>('sync:defaultPlaybackRate') || '1'
              video.setAttribute('data-playback-rate-change', 'true')
              video.playbackRate = Number.parseFloat(defaultPlaybackRate)
              setTimeout(() => {
                video.removeAttribute('data-playback-rate-change')
              }, 3000)
            }

            if (!video.hasAttribute('data-ratechange-listener')) {
              video.addEventListener('ratechange', async () => {
                const video = document.querySelector('video')
                if (!video)
                  return
                if (video.hasAttribute('data-playback-rate-change'))
                  return
                const channel = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string')?.textContent || 'default'
                storage.setItem(`sync:playbackRate-${channel}`, video.playbackRate.toString())
              })
              video.setAttribute('data-ratechange-listener', 'true')
            }
          }
        }

        setInterval(applyPlaybackRate, 1000)
      },
    })

    ui.mount()
  },
})
