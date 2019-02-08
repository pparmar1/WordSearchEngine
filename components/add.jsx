//-*- mode: rjsx-mode;

'use strict';

const React = require('react');

class Add extends React.Component {

    /** called with properties:
     *  app: An instance of the overall app.  Note that props.app.ws
     *       will return an instance of the web services wrapper and
     *       props.app.setContentName(name) will set name of document
     *       in content tab to name and switch to content tab.
     */
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {name: "", content: "", error: []};
    }


    async handleChange(event) {
        let errorMsg = [];
        let fileName = event.target.files[0].name;
        fileName = fileName.slice(0, fileName.lastIndexOf('.'));
        this.setState({name: fileName});
        try {
            let fileContent = await readFile(event.target.files[0]);
            this.setState({content: fileContent});
            await this.props.app.ws.addContent(this.state.name, this.state.content);
            this.props.app.setContentName(this.state.name);
        } catch (error) {
            errorMsg.push(<span className="error">{error.message}</span>);
        }
        this.setState({error: errorMsg});
    }

    render() {

        return (
            <div>
                <form>
                    <label className="label">Choose File:
                        <input className="control" type="file" onChange={this.handleChange}/>
                    </label>
                </form>
                {this.state.error}
            </div>
        );
    }
}

module.exports = Add;

/** Return contents of file (of type File) read from user's computer.
 *  The file argument is a file object corresponding to a <input
 *  type="file"/>
 */
async function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(file);
    });
}
