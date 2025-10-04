function customRender(elementTree, container){
    const domElement = document.createElement(elementTree.type)
    for (const prop in elementTree.props) {
        if (prop === "children") continue
        domElement.setAttribute(prop, elementTree.props[prop])
    }
    domElement.textContent = elementTree.children
    container.appendChild(domElement)
}


const reactElement = {
    type: "a",
    props: {
        href: "https://www.google.com",
        target: "_blank",
    },
    children: "google.com"

}

const root =document.getElementById("root")

customRender(reactElement, root)