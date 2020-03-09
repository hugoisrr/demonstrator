/* eslint-disable array-callback-return */
import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import ModelContext from '../../context/model/modelContext'

//export const client = new W3CWebSocket('ws://172.21.30.241:4000')
export const client = new W3CWebSocket('ws://localhost:4000')

const ModelWebsocket = () => {
	const modelContext = useContext(ModelContext)
	const { getModelData, getModelWks } = modelContext

	client.onerror = () => {
		console.error('Connection Error with WebSocket Model')
	}

	client.onopen = () => {
		console.log('WebSocket Model Client Connected')
	}

	client.onmessage = message => {
		message = JSON.parse(message.data)
		let idWks = []
		const workstationsMap = new Map()
		// workstationsMap.set('ages', [2, 4, 5, 11, 65])
		if (Array.isArray(message) && message.length > 0) {
			idWks = message.map(workstation => Object.values(workstation)[0])
			// console.log(idWks)
			// console.table(message)
			getModelWks(message)
		} else {
			idWks.forEach(workstationID => {
				workstationsMap.set(workstationID, Array(60).fill(-1))
			})
			console.log('workstationsMap:', workstationsMap)
			getModelData(message)
		}
		// } else if (typeof message === 'object') {
		// 	// console.log('message:', message)
		// 	getModelData(message)
		// }
	}

	client.onclose = () => {
		console.log('WebSocket Model Client Closed')
	}

	return null
}

export default ModelWebsocket
