

# Installation 
You can install object-to-html using npm , yarn or pnpm
````bash
    npm install object-to-html
````

You can also insert the CDN directly to your project header
```html
    <script src="unpkg.com/object-to-html@^1/dist/index.js"></script>
```

#Usage

To reader your object to html you'll need to use the reader method provided with the o2h object.

```javascript
    import oth from 'object-to-html'

    const obj = {
        type: "element",
        tagName: "div",
        style: {background: "purple"},
        classes: ["container","example"],
        childNodes: [ // adding children
            {
                type: "comment",
                text: "the following code is an h1 tag"
            },
            {
                type: "element",
                tagName: "h1",
                text: "Join our news letter"
            },
            {
                type: "element",
                tagName: "input",
                attributes: [{type: "input"}, {placeholder:"email address"}]
            },
            {
                type: "text",
                text: "Submit email"
            },
            {
                type: "element",
                tagName: "button",
                text: "Submit form",
                events: { // adding event listener
                    click: (event) => console.log('submit form')
                }
            }
        ]   
    }
    const html = o2h.render(o2h)
    console.log(html)
```
### Output
``` html
<div class="container example" style="background: blue;">
    <!--the following code is an h1 tag-->
    <h1 data-name="news letter text">Join our news letter</h1>
    <input type="input" placeholder="email address">
    Submit email
    <button>Submit form</button>
</div>
```
the event will be tied to the button element and will be triggered one the button is clicked.

childNode can consite of Text, Element and Comment.
You can also render text without inserting it as a node.

```javascript
    import o2h from 'object-to-html'

    const obj = {
        type: "element",
        tagName: "h1",
        text: "Hello Word",
        style: {color: "blue"}
    }
```
### Result
```html
    <h1 style="color:blue">Hello Word</h1>
```


## Revert html to object
you can revert html elements to object using the undoRender method.

```html 

<h1 class="header-title" title="object to html" > object to html</h1>

<script>
    o2h.undoRender(document.querySelector('h1'))
</script>
```

### Output

```javascript
    {
        type: "element",
        tagName: "h1",
        attributes: [{title: "object to html"}],
        classes: ["header-title"],
        childNodes: [
            {
                type: "text",
                text: "object to html"
            }
        ]
    }
```

