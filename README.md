<h2>Improved Twilio Call Request Inspector</h2>

_(if you know you want this, scroll below the 2 big images and you'll find loading instructions and contribution notes)_

Are you writing an IVR with Twilio? Awesome! Twilio is an amazeballs service, and in general their portal UI is fantastic. But if you are trying to work on a complicated IVR, you'll soon realize that you're going to be clicking. and clicking. and clicking. And then scanning through all the chaff, all the crap that doesn't change, trying to find the golden nuggets of "SpeechResult" or "Digits". This chrome extension does not remove the old request inspector. It's still there, but it inserts an alternative view of the same request information. One that quickly brings the info that you care about to the forefront. 

- It hides the domain, for 90% of users it is the same domain for every request. If not, you can tell by the path
- It shortens guids in the path. They're too damn long and you know it. 
- It makes `SpeechResults`, `Confidence`, and `Digits` first class citizens with their own columns for each row
- Want to see the response? Click on the path
- In the response, we hide `<?xml...>`, `<Response>`, and `</Response>`. These are redundant. We know it is xml. We know it is a response. I don't need to see it

<h4>What is annoying with current twilio request inspector</h4>

![what is annoying with current twilio request inspector](https://github.com/vongillern/twilio-call-request-inspector/blob/img-branch/images/bad%20twilio.jpg?raw=true)

<h4>What makes this chrome extension worth installing</h4>

![what makes this chrome extension worth installing](https://github.com/vongillern/twilio-call-request-inspector/blob/img-branch/images/good%20twilio%20extension.jpg?raw=true)

<h3>How to install or sideload</h3>
Google hasn't approved the extension just yet, I submitted it for review on 2020-08-06. Hell. It's probably in the extension store and I haven't updated this yet. Sorry. If you're a dev and you want it _now_ then: 

* clone this repo
* Browse to `chrome://extensions`
* in the upper right hand corner there is a "developer mode" switch. turn it on
* a new menu will slide down, one button will say "Load unpacked"
* select the directory you cloned this repo to

If you want to make tweaks, all the important stuff is in `script.js`. Please don't judge me on the code. It was very much "just make it work" dog shit. The easiest, and most likely thing you might want to change is what attributes (e.g. SpeechResult, Digits) are show in the table. There is an array called `careAboutParams`. So if you really care about "CallerCity", just add that to the array. **YOU MUST REFRESH THE CHROME EXTENSION IN ORDER FOR THIS TO TAKE EFFECT**. To do this, go back to `chrome://extensions`, find the extension and there is a refresh button in the lower right hand corner of the card. Some of you may notice a hot-reload.js file in the repo. There is theoretically a way to automagically reload extensions when you modify a file. However, this only works for extensions that load UI into their own frame. This is a content only extension, and hot reloading doesn't work (or at least I couldn't figure it out easily).

<h3>Want to contribute?</h3>

Things you can do to help:

1. if you work at twilio, nag the manager who owns call logs to invest in the debugging experience. You're all so dev focused in nearly everything you do. AFAICT, this is the **one** place you dropped the ball. Point them to this extension and be like "yo, brosef, surely we can do better if this extension can"
2. it would be convenient if there was a UI to _at runtime_ modify the `careAboutParams` (referenced in _How to install or sideload_). And also use chrome extension storage to persist this information for other page loads
3. I hate that the response box just appears out of nowhere. Normally I'd use jquery slideDown/slideUp, but it doesn't work on table content. I copied some code from SO to do this (`slideRow('up'), slideRow('down')`). But didn't complete it.
4. A UI item to hide HTTP GETs from the request log. In a different, less complicated IVR I use mp3s for speech instead of Amazon Polly. They kind of clutter the request log, it'd be nice if there was a checkbox at the top of the table to hide all GETs.
5. Physically mail me gold, silver or plutonium ingots. Untraceable Taiwanese Bearer Bonds will also be deemed acceptable.

