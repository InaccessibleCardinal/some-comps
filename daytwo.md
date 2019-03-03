# Day Two

**An Accordion Component**

Our first order of business is to build a small UI. That's what React is supposed to be for after all. We'll make an accordion like this one: https://jqueryui.com/accordion/. It's got enough moving parts (literally and logically) to be interesting, and it's easy enough to do quickly. Perfect intro stuff.

The basic structure of an accordion is a list of panels, where each panel has a header and some panel content. When you click on a panel's header, that panel's content is displayed. Only one panel can open at a time (not necessary, but the one we'll make will do that).  First we need some data for our accordion:
```
const accordionContent = [
    {id: 'panel_1', header: 'Panel 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non est igitur voluptas bonum. Si verbum sequimur, primum longius verbum praepositum quam bonum. Ut pulsi recurrant? Quae diligentissime contra Aristonem dicuntur a Chryippo. Ergo hoc quidem apparet, nos ad agendum esse natos.'},
    {id: 'panel_2', header: 'Panel 2', content: 'Quis Aristidem non mortuum diligit? Idemne, quod iucunde? Cur haec eadem Democritus? Beatus sibi videtur esse moriens. Videamus animi partes, quarum est conspectus illustrior; Aliud igitur esse censet gaudere, aliud non dolere.'},
    {id: 'panel_3', header: 'Panel 3', content: 'Tum ille: Ain tandem? Duo Reges: constructio interrete. Prioris generis est docilitas, memoria; Quae cum dixisset paulumque institisset, Quid est? Quae cum dixisset, finem ille.'},
    {id: 'panel_4', header: 'Panel 4', content: 'At hoc in eo M. Et ille ridens: Video, inquit, quid agas; Quae cum dixisset paulumque institisset, Quid est? Haec quo modo conveniant, non sane intellego. Tum Piso: Quoniam igitur aliquid omnes, quid Lucius noster? Sed plane dicit quod intellegit.'},
];
```
Next lets think about what each panel might look like. It probably needs some kind of header tag, and probably has some kind of container for its content. Shooting from the hip, the following looks like a good start:
```
function AccordionPanel(props) {
    let {header, content} = props;
        return (
            <div>
                <h1>{header}</h1>
                <div>
                    <p>{content}</p>
                </div>
            </div>
        );
}
```
We make the panel a plain function because it probably doesn't have any internal logic to implement. It's just going to hold some data and conditionally render its content, and that can be controlled by a parent class component. Also, we know that at minimum, the component will need `header` and `content` props. Let's shift gears and take a look at the parent component. We'll let that be a class:
```
export default class Accordion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accordionContent: accordionContent,
            expandedPanel: null
        }
        this.expandPanel = this.expandPanel.bind(this);    
    }
    expandPanel(event) {
       //TODO find the panel whose header was clicked on
       //and set that as the state.expandedPanel
    }
    render() {
        let {accordionContent, expandedPanel} = this.state;
        //...what now?
    }
}
```
It's pretty common when building UI widgets to ping pong back and forth between working on the parent and its child components. You don't have to work this way, but it can sometimes help one reason about what sort of data needs to go where and how the data need to change. We know what `state.accordionContent` is; it's an array. The plan is to let `state.expandedPanel` be one of the panels in `state.accordionContent`. That might not be the best solution, but it seems very simple. With this plan in place, the expandPanel method almost writes itself:
```
...
expandPanel(event) {
    //find the panel by id
    let {id} = event.target;
    let panelToExpand = this.state.accordionContent.find((panel) => panel.id === id);
    //set that panel as the expandedPanel
    this.setState({
        expandedPanel: panelToExpand
    });
}
```
If we go with this approach, we know something more about what has to happen in `Accordion`'s `render` method. We'll be using each panel's `id`. How do we create the list of `<AccordionPanel />` components though? We can map over the `state.accordionContent` array: 
```
...
    render() {
        let {accordionContent, expandedPanel} = this.state;
        let accordionMarkup = accordionContent.map((panel) => {
            let {header, content, id} = panel;
            let expanded = expandedPanel === panel;
            return (
                <AccordionPanel
                    key={id}
                    header={header}
                    content={content}
                    id={id}
                    expanded={expanded}
                    expandPanel={this.expandPanel}             
                />
            );
        });
        return (
            <div>
                {accordionMarkup}
            </div>
        );
    }
```
`expanded` is a boolean, true for a panel if and only if that panel is the expandedPanel. We also pass in `this.expandPanel`. Notice the `key` prop being put on each `<AccordionPanel />`. This is a must when rendering a list. React uses keys internally as identifiers for each member of a list. `keys` don't have to be globally unique, but they do have to be unique among siblings in the list. Most real world data lists have ids for their objects, so this isn't normally an inconvenience. 

Now that we know all the props that `AccordionPanel` will receive, we can finish up that component:
```
//AccordionPanel.js "final form"
function AccordionPanel(props) {
    let {header, content, id, expanded, expandPanel} = props;
    return (
        <div>
            <h1
                id={id}
                className={expanded ? 'accordion-header expanded' : 'accordion-header'}
                onClick={expandPanel}
            >
                {header}
            </h1>
            <div className={expanded ? 'accordion expanded' : 'accordion closed'}>
                {expanded && <p className="accordion-content">{content}</p>}
            </div>
        </div>
    );
}
```
We've also added the css classes that will make our accordion have smooth transitions between 'expanded' and 'closed' states. 

Expressions like this:
```
className={someBoolean ? nameIfTrue : nameIfFalse}
```
Do what it looks like they do: if someBoolean is true, the className will be nameIfTrue, otherwise the className will be nameIfFalse. 

Expressions like this:
```
{someBoolean && <SomeComponent />}
```
Are a trick that leverages the way JavaScript &&-expressions are evaluated. If someBoolean is false, then the conjunction can't be true and the engine skips the right-hand side. If someBoolean is true, then the expression evaluates to whatever the right-hand side is, in this case some component / DOM element. That trick is called *short circuiting*.

# Network Requests
