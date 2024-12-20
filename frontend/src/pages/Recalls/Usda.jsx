import { useState } from "react"
import UsdaListView from "../../components/UsdaListView"
import UsdaChartView from "../../components/UsdaChartView"


function Usda() {
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
      {list && <UsdaListView />}
      {chart && <UsdaChartView />}
    </>
  )
}
export default Usda