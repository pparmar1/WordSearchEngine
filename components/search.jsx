//-*- mode: rjsx-mode;

'use strict';

const React = require('react');

class Search extends React.Component {

    /** called with properties:
     *  app: An instance of the overall app.  Note that props.app.ws
     *       will return an instance of the web services wrapper and
     *       props.app.setContentName(name) will set name of document
     *       in content tab to name and switch to content tab.
     */
    constructor(props) {
        super(props);
        this.state = {docs: [], searchTerms: "", docName: "", error: []};
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getResults = this.getResults.bind(this);
        this.changeToContentTab = this.changeToContentTab.bind(this);
    }

    handleBlur(event) {
        event.preventDefault();
        this.getResults(event.target.value);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getResults(event.target.q.value);

    }

    async getResults(searchTerms) {
        let errorMsg = [];
        this.setState({searchTerms: searchTerms});
        try {
            let result = await this.props.app.ws.searchDocs(searchTerms, 0);
            this.setState({docs: result.results});
            if (this.state.docs.length === 0) {
                errorMsg.push(<span className="error">No results for {this.state.searchTerms}</span>);
            }
        } catch (error) {
            console.log(error.message);
            errorMsg.push(<span className="error">{error.message}</span>);

        }
        this.setState({error: errorMsg});


    }

    changeToContentTab(event) {
        event.preventDefault();
        console.log(event.target.name);
        this.props.app.setContentName(event.target.name);
        //this.setState({docName:event.target.name});
    }


    render() {
        let lines;
        const out = {};
        let highlightedword = [];
        const words = new Set(this.state.searchTerms.toLowerCase().split(/\W+/));

        this.state.docs.map(result => {
            let highlightedword = [];
            lines = result.lines.map(line => {
                //console.log(line);
                let w = line.split(/[^A-Za-z]/);
                //console.log(w);
                w.forEach(w => {
                    const isSearch = words.has(w.toLowerCase());
                    if (isSearch) {
                        highlightedword.push(<span className="search-term">{w}</span>);
                        highlightedword.push(" ");
                    } else {
                        highlightedword.push(w + " ");
                    }
                });

                highlightedword.push(<br/>);
                //console.log(highlightedword);
            });
            result["highlightedlines"] = highlightedword;
            return Object.assign({}, result, {lines});
        });

        let displayResult = this.state.docs.map((curr, index) => (
            <div className="result" key={index}>
                <a className="result-name" key={index} onClick={this.changeToContentTab} href={curr.name}
                   name={curr.name}>{curr.name}</a>
                <p>{curr.highlightedlines}</p>
            </div>
        ));


        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <span className="label" key="search">Search Terms:</span>
                        <span className="control"><input id="q" key="q" name="q" onBlur={this.handleBlur}/><br/></span>
                    </label>
                </form>
                {displayResult}
                {this.state.error}
            </div>
        )
    }
}

module.exports = Search;
