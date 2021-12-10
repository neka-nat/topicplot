import React from 'react';
import Plot from 'react-plotly.js';
import { Ros, Topic, Message } from 'roslib';

interface LineData {
  x: number[]
  y: number[]
  mode: string
}

interface LineLayout {
  datarevision: number
  title: string
}

interface LineState {
  line: LineData
  layout: LineLayout
  revision: number
}

export class LinePlot extends React.Component<{}, LineState> {
  ros = new Ros({
    url: 'ws://localhost:9090'
  });
  constructor(props: {}) {
    super(props)
    this.state = {
      line: {
        x: [1, 2, 3],
        y: [2, 6, 3],
        mode: 'lines+markers',
      },
      layout: {
        datarevision: 0,
        title: 'A Line Plot'
      },
      revision: 0,
    };
    this.updateGraph = this.updateGraph.bind(this);
  }
  componentDidMount() {
    try {
      this.ros.on('connection', () => {
        console.log('[INFO]: connection');
      });
      this.ros.on('error', err => {
        console.log('[ERROR]: ' + err);
      });
      this.ros.on('close', () => {
        console.log('[INFO]: close');
      });
      const listener = new Topic({
        ros: this.ros,
        name: '/example',
        messageType: 'std_msgs/Int32'
      });
      listener.subscribe(message => {
        this.updateGraph(message['data']);
      });
    } catch (e) {
      console.log('[ERROR]: ' + e);
    }
  }
  updateGraph(val: number) {
    const { line, layout } = this.state;
    line.x.push(line.x[line.x.length - 1] + 1);
    line.y.push(val);
    if (line.x.length >= 20) {
      line.x.shift();
      line.y.shift();
    }
    this.setState({ revision: this.state.revision + 1 });
    layout.datarevision = this.state.revision + 1;
  }
  render() {
    return (
      <Plot
        data={[
            this.state.line,
        ]}
        layout={this.state.layout}
        revision={this.state.revision}
      />
    );
  }
}