# Now Playing

This widget displays currently playing song with information fetched by [Tuna](https://obsproject.com/forum/resources/tuna.843/) plugin for OBS 26.0.

Using [Snip](https://github.com/dlrudie/Snip) to fetch and store the song informtation to local files, it should be working with StreamlabsOBS (and any streaming application allowing browser sources).

Its style and animation can be tinkered with right from the browser source properties window in OBS.

## Preview

![preview](./preview.png)

## Configuration

Edit ```config.json``` to configure the widget.

### Fetching info from Tuna Webserver

Starting with Tuna plugin version 1.5.2, it now allow hosting song information on local webserver which default port is ```1608```.
Just make sure to check the checkbox on the Basics tab in Tuna settings window.

```json
"updateRefreshRate": 500,
"loadInfoFromServer": true,
"tunaServerAddr": "http://localhost:1608",
```

### File location

Tuna, like Snip, can also store the song information in local files. This projects assumes by default that these are stored at the following filepaths.

```json
"filepaths": {
    "artist": "./data/np_artist.txt",
    "album": "./data/np_album.txt",
    "title": "./data/np_title.txt",
    "cover": "./data/np_cover.png"
},
```

### Configuring the scrolling behaviour

```json
"songinfo": {
    "maxLength": {
        "artist": 35,
        "album": 50,
        "title": 30,
        "previous": 38
    },
    "scrollingDelay": 1500
},
```

## Installation steps

After installing the OBS plugin [Tuna v1.5.1](https://obsproject.com/forum/resources/tuna.843/) or later following the steps described [here](https://obsproject.com/forum/resources/tuna.843/).

1. Add a new browser source
2. Check the "Local file" checkbox and then browse to the ```now-playing.html``` file
3. Set Width to ```1000```
4. Set Height to ```240``` (or ```200``` if you don't want to show the previous song info located at the bottom by default)
5. <details>
    <summary>Expand this block and copy its content the to the Custom CSS panel</summary>
  
    ```css
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

    /*:::::::                        Default OBS custom css value                        :::::::*/
    body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }

    /*:::::::                             Text fields fonts                              :::::::*/
    /* Imported font with the @import above */
    #previous, #div-previous-prefix {
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
        font-family: "Roboto", sans-serif; }

    #title    {
        color: #ffffff;
        font-size: 48px;
        font-weight: bold;
        font-family: "Helvetica Neue", sans-serif; }

    #artist   {
        color: #707070;
        text-transform: uppercase;
        font-size: 36px;
        font-weight: bold;
        font-family: "Helvetica Neue", sans-serif; }
    
    #album    {
        color: #7b7ba7;
        font-size: 32px;
        font-weight: bold;
        font-family: "Roboto", sans-serif; }

    #duration-current,
    #duration-total {
        color: #707070;
        font-size: 18px;
        font-weight: bold;
        font-family: "Roboto", sans-serif;
    }

    /*:::::::                  Previous/current display order and style                  :::::::*/
    #div-current      { order: 0; }  /* 0: Top row    */
    #div-previous-row { order: 1; }  /* 1: Bottom row */
    /* Set widget background color */
    #div-current      { background-color: #121212; }
    #div-previous-row { background-color: #121212; }
    /* Set 'display' to none in order to disable completely the "previous track" feature.
       Default value is 'inherit'. */
    #div-progress { display: inherit; }

    /*:::::::                        Cover/song info display order                       :::::::*/
    #div-cover    { order: 0; }  /* 0: Left side | 1: Right side */
    #div-cover    { background-color: #121212; }
    

    /*:::::::                      Song info display order and style                     :::::::*/
    #div-title    { order: 0; }  /* 0: Top row           */
    #div-artist   { order: 1; }  /* 1: First middle row  */
    #div-album    { order: 2; }  /* 2: Second middle row */
    #div-duration { order: 3; }  /* 3: Bottom row        */
    /* Set margin-left to none: Align left | auto: Align right */
    #title, #artist, #album { margin-left: none; }
    /* Set background color */
    #div-song>div { background-color: #121212; }
    /* Set Shadow that covers the text when it scrolls in and out */
    #div-song     { box-shadow: inset -19px 0px 3px -3px #121212,
                                inset 19px 0px 3px -3px #121212; }

    /*:::::::                                 Widget style                                :::::::*/
    /* Set up the widget's rounded border. e.g. 25px */
    /* It'll automatically apply to the previous row */
    #div-current { border-radius: 0px; } 
    /*:::::::                                 Cover style                                :::::::*/
    /* Set up the cover's size; e.g height: 80%;
       and rounded border.      e.g border-radius: 25px; */
    #cover { height: 100%; width: 100%; border-radius: 0px; } 

    /*:::::::                             Progress bar style                             :::::::*/
    #div-progress { background-color: #535353 !important; }
    #div-bar      { background-color: #b3b3b3; }
    /* Set to 'scaleX(-1)' to make the progress bar go from right to left.
       Default is left to right */
    #div-progress { transform: scaleX(1); }
    /* Set 'display' to 'none' in order to disable completely the "progress bar" feature.
       Default value is 'inherit'. */
    #div-progress { display: inherit; }

    /*:::::::                             Duration style                             :::::::*/
    /* Set to row-reverse do display total duration on the left side and current duration
    on the right side.
    Default value is : 'row'. */
    #div-duration-row { flex-direction: row; }
    /* Set to 'none' in order to disable completely the "duration row" feature.
       Default value is 'flex'. */
    #div-duration-row { display: flex; }

    /*:::::::                 Previous song info display order and style                 :::::::*/
    /* Set margin-left to none: Align left | auto: Align right */
    #div-previous-prefix { margin-left: none; order: 0; } /* 0: Left side */
    #div-previous        { order: 1; }                    /* 1: Right side */

    /*:::::::                           Intro/outro animation                            :::::::*/
    /* Pick from: none | fadeIn | slideInUp | slideInDown | slideInRight | slideInLeft */
    .animateIn    { animation: slideInRight 0.5s; }

    /* Pick from: none | fadeOut | slideOutUp | slideOutDown | slideOutRight | slideOutLeft */
    .animateOut   { animation: slideOutDown 0.5s; }

    /* You can briefly display the widget by queuing 2 of the above animations in .animateIn
       with "hold [duration] [delay]" in-between
       Note: Comment the 2 animations above before uncommenting the one below.
       The delay of the hold animation should be the duration of the first one.
       The delay of the second animation should be the sum of the duration and delay of the hold one. */
    /* .animateIn { animation: slideInRight 0.5s, hold 4.5s 0.5s, slideOutDown 0.5s 5s; } */
    ```

    </details>
6. Check the "Refresh browser when scene becomes active" checkbox
7. Click OK

## Customizing the widget from OBS properties

### Import fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
```

### Default OBS custom css value (leave as is)

```css
body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
```

### Text fields fonts

The google font is imported font with the ```@import``` above

```css
#previous, #div-previous-prefix {
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
    font-family: "Roboto", sans-serif; } 

#title {
    color: #ffffff;
    font-size: 48px;
    font-weight: bold;
    font-family: "Helvetica Neue", sans-serif; }

#artist {
    color: #707070;
    text-transform: uppercase;
    font-size: 36px;
    font-weight: bold;
    font-family: "Helvetica Neue", sans-serif; }

#album {
    color: #7b7ba7;
    font-size: 32px;
    font-weight: bold;
    font-family: "Roboto", sans-serif; }

#duration-current,
#duration-total {
    color: #707070;
    font-size: 18px;
    font-weight: bold;
    font-family: "Roboto", sans-serif;
}
```

### Previous/current display order and style

```css
#div-current      { order: 0; }  /* 0: Top row */
#div-previous-row { order: 1; } /* 1: Bottom row */
```

Set widget background color.

```css
#div-current      { background-color: #121212; }
#div-previous-row { background-color: #121212; }
```

Set ```display``` to ```none``` in order to disable completely the "previous track" feature. </br>
Default value is ```inherit```.

```css
#div-previous-row { display: 1; }
```

### Cover/song display order

```css
#div-cover    { order: 0; }  /* 0: Left side | 1: Right side */
#div-cover    { background-color: #121212; }
```

```css
#cover { height: 100%; width: 100%; border-radius: 0px; }
```

### Song info display order and style

```css
#div-title    { order: 0; }  /* 0: Top row           */
#div-artist   { order: 1; }  /* 1: Middle row        */
#div-album    { order: 2; }  /* 2: Second middle row */
#div-progress { order: 3; }  /* 3: Bottom row        */
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
#div-song { box-shadow: inset -19px 0px 3px -3px #121212,
                        inset 19px 0px 3px -3px #121212; }
```

### Widget style

Set up the widget's rounded border. e.g. 25px
It'll automatically apply to the previous row

```css
#div-current { border-radius: 0px; }
```

### Cover style

Set up the cover's size; e.g `height: 80%;`
and rounded border.      e.g `border-radius: 25px;`

```css
#cover { height: 100%; width: 100%; border-radius: 0px; }
```

### Progress bar style

```css
#div-progress { background-color: #535353 !important; }
#div-bar      { background-color: #b3b3b3; }
```

Set to 'scaleX(-1)' to make the progress bar go from right to left.
Default is `scaleX(1)` for left to right

```css
#div-progress { transform: scaleX(1); }
```

Set to  `none` in order to disable completely the "progress bar" feature.
Default value is `inherit`.

```css
#div-progress { display: inherit; }
```

### Duration style

Set to `row-reverse` do display total duration on the left side and current duration
on the right side.
Default value is : `row`.

```css
#div-duration-row { flex-direction: row; }
```

Set to `none` in order to disable completely the "duration row" feature.
Default value is `flex`.

```css
#div-duration-row { display: flex; }
```

### Previous song info order and style

Set margin-left to ```none```: Align left | ```auto```: Align right

```css
#div-previous-prefix { margin-left: none; order: 0; } /* 0: Left side */
#div-previous        { order: 1; }                    /* 1: Right side */
```

### Intro/outro animation

Pick from: ```none``` | ```fadeIn``` | ```slideInUp``` | ```slideInDown``` | ```slideInRight``` | ```slideInLeft```

```css
.animateIn  { animation: slideInRight 0.5s; }
```

Pick from: ```none``` | ```fadeOut``` | ```slideOutUp``` | ```slideOutDown``` | ```slideOutRight``` | ```slideOutLeft```

```css
.animateOut { animation: slideOutDown 0.5s; }
```

You can briefly display the widget by queuing 2 of the above animations in ```.animateIn``` with "```hold [duration] [delay]```" in-between.

Note:

- Comment the 2 animations above before uncommenting the one below
- The delay of the hold animation should be the duration of the first one.
- The delay of the second animation should be the sum of the duration and delay of the hold one.

```css
.animateIn { animation: slideInRight 0.5s, hold 4.5s 0.5s, slideOutDown 0.5s 5s; }
```
