/* eslint-disable react-hooks/exhaustive-deps */
// {ws_id: 0, raw_data: {…}, raw_values: Array(18)}
// raw_data: ["acc_x", "acc_y", "acc_z", "gyr_x", "gyr_y", "gyr_…]
// {0: 2.4421318778891163, 1: 0.2931697805019616, 2: 0.20630586837368384, 3: -0.12440716124301016, 4: 0.8655985290535382, 5: 0.3632311981698787, 6: 1.072288104565193, 7: -2.5372073685006247, 8: 1.5711346786359015, 9: -0.33572328360283116, 10: 0.056482779767345864, 11: 2.331169171489822}
import React, { Fragment } from 'react'
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory'
import { DeviceGraph } from './DeviceGraph'

const DeviceCard = ({ currentDevice: { raw_data, raw_values } }) => {
	/* console.log('raw_values:', raw_values) */
	const data = [
		{ quarter: 1, earnings: 13000 },
		{ quarter: 2, earnings: 16500 },
		{ quarter: 3, earnings: 14250 },
		{ quarter: 4, earnings: 19000 },
	]

	return (
		<Fragment>
			{raw_data.map((sensorName, sensorId) => {
				const sensorValues = raw_values.map(values => Object.values(values))
				console.log('sensorValues:', sensorValues)
				return (
					<div className='col-xl-3 col-md-6' key={sensorId}>
						<div className='card shadow mb-4'>
							<div className='card-header py-3 d-flex flex-row align-items-center'>
								<h6 className='m-0 font-weight-bold text-light'>
									{sensorName}
								</h6>
							</div>
							<div className='card-body'>
								<div className='pt-4 pb-2'>
									{/* <VictoryChart theme={VictoryTheme.material}> */}
									<DeviceGraph values={raw_values} sensor={sensorId} />
										{/* {<VictoryBar data={data} x={'quarter'} y}={'earnings'} /> */}
									{/* </VictoryChart> */}
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
