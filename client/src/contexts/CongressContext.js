import React, { useContext, createContext, useState, useEffect } from 'react'
import axios from 'axios'

const CongressContext = createContext({
    senators: [],
    reps: [],
})

export const CongressContextProvider = (props) => {
    const [senators, setSenators] = useState([])
    const [reps, setReps] = useState([])

    useEffect(() => {
        // fetch data and set the state with it
        const fetchMembers = async (side) => {
            try {
              const response = await axios.get(
                `https://api.propublica.org/congress/v1/116/${side}/members.json`,
                {
                  headers: { 'x-api-key': process.env.REACT_APP_PROPUBLICA_API_KEY },
                },
              )
              const members = await response.data.results[0].members
/*               const membersWithCommittees = members.map((member) => {
                const committeeList = fetchCommitteeList(member.api_uri)
                return (member = { ...member, committeeList })
              }) */
              if (side === 'senate') setSenators(members)
              if (side === 'house') setReps(members)
            } catch (error) {
              console.log(error)
            }
        }
        fetchMembers('senate')
        fetchMembers('house')
    }, [])

    return (
        <CongressContext.Provider value={
            {senators, reps}
        }>
            {props.children}
        </CongressContext.Provider>
    )
}

export const useCongressContext = () => useContext(CongressContext)