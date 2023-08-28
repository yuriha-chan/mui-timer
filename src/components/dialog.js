import { h, Component } from 'preact';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import formatTime from './time-format'

const timeMarks = [
	1,2,3,4,5,6,7,8,9,10,
	15,20,25,30,35,40,45,50,55,60,
	75,90,105,120,135,150,165, 180,
	210,240,270,300,360,
	420,480,540,600,
	900,1200,1500,1800,2100,2400,2700,3000,3300,3600,
	4500, 5400, 6300, 7200, 8100, 9000, 9900, 10800, 12600, 14400, 16200, 18000, 19800, 21600, 25200, 28800, 32400, 36000, 39600, 43200];

function mapSliderValue(x) {
	return 1000 * (Math.round(Math.exp(x)) - 10);
}

class SettingsDialog extends Component {
	constructor(props) {
		super(props);
		this.state = { title: this.props.title, maxTime: this.props.maxTime, countDown: this.props.countDown, sound: this.props.sound};
	}

	save = () => {
		const { title, maxTime, countDown, sound } = this.state;
		this.props.onSave({title, maxTime, countDown, sound});
		this.props.onClose();
	};
	changeSound = (ev) => {
		this.setState({sound: '' + ev.target.value});
	};
	changeCountDown = (ev) => {
		this.setState({countDown: !this.state.countDown });
	}
	changeMaxTime = (ev) => {
		this.setState({maxTime: mapSliderValue(ev.target.value)});
	}

	render() {
		const { title, maxTime } = this.state;
		return (
				<Dialog open={this.props.open} onClose={this.close} maxWidth='sm' fullWidth>
					<DialogTitle ><ScheduleIcon /> タイマーの設定</DialogTitle>
					<DialogContent style={{overflow: 'hidden'}}>
						<div class="settings-entry">
						<TextField
							label="Title"
							value={title}
							onChange={event => this.setState({ title: event.target.value })}
							fullWidth
							margin="normal"
						/>
						</div>
						<div class="settings-entry">
			タイマーの長さ
						<Slider
							color={this.props.color}
								value={Math.log(10 + this.state.maxTime / 1000)}
								onChange={this.changeMaxTime}
								step={null}
								valueLabelDisplay="auto"
								marks={timeMarks.map(x=>({value: Math.log(10 + x), label: ''}))}
								max={Math.log(10 + 43200)} min={Math.log(10)} scale={(x) => 1000 * (Math.round(Math.exp(x)) - 10)}
								getAriaValueText={formatTime} valueLabelFormat={formatTime} />
						</div>
						<div class="settings-entry">
					<FormGroup>
							<FormControlLabel control={<Checkbox onChange={this.changeCountDown} checked={this.state.countDown} />} label="カウントダウン" />
					</FormGroup>
						</div>
						<div class="settings-entry">
						  <FormControl fullWidth>
						  <InputLabel id="select-label-sound">音</InputLabel>
						  <Select labelId="select-label-sound" id="select-sound" value={this.state.sound} label="Sound" onChange={this.changeSound} >
						    <MenuItem value={'none'}>(なし)</MenuItem>
						    <MenuItem value={'nc285196.flac'}>ぴこん</MenuItem>
						  </Select>
						  </FormControl>
						</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.props.onClose}>キャンセル</Button>
				<Button onClick={this.save}>保存</Button>
			</DialogActions>
			</Dialog>
		);
	}
}

export default SettingsDialog;
