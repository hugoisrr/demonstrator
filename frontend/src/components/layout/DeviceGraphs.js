// {ws_id: 0, raw_data: {…}, raw_values: Array(18)}
// raw_data: {0: "acc_x", 1: "acc_y", 2: "acc_z", 3: "gyr_x", 4: "gyr_y", 5: "gyr_z", 6: "mag_x", 7: "mag_y", 8: "mag_z", 9: "kar_x", 10: "kar_y", 11: "kar_z"}
// {0: 2.4421318778891163, 1: 0.2931697805019616, 2: 0.20630586837368384, 3: -0.12440716124301016, 4: 0.8655985290535382, 5: 0.3632311981698787, 6: 1.072288104565193, 7: -2.5372073685006247, 8: 1.5711346786359015, 9: -0.33572328360283116, 10: 0.056482779767345864, 11: 2.331169171489822}
import React, { Fragment } from 'react'
import { VictoryBar, VictoryChart } from 'victory'

export const DeviceGraphs = ({ currentDevice }) => {
	// console.log('currentDevice:', currentDevice)
	const data = [
		{ quarter: 1, earnings: 13000 },
		{ quarter: 2, earnings: 16500 },
		{ quarter: 3, earnings: 14250 },
		{ quarter: 4, earnings: 19000 },
	]
	return (
		<Fragment>
			<VictoryChart>
				<VictoryBar data={data} x={'quarter'} y={'earnings'} />
			</VictoryChart>
		</Fragment>
	)
}
