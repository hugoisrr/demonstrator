/**
 * Model Websocket
 * Description - Implementation of Websocket through API methods, the file imports
 * methods from the Context, to set the status of the Websocket, to get the Workstations,
 * set the dictionary data structure and new incoming data from the websocket.
 * The file also export the client so the frontend would have control over the Websocket.
 */

import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import ModelContext from '../../context/model/modelContext'
import SidebarContext from '../../context/sidebar/sidebarContext'

//export const client = new W3CWebSocket('ws://172.21.30.241:4000')
export const client = new W3CWebSocket('ws://localhost:4000')

const ModelWebsocket = () => {
	const modelContext = useContext(ModelContext)
	const sidebarContext = useContext(SidebarContext)

	const {
		setUpModelMap,
		setDataInModelMap,
		setModelStatesColors,
		getModelWebsocketStatus,
		setUpModelFlexValues,
		getModelWks,
	} = modelContext

	const { getWksIds, setDataInWksIdsMap } = sidebarContext

	client.onerror = () => {
		try {
			console.error('Connection Error with WebSocket Model')
			getModelWebsocketStatus('ERROR')
		} catch (error) {
			console.error(error)
		}
	}

	client.onopen = () => {
		try {
			console.log('WebSocket Model Client Connected')
			getModelWebsocketStatus('CONNECTING')
		} catch (error) {
			console.error(error)
		}
	}

	client.onmessage = message => {
		try {
			message = JSON.parse(message.data)
			if (Array.isArray(message) && message.length > 0) {
				// Gets the initial array of workstations
				getModelWks(message)
				setUpModelMap(message)
				setModelStatesColors(message)
				setUpModelFlexValues(message)
				getWksIds(message)
			} else if (typeof message === 'object') {
				// Starts the dictionary structure and the data from the websocket
				setDataInModelMap(message)
				setDataInWksIdsMap(message, 'model')
				getModelWebsocketStatus('OPEN')
			}
		} catch (error) {
			console.error(error)
		}
	}

	client.onclose = () => {
		try {
			console.warn('WebSocket Model Client Closed')
			getModelWebsocketStatus('CLOSED')
		} catch (error) {
			console.error(error)
		}
	}

	return null
}

export default ModelWebsocket
