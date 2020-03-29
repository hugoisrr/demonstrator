/**
 * ProgressBar
 * Description - One big useEffect() runs for every data received.
 * To calculate the porcentage a Map data structure is created, which is called
 * counterStates, first it's initialize with the states's ids and with an empty array,
 * then for each data received verifies the id the state received with the state id of the
 * counterStates Map object, if both are equal then it's been push to the array.
 * Then it calculates the total of all entries, of all the states. After that we calculate
 * the percentage of each state, after getting the percentage, we had to converte the value into
 * decimal values, example: 20% -> 0.2, 55% -> 0.5. Because JSX doesn't accept percentage values to
 * render the ProgressBar. The file receives as a prop the statesColors, which is an array. To render
 * the proper color it verifies the array's index and the state's id.
 */

import React, { useContext } from 'react'
import LabelerContext from '../../../context/labeler/labelerContext'
import ModelContext from '../../../context/model/modelContext'
import { calculateFlexValues } from '../../../assets/libs/helperFunctions'
import { ProgressBarView } from './ProgressBarView'

const ProgressBar = ({ wsId, states, data, statesColors, isLabeler }) => {
	const labelerContext = useContext(LabelerContext)
	const modelContext = useContext(ModelContext)
	const { setLabelerFlexValues, labelerFlexValues } = labelerContext
	const { setModelFlexValues, modelFlexValues } = modelContext

	const values = calculateFlexValues(states, data)

	if (isLabeler) {
		setLabelerFlexValues(wsId, values)

		if (labelerFlexValues.size > 0) {
			return (
				<ProgressBarView
					arrayValues={labelerFlexValues}
					wsId={wsId}
					statesColors={statesColors}
				/>
			)
		} else {
			return null
		}
	} else {
		setModelFlexValues(wsId, values)

		if (modelFlexValues.size > 0) {
			return (
				<ProgressBarView
					arrayValues={modelFlexValues}
					wsId={wsId}
					statesColors={statesColors}
				/>
			)
		} else {
			return null
		}
	}
}

export default ProgressBar
