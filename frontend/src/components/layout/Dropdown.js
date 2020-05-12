//Graphic component for the signal view which enable to switch between workstation view

import React, { Fragment, useContext, useState } from 'react'
import DeviceContext from '../../context/device/deviceContext'

export const Dropdown = () => {
	const deviceContext = useContext(DeviceContext)
	const { wks, setCurrentDevice } = deviceContext
	const [currentDeviceName, setCurrentDeviceName] = useState('Device')

	const handleChoosenDevice = ({ target }) => {
		setCurrentDevice(parseInt(target.id))
		setCurrentDeviceName(target.name)
	}

	return (
		<Fragment>
			<div className='dropdown'>
				<button
					className='btn btn-info dropdown-toggle btn-sm'
					type='button'
					id='dropdownMenuDevice'
					data-toggle='dropdown'
					aria-haspopup='true'
					aria-expanded='false'
				>
					{currentDeviceName}
				</button>
				<div
					className='dropdown-menu animated--fade-in'
					aria-labelledby='dropdownMenuDevice'
				>
					{wks.map((workstation, index) => {
						return (
							<button
								className='dropdown-item'
								name={workstation.ws_name}
								id={workstation.ws_id}
								type='button'
								key={index}
								onClick={handleChoosenDevice}
							>
								{workstation.ws_name}
							</button>
						)
					})}
				</div>
			</div>
		</Fragment>
	)
}
