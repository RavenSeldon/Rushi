# Rushi soundtrack

Drop `.mp3`, `.m4a`, `.aac` or `.ogg` files here. The next build picks them up
automatically: the star appears in the header, the tracks play in filename
order as one looping playlist, and the music carries on across every star,
system and connection, and behind other tabs, until the star is pressed again.

Empty folder = no star at all. Nothing else to configure.

This is the Tale's player (SchroCivWeb), ported:

- **Order** is filename order, compared the Tale's way. Number your files
  `01_…`, `02_…`; to slot one between two, put a letter on the number:
  `04a_…` plays after `04_…` and before `05_…`.
- **Names** use only letters, digits, dots, dashes and underscores. Anything
  else is skipped, and the browser console says so. A `.wav` or `.flac` is not
  an accepted format and is ignored.
- **Looping:** after the last track the first returns three seconds later
  (`REST` in `src/lib/soundtrack.js`; set it to `0` for no pause).
- **Memory:** a reload resumes exactly where it was. Close the tab and come back
  within ten minutes and the place is held; press the star to continue.
- **Volume** defaults to 40%: `VOLUME` in `src/lib/soundtrack.js`.

## Converting files (optional)

The Tale's conversion makes small, cleanly named files. On your Mac, with every
track you want in one folder, in order:

```bash
brew list ffmpeg >/dev/null 2>&1 || brew install ffmpeg
SOURCE=~/Music/rushi-originals          # <-- every track, not just new ones
[ -n "$SOURCE" ] && [ -d "$SOURCE" ] && [ -n "$(ls -A "$SOURCE" 2>/dev/null)" ] || {
  echo "STOP: SOURCE is unset, missing, or empty -- nothing was changed."; return 2>/dev/null || exit 1; }
cd ~/Root/rushi/src/assets/audio
find . -maxdepth 1 -name '*.m4a' -delete      # rebuilt from SOURCE below
n=1
for f in "$SOURCE"/*; do
  case "$f" in *.md|*.txt|*/.*) continue;; esac
  name=$(basename "${f%.*}" | tr '[:upper:] ' '[:lower:]_' | tr -cd 'a-z0-9._-')
  ffmpeg -y -loglevel error -i "$f" -vn -c:a aac -b:a 64k -ar 44100 \
         -af "lowpass=f=15000" -movflags +faststart \
         "$(printf '%02d' $n)_${name}.m4a" && n=$((n+1))
done
ls -lh
```

Then `npm run dev` to listen, and `npm run deploy` to publish.
