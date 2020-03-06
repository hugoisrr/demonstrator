//Graphic component for each of the graphs needed for the device API
import React from 'react'
import { Spinner } from './Spinner'
import DeviceGraphWks from './DeviceGraphWks'

export default function DeviceGraphs(props) {
	if (!props.show) {
		return null
	}

	if (props.data.length > 0) {
		return (
			<div className='container-fluid'>
				<div className='row'>
					{Object.values(props.keyNames).map((item, i) => {
						return (
							<div key={i} className='col-4'>
								<DeviceGraphWks
									legendName={item}
									points={props.data.map((value, index) => {
										if (value === 0) {
											return value
										} else {
											return value[i]
										}
									})}
								/>
							</div>
						)
					})}
				</div>
			</div>
		)
	} else {
		return <Spinner />
	}
}
