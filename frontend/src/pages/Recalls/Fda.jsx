import { useState } from "react"
import FdaListView from "../../components/FdaListView"
import FdaChartView from "../../components/FdaChartView"

function Fda() {
  const [view, setView] = useState({
    list: true, chart: false
  })

  const { list, chart } = view
  const chartView = () => {
    setView(prevState => ({
      ...prevState, list: false, chart: true
    }))
  }
  const listView = () => {
    setView({list: true, chart: false})
  }

  return (
    <>
      <div className='view'>
      <div onClick={listView}  className={`list-view ${list ? 'view-active' : ''}`}>List View</div>
        <div onClick={chartView} className={`chart-view ${chart ? 'view-active' : ''}`}>Chart View</div>
      </div>
      {list && <FdaListView />}
      {chart && <FdaChartView />}
    </>
  )
}

export default Fda