import React, { Fragment, useContext } from 'react'
import LabelContext from '../../context/label/labelContext'
import WebsocketContext from '../../context/websocket/websocketContext'
import { Spinner } from '../layout/Spinner'

export const LabelContent = () => {
	const labelContext = useContext(LabelContext)
	const websocketContext = useContext(WebsocketContext)

	const { data, wks } = labelContext

	const { labelerWebsocket } = websocketContext

	const { open } = labelerWebsocket

	if (open && wks.length > 0) {
		console.log(data)
		return (
			<Content>
				<h1 className='h3 mb-4 text-gray-800 my-4'>Label Content</h1>
				<h2>{data.ws_id}</h2>
			</Content>
		)
	} else {
		return (
			<Content>
				<h1 className='h3 mb-4 text-gray-800 my-4'>Label Content</h1>
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
