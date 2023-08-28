import { h, Component } from 'preact';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import * as colors from '@mui/material/colors';

import SettingsDialog from './dialog'
import formatTime from './time-format'

const extendedPalette = [];

for (const k in colors) {
	const v = colors[k];
	extendedPalette[k] = {main: v[500], dark: v[900], light: v[100]}
	extendedPalette[k + "_light"] = {main: v[200], dark: v[300], light: v[100]}
}

const theme = createTheme({
	  palette: {
		      primary: {
			            light: '#757ce8',
			            main: '#3f50b5',
			            dark: '#002884',
			            contrastText: '#fff',
			          },
		      secondary: {
			            light: '#ff7961',
			            main: '#f44336',
			            dark: '#ba000d',
			            contrastText: '#000',
			          },
		      ...extendedPalette
		    },
});

const defaultTitles = {
	'#1': "ブロッコリーを茹でる", 
	'#2': "トマトを茹でる", 
	'#3': "バナナを焼く", 
};

class Timer extends Component {
	constructor(props) {
		super(props);
		const savedDisplayTime = localStorage.getItem('timer:' + props.name + ":displayTime");
		const savedStartTime = localStorage.getItem('timer:' + props.name + ":startTime");
		const savedAccumulatedTime = localStorage.getItem('timer:' + props.name + ":accumulatedTime");
		const savedIsRunning = localStorage.getItem('timer:' + props.name + ':isRunning');
		const savedTitle = localStorage.getItem('timer:' + props.name + ':isTitle');
		const savedCountDown = localStorage.getItem('timer:' + props.name + ':countDown');
		const savedMaxTime = localStorage.getItem('timer:' + props.name + ':maxTime');
		const savedSound = localStorage.getItem('timer:' + props.name + ':sound');
		
		this.state = {
			displayTime: savedDisplayTime ? parseFloat(savedDisplayTime) : 0,
			startTime: savedStartTime ? parseFloat(savedStartTime) : 0,
			accumulatedTime: savedAccumulatedTime ? parseFloat(savedAccumulatedTime) : 0,
			isRunning: savedIsRunning === 'true',
			title: savedTitle ? savedTitle : defaultTitles[props.name],
			maxTime: savedMaxTime ? savedMaxTime : 180000,
			countDown: savedCountDown === "true",
			sound: savedSound ? savedSound : 'none',
			settingsOpen: false,
		};

		if (this.state.isRunning) {
			this.intervalRef = setInterval(() => {
				this.setState(prevState => ({
				displayTime: (new Date().getTime() - this.state.startTime + this.state.accumulatedTime),
				}));
			}, 200);
		}
	}

	componentDidUpdate() {
		localStorage.setItem('timer:' + this.props.name + ":displayTime", this.state.displayTime);
		localStorage.setItem('timer:' + this.props.name + ":startTime", this.state.startTime);
		localStorage.setItem('timer:' + this.props.name + ":accumulatedTime", this.state.accumulatedTime);
		localStorage.setItem('timer:' + this.props.name + ":isRunning", '' + this.state.isRunning);
		localStorage.setItem('timer:' + this.props.name + ":countDown", '' + this.state.countDown);
		localStorage.setItem('timer:' + this.props.name + ":maxTime", '' + this.state.maxTime);
		localStorage.setItem('timer:' + this.props.name + ":sound", '' + this.state.sound);
	}

	startTimer = () => { if (!this.state.isRunning) {
			this.setState({ isRunning: true, startTime: new Date().getTime() });
			this.intervalRef = setInterval(() => {
				this.setState(prevState => ({
				displayTime: (new Date().getTime() - this.state.startTime + this.state.accumulatedTime),
				}));
				}, 200);
		}
	};

	stopTimer = () => {
		clearInterval(this.intervalRef);
		this.setState({ isRunning: false, accumulatedTime: this.state.displayTime });
	};

	resetTimer = () => {
		clearInterval(this.intervalRef);
		this.setState({
			displayTime: 0,
			accumulatedTime: 0,
			isRunning: false,
		});
	};

	toggleTimer = () => {
		if (this.state.isRunning) {
			this.stopTimer();
		} else {
			this.startTimer();
		}
	};

	openSettings = () => {
		this.setState({ settingsOpen: true });
	};

	saveSettings = (settings) => {
		this.setState(settings);
	};

	render() {
		return (
			<div style={{ display: 'flex', margin: '10px' }}>
			<ThemeProvider theme={theme}>	
			<div style={{ textAlign: 'center', padding: '10px', background: this.state.isRunning ? "#ccc0aa" : "#eeeef4", width: '90%' }} onClick={this.toggleTimer} onDoubleClick={this.resetTimer}>
			<h2>{ this.state.title }</h2>
			<LinearProgress color={this.props.color} variant="determinate" value={this.state.displayTime / this.state.maxTime * 100} style={{ width: '80%', margin: '0 auto' }} sx={{height: 20}} />
			<h2 style={{ fontFamily: "Roboto" }}>{formatTime(this.state.countDown ? Math.max(0, this.state.maxTime - this.state.displayTime) : this.state.displayTime)}</h2>
			</div>
			<Button color="blueGrey_light" variant="contained" style={{ width: '10%' }} onClick={this.openSettings} ><SettingsIcon/></Button>
			<SettingsDialog color={ this.props.color } title={ this.state.title } maxTime={ this.state.maxTime } countDown={ this.state.countDown } sound={ 'none' } onSave={ this.saveSettings } onClose={ () => this.setState({ settingsOpen: false }) } open={ this.state.settingsOpen } />
			</ThemeProvider>
			</div>
		);
	}
}

export default Timer;

