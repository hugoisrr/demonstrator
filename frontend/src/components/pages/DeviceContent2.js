import React, {useContext, useRef } from 'react'
import DeviceContext from '../../context/device/deviceContext'
//import WebsocketContext from '../../context/websocket/websocketContext'
import { client } from '../websockets/deviceWebsocket'
import { Spinner } from '../layout/Spinner'
import ContentAPI from '../layout/ContentAPI'
import pure from 'recompose/pure'
import DeviceGraphs from '../layout/DeviceGraphs'

const DeviceContent = ({ title }) => {
	const deviceContext = useContext(DeviceContext)
	//const [ids, setIds] = useState()
	//const websocketContext = useContext(WebsocketContext)
	const {wks, dictionary, websocketStatus, getDeviceWebsocketStatus } = deviceContext
	//const { deviceWebsocket } = websocketContext
	//const { open } = deviceWebsocket
	const refInit = useRef(true)
	const dropdownName = useRef('Select WorkStation')
	const refCurrentId = useRef(0)
	const refIds = useRef(['test'])
	//const initialValue = { ids: [10, 11, 12] }

	const style = {
		padding: '3rem',
	}

	const handleClick = e => {
		refCurrentId.current = parseInt(e.target.id)
		dropdownName.current = e.target.name
	}

	
	const handleSwitch = ({ target }) => {
		if (!target.checked && websocketStatus === 'OPEN') {
			client.close()
			getDeviceWebsocketStatus('CLOSED')
			console.log("Close");
		} else if (target.checked && websocketStatus !== 'OPEN') {
			window.location.reload()
			getDeviceWebsocketStatus('OPEN')
			console.log("Open");
		}
	}

	//Do in the first render only: check if configuration file enters
	if (wks && refInit.current && wks.length > 0) {
		//Create array of wks ids to add to ids dropdown
		refInit.current = false
		refIds.current = wks
	}

	//Check if values in the data objects from the API are defined & websocket is open before rendering
	if (wks.length > 0 && Object.keys(dictionary).length > 0){//data.raw_values) {
		return (
			<ContentAPI
				title={title}
				websocketStatus={websocketStatus}
				change={handleSwitch}
			>
				{/* <h1 className='h3 mb-4 text-gray-800 my-4'>Device Content</h1> */}
				<div className='row' style={style}>
					<h2 className='col offset-1'>
						Workstation Name: {dropdownName.current}
					</h2>
					<div className='dropdown right col'>
						<button
							className='btn btn-secondary dropdown-toggle '
							type='button'
							id=''
							data-toggle='dropdown'
							aria-haspopup='true'
							aria-expanded='false'
						>
							{dropdownName.current}
						</button>
						<div className='dropdown-menu' aria-labelledby='dropdownMenu2'>
							{refIds.current.map((item, i) => {
								if (i === 0) {
									return (
										<button
											name={item.ws_name}
											className='dropdown-item'
											id={item.ws_id}
											type='button'
											key={i}
											onClick={handleClick}
										>
											{item.ws_name}
										</button>
									)
								} else {
									return (
										<button
											name={item.ws_name}
											className='dropdown-item'
											id={item.ws_id}
											type='button'
											key={i}
											onClick={handleClick}
										>
											{item.ws_name}
										</button>
									)
								}
							})}
						</div>
					</div>
				</div>
				
				<div className='row'>
					<div>
						{refIds.current.map((item, i) => {
							return (
								<DeviceGraphs
									id={item.ws_id}
									show={item.ws_id === refCurrentId.current}
									data={dictionary[item.ws_id]}
									keyNames={wks[0].raw_data}
									key={i}
								/>
							)
						})}
					</div>
				</div>
				</ContentAPI>
		)
	}
	// If data coming from API is still undefined, render Spinner until actual data comes in
	else {
		return (
			<ContentAPI
				title={title}
				websocketStatus={websocketStatus}
				change={handleSwitch}
			>
				<Spinner />
			</ContentAPI>
		)
	}
}

//Render container with common tags for the 2 conditional cases
/**const Content = props => {
	return (
		<Fragment>
			<div id='content'>
				<div className='container-fluid'>{props.children}</div>
			</div>
		</Fragment>
	)
}
*/

DeviceContent.defaultProps = {
	title: 'Device Content',
}

export default DeviceContent
