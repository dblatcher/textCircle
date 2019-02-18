
# textCircle
JS function for fitting text inside circles or circles around text.
This script styles elements into circles and arranges the innerText into rows to make best use of the shape. If the options are set (either with element attributes or the options argument of the function) the text can be shrunk to fit the space or the circle expanded so all the text will fit at the desired text size. Circle elements can be styled as normal. There are some limitations:
- Padding doesn't work with circles, but you can get a padding like effect with border.
- The style for your elements needs to include equal height and width
- The adjustments are fairly slow!
- only works to fit single paragraphs of plain text

The demo can be seen on [codepen](https://codepen.io/dblatcher/pen/NoYaLJ) or downloaded from the repo.

## fitTextToCircle(*circle* [, *{options}*])
### syntax
**circle** : The target HTML Element to be adjusted.

**options** : Optional. Object configuring the function. Properties:
- **text** : string. The text to be fitted to the circle. If omitted, the text used will be the text fitted to the Element before, or Element.innerText (if the function is being called on Element for the first time).
- **adjust** : string. If set to 'font' circle.style.fontSize will be reduced to allow the text to fit inside the circle. If set to 'size' circle.style.height and circle.style.width are increased to fit the text. Other values are ignored. If not set to a recognised value, the circle Element's "adjust" attribute is used instead.
- **fontSize** : number. value in pixels to set circles.style.fontSize. Will be overridden by the "adjust:font".
- **circleSize** : number. value in pixels to set  circle.style.height and circle.style.width.Will be overridden by the "adjust:size".
- **yAlign** : string. If set to "top" the text is not vertically centered in the circle.  Other values are ignored. If not set to a recognised value, the circle Elements "yAlign" attribute is used instead.
- **precise** : boolean. If set to 'true', the adjustments will be done using a slower, but more accurate process.
