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
	const refInit = useRef(true)
	const refCurrentId = useRef(0)
	const refIds = useRef(['test'])
	const refWksArray = useRef([])
	//const initialValue = { ids: [10, 11, 12] }

	const handleClick = e => {
		refCurrentId.current = parseInt(e.target.id)
	}
	/* if (loading) {
		return <Spinner />
	} else {
		if (data.length > 0) {
		} */

	if (wks && refInit.current && wks.length > 0) {
		refIds.current = wks
		refWksArray.current = new Array(refIds.length)
		refInit.current = false
	}

	if (open && wks.length > 0 && data.raw_values) {
		console.log(data)
		const dataArray = Object.values(data.raw_values)
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
										data={dataArray}
									/>
								)
							})}
							{data.ws_id === refCurrentId.current}
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
	} else {
		return (
			<Content>
				<h1 className='h3 mb-4 text-gray-800 my-4'>Label Content</h1>
				<Spinner />
			</Content>
		)
	}
}

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
