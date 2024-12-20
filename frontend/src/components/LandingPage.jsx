import { useEffect } from 'react'
import axios from 'axios'

function LandingPage() {

    useEffect(() => {


const requestTeams = async () => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:5000',
        headers: { }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
}

requestTeams()

    }, [])
    
  return (
    <div>LandingPage</div>
  )
}

export default LandingPage