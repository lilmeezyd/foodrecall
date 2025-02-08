import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecall } from '../RecallContext'

function Home() {
  const { fsis: recalls, errorFsis } = useRecall()

  const filteredRecalls = useMemo(() => {
    const sortRecall = (x,y) => {
      if(new Date(x.field_recall_date)>new Date(y.field_recall_date)) return -1
      if(new Date(x.field_recall_date)<new Date(y.field_recall_date)) return 1
  }
  return recalls.sort(sortRecall).slice(0,3)
  }, [recalls])
  return (
    <>
    <div className="home-image">
      <h1 className='home-image-heading'>Food Recall Tool</h1>
      <span className='home-image-sub'>Keep up to date with all food recalls</span>
    </div>
    {recalls.length > 0  && (<div className="latest-recalls">
    {filteredRecalls.map((recall, idx) => (
      <Link data-testid="recall" to={`/recalls/usda/${recall.field_recall_number}`} key={idx} className="recall-list">
        <div className='home-field-title'>{recall.field_title}</div>
        <div className='recall-date'><span>Date:</span>&nbsp; {recall.field_recall_date}</div>
      </Link>
    ))}
    </div>)}
    {recalls.length === 0 && errorFsis === '' && <div className='spinner'></div>}
    {errorFsis === 'Network Error' && <div>Check your internet connection!</div>}
    </>
  )
}

export default Home