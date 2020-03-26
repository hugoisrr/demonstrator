import React, { Fragment } from 'react'
import { DeviceGraph } from './DeviceGraph'

const DeviceCard = ({ currentDevice: { raw_data } }) => {
	return (
		<Fragment>
			{raw_data.map((sensorName, sensorId) => {
				return (
					<div className='col-xl-4 col-md-6' key={sensorId}>
						<div className='card shadow mb-4'>
							<div className='card-header py-3 d-flex flex-row align-items-center'>
								<h6 className='m-0 font-weight-bold text-light'>
									{sensorName}
								</h6>
							</div>
							<div className='card-body'>
								<div className='pt-4 pb-2'>
									<DeviceGraph sensorId={sensorId} />
								</div>
							</div>
						</div>
					</div>
				)
			})}
		</Fragment>
	)
}

export default React.memo(DeviceCard)
