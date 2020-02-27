import React, { Fragment, useContext } from 'react'
import LabelContext from '../../context/label/labelContext'
import { Spinner } from '../layout/Spinner'

export const LabelContent = () => {
	const labelContext = useContext(LabelContext)

	const { data, wks } = labelContext

	return (
		<Fragment>
			<div id='content'>
				<div className='container-fluid'>
					<h1 className='h3 mb-4 text-gray-800 my-4'>Label Content</h1>
				</div>
			</div>
		</Fragment>
	)
}
