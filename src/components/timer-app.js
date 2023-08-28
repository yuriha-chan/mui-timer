import { h, Component } from 'preact';
import Timer from './timer';

class App extends Component {
	  constructor(props) {
		      super(props);
		    }


	  render() {
		      return (
			            <div style={{ textAlign: 'center' }}>
			              <p><strong>タップしてスタート・ストップ、ダブルタップでリセット</strong></p>
			      		<Timer name="#1" color="teal"/>
			      		<Timer name="#2" color="red"/>
			      		<Timer name="#3" color="yellow"/>
			            </div>
			          );
		    }
}

export default App;

