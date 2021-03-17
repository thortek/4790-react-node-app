import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SenateCommittees = (props) => {
    const memberURL = props.url
    const [committeeList, setCommitteeList] = useState('')

    useEffect(() => {
        const fetchCommitteeList = async () => {
            try {
                const response = await axios.get(memberURL, {
                    headers: { 'x-api-key': process.env.REACT_APP_PROPUBLICA_API_KEY }
                })
                const comList = response.data.results[0].roles[0].committees
                const comNames = comList.map((committee) => committee.name)
                setCommitteeList(comNames.join('\n'))
            } catch (error) {
                console.log(error)
            }
        }
        fetchCommitteeList()
    }, [memberURL])

    return <div>{committeeList}</div>
}

export default SenateCommittees