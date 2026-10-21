CAE QUEST — installable app
===========================

WHAT THIS IS
An installable version of the map. People add it to their phone's home
screen, it opens full screen with its own icon, and it keeps working with
no signal — useful inside the building.

FILES (all six go in the same folder)
  cae-quest.html          the map
  manifest.webmanifest    name, icon and colours for the installed app
  sw.js                   saves the map to the device for offline use
  icon-192.png            home screen icon
  icon-512.png            home screen icon, large
  icon-maskable-512.png   Android adaptive icon
  apple-touch-icon.png    iPhone home screen icon

PUTTING IT ONLINE
Drop all six files into your GitHub Pages repo, in the same folder, and
push. The address stays whatever it was, e.g.
    https://<you>.github.io/cae-quest.html

IMPORTANT: this must be served over https. Opening cae-quest.html by
double-clicking it still shows the map, but it cannot install or work
offline — browsers only allow that over https. GitHub Pages is https, so
once it is pushed you are fine.

HOW PEOPLE INSTALL IT
  iPhone / iPad   Open the link in Safari, tap Share, then
                  "Add to Home Screen". The app reminds them.
  Android         Open the link in Chrome and tap the green Install
                  button in the header, or use "Add to Home screen".
  Windows / Mac   Open in Chrome or Edge and click Install in the header
                  or the icon in the address bar.

OFFLINE
The first visit saves the map to the device. After that it opens with no
signal, and an amber strip says so. Re-routing works offline too.

UPDATING IT LATER
Edit cae-quest.html, then open sw.js and change this line:
    const VERSION = 'quest-v1';
to 'quest-v2' (or anything new) and push both. That tells installed
copies to pull the new version. If you skip it, people may keep seeing
the old map.
