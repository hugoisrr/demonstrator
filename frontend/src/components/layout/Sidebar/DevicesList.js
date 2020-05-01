import React, { useContext, Fragment } from 'react'
import SidebarContext from '../../../context/sidebar/sidebarContext'

const DevicesList = () => {
	const sidebarContext = useContext(SidebarContext)
	const { wksIdsMap } = sidebarContext

	if (wksIdsMap.size > 0) {
		return (
			<Fragment>
				<div className='container'>
					<table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Model</th>
								<th>Signal</th>
								<th>Labeler</th>
							</tr>
						</thead>
						<tbody>
							{[...wksIdsMap.keys()].map(workstationId => {
								return (
									<tr key={workstationId}>
										<td>{workstationId}</td>
										<td>
											<DeviceCircle color='red' />
										</td>
										<td>
											<DeviceCircle color='red' />
										</td>
										<td>
											<DeviceCircle color='green' />
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</Fragment>
		)
	} else {
		return (
			<Fragment>
				<div className='container'>No workstations</div>
			</Fragment>
		)
	}
}

const DeviceCircle = ({ color }) => {
	return (
		<svg height='30' width='30'>
			<circle
				cx='15'
				cy='15'
				r='10'
				stroke='black'
				strokeWidth='2'
				fill={color}
			/>
		</svg>
	)
}

export default React.memo(DevicesList)
