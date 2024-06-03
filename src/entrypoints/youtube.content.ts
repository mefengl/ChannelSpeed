export default defineContentScript({
  matches: ['*://www.youtube.com/watch*'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      onMount: () => {
        const video = document.querySelector('video')
        if (video) {
          video.playbackRate = 2.0
        }
      },
    })

    ui.mount()
  },
})
