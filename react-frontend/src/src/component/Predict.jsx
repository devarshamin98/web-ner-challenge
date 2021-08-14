import React, { useState } from 'react';
import axios from 'axios';

const Predict = () => {

	const [text, setText] = useState('');
	const [textResult, setTextResult] = useState('');
	const [jsonResult, setJsonResult] = useState([]);

	const parseResult = payload => {
		payload = JSON.stringify(payload);
		payload = payload.replace('B-MISC', 'GPE').replace('I-MISC', 'GPE').replace('B-PER', 'PERSON').replace('I-PER', 'PERSON').replace('B-LOC', 'LOC').replace('I-LOC', 'LOC').replace('[CLS]', 'O').replace('[SEP]', 'O');
		payload = JSON.parse(payload);
		return payload;
	}

	const onSetJsonResult = payload => {
		// console.log('[set]', payload);
		// let data = JSON.stringify(payload, true, 2);
		// setJsonResult("<pre>" + data + "</pre>");
		setJsonResult(payload);
	}

	const onSetTextResult = payload => {
		let data = '';
		let currentTag = null;
		for(let item of payload) {
			if(currentTag != item.tag) {
				if(currentTag)
					data += "(" + currentTag + ") ";
				currentTag = item.tag;
			}
			data += item.word + " ";
		}
		data += "(" + payload[payload.length - 1].tag + ")";
		setTextResult(data);
	}

	const onSubmit = () => {
		axios.post('http://localhost:5000/predict', { text: text })
			.then(res => {
				let data = parseResult(res.data.result);
				onSetJsonResult(data);
				onSetTextResult(data);
			})
			.catch(err => console.log('[err]', err));
	}

	return (
		<div className="d-flex h-100">
			<div className="left-panel">
				<div className="form-group">
					<div className="text-center mb-4">
						<h1>Text Predictor</h1>
					</div>
					<div className="text-center">
						<button className="btn btn-primary m-3" onClick={onSubmit}>Start Predict</button>
					</div>
					<textarea onChange={(e) => setText(e.target.value)} value={text} cols="30" rows="10" className="form-control"></textarea>

					<h4 className="mt-4">Result</h4>
					<textarea value={textResult} cols="30" rows="10" className="form-control mt-2" readOnly></textarea>
				</div>
			</div>
			<div className="right-panel">
				<div className="form-group">
					<h4>Analysis</h4>
					{/* <textarea value={result} cols="30" rows="10" className="form-control" readOnly></textarea> */}
					{/* <div className="right-content" dangerouslySetInnerHTML={{ __html: jsonResult }}></div> */}
					{
						jsonResult.length > 0 &&
						<table className="table table-striped">
							<thead>
								<tr>
									<th>Word</th>
									<th>Tag</th>
									<th>Confidence</th>
								</tr>
							</thead>
							<tbody>
								{
									jsonResult.map((item, key) => 
									<tr key={key}>
										<td>{item.word}</td>
										<td>{item.tag}</td>
										<td>{item.confidence}</td>
									</tr>)
								}
							</tbody>
						</table>
					}
				</div>
			</div>
		</div>
	)
}

export default Predict;