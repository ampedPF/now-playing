ALBUM=./data/np_album.txt
ARTIST=./data/np_artist.txt
TITLE=./data/np_title.txt

LONG_ALBUM="Black Mirror - White Bear (Original Television Soundtrack)"
LONG_ARTIST="League of Legends, The Crystal Method, Dada Life"
LONG_TITLE="The Lights in the Sky Are Our Guides"

NORM_ALBUM="Warsongs"
NORM_ARTIST="League of Legends, MitiS"
NORM_TITLE="The Boy Who Shattered Time"

.PHONY: clean
clean:
		echo > $(ALBUM) && echo > $(ARTIST) && echo > $(TITLE)
run server:
		http-server -o ./now-playing.html -c-1

norm normal start:
		echo $(NORM_ALBUM) > $(ALBUM) && echo $(NORM_ARTIST) > $(ARTIST) && echo $(NORM_TITLE) > $(TITLE)

nal normal_album album al:
		echo $(NORM_ALBUM) > $(ALBUM)

nar normal_artist artist ar:
		echo $(NORM_ARTIST) > $(ARTIST)

nti normal_title title ti:
		echo $(NORM_TITLE) > $(TITLE)


long:
		echo $(LONG_ALBUM) > $(ALBUM) && echo $(LONG_ARTIST) > $(ARTIST) && echo $(LONG_TITLE) > $(TITLE)

lal:
		echo $(LONG_ALBUM) > $(ALBUM)

lar:
		echo $(LONG_ARTIST) > $(ARTIST)

lti:
		echo $(LONG_TITLE) > $(TITLE)


