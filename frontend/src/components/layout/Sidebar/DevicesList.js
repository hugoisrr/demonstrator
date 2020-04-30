import React, {useContext, Fragment} from 'react'
import DeviceContext from '../../../context/device/deviceContext'
import LabelerContext from '../../../context/labeler/labelerContext'
import ModelContext from '../../../context/model/modelContext'

const DevicesList = () => {
    const deviceContext = useContext(DeviceContext)
	const labelerContext = useContext(LabelerContext)
	const modelContext = useContext(ModelContext)

	const deviceWks = deviceContext.wks
	const labelerWks = labelerContext.wks
	const modelWks = modelContext.wks
    return (
        <Fragment>
            <div className="container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Labeler</th>
                            <th>Signal</th>
                            <th>Model</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td> <svg height="30" width="30">
              <circle
                cx="15"
                cy="15"
                r="10"
                stroke="black"
                strokeWidth="2"
                fill="green"
              />
            </svg>
</td>
                            <td> <svg height="30" width="30">
              <circle
                cx="15"
                cy="15"
                r="10"
                stroke="black"
                strokeWidth="2"
                fill="green"
              />
            </svg>
</td>
                            <td>G</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>R</td>
                            <td>R</td>
                            <td>G</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default DevicesList
