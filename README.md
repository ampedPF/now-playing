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


## Animations

```css
.animateIn { animation: slideInRight 0.5s; } /* fadeIn, slideInUp, slideInDown, slideInRight, slideInLeft */
.animateOut { animation: slideOutRight 0.5s; } /* fadeOut, slideOutDown, slideOutUp, slideOutLeft, slideOutRight */
```

To briefly display the widget at the beginning of the song, use this format:

```css
.animateIn { animation: slideInRight 0.5s, hold 4.5s 0.5s, slideOutUp 0.5s 5s; }
.animateOut { animation: none }
```

