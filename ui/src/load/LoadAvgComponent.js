
export default React.createClass({
      render() {
        let loadavg = this.props.loadavg || {};
        return <div>
        <h2>Load average</h2>
        <table>
        <tbody>
        <tr>
          <td>1 minute:</td>
          <td>{loadavg.load_avg_1_min}</td>
        </tr>
        <tr>
          <td>5 minutes:</td>
          <td>{loadavg.load_avg_5_min}</td>
        </tr>
        <tr>
          <td>10 minutes:</td>
          <td>{loadavg.load_avg_10_min}</td>
        </tr>
        </tbody>
        </table>
        </div>
      }
  });
