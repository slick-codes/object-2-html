

# Installation 
You can install object-2-html using npm , yarn or pnpm
````bash
    npm install object-2-html
````

You can also insert the CDN directly to your project header
```html
    <script src="https://unpkg.com/@slickcodes/object-2-html@1.0.0/dist/index.js"></script>
```

#Usage

To reader your object to html you'll need to use the reader method provided with the o2h object.

```javascript
    import oth from 'object-2-html'

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
    // use this to render the generated array to the body element
    // o2h.render(o2h, document.querySelector('body') )

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
the event will be tied to the button element and will be triggered once the button is clicked.
childNode consist of Text, Element and Comment, the rendering sequence is determined by how the nodes are stacked.

you can also render the object directly to a parent element.

```javascript
    o2h.render(obj, document.querySelector('body'))
```

Whilst text can be rendered as a as a childNode it can also be inserted directly to the element. using the text key.

```javascript
    import o2h from 'object-2-html'

    const obj = {
        type: "element",
        tagName: "h1",
        text: "Hello Word", // render text directly to h1 element
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

