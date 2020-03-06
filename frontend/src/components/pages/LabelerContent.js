import React, { Fragment, useContext } from 'react'
import LabelerContext from '../../context/labeler/labelerContext'
import WebsocketContext from '../../context/websocket/websocketContext'
import { Spinner } from '../layout/Spinner'

export const LabelerContent = () => {
	const labelContext = useContext(LabelerContext)
	const websocketContext = useContext(WebsocketContext)

	const { data, wks } = labelContext

	const { labelerWebsocket } = websocketContext

	const { open } = labelerWebsocket

	if (open && wks.length > 0) {
		return (
			<Content>
				<h1 className='h3 mb-4 text-gray-800 my-4'>Labeler Content</h1>
				<h2>{data.ws_id}</h2>
			</Content>
		)
	} else {
		return (
			<Content>
				<h1 className='h3 mb-4 text-gray-800 my-4'>Labeler Content</h1>
				<Spinner />
			</Content>
		)
	}
}

const Content = props => {
	return (
		<Fragment>
			<div id='content'>
				<div className='container-fluid'>{props.children}</div>
			</div>
		</Fragment>
	)
}
