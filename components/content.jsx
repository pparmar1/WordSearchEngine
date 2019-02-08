//-*- mode: rjsx-mode;

'use strict';

const React = require('react');

class Content extends React.Component {

    /** called with properties:
     *  app: An instance of the overall app.  Note that props.app.ws
     *       will return an instance of the web services wrapper and
     *       props.app.setContentName(name) will set name of document
     *       in content tab to name and switch to content tab.
     *  name:Name of document to be displayed.
     */
    constructor(props) {
        super(props);
        this.state = {docName: "", docContent: ""};
    }

    async componentDidMount() {
        if (this.props.name) {
            let DocContent = await this.props.app.ws.getContent(this.props.name, 0);
            this.setState({docName: this.props.name, docContent: DocContent.content});
        }
    }

    async componentDidUpdate() {
        if (this.props.name) {
            let DocContent = await this.props.app.ws.getContent(this.props.name, 0);
            this.setState({docName: this.props.name, docContent: DocContent.content});
        }
    }

    render() {

        return (
            <section>
                <h1>{this.state.docName}</h1>
                <pre>{this.state.docContent}</pre>
            </section>
        )
    }

}

module.exports = Content;
