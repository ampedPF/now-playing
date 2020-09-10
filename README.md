# Now Playing

## File location

| Field  | Path |
| ------------- | ------------- |
| Title | ./data/np_title.txt |
| Artist | ./data/np_artist.txt |
| Album | ./data/np_album.txt |
| Cover | ./data/np_cover.png |

## Custom CSS in OBS properties

### Background color

```css
body { background-color: #121212; margin: 0px auto; overflow: hidden; }
```

### Set Cover on the right side

```css
#div-cover { order: 0; }  /* 0: left side | 1: right side */
```

## Reorder fields

```css
#div-title { order: 0; }  /* top row */
#div-artist { order: 1; } /* middle row */
#div-album { order: 2; }  /* bottom row */
```

## Align fields to the right side

```css
#div-title, #div-artist, #div-album { margin-left: auto; } /* align fields to the right side */
```
