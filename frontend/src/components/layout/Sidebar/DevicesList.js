/**
 * DevicesList
 * Description - By calling the Map datastructure that holds the signal values from
 * each websocket, through the SidebarContext. We verify first if we received the
 * and id values through the keys of the Map datastrucure, then for each workstation
 * we pass to the component SignalList an array with the signal values corresponded
 * to the workstation id's.
 */

import React, { useContext, Fragment } from 'react'
import SidebarContext from '../../../context/sidebar/sidebarContext'
import SignalList from './SignalList'

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
								let signalArray = []
								for (const [wks_id, signalValues] of wksIdsMap.entries()) {
									if (workstationId === parseInt(wks_id)) {
										signalArray = signalValues
									}
								}
								return (
									<tr key={workstationId}>
										<td>{workstationId}</td>
										<SignalList signalArray={signalArray} />
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

export default DevicesList
