# LYRA Motion Studio

Lyric and video editor with word timing, animated typography, audio sync, media layers and MP4 export.

Live site: https://hoavuoott.github.io/Lyra/

## Development and deployment

The files in the repository root are the application source and the files served by GitHub Pages. There is no build step or `dist` directory. Edit these files and push to the publishing branch to update the site.

Serve the root with a static HTTP server for local preview. Keep asset paths relative so the app works under `/Lyra/` on GitHub Pages.

Run the regression tests with Node.js:

```sh
node --test tests/*.test.cjs
```

Project data and imported media are stored in the browser. Use **Lưu dự án** to save a portable project file containing media; opening the site on another origin does not transfer browser-local projects automatically.

Third-party library licenses are in `vendor/NOTICE.txt` and the accompanying license files.
