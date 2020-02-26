import React, { Fragment, useContext, useRef, useState } from 'react'
import DeviceContext from '../../context/device/deviceContext'
import { Spinner } from '../layout/Spinner'

export const DeviceContent = () => {
	const deviceContext = useContext(DeviceContext)
	const [ids, setIds] = useState()
	const { data, loading, wks } = deviceContext
	const ref = useRef(true)
	const initialValue = { ids: [10, 11, 12] }
	/* if (loading) {
		return <Spinner />
	} else {
		if (data.length > 0) {
		} */

	if (wks && ref.current && wks.length > 0) {
		setIds(wks)
		console.log('test')
		ref.current = false
	}
	return (
		<Fragment>
			<div id='content'>
				<div className='container-fluid'>
					<h1 className='h3 mb-4 text-gray-800 my-4'>Device Content</h1>
					<div className='row'>
						<div className='col'>
							<h3 className='h4 mb-4 text-gray-200 my-4'>{ids}</h3>
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
									{initialValue.ids.map((item, i) => {
										return (
											<button className='dropdown-item' type='button' key={i}>
												{item}
											</button>
										)
									})}
								</div>
							</div>
						</div>
					</div>
					<h3 className='h4 mb-4 text-gray-200 my-4'>{data}</h3>
				</div>
			</div>
		</Fragment>
	)
	/* }*/
}
