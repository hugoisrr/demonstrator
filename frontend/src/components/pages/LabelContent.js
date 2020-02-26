import React, { Fragment, useContext } from 'react'
import LabelContext from '../../context/label/labelContext'
import { Spinner } from '../layout/Spinner'

export const LabelContent = () => {
	const labelContext = useContext(LabelContext)

	const { data, wks, loading } = labelContext

	if (loading) {
		return <Spinner />
	} else {
		if (data.length > 0) {
			// console.log('data:', data)
		}
		return (
			<Fragment>
				<div id='content'>
					<div className='container-fluid'>
						<h1 className='h3 mb-4 text-gray-800 my-4'>Label Content</h1>
						<h3 className='h4 mb-4 text-gray-200 my-4'>{wks}</h3>
						<h3 className='h4 mb-4 text-gray-200 my-4'>{data}</h3>
					</div>
				</div>
			</Fragment>
		)
	}
}
