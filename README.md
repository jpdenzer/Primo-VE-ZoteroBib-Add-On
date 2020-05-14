# Primo-VE-ZoteroBib-Add-On
## Description
Primo-VE ZoteroBib add-On for ZoteroBib citation manager.


### Video demo
Please see video <a href="https://youtu.be/cRYwhLevv-4">ZoteroBib-Add-On</a>
### Screenshot
![ZoteroBib](https://raw.githubusercontent.com/jpdenzer/Primo-VE-ZoteroBib-Add-On/master/docs/zoterobibgif.gif)

## Add code to custom.js file

1. Add the js code block from <b>Primo-VE-ZoteroBib-Add-On.js</b>into your main function in the Primo <b>custom.js</b> file

```js
// START ------ Primo-VE-ZoteroBib-Add-On ------/
function insertActions(actions) {
app.service('customActionService', function() {
  return {
    actions: [],
.
.
.
}])
}
// END ------ Primo-VE-ZoteroBib-Add-On ------/
```

2. Add the js code block from <b>Primo-VE-ZoteroBib-Add-On.js</b> after the previous block of code:

```js
//Replace name and icon with you own
insertActions([{
  name: "ZoteroBib",
  type: "urlredirectzotero",
  icon: {
    set: 'primo-actions',
    name: 'easybib'
  },
  action: "https://zbib.org/import?q="
}]);
```

3. Place the function with this block of code outside the main Function
```js
function getZoterobibq(addata, risformattype)
{
  .
  .
  .
}
return "01";
}
}
```

## Customize add-on name and icon (optional).
<b>name:</b> can be modified to any text you want.</br>
<b>set: 'primo-actions'</b> and<b> name: 'easybib'</b> can be changed to use a different buit-in icon in Primo.
```js
name: "ZoteroBib",
type: "urlredirectzotero",
icon: {
  set: 'primo-actions',
  name: 'easybib'
}
```

## Repackage your <b>customview</b> and upload it to Alma
