/**
 * Model Websocket
 * Description - Implementation of Websocket through API methods, the file imports
 * methods from the Context, to set the status of the Websocket, to get the Workstations,
 * set the dictionary data structure and new incoming data from the websocket.
 * The file also export the client so the frontend would have control over the Websocket.
 */

import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import LabelerContext from '../../context/labeler/labelerContext'

//const client = new W3CWebSocket('ws://172.21.30.241:3000')
export const client = new W3CWebSocket('ws://localhost:3000')

const LabelerWebsocket = () => {
	const labelerContext = useContext(LabelerContext)
	const {
		setUpLabelerMap,
		setDataInLabelerMap,
		setLabelerStatesColors,
		getLabelerWebsocketStatus,
		setUpLabelerFlexValues,
		getLabelerWks,
	} = labelerContext

	client.onerror = () => {
		try {
			console.error('Connection Error with WebSocket Labeler')
			getLabelerWebsocketStatus('ERROR')
		} catch (error) {
			console.error(error)
		}
	}

	client.onopen = () => {
		try {
			console.log('WebSocket Labeler Client Connected')
			getLabelerWebsocketStatus('CONNECTING')
		} catch (error) {
			console.error(error)
		}
	}

	client.onmessage = message => {
		try {
			message = JSON.parse(message.data)
			if (Array.isArray(message) && message.length > 0) {
				// Gets the initial array of workstations
				getLabelerWks(message)
				setUpLabelerMap(message)
				setLabelerStatesColors(message)
				setUpLabelerFlexValues(message)
			} else if (typeof message === 'object') {
				// Starts the dictionary structure and the data from the websocket
				setDataInLabelerMap(message)
				getLabelerWebsocketStatus('OPEN')
			}
		} catch (error) {
			console.error(error)
		}
	}

	client.onclose = () => {
		try {
			console.log('WebSocket Labeler Client Closed')
			getLabelerWebsocketStatus('CLOSED')
		} catch (error) {
			console.error(error)
		}
	}

	return null


}

export default LabelerWebsocket
