import React, { Fragment, useContext, useRef } from 'react'
import DeviceContext from '../../context/device/deviceContext'
import WebsocketContext from '../../context/websocket/websocketContext'
import { Spinner } from '../layout/Spinner'
import DeviceGraphs from '../layout/DeviceGraphs'

export const DeviceContent = () => {
	const deviceContext = useContext(DeviceContext)
	//const [ids, setIds] = useState()
	const websocketContext = useContext(WebsocketContext)
	const { data, wks } = deviceContext
	const { deviceWebsocket } = websocketContext
	const { open } = deviceWebsocket
	const dictionary = useRef({})
	const refInit = useRef(true)
	const refCurrentId = useRef(0)
	const refIds = useRef(['test'])
	const refWksArray = useRef([])
	//const initialValue = { ids: [10, 11, 12] }

	const handleClick = e => {
		refCurrentId.current = parseInt(e.target.id)
	}

	//Do in the first render only: check if configuration file enters
	if (wks && refInit.current && wks.length > 0) {
		//Create array of wks ids to add to ids dropdown
		refIds.current = wks
		refWksArray.current = new Array(refIds.current.length).fill(
			new Array(10).fill(0)
		)
		wks.forEach(element => {
			dictionary.current[element.ws_id] = new Array(10).fill(0)
		})
		refInit.current = false
		console.log(wks)
	}

	//Check if values in the data objects from the API are defined & websocket is open before rendering
	if (open && wks.length > 0 && data.raw_values) {
		dictionary.current[data.ws_id].shift()
		console.log(wks[0].raw_data)
		dictionary.current[data.ws_id].push(Object.values(data.raw_values))
		return (
			<Content>
				<h1 className='h3 mb-4 text-gray-800 my-4'>Label Content</h1>
				<div className='row'>
					<div className='col'>
						<h3 className='h4 mb-4 text-gray-200 my-4'>Graph goes here</h3>
						<div>
							{refIds.current.map((item, i) => {
								return (
									<DeviceGraphs
										id={item.ws_id}
										show={item.ws_id === refCurrentId.current}
										data={dictionary.current[item.ws_id]}
										keyNames={wks[0].raw_data}
									/>
								)
							})}
						</div>
					</div>
					<div className='col'>
						<div className='dropdown'>
							<button
								className='btn btn-secondary dropdown-toggle'
								type='button'
								id='dropdownMenu2'
								data-toggle='dropdown'
								aria-haspopup='true'
								aria-expanded='false'
							>
								Select Workstation ID
							</button>
							<div className='dropdown-menu' aria-labelledby='dropdownMenu2'>
								{refIds.current.map((item, i) => {
									return (
										<button
											className='dropdown-item'
											id={item.ws_id}
											type='button'
											key={i}
											onClick={handleClick}
										>
											{item.ws_name}
										</button>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</Content>
		)
	}
	// If data coming from API is still undefined, render Spinner until actual data comes in
	else {
		return (
			<Content>
				<h1 className='h3 mb-4 text-gray-800 my-4'>Label Content</h1>
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
				<div className='container-fluid'>
					<h1 className='h3 mb-4 text-gray-800 my-4'>{props.children}</h1>
				</div>
			</div>
		</Fragment>
	)
}
