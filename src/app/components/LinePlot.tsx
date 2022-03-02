import React, { useState, useEffect } from 'react';
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


const LinePlot: React.FC<{}> = () => {
  const [lineState, setLineState] = useState<LineState>({
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
  })

  const updateGraph = (val: number) => {
    const { line, layout, revision } = lineState;
    line.x.push(line.x[line.x.length - 1] + 1);
    line.y.push(val);
    if (line.x.length >= 20) {
      line.x.shift();
      line.y.shift();
    }
    layout.datarevision = revision + 1;
    setLineState({line: line, layout: layout, revision: revision + 1});
  }

  useEffect(() => {
    const ros = new Ros({
      url: 'ws://localhost:9090'
    });
    try {
      ros.on('connection', () => {
        console.log('[INFO]: connection');
      });
      ros.on('error', err => {
        console.log('[ERROR]: ' + err);
      });
      ros.on('close', () => {
        console.log('[INFO]: close');
      });
      const listener = new Topic({
        ros: ros,
        name: '/example',
        messageType: 'std_msgs/Int32'
      });
      listener.subscribe(message => {
        updateGraph(message['data']);
      });
    } catch (e) {
      console.log('[ERROR]: ' + e);
    }
  }, [])

  return (
    <Plot
      data={[lineState.line,]}
      layout={lineState.layout}
      revision={lineState.revision}
    />
  )
}

export default LinePlot
