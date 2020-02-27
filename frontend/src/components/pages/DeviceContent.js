import React, { Fragment, useContext, useRef, useState } from 'react'
import DeviceContext from '../../context/device/deviceContext'
import { Spinner } from '../layout/Spinner'
import DeviceGraphs from '../DeviceGraphs'

export const DeviceContent = () => {
	const deviceContext = useContext(DeviceContext)
	const [ids, setIds] = useState()
	const { data, loading, wks } = deviceContext
	const refInit = useRef(true)
	const refCurrentId = useRef(0)
	const refIds = useRef(['test'])
	const refWksArray = useRef([])
	const initialValue = { ids: [10, 11, 12] }

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
	const dataArray = Object.values(data.raw_values)

	return (
		<Fragment>
			<div id='content'>
				<div className='container-fluid'>
					<h1 className='h3 mb-4 text-gray-800 my-4'>Device Content</h1>
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
					<h3 className='h4 mb-4 text-gray-200 my-4'></h3>
				</div>
			</div>
		</Fragment>
	)
}
