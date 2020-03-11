//Graphic component for each of the graphs needed for the device API
import React from 'react'
import DeviceGraphWks from './DeviceGraphWks'
import DeviceGraphWksV from './DeviceGraphWksV'

export default function DeviceGraphs(props) {
	if (!props.show) {
		return null
	}

	return (
		<div className='container-fluid'>
			<div className='row'>
				{Object.values(props.keyNames).map((item, i) => {
					return (
						<div key={i} className='col-4'>
							<DeviceGraphWks
								legendName={item}
								points={props.data.map(value => {
									return value === 0 ? value : value[i]
								})}
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}

/* export default pure(DeviceGraphs)
 */
