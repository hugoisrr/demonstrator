import React, { Fragment, useContext, useRef } from 'react'
import DeviceContext from '../../context/device/deviceContext'
import WebsocketContext from '../../context/websocket/websocketContext'
import { Spinner } from '../layout/Spinner'
import DeviceGraphs from '../layout/DeviceGraphs'

export const DeviceContent = () => {
	const deviceContext = useContext(DeviceContext)
	//const [ids, setIds] = useState()
	const websocketContext = useContext(WebsocketContext)
	const { data, wks, dictionary } = deviceContext
	const { deviceWebsocket } = websocketContext
	const { open } = deviceWebsocket
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

	//Do in the first render only: check if configuration file enters
	if (wks && refInit.current && wks.length > 0) {
		//Create array of wks ids to add to ids dropdown
		refInit.current = false
		refIds.current = wks
	}

	//Check if values in the data objects from the API are defined & websocket is open before rendering
	if (open && wks.length > 0 && data.raw_values) {
		return (
			<Content>
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
											select
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
			</Content>
		)
	}
	// If data coming from API is still undefined, render Spinner until actual data comes in
	else {
		return (
			<Content>
				<Spinner />
			</Content>
		)
	}
}

//Render container with common tags for the 2 conditional cases
const Content = props => {
	return (
		<Fragment>
			<div id='content'>
				<div className='container-fluid'>{props.children}</div>
			</div>
		</Fragment>
	)
}
