import React, { Fragment, useContext, useRef } from 'react'
import ModelContext from '../../context/model/modelContext'
import { Spinner } from '../layout/Spinner'

export const ModelContent = () => {
	const modelContext = useContext(ModelContext)

	const { data, wks, loading } = modelContext
	// const loadingRef = useRef(true)

	// if (loading && loadingRef.current) {
	// 	console.log('loading:', loading)
	// 	loadingRef.current = false
	// 	return <Spinner />
	// } else if (!loadingRef.current) {
	return (
		<Fragment>
			<div id='content'>
				<div className='container-fluid'>
					<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
						<h1 className='h3 mb-0 text-gray-800'>Model Content</h1>
						<div className='custom-control custom-switch'>
							<input
								type='checkbox'
								className='custom-control-input'
								id='customSwitch1'
							/>
							<label className='custom-control-label' htmlFor='customSwitch1'>
								Toggle this switch element
							</label>
						</div>
					</div>
					<h3 className='h4 mb-4 text-gray-200 my-4'>{wks}</h3>
					<h3 className='h4 mb-4 text-gray-200 my-4'>{data}</h3>
				</div>
			</div>
		</Fragment>
	)
	// }
}
