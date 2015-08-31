import { connect } from 'react-redux';

import LoadAvgComponent from "../load/LoadAvgComponent.js";


export default connect(state => state)(React.createClass({
    render() {
        return <div>
            <h1>topd</h1>
            <LoadAvgComponent loadavg={this.props.loadavg} />
        </div>;

    }
}));