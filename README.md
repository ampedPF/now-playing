# Now Playing

This widget displays currently playing song with information fetched by [Tuna 1.5.1](https://obsproject.com/forum/resources/tuna.843/) plugin for OBS 26.0.

Its style and animation can be tinkered with right from the browser source properties window in OBS.

## Preview

https://streamable.com/its9om

## File location

| Field  | Path |
| ------------- | ------------- |
| Title | ./data/np_title.txt |
| Artist | ./data/np_artist.txt |
| Album | ./data/np_album.txt |
| Cover | ./data/np_cover.png |

## Installation

After installing the OBS plugin [Tuna v1.5.1](https://obsproject.com/forum/resources/tuna.843/) following the steps described [here](https://obsproject.com/forum/resources/tuna.843/).

1. Add a new browser source
2. Check the "Local file" checkbox and then browse to the ```now-playing.html``` file
3. Set Width to ```1000```
4. Set Height to ```240``` (or ```200``` if you don't want to show the previous song info located at the bottom by default)
5. <details>
    <summary>Copy this to the Custom CSS panel</summary>
  
    ```css
    /*:::::::        Default OBS custom css value        :::::::*/
    body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }

    /*:::::::  Previous/current display order and style  :::::::*/
    #div-current { order: 0 }       /* 0: Top row */
    #div-previous-row { order: 1; } /* 1: Bottom row */
    /* Set 'opacity' to 0 in order to disable completely the "previous track" feature */
    #div-previous-row {  background-color: #121212dd; opacity: 1; }

    /*:::::::        Cover/song info display order       :::::::*/
    #div-cover { order: 0; }  /* 0: Left side | 1: Right side */

    /*:::::::      Song info display order and style     :::::::*/
    #div-title { order: 0; }  /* 0: Top row */
    #div-artist { order: 1; } /* 1: Middle row */
    #div-album { order: 2; }  /* 2: Bottom row */
    /* Set margin-left to none: Align left | auto: Align right */
    #title, #artist, #album { margin-left: none; }
    /* Set background color */
    #div-song>div { background-color: #121212; }
    /* Set Shadow that covers the text when it scrolls out */
    #div-song { box-shadow: inset -19px 0px 3px -3px #121212, inset 19px 0px 3px -3px #121212; }

    /*::::::: Previous song info display order and style :::::::*/
    /* Set margin-left to none: Align left | auto: Align right */
    #div-previous-prefix { margin-left: none; order: 0; } /* 0: Left side */
    #div-previous { order: 1; } /* 1: Right side */

    /*:::::::           Intro/outro animation            :::::::*/
    /* Pick from: none | fadeIn | slideInUp | slideInDown | slideInRight | slideInLeft */
    .animateIn { animation: slideInRight 0.5s; }

    /* Pick from: none | fadeOut | slideOutUp | slideOutDown | slideOutRight | slideOutLeft */
    .animateOut { animation: slideOutDown 0.5s; }

    /* You can briefly display the widget by queuing 2 of the above animations with "hold [duration] [delay]" in-between */
    /* Note: Comment the 2 animations above before uncommenting the one below */
    /* The delay of the hold animation should be the duration of the first one. */
    /* The delay of the second animation should be the sum of the duration and delay of the hold one. */
    /* .animateIn { animation: slideInRight 0.5s, hold 4.5s 0.5s, slideOutDown 0.5s 5s; } */
    ```

</details>

6. Check the "Refresh browser when scene becomes active" checkbox
7. Click OK

## Customizing the widget from OBS properties

### Default OBS custom css value (leave as is)

```css
body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
```

### Previous/current display order and style

```css
#div-current { order: 0 }       /* 0: Top row */
#div-previous-row { order: 1; } /* 1: Bottom row */
```

Set ```opacity``` to ```0``` in order to disable completely the "previous track" feature

```css
#div-previous-row {  background-color: #121212dd; opacity: 1; }
```

### Cover/song display order

```css
#div-cover { order: 0; }  /* 0: Left side | 1: Right side */
```

## Song info display order and style

```css
#div-title { order: 0; }  /* 0: Top row */
#div-artist { order: 1; } /* 1: Middle row */
#div-album { order: 2; }  /* 2: Bottom row */
```

Set ```margin-left``` to ```none```: Align left | ```auto```: Align right

```css
#title, #artist, #album { margin-left: none; }
```

Set background color

```css
#div-song>div { background-color: #121212; }
```

Set Shadow that covers the text when it scrolls out

```css
#div-song { box-shadow: inset -19px 0px 3px -3px #121212, inset 19px 0px 3px -3px #121212; }
```

## Previous song info order and style

```css
/*:::::::previous song info order and style:::::::*/
/* Set margin-left to none: Align left | auto: Align right */
#div-previous-prefix { margin-left: none; order: 0; } /* 0: Left side */
#div-previous { order: 1; } /* 1: Right side */
```

## Intro/outro animation

Pick from: ```none``` | ```fadeIn``` | ```slideInUp``` | ```slideInDown``` | ```slideInRight``` | ```slideInLeft```

```css
.animateIn { animation: slideInRight 0.5s; }
```

Pick from: ```none``` | ```fadeOut``` | ```slideOutUp``` | ```slideOutDown``` | ```slideOutRight``` | ```slideOutLeft```

```css
.animateOut { animation: slideOutDown 0.5s; }
```

You can briefly display the widget by queuing 2 of the above animations with "```hold [duration] [delay]```" in-between.

Note:

- Comment the 2 animations above before uncommenting the one below
- The delay of the hold animation should be the duration of the first one.
- The delay of the second animation should be the sum of the duration and delay of the hold one.

```css
.animateIn { animation: slideInRight 0.5s, hold 4.5s 0.5s, slideOutDown 0.5s 5s; }
```

<details>

<summary>Dev</summary>

    ## Dev Only: Make Usage

    Make sure you have [nodejs](https://nodejs.org/en/download/) v12.14.1 or up

    Then install http-server globally with

    ```console
    npm install -g http-server
    ```

    Finally start the server and load the project with

    ```console
    make run
    ```

    Tuna format for json output
    ```json
    {
        "artist": "%m",
        "album": "%a",
        "disc_number": "%d",
        "full_release_date": "%r",
        "release_year": "%y",
        "song_label": "%b",
        "song_progress": "%p",
        "song_length": "%l",
        "time_left": "%o",
        "title": "%t",
        "track_number": "%n",
    }
    ```

    uncomment the custom.css line in now-playing.html to test before pasting in obs
</details>
